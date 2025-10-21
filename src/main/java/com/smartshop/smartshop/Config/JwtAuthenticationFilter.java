package com.smartshop.smartshop.Config;

import com.smartshop.smartshop.Models.Token;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.TokenRepository;
import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Services.JwtService;
import com.smartshop.smartshop.Services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kong.unirest.core.Cookies;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.convert.ConversionService;
import org.springframework.http.HttpHeaders;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Log4j2
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final ConversionService conversionService;
    private final UserService userService;

    private String extractJwtFromCookies(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("access_token".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private void resetCookie(@NonNull HttpServletResponse response,@NonNull HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            Cookie deleteCookie = new Cookie(cookie.getName(), "");
            deleteCookie.setMaxAge(0); // Expira inmediatamente
            deleteCookie.setPath("/"); // Asegúrate de que coincida con el path usado para setearla
            deleteCookie.setHttpOnly(cookie.isHttpOnly());
            deleteCookie.setSecure(cookie.getSecure());
            response.addCookie(deleteCookie);
        }
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        String path = request.getRequestURI();

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);  // Skip processing for OPTIONS
            return;
        }

        if (path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs") || path.equals("/swagger-ui.html") || path.equals("/v2/api-docs")) {
            logger.info("Swagger paths");
            filterChain.doFilter(request, response);
            return;
        }
        if(request.getRequestURI().startsWith("/admin/login")){
            filterChain.doFilter(request, response);
            return;
        }

        if(path.startsWith("/rest/api/1/promotions") && request.getMethod().equals("GET")){
            filterChain.doFilter(request, response);
            return;
        }

        if(!request.getServletPath().startsWith("/rest/api/1") && !request.getServletPath().startsWith("/admin")) {
            logger.info(request.getRequestURI());
            filterChain.doFilter(request, response);
            logger.info("Skipping jwt authentication");
            return;
        }



        if (request.getServletPath().contains("/auth/")) {
            logger.info("JWT Authentication Filter for authentication");
            filterChain.doFilter(request, response);
            return;
        }

        if(List.of("/rest/api/1/producto/all", "/rest/api/1/producto/top", "/rest/api/1/producto/categorias", "/rest/api/1/vendor/all", "/rest/api/1/producto/", "/rest/api/1/producto")
                .stream()
                .anyMatch(uri -> request.getServletPath().startsWith(uri))
                &&
                request.getMethod().equals("GET")) {
            filterChain.doFilter(request, response);
            return;
        }
        String jwt = null;

        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        log.info("Header " + authHeader);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.split(" ")[1];
        }

        if(jwt == null){
            jwt = extractJwtFromCookies(request);
        }

        if(jwt == null) {
            logger.info("Invalid JWT token");

            if(path.startsWith("/admin")){
                response.sendRedirect(request.getContextPath() + "/admin/login");
                return;
            }
            filterChain.doFilter(request, response);
            return;
        }
        try{
            final String userEmail = jwtService.extractUsername(jwt);
            logger.info("JWT token: " + jwt);
            logger.info("User: " + userEmail);
            final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (userEmail == null || authentication != null) {
                filterChain.doFilter(request, response);
                return;
            }

            final UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            final boolean isTokenExpiredOrRevoked = tokenRepository.findByToken(jwt)
                    .map(token -> (token.isExpired() || token.isRevoked()))
                    .orElse(false);
            Token token = tokenRepository.findByToken(jwt).orElse(null);
            logger.info("isTokenExpiredOrRevoked: " + isTokenExpiredOrRevoked);
            logger.info("Token: " + jwt);
            logger.info("Is revoked " + token.isRevoked());
            logger.info("Is expired " + token.isExpired());

            if(isTokenExpiredOrRevoked && path.startsWith("/admin")) {
                resetCookie(response, request);
                filterChain.doFilter(request, response);
                return;
            } else if (!isTokenExpiredOrRevoked && path.startsWith("/admin/")) {
                String username = userDetails.getUsername();
                Usuario usuario = userService.getUserByEmail(username);
                logger.info("User: " + usuario.getRoles().toString());
                logger.info(usuario.getRoles().stream().filter(role -> role.getName().equals("ROLE_ADMIN")).count());
                if(usuario.getRoles().stream().noneMatch(role -> role.getName().equals("ROLE_ADMIN"))) {
                    resetCookie(response, request);
                    filterChain.doFilter(request, response);
                    return;
                }
            }

            if (!isTokenExpiredOrRevoked) {
                final Optional<Usuario> user = userRepository.findByEmail(userEmail);
                logger.info("User: " + user.get().getId());
                final boolean isTokenValid = jwtService.isTokenValid(jwt, user.get());
                logger.info("isTokenValid: " + isTokenValid);
                if (isTokenValid) {
                    logger.info("Passed authentication");
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    logger.info("Successfully authenticated user");
                }
            }
            filterChain.doFilter(request, response);
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
            response.setStatus(403);
            filterChain.doFilter(request, response);
        }

    }
}
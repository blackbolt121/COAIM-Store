package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Token;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.TokenRepository;
import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Services.AuthService;
import com.smartshop.smartshop.Services.JwtService;
import com.smartshop.smartshop.Services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.logging.Logger;
import com.smartshop.smartshop.DTO.UsuarioDTO;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

public class AuthController {

    private final AuthService service;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthService authService;
    @Autowired
    private UserService userService;
    @Autowired
    private TokenRepository tokenRepository;

    @Value("${app.auth.cookie-secure:true}")
    private boolean cookieSecure;

    private static final String ACCESS_COOKIE = "access_token";
    private static final String REFRESH_COOKIE = "refresh_token";
    private static final String CSRF_COOKIE = "csrf_token";

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@RequestBody RegisterRequest request, HttpServletResponse servletResponse) {

        if(userRepository.findByEmail(request.email()).isPresent()){
            return ResponseEntity.badRequest().build();
        }
        final TokenResponse tokenResponse = service.register(request);
        issueSessionCookies(servletResponse, tokenResponse.accessToken(), tokenResponse.refreshToken());
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> authenticate(@RequestBody AuthRequest request, HttpServletResponse servletResponse) {
        Logger.getGlobal().info(request.email());
        Logger.getGlobal().info(request.password());
        final TokenResponse tokenResponse = service.authenticate(request);
        if (tokenResponse == null) {
            return ResponseEntity.badRequest().build();
        }
        issueSessionCookies(servletResponse, tokenResponse.accessToken(), tokenResponse.refreshToken());
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/myself")
    public ResponseEntity<UsuarioDTO> myself(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) final String authentication, HttpServletRequest request){
        final String token = resolveAccessToken(authentication, request);
        log.info("Auth token: " + authentication);
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Token token1 = tokenRepository.findByToken(token).orElse(null);
        if(token1 == null){
            return ResponseEntity.badRequest().build();
        }
        Usuario usuario = token1.getUsuario();

        UsuarioDTO usuarioDTO = UsuarioDTO.fromEntity(usuario);

        return ResponseEntity.ok(usuarioDTO);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<TokenResponse> refreshToken(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) final String authentication,
            HttpServletRequest request,
            HttpServletResponse servletResponse
    ) {
        final String refreshToken = resolveRefreshToken(authentication, request);
        final TokenResponse tokenResponse = service.refreshToken(refreshToken);
        if (tokenResponse == null) {
            return ResponseEntity.badRequest().build();
        }
        issueSessionCookies(servletResponse, tokenResponse.accessToken(), tokenResponse.refreshToken());
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) final String authentication, HttpServletRequest request) {
        final String token = resolveAccessToken(authentication, request);
        log.info("Auth token: " + authentication);
        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        log.info(token);
        Boolean validation = authService.validateToken(token);
        log.info(validation.toString());
        return (validation)? ResponseEntity.ok(token) : ResponseEntity.badRequest().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) final String authentication,
            HttpServletRequest request,
            HttpServletResponse servletResponse
    ) {
        final String token = resolveAccessToken(authentication, request);
        log.info("Auth token: " + authentication);
        if (token == null || token.isEmpty()) {
            clearSessionCookies(servletResponse);
            return ResponseEntity.badRequest().build();
        }
        log.info(token);
        String username = jwtService.extractUsername(token);
        if (username == null || username.isBlank()) {
            clearSessionCookies(servletResponse);
            return ResponseEntity.badRequest().build();
        }
        Usuario user = userService.getUsuario(username).orElseThrow();
        jwtService.revokeToken(token, user);
        clearSessionCookies(servletResponse);
        return ResponseEntity.ok("");
    }

    private String resolveAccessToken(String authentication, HttpServletRequest request) {
        if (authentication != null && authentication.startsWith("Bearer ")) {
            return authentication.substring(7);
        }
        return extractCookie(request, ACCESS_COOKIE);
    }

    private String resolveRefreshToken(String authentication, HttpServletRequest request) {
        if (authentication != null && authentication.startsWith("Bearer ")) {
            return authentication.substring(7);
        }
        return extractCookie(request, REFRESH_COOKIE);
    }

    private String extractCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        for (Cookie cookie : cookies) {
            if (cookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private void issueSessionCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        final String sameSite = cookieSecure ? "None" : "Lax";

        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from(ACCESS_COOKIE, accessToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .build()
                .toString());

        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from(REFRESH_COOKIE, refreshToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .build()
                .toString());

        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from(CSRF_COOKIE, java.util.UUID.randomUUID().toString())
                .httpOnly(false)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .build()
                .toString());
    }

    private void clearSessionCookies(HttpServletResponse response) {
        final String sameSite = cookieSecure ? "None" : "Lax";

        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from(ACCESS_COOKIE, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ZERO)
                .build()
                .toString());

        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from(REFRESH_COOKIE, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ZERO)
                .build()
                .toString());

        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from(CSRF_COOKIE, "")
                .httpOnly(false)
                .secure(cookieSecure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(Duration.ZERO)
                .build()
                .toString());
    }




}

package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Controllers.AuthRequest;
import com.smartshop.smartshop.Controllers.RegisterRequest;
import com.smartshop.smartshop.Controllers.TokenResponse;
import com.smartshop.smartshop.Models.Token;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.TokenRepository;
import com.smartshop.smartshop.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.logging.Logger;

@Slf4j
@Service
@RequiredArgsConstructor

public class AuthService {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    public TokenResponse register(RegisterRequest request){
        Usuario user = Usuario
                .builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .telefono(request.telefono())
                .calle(request.calle())
                .codigoPostal(request.codigoPostal())
                .ciudad(request.ciudad())
                .pais(request.pais())
                .activo(true)
                .estado(request.estado())
                .build();
        Usuario savedUser = userRepository.save(user);
        String accessToken = jwtService.generateToken(savedUser);
        String refreshToken = jwtService.refreshToken(savedUser);
        saveUserToken(savedUser, accessToken);
        saveUserToken(savedUser, refreshToken);

        return new TokenResponse(accessToken, refreshToken);

    }

    public TokenResponse login(RegisterRequest request) {
        return null;
    }

    public TokenResponse refreshToken(RegisterRequest request) {
        return null;
    }

    public void saveUserToken(Usuario usuario, String jwtToken){
        Token token = Token.builder()
                .usuario(usuario)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(final Usuario user) {
        final List<Token> validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());

        if (!validUserTokens.isEmpty()) {
            validUserTokens.forEach(token -> {
                token.setExpired(true);
                token.setRevoked(true);
            });
            tokenRepository.saveAll(validUserTokens);
        }
    }

    public TokenResponse authenticate(final AuthRequest request) {
        Logger.getGlobal().info("Authenticating...");
        try{
            Usuario usuario = userRepository.findByEmail(request.email()).orElseThrow();
            log.info("Revoking all tokens for " + usuario.getId());
            revokeAllUserTokens(usuario);
            var auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email(),
                            request.password()
                    )
            );
            Logger.getGlobal().info("User login: " + auth.isAuthenticated());
        }catch (Exception exception){
            Logger.getGlobal().severe(exception.getMessage());
            throw exception;
        }



        final Usuario user = userRepository.findByEmail(request.email())
                .orElseThrow();
        final String accessToken = jwtService.generateToken(user);
        final String refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);
        return new TokenResponse(accessToken, refreshToken);
    }


    public TokenResponse refreshToken(@NotNull final String authentication) {

        if (authentication == null || !authentication.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid auth header");
        }
        final String refreshToken = authentication.substring(7);
        final String userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail == null) {
            return null;
        }

        final Usuario user = userRepository.findByEmail(userEmail).orElseThrow();
        final boolean isTokenValid = jwtService.isTokenValid(refreshToken, user);
        if (!isTokenValid) {
            return null;
        }

        final String accessToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);

        return new TokenResponse(accessToken, refreshToken);
    }

    public Boolean validateToken(@NotNull final String token) {
        final String username = jwtService.extractUsername(token);
        log.info("Validating token for " + username);
        if (username == null) {
            return false;
        }
        try{
            final Usuario user = userRepository.findByEmail(username).orElseThrow();
            return jwtService.isTokenValid(token, user);
        }catch (Exception exception){
            return false;
        }
    }

}

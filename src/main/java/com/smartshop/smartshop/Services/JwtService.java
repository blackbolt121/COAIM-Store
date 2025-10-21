package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.TokenRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import com.smartshop.smartshop.Models.Token;

@Slf4j
@Service
public class JwtService {

    private final TokenRepository tokenRepository;
    public String secretKey = "adsfalk11984akla719qaklada81932asjklnbjcjh2i1";
    public long expiration = 86400000;
    public long refresh = 604800000;

    public JwtService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public String extractUsername(String token) {

        log.info("Extracting username from token {}", token);
        try{
            return Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        }catch (Exception e){
            return "";
        }

    }
    public boolean isTokenValid(String token, Usuario user) {
        final String username = extractUsername(token);
        Token token1 = tokenRepository.findByToken(token).orElseThrow();
        return (username.equals(user.getEmail())) && !isTokenExpired(token) && !token1.isExpired() && !token1.isRevoked();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }
    public String generateToken(final Usuario usuario){
        return buildToken(usuario, expiration);
    }

    public String refreshToken(final Usuario usuario){
        return buildToken(usuario, refresh);
    }

    public String generateRefreshToken(final Usuario user) {
        return buildToken(user, expiration);
    }

    private String buildToken(final Usuario usuario, final long expiration){
        return Jwts.builder().id(usuario.getId())
                .claims(Map.of("name", usuario.getName()))
                .subject(usuario.getEmail())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    public boolean revokeToken(final String token, final Usuario usuario) {
        tokenRepository.findByToken(token).ifPresent(token1 -> {
            boolean status = token1.getUsuario().getId().equals(usuario.getId());
            if (status) {
                token1.setRevoked(true);
                tokenRepository.save(token1);
            }
        });
        return true;
    }

    public boolean revokeToken(final Token token, final Usuario usuario) {
        token.setRevoked(true);
        tokenRepository.save(token);
        return true;
    }
    private SecretKey getSignInKey(){
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, String> {
    @Query(value = """
      select t from Token as t inner join Usuario u
      on t.usuario.id = u.id
      where u.id = :id and (t.expired = false or t.revoked = false)
      """)
    List<Token> findAllValidTokenByUser(String id);

    Optional<Token> findByToken(String token);
}

package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Usuario, String> {


    public Optional<Usuario> findByEmail(String email);
}

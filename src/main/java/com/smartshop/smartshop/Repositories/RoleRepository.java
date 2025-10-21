package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    @Override
    Optional<Role> findById(Long id);
    Optional<Role> findByName(String name);
}

package com.smartshop.smartshop.DTO;

import com.smartshop.smartshop.Models.Role;
import com.smartshop.smartshop.Models.Usuario;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Esta es la versión del DTO usando un 'record' de Java.
 * Es inmutable, conciso y semánticamente perfecto para un DTO.
 */
public record UsuarioDTO(
        String id,
        String name,
        String email,
        String telefono,
        String calle,
        String ciudad,
        String estado,
        String pais,
        String codigoPostal,
        Boolean activo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        Set<String> roles
) {
    /**
     * Método de fábrica estático para crear el record a partir de la entidad.
     * Nota que ahora usamos el constructor canónico del record en lugar de un builder.
     */
    public static UsuarioDTO fromEntity(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        Set<String> rolesNombres = (usuario.getRoles() != null)
                ? usuario.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet())
                : Collections.emptySet();

        // Llamamos directamente al constructor del record
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getName(),
                usuario.getEmail(),
                usuario.getTelefono(),
                usuario.getCalle(),
                usuario.getCiudad(),
                usuario.getEstado(),
                usuario.getPais(),
                usuario.getCodigoPostal(),
                usuario.getActivo(),
                usuario.getCreatedAt(),
                usuario.getUpdatedAt(),
                rolesNombres
        );
    }
}
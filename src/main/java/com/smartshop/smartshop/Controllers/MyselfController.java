package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.DTO.UsuarioDTO;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/rest/api/1")
@RequiredArgsConstructor
public class MyselfController {

    private final UserService userService;

    @GetMapping("/myself")
    public ResponseEntity<UsuarioDTO> myself() {
        Usuario usuario = userService.getUserByContext();
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(UsuarioDTO.fromEntity(usuario));
    }
}

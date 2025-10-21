package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Pedidos;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.PedidoRepository;
import com.smartshop.smartshop.Services.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Pageable;

import java.util.Optional;


@Slf4j
@RestController
@RequestMapping(path = "/rest/api/1/pedidos")
@AllArgsConstructor
public class PedidosController {

    private final PedidoRepository pedidoRepository;
    private final UserService userService;

    @GetMapping(path = "")
    public Page<Pedidos> getPedidios(Pageable pageable) {
        Usuario usuario = userService.getUserByContext();
        return pedidoRepository.findAllByUsuario(usuario, pageable);
    }

    @GetMapping(path = "{id}")
    public ResponseEntity<Pedidos> getPedidoById(@PathVariable long id) {
        Usuario usuario = userService.getUserByContext();

        Optional<Pedidos> pedidosOpt = pedidoRepository.findById(id);

        if(pedidosOpt.isEmpty()){
            return ResponseEntity.notFound().build();
        }

        Pedidos pedidos = pedidosOpt.get();

        if(!pedidos.getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(pedidos);

    }





}

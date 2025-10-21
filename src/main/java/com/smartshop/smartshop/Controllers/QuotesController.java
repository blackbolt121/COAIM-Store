package com.smartshop.smartshop.Controllers;


import com.smartshop.smartshop.Models.Cotizacion;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.CotizacionRepository;
import com.smartshop.smartshop.Services.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/rest/api/1/quotes")
public class QuotesController {

    private final CotizacionRepository cotizacionRepository;
    private final UserService userService;

    @GetMapping("")
    public List<Cotizacion> getQuotes(){
        Usuario usuario = userService.getUserByContext();
        return cotizacionRepository.findAllByCorreo(usuario.getEmail());
    }
    
    @GetMapping("{id}")
    public ResponseEntity<Cotizacion> getQuotesById(@PathVariable String id){
        log.info("getQuotesById {}", id);
        Cotizacion cotizacion = cotizacionRepository.findById(id).orElse(null);
        Usuario usuario = userService.getUserByContext();
        if (cotizacion == null){
            return ResponseEntity.notFound().build();
        }
        else if (!cotizacion.getCorreo().equals(usuario.getEmail())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }else{
            return ResponseEntity.ok(cotizacion);
        }
    }
}

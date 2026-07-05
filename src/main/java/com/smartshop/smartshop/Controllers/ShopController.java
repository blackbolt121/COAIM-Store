package com.smartshop.smartshop.Controllers;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ShopController {
    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }


    @GetMapping("/cart")
    public String cart() {
        return "forward:/index.html";
    }

    @GetMapping("/about")
    public String about() {
        return "forward:/index.html";
    }

    @GetMapping("/contact")
    public String contact() {
        return "forward:/index.html";
    }

    @GetMapping("/tienda")
    public String tienda() {
        return "forward:/index.html";
    }

    @GetMapping("/explorar")
    public String explorar() {
        return "forward:/index.html";
    }

    @GetMapping("/producto")
    public String productoSinId() {
        return "forward:/index.html";
    }

    @GetMapping("/producto/{id}")
    public String producto() {
        return "forward:/index.html";
    }

    @GetMapping("/signup")
    public String signup() {
        return "forward:/index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "forward:/index.html";
    }

    @GetMapping("/logout")
    public String logout() {
        return "forward:/index.html";
    }

    @GetMapping("/pedidos")
    public String pedidos() {
        return "forward:/index.html";
    }

    @GetMapping("/pedido")
    public String pedidoSinId() {
        return "forward:/index.html";
    }

    @GetMapping("/pedido/{id}")
    public String pedido() {
        return "forward:/index.html";
    }

    @GetMapping("/cotizaciones")
    public String cotizaciones() {
        return "forward:/index.html";
    }

    @GetMapping("/cotizacion")
    public String cotizacionSinId() {
        return "forward:/index.html";
    }

    @GetMapping("/cotizacion/{id}")
    public String cotizacion() {
        return "forward:/index.html";
    }

    @GetMapping("/terminos_y_condiciones")
    public String terminos_y_condiciones() {
        return "forward:/index.html";
    }
}

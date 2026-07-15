package com.smartshop.smartshop.Controllers;

import com.resend.services.emails.model.SendEmailRequest;
import com.resend.services.emails.model.SendEmailResponse;
import com.smartshop.smartshop.Enumeration.PedidoStatus;
import com.smartshop.smartshop.Models.*;
import com.smartshop.smartshop.Repositories.*;
import com.smartshop.smartshop.Services.*;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.resend.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.swing.text.html.Option;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Controller
@RequestMapping(path = "/admin")
@AllArgsConstructor
public class AdminController {

    private final AuthService authService;
    private final UserService userService;
    private final JwtService jwtService;
    private final CartService cartService;
    private final ProductRepository productRepository;
    private final CotizacionRepository cotizacionRepository;
    private final RoleRepository roleRepository;
    private final ProductoService productoService;
    private final UserRepository userRepository;
    private final PedidoRepository pedidosRepository;
    private final DashboardService dashboardService;
    @Value("${app.admin.origin:http://localhost:3000}")
    private String adminOrigin;

    private String adminRedirect(String path) {
        String base = adminOrigin.endsWith("/") ? adminOrigin.substring(0, adminOrigin.length() - 1) : adminOrigin;
        return "redirect:" + base + path;
    }

    @GetMapping("")
    public String index(Model model){
        return adminRedirect("/");
    }

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        // Obtenemos el código de estado del error (e.g., 404, 500, 403)
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());

            // Si el error es un 404 (NOT_FOUND), mostramos nuestra página personalizada
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return "errors/notfound_admin"; // Devuelve el nombre de la plantilla: /templates/error/404.html
            }
            // Aquí podrías añadir más 'if' para otros códigos de error, como el 500
            else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                return "error/500"; // Requeriría una plantilla 500.html
            }
        }
        // Para cualquier otro error, puedes devolver una página genérica
        return "error/error"; // Requeriría una plantilla error.html
    }

    @GetMapping("login")
    public String login(@RequestParam(value = "error", required = false, defaultValue = "false") boolean error, Model model, @CookieValue(value = "access_token", required = false) String token, HttpServletRequest request, HttpServletResponse response) {
        return adminRedirect("/login");
    }

    @PostMapping("login")
    public String login(@RequestParam("email") String email, @RequestParam("password") String password, HttpServletResponse response) {
        return adminRedirect("/login");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public String dashboard(@CookieValue(value = "adminId") String id, Model model, HttpServletResponse response, HttpServletRequest request) {
        return adminRedirect("/dashboard");
    }

    @GetMapping("/users")
    public String users(Model model) {
        return adminRedirect("/usuarios");
    }

    @GetMapping("/orders")
    public String listAllOrders(Model model) {
        return adminRedirect("/pedidos");
    }

    @GetMapping("/order/{id}")
    public String pedido(@PathVariable("id") String id, Model model) {
        return adminRedirect("/pedidos/" + id);
    }

    @PostMapping("/order/update")
    public String updateOrder(@RequestParam("id") Long id,
                              @RequestParam("guia") String guia,
                              @RequestParam("pedidoStatus") String pedidoStatus,
                              RedirectAttributes redirectAttributes) {
        return adminRedirect("/pedidos/" + id);
    }

    @GetMapping("/logout")
    public String logout(@CookieValue(name = "access_token") String token, HttpServletResponse response, HttpServletRequest request) {
        jwtService.revokeToken(token, userService.getUserByContext());
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                Cookie deleteCookie = new Cookie(cookie.getName(), "");
                deleteCookie.setMaxAge(0); // Expira inmediatamente
                deleteCookie.setPath("/"); // Asegúrate de que coincida con el path usado para setearla
                deleteCookie.setHttpOnly(cookie.isHttpOnly());
                deleteCookie.setSecure(cookie.getSecure());
                response.addCookie(deleteCookie);
            }
        }
        return adminRedirect("/login");
    }

    @GetMapping("/rest/logout")
    public ResponseEntity<String> logoutAPI(@CookieValue(name = "access_token") String token, HttpServletResponse response, HttpServletRequest request) {
        jwtService.revokeToken(token, userService.getUserByContext());
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                Cookie deleteCookie = new Cookie(cookie.getName(), "");
                deleteCookie.setMaxAge(0); // Expira inmediatamente
                deleteCookie.setPath("/"); // Asegúrate de que coincida con el path usado para setearla
                deleteCookie.setHttpOnly(cookie.isHttpOnly());
                deleteCookie.setSecure(cookie.getSecure());
                response.addCookie(deleteCookie);
            }
        }
        JSONObject obj = new JSONObject();
        obj.put("status", "ok");
        return ResponseEntity.ok(obj.toString());
    }

//    @GetMapping("/order/{id}")
//    public String order(@PathVariable String id, Model model) {
//        Cart cart = cartService.getCartById(id);
//        Double price = cart.getItems().stream().map(cartItem -> cartItem.getProduct().getPrice()).reduce(0.0, Double::sum);
//        String title = String.format("Pedido %s", id);
//        model.addAttribute("cart", cart);
//        model.addAttribute("price", price);
//        model.addAttribute("title", title);
//        model.addAttribute("usuario", cart.getUsuario());
//
//        return "pedido";
//    }

    @GetMapping("/usuario/{id}")
    public String usuario(@PathVariable("id") String id, Model model) {
        return adminRedirect("/usuarios/" + id);
    }

    @GetMapping("/usuario/edit/{id}")
    public String usuarioEdit(@PathVariable("id") String id, Model model) {
        return adminRedirect("/usuarios/" + id);
    }

    @GetMapping("/quotes")
    public String showQuotesForm(Model model) {
        return adminRedirect("/cotizaciones");
    }

    @PostMapping("/quotes")
    public String sendQuote(@RequestParam("correo") String correo, @RequestParam("nombre") String nombre, @RequestParam("productoSeleccionados") String productoSeleccionados, Model model) {
        return adminRedirect("/cotizaciones");
    }


    @GetMapping("/products")
    public String listProducts(Model model,
                               @RequestParam(value = "page", defaultValue = "0") int page,
                               @RequestParam(value = "size", defaultValue = "10") int size,
                               // Mapea todos los parámetros de filtro de tu @Query
                               @RequestParam(value = "name") Optional<String> name,
                               @RequestParam(value = "categories") Optional<List<String>> categories,
                               @RequestParam(value = "minPrice") Optional<Double> minPrice,
                               @RequestParam(value = "maxPrice") Optional<Double> maxPrice,
                               @RequestParam(value = "brand") Optional<String> brand) {

        return adminRedirect("/productos");
    }

    @GetMapping("/product/{id}")
    public String showProduct(@PathVariable("id") String id, Model model) {
        return adminRedirect("/productos/" + id);
    }

    @GetMapping("/quotes/all")
    public String showAllQuotes(Model model) {
        return adminRedirect("/cotizaciones");
    }

    @PostMapping("/users/save")
    public String actualizarUsuario(@ModelAttribute Usuario usuario) {
        return adminRedirect("/usuarios/" + usuario.getId());
    }

    public String generarHtmlCotizacion(Cotizacion cotizacion) {
        StringBuilder html = new StringBuilder();

        double subtotal = 0;
        double envio = 500;

        html.append("<div style=\"font-family: Arial, sans-serif; max-width: 700px; margin: auto;\">");
        html.append("<h2 style=\"color: #1d4ed8;\">Cotización de Productos</h2>");
        html.append("<table style=\"width: 100%; border-collapse: collapse; margin-top: 20px;\">");
        html.append("<thead><tr>")
                .append("<th style=\"text-align: left; border-bottom: 1px solid #ccc; padding: 8px;\">Imagen</th>")
                .append("<th style=\"text-align: left; border-bottom: 1px solid #ccc; padding: 8px;\">Producto</th>")
                .append("<th style=\"text-align: center; border-bottom: 1px solid #ccc; padding: 8px;\">Cantidad</th>")
                .append("<th style=\"text-align: right; border-bottom: 1px solid #ccc; padding: 8px;\">Precio</th>")
                .append("<th style=\"text-align: right; border-bottom: 1px solid #ccc; padding: 8px;\">Total</th>")
                .append("</tr></thead><tbody>");

        for (QuoteItem p : cotizacion.getItems()) {
            double totalProducto = p.getProduct().getPrice() * p.getQuantity();
            subtotal += totalProducto;

            html.append("<tr>")
                    .append("<td style=\"padding: 8px;\"><img src=\"").append(p.getProduct().getImageUrl()).append("\" width=\"60\"/></td>")
                    .append("<td style=\"padding: 8px;\">").append(p.getProduct().getName()).append("<br/><small>").append(p.getProduct().getDescription()).append("</small></td>")
                    .append("<td style=\"padding: 8px; text-align: center;\">").append(p.getQuantity()).append("</td>")
                    .append("<td style=\"padding: 8px; text-align: right;\">$").append(String.format("%.2f", p.getProduct().getPrice())).append("</td>")
                    .append("<td style=\"padding: 8px; text-align: right;\">$").append(String.format("%.2f", totalProducto)).append("</td>")
                    .append("</tr>");
        }

        double iva = subtotal * 0.16;
        double total = subtotal + iva + envio;

        html.append("</tbody></table>");

        // Totales
        html.append("<div style=\"margin-top: 30px; text-align: right;\">")
                .append("<p style=\"margin: 4px 0;\">Subtotal: <strong>$").append(String.format("%.2f", subtotal)).append("</strong></p>")
                .append("<p style=\"margin: 4px 0;\">IVA (16%): <strong>$").append(String.format("%.2f", iva)).append("</strong></p>")
                .append("<p style=\"margin: 4px 0;\">Envío: <strong>$").append(String.format("%.2f", envio)).append("</strong></p>")
                .append("<p style=\"margin: 8px 0; font-size: 18px; color: #10b981;\">Total: <strong>$").append(String.format("%.2f", total)).append("</strong></p>")
                .append("</div>");

        html.append("</div>");
        return html.toString();
    }
}

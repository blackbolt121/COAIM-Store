package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.DTO.AdminOrderDTO;
import com.smartshop.smartshop.DTO.AdminDashboardDTO;
import com.smartshop.smartshop.DTO.AdminOrderUpdateRequest;
import com.smartshop.smartshop.DTO.AdminUserUpdateRequest;
import com.smartshop.smartshop.DTO.CategoryProductCountDto;
import com.smartshop.smartshop.DTO.MonthlySalesDto;
import com.smartshop.smartshop.DTO.UsuarioDTO;
import com.smartshop.smartshop.Models.Pedidos;
import com.smartshop.smartshop.Models.Role;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.PedidoRepository;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Repositories.RoleRepository;
import com.smartshop.smartshop.Services.UserService;
import com.smartshop.smartshop.Services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/rest/api/1/admin")
@RequiredArgsConstructor
public class AdminApiController {

    private final UserService userService;
    private final PedidoRepository pedidoRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DashboardService dashboardService;

    @GetMapping("/users")
    public List<UsuarioDTO> getUsers() {
        return userService.getAllUsers().stream()
                .map(UsuarioDTO::fromEntity)
                .toList();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UsuarioDTO> getUserById(@PathVariable String id) {
        return userService.getUsuario(id)
                .map(UsuarioDTO::fromEntity)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UsuarioDTO> updateUser(@PathVariable String id, @RequestBody AdminUserUpdateRequest request) {
        Optional<Usuario> userOpt = userService.getUsuario(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Usuario user = userOpt.get();
        if (request.name() != null) user.setName(request.name());
        if (request.email() != null) user.setEmail(request.email());
        if (request.telefono() != null) user.setTelefono(request.telefono());
        if (request.calle() != null) user.setCalle(request.calle());
        if (request.ciudad() != null) user.setCiudad(request.ciudad());
        if (request.estado() != null) user.setEstado(request.estado());
        if (request.pais() != null) user.setPais(request.pais());
        if (request.codigoPostal() != null) user.setCodigoPostal(request.codigoPostal());
        if (request.activo() != null) user.setActivo(request.activo());
        if (request.roles() != null) {
            Set<Role> roles = request.roles().stream()
                    .map(roleRepository::findByName)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toSet());
            if (!roles.isEmpty()) {
                user.setRoles(roles);
            }
        }

        return ResponseEntity.ok(UsuarioDTO.fromEntity(userService.save(user)));
    }

    @GetMapping("/orders")
    public List<AdminOrderDTO> getOrders() {
        return pedidoRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(AdminOrderDTO::fromEntity)
                .toList();
    }

    @GetMapping("/dashboard")
    public AdminDashboardDTO getDashboard() {
        long totalUsuarios = userRepository.count();
        long totalProductos = productRepository.count();
        long pedidosNuevos = dashboardService.getNuevosPedidosCount();
        double ingresosMes = dashboardService.getIngresosMesActual();
        List<AdminOrderDTO> ultimosPedidos = dashboardService.getUltimosPedidos().stream()
                .map(AdminOrderDTO::fromEntity)
                .toList();
        List<MonthlySalesDto> salesData = dashboardService.getSalesDataForChart();
        List<CategoryProductCountDto> categoryData = dashboardService.getCategoryDataForChart();

        return new AdminDashboardDTO(
                totalUsuarios,
                totalProductos,
                pedidosNuevos,
                ingresosMes,
                ultimosPedidos,
                salesData,
                categoryData
        );
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<AdminOrderDTO> getOrderById(@PathVariable Long id) {
        return pedidoRepository.findByIdWithAdminDetails(id)
                .map(order -> AdminOrderDTO.fromEntity(order, true))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/orders/{id}")
    public ResponseEntity<AdminOrderDTO> updateOrder(@PathVariable Long id, @RequestBody AdminOrderUpdateRequest request) {
        Optional<Pedidos> orderOpt = pedidoRepository.findByIdWithAdminDetails(id);
        if (orderOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Pedidos order = orderOpt.get();
        if (request.guia() != null) {
            order.setGuia(request.guia());
        }
        if (request.pedidoStatus() != null) {
            order.setPedidoStatus(request.pedidoStatus());
        }

        return ResponseEntity.ok(AdminOrderDTO.fromEntity(pedidoRepository.save(order), true));
    }
}

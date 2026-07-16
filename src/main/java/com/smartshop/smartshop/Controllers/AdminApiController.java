package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.DTO.AdminOrderDTO;
import com.smartshop.smartshop.DTO.AdminDashboardDTO;
import com.smartshop.smartshop.DTO.EntityNameRequest;
import com.smartshop.smartshop.DTO.EntityRefDTO;
import com.smartshop.smartshop.DTO.AdminOrderUpdateRequest;
import com.smartshop.smartshop.DTO.AdminUserUpdateRequest;
import com.smartshop.smartshop.DTO.CategoryProductCountDto;
import com.smartshop.smartshop.DTO.MonthlySalesDto;
import com.smartshop.smartshop.DTO.UsuarioDTO;
import com.smartshop.smartshop.Models.Pedidos;
import com.smartshop.smartshop.Models.Role;
import com.smartshop.smartshop.Models.UserGroup;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.PedidoRepository;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.Repositories.UserRepository;
import com.smartshop.smartshop.Repositories.RoleRepository;
import com.smartshop.smartshop.Repositories.UserGroupRepository;
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
    private final UserGroupRepository userGroupRepository;
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
        if (request.roleIds() != null) {
            Set<Role> roles = request.roleIds().stream()
                    .map(roleRepository::findById)
                    .flatMap(Optional::stream)
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }
        if (request.groupIds() != null) {
            Set<UserGroup> groups = request.groupIds().stream()
                    .map(userGroupRepository::findById)
                    .flatMap(Optional::stream)
                    .collect(Collectors.toSet());
            user.setGroups(groups);
        }

        return ResponseEntity.ok(UsuarioDTO.fromEntity(userService.save(user)));
    }

    @GetMapping("/myself")
    public ResponseEntity<UsuarioDTO> myself() {
        Usuario usuario = userService.getUserByContext();
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(UsuarioDTO.fromEntity(usuario));
    }

    @GetMapping("/roles")
    public List<EntityRefDTO> getRoles() {
        return roleRepository.findAll().stream()
                .map(AdminApiController::toRoleRef)
                .toList();
    }

    @GetMapping("/roles/{id}")
    public ResponseEntity<EntityRefDTO> getRoleById(@PathVariable Long id) {
        return roleRepository.findById(id)
                .map(AdminApiController::toRoleRef)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/roles")
    public ResponseEntity<EntityRefDTO> createRole(@RequestBody EntityNameRequest request) {
        String name = normalizeName(request.name());
        if (name == null) {
            return ResponseEntity.badRequest().build();
        }
        if (roleRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(409).build();
        }

        Role role = new Role();
        role.setName(name);
        return ResponseEntity.ok(toRoleRef(roleRepository.save(role)));
    }

    @PutMapping("/roles/{id}")
    public ResponseEntity<EntityRefDTO> updateRole(@PathVariable Long id, @RequestBody EntityNameRequest request) {
        Optional<Role> roleOpt = roleRepository.findById(id);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String name = normalizeName(request.name());
        if (name == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Role> duplicateRole = roleRepository.findByName(name);
        if (duplicateRole.isPresent() && !duplicateRole.get().getId().equals(id)) {
            return ResponseEntity.status(409).build();
        }

        Role role = roleOpt.get();
        role.setName(name);
        return ResponseEntity.ok(toRoleRef(roleRepository.save(role)));
    }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        Optional<Role> roleOpt = roleRepository.findById(id);
        if (roleOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Role role = roleOpt.get();
        if ("ROLE_ADMIN".equals(role.getName())) {
            return ResponseEntity.status(409).build();
        }

        userService.getAllUsers().forEach(usuario -> {
            if (usuario.getRoles() != null && usuario.getRoles().removeIf(current -> current.getId().equals(role.getId()))) {
                userRepository.save(usuario);
            }
        });

        roleRepository.delete(role);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/groups")
    public List<EntityRefDTO> getGroups() {
        return userGroupRepository.findAll().stream()
                .map(AdminApiController::toGroupRef)
                .toList();
    }

    @GetMapping("/groups/{id}")
    public ResponseEntity<EntityRefDTO> getGroupById(@PathVariable Long id) {
        return userGroupRepository.findById(id)
                .map(AdminApiController::toGroupRef)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/groups")
    public ResponseEntity<EntityRefDTO> createGroup(@RequestBody EntityNameRequest request) {
        String name = normalizeName(request.name());
        if (name == null) {
            return ResponseEntity.badRequest().build();
        }
        if (userGroupRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(409).build();
        }

        UserGroup group = new UserGroup();
        group.setName(name);
        return ResponseEntity.ok(toGroupRef(userGroupRepository.save(group)));
    }

    @PutMapping("/groups/{id}")
    public ResponseEntity<EntityRefDTO> updateGroup(@PathVariable Long id, @RequestBody EntityNameRequest request) {
        Optional<UserGroup> groupOpt = userGroupRepository.findById(id);
        if (groupOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        String name = normalizeName(request.name());
        if (name == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<UserGroup> duplicateGroup = userGroupRepository.findByName(name);
        if (duplicateGroup.isPresent() && !duplicateGroup.get().getId().equals(id)) {
            return ResponseEntity.status(409).build();
        }

        UserGroup group = groupOpt.get();
        group.setName(name);
        return ResponseEntity.ok(toGroupRef(userGroupRepository.save(group)));
    }

    @DeleteMapping("/groups/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        Optional<UserGroup> groupOpt = userGroupRepository.findById(id);
        if (groupOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserGroup group = groupOpt.get();
        userService.getAllUsers().forEach(usuario -> {
            if (usuario.getGroups() != null && usuario.getGroups().removeIf(current -> current.getId().equals(group.getId()))) {
                userRepository.save(usuario);
            }
        });

        userGroupRepository.delete(group);
        return ResponseEntity.noContent().build();
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

    private static EntityRefDTO toRoleRef(Role role) {
        return new EntityRefDTO(role.getId(), role.getName());
    }

    private static EntityRefDTO toGroupRef(UserGroup group) {
        return new EntityRefDTO(group.getId(), group.getName());
    }

    private static String normalizeName(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }
}

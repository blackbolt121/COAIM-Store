package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.DTO.CotizacionDetailDTO;
import com.smartshop.smartshop.DTO.CotizacionRequest;
import com.smartshop.smartshop.DTO.PageResponseDTO;
import com.smartshop.smartshop.Enumeration.CotizacionEstado;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Services.CotizacionService;
import com.smartshop.smartshop.Services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rest/api/1/cotizaciones")
@RequiredArgsConstructor
public class CotizacionController {

    private final CotizacionService cotizacionService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "estado", required = false) CotizacionEstado estado,
            @RequestParam(value = "destinatario", required = false) String destinatario,
            @RequestParam(value = "creador", required = false) String creador,
            @PageableDefault(page = 0, size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Usuario currentUser = userService.getUserByContext();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        var page = cotizacionService.searchCotizaciones(currentUser, query, estado, destinatario, creador, pageable);
        return ResponseEntity.ok(new PageResponseDTO<>(
                page.getContent(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize(),
                page.isFirst(),
                page.isLast(),
                page.isEmpty()
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CotizacionDetailDTO> getById(@PathVariable String id) {
        Usuario currentUser = userService.getUserByContext();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        return cotizacionService.findDetail(id, currentUser)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    @PostMapping
    public ResponseEntity<CotizacionDetailDTO> create(@RequestBody CotizacionRequest request) {
        Usuario currentUser = userService.getUserByContext();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        CotizacionDetailDTO saved = cotizacionService.save(request, currentUser);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CotizacionDetailDTO> update(@PathVariable String id, @RequestBody CotizacionRequest request) {
        Usuario currentUser = userService.getUserByContext();
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        return cotizacionService.updateDraft(id, request, currentUser)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }
}

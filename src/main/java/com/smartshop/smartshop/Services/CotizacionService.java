package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.DTO.CotizacionCreatorDTO;
import com.smartshop.smartshop.DTO.CotizacionDetailDTO;
import com.smartshop.smartshop.DTO.CotizacionItemDTO;
import com.smartshop.smartshop.DTO.CotizacionListItemDTO;
import com.smartshop.smartshop.DTO.CotizacionRequest;
import com.smartshop.smartshop.Enumeration.CotizacionEstado;
import com.smartshop.smartshop.Models.Cotizacion;
import com.smartshop.smartshop.Models.Producto;
import com.smartshop.smartshop.Models.QuoteItem;
import com.smartshop.smartshop.Models.Usuario;
import com.smartshop.smartshop.Repositories.CotizacionRepository;
import com.smartshop.smartshop.Repositories.ProductRepository;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CotizacionService {
    private final CotizacionRepository cotizacionRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Page<CotizacionListItemDTO> searchCotizaciones(
            Usuario currentUser,
            String query,
            CotizacionEstado estado,
            String destinatario,
            String creador,
            Pageable pageable
    ) {
        Specification<Cotizacion> spec = (root, cq, cb) -> cb.conjunction();

        if (!canSeeAll(currentUser)) {
            spec = spec.and((root, cq, cb) -> cb.equal(root.join("creadoPor", JoinType.LEFT).get("id"), currentUser.getId()));
        }

        String normalizedQuery = normalize(query);
        if (normalizedQuery != null) {
            spec = spec.and((root, cq, cb) -> {
                var creatorJoin = root.join("creadoPor", JoinType.LEFT);
                String like = "%" + normalizedQuery + "%";
                return cb.or(
                        cb.like(cb.lower(root.get("id")), like),
                        cb.like(cb.lower(root.get("nombre")), like),
                        cb.like(cb.lower(root.get("correo")), like),
                        cb.like(cb.lower(creatorJoin.get("name")), like),
                        cb.like(cb.lower(creatorJoin.get("email")), like)
                );
            });
        }

        CotizacionEstado resolvedEstado = parseEstado(estado == null ? null : estado.name());
        if (resolvedEstado != null) {
            spec = spec.and((root, cq, cb) -> cb.equal(root.get("estado"), resolvedEstado));
        }

        String normalizedDestinatario = normalize(destinatario);
        if (normalizedDestinatario != null) {
            spec = spec.and((root, cq, cb) -> {
                String like = "%" + normalizedDestinatario + "%";
                return cb.or(
                        cb.like(cb.lower(root.get("nombre")), like),
                        cb.like(cb.lower(root.get("correo")), like)
                );
            });
        }

        String normalizedCreator = normalize(creador);
        if (normalizedCreator != null && canSeeAll(currentUser)) {
            spec = spec.and((root, cq, cb) -> {
                var creatorJoin = root.join("creadoPor", JoinType.LEFT);
                String like = "%" + normalizedCreator + "%";
                return cb.or(
                        cb.like(cb.lower(creatorJoin.get("name")), like),
                        cb.like(cb.lower(creatorJoin.get("email")), like)
                );
            });
        }

        return cotizacionRepository.findAll(spec, pageable).map(this::toListItemDTO);
    }

    @Transactional(readOnly = true)
    public Optional<CotizacionDetailDTO> findDetail(String id, Usuario currentUser) {
        return cotizacionRepository.findById(id)
                .filter(cotizacion -> canSeeAll(currentUser) || isOwner(cotizacion, currentUser))
                .map(this::toDetailDTO);
    }

    @Transactional
    public CotizacionDetailDTO save(CotizacionRequest request, Usuario currentUser) {
        Cotizacion cotizacion = new Cotizacion();
        applyRequest(cotizacion, request, currentUser, true);
        Cotizacion saved = cotizacionRepository.save(cotizacion);
        return toDetailDTO(saved);
    }

    @Transactional
    public Optional<CotizacionDetailDTO> updateDraft(String id, CotizacionRequest request, Usuario currentUser) {
        return cotizacionRepository.findById(id)
                .filter(cotizacion -> canSeeAll(currentUser) || isOwner(cotizacion, currentUser))
                .filter(cotizacion -> cotizacion.getEstado() == CotizacionEstado.BORRADOR)
                .map(cotizacion -> {
                    applyRequest(cotizacion, request, currentUser, false);
                    return cotizacionRepository.save(cotizacion);
                })
                .map(this::toDetailDTO);
    }

    private boolean canSeeAll(Usuario usuario) {
        return usuario != null && usuario.getRoles() != null && usuario.getRoles().stream()
                .anyMatch(role -> "ROLE_ADMIN".equals(role.getName()));
    }

    private boolean isOwner(Cotizacion cotizacion, Usuario usuario) {
        return cotizacion.getCreadoPor() != null
                && usuario != null
                && cotizacion.getCreadoPor().getId().equals(usuario.getId());
    }

    private CotizacionListItemDTO toListItemDTO(Cotizacion cotizacion) {
        return new CotizacionListItemDTO(
                cotizacion.getId(),
                cotizacion.getNombre(),
                cotizacion.getCorreo(),
                cotizacion.getEstado(),
                cotizacion.getCreatedAt(),
                cotizacion.getUpdatedAt(),
                toCreatorDTO(cotizacion.getCreadoPor()),
                cotizacion.getItems() == null ? 0 : cotizacion.getItems().size(),
                totalOf(cotizacion)
        );
    }

    private CotizacionDetailDTO toDetailDTO(Cotizacion cotizacion) {
        List<CotizacionItemDTO> items = cotizacion.getItems() == null
                ? List.of()
                : cotizacion.getItems().stream()
                .map(item -> new CotizacionItemDTO(
                        item.getProduct() == null ? null : item.getProduct().getId() == null ? null : item.getProduct().getId().toString(),
                        item.getProduct() == null ? null : item.getProduct().getName(),
                        item.getProduct() == null ? null : item.getProduct().getSku(),
                        item.getProduct() == null ? null : item.getProduct().getImageUrl(),
                        item.getQuantity(),
                        item.getProduct() == null ? 0.0 : item.getProduct().getPrice(),
                        item.getProduct() == null ? 0.0 : item.getProduct().getPrice() * item.getQuantity()
                ))
                .toList();

        return new CotizacionDetailDTO(
                cotizacion.getId(),
                cotizacion.getNombre(),
                cotizacion.getCorreo(),
                cotizacion.getEstado(),
                cotizacion.getCreatedAt(),
                cotizacion.getUpdatedAt(),
                toCreatorDTO(cotizacion.getCreadoPor()),
                items,
                items.size(),
                totalOf(cotizacion)
        );
    }

    private CotizacionCreatorDTO toCreatorDTO(Usuario usuario) {
        if (usuario == null) {
            return null;
        }

        return new CotizacionCreatorDTO(usuario.getId(), usuario.getName(), usuario.getEmail());
    }

    private void applyRequest(Cotizacion cotizacion, CotizacionRequest request, Usuario currentUser, boolean assignCreator) {
        cotizacion.setNombre(request.nombre() == null ? null : request.nombre().trim());
        cotizacion.setCorreo(request.correo() == null ? null : request.correo().trim());
        cotizacion.setEstado(request.estado() == null ? CotizacionEstado.BORRADOR : request.estado());
        if (assignCreator && cotizacion.getCreadoPor() == null) {
            cotizacion.setCreadoPor(currentUser);
        }

        List<QuoteItem> items = new ArrayList<>();
        if (request.productoSeleccionados() != null) {
            request.productoSeleccionados().forEach((productId, itemRequest) -> {
                if (itemRequest == null || itemRequest.cantidad() == null || itemRequest.cantidad() < 1) {
                    return;
                }

                Producto producto;
                try {
                    producto = productRepository.findById(UUID.fromString(productId)).orElse(null);
                } catch (IllegalArgumentException ignored) {
                    return;
                }
                if (producto == null) {
                    return;
                }

                items.add(QuoteItem.builder()
                        .product(producto)
                        .quantity(itemRequest.cantidad())
                        .cotizacion(cotizacion)
                        .build());
            });
        }

        cotizacion.setItems(items);
    }

    private double totalOf(Cotizacion cotizacion) {
        if (cotizacion.getItems() == null) {
            return 0.0;
        }

        return cotizacion.getItems().stream()
                .mapToDouble(item -> {
                    double price = item.getProduct() == null ? 0.0 : item.getProduct().getPrice();
                    return price * (item.getQuantity() == null ? 0 : item.getQuantity());
                })
                .sum();
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return normalized.isEmpty() ? null : normalized;
    }

    private CotizacionEstado parseEstado(String value) {
        if (value == null) {
            return null;
        }

        try {
            return CotizacionEstado.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }
}

package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.DTO.CartItemDto;
import com.smartshop.smartshop.DTO.CartResponseDto;
import com.smartshop.smartshop.Models.*;
import com.smartshop.smartshop.Repositories.CartItemRepository;
import com.smartshop.smartshop.Repositories.CartRepository;
import com.smartshop.smartshop.Repositories.ProductRepository;
import com.smartshop.smartshop.RequestModels.CartItemRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productoRepository;
    private final ProductoService productoService;
    private final ConversionService conversionService;


    public Cart updateCart(CartItemRequest[] cartItemRequest, Cart cart) {
        log.info("Updating cart for cart id {}", cart.getId());

        // 1. Obtener y limpiar la colección gestionada actual
        Set<CartItem> items = cart.getItems();
        items.clear(); // activa orphanRemoval

        // 2. Agregar nuevos ítems directamente a la colección existente
        for (CartItemRequest cartItemRequest1 : cartItemRequest) {
            try {
                log.info("Updating cart item {}", cartItemRequest1);

                Producto product = productoService.getProduct(cartItemRequest1.productId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                CartItemId cartItemId = new CartItemId(cart.getId(), product.getId());

                CartItem cartItem = CartItem.builder()
                        .id(cartItemId)
                        .cart(cart)
                        .product(product)
                        .quantity(cartItemRequest1.quantity())
                        .build();

                items.add(cartItem); // 👈 usar la colección gestionada original
            } catch (Exception e) {
                log.warn("Error al agregar item al carrito", e);
            }
        }

        return cartRepository.save(cart);
    }

    public Cart createCart(CartItemRequest[] cartItemRequest, Usuario usuario) {
        Cart cart = new Cart();
        cart.setUsuario(usuario);
        cartRepository.save(cart);
        log.info("Creating cart for cart id {}", cart.getId());
        log.info("Cart by user {}", usuario.getId());

        Set<CartItem> items = new HashSet<>();
        for(CartItemRequest cartItemRequest1 : cartItemRequest) {
            try{
                CartItemId cartItemId = new CartItemId();
                cartItemId.setCartId(cart.getId());

                Producto product = productoService.getProduct(cartItemRequest1.productId()).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
                log.info("Product found {}", product.getId().toString());
                cartItemId.setProductId(product.getId());
                Integer quantity = cartItemRequest1.quantity();
                CartItem cartItem = new CartItem(cartItemId, cart, product, quantity);
                cartItemRepository.save(cartItem);
                items.add(cartItem);

            }catch (Exception ignored){
                log.info("Error al agregar item al carrito", ignored);
            }
        }
        log.info("Saving cart items!!!");
        log.info("Cart length: {}", items.size());
        cart.setItems(items);
        try{
            log.info("Saving cart items {}", cart.getId());
            //cartItemRepository.saveAll(cartItems);
        }catch (Exception ignored){
            log.info("Error al agregar item al carrito", ignored);
            return cart;
        }



        log.info("All cart items saved!!!");
        log.info("Saving Cart!!!");

        return cart;
    }

    public Cart getCartById(String id) {
        return cartRepository.findById(id).get();
    }

    public CartResponseDto toDto(Cart cart) {
        List<CartItemDto> itemDtos = cart.getItems().stream()
                .map(item -> new CartItemDto(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity()
                ))
                .toList();

        return new CartResponseDto(cart.getId(), itemDtos, cart.getOrdenPago());
    }

    public List<Cart> getAllCarts() {
        return cartRepository.findAll().stream().filter(cart -> cart.getOrdenPago() != null).toList();
    }

    public void save(Cart cart) {
        cartRepository.save(cart);
    }
}

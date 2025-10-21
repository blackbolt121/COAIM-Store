package com.smartshop.smartshop.Controllers;


import com.smartshop.smartshop.Models.UrreaProduct;
import com.smartshop.smartshop.Repositories.UrreaProductRepository;
import com.smartshop.smartshop.Services.ProductoService;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RequestMapping(path = "/rest/api/1/urrea/producto")
@RestController
@Slf4j
@AllArgsConstructor
public class UrreaProductController {

    private UrreaProductRepository urreaProductRepository;
    private ProductoService productoService;
    @PostMapping
    public ResponseEntity<UrreaProduct> createProduct(@RequestBody UrreaProductRequest urreaProductRequest) {

        log.info("createProduct");
        log.info(urreaProductRequest.codigo());
        if(urreaProductRepository.findByCodigoOrCodigoBarras(urreaProductRequest.codigo(), urreaProductRequest.codigoBarras()).isPresent() && !urreaProductRequest.codigoBarras().isEmpty()){
            Optional<UrreaProduct> urreaProduct = urreaProductRepository.findByCodigoOrCodigoBarras(urreaProductRequest.codigo(), urreaProductRequest.codigoBarras());
            log.info("urreaProduct found!!!");
            return ResponseEntity.ok().body(urreaProduct.orElse(null));
        }
        UrreaProduct urreaProduct = urreaProductRequest.toEntity();
        log.info(urreaProduct.getCodigo());
        urreaProductRepository.save(urreaProduct);
        return ResponseEntity.ok().body(urreaProductRequest.toEntity());
    }


    @PostMapping("/bulk")
    public ResponseEntity<List<UrreaProductRequest>> bulkInsertProduct(@RequestBody UrreaProductRequest[] urreaProductRequests){

        ArrayList<UrreaProductRequest> failedUrreaProductRequestList = new ArrayList<>();
        for(UrreaProductRequest urreaProductRequest : urreaProductRequests){

            try{

                if(urreaProductRepository.findByCodigoOrCodigoBarras(urreaProductRequest.codigo(), urreaProductRequest.codigoBarras()).isPresent() && !urreaProductRequest.codigoBarras().isEmpty()){
                    Optional<UrreaProduct> urreaProduct = urreaProductRepository.findByCodigoOrCodigoBarras(urreaProductRequest.codigo(), urreaProductRequest.codigoBarras());
                    log.info("urreaProduct found!!!");
                }else{
                    UrreaProduct urreaProduct = urreaProductRequest.toEntity();
                    log.info(urreaProduct.getCodigo());
                    urreaProductRepository.save(urreaProduct);
                }

            }catch(Exception e){
                failedUrreaProductRequestList.add(urreaProductRequest);
            }
        }
        return  ResponseEntity.ok().body(failedUrreaProductRequestList);
    }

    @PutMapping
    public ResponseEntity<UrreaProduct> putProduct(@RequestBody UrreaProductRequest urreaProductRequest) {
        UrreaProduct urreaProduct = urreaProductRequest.toEntity();
        Optional<UrreaProduct> product = urreaProductRepository.findByIdOrCodigo(urreaProduct.getCodigo(),urreaProduct.getCodigo());
        if(product.isEmpty()){
            return ResponseEntity.badRequest().body(urreaProduct);
        }
        urreaProduct.setId(product.get().getId());
        urreaProductRepository.save(urreaProduct);
        return ResponseEntity.ok().body(urreaProduct);
    }

    @PatchMapping("/{codigo}")
    public ResponseEntity<UrreaProduct> updatePartial(
            @PathVariable String codigo,
            @RequestBody Map<String, Object> updates) {

        Optional<UrreaProduct> optionalProduct = urreaProductRepository.findByIdOrCodigo(codigo, codigo);

        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UrreaProduct product = optionalProduct.get();

        updates.forEach((key, value) -> {
            switch (key) {
                case "nombreLargo" -> product.setNombreLargo((String) value);
                case "descripcionProducto" -> product.setDescripcionProducto((String) value);
                case "marca" -> product.setMarca((String) value);
                case "submarca" -> product.setSubmarca((String) value);
                case "familia" -> product.setFamilia((String) value);
                case "clase" -> product.setClase((String) value);
                case "subclase" -> product.setSubclase((String) value);
                case "precio" -> product.setPrecio(Double.valueOf(value.toString()));
                case "moneda" -> product.setMoneda((String) value);
                case "multiplo" -> product.setMultiplo(Integer.valueOf(value.toString()));
                case "codigoBarras" -> product.setCodigoBarras((String) value);
                case "estatusInventario" -> product.setEstatusInventario((String) value);
                case "anexo20SAT" -> product.setAnexo20SAT((String) value);
                case "claveUnidadSAT" -> product.setClaveUnidadSAT((String) value);
                case "bullets" -> product.setBullets((String) value);
                case "esJuego" -> product.setEsJuego("si".equalsIgnoreCase(value.toString()));
                case "piezasJuego" -> product.setPiezasJuego(Integer.valueOf(value.toString()));
                case "contenidoJuego" -> product.setContenidoJuego((String) value);
                case "accesorios" -> product.setAccesorios((String) value);
                case "garantia" -> product.setGarantia((String) value);
                case "empaque" -> product.setEmpaque((String) value);
                case "keywords" -> product.setKeywords((String) value);
                case "fotografia" -> product.setFotografia((String) value);
                case "video" -> product.setVideo((String) value);
                case "fichaTecnica" -> product.setFichaTecnica((String) value);
                case "manual" -> product.setManual((String) value);
                case "alto" -> product.setAlto(Double.valueOf(value.toString()));
                case "fondo" -> product.setFondo(Double.valueOf(value.toString()));
                case "ancho" -> product.setAncho(Double.valueOf(value.toString()));
                case "peso" -> product.setPeso(Double.valueOf(value.toString()));
                case "caracteristica" -> product.setCaracteristica((String) value);
                default -> throw new IllegalArgumentException("Campo desconocido: " + key);
            }
        });

        urreaProductRepository.save(product);

        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<UrreaProduct> deleteProduct(@PathVariable String codigo) {

        Optional<UrreaProduct> optionalProduct = urreaProductRepository.findByIdOrCodigo(codigo, codigo);

        if (optionalProduct.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UrreaProduct product = optionalProduct.get();

        urreaProductRepository.delete(product);

        return ResponseEntity.ok(product);
    }

    @PutMapping("/asProduct")
    public ResponseEntity<UrreaProduct> saveAsProduct(@RequestParam String codigo) {
        Optional<UrreaProduct> optionalProduct = urreaProductRepository.findByIdOrCodigo(codigo, codigo);
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.ok().build();
        }
        UrreaProduct product = optionalProduct.get();
        if(!product.getEstatusInventario().equals("No disponible")) {
            productoService.saveUrreaProductToProduct(product);
        }
        return  ResponseEntity.ok(product);
    }

    @GetMapping("/all")
    public Page<UrreaProduct> getAllProducts(@Validated @NonNull Pageable pageable) {
        return urreaProductRepository.findAll(pageable);
    }

    @GetMapping("")
    public ResponseEntity<UrreaProduct> getProduct(@RequestParam String codigo) {
        log.info(codigo);
        Optional<UrreaProduct> product = urreaProductRepository.findByIdOrCodigo(codigo, codigo);
        return product.map(urreaProduct -> ResponseEntity.ok().body(urreaProduct)).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

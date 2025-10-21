package com.smartshop.smartshop.Scheduled;

import com.smartshop.smartshop.Controllers.UrreaProductRequest;
import com.smartshop.smartshop.Models.*;
import com.smartshop.smartshop.Repositories.*;
import com.smartshop.smartshop.Services.ProductoService;
import kong.unirest.core.HttpResponse;
import kong.unirest.core.Unirest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
public class UrreaProductFetch {

    private final UrreaProductRepository urreaProductRepository;
    private final ProductRepository productRepository;
    private final VendorRepository vendorRepository;
    private final ProductoService productoService;
    private final RoleRepository roleRepository;
    private final UserRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    // --- CORRECCIÓN: Las anotaciones @Value se colocan directamente en los campos 'final' ---
    private final boolean enableLoadData;
    private final boolean loadRoles;
    private final String adminPassword;


    public UrreaProductFetch(
            UrreaProductRepository urreaProductRepository,
            ProductRepository productRepository,
            VendorRepository vendorRepository,
            ProductoService productoService,
            RoleRepository roleRepository,
            UserRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${smartshop.loaddata:false}") boolean enableLoadData,
            @Value("${smartshop.loadroles:true}") boolean loadRoles,
            @Value("${smartshop.admin.default-password}") String adminPassword
    ) {
        this.urreaProductRepository = urreaProductRepository;
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
        this.productoService = productoService;
        this.roleRepository = roleRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.enableLoadData = enableLoadData;
        this.loadRoles = loadRoles;
        this.adminPassword = adminPassword;
    }
    @EventListener(ApplicationReadyEvent.class)
    public void runOnStartup() {
        // --- Lógica de Habilitación ---
        // Ahora la tarea solo se ejecuta si la propiedad en application.properties es 'true'.
        if (enableLoadData) {
            log.info("La carga de datos está habilitada. Ejecutando tarea de Urrea en el inicio...");
            fetchUrreaProductsAsync();
        } else {
            log.info("La carga de datos está deshabilitada (smartshop.loaddata=false). Omitiendo tarea.");
        }

        if (loadRoles) {
            log.info("Cargando roles");
            loadInitialRoles();
        }

        loadMarcas();
    }

    private void loadMarcas() {
        urreaProductRepository.getMarcas().forEach(marca -> {
            if (marca != null && !marca.trim().isEmpty()) {
                vendorRepository.findByVendorName(marca.trim()).orElseGet(() -> {
                    Vendor nuevoVendor = Vendor.builder().vendorName(marca.trim()).build();
                    log.info("Creando nueva marca: {}", marca.trim());
                    return vendorRepository.save(nuevoVendor);
                });
            }
        });
    }

    @Value("")
    @Transactional
    public void loadInitialRoles() {
        createOrUpdateRole("ROLE_ADMIN");
        createOrUpdateRole("ROLE_USER");
        createOrUpdateRole("ROLE_SALES");
        createOrUpdateRole("ROLE_OPERATOR");
        log.info("Verificación de roles iniciales completada.");

        if (usuarioRepository.findByEmail("admin@mercadourrea.com.mx").isEmpty()) {

            // Busca el rol de Administrador
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Rol de Administrador no encontrado."));
            // Crea el nuevo usuario
            Usuario adminUser = new Usuario();
            adminUser.setName("Administrador");
            adminUser.setEmail("admin@mercadourrea.com.mx");
            // **IMPORTANTE**: Codifica la contraseña antes de guardarla
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setRoles(Set.of(adminRole));
            usuarioRepository.save(adminUser);
            System.out.println(">>> Usuario administrador por defecto creado.");
        }
    }

    /**
     * Método auxiliar para crear o actualizar un rol específico de forma idiomática y segura.
     * @param id El ID del rol.
     * @param name El nombre del rol.
     */
    private void createOrUpdateRole(String name) {
        // Busca el rol. Si no existe, crea una nueva instancia con el ID asignado.
        Role role = roleRepository.findByName(name)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(name);
                    return newRole;
                });

        // Guarda la entidad. JPA gestionará si es un INSERT (nuevo) o un UPDATE (existente).
        roleRepository.save(role);
    }
    //@Scheduled(cron = "0 0 */2 * * *") // Descomentar para activar la programación regular
    public void fetchUrreaProductsScheduled() {
        if (enableLoadData) {
            log.info("Ejecutando tarea programada de Urrea...");
            fetchUrreaProductsAsync();
        }



    }

    @Async
    @Transactional // Asegura que todas las operaciones de la base de datos se ejecuten en una sola transacción.
    public void fetchUrreaProductsAsync() {
        log.info("Iniciando la sincronización de productos Urrea en segundo plano...");

        // ... (Tu código para llamar a la API de Urrea permanece igual) ...
        final JSONObject payload = new JSONObject()
                .put("opcion", 4)
                .put("usuario", "COAIM")
                .put("password", "D1037300");

        HttpResponse<String> request = Unirest.post("https://www.urreanet.com/urreanetnuevo/wsInformacionProducto.php")
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .body(payload.toString())
                .asString();

        if (request.getStatus() != 200) {
            log.error("Error al obtener productos Urrea: HTTP {}", request.getStatus());
            return;
        }

        try {
            JSONObject response = new JSONObject(request.getBody());
            JSONArray products = response.optJSONArray("resultadoDispMasiva");
            if (products == null || !"OK".equals(response.optString("status"))) {
                log.warn("No se encontraron productos en la respuesta o el estado no es OK.");
                return;
            }

            log.info("Se procesarán {} productos de Urrea.", products.length());

            for (int i = 0; i < products.length(); i++) {
                JSONObject productJson = products.getJSONObject(i);

                // Usamos la clase UrreaProductRequest mejorada
                UrreaProductRequest productRequest = new UrreaProductRequest(
                        productJson.optString("codigo"), productJson.optString("nombreLargo"),
                        productJson.optString("DescripcionProducto"), productJson.optString("Marca"),
                        productJson.optString("Submarca"), productJson.optString("familia"),
                        productJson.optString("clase"), productJson.optString("Subclase"),
                        productJson.optString("Precio"), productJson.optString("Moneda"),
                        productJson.optString("Multiplo"), productJson.optString("CodigoBarras"),
                        productJson.optString("EstatusInventario"), productJson.optString("anexo20SAT"),
                        productJson.optString("claveUnidadSAT"), productJson.optString("bullets"),
                        productJson.optString("esJuego"), productJson.optString("piezasJuego"),
                        productJson.optString("contenidoJuego"), productJson.optString("accesorios"),
                        productJson.optString("garantia"), productJson.optString("empaque"),
                        productJson.optString("keywords"), productJson.optString("fotografia"),
                        productJson.optString("video"), productJson.optString("fichaTecnica"),
                        productJson.optString("manual"), productJson.optString("alto"),
                        productJson.optString("fondo"), productJson.optString("ancho"),
                        productJson.optString("peso"), productJson.optString("caracteristica")
                );

                // --- LÓGICA CRUCIAL DE ACTUALIZAR O INSERTAR (UPSERT) ---
                Optional<UrreaProduct> urreaProductOpt = urreaProductRepository.findByCodigoOrCodigoBarras(
                        productJson.optString("codigo", ""),
                        productJson.optString("CodigoBarras")
                );

                if (urreaProductOpt.isPresent()) {
                    UrreaProduct productoExistente = urreaProductOpt.get();
                    try{
                        log.info("Producto existente");
                        // SI EXISTE: Actualizamos los datos del producto existente
                        log.info("Actualizando porducto");
                        actualizarDatosProducto(productoExistente, productRequest);
                        if( !productoExistente.getEstatusInventario().equalsIgnoreCase("no disponible") )
                            productoService.saveUrreaProductToProduct(productoExistente);
                    }catch (Exception e){
                        log.error("Error al actualizar producto", e);
                        log.info("{} {}",productoExistente.getCodigo(), productoExistente.getCodigoBarras());
                    }
                } else {
                    // NO EXISTE: Guardamos el nuevo producto
                    UrreaProduct productEntity = productRequest.toEntity();
                    try{
                        log.info("Producto no existente");
                        log.info("{} {}",productEntity.getCodigo(), productEntity.getCodigoBarras());
                        UrreaProduct temp = urreaProductRepository.save(productEntity);
                        log.info("Guardando urrea producto a producto");
                        if( !productEntity.getEstatusInventario().equalsIgnoreCase("no disponible") )
                            productoService.saveUrreaProductToProduct(temp);
                    }catch (Exception e){
                        log.info("{} {}",productEntity.getCodigo(), productEntity.getCodigoBarras());
                    }

                }

            }

            // Sincronizar Marcas y Productos después de procesar todo el lote
            sincronizarMarcasYProductos();

            log.info("Sincronización de productos Urrea completada.");
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Error inesperado en la sincronización de productos Urrea", e);
        }
    }

    /**
     * Método auxiliar para actualizar los campos de una entidad existente
     * con los datos de una nueva entidad.
     */
    private void actualizarDatosProducto(UrreaProduct existente, UrreaProductRequest request) {
        // Se actualizan todos los campos relevantes de la entidad 'existente'
        // usando los getters del objeto 'request'.

        // --- Datos Principales ---
        existente.setNombreLargo(request.nombreLargo());
        existente.setDescripcionProducto(request.descripcionProducto());
        existente.setMarca(request.marca());
        existente.setSubmarca(request.submarca());
        existente.setPrecio(Double.parseDouble(request.precio().isEmpty()? "0.0" : request.precio())); // Asegúrate que el tipo de dato coincida
        existente.setMoneda(request.moneda());
        existente.setMultiplo(Integer.parseInt(request.multiplo().isEmpty()? "0": request.multiplo()));
        existente.setEstatusInventario(request.estatusInventario());
        existente.setCodigoBarras(request.codigoBarras());

        // --- Categorización ---
        existente.setFamilia(request.familia());
        existente.setClase(request.clase());
        existente.setSubclase(request.subclase());

        // --- Datos Técnicos y Descriptivos ---
        existente.setBullets(request.bullets());
        existente.setCaracteristica(request.caracteristica());
        existente.setContenidoJuego(request.contenidoJuego());
        existente.setAccesorios(request.accesorios());
        existente.setGarantia(request.garantia());
        existente.setEmpaque(request.empaque());
        existente.setKeywords(request.keywords());

        // --- Datos Fiscales (SAT) ---
        existente.setClaveUnidadSAT(request.claveUnidadSAT());

        // --- Multimedia y Documentos ---
        existente.setFotografia(request.fotografia());
        existente.setVideo(request.video());
        existente.setFichaTecnica(request.fichaTecnica());

        // --- Dimensiones y Peso ---
        existente.setAlto(Double.parseDouble(request.alto().isEmpty()? "0.0": request.alto() ));
        existente.setFondo(Double.parseDouble(request.fondo().isEmpty()? "0.0": request.fondo() ));
        existente.setAncho(Double.parseDouble(request.ancho().isEmpty()? "0.0": request.ancho() ));
        existente.setPeso(Double.parseDouble(request.peso().isEmpty()? "0.0": request.peso() ));
    }

    /**
     * Sincroniza las marcas (Vendors) y los productos disponibles en la tabla principal.
     */
    private void sincronizarMarcasYProductos() {
        log.info("Iniciando sincronización de Marcas y Productos finales...");

        // Sincronizar Marcas (Vendors)
        loadMarcas();

        // Sincronizar Productos Disponibles
        urreaProductRepository.findByProductosDisponible().forEach(productoService::saveUrreaProductToProduct);

        log.info("Sincronización de Marcas y Productos finalizada.");
    }
}
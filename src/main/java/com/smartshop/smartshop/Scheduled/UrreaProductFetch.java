package com.smartshop.smartshop.Scheduled;

import com.smartshop.smartshop.Controllers.UrreaProductRequest;
import com.smartshop.smartshop.Models.*;
import com.smartshop.smartshop.Repositories.*;
import com.smartshop.smartshop.Services.UrreaProductLoadProcessor;
import kong.unirest.core.HttpResponse;
import kong.unirest.core.Unirest;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Optional;
import java.util.Set;

@Slf4j
@Service
public class UrreaProductFetch {

    private final UrreaProductRepository urreaProductRepository;
    private final VendorRepository vendorRepository;
    private final UrreaProductLoadProcessor urreaProductLoadProcessor;
    private final LoadDataErrorRepository loadDataErrorRepository;
    private final RoleRepository roleRepository;
    private final UserRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    // --- CORRECCIÓN: Las anotaciones @Value se colocan directamente en los campos 'final' ---
    private final boolean enableLoadData;
    private final boolean loadRoles;
    private final String adminPassword;


    public UrreaProductFetch(
            UrreaProductRepository urreaProductRepository,
            VendorRepository vendorRepository,
            UrreaProductLoadProcessor urreaProductLoadProcessor,
            LoadDataErrorRepository loadDataErrorRepository,
            RoleRepository roleRepository,
            UserRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${smartshop.loaddata:false}") boolean enableLoadData,
            @Value("${smartshop.loadroles:true}") boolean loadRoles,
            @Value("${smartshop.admin.default-password}") String adminPassword
    ) {
        this.urreaProductRepository = urreaProductRepository;
        this.vendorRepository = vendorRepository;
        this.urreaProductLoadProcessor = urreaProductLoadProcessor;
        this.loadDataErrorRepository = loadDataErrorRepository;
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

        if (usuarioRepository.findByEmail("admin@siscadindustrial.cloud").isEmpty()) {

            // Busca el rol de Administrador
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Rol de Administrador no encontrado."));
            // Crea el nuevo usuario
            Usuario adminUser = new Usuario();
            adminUser.setName("Administrador");
            adminUser.setEmail("admin@siscadindustrial.cloud");
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
    public void fetchUrreaProductsAsync() {
        log.info("Iniciando la sincronización de productos Urrea en segundo plano...");

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

            int processed = 0;
            int inserted = 0;
            int failed = 0;

            for (int i = 0; i < products.length(); i++) {
                JSONObject productJson = products.getJSONObject(i);
                processed++;

                try {
                    urreaProductLoadProcessor.process(toRequest(productJson));
                    inserted++;
                } catch (Exception e) {
                    failed++;
                    String codigo = productJson.optString("codigo", "");
                    String codigoBarras = productJson.optString("CodigoBarras", "");
                    log.error("Falló carga de producto codigo={} codigoBarras={}: {}", codigo, codigoBarras, e.getMessage(), e);
                    try {
                        saveLoadError("urrea-products", codigo, codigoBarras, e);
                    } catch (Exception errorSavingError) {
                        log.warn("No se pudo guardar el error de carga para codigo={} codigoBarras={}: {}", codigo, codigoBarras, errorSavingError.getMessage());
                    }
                }
            }

            log.info("Sincronización de productos Urrea completada. procesados={}, insertados={}, fallidos={}", processed, inserted, failed);
        } catch (Exception e) {
            log.error("Error inesperado en la sincronización de productos Urrea", e);
        }
    }

    private UrreaProductRequest toRequest(JSONObject productJson) {
        return new UrreaProductRequest(
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
    }

    private void saveLoadError(String source, String codigo, String codigoBarras, Exception exception) {
        LoadDataError error = LoadDataError.builder()
                .source(source)
                .codigo(truncate(codigo, 50))
                .codigoBarras(truncate(codigoBarras, 80))
                .message(truncate(exception.getMessage() == null ? exception.getClass().getSimpleName() : exception.getMessage(), 1000))
                .details(truncate(stackTraceToString(exception), 60000))
                .build();

        loadDataErrorRepository.save(error);
    }

    private String stackTraceToString(Throwable throwable) {
        StringWriter stringWriter = new StringWriter();
        throwable.printStackTrace(new PrintWriter(stringWriter));
        return stringWriter.toString();
    }

    private String truncate(String value, int maxLength) {
        if (value == null || value.length() <= maxLength) {
            return value;
        }
        return value.substring(0, maxLength);
    }
}

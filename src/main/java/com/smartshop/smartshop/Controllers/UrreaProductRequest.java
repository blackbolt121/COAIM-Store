package com.smartshop.smartshop.Controllers;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.smartshop.smartshop.Models.UrreaProduct;
import java.util.Objects;
import java.util.UUID;

/**
 * DTO (Data Transfer Object) for receiving product data from the API.
 * All potentially malformed fields (numbers, booleans) are accepted as Strings
 * to prevent deserialization errors. The conversion logic is centralized in the toEntity() method.
 */
public record UrreaProductRequest(
        @JsonProperty("codigo") String codigo,
        @JsonProperty("nombreLargo") String nombreLargo,
        @JsonProperty("DescripcionProducto") String descripcionProducto,
        @JsonProperty("Marca") String marca,
        @JsonProperty("Submarca") String submarca,
        @JsonProperty("familia") String familia,
        @JsonProperty("clase") String clase,
        @JsonProperty("Subclase") String subclase,
        @JsonProperty("Precio") String precio,
        @JsonProperty("Moneda") String moneda,
        @JsonProperty("Multiplo") String multiplo,
        @JsonProperty("CodigoBarras") String codigoBarras,
        @JsonProperty("EstatusInventario") String estatusInventario,
        @JsonProperty("anexo20SAT") String anexo20SAT,
        @JsonProperty("claveUnidadSAT") String claveUnidadSAT,
        @JsonProperty("bullets") String bullets,
        @JsonProperty("esJuego") String esJuego,
        @JsonProperty("piezasJuego") String piezasJuego,
        @JsonProperty("contenidoJuego") String contenidoJuego,
        @JsonProperty("accesorios") String accesorios,
        @JsonProperty("garantia") String garantia,
        @JsonProperty("empaque") String empaque,
        @JsonProperty("keywords") String keywords,
        @JsonProperty("fotografia") String fotografia,
        @JsonProperty("video") String video,
        @JsonProperty("fichaTecnica") String fichaTecnica,
        @JsonProperty("manual") String manual,
        @JsonProperty("alto") String alto,
        @JsonProperty("fondo") String fondo,
        @JsonProperty("ancho") String ancho,
        @JsonProperty("peso") String peso,
        @JsonProperty("caracteristica") String caracteristica
) {

    /**
     * Converts this DTO into a UrreaProduct entity, handling type conversions
     * and providing default values for invalid or missing data.
     * @return UrreaProduct entity ready to be persisted.
     */
    public UrreaProduct toEntity() {
        return UrreaProduct.builder()
                .safe_sku(codigo.replace("/","-").replace(" ","_"))
                .codigo(codigo)
                .nombreLargo(Objects.requireNonNullElse(nombreLargo, "").isEmpty() ? "Sin Nombre" : nombreLargo)
                .descripcionProducto(descripcionProducto)
                .marca(marca)
                .submarca(submarca)
                .familia(familia)
                .clase(clase)
                .subclase(subclase)
                .precio(parseDouble(this.precio, 0.0))
                .moneda(moneda)
                .multiplo(parseInteger(this.multiplo, 0))
                .codigoBarras(Objects.requireNonNullElse(this.codigoBarras, "").trim().isEmpty() ? this.codigo : this.codigoBarras)
                .estatusInventario(Objects.requireNonNullElse(this.estatusInventario, "").isEmpty() ? "No disponible" : this.estatusInventario)
                .anexo20SAT(anexo20SAT)
                .claveUnidadSAT(claveUnidadSAT)
                .bullets(bullets)
                .esJuego("si".equalsIgnoreCase(this.esJuego))
                .piezasJuego(parseInteger(this.piezasJuego, 0))
                .contenidoJuego(contenidoJuego)
                .accesorios(accesorios)
                .garantia(garantia)
                .empaque(empaque)
                .keywords(keywords)
                .fotografia(fotografia)
                .video(video)
                .fichaTecnica(fichaTecnica)
                .manual(manual)
                .alto(parseDouble(this.alto, 0.0))
                .fondo(parseDouble(this.fondo, 0.0))
                .ancho(parseDouble(this.ancho, 0.0))
                .peso(parseDouble(this.peso, 0.0))
                .caracteristica(caracteristica)
                .build();
    }

    /**
     * Safely parses a String into a Double.
     * @param value The string to parse.
     * @param defaultValue The default value to return if parsing fails or the string is null/empty.
     * @return The parsed Double or the default value.
     */
    private Double parseDouble(String value, Double defaultValue) {
        if (value == null || value.trim().isEmpty()) {
            return defaultValue;
        }
        try {
            return Double.parseDouble(value);
        } catch (NumberFormatException e) {
            System.err.println("Could not parse Double value: '" + value + "'. Using default value " + defaultValue);
            return defaultValue;
        }
    }

    /**
     * Safely parses a String into an Integer.
     * @param value The string to parse.
     * @param defaultValue The default value to return if parsing fails or the string is null/empty.
     * @return The parsed Integer or the default value.
     */
    private Integer parseInteger(String value, Integer defaultValue) {
        if (value == null || value.trim().isEmpty()) {
            return defaultValue;
        }
        try {
            // Handle potential decimal values in integer fields, e.g., "1.0"
            return (int) Double.parseDouble(value);
        } catch (NumberFormatException e) {
            System.err.println("Could not parse Integer value: '" + value + "'. Using default value " + defaultValue);
            return defaultValue;
        }
    }
}
/*

        ### Cambios Clave y Por Qué se Hicieron:

        1.  **Todos los Campos Problemáticos como `String`**: Campos como `precio`, `multiplo`, `piezasJuego`, `alto`, `fondo`, `ancho`, `peso` y `esJuego` ahora se declaran como `String` en el `record`. Esto asegura que Jackson pueda mapear cualquier valor JSON (ya sea `""`, `"texto"`, o `null`) sin lanzar un error de deserialización.
        2.  **Lógica de Conversión Centralizada**: Toda la responsabilidad de convertir estos `String` a los tipos correctos (`Double`, `Integer`, `Boolean`) se ha movido al método `toEntity()`.
        3.  **Métodos de Parseo Seguros**: Creé los métodos `parseDouble` y `parseInteger`. Estos:
        * Verifican si el `String` es nulo o está vacío, y si es así, devuelven un valor por defecto que tú defines (`0.0` o `0`).
        * Usan un bloque `try-catch` para manejar el caso en que el `String` no sea un número válido (ej. `"N/A"`). En lugar de que la aplicación se caiga, registrará un error en la consola y usará el valor por defecto.
4.  **Manejo de Nulos**: Se utiliza `Objects.requireNonNullElse(nombreLargo, "")` para proteger contra `NullPointerException` en caso de que un campo `String` no venga en el JSON.
5.  **Reutilización de Lógica**: Los nuevos métodos de parseo hacen que el constructor del `builder` sea mucho más limpio y fácil de leer.

Con esta clase, tu controlador ahora es mucho más resistente a los datos de mala calidad y te da un punto central para manejar las conversiones como necesite tu negoc
*/
package com.smartshop.smartshop.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import com.smartshop.smartshop.Models.Cotizacion;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CotizacionRepository extends JpaRepository<Cotizacion, String>, JpaSpecificationExecutor<Cotizacion> {
    List<Cotizacion> findAllByCorreo(String correo);
    Optional<Cotizacion> findByCorreoOrId(String correo, String id);
}

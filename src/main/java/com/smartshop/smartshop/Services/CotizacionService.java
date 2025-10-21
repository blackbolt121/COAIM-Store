package com.smartshop.smartshop.Services;

import com.smartshop.smartshop.Models.Cotizacion;
import com.smartshop.smartshop.Repositories.CotizacionRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class CotizacionService {
    private CotizacionRepository cotizacionRepository;


    public List<Cotizacion> findAll() {
        return cotizacionRepository.findAll();
    }

    public Optional<Cotizacion> findById(String id) {
        return cotizacionRepository.findById(id);
    }

    public Cotizacion save(Cotizacion cotizacion) {
        return cotizacionRepository.save(cotizacion);
    }

    public Cotizacion update(Cotizacion cotizacion) {
        return cotizacionRepository.save(cotizacion);
    }

    public void delete(Cotizacion cotizacion) {
        cotizacionRepository.delete(cotizacion);
    }

    public List<Cotizacion> findByCorreo(String correo) {
        return cotizacionRepository.findAllByCorreo(correo);
    }

    public Optional<Cotizacion> findByCorreoOrId(String correo_id) {
        return cotizacionRepository.findByCorreoOrId(correo_id, correo_id);
    }

}

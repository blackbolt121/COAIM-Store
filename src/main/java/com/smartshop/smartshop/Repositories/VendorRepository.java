package com.smartshop.smartshop.Repositories;

import com.smartshop.smartshop.Models.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, String> {
    Optional<Vendor> findByVendorName(String marca);
}

package com.smartshop.smartshop.Controllers;

import com.smartshop.smartshop.Models.Vendor;
import com.smartshop.smartshop.Repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@RestController
@RequiredArgsConstructor
@RequestMapping("/rest/api/1/vendor")
@Slf4j
public class VendorController {
    @Autowired
    private final VendorRepository vendorRepository;

    @GetMapping(path = "all")
    public ResponseEntity<List<VendorResponse>> getAllVendors() {
        log.info("Get all vendors");

        List<VendorResponse> vendorResponses = vendorRepository.findAll()
                .stream()
                .map(vendor -> new VendorResponse(
                        vendor.getVendorId(),
                        vendor.getVendorName(),
                        vendor.getVendorEmail(),
                        vendor.getVendorPhone(),
                        vendor.getVendorAddress(),
                        vendor.getVendorCity(),
                        vendor.getVendorState(),
                        vendor.getVendorZipCode(),
                        vendor.getVendorPostalCode(),
                        vendor.getVendorWebsite(),
                        vendor.getVendorWebsite(),
                        vendor.getVendorFaxUrl()
                ))
                .toList();

        return ResponseEntity.ok(vendorResponses);
    }

    @PostMapping
    public ResponseEntity<String> createVendor(@RequestBody Vendor vendor) {
        vendorRepository.save(vendor);
        String id = vendor.getVendorId();

        return ResponseEntity.status(201).body(String.format("{\"id\": \"%s\"}", id));
    }

    @PutMapping(path = "{vendorId}")
    public ResponseEntity<String> updateVendor(@PathVariable String vendorId, @RequestBody Vendor updatedVendor) {


        try {

            log.info("Updating vendor: " + updatedVendor);

            vendorRepository.save(updatedVendor);

            return ResponseEntity.status(200).build();
        }catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    @DeleteMapping(path = "{vendorId}")
    public ResponseEntity<String> deleteVendor(@PathVariable String vendorId) {
        Optional<Vendor> vendor = vendorRepository.findById(vendorId);
        vendor.ifPresent(vendorRepository::delete);
        return ResponseEntity.ok().build();
    }


}

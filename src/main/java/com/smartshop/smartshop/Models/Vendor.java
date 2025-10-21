package com.smartshop.smartshop.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String vendorId;
    private String vendorName;
    private String vendorEmail;
    private String vendorPhone;
    private String vendorAddress;
    private String vendorCity;
    private String vendorState;
    private String vendorZipCode;
    private String vendorPostalCode;
    private String vendorWebsite;
    private String vendorWebsiteUrl;
    private String vendorFaxUrl;
    @OneToMany(mappedBy = "vendor", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<Producto> productoList;
}

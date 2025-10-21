package com.smartshop.smartshop.Controllers;

public record VendorResponse(String vendorId,
        String vendorName,
        String vendorEmail,
        String vendorPhone,
        String vendorAddress,
        String vendorCity,
        String vendorState,
        String vendorZipCode,
        String vendorPostalCode,
        String vendorWebsite,
        String vendorWebsiteUrl,
        String vendorFaxUrl) {
}

package com.smartshop.smartshop.Services;


import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    @Value("${smartshop.payment.private_token}")
    private String netpay_private_token;

    @Value("${smartshop.payment.public_token}")
    private String netpay_public_token;

    @Value("${smartshop.payment.url}")
    private String netpay_url;

    public String getNetpay_public_token() {
        return this.netpay_public_token;// Prints "The API key is: ABC-123-XYZ-789"
    }

    public String getNetpay_private_token() {
        return this.netpay_private_token;
    }

    public String getNetpay_url() {
        return this.netpay_url;
    }

}

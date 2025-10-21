package com.smartshop.smartshop.Controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping(path = "/health")
@CrossOrigin
public class HealthController {


    @GetMapping
    public ResponseEntity<HashMap<String, String>> productHealth(HttpServletRequest request){


        HashMap<String, String> response = new HashMap<String, String>(){
            {
                put("status", "ok");
            }
        };
        return ResponseEntity.ok(response);
    }
}

package com.waterbilling.controller;

import com.waterbilling.model.BillingRequest;
import com.waterbilling.model.BillingResponse;
import com.waterbilling.service.BillingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @PostMapping("/calculate")
    public ResponseEntity<BillingResponse> calculateBill(@RequestBody BillingRequest request) {
        BillingResponse response = billingService.calculate(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Billing Service is UP");
    }
}

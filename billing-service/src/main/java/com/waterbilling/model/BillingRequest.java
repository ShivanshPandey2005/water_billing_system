package com.waterbilling.model;

import lombok.Data;

@Data
public class BillingRequest {
    private String flatId;
    private double units;
}

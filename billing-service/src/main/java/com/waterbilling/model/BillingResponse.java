package com.waterbilling.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillingResponse {
    private String flatId;
    private double totalUnits;
    private double totalAmount;
    private List<SlabBreakdown> breakdown;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SlabBreakdown {
        private String slab;
        private double rate;
        private double unitsInSlab;
        private double subtotal;
    }
}

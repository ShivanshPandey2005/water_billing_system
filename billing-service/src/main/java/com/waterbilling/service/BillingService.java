package com.waterbilling.service;

import com.waterbilling.model.BillingRequest;
import com.waterbilling.model.BillingResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BillingService {

    public BillingResponse calculate(BillingRequest request) {
        double units = request.getUnits();
        double remainingUnits = units;
        double totalAmount = 0;
        List<BillingResponse.SlabBreakdown> breakdown = new ArrayList<>();

        // Slab 1: 0-10 units @ 5.0
        double slab1Units = Math.min(remainingUnits, 10);
        if (slab1Units > 0) {
            double subtotal = slab1Units * 5.0;
            totalAmount += subtotal;
            breakdown.add(new BillingResponse.SlabBreakdown("0-10 units", 5.0, slab1Units, subtotal));
            remainingUnits -= slab1Units;
        }

        // Slab 2: 11-20 units @ 10.0
        double slab2Units = Math.min(remainingUnits, 10);
        if (slab2Units > 0) {
            double subtotal = slab2Units * 10.0;
            totalAmount += subtotal;
            breakdown.add(new BillingResponse.SlabBreakdown("11-20 units", 10.0, slab2Units, subtotal));
            remainingUnits -= slab2Units;
        }

        // Slab 3: 21-30 units @ 15.0
        double slab3Units = Math.min(remainingUnits, 10);
        if (slab3Units > 0) {
            double subtotal = slab3Units * 15.0;
            totalAmount += subtotal;
            breakdown.add(new BillingResponse.SlabBreakdown("21-30 units", 15.0, slab3Units, subtotal));
            remainingUnits -= slab3Units;
        }

        // Slab 4: 30+ units @ 20.0
        if (remainingUnits > 0) {
            double subtotal = remainingUnits * 20.0;
            totalAmount += subtotal;
            breakdown.add(new BillingResponse.SlabBreakdown("30+ units", 20.0, remainingUnits, subtotal));
        }

        return new BillingResponse(request.getFlatId(), units, totalAmount, breakdown);
    }
}

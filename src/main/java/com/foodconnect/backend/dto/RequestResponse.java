package com.foodconnect.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class RequestResponse {

    private Long id;
    private String status;
    private FoodResponse food;
    private UserResponse trust;
}

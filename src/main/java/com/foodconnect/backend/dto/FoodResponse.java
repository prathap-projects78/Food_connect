package com.foodconnect.backend.dto;

import lombok.*;
import java.time.*;

@Data
@AllArgsConstructor
public class FoodResponse {

    private Long id;
    private String foodName;
    private int quantity;
    private LocalDateTime expiryTime;
    private String status;
    private UserResponse restaurant;
}

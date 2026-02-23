package com.foodconnect.backend.dto;

import com.foodconnect.backend.model.Role;
import lombok.*;

@Data
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
}

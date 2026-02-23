package com.foodconnect.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private FoodListing food;

    @ManyToOne
    @JoinColumn(name = "trust_id")
    private User trust;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;
}

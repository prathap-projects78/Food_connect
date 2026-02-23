package com.foodconnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.foodconnect.backend.model.FoodListing;
import com.foodconnect.backend.model.Status;
import com.foodconnect.backend.model.User;
import java.util.List;

public interface FoodRepository extends JpaRepository<FoodListing, Long> {
    List<FoodListing> findByStatus(Status status);

    List<FoodListing> findByRestaurant(User restaurant);
}

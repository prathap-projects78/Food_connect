package com.foodconnect.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.foodconnect.backend.model.Request;
import com.foodconnect.backend.model.User;
import java.util.List;

public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByTrust(User trust);

    List<Request> findByFood_Restaurant(User restaurant);
}

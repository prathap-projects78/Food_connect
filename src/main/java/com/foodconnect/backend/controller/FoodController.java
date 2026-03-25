package com.foodconnect.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.foodconnect.backend.dto.FoodResponse;
import com.foodconnect.backend.dto.RequestResponse;
import com.foodconnect.backend.dto.UserResponse;
import com.foodconnect.backend.model.*;
import com.foodconnect.backend.repository.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/food")
@RequiredArgsConstructor
public class FoodController {

    private final FoodRepository foodRepository;
    private final UserRepository userRepository;
    private final RequestRepository requestRepository;

    @PostMapping("/accept/{foodId}/{trustId}")
    public RequestResponse acceptFood(@PathVariable Long foodId,
            @PathVariable Long trustId) {

        FoodListing food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found"));

        if (food.getStatus() != Status.AVAILABLE) {
            throw new RuntimeException("Food already accepted!");
        }

        User trust = userRepository.findById(trustId)
                .orElseThrow(() -> new RuntimeException("Trust not found"));

        food.setStatus(Status.ACCEPTED);
        foodRepository.save(food);

        Request request = new Request();
        request.setFood(food);
        request.setTrust(trust);
        request.setStatus(RequestStatus.PENDING);

        Request saved = requestRepository.save(request);

        return mapToRequestResponse(saved);
    }

    @PostMapping("/approve/{requestId}")
    public RequestResponse approveRequest(@PathVariable Long requestId) {

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(RequestStatus.APPROVED);

        FoodListing food = request.getFood();
        food.setStatus(Status.COLLECTED);

        foodRepository.save(food);

        Request saved = requestRepository.save(request);

        return mapToRequestResponse(saved);
    }

    @PostMapping("/reject/{requestId}")
    public RequestResponse rejectRequest(@PathVariable Long requestId) {

        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus(RequestStatus.REJECTED);

        FoodListing food = request.getFood();
        food.setStatus(Status.AVAILABLE);

        foodRepository.save(food);

        Request saved = requestRepository.save(request);

        return mapToRequestResponse(saved);
    }

    @PostMapping("/create/{restaurantId}")
    public FoodResponse createFood(@PathVariable Long restaurantId, @RequestBody FoodListing foodRequest) {
        User restaurant = userRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        foodRequest.setRestaurant(restaurant);
        foodRequest.setStatus(Status.AVAILABLE);

        FoodListing saved = foodRepository.save(foodRequest);
        return mapToFoodResponse(saved);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public List<FoodResponse> getRestaurantFood(@PathVariable Long restaurantId) {
        User restaurant = userRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        return foodRepository.findByRestaurant(restaurant).stream().map(this::mapToFoodResponse).toList();
    }

    @GetMapping("/restaurant/requests/{restaurantId}")
    public List<RequestResponse> getRestaurantRequests(@PathVariable Long restaurantId) {
        User restaurant = userRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        return requestRepository.findByFood_Restaurant(restaurant).stream().map(this::mapToRequestResponse).toList();
    }

    @GetMapping("/trust/requests/{trustId}")
    public List<RequestResponse> getTrustRequests(@PathVariable Long trustId) {
        User trust = userRepository.findById(trustId)
                .orElseThrow(() -> new RuntimeException("Trust not found"));
        return requestRepository.findByTrust(trust).stream().map(this::mapToRequestResponse).toList();
    }

    private RequestResponse mapToRequestResponse(Request request) {

        return new RequestResponse(
                request.getId(),
                request.getStatus().name(),
                mapToFoodResponse(request.getFood()),
                mapToUserResponse(request.getTrust()));
    }

    private FoodResponse mapToFoodResponse(FoodListing food) {

        return new FoodResponse(
                food.getId(),
                food.getFoodName(),
                food.getQuantity(),
                food.getExpiryTime(),
                food.getStatus().name(),
                mapToUserResponse(food.getRestaurant()));
    }

    private UserResponse mapToUserResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole());
    }

    @GetMapping("/available")
    public List<FoodResponse> getAvailableFood() {
        return foodRepository.findByStatus(Status.AVAILABLE).stream().map(this::mapToFoodResponse).toList();
    }
}

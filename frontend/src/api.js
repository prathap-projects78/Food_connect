const BASE_URL = 'http://localhost:9090';

export const registerUser = async (user) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const createFood = async (restaurantId, foodData) => {
    const response = await fetch(`${BASE_URL}/food/create/${restaurantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodData)
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const getAvailableFood = async () => {
    const response = await fetch(`${BASE_URL}/food/available`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const getRestaurantFood = async (restaurantId) => {
    const response = await fetch(`${BASE_URL}/food/restaurant/${restaurantId}`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const acceptFood = async (foodId, trustId) => {
    const response = await fetch(`${BASE_URL}/food/accept/${foodId}/${trustId}`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const getTrustRequests = async (trustId) => {
    const response = await fetch(`${BASE_URL}/food/trust/requests/${trustId}`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const getRestaurantRequests = async (restaurantId) => {
    const response = await fetch(`${BASE_URL}/food/restaurant/requests/${restaurantId}`);
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const approveRequest = async (requestId) => {
    const response = await fetch(`${BASE_URL}/food/approve/${requestId}`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

export const rejectRequest = async (requestId) => {
    const response = await fetch(`${BASE_URL}/food/reject/${requestId}`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error(await response.text());
    return response.json();
};

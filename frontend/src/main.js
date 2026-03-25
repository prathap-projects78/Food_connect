import * as api from './api.js';

// DOM Elements
const authSection = document.getElementById('auth-section');
const restaurantSection = document.getElementById('restaurant-section');
const trustSection = document.getElementById('trust-section');
const userInfoDiv = document.getElementById('user-info');
const welcomeMessage = document.getElementById('welcome-message');
const btnLogout = document.getElementById('btn-logout');

// Auth Toggle Tabs
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const cardLogin = document.getElementById('card-login');
const cardRegister = document.getElementById('card-register');

// Forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const addFoodForm = document.getElementById('add-food-form');

// State
let currentUser = null;

// Initialize
function init() {
  const storedUser = localStorage.getItem('foodConnectUser');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    showViewForRole(currentUser.role);
  } else {
    showViewForRole(null);
  }

  // Setup event listeners
  loginForm.addEventListener('submit', handleLogin);
  registerForm.addEventListener('submit', handleRegister);
  btnLogout.addEventListener('click', handleLogout);
  addFoodForm.addEventListener('submit', handleAddFood);

  document.getElementById('btn-refresh-rest-food').addEventListener('click', loadRestaurantFood);
  document.getElementById('btn-refresh-rest-requests').addEventListener('click', loadRestaurantRequests);
  
  document.getElementById('btn-refresh-avail-food').addEventListener('click', loadAvailableFood);
  document.getElementById('btn-refresh-trust-requests').addEventListener('click', loadTrustRequests);

  // Auth Tabs logic
  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    cardLogin.classList.remove('hidden');
    cardRegister.classList.add('hidden');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    cardRegister.classList.remove('hidden');
    cardLogin.classList.add('hidden');
  });
}

// Navigation
function showViewForRole(role) {
  authSection.style.display = 'none';
  restaurantSection.style.display = 'none';
  trustSection.style.display = 'none';
  userInfoDiv.style.display = role ? 'flex' : 'none';

  if (!role) {
    authSection.style.display = 'block';
    return;
  }

  welcomeMessage.textContent = `Hi, ${currentUser.name}`;

  if (role === 'RESTAURANT') {
    restaurantSection.style.display = 'block';
    loadRestaurantFood();
    loadRestaurantRequests();
  } else if (role === 'TRUST') {
    trustSection.style.display = 'block';
    loadAvailableFood();
    loadTrustRequests();
  }
}

// Helper formatting function
function getStatusClass(status) {
  if(!status) return 'pending';
  const s = status.toLowerCase();
  if (s === 'approved' || s === 'available') return 'approved';
  if (s === 'rejected') return 'rejected';
  return 'pending';
}

// Auth Handlers
async function handleLogin(e) {
  e.preventDefault();
  const btn = loginForm.querySelector('button');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Logging in...';
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';

  try {
    const user = await api.loginUser({ email, password });
    currentUser = user;
    localStorage.setItem('foodConnectUser', JSON.stringify(user));
    loginForm.reset();
    showViewForRole(user.role);
  } catch (err) {
    errorEl.textContent = 'Login failed. Please check credentials.';
  } finally {
    btn.innerHTML = originalText;
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const btn = registerForm.querySelector('button');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Registering...';
  
  const user = {
    name: document.getElementById('reg-name').value,
    email: document.getElementById('reg-email').value,
    password: document.getElementById('reg-password').value,
    address: document.getElementById('reg-address').value,
    contactNumber: document.getElementById('reg-contact').value,
    role: document.getElementById('reg-role').value
  };
  const errorEl = document.getElementById('register-error');
  const successEl = document.getElementById('register-success');
  errorEl.textContent = '';
  successEl.textContent = '';

  try {
    await api.registerUser(user);
    successEl.textContent = 'Registration successful! You can now log in.';
    registerForm.reset();
    setTimeout(() => tabLogin.click(), 2000);
  } catch (err) {
    errorEl.textContent = 'Registration failed. Try a different email.';
  } finally {
    btn.innerHTML = originalText;
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('foodConnectUser');
  showViewForRole(null);
}

// RESTAURANT ACTIONS
async function handleAddFood(e) {
  e.preventDefault();
  const btn = addFoodForm.querySelector('button');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Adding...';
  
  const foodData = {
    foodName: document.getElementById('food-name').value,
    quantity: parseInt(document.getElementById('food-quantity').value, 10),
    expiryTime: document.getElementById('food-expiry').value + "T23:59:59"
  };
  const msgEl = document.getElementById('add-food-message');

  try {
    await api.createFood(currentUser.id, foodData);
    msgEl.innerHTML = '<i class="ri-check-line"></i> Food added successfully!';
    msgEl.className = 'success-msg';
    addFoodForm.reset();
    setTimeout(() => { msgEl.innerHTML = ''; }, 3000);
    loadRestaurantFood();
  } catch (err) {
    msgEl.innerHTML = '<i class="ri-error-warning-line"></i> Failed to add food.';
    msgEl.className = 'error-msg';
  } finally {
    btn.innerHTML = originalText;
  }
}

async function loadRestaurantFood() {
  const container = document.getElementById('rest-food-list');
  container.innerHTML = '<div class="empty-state"><i class="ri-loader-4-line ri-spin"></i> Loading...</div>';
  try {
    const list = await api.getRestaurantFood(currentUser.id);
    if(list.length === 0) {
      container.innerHTML = '<div class="empty-state">No food listings yet. Add some!</div>';
      return;
    }
    container.innerHTML = '';
    list.forEach(food => {
      const el = document.createElement('div');
      el.className = 'list-item fade-in';
      const status = food.status || 'AVAILABLE';
      el.innerHTML = `
        <div class="item-details">
          <strong>${food.foodName}</strong>
          <span><i class="ri-group-line"></i> Qty: ${food.quantity}</span>
          <span class="status-badge ${getStatusClass(status)}">${status}</span>
        </div>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    container.innerHTML = '<div class="empty-state error-msg">Error loading food.</div>';
  }
}

async function loadRestaurantRequests() {
  const container = document.getElementById('rest-requests-list');
  container.innerHTML = '<div class="empty-state"><i class="ri-loader-4-line ri-spin"></i> Loading...</div>';
  try {
    const list = await api.getRestaurantRequests(currentUser.id);
    if(list.length === 0) {
      container.innerHTML = '<div class="empty-state">No pending requests.</div>';
      return;
    }
    container.innerHTML = '';
    list.forEach(req => {
      const el = document.createElement('div');
      el.className = 'list-item fade-in';
      
      let actions = '';
      if(req.status === 'PENDING') {
         actions = `
          <div class="actions">
            <button class="btn btn-icon btn-accept" onclick="window.approveReq(${req.id})" title="Approve">
              <i class="ri-check-line"></i>
            </button>
            <button class="btn btn-icon btn-reject" onclick="window.rejectReq(${req.id})" title="Reject">
              <i class="ri-close-line"></i>
            </button>
          </div>`;
      }
      
      el.innerHTML = `
        <div class="item-details">
          <strong>Food: ${req.food.foodName}</strong>
          <span><i class="ri-building-line"></i> Trust: ${req.trust.name}</span>
          <span class="status-badge ${getStatusClass(req.status)}">${req.status}</span>
        </div>
        ${actions}
      `;
      container.appendChild(el);
    });
  } catch (err) {
    container.innerHTML = '<div class="empty-state error-msg">Error loading requests.</div>';
  }
}

// TRUST ACTIONS
async function loadAvailableFood() {
  const container = document.getElementById('avail-food-list');
  container.innerHTML = '<div class="empty-state"><i class="ri-loader-4-line ri-spin"></i> Loading...</div>';
  try {
    const list = await api.getAvailableFood();
    if(list.length === 0) {
      container.innerHTML = '<div class="empty-state">No food available currently. Check back later!</div>';
      return;
    }
    container.innerHTML = '';
    list.forEach(food => {
      const el = document.createElement('div');
      el.className = 'list-item fade-in';
      el.innerHTML = `
        <div class="item-details">
          <strong>${food.foodName}</strong>
          <span><i class="ri-restaurant-line"></i> Rest: ${food.restaurant.name}</span>
          <span><i class="ri-group-line"></i> Qty: ${food.quantity}</span>
          <span><i class="ri-calendar-line"></i> Exp: ${new Date(food.expiryTime).toLocaleDateString()}</span>
        </div>
        <button class="btn btn-primary" onclick="window.acceptFoodId(${food.id}, this)">
          Claim
        </button>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    container.innerHTML = '<div class="empty-state error-msg">Error loading food.</div>';
  }
}

async function loadTrustRequests() {
  const container = document.getElementById('trust-requests-list');
  container.innerHTML = '<div class="empty-state"><i class="ri-loader-4-line ri-spin"></i> Loading...</div>';
  try {
    const list = await api.getTrustRequests(currentUser.id);
    if(list.length === 0) {
      container.innerHTML = '<div class="empty-state">You have not requested any food yet.</div>';
      return;
    }
    container.innerHTML = '';
    list.forEach(req => {
      const el = document.createElement('div');
      el.className = 'list-item fade-in';
      el.innerHTML = `
        <div class="item-details">
          <strong>Requested Food: ${req.food.foodName}</strong>
          <span class="status-badge ${getStatusClass(req.status)}">${req.status}</span>
        </div>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    container.innerHTML = '<div class="empty-state error-msg">Error loading requests.</div>';
  }
}

// Global exposure for inline onclick handlers
window.approveReq = async (id) => {
  await api.approveRequest(id);
  loadRestaurantRequests();
};
window.rejectReq = async (id) => {
  await api.rejectRequest(id);
  loadRestaurantRequests();
};
window.acceptFoodId = async (id, btnElement) => {
  const originalText = btnElement.innerHTML;
  btnElement.innerHTML = '<i class="ri-loader-4-line ri-spin"></i>';
  btnElement.disabled = true;
  try {
    await api.acceptFood(id, currentUser.id);
    loadAvailableFood();
    loadTrustRequests();
    // Use a small custom notification instead of alert natively
    const msg = document.getElementById('avail-food-message');
    msg.className = 'success-msg fade-in';
    msg.innerHTML = '<i class="ri-check-line"></i> Food requested successfully!';
    setTimeout(() => msg.innerHTML = '', 4000);
  } catch(e) {
    alert('Failed to accept food.');
    btnElement.innerHTML = originalText;
    btnElement.disabled = false;
  }
};

window.onload = init;

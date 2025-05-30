// LIFF App Configuration
// ⚠️ สำคัญ: ให้แทนที่ 'YOUR_LIFF_ID' ด้วย LIFF ID จริงที่ได้จาก LINE Developers Console
// LIFF ID จะเป็นรูปแบบ: 1234567890-abcdefgh
const LIFF_ID = '2007504943-2vqZgdQz'; // LIFF ID จริงของคุณ

// Firebase Configuration (เหมือนกับใน admin-script.js)
const firebaseConfig = {
    // ⚠️ ต้องแทนที่ด้วยค่าจริงจาก Firebase Console
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (uncomment when ready to use)
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// Enhanced menu data with real food images
const menuData = [
    {
        id: 1,
        name: 'smoothies bowl',
        description: 'Fresh mixed berries smoothie bowl with granola',
        price: 20000,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop',
        rating: 4.5,
        deliveryTime: '15-25 mins',
        discount: null,
        isPopular: true,
        popularCategory: 'breakfast'
    },
    {
        id: 2,
        name: 'salad with sesame chicken',
        description: 'Fresh salad with grilled sesame chicken',
        price: 25000,
        category: 'healthy',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
        rating: 4.7,
        deliveryTime: '20-30 mins',
        discount: 15,
        isPopular: true,
        popularCategory: 'healthy'
    },
    {
        id: 3,
        name: 'Turkey sandwich',
        description: 'Grilled turkey sandwich with fresh vegetables',
        price: 18000,
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop',
        rating: 4.3,
        deliveryTime: '15-20 mins',
        discount: null,
        isPopular: true,
        popularCategory: 'lunch'
    },
    {
        id: 4,
        name: 'Chicken Wings',
        description: 'Crispy buffalo chicken wings with ranch sauce',
        price: 22000,
        category: 'snack',
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop',
        rating: 4.4,
        deliveryTime: '25-35 mins',
        discount: 20,
        isPopular: true,
        popularCategory: 'snack'
    },
    {
        id: 5,
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        price: 8000,
        category: 'drink',
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
        rating: 4.0,
        deliveryTime: '5-10 mins',
        discount: null,
        isPopular: false,
        popularCategory: 'drink'
    },
    {
        id: 6,
        name: 'Avocado Toast',
        description: 'Healthy avocado toast with poached egg',
        price: 15000,
        category: 'healthy',
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
        rating: 4.6,
        deliveryTime: '10-15 mins',
        discount: 10,
        isPopular: true,
        popularCategory: 'healthy'
    },
    {
        id: 7,
        name: 'Beef Burger',
        description: 'Juicy beef burger with cheese and fries',
        price: 28000,
        category: 'lunch',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        rating: 4.2,
        deliveryTime: '25-35 mins',
        discount: null,
        isPopular: true,
        popularCategory: 'lunch'
    },
    {
        id: 8,
        name: 'Green Tea Latte',
        description: 'Creamy matcha green tea latte',
        price: 12000,
        category: 'drink',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
        rating: 4.1,
        deliveryTime: '5-10 mins',
        discount: null,
        isPopular: true,
        popularCategory: 'drink'
    },
    {
        id: 9,
        name: 'Pancakes Stack',
        description: 'Fluffy pancakes with maple syrup and berries',
        price: 16000,
        category: 'breakfast',
        image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop',
        rating: 4.8,
        deliveryTime: '15-25 mins',
        discount: null,
        isPopular: true,
        popularCategory: 'breakfast'
    },
    {
        id: 10,
        name: 'Pasta Carbonara',
        description: 'Creamy pasta carbonara with bacon',
        price: 24000,
        category: 'dinner',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
        rating: 4.5,
        deliveryTime: '30-40 mins',
        discount: null,
        isPopular: true,
        popularCategory: 'dinner'
    }
];

// Cart state
let cart = [];
let currentCategory = 'all';
let currentPopularCategory = 'breakfast';
let userProfile = null;
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let deliveryAddress = JSON.parse(localStorage.getItem('deliveryAddress') || '{"name": "Home", "address": "Bangkok, Thailand", "phone": "080-123-4567", "note": ""}');
let currentSection = 'home'; // home, explore, favorites, profile

// Initialize LIFF
async function initializeLiff() {
    try {
        await liff.init({ liffId: LIFF_ID });
        
        if (liff.isLoggedIn()) {
            getUserProfile();
        } else {
            liff.login();
        }
    } catch (error) {
        console.error('LIFF initialization failed', error);
        // For demo purposes, show mock user
        showMockUser();
    }
    
    hideLoading();
    loadPopularMenus();
    loadMenu();
    setupSearch();
    updateFavoritesCount();
    updateDeliveryAddress();
}

// Show mock user for demo
function showMockUser() {
    const userName = 'Nathan';
    const userAvatar = document.getElementById('userAvatar');
    const profileAvatarLarge = document.getElementById('profileAvatarLarge');
    const profileName = document.getElementById('profileName');
    const userNameSpan = document.getElementById('userName');
    
    // Update profile with Nathan's image
    const avatarUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face';
    userAvatar.src = avatarUrl;
    userAvatar.alt = userName;
    profileAvatarLarge.src = avatarUrl;
    profileAvatarLarge.alt = userName;
    profileName.textContent = userName;
    userNameSpan.textContent = userName;
}

// Get user profile from LINE
async function getUserProfile() {
    try {
        const profile = await liff.getProfile();
        const userAvatar = document.getElementById('userAvatar');
        const profileAvatarLarge = document.getElementById('profileAvatarLarge');
        const profileName = document.getElementById('profileName');
        const userNameSpan = document.getElementById('userName');
        
        // Update profile circles
        if (profile.pictureUrl) {
            userAvatar.src = profile.pictureUrl;
            profileAvatarLarge.src = profile.pictureUrl;
        } else {
            const avatarUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face';
            userAvatar.src = avatarUrl;
            profileAvatarLarge.src = avatarUrl;
        }
        
        userAvatar.alt = profile.displayName;
        profileAvatarLarge.alt = profile.displayName;
        profileName.textContent = profile.displayName;
        userNameSpan.textContent = profile.displayName.split(' ')[0]; // First name only
        userProfile = profile;
    } catch (error) {
        console.error('Error getting profile', error);
        showMockUser();
    }
}

// Update favorites count
function updateFavoritesCount() {
    document.getElementById('favoritesCount').textContent = `${favorites.length} รายการ`;
}

// Update delivery address display
function updateDeliveryAddress() {
    const addressDisplay = document.getElementById('deliveryAddress');
    addressDisplay.textContent = `${deliveryAddress.name} - ${deliveryAddress.address}`;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterMenuBySearch(searchTerm);
    });
}

// Filter menu by search term
function filterMenuBySearch(searchTerm) {
    if (!searchTerm) {
        loadMenu();
        return;
    }
    
    const filteredMenu = menuData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
    );
    
    displayMenuItems(filteredMenu);
}

// Load popular menus based on category
function loadPopularMenus() {
    const filteredMenus = menuData.filter(item => 
        item.popularCategory === currentPopularCategory && item.isPopular
    );
    
    displayPopularMenus(filteredMenus);
}

// Display popular menus
function displayPopularMenus(items) {
    const container = document.getElementById('popularMenuGrid');
    
    container.innerHTML = items.map(item => `
        <div class="popular-menu-card">
            <div class="popular-menu-image">
                <img src="${item.image}" alt="${item.name}">
                <button class="menu-heart" onclick="toggleFavorite(${item.id})" 
                        title="${favorites.includes(item.id) ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas fa-heart ${favorites.includes(item.id) ? 'text-red' : ''}"></i>
                </button>
                ${item.rating ? `
                    <div class="menu-rating">
                        <i class="fas fa-star"></i>
                        ${item.rating}
                    </div>
                ` : ''}
            </div>
            <div class="popular-menu-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-footer">
                    <div class="menu-price">Rp ${item.price.toLocaleString()}</div>
                    <button class="add-btn" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter popular menus by category
function filterPopular(category) {
    currentPopularCategory = category;
    
    // Update active tab
    document.querySelectorAll('.category-tab-horizontal').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadPopularMenus();
}

// Filter by main category
function filterByCategory(category) {
    currentCategory = category;
    const filteredMenu = menuData.filter(item => item.category === category);
    displayMenuItems(filteredMenu);
    
    // Scroll to menu section
    document.querySelector('.menu-modern').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Load menu items with enhanced design
function loadMenu() {
    const filteredMenu = currentCategory === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);
    
    displayMenuItems(filteredMenu);
}

// Display menu items with modern design
function displayMenuItems(items) {
    const menuContainer = document.getElementById('menuItems');
    
    menuContainer.innerHTML = items.map(item => `
        <div class="menu-item-modern" data-category="${item.category}">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}">
                
                ${item.rating ? `
                    <div class="rating-badge">
                        <i class="fas fa-star"></i>
                        ${item.rating}
                    </div>
                ` : ''}
                
                ${item.discount ? `
                    <div class="discount-label">
                        -${item.discount}%
                    </div>
                ` : ''}
                
                <button class="favorite-btn" onclick="toggleFavorite(${item.id})" 
                        title="${favorites.includes(item.id) ? 'ลบจากรายการโปรด' : 'เพิ่มในรายการโปรด'}">
                    <i class="fas fa-heart ${favorites.includes(item.id) ? 'text-red' : ''}"></i>
                </button>
            </div>
            
            <div class="menu-item-content-modern">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                
                <div class="menu-item-footer-modern">
                    <div>
                        <div class="price-modern">Rp ${item.price.toLocaleString()}</div>
                        <div class="delivery-time">
                            <i class="fas fa-clock"></i>
                            ${item.deliveryTime}
                        </div>
                    </div>
                    
                    <button class="add-to-cart-modern" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle favorite items
function toggleFavorite(itemId) {
    const index = favorites.indexOf(itemId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('Removed from favorites', 'info');
    } else {
        favorites.push(itemId);
        showNotification('Added to favorites', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    
    // Refresh current view
    loadPopularMenus();
    if (currentSection === 'home') {
        loadMenu();
    } else if (currentSection === 'favorites') {
        navigateToFavorites();
    } else if (currentSection === 'explore') {
        navigateToExplore();
    }
}

// Add item to cart with animation
function addToCart(itemId) {
    const item = menuData.find(item => item.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    showAddToCartAnimation();
    showNotification(`Added ${item.name} to cart`, 'success');
}

// Remove item from cart
function removeFromCart(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    updateCartUI();
    
    if (item) {
        showNotification(`Removed ${item.name} from cart`, 'info');
    }
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartUI();
        }
    }
}

// Update cart UI with modern design
function updateCartUI() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Update cart badges
    const cartBadgeNav = document.getElementById('cartBadgeNav');
    if (cartBadgeNav) {
        cartBadgeNav.textContent = cartCount;
    }
    
    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) {
        totalPriceEl.textContent = cartTotal.toLocaleString();
    }
    
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-modern">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some delicious food from the menu</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item-modern">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info-modern">
                    <h4>${item.name}</h4>
                    <p>Rp ${item.price.toLocaleString()} x ${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString()}</p>
                </div>
                <div class="quantity-controls-modern">
                    <button class="quantity-btn-modern" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn-modern" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Enable/disable checkout button
    const checkoutBtn = document.querySelector('.checkout-btn-modern');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('show');
    
    // Update cart content when opening
    if (cartSidebar.classList.contains('open')) {
        updateCartUI();
    }
}

// Enhanced checkout process with address
async function checkout() {
    if (cart.length === 0) return;
    
    const orderSummary = cart.map(item => 
        `${item.name} x${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 5000;
    const total = subtotal + deliveryFee;
    
    const message = `🍽️ Order Summary

${orderSummary}

Subtotal: Rp ${subtotal.toLocaleString()}
Delivery Fee: Rp ${deliveryFee.toLocaleString()}
💰 Total: Rp ${total.toLocaleString()}

📍 Delivery Address: ${deliveryAddress.name}
${deliveryAddress.address}
📞 ${deliveryAddress.phone}
${deliveryAddress.note ? `📝 ${deliveryAddress.note}` : ''}

⏰ Estimated delivery: 30-45 minutes

Thank you for your order! 🙏`;
    
    try {
        // Save order to system
        await saveOrderToSystem();
        
        if (liff.isApiAvailable('sendMessages')) {
            await liff.sendMessages([{
                type: 'text',
                text: message
            }]);
            
            showSuccessModal('Order placed successfully!');
            clearCart();
        } else {
            // Fallback: close LIFF and send message
            liff.closeWindow();
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showSuccessModal('Order placed successfully! (Demo Mode)');
        clearCart();
    }
}

// Save order to system (enhanced with address)
async function saveOrderToSystem() {
    const orderData = {
        id: generateOrderId(),
        customerName: userProfile ? userProfile.displayName : 'Nathan',
        customerAvatar: userProfile ? userProfile.displayName.charAt(0) : 'N',
        customerId: userProfile ? userProfile.userId : null,
        timestamp: new Date(),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: 5000,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5000,
        status: 'pending',
        deliveryAddress: deliveryAddress,
        estimatedTime: '30-45 minutes'
    };
    
    try {
        // Save to localStorage for demo
        const existingOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        existingOrders.unshift(orderData);
        localStorage.setItem('adminOrders', JSON.stringify(existingOrders));
        
        console.log('Order saved:', orderData);
    } catch (error) {
        console.error('Error saving order:', error);
    }
}

// Generate Order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD${timestamp}${random}`.slice(-10);
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartUI();
    toggleCart();
}

// Enhanced success modal
function showSuccessModal(message) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3001;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 300px;
                width: 90%;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <div style="
                    width: 60px;
                    height: 60px;
                    background: #4CAF50;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    color: white;
                    font-size: 24px;
                ">✓</div>
                <h3 style="color: #1a1a1a; margin-bottom: 15px; font-size: 1.3rem;">Success!</h3>
                <p style="color: #8b8b8b; margin-bottom: 25px; line-height: 1.5;">${message}</p>
                <button onclick="this.closest('div').remove()" style="
                    background: #ff6b6b;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                ">OK</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.remove();
        }
    }, 5000);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const colors = {
        success: '#4CAF50',
        error: '#F44336',
        warning: '#FF9800',
        info: '#2196F3'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Enhanced add to cart animation
function showAddToCartAnimation() {
    // Add visual feedback for the add to cart action
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff6b6b;
        color: white;
        padding: 10px 20px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 3000;
        opacity: 0;
        transition: all 0.3s ease;
    `;
    notification.innerHTML = '<i class="fas fa-check"></i> Added to cart';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, -50%) scale(1.1)';
    }, 50);
    
    // Animate out
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 1500);
}

// Hide loading screen
function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
}

// Navigation functions
function navigateToHome() {
    currentSection = 'home';
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    // Show home content, hide profile
    document.getElementById('homeContent').style.display = 'block';
    document.getElementById('profileSection').classList.add('hidden');
    
    // Reset to all categories
    currentCategory = 'all';
    currentPopularCategory = 'breakfast';
    document.querySelectorAll('.category-tab-horizontal').forEach(tab => tab.classList.remove('active'));
    document.querySelector('.category-tab-horizontal').classList.add('active');
    loadPopularMenus();
    loadMenu();
}

function navigateToExplore() {
    currentSection = 'explore';
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    // Show home content, hide profile
    document.getElementById('homeContent').style.display = 'block';
    document.getElementById('profileSection').classList.add('hidden');
    
    // Show popular items
    const popularItems = menuData.filter(item => item.isPopular);
    displayMenuItems(popularItems);
    showNotification('Showing popular items', 'info');
}

function navigateToFavorites() {
    currentSection = 'favorites';
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    // Show home content, hide profile
    document.getElementById('homeContent').style.display = 'block';
    document.getElementById('profileSection').classList.add('hidden');
    
    // Show favorite items
    const favoriteItems = menuData.filter(item => favorites.includes(item.id));
    
    if (favoriteItems.length === 0) {
        document.getElementById('menuItems').innerHTML = `
            <div style="
                text-align: center;
                padding: 60px 20px;
                color: #8b8b8b;
                grid-column: 1 / -1;
            ">
                <i class="fas fa-heart" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 10px; color: #1a1a1a;">No favorites yet</h3>
                <p>Add some delicious food to your favorites by clicking the ♥ button</p>
            </div>
        `;
    } else {
        displayMenuItems(favoriteItems);
    }
}

function navigateToProfile() {
    currentSection = 'profile';
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    // Hide home content, show profile
    document.getElementById('homeContent').style.display = 'none';
    document.getElementById('profileSection').classList.remove('hidden');
    
    updateFavoritesCount();
}

// Profile functions
function editAddress() {
    // Load current address data into form
    document.getElementById('addressName').value = deliveryAddress.name;
    document.getElementById('fullAddress').value = deliveryAddress.address;
    document.getElementById('phoneNumber').value = deliveryAddress.phone;
    document.getElementById('addressNote').value = deliveryAddress.note;
    
    // Show modal
    document.getElementById('addressModal').classList.add('show');
    document.getElementById('overlay').classList.add('show');
}

function closeAddressModal() {
    document.getElementById('addressModal').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
}

function saveAddress() {
    // Get form data
    const newAddress = {
        name: document.getElementById('addressName').value,
        address: document.getElementById('fullAddress').value,
        phone: document.getElementById('phoneNumber').value,
        note: document.getElementById('addressNote').value
    };
    
    // Validate
    if (!newAddress.name || !newAddress.address || !newAddress.phone) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }
    
    // Save to localStorage
    deliveryAddress = newAddress;
    localStorage.setItem('deliveryAddress', JSON.stringify(deliveryAddress));
    
    // Update display
    updateDeliveryAddress();
    
    // Close modal
    closeAddressModal();
    
    showNotification('Address saved successfully', 'success');
}

function showOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    const userOrders = orders.filter(order => 
        order.customerName === (userProfile ? userProfile.displayName : 'Nathan')
    );
    
    if (userOrders.length === 0) {
        showNotification('No order history found', 'info');
        return;
    }
    
    const historyText = userOrders.slice(0, 3).map(order => 
        `#${order.id} - Rp ${order.total.toLocaleString()} (${order.status})`
    ).join('\n');
    
    alert(`Order History (Last 3 orders):\n\n${historyText}\n\nView more details in Admin Panel`);
}

function showProfileFavorites() {
    navigateToFavorites();
}

function showSettings() {
    showNotification('Settings feature coming soon', 'info');
}

function showHelp() {
    const helpText = `🍽️ How to use Food Delivery App:

1. 🏠 Home - Browse food menu
2. 🔍 Search - Find your favorite food
3. ❤️ Favorites - Save your favorite items
4. 🛒 Cart - Add items and place order
5. 👤 Profile - Manage address and info

📞 Contact: +62 XXX-XXX-XXXX
📧 Email: support@fooddelivery.com`;
    
    alert(helpText);
}

function closeAllModals() {
    document.getElementById('addressModal').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
    
    // Only close cart if clicking on overlay
    if (event.target.id === 'overlay') {
        document.getElementById('cartSidebar').classList.remove('open');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLiff();
    
    // Add click events to bottom navigation
    document.addEventListener('click', function(e) {
        const navItem = e.target.closest('.nav-item');
        if (navItem && !navItem.classList.contains('cart-nav')) {
            const iconClass = navItem.querySelector('i').className;
            
            if (iconClass.includes('fa-home')) {
                navigateToHome();
            } else if (iconClass.includes('fa-list')) {
                navigateToExplore();
            } else if (iconClass.includes('fa-heart')) {
                navigateToFavorites();
            } else if (iconClass.includes('fa-user')) {
                navigateToProfile();
            }
        }
    });
});

// Handle LIFF errors
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Handle back button on mobile
window.addEventListener('popstate', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (cartSidebar.classList.contains('open')) {
        toggleCart();
        e.preventDefault();
    }
});

// Add some CSS for enhanced features
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .text-red {
        color: #ff6b6b !important;
    }
    
    .menu-item-modern .favorite-btn .text-red,
    .popular-menu-card .menu-heart .text-red {
        color: #ff6b6b !important;
    }
    
    @media (max-width: 768px) {
        .cart-sidebar-modern {
            width: 100%;
            max-width: 100%;
        }
    }
`;
document.head.appendChild(additionalStyles); 
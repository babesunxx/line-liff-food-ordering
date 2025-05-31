// ===== FOODORDER - SIMPLE FOOD DELIVERY WEB APP =====

// Global Variables
let liff;
let userProfile = null;
let cart = JSON.parse(localStorage.getItem('foodorder_cart')) || [];
let currentRestaurant = null;

// Sample Data
const categories = [
    { id: 'thai', name: 'อาหารไทย', icon: '🇹🇭', count: 24 },
    { id: 'japanese', name: 'ญี่ปุ่น', icon: '🍣', count: 18 },
    { id: 'korean', name: 'เกาหลี', icon: '🇰🇷', count: 15 },
    { id: 'western', name: 'ฝรั่ง', icon: '🍔', count: 32 },
    { id: 'chinese', name: 'จีน', icon: '🥟', count: 21 },
    { id: 'dessert', name: 'ของหวาน', icon: '🍰', count: 12 }
];

const restaurants = [
    {
        id: 1,
        name: "ร้านอาหารไทยแท้",
        cuisine: "อาหารไทย",
        image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=300&fit=crop",
        rating: 4.5,
        deliveryTime: "20-30 นาที",
        deliveryFee: 25,
        category: "thai",
        menu: [
            { id: 1, name: "ผัดไทย", description: "ผัดไทยกุ้งสด", price: 120, image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=200&h=150&fit=crop" },
            { id: 2, name: "ส้มตำ", description: "ส้มตำปูปลาร้า", price: 80, image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=200&h=150&fit=crop" },
            { id: 3, name: "แกงเขียวหวาน", description: "แกงเขียวหวานไก่", price: 150, image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=200&h=150&fit=crop" }
        ]
    },
    {
        id: 2,
        name: "Sushi Master",
        cuisine: "อาหารญี่ปุ่น",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
        rating: 4.8,
        deliveryTime: "30-40 นาที",
        deliveryFee: 35,
        category: "japanese",
        menu: [
            { id: 4, name: "ซูชิแซลมอน", description: "ซูชิแซลมอนสด", price: 180, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=150&fit=crop" },
            { id: 5, name: "ราเมน", description: "ราเมนหมูชาชู", price: 220, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200&h=150&fit=crop" }
        ]
    },
    {
        id: 3,
        name: "Korean BBQ House",
        cuisine: "อาหารเกาหลี",
        image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
        rating: 4.6,
        deliveryTime: "25-35 นาที",
        deliveryFee: 30,
        category: "korean",
        menu: [
            { id: 6, name: "บิบิมบับ", description: "ข้าวยำเกาหลี", price: 160, image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=200&h=150&fit=crop" },
            { id: 7, name: "กิมจิจิแก", description: "ซุปกิมจิ", price: 140, image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=200&h=150&fit=crop" }
        ]
    },
    {
        id: 4,
        name: "Burger Station",
        cuisine: "อาหารฝรั่ง",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        rating: 4.3,
        deliveryTime: "15-25 นาที",
        deliveryFee: 20,
        category: "western",
        menu: [
            { id: 8, name: "เบอร์เกอร์เนื้อ", description: "เบอร์เกอร์เนื้อชีส", price: 180, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=150&fit=crop" },
            { id: 9, name: "เฟรนช์ฟรายส์", description: "มันฝรั่งทอดกรอบ", price: 80, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=150&fit=crop" }
        ]
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Initialize LIFF
        await liff.init({ liffId: '2007504943-2vqZgdQz' });
        
        if (liff.isLoggedIn()) {
            userProfile = await liff.getProfile();
            updateUserProfile();
        }
    } catch (error) {
        console.error('LIFF initialization failed:', error);
        // Fallback for testing
        userProfile = {
            displayName: 'ผู้ใช้',
            pictureUrl: 'https://via.placeholder.com/40'
        };
        updateUserProfile();
    }
    
    // Load app data
    loadCategories();
    loadRestaurants();
    updateCartUI();
    setupEventListeners();
}

function updateUserProfile() {
    if (userProfile) {
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        
        if (userAvatar) userAvatar.src = userProfile.pictureUrl;
        if (userName) userName.textContent = `สวัสดี ${userProfile.displayName}!`;
    }
}

// ===== LOAD DATA =====
function loadCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    container.innerHTML = categories.map(category => `
        <div class="category-card" onclick="filterByCategory('${category.id}')">
            <div class="category-icon">${category.icon}</div>
            <div class="category-name">${category.name}</div>
            <div class="category-count">${category.count} ร้าน</div>
        </div>
    `).join('');
}

function loadRestaurants(filteredRestaurants = restaurants) {
    const container = document.getElementById('restaurantsGrid');
    if (!container) return;
    
    container.innerHTML = filteredRestaurants.map(restaurant => `
        <div class="restaurant-card" onclick="openRestaurant(${restaurant.id})">
            <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
            <div class="restaurant-content">
                <div class="restaurant-header">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-rating">
                        <i class="fas fa-star"></i>
                        <span>${restaurant.rating}</span>
                    </div>
                </div>
                <p class="restaurant-cuisine">${restaurant.cuisine}</p>
                <div class="restaurant-meta">
                    <div class="delivery-info">
                        <i class="fas fa-clock"></i>
                        <span>${restaurant.deliveryTime}</span>
                    </div>
                    <div class="delivery-fee">฿${restaurant.deliveryFee}</div>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Close modals when clicking overlay
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
}

// ===== SEARCH & FILTER =====
function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();
    
    if (query === '') {
        loadRestaurants();
        return;
    }
    
    const filtered = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query)
    );
    
    loadRestaurants(filtered);
    showToast(`พบ ${filtered.length} ร้านที่ตรงกับ "${query}"`);
}

function filterByCategory(categoryId) {
    const filtered = restaurants.filter(restaurant => restaurant.category === categoryId);
    loadRestaurants(filtered);
    
    const categoryName = categories.find(cat => cat.id === categoryId)?.name || categoryId;
    showToast(`แสดงร้าน${categoryName}`);
}

function handleSort(event) {
    const sortBy = event.target.value;
    let sorted = [...restaurants];
    
    switch (sortBy) {
        case 'rating':
            sorted.sort((a, b) => b.rating - a.rating);
            break;
        case 'delivery':
            sorted.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
            break;
        case 'distance':
            sorted.sort((a, b) => a.deliveryFee - b.deliveryFee);
            break;
    }
    
    loadRestaurants(sorted);
    showToast(`เรียงตาม${getSortLabel(sortBy)}`);
}

function getSortLabel(sortBy) {
    const labels = {
        'rating': 'เรตติ้งสูงสุด',
        'delivery': 'ส่งเร็วที่สุด',
        'distance': 'ใกล้ที่สุด'
    };
    return labels[sortBy] || sortBy;
}

// ===== RESTAURANT MODAL =====
function openRestaurant(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    currentRestaurant = restaurant;
    
    // Update modal content
    document.getElementById('restaurantName').textContent = restaurant.name;
    document.getElementById('restaurantImage').src = restaurant.image;
    document.getElementById('restaurantRating').textContent = restaurant.rating;
    document.getElementById('restaurantDelivery').textContent = restaurant.deliveryTime;
    
    // Load menu
    loadMenu(restaurant.menu);
    
    // Show modal
    document.getElementById('restaurantModal').classList.add('show');
}

function closeRestaurant() {
    document.getElementById('restaurantModal').classList.remove('show');
    currentRestaurant = null;
}

function loadMenu(menu) {
    const container = document.getElementById('menuItems');
    if (!container) return;
    
    container.innerHTML = menu.map(item => `
        <div class="menu-item">
            <div class="menu-item-info">
                <h5 class="menu-item-name">${item.name}</h5>
                <p class="menu-item-description">${item.description}</p>
                <div class="menu-item-price">฿${item.price}</div>
            </div>
            <button class="add-btn" onclick="addToCart(${item.id})">
                <i class="fas fa-plus"></i>
                เพิ่ม
            </button>
        </div>
    `).join('');
}

// ===== CART SYSTEM =====
function addToCart(itemId) {
    if (!currentRestaurant) return;
    
    const menuItem = currentRestaurant.menu.find(item => item.id === itemId);
    if (!menuItem) return;
    
    const existingItem = cart.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            image: menuItem.image,
            restaurantName: currentRestaurant.name,
            quantity: 1
        });
    }
    
    localStorage.setItem('foodorder_cart', JSON.stringify(cart));
    updateCartUI();
    showToast(`เพิ่ม ${menuItem.name} ลงตะกร้าแล้ว`);
}

function updateCartQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== itemId);
    }
    
    localStorage.setItem('foodorder_cart', JSON.stringify(cart));
    updateCartUI();
    loadCartItems();
}

function updateCartUI() {
    const cartButton = document.getElementById('cartButton');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = `฿${totalPrice.toLocaleString()}`;
    
    if (cartButton) {
        cartButton.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// ===== CART MODAL =====
function openCart() {
    loadCartItems();
    document.getElementById('cartModal').classList.add('show');
}

function closeCart() {
    document.getElementById('cartModal').classList.remove('show');
}

function loadCartItems() {
    const container = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const finalTotalElement = document.getElementById('finalTotal');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>ตะกร้าว่างเปล่า</h3>
                <p>เลือกเมนูอร่อยใส่ตะกร้า</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h5 class="cart-item-name">${item.name}</h5>
                <div class="cart-item-price">฿${(item.price * item.quantity).toLocaleString()}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 30;
    const total = subtotal + deliveryFee;
    
    if (subtotalElement) subtotalElement.textContent = `฿${subtotal.toLocaleString()}`;
    if (finalTotalElement) finalTotalElement.textContent = `฿${total.toLocaleString()}`;
}

// ===== ORDER SYSTEM =====
function placeOrder() {
    if (cart.length === 0) {
        showToast('ตะกร้าว่างเปล่า กรุณาเลือกเมนู');
        return;
    }
    
    // Create order summary
    const orderSummary = {
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: 30,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 30,
        timestamp: new Date().toLocaleString('th-TH')
    };
    
    // Send to LINE if available
    if (liff && liff.isLoggedIn()) {
        const message = createOrderMessage(orderSummary);
        liff.sendMessages([{
            type: 'text',
            text: message
        }]).then(() => {
            showToast('ส่งออเดอร์ไปยัง LINE แล้ว');
        }).catch(err => {
            console.error('Error sending message:', err);
            showToast('ส่งออเดอร์สำเร็จ!');
        });
    } else {
        showToast('ส่งออเดอร์สำเร็จ!');
    }
    
    // Clear cart
    cart = [];
    localStorage.setItem('foodorder_cart', JSON.stringify(cart));
    updateCartUI();
    closeCart();
}

function createOrderMessage(order) {
    let message = `🍽️ ออเดอร์อาหาร\n\n`;
    
    order.items.forEach(item => {
        message += `${item.name} x${item.quantity} = ฿${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\n💰 ยอดรวม: ฿${order.subtotal.toLocaleString()}`;
    message += `\n🚚 ค่าส่ง: ฿${order.deliveryFee}`;
    message += `\n💳 รวมทั้งหมด: ฿${order.total.toLocaleString()}`;
    message += `\n\n📅 ${order.timestamp}`;
    
    return message;
}

// ===== UTILITY FUNCTIONS =====
function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('show');
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
} 
// ===== GRABFOOD-INSPIRED JAVASCRIPT =====

// Global Variables
let liff;
let userProfile = null;
let cart = [];
let favorites = JSON.parse(localStorage.getItem('grabfood_favorites')) || [];
let currentSection = 'home';
let searchTimeout;

// GrabFood Restaurant Data
const restaurants = [
    {
        id: 1,
        name: "McDonald's",
        cuisine: "Fast Food, Burger",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop",
        rating: 4.5,
        deliveryTime: "15-25 นาที",
        deliveryFee: "฿15",
        badge: "โปรโมชั่น",
        promo: "ฟรีค่าส่ง",
        category: "western"
    },
    {
        id: 2,
        name: "KFC",
        cuisine: "Fried Chicken, Fast Food",
        image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300&h=200&fit=crop",
        rating: 4.3,
        deliveryTime: "20-30 นาที",
        deliveryFee: "฿20",
        badge: "ยอดนิยม",
        promo: "ลด 20%",
        category: "western"
    },
    {
        id: 3,
        name: "ส้มตำนัวเก้า",
        cuisine: "อาหารไทย, อีสาน",
        image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=300&h=200&fit=crop",
        rating: 4.7,
        deliveryTime: "25-35 นาที",
        deliveryFee: "฿25",
        badge: "แนะนำ",
        promo: "ซื้อ 2 แถม 1",
        category: "thai"
    },
    {
        id: 4,
        name: "Sushi Hiro",
        cuisine: "อาหารญี่ปุ่น, ซูชิ",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop",
        rating: 4.6,
        deliveryTime: "30-40 นาที",
        deliveryFee: "฿30",
        badge: "พรีเมียม",
        promo: "ลด 15%",
        category: "japanese"
    },
    {
        id: 5,
        name: "Seoul Kitchen",
        cuisine: "อาหารเกาหลี, BBQ",
        image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=300&h=200&fit=crop",
        rating: 4.4,
        deliveryTime: "35-45 นาที",
        deliveryFee: "฿35",
        badge: "ใหม่",
        promo: "ลด 25%",
        category: "korean"
    },
    {
        id: 6,
        name: "Dragon Palace",
        cuisine: "อาหารจีน, ติ่มซำ",
        image: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=300&h=200&fit=crop",
        rating: 4.2,
        deliveryTime: "25-35 นาที",
        deliveryFee: "฿20",
        badge: "ยอดนิยม",
        promo: "ฟรีของหวาน",
        category: "chinese"
    },
    {
        id: 7,
        name: "Dessert Heaven",
        cuisine: "ของหวาน, เค้ก",
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop",
        rating: 4.8,
        deliveryTime: "20-30 นาที",
        deliveryFee: "฿15",
        badge: "ขายดี",
        promo: "ซื้อ 1 แถม 1",
        category: "dessert"
    },
    {
        id: 8,
        name: "Bubble Tea House",
        cuisine: "เครื่องดื่ม, ชานมไข่มุก",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop",
        rating: 4.5,
        deliveryTime: "15-25 นาที",
        deliveryFee: "฿10",
        badge: "ยอดนิยม",
        promo: "ลด 30%",
        category: "drinks"
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
        
        // Load initial data
        loadRestaurants();
        updateCartBadge();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 1500);
        
    } catch (error) {
        console.error('LIFF initialization failed:', error);
        // Continue without LIFF for testing
        userProfile = {
            displayName: 'Nathan',
            pictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=90&h=90&fit=crop&crop=face'
        };
        updateUserProfile();
        loadRestaurants();
        updateCartBadge();
        
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 1500);
    }
}

function updateUserProfile() {
    if (userProfile) {
        const elements = {
            'headerAvatar': userProfile.pictureUrl,
            'profileAvatarLarge': userProfile.pictureUrl
        };
        
        Object.entries(elements).forEach(([id, src]) => {
            const element = document.getElementById(id);
            if (element) element.src = src;
        });
        
        const nameElements = document.querySelectorAll('#profileName');
        nameElements.forEach(el => {
            if (el) el.textContent = userProfile.displayName || 'Nathan';
        });
    }
}

// ===== RESTAURANT FUNCTIONS =====
function loadRestaurants() {
    const grid = document.getElementById('restaurantGrid');
    if (!grid) return;
    
    grid.innerHTML = restaurants.map(restaurant => createRestaurantCard(restaurant)).join('');
}

function createRestaurantCard(restaurant) {
    const isFavorite = favorites.includes(restaurant.id);
    
    return `
        <div class="restaurant-card" onclick="openRestaurant(${restaurant.id})">
            <div class="restaurant-image">
                <img src="${restaurant.image}" alt="${restaurant.name}" loading="lazy">
                <div class="restaurant-badge">${restaurant.badge}</div>
                <button class="restaurant-favorite ${isFavorite ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${restaurant.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="restaurant-info">
                <div class="restaurant-name">${restaurant.name}</div>
                <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                <div class="restaurant-meta">
                    <div class="restaurant-rating">
                        <i class="fas fa-star"></i>
                        <span>${restaurant.rating}</span>
                    </div>
                    <div class="restaurant-delivery">${restaurant.deliveryTime}</div>
                </div>
                <div class="restaurant-promo">${restaurant.promo}</div>
            </div>
        </div>
    `;
}

function openRestaurant(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (!restaurant) return;
    
    showNotification(`เปิดร้าน ${restaurant.name}`, 'info');
}

function toggleFavorite(restaurantId) {
    const index = favorites.indexOf(restaurantId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification('ลบออกจากรายการโปรดแล้ว', 'info');
    } else {
        favorites.push(restaurantId);
        showNotification('เพิ่มในรายการโปรดแล้ว', 'success');
    }
    
    localStorage.setItem('grabfood_favorites', JSON.stringify(favorites));
    loadRestaurants();
    loadFavorites();
}

// ===== NAVIGATION FUNCTIONS =====
function navigateToHome() {
    showSection('homeSection');
    updateBottomNav('home');
}

function navigateToSearch() {
    showSection('searchSection');
    updateBottomNav('search');
    document.getElementById('searchInput').focus();
}

function navigateToFavorites() {
    showSection('favoritesSection');
    updateBottomNav('favorites');
    loadFavorites();
}

function navigateToOrders() {
    showSection('ordersSection');
    updateBottomNav('orders');
}

function navigateToProfile() {
    showSection('profileSection');
    updateBottomNav('profile');
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }
    
    currentSection = sectionId.replace('Section', '');
}

function updateBottomNav(activeItem) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const navItems = document.querySelectorAll('.nav-item');
    const itemMap = {
        'home': 0,
        'search': 1,
        'favorites': 2,
        'orders': 3,
        'cart': 4
    };
    
    if (navItems[itemMap[activeItem]]) {
        navItems[itemMap[activeItem]].classList.add('active');
    }
}

// ===== SEARCH FUNCTIONS =====
function performSearch(query) {
    if (!query.trim()) {
        document.getElementById('searchResults').innerHTML = '';
        return;
    }
    
    const results = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(query.toLowerCase())
    );
    
    const searchResults = document.getElementById('searchResults');
    if (results.length > 0) {
        searchResults.innerHTML = results.map(restaurant => createRestaurantCard(restaurant)).join('');
    } else {
        searchResults.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>ไม่พบผลการค้นหา</h3>
                <p>ลองค้นหาด้วยคำอื่น</p>
            </div>
        `;
    }
}

// ===== CATEGORY FUNCTIONS =====
function filterByCategory(category) {
    const filtered = restaurants.filter(restaurant => restaurant.category === category);
    const grid = document.getElementById('restaurantGrid');
    
    if (filtered.length > 0) {
        grid.innerHTML = filtered.map(restaurant => createRestaurantCard(restaurant)).join('');
    } else {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-utensils"></i>
                <h3>ไม่พบร้านอาหาร</h3>
                <p>ในหมวดหมู่นี้</p>
            </div>
        `;
    }
    
    showNotification(`แสดงร้านอาหารหมวด ${getCategoryName(category)}`, 'info');
}

function getCategoryName(category) {
    const categoryNames = {
        'thai': 'อาหารไทย',
        'japanese': 'อาหารญี่ปุ่น',
        'korean': 'อาหารเกาหลี',
        'western': 'อาหารฝรั่ง',
        'chinese': 'อาหารจีน',
        'dessert': 'ของหวาน',
        'drinks': 'เครื่องดื่ม'
    };
    return categoryNames[category] || category;
}

function showAllCategories() {
    loadRestaurants();
    showNotification('แสดงร้านอาหารทั้งหมด', 'info');
}

function showAllRestaurants() {
    loadRestaurants();
    showNotification('แสดงร้านอาหารทั้งหมด', 'info');
}

// ===== FAVORITES FUNCTIONS =====
function loadFavorites() {
    const favoritesGrid = document.getElementById('favoritesGrid');
    if (!favoritesGrid) return;
    
    const favoriteRestaurants = restaurants.filter(restaurant => 
        favorites.includes(restaurant.id)
    );
    
    if (favoriteRestaurants.length > 0) {
        favoritesGrid.innerHTML = favoriteRestaurants.map(restaurant => 
            createRestaurantCard(restaurant)
        ).join('');
    } else {
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h3>ยังไม่มีรายการโปรด</h3>
                <p>เพิ่มร้านอาหารที่ชอบ</p>
            </div>
        `;
    }
}

function showProfileFavorites() {
    navigateToFavorites();
}

// ===== CART FUNCTIONS =====
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('show');
    } else {
        cartSidebar.classList.add('open');
        overlay.classList.add('show');
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function proceedToCheckout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`ดำเนินการสั่งซื้อ ยอดรวม ฿${total}`, 'success');
    
    cart = [];
    updateCartBadge();
    toggleCart();
}

// ===== QUICK ACTIONS =====
function navigateToFood() {
    navigateToHome();
    showNotification('แสดงร้านอาหารทั้งหมด', 'info');
}

function navigateToMart() {
    showNotification('GrabMart กำลังจะเปิดให้บริการเร็วๆ นี้!', 'info');
}

function navigateToExpress() {
    showNotification('GrabExpress กำลังจะเปิดให้บริการเร็วๆ นี้!', 'info');
}

function navigateToPay() {
    showNotification('GrabPay กำลังจะเปิดให้บริการเร็วๆ นี้!', 'info');
}

// ===== PROMOTION FUNCTIONS =====
function applyPromotion() {
    showNotification('🎉 ใช้โปรโมชั่นฟรีค่าส่งสำเร็จ!', 'success');
}

// ===== ADDRESS FUNCTIONS =====
function showAddressModal() {
    const modal = document.getElementById('addressModal');
    const overlay = document.getElementById('overlay');
    
    modal.style.display = 'flex';
    overlay.classList.add('show');
}

function closeAddressModal() {
    const modal = document.getElementById('addressModal');
    const overlay = document.getElementById('overlay');
    
    modal.style.display = 'none';
    overlay.classList.remove('show');
}

function addNewAddress() {
    showNotification('เพิ่มที่อยู่ใหม่ กำลังจะเปิดให้บริการเร็วๆ นี้!', 'info');
}

// ===== PROFILE FUNCTIONS =====
function showOrderHistory() {
    navigateToOrders();
}

function showAddresses() {
    showAddressModal();
}

function showPaymentMethods() {
    showNotification('วิธีการชำระเงิน กำลังจะเปิดให้บริการเร็วๆ นี้!', 'info');
}

function showRewards() {
    showNotification('🎁 คุณมี 850 คะแนน! ระบบรางวัลกำลังจะเปิดให้บริการเร็วๆ นี้!', 'success');
}

function showPromotions() {
    showNotification('โปรโมชั่นพิเศษ กำลังจะเปิดให้บริการเร็วๆ นี้!', 'info');
}

function showSettings() {
    showNotification('การตั้งค่า กำลังจะเปิดให้บริการเร็วๆ นี้!', 'info');
}

function showHelp() {
    showNotification('ช่วยเหลือและสนับสนุน กำลังจะเปิดให้บริการเร็วๆ นี้!', 'info');
}

function showNotifications() {
    showNotification('🔔 คุณมีการแจ้งเตือน 3 รายการ', 'info');
}

// ===== OVERLAY FUNCTIONS =====
function closeOverlay() {
    const overlay = document.getElementById('overlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const addressModal = document.getElementById('addressModal');
    
    overlay.classList.remove('show');
    cartSidebar.classList.remove('open');
    addressModal.style.display = 'none';
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.className = 'notification-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(container);
    return container;
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ===== EVENT LISTENERS =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeOverlay();
    }
});

// Search input listener
setTimeout(() => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(e.target.value);
            }, 300);
        });
    }
}, 1000);

// Add notification styles
const notificationStyles = `
    .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .notification {
        background: white;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        border-left: 4px solid var(--grab-green);
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification.success {
        border-left-color: var(--grab-green);
        color: var(--grab-green);
    }
    
    .notification.error {
        border-left-color: var(--grab-red);
        color: var(--grab-red);
    }
    
    .notification.warning {
        border-left-color: var(--grab-orange);
        color: var(--grab-orange);
    }
    
    .notification.info {
        border-left-color: #2196F3;
        color: #2196F3;
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification span {
        flex: 1;
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .empty-state {
        text-align: center;
        padding: 48px 24px;
        color: #999;
        grid-column: 1 / -1;
    }
    
    .empty-state i {
        font-size: 4rem;
        margin-bottom: 16px;
        opacity: 0.5;
    }
    
    .empty-state h3 {
        font-size: 1.2rem;
        margin-bottom: 8px;
        color: var(--text-primary);
    }
    
    @media (max-width: 480px) {
        .notification-container {
            top: 10px;
            right: 10px;
            left: 10px;
        }
        
        .notification {
            min-width: auto;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet); 
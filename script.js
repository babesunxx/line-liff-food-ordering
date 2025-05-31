// ===== FOODFLOW - PREMIUM FOOD DELIVERY SYSTEM =====

// Global Variables
let liff;
let userProfile = null;
let cart = JSON.parse(localStorage.getItem('foodflow_cart')) || [];
let favorites = JSON.parse(localStorage.getItem('foodflow_favorites')) || [];
let currentSection = 'hero';
let searchTimeout;
let isLoading = false;

// Enhanced Restaurant Data
const restaurants = [
    {
        id: 1,
        name: "Gourmet Fusion",
        cuisine: "Modern Asian, Fusion",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        rating: 4.8,
        deliveryTime: "25-35 นาที",
        deliveryFee: 35,
        badge: "Premium",
        promo: "ลด 20% สำหรับออเดอร์แรก",
        category: "fusion",
        price: 3,
        distance: 0.8,
        specialties: ["Wagyu Beef", "Truffle Pasta", "Signature Cocktails"],
        openTime: "11:00",
        closeTime: "23:00",
        isNew: false,
        isFeatured: true
    },
    {
        id: 2,
        name: "Authentic Thai House",
        cuisine: "Traditional Thai, Street Food",
        image: "https://images.unsplash.com/photo-1559847844-d721426d6edc?w=400&h=300&fit=crop",
        rating: 4.6,
        deliveryTime: "15-25 นาที",
        deliveryFee: 25,
        badge: "ยอดนิยม",
        promo: "ฟรีส้มตำ เมื่อสั่งครบ ฿250",
        category: "thai",
        price: 2,
        distance: 0.5,
        specialties: ["Pad Thai", "Som Tam", "Tom Yum"],
        openTime: "10:00",
        closeTime: "22:00",
        isNew: false,
        isFeatured: true
    },
    {
        id: 3,
        name: "Sakura Sushi Bar",
        cuisine: "Japanese, Sushi, Sashimi",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
        rating: 4.9,
        deliveryTime: "30-40 นาที",
        deliveryFee: 45,
        badge: "เชฟแนะนำ",
        promo: "Set Sushi 50% ลด",
        category: "japanese",
        price: 3,
        distance: 1.2,
        specialties: ["Omakase", "Fresh Sashimi", "Premium Sake"],
        openTime: "17:00",
        closeTime: "24:00",
        isNew: false,
        isFeatured: true
    },
    {
        id: 4,
        name: "Seoul Kitchen",
        cuisine: "Korean BBQ, K-Food",
        image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop",
        rating: 4.7,
        deliveryTime: "20-30 นาที",
        deliveryFee: 30,
        badge: "ใหม่",
        promo: "เมนูใหม่ ลด 15%",
        category: "korean",
        price: 2,
        distance: 0.9,
        specialties: ["Korean BBQ", "Kimchi", "Bulgogi"],
        openTime: "11:30",
        closeTime: "23:30",
        isNew: true,
        isFeatured: true
    },
    {
        id: 5,
        name: "Burger Station",
        cuisine: "American, Burgers, Fast Food",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        rating: 4.4,
        deliveryTime: "15-20 นาที",
        deliveryFee: 20,
        badge: "ส่งเร็ว",
        promo: "ซื้อ 2 แถม 1",
        category: "western",
        price: 2,
        distance: 0.3,
        specialties: ["Signature Burger", "Crispy Fries", "Milkshakes"],
        openTime: "08:00",
        closeTime: "22:00",
        isNew: false,
        isFeatured: false
    },
    {
        id: 6,
        name: "La Bella Italia",
        cuisine: "Italian, Pasta, Pizza",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        rating: 4.5,
        deliveryTime: "25-35 นาที",
        deliveryFee: 35,
        badge: "ออเธนติก",
        promo: "Pizza ที่ 2 ลด 50%",
        category: "western",
        price: 3,
        distance: 1.5,
        specialties: ["Wood-fired Pizza", "Handmade Pasta", "Tiramisu"],
        openTime: "12:00",
        closeTime: "23:00",
        isNew: false,
        isFeatured: true
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        showLoadingScreen();
        
        // Initialize LIFF
        await liff.init({ liffId: '2007504943-2vqZgdQz' });
        
        if (liff.isLoggedIn()) {
            userProfile = await liff.getProfile();
            updateUserProfile();
        }
        
        // Load app data
        await loadAppData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Hide loading screen
        setTimeout(() => {
            hideLoadingScreen();
        }, 2000);
        
    } catch (error) {
        console.error('App initialization failed:', error);
        // Fallback for testing
        userProfile = {
            displayName: 'Nathan',
            pictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
        };
        updateUserProfile();
        await loadAppData();
        setupEventListeners();
        setTimeout(hideLoadingScreen, 2000);
    }
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

async function loadAppData() {
    // Simulate API calls
    await new Promise(resolve => setTimeout(resolve, 500));
    
    loadRecommendations();
    loadCategories();
    loadFeaturedRestaurants();
    loadSpecialOffers();
    updateCartUI();
    updateFavoritesCount();
}

function updateUserProfile() {
    if (userProfile) {
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        
        if (userAvatar) userAvatar.src = userProfile.pictureUrl;
        if (userName) userName.textContent = userProfile.displayName || 'Nathan';
    }
}

// ===== SMART RECOMMENDATIONS =====
function loadRecommendations() {
    const container = document.getElementById('recommendationCards');
    if (!container) return;
    
    const recommendations = restaurants.filter(r => r.isFeatured).slice(0, 3);
    
    container.innerHTML = recommendations.map(restaurant => `
        <div class="recommendation-card" onclick="openRestaurant(${restaurant.id})">
            <div class="card-image">
                <img src="${restaurant.image}" alt="${restaurant.name}" loading="lazy">
                <div class="card-badge ${restaurant.badge.toLowerCase()}">${restaurant.badge}</div>
                <button class="favorite-btn ${favorites.includes(restaurant.id) ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${restaurant.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="card-content">
                <h3 class="card-title">${restaurant.name}</h3>
                <p class="card-cuisine">${restaurant.cuisine}</p>
                <div class="card-meta">
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <span>${restaurant.rating}</span>
                    </div>
                    <div class="delivery-time">
                        <i class="fas fa-clock"></i>
                        <span>${restaurant.deliveryTime}</span>
                    </div>
                    <div class="price-level">
                        ${getPriceLevelDisplay(restaurant.price)}
                    </div>
                </div>
                <div class="card-promo">${restaurant.promo}</div>
            </div>
        </div>
    `).join('');
}

function getPriceLevelDisplay(level) {
    return '฿'.repeat(level) + '<span style="opacity: 0.3;">' + '฿'.repeat(3 - level) + '</span>';
}

// ===== CATEGORIES =====
function loadCategories() {
    const container = document.getElementById('categoriesGrid');
    if (!container) return;
    
    const categories = [
        { id: 'thai', name: 'อาหารไทย', icon: '🇹🇭', count: 24 },
        { id: 'japanese', name: 'ญี่ปุ่น', icon: '🍣', count: 18 },
        { id: 'korean', name: 'เกาหลี', icon: '🇰🇷', count: 15 },
        { id: 'western', name: 'ฝรั่ง', icon: '🍔', count: 32 },
        { id: 'chinese', name: 'จีน', icon: '🥟', count: 21 },
        { id: 'dessert', name: 'ของหวาน', icon: '🍰', count: 12 },
        { id: 'drinks', name: 'เครื่องดื่ม', icon: '🧋', count: 28 },
        { id: 'fusion', name: 'ฟิวชั่น', icon: '🍽️', count: 9 }
    ];
    
    container.innerHTML = categories.map(category => `
        <div class="category-card" onclick="filterByCategory('${category.id}')">
            <div class="category-icon">${category.icon}</div>
            <div class="category-info">
                <h3 class="category-name">${category.name}</h3>
                <p class="category-count">${category.count} ร้าน</p>
            </div>
            <div class="category-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>
    `).join('');
}

// ===== FEATURED RESTAURANTS =====
function loadFeaturedRestaurants() {
    const container = document.getElementById('restaurantsMasonry');
    if (!container) return;
    
    container.innerHTML = restaurants.map(restaurant => createRestaurantCard(restaurant)).join('');
}

function createRestaurantCard(restaurant) {
    const isFavorite = favorites.includes(restaurant.id);
    const isOpen = checkIfOpen(restaurant.openTime, restaurant.closeTime);
    
    return `
        <div class="restaurant-card ${restaurant.isNew ? 'new' : ''}" onclick="openRestaurant(${restaurant.id})">
            <div class="restaurant-image">
                <img src="${restaurant.image}" alt="${restaurant.name}" loading="lazy">
                <div class="restaurant-badges">
                    <div class="badge ${restaurant.badge.toLowerCase()}">${restaurant.badge}</div>
                    ${restaurant.isNew ? '<div class="badge new">ใหม่</div>' : ''}
                </div>
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleFavorite(${restaurant.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="restaurant-status ${isOpen ? 'open' : 'closed'}">
                    <i class="fas fa-circle"></i>
                    <span>${isOpen ? 'เปิด' : 'ปิด'}</span>
                </div>
            </div>
            <div class="restaurant-content">
                <div class="restaurant-header">
                    <h3 class="restaurant-name">${restaurant.name}</h3>
                    <div class="restaurant-rating">
                        <i class="fas fa-star"></i>
                        <span>${restaurant.rating}</span>
                    </div>
                </div>
                <p class="restaurant-cuisine">${restaurant.cuisine}</p>
                <div class="restaurant-specialties">
                    ${restaurant.specialties.slice(0, 2).map(specialty => 
                        `<span class="specialty-tag">${specialty}</span>`
                    ).join('')}
                </div>
                <div class="restaurant-footer">
                    <div class="delivery-info">
                        <div class="delivery-time">
                            <i class="fas fa-clock"></i>
                            <span>${restaurant.deliveryTime}</span>
                        </div>
                        <div class="delivery-fee">
                            <i class="fas fa-motorcycle"></i>
                            <span>฿${restaurant.deliveryFee}</span>
                        </div>
                        <div class="distance">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${restaurant.distance} กม.</span>
                        </div>
                    </div>
                    <div class="restaurant-promo">${restaurant.promo}</div>
                </div>
            </div>
        </div>
    `;
}

function checkIfOpen(openTime, closeTime) {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');
    return currentTime >= openTime && currentTime <= closeTime;
}

// ===== SPECIAL OFFERS =====
function loadSpecialOffers() {
    const container = document.getElementById('offersContainer');
    if (!container) return;
    
    const specialOffers = [
        {
            id: 1,
            title: "Flash Sale 50%",
            subtitle: "เมนูพิเศษ ลดครึ่งราคา",
            description: "สำหรับ 100 ออเดอร์แรกเท่านั้น",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
            discount: 50,
            timeLeft: "02:30:45",
            color: "danger"
        },
        {
            id: 2,
            title: "Free Delivery",
            subtitle: "ฟรีค่าส่งทุกออเดอร์",
            description: "เมื่อสั่งครับ ฿200 ขึ้นไป",
            image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400&h=200&fit=crop",
            discount: 0,
            timeLeft: null,
            color: "success"
        }
    ];
    
    container.innerHTML = specialOffers.map(offer => `
        <div class="offer-card ${offer.color}" onclick="applyOffer(${offer.id})">
            <div class="offer-image">
                <img src="${offer.image}" alt="${offer.title}" loading="lazy">
                <div class="offer-discount">
                    ${offer.discount > 0 ? `${offer.discount}% OFF` : 'FREE'}
                </div>
            </div>
            <div class="offer-content">
                <h3 class="offer-title">${offer.title}</h3>
                <p class="offer-subtitle">${offer.subtitle}</p>
                <p class="offer-description">${offer.description}</p>
                ${offer.timeLeft ? `
                    <div class="offer-timer">
                        <i class="fas fa-clock"></i>
                        <span class="countdown" data-time="${offer.timeLeft}">เหลือ ${offer.timeLeft}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    // Start countdown timers
    startCountdownTimers();
}

function startCountdownTimers() {
    const countdowns = document.querySelectorAll('.countdown[data-time]');
    countdowns.forEach(countdown => {
        const timeString = countdown.getAttribute('data-time');
        if (timeString) {
            startTimer(countdown, timeString);
        }
    });
}

function startTimer(element, timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    const timer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            element.textContent = 'หมดเวลาแล้ว';
            return;
        }
        
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        element.textContent = `เหลือ ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        totalSeconds--;
    }, 1000);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Smart search input
    const smartSearchInput = document.getElementById('smartSearchInput');
    if (smartSearchInput) {
        smartSearchInput.addEventListener('input', handleSmartSearch);
    }
    
    // Sort filter
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', handleSortChange);
    }
}

function handleSmartSearch(event) {
    const query = event.target.value.trim();
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        if (query.length >= 2) {
            performSmartSearch(query);
        }
    }, 300);
}

function performSmartSearch(query) {
    const results = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.specialties.some(specialty => 
            specialty.toLowerCase().includes(query.toLowerCase())
        )
    );
    
    const container = document.getElementById('restaurantsMasonry');
    if (container) {
        container.innerHTML = results.map(restaurant => createRestaurantCard(restaurant)).join('');
    }
    
    showToast(`พบ ${results.length} ร้านที่ตรงกับ "${query}"`, 'info');
}

// ===== FAVORITES SYSTEM =====
function toggleFavorite(restaurantId) {
    const index = favorites.indexOf(restaurantId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('ลบออกจากรายการโปรดแล้ว', 'info');
    } else {
        favorites.push(restaurantId);
        showToast('เพิ่มในรายการโปรดแล้ว', 'success');
    }
    
    localStorage.setItem('foodflow_favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    loadFeaturedRestaurants();
    loadRecommendations();
}

function updateFavoritesCount() {
    const favoritesCount = document.getElementById('favoritesCount');
    if (favoritesCount) {
        if (favorites.length > 0) {
            favoritesCount.textContent = favorites.length;
            favoritesCount.style.display = 'flex';
        } else {
            favoritesCount.style.display = 'none';
        }
    }
}

// ===== CART SYSTEM =====
function updateCartUI() {
    const floatingCart = document.getElementById('floatingCart');
    const cartCount = document.getElementById('cartCount');
    const cartItemsText = document.getElementById('cartItemsText');
    const cartTotalPreview = document.getElementById('cartTotalPreview');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (totalItems > 0) {
        if (floatingCart) {
            floatingCart.style.display = 'block';
        }
        if (cartCount) cartCount.textContent = totalItems;
        if (cartItemsText) cartItemsText.textContent = `${totalItems} รายการ`;
        if (cartTotalPreview) cartTotalPreview.textContent = `฿${totalPrice.toLocaleString()}`;
    } else {
        if (floatingCart) floatingCart.style.display = 'none';
    }
}

function openCartModal() {
    const modal = document.getElementById('cartModalOverlay');
    if (modal) {
        modal.classList.add('show');
        loadCartItems();
    }
}

function closeCartModal() {
    const modal = document.getElementById('cartModalOverlay');
    if (modal) {
        modal.classList.remove('show');
    }
}

function loadCartItems() {
    const container = document.getElementById('cartItemsList');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <h3>ตะกร้าว่างเปล่า</h3>
                <p>เลือกเมนูอร่อยใส่ตะกร้า</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.itemName}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.itemName}</h4>
                <p class="cart-item-restaurant">${item.restaurantName}</p>
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
}

// ===== ACTION HANDLERS =====
function quickOrder() {
    showToast('กำลังโหลดออเดอร์ล่าสุด...', 'info');
}

function exploreNearby() {
    showToast('ค้นหาร้านใกล้เคียง...', 'info');
}

function dailyDeals() {
    navigateToSection('offers');
    showToast('แสดงโปรโมชั่นวันนี้', 'success');
}

function premiumChef() {
    showToast('แสดงเมนูพิเศษจากเชฟ', 'info');
}

function refreshRecommendations() {
    showToast('รีเฟรชข้อมูลแล้ว', 'success');
    loadRecommendations();
}

function filterByCategory(category) {
    const filtered = restaurants.filter(r => r.category === category);
    const container = document.getElementById('restaurantsMasonry');
    
    if (container) {
        container.innerHTML = filtered.map(restaurant => createRestaurantCard(restaurant)).join('');
    }
    
    showToast(`แสดงร้าน${getCategoryName(category)}`, 'info');
}

function getCategoryName(category) {
    const categoryNames = {
        'thai': 'อาหารไทย',
        'japanese': 'อาหารญี่ปุ่น',
        'korean': 'อาหารเกาหลี',
        'western': 'อาหารฝรั่ง',
        'chinese': 'อาหารจีน',
        'fusion': 'ฟิวชั่น',
        'dessert': 'ของหวาน',
        'drinks': 'เครื่องดื่ม'
    };
    return categoryNames[category] || category;
}

function openRestaurant(restaurantId) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
        showToast(`เปิดร้าน ${restaurant.name}`, 'info');
    }
}

function applyOffer(offerId) {
    showToast(`ใช้โปรโมชั่นสำเร็จ!`, 'success');
}

function startVoiceSearch() {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'th-TH';
        recognition.start();
        
        showToast('กำลังฟัง... พูดได้เลย', 'info');
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const searchInput = document.getElementById('smartSearchInput');
            if (searchInput) {
                searchInput.value = transcript;
                performSmartSearch(transcript);
            }
            showToast(`ค้นหา: ${transcript}`, 'success');
        };
        
        recognition.onerror = function() {
            showToast('ไม่สามารถรับเสียงได้ ลองอีกครั้ง', 'error');
        };
    } else {
        showToast('เบราว์เซอร์ไม่รองรับการค้นหาด้วยเสียง', 'warning');
    }
}

function proceedToCheckout() {
    showToast(`ดำเนินการสั่งซื้อสำเร็จ!`, 'success');
    cart = [];
    localStorage.setItem('foodflow_cart', JSON.stringify(cart));
    updateCartUI();
    closeCartModal();
}

function navigateToSection(section) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-section="${section}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    const targetSection = document.getElementById(`${section}Section`);
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function openSearchModal() {
    const modal = document.getElementById('searchModalOverlay');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeSearchModal() {
    const modal = document.getElementById('searchModalOverlay');
    if (modal) {
        modal.classList.remove('show');
    }
}

function showNotifications() {
    showToast('🔔 คุณมีการแจ้งเตือน 3 รายการ', 'info');
}

function showLocationPicker() {
    showToast('เลือกที่อยู่สำหรับจัดส่ง', 'info');
}

// ===== NOTIFICATION SYSTEM =====
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// ===== UTILITY FUNCTIONS =====
function handleSortChange(event) {
    const sortBy = event.target.value;
    const container = document.getElementById('restaurantsMasonry');
    
    let sortedRestaurants = [...restaurants];
    
    switch (sortBy) {
        case 'rating':
            sortedRestaurants.sort((a, b) => b.rating - a.rating);
            break;
        case 'delivery':
            sortedRestaurants.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
            break;
        case 'price':
            sortedRestaurants.sort((a, b) => a.price - b.price);
            break;
        case 'distance':
            sortedRestaurants.sort((a, b) => a.distance - b.distance);
            break;
    }
    
    if (container) {
        container.innerHTML = sortedRestaurants.map(restaurant => createRestaurantCard(restaurant)).join('');
    }
    
    showToast(`เรียงตาม${getSortLabel(sortBy)}`, 'info');
}

function getSortLabel(sortBy) {
    const labels = {
        'rating': 'เรตติ้งสูงสุด',
        'delivery': 'ส่งเร็วที่สุด',
        'price': 'ราคาถูกสุด',
        'distance': 'ใกล้ที่สุด'
    };
    return labels[sortBy] || sortBy;
}

// ===== EVENT LISTENERS =====
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('show');
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('.floating-header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.transform = 'scale(0.95)';
            header.style.opacity = '0.95';
        } else {
            header.style.transform = 'scale(1)';
            header.style.opacity = '1';
        }
    }
}); 
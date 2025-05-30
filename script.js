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

// Enhanced menu data with more details
const menuData = [
    {
        id: 1,
        name: 'ข้าวผัดกุ้ง',
        description: 'ข้าวผัดกุ้งสดใหม่ พร้อมไข่ดาวและผักสด',
        price: 120,
        category: 'rice',
        image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%9C%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%B8%E0%B9%89%E0%B8%87',
        rating: 4.5,
        deliveryTime: '25-35 นาที',
        discount: null,
        isPopular: true
    },
    {
        id: 2,
        name: 'ต้มยำกุ้ง',
        description: 'ต้มยำกุ้งรสเปรี้ยวหวาน พร้อมเห็ด หอมหัวใหญ่',
        price: 150,
        category: 'soup',
        image: 'https://via.placeholder.com/300x200/FF5722/ffffff?text=%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B8%A2%E0%B8%B3%E0%B8%81%E0%B8%B8%E0%B9%89%E0%B8%87',
        rating: 4.7,
        deliveryTime: '30-40 นาที',
        discount: 15,
        isPopular: true
    },
    {
        id: 3,
        name: 'ผัดไทย',
        description: 'ผัดไทยกุ้งสด รสชาติต้นตำรับ พร้อมถั่วงอกสด',
        price: 100,
        category: 'noodle',
        image: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=%E0%B8%9C%E0%B8%B1%E0%B8%94%E0%B9%84%E0%B8%97%E0%B8%A2',
        rating: 4.3,
        deliveryTime: '20-30 นาที',
        discount: null,
        isPopular: false
    },
    {
        id: 4,
        name: 'ส้มตำไทย',
        description: 'ส้มตำรสแซ่บ พร้อมผักสด และแจ่วบอง',
        price: 80,
        category: 'salad',
        image: 'https://via.placeholder.com/300x200/8BC34A/ffffff?text=%E0%B8%AA%E0%B9%89%E0%B8%A1%E0%B8%95%E0%B8%B3',
        rating: 4.4,
        deliveryTime: '15-25 นาที',
        discount: 20,
        isPopular: true
    },
    {
        id: 5,
        name: 'โค้กเย็น',
        description: 'โค้ก เย็นฉ่ำ สดชื่น',
        price: 25,
        category: 'drink',
        image: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=%E0%B9%82%E0%B8%84%E0%B9%89%E0%B8%81',
        rating: 4.0,
        deliveryTime: '5-10 นาที',
        discount: null,
        isPopular: false
    },
    {
        id: 6,
        name: 'ข้าวเหนียวมะม่วง',
        description: 'ข้าวเหนียวหวาน พร้อมมะม่วงหวานสุกสด',
        price: 60,
        category: 'dessert',
        image: 'https://via.placeholder.com/300x200/FFEB3B/000000?text=%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B9%80%E0%B8%AB%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%A1%E0%B8%B0%E0%B8%A1%E0%B9%88%E0%B8%A7%E0%B8%87',
        rating: 4.6,
        deliveryTime: '10-20 นาที',
        discount: 10,
        isPopular: true
    },
    {
        id: 7,
        name: 'ก๋วยเตี๋ยวต้มยำ',
        description: 'ก๋วยเตี๋ยวเส้นเล็ก น้ำซุปต้มยำรสจัดจ้าน',
        price: 90,
        category: 'noodle',
        image: 'https://via.placeholder.com/300x200/E91E63/ffffff?text=%E0%B8%81%E0%B9%8B%E0%B8%A7%E0%B8%A2%E0%B9%80%E0%B8%95%E0%B8%B5%E0%B9%8B%E0%B8%A2%E0%B8%A7',
        rating: 4.2,
        deliveryTime: '25-35 นาที',
        discount: null,
        isPopular: false
    },
    {
        id: 8,
        name: 'น้ำมะนาว',
        description: 'น้ำมะนาวสด เปรี้ยวหวาน สดชื่น',
        price: 30,
        category: 'drink',
        image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A1%E0%B8%B0%E0%B8%99%E0%B8%B2%E0%B8%A7',
        rating: 4.1,
        deliveryTime: '5-10 นาที',
        discount: null,
        isPopular: false
    }
];

// Cart state
let cart = [];
let currentCategory = 'all';
let userProfile = null;
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

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
    loadMenu();
    setupSearch();
}

// Show mock user for demo
function showMockUser() {
    const userName = 'ผู้ใช้ทดสอบ';
    const userAvatar = document.getElementById('userAvatar');
    
    // Update profile circle with first letter
    userAvatar.src = `https://via.placeholder.com/40x40/FF5722/ffffff?text=${userName.charAt(0)}`;
    userAvatar.alt = userName;
    
    // Set demo location
    document.getElementById('locationName').textContent = 'บ้าน (ทดสอบ)';
}

// Get user profile from LINE
async function getUserProfile() {
    try {
        const profile = await liff.getProfile();
        const userAvatar = document.getElementById('userAvatar');
        
        // Update profile circle
        if (profile.pictureUrl) {
            userAvatar.src = profile.pictureUrl;
        } else {
            userAvatar.src = `https://via.placeholder.com/40x40/FF5722/ffffff?text=${profile.displayName.charAt(0)}`;
        }
        
        userAvatar.alt = profile.displayName;
        userProfile = profile;
    } catch (error) {
        console.error('Error getting profile', error);
        showMockUser();
    }
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
                        <div class="price-modern">฿${item.price}</div>
                        <div class="delivery-time">
                            <i class="fas fa-clock"></i>
                            ${item.deliveryTime}
                        </div>
                    </div>
                    
                    <button class="add-to-cart-modern" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i>
                        เพิ่ม
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
        showNotification('ลบออกจากรายการโปรดแล้ว', 'info');
    } else {
        favorites.push(itemId);
        showNotification('เพิ่มในรายการโปรดแล้ว', 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    loadMenu(); // Refresh to update heart icons
}

// Filter by category with modern UI update
function filterCategory(category) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.category-tab-modern').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadMenu();
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
    showNotification(`เพิ่ม ${item.name} ลงตะกร้าแล้ว`, 'success');
}

// Remove item from cart
function removeFromCart(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    updateCartUI();
    
    if (item) {
        showNotification(`ลบ ${item.name} ออกจากตะกร้าแล้ว`, 'info');
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
    document.getElementById('cartBadge').textContent = cartCount;
    document.getElementById('cartBadgeNav').textContent = cartCount;
    document.getElementById('totalPrice').textContent = cartTotal;
    
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-modern">
                <i class="fas fa-shopping-cart"></i>
                <h3>ตะกร้าสินค้าว่างเปล่า</h3>
                <p>เลือกสินค้าจากเมนูเพื่อเริ่มสั่งอาหาร</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item-modern">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info-modern">
                    <h4>${item.name}</h4>
                    <p>฿${item.price} x ${item.quantity} = ฿${item.price * item.quantity}</p>
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

// Toggle filters modal
function toggleFilters() {
    const filterModal = document.getElementById('filterModal');
    filterModal.classList.toggle('show');
}

// Show all categories function
function showAllCategories() {
    showNotification('ฟีเจอร์นี้จะพัฒนาในเวอร์ชันถัดไป', 'info');
}

// Enhanced checkout process
async function checkout() {
    if (cart.length === 0) return;
    
    const orderSummary = cart.map(item => 
        `${item.name} x${item.quantity} = ฿${item.price * item.quantity}`
    ).join('\n');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 25;
    const total = subtotal + deliveryFee;
    
    const message = `🍽️ การสั่งอาหาร\n\n${orderSummary}\n\nยอดรวม: ฿${subtotal}\nค่าส่ง: ฿${deliveryFee}\n💰 รวมทั้งสิ้น: ฿${total}\n\n📍 ที่อยู่จัดส่ง: ${document.getElementById('locationName').textContent}\n⏰ เวลาจัดส่ง: 30-45 นาที\n\nขอบคุณที่สั่งอาหารค่ะ! 🙏`;
    
    try {
        // Save order to system
        await saveOrderToSystem();
        
        if (liff.isApiAvailable('sendMessages')) {
            await liff.sendMessages([{
                type: 'text',
                text: message
            }]);
            
            showSuccessModal('ส่งการสั่งซื้อเรียบร้อยแล้ว!');
            clearCart();
        } else {
            // Fallback: close LIFF and send message
            liff.closeWindow();
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showSuccessModal('การสั่งซื้อสำเร็จ! (Demo Mode)');
        clearCart();
    }
}

// Save order to system (enhanced)
async function saveOrderToSystem() {
    const orderData = {
        id: generateOrderId(),
        customerName: userProfile ? userProfile.displayName : 'ลูกค้า LINE',
        customerAvatar: userProfile ? userProfile.displayName.charAt(0) : 'L',
        customerId: userProfile ? userProfile.userId : null,
        timestamp: new Date(),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: 25,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 25,
        status: 'pending',
        deliveryAddress: document.getElementById('locationName').textContent,
        estimatedTime: '30-45 นาที'
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
                <h3 style="color: #333; margin-bottom: 15px; font-size: 1.3rem;">สำเร็จ!</h3>
                <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">${message}</p>
                <button onclick="this.closest('div').remove()" style="
                    background: #FF5722;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 1rem;
                ">ตกลง</button>
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
    const cartIcon = document.querySelector('.menu-btn');
    cartIcon.style.transform = 'scale(1.2)';
    cartIcon.style.background = '#4CAF50';
    
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
        cartIcon.style.background = '#FF5722';
    }, 200);
}

// Hide loading screen
function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
}

// Navigation functions
function navigateToHome() {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    // Reset to all categories
    currentCategory = 'all';
    document.querySelectorAll('.category-tab-modern').forEach(tab => tab.classList.remove('active'));
    document.querySelector('.category-tab-modern').classList.add('active');
    loadMenu();
}

function navigateToExplore() {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    // Show popular items
    const popularItems = menuData.filter(item => item.isPopular);
    displayMenuItems(popularItems);
    showNotification('แสดงเมนูยอดนิยม', 'info');
}

function navigateToFavorites() {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    // Show favorite items
    const favoriteItems = menuData.filter(item => favorites.includes(item.id));
    
    if (favoriteItems.length === 0) {
        document.getElementById('menuItems').innerHTML = `
            <div style="
                text-align: center;
                padding: 60px 20px;
                color: #666;
                grid-column: 1 / -1;
            ">
                <i class="fas fa-heart" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 10px;">ยังไม่มีรายการโปรด</h3>
                <p>กดปุ่ม ♥ ที่เมนูอาหารเพื่อเพิ่มในรายการโปรด</p>
            </div>
        `;
    } else {
        displayMenuItems(favoriteItems);
    }
}

function navigateToProfile() {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.nav-item').classList.add('active');
    
    showNotification('ฟีเจอร์โปรไฟล์จะพัฒนาในเวอร์ชันถัดไป', 'info');
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
            } else if (iconClass.includes('fa-compass')) {
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
    const filterModal = document.getElementById('filterModal');
    
    if (cartSidebar.classList.contains('open')) {
        toggleCart();
        e.preventDefault();
    } else if (filterModal.classList.contains('show')) {
        toggleFilters();
        e.preventDefault();
    }
});

// Add some CSS for enhanced features
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .text-red {
        color: #FF5722 !important;
    }
    
    .menu-item-modern .favorite-btn .text-red {
        color: #FF5722 !important;
    }
    
    @media (max-width: 768px) {
        .cart-sidebar-modern {
            width: 100%;
            max-width: 100%;
        }
    }
`;
document.head.appendChild(additionalStyles); 
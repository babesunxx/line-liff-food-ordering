// LIFF App Configuration
// ⚠️ สำคัญ: ให้แทนที่ 'YOUR_LIFF_ID' ด้วย LIFF ID จริงที่ได้จาก LINE Developers Console
// LIFF ID จะเป็นรูปแบบ: 1234567890-abcdefgh
const LIFF_ID = '2007504943-2vqZgdQz'; // LIFF ID จริงของคุณ

// Sample menu data
const menuData = [
    {
        id: 1,
        name: 'ข้าวผัดกุ้ง',
        description: 'ข้าวผัดกุ้งสดใหม่ พร้อมไข่ดาวและผักสด',
        price: 120,
        category: 'rice',
        image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B8%9C%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%B8%E0%B9%89%E0%B8%87'
    },
    {
        id: 2,
        name: 'ต้มยำกุ้ง',
        description: 'ต้มยำกุ้งรสเปรี้ยวหวาน พร้อมเห็ด หอมหัวใหญ่',
        price: 150,
        category: 'soup',
        image: 'https://via.placeholder.com/300x200/FF5722/ffffff?text=%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B8%A2%E0%B8%B3%E0%B8%81%E0%B8%B8%E0%B9%89%E0%B8%87'
    },
    {
        id: 3,
        name: 'ผัดไทย',
        description: 'ผัดไทยกุ้งสด รสชาติต้นตำรับ พร้อมถั่วงอกสด',
        price: 100,
        category: 'noodle',
        image: 'https://via.placeholder.com/300x200/FF9800/ffffff?text=%E0%B8%9C%E0%B8%B1%E0%B8%94%E0%B9%84%E0%B8%97%E0%B8%A2'
    },
    {
        id: 4,
        name: 'ส้มตำไทย',
        description: 'ส้มตำรสแซ่บ พร้อมผักสด และแจ่วบอง',
        price: 80,
        category: 'salad',
        image: 'https://via.placeholder.com/300x200/8BC34A/ffffff?text=%E0%B8%AA%E0%B9%89%E0%B8%A1%E0%B8%95%E0%B8%B3'
    },
    {
        id: 5,
        name: 'โค้กเย็น',
        description: 'โค้ก เย็นฉ่ำ สดชื่น',
        price: 25,
        category: 'drink',
        image: 'https://via.placeholder.com/300x200/2196F3/ffffff?text=%E0%B9%82%E0%B8%84%E0%B9%89%E0%B8%81'
    },
    {
        id: 6,
        name: 'ข้าวเหนียวมะม่วง',
        description: 'ข้าวเหนียวหวาน พร้อมมะม่วงหวานสุกสด',
        price: 60,
        category: 'dessert',
        image: 'https://via.placeholder.com/300x200/FFEB3B/000000?text=%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A7%E0%B9%80%E0%B8%AB%E0%B8%99%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%A1%E0%B8%B0%E0%B8%A1%E0%B9%88%E0%B8%A7%E0%B8%87'
    },
    {
        id: 7,
        name: 'ก๋วยเตี๋ยวต้มยำ',
        description: 'ก๋วยเตี๋ยวเส้นเล็ก น้ำซุปต้มยำรสจัดจ้าน',
        price: 90,
        category: 'noodle',
        image: 'https://via.placeholder.com/300x200/E91E63/ffffff?text=%E0%B8%81%E0%B9%8B%E0%B8%A7%E0%B8%A2%E0%B9%80%E0%B8%95%E0%B8%B5%E0%B9%8B%E0%B8%A2%E0%B8%A7'
    },
    {
        id: 8,
        name: 'น้ำมะนาว',
        description: 'น้ำมะนาวสด เปรี้ยวหวาน สดชื่น',
        price: 30,
        category: 'drink',
        image: 'https://via.placeholder.com/300x200/4CAF50/ffffff?text=%E0%B8%99%E0%B9%89%E0%B8%B3%E0%B8%A1%E0%B8%B0%E0%B8%99%E0%B8%B2%E0%B8%A7'
    }
];

// Cart state
let cart = [];
let currentCategory = 'all';

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
        document.getElementById('userName').textContent = 'ผู้ใช้ทดสอบ';
    }
    
    hideLoading();
    loadMenu();
}

// Get user profile from LINE
async function getUserProfile() {
    try {
        const profile = await liff.getProfile();
        document.getElementById('userName').textContent = profile.displayName;
    } catch (error) {
        console.error('Error getting profile', error);
        document.getElementById('userName').textContent = 'ผู้ใช้';
    }
}

// Load menu items
function loadMenu() {
    const menuContainer = document.getElementById('menuItems');
    const filteredMenu = currentCategory === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);
    
    menuContainer.innerHTML = filteredMenu.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">฿${item.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${item.id})">
                        เพิ่มลงตะกร้า
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter by category
function filterCategory(category) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadMenu();
}

// Add item to cart
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
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        }
    }
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    document.getElementById('cartCount').textContent = cartCount;
    document.getElementById('totalPrice').textContent = cartTotal;
    
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>🛒</p>
                <p>ตะกร้าสินค้าว่างเปล่า</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>฿${item.price} x ${item.quantity}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `).join('');
    }
    
    // Enable/disable checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.disabled = cart.length === 0;
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

// Checkout process
async function checkout() {
    if (cart.length === 0) return;
    
    const orderSummary = cart.map(item => 
        `${item.name} x${item.quantity} = ฿${item.price * item.quantity}`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const message = `🍽️ การสั่งอาหาร\n\n${orderSummary}\n\n💰 รวมทั้งสิ้น: ฿${total}\n\nขขอบคุณที่สั่งอาหารค่ะ!`;
    
    try {
        if (liff.isApiAvailable('sendMessages')) {
            await liff.sendMessages([{
                type: 'text',
                text: message
            }]);
            
            showSuccessMessage('ส่งการสั่งซื้อเรียบร้อยแล้ว!');
            clearCart();
        } else {
            // Fallback: close LIFF and send message
            liff.closeWindow();
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showSuccessMessage('การสั่งซื้อสำเร็จ! (Demo Mode)');
        clearCart();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    updateCartUI();
    toggleCart();
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <h3>✅ สำเร็จ!</h3>
        <p>${message}</p>
        <button onclick="this.parentElement.remove()">ตกลง</button>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Show add to cart animation
function showAddToCartAnimation() {
    // Simple animation - you can enhance this
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
    }, 200);
}

// Hide loading screen
function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLiff();
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
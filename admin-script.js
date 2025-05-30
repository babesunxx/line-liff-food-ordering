// Firebase Configuration
const firebaseConfig = {
    // ⚠️ ต้องแทนที่ด้วยค่าจริงจาก Firebase Console
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Demo data for testing (will be replaced with real data)
let orders = [
    {
        id: "ORD001",
        customerName: "สมชาย ใจดี",
        customerAvatar: "ส",
        timestamp: new Date(),
        items: [
            { name: "ข้าวผัดกุ้ง", quantity: 2, price: 120 },
            { name: "ต้มยำกุ้ง", quantity: 1, price: 150 }
        ],
        total: 390,
        status: "pending"
    },
    {
        id: "ORD002", 
        customerName: "สมหญิง รักงาน",
        customerAvatar: "ส",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        items: [
            { name: "ผัดไทย", quantity: 1, price: 100 },
            { name: "โค้กเย็น", quantity: 2, price: 25 }
        ],
        total: 150,
        status: "cooking"
    }
];

let currentFilter = 'all';
let isLoggedIn = false;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    hideLoading();
    checkAuthState();
    
    // Demo login for testing
    if (!isLoggedIn) {
        showLoginSection();
    }
});

// Authentication
function checkAuthState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            isLoggedIn = true;
            showDashboard();
            document.getElementById('adminName').textContent = user.email;
            loadOrders();
        } else {
            isLoggedIn = false;
            showLoginSection();
        }
    });
}

async function adminLogin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (!email || !password) {
        alert('กรุณากรอกอีเมลและรหัสผ่าน');
        return;
    }
    
    showLoading();
    
    try {
        // For demo purposes, simulate login
        if (email === 'admin@foodstore.com' && password === 'admin123') {
            // Simulate successful login
            isLoggedIn = true;
            document.getElementById('adminName').textContent = email;
            showDashboard();
            loadOrders();
        } else {
            alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
    
    hideLoading();
}

function adminLogout() {
    if (confirm('ต้องการออกจากระบบหรือไม่?')) {
        isLoggedIn = false;
        showLoginSection();
    }
}

// UI Functions
function showLoginSection() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// Orders Management
function loadOrders() {
    // โหลดออเดอร์จาก localStorage (สำหรับ Demo)
    const savedOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
    
    // แปลง timestamp string กลับเป็น Date object
    savedOrders.forEach(order => {
        if (typeof order.timestamp === 'string') {
            order.timestamp = new Date(order.timestamp);
        }
    });
    
    // รวมกับ demo orders
    orders = [...savedOrders, ...orders.filter(demoOrder => 
        !savedOrders.find(saved => saved.id === demoOrder.id)
    )];
    
    updateStats();
    displayOrders();
}

function updateStats() {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
        order.timestamp.toDateString() === today
    );
    
    const pending = orders.filter(order => order.status === 'pending').length;
    const cooking = orders.filter(order => order.status === 'cooking').length;
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    
    document.getElementById('totalOrders').textContent = todayOrders.length;
    document.getElementById('pendingOrders').textContent = pending;
    document.getElementById('cookingOrders').textContent = cooking;
    document.getElementById('todayRevenue').textContent = `฿${todayRevenue}`;
}

function displayOrders() {
    const filteredOrders = currentFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === currentFilter);
    
    const ordersList = document.getElementById('ordersList');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    ordersList.innerHTML = filteredOrders.map(order => `
        <div class="order-card" data-status="${order.status}">
            <div class="order-header">
                <div class="order-id">#${order.id}</div>
                <div class="order-time">${formatTime(order.timestamp)}</div>
            </div>
            <div class="order-body">
                <div class="customer-info">
                    <div class="customer-avatar">${order.customerAvatar}</div>
                    <div class="customer-details">
                        <h4>${order.customerName}</h4>
                        <p>ลูกค้า LINE</p>
                    </div>
                </div>
                
                <div class="order-items">
                    <h4>รายการอาหาร:</h4>
                    ${order.items.map(item => `
                        <div class="item">
                            <div class="item-info">
                                <div class="item-name">${item.name}</div>
                                <div class="item-details">จำนวน: ${item.quantity} x ฿${item.price}</div>
                            </div>
                            <div class="item-total">฿${item.quantity * item.price}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-total">
                    <h3>รวม: ฿${order.total}</h3>
                </div>
                
                <div class="order-status">
                    ${generateStatusButtons(order)}
                </div>
            </div>
        </div>
    `).join('');
}

function generateStatusButtons(order) {
    const statuses = [
        { key: 'pending', label: 'รับออเดอร์', color: 'pending' },
        { key: 'cooking', label: 'กำลังทำ', color: 'cooking' },
        { key: 'completed', label: 'เสร็จแล้ว', color: 'completed' },
        { key: 'delivered', label: 'ส่งแล้ว', color: 'delivered' }
    ];
    
    return statuses.map(status => {
        const isActive = order.status === status.key;
        const isNext = getNextStatus(order.status) === status.key;
        
        return `
            <button 
                class="status-btn ${status.color} ${isActive ? 'active' : ''}" 
                onclick="updateOrderStatus('${order.id}', '${status.key}')"
                ${(!isActive && !isNext) ? 'disabled' : ''}
                style="${(!isActive && !isNext) ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
            >
                ${isActive ? '✓ ' : ''}${status.label}
            </button>
        `;
    }).join('');
}

function getNextStatus(currentStatus) {
    const statusFlow = {
        'pending': 'cooking',
        'cooking': 'completed', 
        'completed': 'delivered',
        'delivered': null
    };
    return statusFlow[currentStatus];
}

function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        
        // อัปเดต localStorage
        const savedOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        const savedOrderIndex = savedOrders.findIndex(o => o.id === orderId);
        if (savedOrderIndex !== -1) {
            savedOrders[savedOrderIndex].status = newStatus;
            localStorage.setItem('adminOrders', JSON.stringify(savedOrders));
        }
        
        // TODO: อัปเดต Firebase เมื่อพร้อม
        // updateOrderInFirebase(orderId, newStatus);
        
        loadOrders();
        
        // Show success message
        showNotification(`อัปเดตสถานะออเดอร์ #${orderId} เป็น "${getStatusLabel(newStatus)}" แล้ว`);
    }
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'รอดำเนินการ',
        'cooking': 'กำลังทำอาหาร',
        'completed': 'เสร็จแล้ว',
        'delivered': 'ส่งแล้ว'
    };
    return labels[status] || status;
}

// Filter orders
function filterOrders(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayOrders();
}

// Utility functions
function formatTime(date) {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'เมื่อสักครู่';
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    
    return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Real-time updates (simulate new orders)
function simulateNewOrder() {
    const newOrder = {
        id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
        customerName: "ลูกค้าใหม่",
        customerAvatar: "ล",
        timestamp: new Date(),
        items: [
            { name: "ข้าวผัดกุ้ง", quantity: 1, price: 120 }
        ],
        total: 120,
        status: "pending"
    };
    
    orders.unshift(newOrder);
    loadOrders();
    showNotification(`มีออเดอร์ใหม่ #${newOrder.id}`);
}

// For demo: simulate new order every 2 minutes
// setInterval(simulateNewOrder, 120000); 
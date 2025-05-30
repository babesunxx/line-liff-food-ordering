// ===== MODERN FOOD DELIVERY APP - ENHANCED JAVASCRIPT =====

// LIFF App Configuration
const LIFF_ID = '2007504943-2vqZgdQz';

// Enhanced menu data with real food images
const menuData = [
    {
        id: 1,
        name: 'Smoothie Bowl Paradise',
        description: 'Fresh mixed berries smoothie bowl with granola and superfoods',
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
        name: 'Asian Sesame Chicken Salad',
        description: 'Fresh garden salad with grilled sesame chicken and Asian dressing',
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
        name: 'Gourmet Turkey Club',
        description: 'Premium turkey sandwich with avocado, bacon and fresh vegetables',
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
        name: 'Buffalo Wings Deluxe',
        description: 'Crispy buffalo chicken wings with ranch sauce and celery sticks',
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
        description: 'Freshly squeezed Valencia orange juice - vitamin C boost',
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
        name: 'Avocado Toast Supreme',
        description: 'Artisan bread with smashed avocado, poached egg, and microgreens',
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
        name: 'Premium Beef Burger',
        description: 'Wagyu beef burger with truffle cheese, lettuce, and sweet potato fries',
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
        name: 'Matcha Green Tea Latte',
        description: 'Premium Japanese matcha with steamed oat milk and natural sweetener',
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
        name: 'Fluffy Pancake Stack',
        description: 'Three fluffy pancakes with maple syrup, fresh berries, and whipped cream',
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
        name: 'Truffle Pasta Carbonara',
        description: 'Creamy pasta carbonara with pancetta, parmesan, and truffle oil',
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

// ===== STATE MANAGEMENT =====
let cart = [];
let currentCategory = 'all';
let currentPopularCategory = 'breakfast';
let userProfile = null;
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
let deliveryAddress = JSON.parse(localStorage.getItem('deliveryAddress') || '{"name": "Home", "address": "Bangkok, Thailand", "phone": "080-123-4567", "note": ""}');
let currentSection = 'home';
let isLoading = false;

// ===== LIFF INITIALIZATION =====
async function initializeLiff() {
    try {
        showLoading('🍔 Loading delicious food...');
        
        await liff.init({ liffId: LIFF_ID });
        
        if (liff.isLoggedIn()) {
            await getUserProfile();
        } else {
            liff.login();
        }
    } catch (error) {
        console.error('LIFF initialization failed', error);
        showMockUser();
    }
    
    await initializeApp();
}

// ===== APP INITIALIZATION =====
async function initializeApp() {
    try {
        await sleep(1000);
        
        initializeUI();
        setupEventListeners();
        loadPopularMenus();
        loadMenu();
        setupSearch();
        updateFavoritesCount();
        updateDeliveryAddress();
        
        hideLoading();
        showWelcomeAnimation();
    } catch (error) {
        console.error('App initialization failed:', error);
        showErrorMessage('Failed to load app. Please refresh.');
    }
}

// ===== UI INITIALIZATION =====
function initializeUI() {
    console.log('🎨 Initializing modern UI...');
    
    const homeContent = document.getElementById('homeContent');
    const profileSection = document.getElementById('profileSection');
    
    if (homeContent) {
        homeContent.style.display = 'block';
        homeContent.classList.add('animate-fadeIn');
    }
    
    if (profileSection) {
        profileSection.classList.add('hidden');
    }
    
    setActiveNavigation('home');
    currentSection = 'home';
    
    console.log('✅ UI initialization completed');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    document.addEventListener('click', handleNavigationClick);
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    if ('ontouchstart' in window) {
        setupTouchGestures();
    }
    
    window.addEventListener('resize', debounce(handleResize, 250));
    window.addEventListener('popstate', handleBackButton);
}

function handleNavigationClick(e) {
    const navItem = e.target.closest('.nav-item');
    if (!navItem || navItem.classList.contains('cart-nav')) return;
    
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

function handleKeyboardNavigation(e) {
    if (e.key === 'Escape') {
        closeAllModals();
    }
}

function setupTouchGestures() {
    let startX = 0;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });
    
    document.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const deltaX = endX - startX;
        
        if (deltaX > 100) {
            toggleCart();
        }
    });
}

function handleResize() {
    const isMobile = window.innerWidth <= 768;
    document.body.classList.toggle('mobile', isMobile);
}

function handleBackButton(e) {
    if (currentSection !== 'home') {
        e.preventDefault();
        navigateToHome();
    }
}

// ===== USER PROFILE MANAGEMENT =====
async function getUserProfile() {
    try {
        const profile = await liff.getProfile();
        updateUserProfile(profile);
        userProfile = profile;
    } catch (error) {
        console.error('Error getting profile', error);
        showMockUser();
    }
}

function showMockUser() {
    const mockProfile = {
        displayName: 'Nathan',
        pictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
    };
    updateUserProfile(mockProfile);
}

function updateUserProfile(profile) {
    const elements = {
        userAvatar: document.getElementById('userAvatar'),
        profileAvatarLarge: document.getElementById('profileAvatarLarge'),
        profileName: document.getElementById('profileName'),
        userName: document.getElementById('userName')
    };
    
    const avatarUrl = profile.pictureUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face';
    const firstName = profile.displayName ? profile.displayName.split(' ')[0] : 'Nathan';
    
    if (elements.userAvatar) elements.userAvatar.src = avatarUrl;
    if (elements.profileAvatarLarge) elements.profileAvatarLarge.src = avatarUrl;
    if (elements.profileName) elements.profileName.textContent = profile.displayName || 'Nathan';
    if (elements.userName) elements.userName.textContent = firstName;
}

// ===== SEARCH FUNCTIONALITY =====
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterMenuBySearch(searchTerm);
    }, 300));
}

function filterMenuBySearch(searchTerm) {
    if (!searchTerm) {
        loadMenu();
        return;
    }
    
    const filteredMenu = menuData.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    
    displayMenuItems(filteredMenu);
    
    if (filteredMenu.length === 0) {
        showEmptySearchResult(searchTerm);
    }
}

function showEmptySearchResult(searchTerm) {
    const menuContainer = document.getElementById('menuItems');
    if (menuContainer) {
        menuContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <h3>No results found</h3>
                <p>We couldn't find any items matching "${searchTerm}"</p>
                <button onclick="clearSearch()" class="retry-btn">Clear Search</button>
            </div>
        `;
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        loadMenu();
    }
}

// ===== MENU MANAGEMENT =====
function loadPopularMenus() {
    const filteredMenus = menuData.filter(item => 
        item.popularCategory === currentPopularCategory && item.isPopular
    );
    
    displayPopularMenus(filteredMenus);
}

function displayPopularMenus(items) {
    const container = document.getElementById('popularMenuGrid');
    if (!container) return;
    
    if (items.length === 0) {
        container.innerHTML = '<div class="empty-state">No popular items in this category</div>';
        return;
    }
    
    container.innerHTML = items.map(item => createPopularMenuCard(item)).join('');
    container.classList.add('animate-fadeIn');
}

function createPopularMenuCard(item) {
    const isFavorite = favorites.includes(item.id);
    
    return `
        <div class="popular-menu-card animate-slideInRight" data-id="${item.id}">
            <div class="popular-menu-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                <button class="menu-heart ${isFavorite ? 'active' : ''}" 
                        onclick="toggleFavorite(${item.id})" 
                        aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas fa-heart ${isFavorite ? 'text-red' : ''}"></i>
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
                    <button class="add-btn" onclick="addToCart(${item.id})" aria-label="Add to cart">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function loadMenu() {
    const filteredMenu = currentCategory === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);
    
    displayMenuItems(filteredMenu);
}

function displayMenuItems(items) {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) return;
    
    if (items.length === 0) {
        menuContainer.innerHTML = '<div class="empty-state">No menu items found</div>';
        return;
    }
    
    menuContainer.innerHTML = items.map(item => createMenuCard(item)).join('');
    menuContainer.classList.add('animate-fadeIn');
}

function createMenuCard(item) {
    const isFavorite = favorites.includes(item.id);
    
    return `
        <div class="menu-item-modern animate-fadeIn" data-category="${item.category}" data-id="${item.id}">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
                
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
                
                <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                        onclick="toggleFavorite(${item.id})" 
                        aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas fa-heart ${isFavorite ? 'text-red' : ''}"></i>
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
                    
                    <button class="add-to-cart-modern" onclick="addToCart(${item.id})" aria-label="Add to cart">
                        <i class="fas fa-plus"></i>
                        Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===== CATEGORY FILTERING =====
function filterPopular(category) {
    currentPopularCategory = category;
    
    document.querySelectorAll('.category-tab-horizontal').forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });
    
    event.target.classList.add('active');
    event.target.setAttribute('aria-selected', 'true');
    
    loadPopularMenus();
    showNotification(`Showing ${category} items`, 'info');
}

function filterByCategory(category) {
    currentCategory = category;
    loadMenu();
    showNotification(`Filtered by ${category}`, 'info');
}

// ===== NAVIGATION FUNCTIONS =====
function navigateToHome() {
    console.log('🏠 Navigating to home...');
    switchSection('home');
    showHomeContent();
    setActiveNavigation('home');
}

function navigateToExplore() {
    console.log('🧭 Navigating to explore...');
    switchSection('explore');
    showHomeContent();
    displayPopularItems();
    setActiveNavigation('explore');
    showNotification('Showing popular items', 'info');
}

function navigateToFavorites() {
    console.log('❤️ Navigating to favorites...');
    switchSection('favorites');
    showHomeContent();
    displayFavoriteItems();
    setActiveNavigation('favorites');
}

function navigateToProfile() {
    console.log('👤 Navigating to profile...');
    switchSection('profile');
    showProfileContent();
    setActiveNavigation('profile');
    updateFavoritesCount();
}

function switchSection(section) {
    currentSection = section;
}

function showHomeContent() {
    const homeContent = document.getElementById('homeContent');
    const profileSection = document.getElementById('profileSection');
    
    if (homeContent) {
        homeContent.style.display = 'block';
        homeContent.classList.remove('hidden');
    }
    if (profileSection) {
        profileSection.classList.add('hidden');
    }
}

function showProfileContent() {
    const homeContent = document.getElementById('homeContent');
    const profileSection = document.getElementById('profileSection');
    
    if (homeContent) {
        homeContent.style.display = 'none';
    }
    if (profileSection) {
        profileSection.classList.remove('hidden');
    }
}

function setActiveNavigation(activeSection) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    
    const navItems = document.querySelectorAll('.nav-item');
    const sectionMap = { home: 0, explore: 1, favorites: 3, profile: 4 };
    
    if (navItems[sectionMap[activeSection]]) {
        navItems[sectionMap[activeSection]].classList.add('active');
    }
}

function displayPopularItems() {
    const popularItems = menuData.filter(item => item.isPopular);
    displayMenuItems(popularItems);
}

function displayFavoriteItems() {
    const favoriteItems = menuData.filter(item => favorites.includes(item.id));
    
    if (favoriteItems.length === 0) {
        const menuContainer = document.getElementById('menuItems');
        if (menuContainer) {
            menuContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                    <h3>No favorites yet</h3>
                    <p>Start adding items to your favorites by tapping the heart icon</p>
                </div>
            `;
        }
    } else {
        displayMenuItems(favoriteItems);
    }
}

// ===== FAVORITES MANAGEMENT =====
function toggleFavorite(itemId) {
    const index = favorites.indexOf(itemId);
    const item = menuData.find(item => item.id === itemId);
    
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification(`${item.name} removed from favorites`, 'info');
    } else {
        favorites.push(itemId);
        showNotification(`${item.name} added to favorites`, 'success');
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    refreshCurrentView();
}

function updateFavoritesCount() {
    const favoritesCountEl = document.getElementById('favoritesCount');
    if (favoritesCountEl) {
        favoritesCountEl.textContent = `${favorites.length} items`;
    }
}

function refreshCurrentView() {
    if (currentSection === 'favorites') {
        displayFavoriteItems();
    } else if (currentSection === 'home') {
        loadPopularMenus();
        loadMenu();
    }
}

// ===== CART MANAGEMENT =====
function addToCart(itemId) {
    const item = menuData.find(item => item.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    showAddToCartAnimation(item.name);
    showNotification(`${item.name} added to cart`, 'success');
}

function updateCartUI() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const cartBadgeNav = document.getElementById('cartBadgeNav');
    if (cartBadgeNav) cartBadgeNav.textContent = cartCount;
    
    const totalPriceEl = document.getElementById('totalPrice');
    if (totalPriceEl) totalPriceEl.textContent = cartTotal.toLocaleString();
    
    updateCartItems();
    updateCheckoutButton();
}

function updateCartItems() {
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
        cartItemsContainer.innerHTML = cart.map(item => createCartItem(item)).join('');
    }
}

function createCartItem(item) {
    return `
        <div class="cart-item-modern">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="cart-item-info-modern">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString()} x ${item.quantity} = Rp ${(item.price * item.quantity).toLocaleString()}</p>
            </div>
            <div class="quantity-controls-modern">
                <button class="quantity-btn-modern" onclick="updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">
                    <i class="fas fa-minus"></i>
                </button>
                <span>${item.quantity}</span>
                <button class="quantity-btn-modern" onclick="updateQuantity(${item.id}, 1)" aria-label="Increase quantity">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    `;
}

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

function removeFromCart(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    updateCartUI();
    
    if (item) {
        showNotification(`${item.name} removed from cart`, 'info');
    }
}

function updateCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn-modern');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        
        if (cartSidebar.classList.contains('open')) {
            updateCartUI();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    showLoading('Processing your order...');
    
    setTimeout(() => {
        hideLoading();
        cart = [];
        updateCartUI();
        toggleCart();
        showNotification('Order placed successfully! 🎉', 'success', 5000);
    }, 2000);
}

// ===== ADDRESS MANAGEMENT =====
function editAddress() {
    const modal = document.getElementById('addressModal');
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        document.getElementById('addressName').value = deliveryAddress.name || '';
        document.getElementById('fullAddress').value = deliveryAddress.address || '';
        document.getElementById('phoneNumber').value = deliveryAddress.phone || '';
        document.getElementById('addressNote').value = deliveryAddress.note || '';
        
        modal.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeAddressModal() {
    const modal = document.getElementById('addressModal');
    const overlay = document.getElementById('overlay');
    
    if (modal && overlay) {
        modal.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function saveAddress() {
    const name = document.getElementById('addressName').value.trim();
    const address = document.getElementById('fullAddress').value.trim();
    const phone = document.getElementById('phoneNumber').value.trim();
    const note = document.getElementById('addressNote').value.trim();
    
    if (!name || !address || !phone) {
        showNotification('Please fill in all required fields', 'warning');
        return;
    }
    
    deliveryAddress = { name, address, phone, note };
    localStorage.setItem('deliveryAddress', JSON.stringify(deliveryAddress));
    
    updateDeliveryAddress();
    closeAddressModal();
    showNotification('Address saved successfully', 'success');
}

function updateDeliveryAddress() {
    const addressEl = document.getElementById('deliveryAddress');
    if (addressEl) {
        addressEl.textContent = `${deliveryAddress.name} - ${deliveryAddress.address}`;
    }
}

// ===== PROFILE FUNCTIONS =====
function showProfileFavorites() {
    navigateToFavorites();
}

function showOrderHistory() {
    showNotification('Order history feature coming soon!', 'info');
}

function showSettings() {
    showNotification('Settings feature coming soon!', 'info');
}

function showHelp() {
    showNotification('Help & Support feature coming soon!', 'info');
}

// ===== NEW PROFILE FUNCTIONS =====
function editProfile() {
    showNotification('Edit profile feature coming soon!', 'info');
}

function showPaymentMethods() {
    showNotification('Payment methods feature coming soon!', 'info');
}

function showRewards() {
    showNotification('🎁 You have 850 points available! Rewards feature coming soon.', 'success');
}

function showNotificationSettings() {
    showNotification('Notification settings feature coming soon!', 'info');
}

function showAbout() {
    showNotification('About: Food Delivery App v2.1.0 - Modern LIFF Application', 'info', 4000);
}

function showRecentOrders() {
    showNotification('Recent orders feature coming soon!', 'info');
}

function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: '🍔 Food Delivery App',
            text: 'Check out this amazing food delivery app!',
            url: window.location.href
        }).then(() => {
            showNotification('Thanks for sharing! 🎉', 'success');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    const url = window.location.href;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('App link copied to clipboard! 📋', 'success');
        });
    } else {
        showNotification('Share feature not supported on this device', 'warning');
    }
}

function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        showLoading('Signing out...');
        
        setTimeout(() => {
            hideLoading();
            
            // Clear local data
            cart = [];
            favorites = [];
            localStorage.removeItem('favorites');
            localStorage.removeItem('deliveryAddress');
            
            // Reset UI
            updateCartUI();
            updateFavoritesCount();
            
            showNotification('Successfully signed out! 👋', 'success');
            
            // Navigate to home
            navigateToHome();
        }, 1500);
    }
}

// ===== MODAL MANAGEMENT =====
function closeAllModals() {
    const modals = document.querySelectorAll('.address-modal, .cart-sidebar-modern');
    const overlay = document.getElementById('overlay');
    
    modals.forEach(modal => modal.classList.remove('show', 'open'));
    if (overlay) overlay.classList.remove('show');
    
    document.body.style.overflow = '';
}

// ===== ANIMATIONS =====
function showAddToCartAnimation(itemName) {
    const cartIcon = document.querySelector('.nav-cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => cartIcon.classList.remove('animate-bounce'), 1000);
    }
}

function showWelcomeAnimation() {
    const header = document.querySelector('.modern-header');
    if (header) {
        header.classList.add('animate-slideInRight');
    }
}

// ===== UTILITY FUNCTIONS =====
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading(message = 'Loading...') {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.querySelector('p').textContent = message;
        loading.classList.remove('hidden');
    }
    isLoading = true;
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
    isLoading = false;
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info', duration = 3000) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
    `;
    
    notification.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting Modern Food Delivery App...');
    initializeLiff();
});

// Handle errors gracefully
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('Something went wrong. Please try again.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('Something went wrong. Please try again.', 'error');
});

console.log('✅ Food Delivery App Script Loaded Successfully'); 
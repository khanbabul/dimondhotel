// Sample menu data (in a real app, this would come from an API)
const menuItems = [
    {
        id: 1,
        name: 'Chicken Tandoori',
        description: 'Tender chicken cooked in a rich, spicy tomato-based gravy.',
        price: 1200,
        category: 'Main Course',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY0dtuGiPhd3bowXxrbe9OyigH-M76VDV0nA&s'


    },
    {
        id: 2,
        name: 'Biryani',
        description: 'Fragrant basmati rice cooked with tender meat, aromatic spices.',
        price: 1000,
        category: 'Main Course',
        image: 'https://static.toiimg.com/thumb/54308405.cms?imgsize=510571&width=800&height=800'
    },
    {
        id: 3,
        name: 'Seekh Kebab',
        description: 'Minced meat kebabs, seasoned with herbs and spices.',
        price: 800,
        category: 'Appetizer',
        image: 'https://c.ndtvimg.com/2020-01/a39okhfk_620_625x300_21_January_20.jpg'
    },
    {
        id: 4,
        name: 'Daal Makhani',
        description: 'Black lentils slow-cooked with butter and cream, with spices.',
        price: 600,
        category: 'Main Course',
        image: 'https://www.greedygourmet.com/wp-content/uploads/2013/02/dal-makhani-feature.jpg'
    },
    {
        id: 5,
        name: 'Naan',
        description: 'Traditional tandoor-baked flatbread, beautiful  soft and fluffy.',
        price: 80,
        category: 'Bread',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz1UqXILbuYvsqb3PVlBL_-UGgVuY6DKw3SQ&s'
    },
    {
        id: 6,
        name: 'Gulab Jamun',
        description: 'Sweet fried dough balls soaked in sugar syrup, served warm.',
        price: 200,
        category: 'Dessert',
        image: 'https://www.cadburydessertscorner.com/hubfs/dc-website-2022/articles/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know/soft-gulab-jamun-recipe-for-raksha-bandhan-from-dough-to-syrup-all-you-need-to-know.webp'
    },
    {
        id: 7,
        name: 'Chapli Kebab',
        description: 'Spiced ground beef patties with herbs and pomegranate seeds.',
        price: 900,
        category: 'Appetizer',
        image: 'https://i.ytimg.com/vi/r7uHBnio2vE/maxresdefault.jpg'
    },
    {
        id: 8,
        name: 'Pulao',
        description: 'Fragrant rice dish cooked with meat, and garnished with fried onions.',
        price: 850,
        category: 'Main Course',
        image: 'https://i0.wp.com/aartimadan.com/wp-content/uploads/2020/12/Kashmiri-Pulao.jpg?fit=1000%2C561&ssl=1'
    }
];

// Cart state
let cart = [];

// DOM Elements
const menuContainer = document.getElementById('menu-items');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const cartCountElement = document.getElementById('cart-count');
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    loadCartFromStorage();
    setupEventListeners();
});

// Load menu items
function loadMenu() {
    menuContainer.innerHTML = '';
    
    menuItems.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'col-md-6 col-lg-4 col-xl-3 mb-4 menu-item';
        menuItem.style.animationDelay = `${index * 0.1}s`;
        
        menuItem.innerHTML = `
            <div class="card menu-card h-100">
                <img src="${item.image}" class="card-img-top menu-img" alt="${item.name}">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title mb-0">${item.name}</h5>
                        <span class="price">Rs. ${item.price.toLocaleString()}</span>
                    </div>
                    <p class="card-text flex-grow-1">${item.description}</p>
                    <button class="btn btn-add-to-cart" data-id="${item.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        menuContainer.appendChild(menuItem);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart button click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            addToCart(itemId);
        }
        
        // Remove item from cart
        if (e.target.classList.contains('remove-item')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            removeFromCart(itemId);
        }
        
        // Quantity buttons
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = parseInt(e.target.closest('.cart-item').getAttribute('data-id'));
            const isIncrement = e.target.textContent === '+';
            updateQuantity(itemId, isIncrement);
        }
    });
    
    // Cart icon click
    document.getElementById('cart-icon').addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        cartModal.show();
    });
    
    // Checkout button click
    document.getElementById('checkout-btn').addEventListener('click', () => {
        checkout();
    });
    
    // Contact form submission
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        submitContactForm();
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Cart functions
function addToCart(itemId) {
    const existingItem = cart.find(item => item.id === itemId);
    const menuItem = menuItems.find(item => item.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else if (menuItem) {
        cart.push({
            ...menuItem,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    
    // Show success message
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Added to cart!',
        showConfirmButton: false,
        timer: 1500,
        toast: true
    });
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCartToStorage();
    updateCartCount();
    renderCart();
    
    // Show remove message
    Swal.fire({
        position: 'top-end',
        icon: 'info',
        title: 'Item removed',
        showConfirmButton: false,
        timer: 1000,
        toast: true
    });
}

function updateQuantity(itemId, isIncrement) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;
    
    if (isIncrement) {
        item.quantity += 1;
    } else {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(itemId);
            return;
        }
    }
    
    saveCartToStorage();
    updateCartCount();
    renderCart();
}

function renderCart() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center py-3">Your cart is empty</p>';
        document.getElementById('checkout-btn').disabled = true;
    } else {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.setAttribute('data-id', item.id);
            
            cartItem.innerHTML = `
                <div class="item-details">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="mb-0 text-muted">Rs. ${item.price.toLocaleString()} × ${item.quantity}</p>
                </div>
                <div class="d-flex align-items-center">
                    <div class="item-quantity">
                        <span class="quantity-btn">-</span>
                        <span class="quantity">${item.quantity}</span>
                        <span class="quantity-btn">+</span>
                    </div>
                    <div class="ms-3">
                        <i class="fas fa-trash remove-item"></i>
                    </div>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        document.getElementById('checkout-btn').disabled = false;
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = total.toLocaleString();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = count;
}

function checkout() {
    if (cart.length === 0) return;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    Swal.fire({
        title: 'Confirm Order',
        html: `You are about to place an order for <b>${cart.length} items</b> with a total of <b>Rs. ${total.toLocaleString()}</b>.<br><br>Please confirm to proceed.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Place Order',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#28a745',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            return new Promise((resolve) => {
                // In a real app, you would send the order to your backend here
                setTimeout(() => {
                    // Clear the cart after successful order
                    cart = [];
                    saveCartToStorage();
                    updateCartCount();
                    resolve();
                }, 1500);
            });
        },
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Order Placed!',
                'Your order has been placed successfully. Thank you!',
                'success'
            );
            cartModal.hide();
        }
    });
}

// Contact form submission
function submitContactForm() {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());
    
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formValues);
    
    // Show success message
    Swal.fire({
        title: 'Thank You!',
        text: 'Your message has been sent. We will get back to you soon!',
        icon: 'success',
        confirmButtonText: 'OK'
    });
    
    // Reset form
    form.reset();
}

// Local Storage functions
function saveCartToStorage() {
    localStorage.setItem('diamondHotelCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('diamondHotelCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Initialize tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.menu-item');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial animation
    setTimeout(animateOnScroll, 500);
    
    // Add animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

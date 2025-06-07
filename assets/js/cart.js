// Shopping cart and wishlist functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.updateWishlistCount();
        this.setupEventListeners();
        this.createCartFlyout();
        this.setupScrollHandler();
    }

    setupScrollHandler() {
        let lastScroll = window.pageYOffset;
        let scrollTimer;

        window.addEventListener('scroll', () => {
            const flyout = document.querySelector('.cart-flyout');
            if (flyout && flyout.classList.contains('active')) {
                const currentScroll = window.pageYOffset;
                if (Math.abs(currentScroll - lastScroll) > 30) {
                    clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(() => {
                        this.closeCartFlyout();
                    }, 150);
                }
                lastScroll = currentScroll;
            }
        }, { passive: true });
    }

    createCartFlyout() {
        if (!document.querySelector('.cart-flyout')) {
            const flyout = document.createElement('div');
            flyout.className = 'cart-flyout';
            flyout.innerHTML = `
                <div class="cart-flyout--inner">
                    <button class="btn-close-cart">
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                    <div class="cart-flyout__content">
                        <div class="cart-flyout__heading">Shopping Cart</div>
                        <div class="cart-items"></div>
                        <div class="cart-summary">
                            <div class="cart-total">
                                <span>Total:</span>
                                <span class="total-amount">₹0.00</span>
                            </div>
                            <div class="cart-buttons">
                                <button class="btn btn-outline view-cart-btn">View Cart</button>
                                <button class="btn btn-primary checkout-btn">Checkout</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(flyout);

            // Close button handler
            const closeBtn = flyout.querySelector('.btn-close-cart');
            closeBtn.addEventListener('click', () => this.closeCartFlyout());

            // Cart navigation buttons
            const viewCartBtn = flyout.querySelector('.view-cart-btn');
            const checkoutBtn = flyout.querySelector('.checkout-btn');
            
            viewCartBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
            
            checkoutBtn.addEventListener('click', () => {
                window.location.href = 'checkout.html';
            });
        }
    }

    setupEventListeners() {
        // Add to cart click handler
        document.addEventListener('click', (e) => {
            const cartBtn = e.target.closest('.cart-btn');
            if (cartBtn) {
                const productCard = e.target.closest('.product-card');
                const productData = this.getProductDataFromCard(productCard);
                this.addToCart(productData);
            }
        });

        // Cart icon click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="cart"]')) {
                this.openCartFlyout();
            }
        });

        // Add to wishlist click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.card-action-btn[aria-label="Add to Whishlist"]')) {
                const productCard = e.target.closest('.product-card');
                const productData = this.getProductDataFromCard(productCard);
                this.addToWishlist(productData);
            }
        });

        // Wishlist icon click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="wishlist"]')) {
                // TODO: Implement wishlist page navigation
                console.log('Navigate to wishlist page');
            }
        });
    }

    addToCart(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.updateCartState();
        this.openCartFlyout();
        this.showNotification('Product added to cart successfully!');
    }

    addToWishlist(product) {
        if (!this.wishlist.some(item => item.id === product.id)) {
            this.wishlist.push(product);
            this.updateWishlistState();
            this.showNotification('Product added to wishlist successfully!');
        } else {
            this.showNotification('Product is already in your wishlist!');
        }
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.updateCartState();
        this.showNotification('Product removed from cart!');
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.updateWishlistState();
        this.showNotification('Product removed from wishlist!');
    }

    updateCartState() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
        this.renderCartItems();
        this.updateCartTotal();
    }

    updateWishlistState() {
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistCount();
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + (item.quantity || 1), 0);
        document.querySelectorAll('[data-action="cart"] .btn-badge').forEach(badge => {
            badge.textContent = count;
        });
    }

    updateWishlistCount() {
        document.querySelectorAll('[data-action="wishlist"] .btn-badge').forEach(badge => {
            badge.textContent = this.wishlist.length;
        });
    }

    openCartFlyout() {
        const flyout = document.querySelector('.cart-flyout');
        flyout.classList.add('active');
        this.renderCartItems();
        this.updateCartTotal();
    }

    closeCartFlyout() {
        const flyout = document.querySelector('.cart-flyout');
        flyout.classList.remove('active');
    }

    renderCartItems() {
        const cartItems = document.querySelector('.cart-items');
        if (!cartItems) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-content">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₹${item.price.toFixed(2)} × ${item.quantity}</div>
                </div>
                <button class="remove-item" onclick="cart.removeFromCart('${item.id}')">
                    <ion-icon name="close-outline"></ion-icon>
                </button>
            </div>
        `).join('');
    }

    updateCartTotal() {
        const totalElement = document.querySelector('.total-amount');
        if (totalElement) {
            const total = this.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
            totalElement.textContent = `₹${total.toFixed(2)}`;
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    getProductDataFromCard(card) {
        const priceElement = card.querySelector('.card-price data');
        const price = priceElement ? parseFloat(priceElement.value) : 0;
        
        return {
            id: card.dataset.productId || Math.random().toString(36).substr(2, 9),
            name: card.querySelector('.card-title a').textContent,
            price: price,
            image: card.querySelector('.card-banner img').src
        };
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    window.cart = new ShoppingCart();
});

// Cart page functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.getElementById('cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');

    function renderCartTable() {
        if (!window.cart || !window.cart.items.length) {
            cartItems.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-cart-message">
                        Your cart is empty. <a href="category.html">Continue shopping</a>
                    </td>
                </tr>
            `;
            updateTotals();
            return;
        }

        cartItems.innerHTML = window.cart.items.map(item => `
            <tr data-id="${item.id}">
                <td class="product-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="product-details">
                        <h4>${item.name}</h4>
                    </div>
                </td>
                <td class="price">₹${item.price.toFixed(2)}</td>
                <td class="quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="number" value="${item.quantity}" min="1" max="99" class="quantity-input">
                        <button class="quantity-btn plus">+</button>
                    </div>
                </td>
                <td class="item-total">₹${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="remove-btn" onclick="removeItem('${item.id}')">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add event listeners for quantity controls
        document.querySelectorAll('.quantity-controls').forEach(control => {
            const input = control.querySelector('.quantity-input');
            const minusBtn = control.querySelector('.minus');
            const plusBtn = control.querySelector('.plus');
            const itemId = control.closest('tr').dataset.id;

            input.addEventListener('change', () => updateQuantity(itemId, parseInt(input.value)));
            minusBtn.addEventListener('click', () => updateQuantity(itemId, parseInt(input.value) - 1));
            plusBtn.addEventListener('click', () => updateQuantity(itemId, parseInt(input.value) + 1));
        });

        updateTotals();
    }

    function updateQuantity(itemId, newQuantity) {
        if (newQuantity < 1) return;
        
        const item = window.cart.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            window.cart.updateCartState();
            renderCartTable();
        }
    }

    function updateTotals() {
        const subtotal = window.cart ? window.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        totalElement.textContent = `₹${subtotal.toFixed(2)}`; // Add shipping cost here if needed
    }

    window.removeItem = function(itemId) {
        if (window.cart) {
            window.cart.removeFromCart(itemId);
            renderCartTable();
        }
    };

    checkoutBtn.addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });

    // Initial render
    renderCartTable();
});

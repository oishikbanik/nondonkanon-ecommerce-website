// Checkout page functionality
document.addEventListener('DOMContentLoaded', () => {
    const orderItems = document.querySelector('.order-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-amount');
    const checkoutForm = document.getElementById('checkout-form');

    function renderOrderSummary() {
        if (!window.cart || !window.cart.items.length) {
            window.location.href = 'cart.html';
            return;
        }

        orderItems.innerHTML = window.cart.items.map(item => `
            <div class="order-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                    <span class="item-quantity">${item.quantity}</span>
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            </div>
        `).join('');

        updateTotals();
    }

    function updateTotals() {
        const subtotal = window.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        totalElement.textContent = `₹${subtotal.toFixed(2)}`; // Add shipping cost here if needed
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        // Basic form validation
        const form = e.target;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect form data
        const formData = {
            contact: {
                email: form.email.value,
                phone: form.phone.value
            },
            shipping: {
                firstName: form.firstName.value,
                lastName: form.lastName.value,
                address: form.address.value,
                apartment: form.apartment.value,
                city: form.city.value,
                state: form.state.value,
                pincode: form.pincode.value
            },
            payment: form.payment.value,
            items: window.cart.items,
            total: parseFloat(totalElement.textContent.replace('₹', ''))
        };

        // Simulate order processing
        processOrder(formData);
    }

    function processOrder(orderData) {
        // Show loading state
        const submitBtn = checkoutForm.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        // Simulate API call
        setTimeout(() => {
            // Clear cart
            window.cart.items = [];
            window.cart.updateCartState();

            // Show success message and redirect
            alert('Order placed successfully! Thank you for shopping with us.');
            window.location.href = 'index.html';
        }, 2000);
    }

    // Event listeners
    checkoutForm.addEventListener('submit', handleFormSubmit);

    // Initialize
    renderOrderSummary();

    // Form validation and formatting
    const pincodeInput = document.getElementById('pincode');
    pincodeInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    });

    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
});

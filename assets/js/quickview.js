// Quick view functionality
function createQuickViewModal() {
    // Create modal HTML if it doesn't exist
    if (!document.getElementById('quickview-modal')) {
        const modal = document.createElement('div');
        modal.id = 'quickview-modal';
        modal.className = 'quickview-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="product-details">
                    <div class="product-image"></div>
                    <div class="product-info">
                        <h2 class="product-title"></h2>
                        <div class="product-price"></div>
                        <p class="product-description"></p>
                        <div class="product-meta">
                            <p class="stock-info"></p>
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-primary add-to-cart">Add to Cart</button>
                            <button class="btn btn-outline add-to-wishlist">
                                <ion-icon name="heart-outline"></ion-icon>
                                Add to Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add close functionality
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

// Open quick view modal with product details
function openQuickView(product) {
    const modal = document.getElementById('quickview-modal');
    if (!modal) {
        createQuickViewModal();
    }

    const productImage = modal.querySelector('.product-image');
    const productTitle = modal.querySelector('.product-title');
    const productPrice = modal.querySelector('.product-price');
    const productDescription = modal.querySelector('.product-description');
    const stockInfo = modal.querySelector('.stock-info');
    const addToCartBtn = modal.querySelector('.add-to-cart');
    const addToWishlistBtn = modal.querySelector('.add-to-wishlist');

    productImage.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
    productTitle.textContent = product.name;
    productPrice.innerHTML = `
        <data value="${product.price}">₹${product.price}</data>
        ${product.originalPrice ? `<data value="${product.originalPrice}">₹${product.originalPrice}</data>` : ''}
    `;
    productDescription.textContent = product.description;
    stockInfo.textContent = `Stock: ${product.stock} items`;

    // Update button event listeners with product data
    addToCartBtn.onclick = () => addToCart(product);
    addToWishlistBtn.onclick = () => addToWishlist(product);

    modal.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    createQuickViewModal();

    // Add quick view event listeners to all quick view buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.card-action-btn[aria-label="Quick view"]')) {
            const productCard = e.target.closest('.product-card');
            const productData = getProductDataFromCard(productCard);
            openQuickView(productData);
        }
    });
});

function getProductDataFromCard(card) {
    return {
        name: card.querySelector('.card-title a').textContent,
        price: parseFloat(card.querySelector('.card-price data').value),
        originalPrice: card.querySelector('.card-price data:nth-child(2)')?.value,
        image: card.querySelector('.card-banner img').src,
        description: card.querySelector('.product-description')?.textContent || 'No description available',
        stock: parseInt(card.querySelector('.stock-info')?.textContent.match(/\d+/) || 0),
        id: card.dataset.productId
    };
}

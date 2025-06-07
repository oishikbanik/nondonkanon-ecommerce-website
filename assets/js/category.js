// Sample product data - In a real application, this would come from a database
const products = {
    saree: [
        {
            id: 1,
            name: "Traditional Silk Saree",
            price: 299.99,
            originalPrice: 399.99,
            image: "./assets/images/hero-saree.webp",
            badge: "sale",
            stock: 15,
            description: "Elegant traditional silk saree with intricate embroidery"
        },
        {
            id: 2,
            name: "Designer Wedding Saree",
            price: 499.99,
            originalPrice: 599.99,
            image: "./assets/images/product-1.jpg",
            badge: "new",
            stock: 10,
            description: "Beautiful designer wedding saree with heavy work"
        },
        {
            id: 3,
            name: "Casual Cotton Saree",
            price: 199.99,
            image: "./assets/images/product-2.jpg",
            stock: 20,
            description: "Comfortable cotton saree for daily wear"
        },
        {
            id: 4,
            name: "Party Wear Saree",
            price: 399.99,
            image: "./assets/images/product-8.jpg",
            badge: "trending",
            stock: 8,
            description: "Stylish party wear saree with modern design"
        }
    ],
    jewelry: [
        {
            id: 1,
            name: "Gold Plated Necklace Set",
            price: 199.99,
            originalPrice: 249.99,
            image: "./assets/images/hero-jewelary-2.webp",
            badge: "new",
            stock: 10,
            description: "Beautiful gold plated necklace set with matching earrings"
        },
        {
            id: 2,
            name: "Diamond Ring",
            price: 999.99,
            image: "./assets/images/product-3.jpg",
            badge: "premium",
            stock: 5,
            description: "Elegant diamond ring with excellent clarity"
        },
        {
            id: 3,
            name: "Pearl Earrings",
            price: 149.99,
            originalPrice: 179.99,
            image: "./assets/images/product-4.jpg",
            badge: "sale",
            stock: 15,
            description: "Classic pearl earrings for any occasion"
        },
        {
            id: 4,
            name: "Gold Bracelet",
            price: 299.99,
            image: "./assets/images/product-7.jpg",
            badge: "new",
            stock: 12,
            description: "Handcrafted gold bracelet with intricate design"
        }
    ],
    skincare: [
        {
            id: 1,
            name: "Luxury Face Cream",
            price: 89.99,
            originalPrice: 99.99,
            image: "./assets/images/skincare 4.webp",
            badge: "best-seller",
            stock: 20,
            description: "Premium anti-aging face cream with natural ingredients"
        },
        {
            id: 2,
            name: "Facial Serum",
            price: 59.99,
            image: "./assets/images/product-5.jpg",
            stock: 25,
            description: "Hydrating facial serum with vitamin C"
        },
        {
            id: 3,
            name: "Night Cream",
            price: 79.99,
            originalPrice: 89.99,
            image: "./assets/images/product-6.jpg",
            badge: "sale",
            stock: 18,
            description: "Regenerating night cream for all skin types"
        },
        {
            id: 4,
            name: "Anti-Aging Kit",
            price: 129.99,
            image: "./assets/images/product-9.jpg",
            badge: "new",
            stock: 10,
            description: "Complete anti-aging skincare kit"
        }
    ]
};

// Get the category from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');

// Update page title and content based on category
document.addEventListener('DOMContentLoaded', () => {
    console.log('Category page loaded');
    const categoryTitle = document.getElementById('category-title');
    const productList = document.getElementById('category-products');
    
    console.log('Current category:', category);
    
    if (category && products[category]) {
        console.log('Rendering category products:', products[category]);
        categoryTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`;
        renderProducts(products[category]);
    } else {
        console.log('Rendering all products');
        categoryTitle.textContent = 'All Products';
        renderProducts(Object.values(products).flat());
    }

    // Add event listeners for filters and sorting
    setupFilters();
});

function renderProducts(productsList) {
    const productList = document.getElementById('category-products');
    productList.innerHTML = '';    productsList.forEach(product => {
        // Ensure each product has a unique ID
        if (!product.id) {
            product.id = Math.random().toString(36).substr(2, 9);
        }
        
        const productHTML = `
            <li>
                <div class="product-card" data-product-id="${product.id}">
                    <figure class="card-banner">
                        <a href="#">
                            <img src="${product.image}" alt="${product.name}" loading="lazy" width="800" height="1034" class="w-100">
                        </a>
                        ${product.badge ? `<div class="card-badge ${product.badge === 'sale' ? 'red' : 'green'}">${product.badge}</div>` : ''}
                        <div class="card-actions">
                            <button class="card-action-btn" aria-label="Quick view">
                                <ion-icon name="eye-outline"></ion-icon>
                            </button>
                            <button class="card-action-btn cart-btn">
                                <ion-icon name="bag-handle-outline" aria-hidden="true"></ion-icon>
                                <p>Add to Cart</p>
                            </button>
                            <button class="card-action-btn" aria-label="Add to Wishlist">
                                <ion-icon name="heart-outline"></ion-icon>
                            </button>
                        </div>
                    </figure>
                    <div class="card-content">
                        <h3 class="h4 card-title">
                            <a href="#">${product.name}</a>
                        </h3>
                        <div class="card-price">                            <data value="${product.price}">₹${product.price}</data>
                            ${product.originalPrice ? `<data value="${product.originalPrice}">₹${product.originalPrice}</data>` : ''}
                        </div>
                        <p class="stock-info">Stock: ${product.stock} items</p>
                        <p class="product-description">${product.description}</p>
                    </div>
                </div>
            </li>
        `;
        productList.innerHTML += productHTML;
    });
}

function setupFilters() {
    const sortSelect = document.getElementById('sort');
    const filterButtons = document.querySelectorAll('.filter-btn');

    sortSelect.addEventListener('change', () => {
        const currentProducts = getCurrentProducts();
        sortProducts(currentProducts, sortSelect.value);
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const currentProducts = getCurrentProducts();
            filterProducts(currentProducts, button.dataset.filter);
        });
    });
}

function getCurrentProducts() {
    if (category && products[category]) {
        return products[category];
    }
    return Object.values(products).flat();
}

function sortProducts(productsList, sortType) {
    let sortedProducts = [...productsList];
    
    switch(sortType) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            // In a real application, you would sort by date
            break;
        case 'popular':
            // In a real application, you would sort by popularity metrics
            break;
    }

    renderProducts(sortedProducts);
}

function filterProducts(productsList, filterType) {
    let filteredProducts = [...productsList];
    
    switch(filterType) {
        case 'in-stock':
            filteredProducts = filteredProducts.filter(product => product.stock > 0);
            break;
        case 'sale':
            filteredProducts = filteredProducts.filter(product => product.originalPrice > product.price);
            break;
        // 'all' case doesn't need filtering
    }

    renderProducts(filteredProducts);
}

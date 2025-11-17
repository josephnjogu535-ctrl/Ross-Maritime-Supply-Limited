// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // === MOCK PRODUCT DATABASE ===
    // In a real app, this would come from a server/API
    const allProducts = [
        { id: 1, name: "AIS Transceiver", price: 450.00, img: "https://placehold.co/400x300?text=AIS+Transceiver", category: "Navigation" },
        { id: 2, name: "Offshore Life Raft (6-Person)", price: 1800.00, img: "https://placehold.co/400x300?text=Life+Raft", category: "Safety Gear" },
        { id: 3, name: "Marine VHF Radio", price: 220.00, img: "https://placehold.co/400x300?text=VHF+Radio", category: "Navigation" },
        { id: 4, name: "Stainless Steel Anchor", price: 300.00, img: "https://placehold.co/400x300?text=Anchor", category: "Deck Hardware" },
        { id: 5, name: "Impeller Puller Kit", price: 85.00, img: "https://placehold.co/400x300?text=Impeller+Kit", category: "Engine Parts" },
        { id: 6, name: "Personal Locator Beacon (PLB)", price: 350.00, img: "https://placehold.co/400x300?text=PLB", category: "Safety Gear" },
        { id: 7, name: "Marine GPS Plotter", price: 1200.00, img: "https://placehold.co/400x300?text=GPS+Plotter", category: "Navigation" },
        { id: 8, name: "Diesel Fuel Filter", price: 75.00, img: "https://placehold.co/400x300?text=Fuel+Filter", category: "Engine Parts" }
    ];

    // === CART LOGIC (using localStorage for persistence) ===
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to save cart to localStorage
    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };

    // Function to update cart icon count
    const updateCartCount = () => {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    };

    // Function to add a product to the cart
    const addToCart = (productId) => {
        const product = allProducts.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        alert(`${product.name} added to cart!`);
    };

    // Function to remove item from cart
    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        // Re-render the cart page if we're on it
        if (window.location.pathname.includes('cart.html')) {
            renderCartPage();
        }
    };

    // Function to update item quantity in cart
    const updateQuantity = (productId, newQuantity) => {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            if (newQuantity > 0) {
                cartItem.quantity = newQuantity;
            } else {
                // If quantity is 0 or less, remove the item
                removeFromCart(productId);
                return; // Exit function early
            }
        }
        saveCart();
        // Re-render the cart page if we're on it
        if (window.location.pathname.includes('cart.html')) {
            renderCartPage();
        }
    };

    // === PAGE-SPECIFIC RENDERING ===

    // Function to render a single product card
    const createProductCard = (product) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <a href="product-details.html" class="product-link" data-product-id="${product.id}">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
            </a>
            <p class="price">$${product.price.toFixed(2)}</p>
            <button class="btn add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        `;
        return card;
    };

    // --- 1. Landing Page (index.html) ---
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const featuredGrid = document.getElementById('featured-products');
        if (featuredGrid) {
            // Get first 4 products as "featured"
            const featuredProducts = allProducts.slice(0, 4);
            featuredProducts.forEach(product => {
                featuredGrid.appendChild(createProductCard(product));
            });
        }
    }

    // --- 2. All Products Page (products.html) ---
    if (window.location.pathname.includes('products.html')) {
        const allProductsGrid = document.getElementById('all-products-grid');
        const filterBtn = document.getElementById('filter-btn');
        const categoryFilter = document.getElementById('filter-category');
        const priceFilter = document.getElementById('filter-price');
        const priceValue = document.getElementById('price-value');

        // Function to render products based on filters
        const renderAllProducts = () => {
            const category = categoryFilter.value;
            const maxPrice = parseFloat(priceFilter.value);

            allProductsGrid.innerHTML = ''; // Clear existing products
            
            const filteredProducts = allProducts.filter(product => {
                const categoryMatch = (category === 'all') || (product.category === category);
                const priceMatch = product.price <= maxPrice;
                return categoryMatch && priceMatch;
            });

            if (filteredProducts.length === 0) {
                allProductsGrid.innerHTML = '<p>No products match your filters.</p>';
            } else {
                filteredProducts.forEach(product => {
                    allProductsGrid.appendChild(createProductCard(product));
                });
            }
        };

        // Update price range display
        priceFilter.addEventListener('input', () => {
            priceValue.textContent = `$${priceFilter.value}`;
        });

        // Add event listener for filter button
        filterBtn.addEventListener('click', renderAllProducts);
        
        // Initial render
        renderAllProducts();
    }

    // --- 3. Product Details Page (product-details.html) ---
    if (window.location.pathname.includes('product-details.html')) {
        const detailsContainer = document.getElementById('product-details-content');
        
        // Get the saved product ID from localStorage
        const productId = parseInt(localStorage.getItem('selectedProductId'));
        
        if (productId && detailsContainer) {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                detailsContainer.innerHTML = `
                    <div class="product-details-layout">
                        <div class="product-image-gallery">
                            <img src="${product.img}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h1>${product.name}</h1>
                            <p class="price">$${product.price.toFixed(2)}</p>
                            <p>This is a detailed description for the ${product.name}. It's a high-quality product perfect for your maritime needs. Built to last in harsh marine environments.</p>
                            <p><strong>Category:</strong> ${product.category}</p>
                            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                        </div>
                    </div>
                `;
            } else {
                detailsContainer.innerHTML = '<p>Product not found.</p>';
            }
        } else if (detailsContainer) {
            detailsContainer.innerHTML = '<p>No product selected. Please go back to the <a href="products.html">products page</a>.</p>';
        }

        // --- BONUS CHALLENGE: Feedback Form ---
        const feedbackForm = document.getElementById('feedback-form');
        const feedbackResponse = document.getElementById('feedback-response');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // ** YOUR SHEETDB API URL GOES HERE **
                // 1. Create a Google Sheet
                // 2. Add columns: name, rating, comment
                // 3. Go to SheetDB.io, create an API, and paste the URL below.
                const SHEETDB_API_URL = 'YOUR_SHEETDB_API_URL_GOES_HERE';

                if (SHEETDB_API_URL === 'YOUR_SHEETDB_API_URL_GOES_HERE') {
                    feedbackResponse.textContent = 'Feedback form is not configured. (See app.js)';
                    feedbackResponse.style.color = 'red';
                    return;
                }

                const name = document.getElementById('feedback-name').value;
                const rating = document.getElementById('feedback-rating').value;
                const comment = document.getElementById('feedback-comment').value;
                
                feedbackResponse.textContent = 'Submitting...';
                feedbackResponse.style.color = 'blue';

                try {
                    const response = await fetch(SHEETDB_API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            data: {
                                name: name,
                                rating: rating,
                                comment: comment
                            }
                        })
                    });

                    if (response.ok) {
                        feedbackResponse.textContent = 'Thank you for your feedback!';
                        feedbackResponse.style.color = 'green';
                        feedbackForm.reset();
                    } else {
                        throw new Error('Failed to submit feedback.');
                    }
                } catch (error) {
                    feedbackResponse.textContent = 'Error submitting. Please try again.';
                    feedbackResponse.style.color = 'red';
                }
            });
        }
    }
    
    // --- 4. Cart Page (cart.html) ---
    const renderCartPage = () => {
        const cartContainer = document.getElementById('cart-items-container');
        const cartTotalElement = document.getElementById('cart-total');

        if (cartContainer) {
            cartContainer.innerHTML = ''; // Clear existing items
            if (cart.length === 0) {
                cartContainer.innerHTML = '<p>Your cart is empty.</p>';
                cartTotalElement.textContent = 'Total: $0.00';
            } else {
                let total = 0;
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const cartItemElement = document.createElement('div');
                    cartItemElement.className = 'cart-item';
                    cartItemElement.innerHTML = `
                        <img src="${item.img}" alt="${item.name}">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)}</p>
                        </div>
                        <input class="cart-quantity-input" type="number" value="${item.quantity}" min="1" data-product-id="${item.id}">
                        <p class="price">$${itemTotal.toFixed(2)}</p>
                        <button class="remove-btn" data-product-id="${item.id}">&times;</button>
                    `;
                    cartContainer.appendChild(cartItemElement);
                });
                cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
            }
        }
    };
    
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();

        // Add event listeners for cart page (remove, update quantity)
        document.getElementById('cart-items-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                removeFromCart(productId);
            }
        });
        
        document.getElementById('cart-items-container').addEventListener('change', (e) => {
            if (e.target.classList.contains('cart-quantity-input')) {
                const productId = parseInt(e.target.dataset.productId);
                const newQuantity = parseInt(e.target.value);
                updateQuantity(productId, newQuantity);
            }
        });
    }

    // === GLOBAL EVENT LISTENERS ===

    // Add-to-cart buttons (listens on the whole document)
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.productId);
            addToCart(productId);
        }

        // Product link listener to save ID before redirecting
        if (e.target.closest('.product-link')) {
            e.preventDefault(); // Stop the link from navigating immediately
            const link = e.target.closest('.product-link');
            const productId = link.dataset.productId;
            localStorage.setItem('selectedProductId', productId);
            window.location.href = link.href; // Now navigate
        }
    });

    // === FORM VALIDATION ===
    const validateForm = (form) => {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            const errorElement = input.nextElementSibling; // Assumes error span is next
            if (!input.checkValidity()) {
                isValid = false;
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.style.display = 'block';
                }
                input.style.borderColor = '#d9534f'; // Red border for error
            } else {
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.style.display = 'none';
                }
                input.style.borderColor = 'var(--border-color)';
            }
        });
        return isValid;
    };

    // --- 5. Login Form (login.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop submission
            if (validateForm(loginForm)) {
                alert('Login successful! (Demo)');
                // In a real app, you'd send this to a server
                window.location.href = 'index.html'; // Redirect to home
            }
        });
    }

    // --- 6. Signup Form (signup.html) ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(signupForm)) {
                alert('Sign up successful! (Demo)');
                // In a real app, you'd send this to a server
                window.location.href = 'login.html'; // Redirect to login
            }
        });
    }
    
    // --- 7. Checkout Form (checkout.html) ---
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            if (!validateForm(checkoutForm)) {
                e.preventDefault(); // Stop submission if invalid
                alert('Please fill out all required fields.');
            }
            // If valid, the form will submit and go to confirmation.html
        });
    }
    
    // === INITIALIZE ON EVERY PAGE LOAD ===
    updateCartCount();

});
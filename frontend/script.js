document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: "Product 1", price: 25 },
        { id: 2, name: "Product 2", price: 30 },
        { id: 3, name: "Product 3", price: 20 },
    ];

    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    let cart = [];

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productDiv);
    });

    window.addToCart = (id) => {
        const product = products.find(p => p.id === id);
        cart.push(product);
        updateCart();
    };

    function updateCart() {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.textContent = `${item.name} - $${item.price}`;
            cartItems.appendChild(itemDiv);
        });
    }
});
// Fetch products from the backend
fetch('http://localhost:5000/api/products')
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        console.log(data); // Log the product data to the browser console for debugging

        const productList = document.getElementById('product-list'); // Find the product list container
        
        // Loop through each product and add it to the webpage
        data.forEach(product => {
            const productDiv = document.createElement('div'); // Create a new div for each product
            productDiv.className = 'product-item'; // Add a class for styling
            
            // Set the inner HTML for the product
            productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            
            productList.appendChild(productDiv); // Add the product div to the product list
        });
    })
    .catch(error => console.error('Error fetching products:', error)); // Handle any errors
    function addToCart(productId) {
        alert(`Product with ID ${productId} added to cart!`);
        // Later, you can extend this function to update a cart array or send data to the backend.
    }
    // Initialize an empty cart
let cart = [];

// Add product to the cart
function addToCart(productId) {
    // Find the product by its ID
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push(product);
                alert(`${product.name} has been added to your cart!`);
                updateCartUI(); // Update cart display
            }
        })
        .catch(error => console.error('Error fetching product:', error));
}

// Update cart display on the webpage
function updateCartUI() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Clear previous cart items

    if (cart.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty!</p>';
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p>${item.name} - $${item.price}</p>
                <button onclick="removeFromCart(${index})">Remove</button>
            `;
            cartList.appendChild(cartItem);
        });
    }

    // Update total price
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total').innerText = `Total: $${total}`;
}

// Remove product from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}
function checkout() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (total === 0) {
        alert('Your cart is empty!');
        return;
    }

    const options = {
        key: 'your-razorpay-key', // Replace with your Razorpay key
        amount: total * 100, // Razorpay expects amount in paisa (1 INR = 100 paisa)
        currency: 'INR',
        name: 'The Trend Corner',
        description: 'Purchase',
        handler: function (response) {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            cart = []; // Clear the cart
            updateCartUI(); // Update cart display
        },
        prefill: {
            name: 'Customer Name',
            email: 'customer@example.com',
            contact: '1234567890',
        },
        theme: {
            color: '#3399cc',
        },
    };

    const rzp = new Razorpay(options);
    rzp.open();
}
function searchProducts() {
    const query = document.getElementById('search-box').value.toLowerCase();
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(products => {
            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(query)
            );

            // Clear and repopulate the product list
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';
            filteredProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                    <button onclick="addToCart(${product.id})">Add to Cart</button>
                `;
                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
}
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

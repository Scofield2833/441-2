// script.js
// Scofield
function validateSignupForm123() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const email = document.getElementById('signup-email').value;
    const phone = document.getElementById('signup-phone').value;

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(password)) {
        alert('Password must be at least 6 characters long and contain both letters and numbers.');
        return false;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number.');
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(user => user.username === username)) {
        alert('Username already exists. Please choose another one.');
        return false;
    }

    users.push({
        username: username,
        password: password,
        email: email,
        phone: phone
    });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! Please log in.');
    window.location.href = 'login.html';
    return false;
}

function handleLoginForm123() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
        alert('Login successful!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password.');
    }

    return false;
}

function checkLoggedIn123() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        if (isLoggedIn) {
            const username = sessionStorage.getItem('username');
            authLink.textContent = `Welcome, ${username} | Logout`;
            authLink.href = '#';
            authLink.onclick = function () {
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('username');
                window.location.href = 'index.html';
            };
        } else {
            authLink.textContent = 'Log/Sign in';
            authLink.href = 'login.html';
        }
    }

    const restrictedPages = ['todo.html', 'shopping.html', 'cart.html', 'orders.html'];
    if (restrictedPages.includes(window.location.pathname.split('/').pop()) && !isLoggedIn) {
        window.location.href = 'login.html';
    }
}

async function loadCourses123() {
    try {
        const response = await fetch('courses.json');
        const courses = await response.json();
        console.log('Courses loaded:', courses);

        const featuredCoursesContainer = document.getElementById('featured-courses-container');
        if (featuredCoursesContainer) {
            const featuredCourses = courses.slice(0, 3);
            featuredCoursesContainer.innerHTML = featuredCourses.map(course => `
                <div class="course-card">
                    <h3>${course.name}</h3>
                    <p>${course.courseware}</p>
                    <a href="courses.html" class="learn-more">Learn More</a>
                </div>
            `).join('');
        }

        const coursesContainer = document.getElementById('courses-container');
        if (coursesContainer) {
            coursesContainer.innerHTML = courses.map(course => `
                <div class="course-card">
                    <h3>${course.name}</h3>
                    <div class="course-details">
                        <h4>Courseware</h4>
                        <p>${course.courseware}</p>
                        <h4>Assessment Requirements</h4>
                        <p>${course.assessment}</p>
                        <h4>Sample Project</h4>
                        <p>${course.sampleProject}</p>
                    </div>
                    <a href="resources.html" class="learn-more">
                        <i class="fas fa-arrow-right"></i>
                        View Resources
                    </a>
                </div>
            `).join('');
            addImageErrorHandlers();
        }
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadResourceKits123() {
    try {
        const response = await fetch('resourceKits.json');
        const resourceKits = await response.json();
        console.log('Resource kits loaded:', resourceKits);
        const resourcesContainer = document.getElementById('resources-container');
        if (resourcesContainer) {
            resourcesContainer.innerHTML = resourceKits.map(kit => `
                <div class="resource-card">
                    <div class="resource-image">
                        <img src="${kit.image}" alt="${kit.name}" onerror="handleImageError(this)">
                    </div>
                    <h3>${kit.name}</h3>
                    <p class="unit-number">Unit Number: ${kit.unitNumber}</p>
                    <p>${kit.description}</p>
                    <button class="download-button" onclick="downloadResource123('${kit.unitNumber}')">
                        Download Resource
                    </button>
                </div>
            `).join('');
            addImageErrorHandlers();
        }
    } catch (error) {
        console.error('Error loading resource kits:', error);
    }
}

async function loadShoppingPage123() {
    try {
        const response = await fetch('resourceKits.json');
        const resourceKits = await response.json();
        const shoppingContainer = document.getElementById('shopping-container');
        if (shoppingContainer) {
            shoppingContainer.innerHTML = resourceKits.map(kit => `
                <div class="resource-card">
                    <div class="resource-image">
                        <img src="${kit.image}" alt="${kit.name}" onerror="handleImageError(this)">
                    </div>
                    <h3>${kit.name}</h3>
                    <p class="unit-number">Unit Number: ${kit.unitNumber}</p>
                    <p>${kit.description}</p>
                    <p>Price: ${kit.price}</p>
                    <div class="quantity-selector">
                        <button onclick="decreaseQuantity('${kit.unitNumber}')">-</button>
                        <input type="number" id="quantity-${kit.unitNumber}" value="1" min="1">
                        <button onclick="increaseQuantity('${kit.unitNumber}')">+</button>
                    </div>
                    <button class="cta-button" onclick="addToCart123('${kit.unitNumber}')">Add to Cart</button>
                </div>
            `).join('');
            addImageErrorHandlers();
        }
    } catch (error) {
        console.error('Error loading shopping page:', error);
    }
}

function decreaseQuantity(unitNumber) {
    const input = document.getElementById(`quantity-${unitNumber}`);
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function increaseQuantity(unitNumber) {
    const input = document.getElementById(`quantity-${unitNumber}`);
    input.value = parseInt(input.value) + 1;
}

function addToCart123(unitNumber) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to add items to the cart.');
        window.location.href = 'login.html';
        return;
    }

    const username = sessionStorage.getItem('username');
    const cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
    const quantity = parseInt(document.getElementById(`quantity-${unitNumber}`).value);

    const existingItem = cart.find(item => item.unitNumber === unitNumber);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ unitNumber, quantity });
    }

    localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
    updateCartCount();
    alert('Item added to cart!');
}

async function loadCart123() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const username = sessionStorage.getItem('username');
    const cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total');

    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalElement.textContent = '$0.00';
        } else {
            try {
                const response = await fetch('resourceKits.json');
                const resourceKits = await response.json();

                let total = 0;
                cartItemsContainer.innerHTML = cart.map(item => {
                    const kit = resourceKits.find(kit => kit.unitNumber === item.unitNumber);
                    const itemTotal = parseFloat(kit.price.replace('$', '')) * item.quantity;
                    total += itemTotal;

                    return `
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <img src="${kit.image}" alt="${kit.name}" onerror="handleImageError(this)">
                            </div>
                            <div class="cart-item-details">
                                <h3>${kit.name}</h3>
                                <p>Unit Number: ${kit.unitNumber}</p>
                                <p>Price: ${kit.price}</p>
                                <div class="cart-item-quantity">
                                    <label>Quantity:</label>
                                    <input type="number" value="${item.quantity}" min="1" 
                                           onchange="updateCartItemQuantity('${kit.unitNumber}', this.value)">
                                </div>
                                <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                                <button class="remove-button" onclick="removeFromCart('${kit.unitNumber}')">
                                    Remove
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');

                cartTotalElement.textContent = `$${total.toFixed(2)}`;
            } catch (error) {
                console.error('Error loading cart:', error);
                cartItemsContainer.innerHTML = '<p>Error loading cart items.</p>';
                cartTotalElement.textContent = '$0.00';
            }
        }
    }
}

function updateCartItemQuantity(unitNumber, newQuantity) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;

    newQuantity = parseInt(newQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
    }

    const username = sessionStorage.getItem('username');
    const cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
    const itemIndex = cart.findIndex(item => item.unitNumber === unitNumber);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity = newQuantity;
    localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
    updateCartCount();
    loadCart123();
    }
}

function removeFromCart(unitNumber) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;

    const username = sessionStorage.getItem('username');
    const cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
    const updatedCart = cart.filter(item => item.unitNumber !== unitNumber);

    localStorage.setItem(`cart_${username}`, JSON.stringify(updatedCart));
    updateCartCount();
    loadCart123();
}

function checkout() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to checkout.');
        window.location.href = 'login.html';
        return;
    }

    const username = sessionStorage.getItem('username');
    const cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    // Create order
    const orderId = Date.now();
    const orderDate = new Date().toLocaleDateString();
    const order = {
        id: orderId,
        date: orderDate,
        items: cart,
        status: 'completed'
    };

    // Save order
    const orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];
    orders.push(order);
    localStorage.setItem(`orders_${username}`, JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem(`cart_${username}`);
    updateCartCount();

    // Redirect to orders page
    window.location.href = `orders.html?orderId=${orderId}`;
}

async function loadOrders() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    const username = sessionStorage.getItem('username');
    const orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];
    const ordersContainer = document.getElementById('orders-container');

    if (ordersContainer) {
        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>You have no orders yet.</p>';
        } else {
            try {
                const response = await fetch('resourceKits.json');
                const resourceKits = await response.json();

                // Check for specific order ID in URL
                const urlParams = new URLSearchParams(window.location.search);
                const orderId = urlParams.get('orderId');

                if (orderId) {
                    // Show specific order details
                    const order = orders.find(o => o.id == orderId);
                    if (order) {
                        let orderTotal = 0;
                        const orderItemsHTML = order.items.map(item => {
                            const kit = resourceKits.find(kit => kit.unitNumber === item.unitNumber);
                            const itemTotal = parseFloat(kit.price.replace('$', '')) * item.quantity;
                            orderTotal += itemTotal;

                            return `
                                <div class="order-item">
                                    <div class="order-item-image">
                                        <img src="${kit.image}" alt="${kit.name}" onerror="handleImageError(this)">
                                    </div>
                                    <div class="order-item-details">
                                        <h3>${kit.name}</h3>
                                        <p>Unit Number: ${kit.unitNumber}</p>
                                        <p>Price: ${kit.price}</p>
                                        <p>Quantity: ${item.quantity}</p>
                                        <p>Subtotal: $${itemTotal.toFixed(2)}</p>
                                    </div>
                                </div>
                            `;
                        }).join('');

                        ordersContainer.innerHTML = `
                            <div class="order-summary">
                                <h3>Order #${order.id}</h3>
                                <p>Date: ${order.date}</p>
                                <p>Status: ${order.status}</p>
                                <h4>Order Items:</h4>
                                <div class="order-items">
                                    ${orderItemsHTML}
                                </div>
                                <h4>Total: $${orderTotal.toFixed(2)}</h4>
                                <div class="order-actions">
                                    <button class="download-button" onclick="downloadOrder('${order.id}')">
                                        Download Order
                                    </button>
                                    <button class="back-button" onclick="window.history.back()">
                                        Back to Orders
                                    </button>
                                </div>
                            </div>
                        `;
                    } else {
                        ordersContainer.innerHTML = '<p>Order not found.</p>';
                    }
                } else {
                    // Show all orders list
                    ordersContainer.innerHTML = orders.map(order => {
                        let orderTotal = 0;
                        order.items.forEach(item => {
                            const kit = resourceKits.find(kit => kit.unitNumber === item.unitNumber);
                            if (kit) {
                                orderTotal += parseFloat(kit.price.replace('$', '')) * item.quantity;
                            }
                        });

                        return `
                            <div class="order-card">
                                <h3>Order #${order.id}</h3>
                                <p>Date: ${order.date}</p>
                                <p>Status: ${order.status}</p>
                                <p>Total: $${orderTotal.toFixed(2)}</p>
                                <a href="orders.html?orderId=${order.id}" class="view-details">View Details</a>
                            </div>
                        `;
                    }).join('');
                }
            } catch (error) {
                console.error('Error loading orders:', error);
                ordersContainer.innerHTML = '<p>Error loading orders.</p>';
            }
        }
    }
}

function downloadOrder(orderId) {

}

async function downloadOrder(orderId) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to download orders.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const username = sessionStorage.getItem('username');
        const orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];
        const order = orders.find(o => o.id == orderId);

        if (!order) {
            alert('Order not found.');
            return;
        }

        // Fetch resource kits data
        const response = await fetch('resourceKits.json');
        const resourceKits = await response.json();

        let orderText = `=== Order Receipt ===\n\n`;
        orderText += `Order ID: #${order.id}\n`;
        orderText += `Date: ${order.date}\n`;
        orderText += `Status: ${order.status}\n\n`;
        orderText += `=== Items Ordered ===\n\n`;

        let total = 0;
        order.items.forEach(item => {
            const kit = resourceKits.find(kit => kit.unitNumber === item.unitNumber);
            if (kit) {
                const price = parseFloat(kit.price.replace(/[^0-9.]/g, ''));
                const itemTotal = price * item.quantity;
                total += itemTotal;
                orderText += `- ${kit.name}\n`;
                orderText += `  Unit: ${kit.unitNumber}\n`;
                orderText += `  Price: $${price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}\n\n`;
            }
        });

        orderText += `=== Summary ===\n\n`;
        orderText += `Total Items: ${order.items.length}\n`;
        orderText += `Order Total: $${total.toFixed(2)}\n\n`;
        orderText += `Thank you for your purchase!\n`;
        orderText += `Scofield-RTO Training\n`;

        // Create and download text file
        const blob = new Blob([orderText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Scofield-RTO-Order-${order.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show download confirmation
        const downloadBtn = document.querySelector('.download-button');
        if (downloadBtn) {
            downloadBtn.textContent = 'Downloaded!';
            setTimeout(() => {
                downloadBtn.textContent = 'Download Order';
            }, 2000);
        }
    } catch (error) {
        console.error('Error downloading order:', error);
        alert('Failed to download order. Please try again.');
    }
}

async function downloadAllOrders() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to download orders.');
        window.location.href = 'login.html';
        return;
    }

    const username = sessionStorage.getItem('username');
    const orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];

    if (orders.length === 0) {
        alert('You have no orders to download.');
        return;
    }

    try {
        const response = await fetch('resourceKits.json');
        const resourceKits = await response.json();

        let allOrdersText = 'Your Orders:\n\n';

        orders.forEach(order => {
            allOrdersText += `Order #${order.id}\n`;
            allOrdersText += `Date: ${order.date}\n`;
            allOrdersText += `Status: ${order.status}\n\n`;
            allOrdersText += 'Items:\n';

            let total = 0;
            order.items.forEach(item => {
                const kit = resourceKits.find(kit => kit.unitNumber === item.unitNumber);
                if (kit) {
                    const itemTotal = parseFloat(kit.price.replace('$', '')) * item.quantity;
                    total += itemTotal;
                    allOrdersText += `- ${kit.name} (${kit.unitNumber}): ${item.quantity} x ${kit.price} = $${itemTotal.toFixed(2)}\n`;
                }
            });

            allOrdersText += `\nTotal: $${total.toFixed(2)}\n\n`;
            allOrdersText += '----------------------------------------\n\n';
        });

        // Create and download text file
        const blob = new Blob([allOrdersText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all_orders.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('All orders downloaded successfully!');
    } catch (error) {
        console.error('Error downloading orders:', error);
        alert('An error occurred while downloading orders. Please try again later.');
    }
}

function clearOrders() {
    if (confirm('Are you sure you want to clear all your orders? This action cannot be undone.')) {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            alert('Please log in to clear orders.');
            window.location.href = 'login.html';
            return;
        }

        const username = sessionStorage.getItem('username');
        localStorage.removeItem(`orders_${username}`);
        loadOrders();
        alert('All orders have been cleared.');
    }
}

function downloadResource123(unitNumber) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to download resources.');
        window.location.href = 'login.html';
        return;
    }

    const username = sessionStorage.getItem('username');
    const orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];

    // Check if user has purchased this resource
    const hasPurchased = orders.some(order =>
        order.items.some(item => item.unitNumber === unitNumber)
    );

    if (!hasPurchased) {
        alert('Please purchase this resource pack before downloading.');
        window.location.href = 'shopping.html';
        return;
    }

    alert(`Downloading resource with unit number: ${unitNumber}`);
}

function addTodo123() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to use this feature.');
        window.location.href = 'login.html';
        return;
    }

    const todoInput = document.getElementById('todo-input');
    const todoText = todoInput.value.trim();
    if (todoText) {
        const username = sessionStorage.getItem('username');
        const todos = JSON.parse(localStorage.getItem(`todos_${username}`)) || [];
        todos.push({
            id: Date.now(),
            text: todoText,
            completed: false
        });
        localStorage.setItem(`todos_${username}`, JSON.stringify(todos));
        todoInput.value = '';
        loadTodos123();
    }
}

function loadTodos123() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;

    const username = sessionStorage.getItem('username');
    const todos = JSON.parse(localStorage.getItem(`todos_${username}`)) || [];
    const todoContainer = document.getElementById('todo-container');

    if (todoContainer) {
        if (todos.length === 0) {
            todoContainer.innerHTML = '<p>No tasks found. Add your first task!</p>';
        } else {
            todoContainer.innerHTML = todos.map(todo => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}">
                    <input type="checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''} 
                           onchange="toggleTodo123(${todo.id})">
                    <label for="todo-${todo.id}">${todo.text}</label>
                    <button class="delete-button" onclick="deleteTodo123(${todo.id})">Delete</button>
                </div>
            `).join('');
        }
    }
}

function toggleTodo123(id) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;

    const username = sessionStorage.getItem('username');
    const todos = JSON.parse(localStorage.getItem(`todos_${username}`)) || [];
    const updatedTodos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    localStorage.setItem(`todos_${username}`, JSON.stringify(updatedTodos));
    loadTodos123();
}

function deleteTodo123(id) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) return;

    const username = sessionStorage.getItem('username');
    const todos = JSON.parse(localStorage.getItem(`todos_${username}`)) || [];
    const updatedTodos = todos.filter(todo => todo.id !== id);
    localStorage.setItem(`todos_${username}`, JSON.stringify(updatedTodos));
    loadTodos123();
}

window.addEventListener('load', function () {
    checkLoggedIn123();
    updateAuthLink();
    updateCartCount();
    addImageErrorHandlers();
    loadCourses123();
    loadResourceKits123();
    loadTodos123();

    if (window.location.pathname.includes('shopping.html')) {
        loadShoppingPage123();
    }

    if (window.location.pathname.includes('cart.html')) {
        loadCart123();
    }

    if (window.location.pathname.includes('orders.html')) {
        loadOrders();
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            validateSignupForm123();
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleLoginForm123();
        });
    }
    async function downloadOrder(orderId) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to download orders.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const username = sessionStorage.getItem('username');
        const orders = JSON.parse(localStorage.getItem(`orders_${username}`)) || [];
        const order = orders.find(o => o.id == orderId);

        if (!order) {
            alert('Order not found.');
            return;
        }

        // Fetch resource kits data
        const response = await fetch('resourceKits.json');
        const resourceKits = await response.json();

        let orderText = `Order #${order.id}\n`;
        orderText += `Date: ${order.date}\n`;
        orderText += `Status: ${order.status}\n\n`;
        orderText += 'Items:\n';

        let total = 0;
        order.items.forEach(item => {
            const kit = resourceKits.find(kit => kit.unitNumber === item.unitNumber);
            if (kit) {
                const itemTotal = parseFloat(kit.price.replace('$', '')) * item.quantity;
                total += itemTotal;
                orderText += `- ${kit.name} (${kit.unitNumber}): ${item.quantity} x ${kit.price} = $${itemTotal.toFixed(2)}\n`;
            }
        });

        orderText += `\nTotal: $${total.toFixed(2)}`;

        // Create and download text file
        const blob = new Blob([orderText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `order_${order.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('Order downloaded successfully!');
    } catch (error) {
        console.error('Error downloading order:', error);
        alert('An error occurred while downloading the order. Please try again later.');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    updateAuthLink();
    updateCartCount();
});

function updateAuthLink() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const authLink = document.getElementById('auth-link');
    
    if (authLink) {
        if (isLoggedIn) {
            const username = sessionStorage.getItem('username');
            authLink.innerHTML = '<i class="fas fa-user-circle"></i><span>'+username+'</span>';
            authLink.onclick = function() {
                sessionStorage.removeItem('isLoggedIn');
                sessionStorage.removeItem('username');
                window.location.href = 'index.html';
            };
        } else {
            authLink.innerHTML = '<i class="fas fa-user-circle"></i><span>Login</span>';
            authLink.href = 'login.html';
            authLink.onclick = null;
        }
    }
}

function updateCartCount() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement && isLoggedIn) {
        const username = sessionStorage.getItem('username');
        const cart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
    } else if (cartCountElement) {
        cartCountElement.style.display = 'none';
    }
}

// Handle image loading errors
function handleImageError(img) {
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
        parent.style.background = 'var(--bg-tertiary)';
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        parent.innerHTML = '<i class="fas fa-image" style="font-size: 2rem; color: var(--text-muted);"></i>';
    }
}

// Add image error handlers to all images
function addImageErrorHandlers() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
}
});
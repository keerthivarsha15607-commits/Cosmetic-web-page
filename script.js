//HOME//
const mainText = "Enhance Your Natural Beauty";
const subText = "Premium skincare & makeup products for every skin type";

let i = 0;
let j = 0;

function typeMain() {
    let mainEl = document.getElementById("typingText");

    if (i < mainText.length) {
        mainEl.innerHTML += mainText.charAt(i);
        i++;
        setTimeout(typeMain, 60);
    } else {
        typeSub();
    }
}
function typeSub() {
    let subEl = document.getElementById("subText");
    if (j < subText.length) {
        subEl.innerHTML += subText.charAt(j);
        j++;
        setTimeout(typeSub, 40);
    } else {
        document.getElementById("typingText").classList.remove("typing");
        document.getElementById("subText").classList.remove("typing");
    }
}
//VIDEO SLIDES//
window.onload = function () {
    let slides = document.querySelectorAll(".slide");
    let current = 0;
    if (slides.length > 0) {
        slides[current].classList.add("active");
        setInterval(() => {
            slides[current].classList.remove("active");
            current = (current + 1) % slides.length;
            slides[current].classList.add("active");
        }, 3000);
    }

    loadCart();
    showUser();
};
let ham = document.getElementById("ham");

if (ham) {
    let nav = document.querySelector("nav");
    ham.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}

//ADD TO CART//
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name: name, price: price });
    localStorage.setItem("cart", JSON.stringify(cart));

    showToast(name + " added to cart 💖");
}
function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}
// CATEGORY FILTER//
let currentCategory = "all";
let currentType = "all";
function applyFilters() {
    let products = document.querySelectorAll(".card");
    products.forEach(product => {
        let matchCategory = currentCategory === "all" || product.dataset.category === currentCategory;
        let matchType = currentType === "all" || product.dataset.type === currentType;
        if (matchCategory && matchType) {
            product.style.display = "flex";
        } else {
            product.style.display = "none";
        }
    });
}

function filterProducts(category) {
    let products = document.querySelectorAll(".card");
    products.forEach(product => {
        if (category === "all" || product.dataset.category === category) {
            product.style.display = "flex";
        } else {
            product.style.display = "none";
        }
    });
    document.querySelector(".productgrid").scrollIntoView({
        behavior: "smooth"
    });
}
function filterType(type, btn) {
    let products = document.querySelectorAll(".card");

    products.forEach(product => {
        if (type === "all" || product.dataset.type === type) {
            product.style.display = "flex";
        } else {
            product.style.display = "none";
        }
    });

    document.querySelectorAll(".tabs button")
        .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");
}

//  LOAD CART//
function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let container = document.getElementById("cartItems");
    let total = 0;
    if (!container) return;
    container.innerHTML = "";
    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        cart.forEach((item, index) => {
            let itemPrice = Number(item.price) || 0;
            total += itemPrice;
            container.innerHTML += `
                <div class="cart-item">
                    <h3>${item.name}</h3>
                    <p>₹${itemPrice}</p>
                    <button onclick="removeItem(${index})">Remove</button>
                </div>
            `;
        });
    }

    document.getElementById("totalPrice").innerText = "₹" + total;
}
// REMOVE ITEM//
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// LOGIN//
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let validUser = users.find(
        u => u.username === user && u.password === pass
    );

   if (validUser) {
    localStorage.setItem("loggedInUser", user);
    showPopup("Login successful!");
    setTimeout(() => window.location.href = "index.html", 1000);
} else {
    showPopup("Invalid username or password!", "error");
}
}

function signup() {
    let username = document.getElementById("newUser").value.trim();
    let password = document.getElementById("newPass").value.trim();

    if (username === "" || password === "") {
        showPopup("Please fill all fields!", "warning");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let userExists = users.find(u => u.username === username);

    if (userExists) {
        showPopup("Username already exists!", "error");
        return;
    }

    users.push({ username: username, password: password });
    localStorage.setItem("users", JSON.stringify(users));

    showPopup("Signup successful! 🎉");
    setTimeout(() => window.location.href = "login.html", 1000);
}

function logout() {
    localStorage.removeItem("loggedInUser");
    showPopup("Logged out!");
setTimeout(() => window.location.href = "login.html", 1000);
}

// PLACE ORDER//
function placeOrder() {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.length === 0) {
        showPopup("Your cart is empty!", "warning");
        return;
    }

    let subtotal = 0;
    cartItems.forEach(item => {
        subtotal += Number(item.price) || 0;
    });

    let total = subtotal + deliveryFee;

    // 🔥 Set modal content
    document.getElementById("orderDetails").innerHTML = `
        Items: ${cartItems.length} <br>
        Subtotal: ₹${subtotal} <br>
        Delivery: ${deliveryFee === 0 ? "Free" : "₹" + deliveryFee} <br>
        <b>Total: ₹${total}</b> <br><br>
        Payment: ${selectedPayment}
    `;

    // 🔥 Show modal
    document.getElementById("orderModal").style.display = "flex";
}
    function sendMessage(e) {
    e.preventDefault();
    let name = document.getElementById("name").value;
    showPopup("Thank you " + name + "! Your message sent 💌");
    document.querySelector("form").reset();
}

let selectedPayment = "Credit / Debit";

function selectPay(selectedOption) {
    let allOptions = document.querySelectorAll(".pay-opt");

    allOptions.forEach(option => {
        option.classList.remove("selected");
    });

    selectedOption.classList.add("selected");

    selectedPayment = selectedOption.querySelector(".pay-name").innerText;
}
let deliveryFee = 0;
let subtotal = 0;

function updateTotal() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // 🔥 Recalculate subtotal EVERY TIME
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += Number(item.price) || 0;
    });

    let total = subtotal + deliveryFee;

    let subEl = document.getElementById("subtotal");
    if (subEl) subEl.innerText = "₹" + subtotal;

    let delEl = document.getElementById("deliveryFeeDisplay");
    if (delEl) {
        delEl.innerText = deliveryFee === 0 ? "Free" : "₹" + deliveryFee;
    }

    let totalEl = document.getElementById("totalPrice");
    if (totalEl) totalEl.innerText = "₹" + total;
}const elements = document.querySelectorAll('.fade-up');

window.addEventListener('scroll', () => {
    elements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            el.classList.add('show');
        }
    });
});

function toggleMenu() {
    let nav = document.getElementById("navLinks");
    nav.classList.toggle("show");
}
document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navLinks").classList.remove("show");
    });
});


function changeQty(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].qty += change;

    // prevent 0 or negative
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function selectDel(element, cost) {

    // remove 'selected' from all options
    let options = document.querySelectorAll(".del-opt");
    options.forEach(opt => opt.classList.remove("selected"));

    // add 'selected' to clicked one
    element.classList.add("selected");

    // update delivery cost (optional)
    let deliveryCost = cost;

    console.log("Selected Delivery Cost:", deliveryCost);

    // 👉 If you have total price, update it here
    updateTotal(deliveryCost);
}

function updateTotal(deliveryCost) {
    let subtotal = 500; // replace with your actual subtotal logic
    let total = subtotal + deliveryCost;

    document.getElementById("totalAmount").innerText = "₹" + total;
}
function showPopup(message, type = "success") {
    let popup = document.getElementById("popup");
    if (!popup) return;

    popup.innerHTML = message;

    popup.className = "popup"; // reset

    if (type === "error") popup.classList.add("error");
    if (type === "warning") popup.classList.add("warning");

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 2500);
}
function closeModal() {
    document.getElementById("orderModal").style.display = "none";

    localStorage.removeItem("cart");
    window.location.href = "products.html";
}



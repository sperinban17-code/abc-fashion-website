
let cart = JSON.parse(localStorage.getItem("abcFashionCart")) || [];
let selectedCategory = "all";

function addToCart(productName, price) {
    const message = document.getElementById("order-message");
    message.textContent = "";
    message.style.display = "none";

    const existingProduct = cart.find(function (item) {
        return item.name === productName;
    });

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }

    updateCart();
    alert(productName + " added to cart!");
}

function updateCart() {
    localStorage.setItem("abcFashionCart", JSON.stringify(cart));

    const cartCount = cart.reduce(function (total, item) {
        return total + item.quantity;
    }, 0);

    const cartTotal = cart.reduce(function (total, item) {
        return total + item.price * item.quantity;
    }, 0);

    document.getElementById("cart-count").textContent = cartCount;
    document.getElementById("cart-total").textContent = cartTotal;

    const cartItems = document.getElementById("cart-items");

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cartItems.innerHTML = "";

    cart.forEach(function (item, index) {
        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("span");
        details.textContent =
            item.name + " × " + item.quantity +
            " = ₹" + item.price * item.quantity;

        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        const minusButton = document.createElement("button");
        minusButton.textContent = "−";
        minusButton.type = "button";

        minusButton.addEventListener("click", function () {
            item.quantity--;

            if (item.quantity <= 0) {
                cart.splice(index, 1);
            }

            updateCart();
        });

        const plusButton = document.createElement("button");
        plusButton.textContent = "+";
        plusButton.type = "button";

        plusButton.addEventListener("click", function () {
            item.quantity++;
            updateCart();
        });

        quantityControls.appendChild(minusButton);
        quantityControls.appendChild(plusButton);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "remove-btn";
        removeButton.type = "button";

        removeButton.addEventListener("click", function () {
            cart.splice(index, 1);
            updateCart();
        });

        row.appendChild(details);
        row.appendChild(quantityControls);
        row.appendChild(removeButton);
        cartItems.appendChild(row);
    });
}

function applyProductFilters() {
    const searchText = document
        .getElementById("product-search")
        .value.toLowerCase()
        .trim();

    const products = document.querySelectorAll(".product-card");
    let found = 0;

    products.forEach(function (product) {
        const productName = product
            .querySelector("h3")
            .textContent.toLowerCase();

        const matchesCategory =
            selectedCategory === "all" ||
            product.dataset.category === selectedCategory;

        const matchesSearch = productName.includes(searchText);

        if (matchesCategory && matchesSearch) {
            product.style.display = "";
            found++;
        } else {
            product.style.display = "none";
        }
    });

    const message = document.getElementById("no-products");
    message.style.display = found === 0 ? "block" : "none";
}

function filterProducts(category) {
    selectedCategory = category;
    applyProductFilters();
}

function searchProducts() {
    applyProductFilters();
}

function showCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add a product first.");
        return;
    }

    const checkout = document.getElementById("checkout-section");
    checkout.style.display = "block";
    checkout.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("checkout-form").addEventListener("submit", function (event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const mobile = document.getElementById("customer-mobile").value.trim();
    const address = document.getElementById("customer-address").value.trim();

    if (!name || !mobile || !address) {
        alert("Please fill in all details.");
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const total = cart.reduce(function (sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    const message = document.getElementById("order-message");
    message.textContent =
        "Thank you, " + name +
        "! Your demo order is confirmed. Total: ₹" + total;
    message.style.display = "block";

    cart = [];
    updateCart();
    document.getElementById("checkout-form").reset();
});

updateCart();
applyProductFilters();

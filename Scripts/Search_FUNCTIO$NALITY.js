window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
        // Filter products based on the search query
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Display filtered products
        displayProducts(filteredProducts);
    } else {
        // Display all products if no search query
        displayProducts(products);
    }
}

// Function to display products dynamically on the page
function displayProducts(products) {
    const productGrid = document.querySelector(".product-grid");
    productGrid.innerHTML = "";  // Clear the existing products

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Category: ${product.category}</p>
                <p>Color: ${product.color}</p>
                <div class="price">€${product.price}</div>
            </div>
        `;
        productGrid.appendChild(productDiv);
    });
}

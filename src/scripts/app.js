const productsContainerEl = document.querySelector('#products-wrapper');
const cartSummaryContainerEl = document.querySelector('#cart-summary');

const cartData = {
    items: [],
    total: 0
}

const renderProducts = () => {
    if (!productsContainerEl) return;

    productsContainerEl.innerHTML = products.map((product) => {
        const formattedPrice = product.price.toFixed(2);
        return `
            <div class="product-card mb-4">
                <img class="thumbnail" alt="product card - ${product.name}" src="${product.image.tablet}" />
                <div class="relative pt-10">
                    <div class="cta">
                        <button class="bg-white px-6 py-2 cursor-pointer inline-flex gap-2 items-center">
                            <img alt="add to cart image" src="./assets/images/icon-add-to-cart.svg" />
                            <span>Add to Cart</span>
                        </button>
                    </div>
                    
                    <p class="opacity-50">${product.category}</p>
                    <p class="text-lg font-medium">${product.name}</p>
                    <p class="text-primary text-2xl font-medium">$${formattedPrice}</p>
                </div>
            </div>
        `;
    }).join('');
}

const renderCartSummary = () => {
    if (!cartSummaryContainerEl) return;

    cartSummaryContainerEl.innerHTML = `
        <div class="bg-white rounded-md p-8 rounded-lg cart-summary-inner">
            <div class="text-primary text-xl font-bold">Your Cart (${cartData.items.length})</div>
            <p class="opacity-50">Cart is empty</p>
        </div>
    `
}

const renderEmptyCartSummary = () => {
    if (!cartSummaryContainerEl) return;

    cartSummaryContainerEl.innerHTML = `
        <div class="bg-white rounded-md p-8 rounded-lg cart-summary-inner">
            <div class="text-primary text-xl font-bold">Your Cart (${cartData.items.length})</div>
            <div class="flex justify-center items-center py-4" >
                <img alt="empty cart image" src="./assets/images/illustration-empty-cart.svg" />
            </div>
            <p class="text-sm text-center">
                Your added items will appear here
            </p>
        </div>
    `
}

const render = () => {
    cartData.items.length > 0 ? renderCartSummary() : renderEmptyCartSummary();
    renderProducts();
}

render()

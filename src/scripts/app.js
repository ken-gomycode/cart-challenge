const productsContainerEl = document.querySelector('#products-wrapper');
const cartSummaryContainerEl = document.querySelector('#cart-summary');

const cartData = {
    items: [],
    total: 0
}

const addCartItems = (product, quantity) => {
    const { name, category, price, image } = product;
    cartData.items.push({
        quantity,
        name,
        category,
        price,
        thumbnail: image.thumbnail
    });
    updateCartTotal();
}

const removeFromCart = (itemName) => {
    cartData.items = cartData.items.filter(item => item.name !== itemName);
    updateCartTotal();
    renderCartSummary();
}

const updateCartTotal = () => {
    let total = 0;
    cartData.items.forEach(item => total += (item.price * item.quantity));
    cartData.total = total.toFixed(2);
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

const renderCartItemRows = () => {
    const container = document.getElementById('cart-summary-items');
    if (!container) return;

    const rows = cartData.items.map(item => {
        const wrapper = document.createElement('div');
        const amount = Number(item.quantity * item.price).toFixed(2);
        wrapper.innerHTML = `
            <div class="flex-between py-4 bottom-border">
                <div class="flex items-center gap-4">
                    <div class="flex flex-col">
                        <div class="font-medium mb-1">${item.name}</div>
                        <div>
                           <span class="text-primary pr-3">${item.quantity}x</span>
                           <span class="opacity-50 text-xs" >@</span>
                           <span class="opacity-50">$${item.price.toFixed(2)} </span>
                           <span class="pl-4">$${amount}</span> 
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <button>
                        <i class="opacity-40 fa-regular fa-circle-xmark"></i>
                    </button>
                </div>
            </div>
        `;

        const handleRemove = () => removeFromCart(item.name);
        wrapper.querySelector('button').addEventListener('click', handleRemove);

        return wrapper;
    });

    container.innerHTML = '';
    container.append(...rows);
}

const renderCartSummary = () => {
    if (!cartSummaryContainerEl) return;

    // Render Empty State
    if (!cartData.items.length) {
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
        return;
    }


    cartSummaryContainerEl.innerHTML = `
        <div class="bg-white rounded-md p-8 rounded-lg cart-summary-inner">
            <div class="text-primary text-xl font-bold mb-4">Your Cart (${cartData.items.length})</div>
            <div id="cart-summary-items">
                
            </div>
            <div class="flex-between py-6">
                <span>Total</span>
                <span class="text-2xl font-bold">$${cartData.total}</span>
            </div>
            <div class="bg-gray-100 text-center p-3 rounded mb-3 text-xs">
                This is a <strong>carbon-neutral</strong> delivery
            </div>
            <button class="cta">Confirm Order</button>
        </div>
    `;

    renderCartItemRows();
}

const initCart = () => {
    const [firstProduct, secondProduct] = products;
    addCartItems(firstProduct, 3);
    addCartItems(secondProduct, 5);
}

const render = () => {
    updateCartTotal();
    renderCartSummary();
    renderProducts();
}

initCart();
render()

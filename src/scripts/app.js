const productsContainerEl = document.querySelector('#products-wrapper');
const cartSummaryContainerEl = document.querySelector('#cart-summary');

const cartData = {
    items: [],
    total: 0,
    orderConfirmed: false,
}

const resetCart = () => {
    cartData.items = [];
    cartData.total = 0;
    cartData.orderConfirmed = false;
    renderUi();
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

    renderUi();
}

const removeFromCart = (itemName) => {
    cartData.items = cartData.items.filter(item => item.name !== itemName);
    renderUi();
}

const updateCartItemQuantity = (itemName, quantity) => {
    const item = cartData.items.find(item => item.name === itemName);
    if(!item) return;

    item.quantity = quantity;

    if (item.quantity) {
        renderUi();
        return;
    }

    removeFromCart(item.name); // remove from cart if quantity === 0
}

const updateCartTotal = () => {
    let total = 0;
    cartData.items.forEach(item => total += (item.price * item.quantity));
    cartData.total = total.toFixed(2);
}

const getProductCtaHtml = (product) => {
    const isInCart = cartData.items.find(item => item.name === product.name);
    const quantity = isInCart ? isInCart.quantity : 0;
    if (!isInCart) {
        return `
            <div class="cta">
                <button class="w-[200px] bg-white px-6 py-2 cursor-pointer inline-flex gap-2 justify-center items-center">
                    <img alt="add to cart image" src="./assets/images/icon-add-to-cart.svg" />
                    <span>Add to Cart</span>
                </button>
            </div>
        `
    }

    return `
        <div class="cta px-10">
            <button class="carted w-[200px] bg-primary px-6 py-1 cursor-pointer inline-flex gap-2 items-center justify-between">
                <span class="cursor-pointer decrement py-1 px-3" >-</span>
                <span>${quantity}</span>
                <span class="cursor-pointer increment py-1 px-3">+</span>
            </button>
        </div>
    `
}

const renderProducts = () => {
    if (!productsContainerEl) return;

    const productCards = products.map((product) => {
        const formattedPrice = product.price.toFixed(2);
        const wrapper = document.createElement('div');
        const ctaContent = getProductCtaHtml(product);
        wrapper.innerHTML = `
            <div class="product-card mb-4">
                <picture>
                    <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
                    <source media="(min-width: 768px)" srcset="${product.image.tablet}">
                    <source media="(min-width: 480px)" srcset="${product.image.mobile}">
                    <img class="thumbnail" alt="product card - ${product.name}" src="${product.image.thumbnail}" />
                </picture>
                <div class="relative pt-10">
                    ${ctaContent}
                    <p class="opacity-50 text-sm">${product.category}</p>
                    <p class="text-base font-medium">${product.name}</p>
                    <p class="text-primary text-lg font-medium">$${formattedPrice}</p>
                </div>
            </div>
        `;

        // Add event listeners
        const ctaButton = wrapper.querySelector('button');
        if (ctaButton.classList.contains('carted')) { // item is in cart
            const cartItem = cartData.items.find(item => item.name === product.name);
            const incrementBtn = wrapper.querySelector('.increment');
            const decrementBtn = wrapper.querySelector('.decrement');

            // conditionally add event listeners
            incrementBtn?.addEventListener('click', () => updateCartItemQuantity(product.name, cartItem.quantity + 1));
            decrementBtn?.addEventListener('click', () => updateCartItemQuantity(product.name, cartItem.quantity - 1));
        } else {
            ctaButton.addEventListener('click', () => addCartItems(product, 1));
        }

        return wrapper;
    });

    productsContainerEl.innerHTML = '';
    productsContainerEl.append(...productCards);
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
                    <button class="cursor-pointer">
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

    cartSummaryContainerEl.querySelector('button.cta').addEventListener('click', renderConfirmationModal);
    renderCartItemRows();
}

const renderConfirmationModal = () => {
    const modal = document.querySelector('.confirmation-modal');
    if (!modal) return;

    const orderItemsHtml = cartData.items.map(item => {
        const amount = Number(item.quantity * item.price).toFixed(2);
        return `
            <div class="flex justify-between items-center py-4 bottom-border">
                <div>
                    <img alt="${item.name} image" class="h-[60px] w-[60px] rounded" src="${item.thumbnail}" />
                </div>
            
                <div class="flex-auto pl-3 items-center gap-4">
                    <div class="font-medium mb-1">${item.name}</div>
                    <div>
                       <span class="text-primary pr-3">${item.quantity}x</span>
                       <span class="opacity-50 text-xs" >@</span>
                       <span class="opacity-50 text-sm">$${item.price.toFixed(2)} </span>
                    </div>
                </div>
                
                <div>$${amount}</div>
            </div>
        `;
    }).join('');

    modal.querySelector('.modal-content').innerHTML = orderItemsHtml;

    modal.querySelector('#order-total').textContent = `$${cartData.total}`;
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');

    modal.querySelector('button').addEventListener('click', () => {
        modal.classList.toggle('hidden');
        modal.classList.toggle('flex');
        resetCart();
    }, { once: true });
}

const initCart = () => {
    const [firstProduct, secondProduct] = products;
    addCartItems(firstProduct, 3);
    addCartItems(secondProduct, 5);
}

const renderUi = () => {
    updateCartTotal();
    renderCartSummary();
    renderProducts();
}

initCart();
renderUi()

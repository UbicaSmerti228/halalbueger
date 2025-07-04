document.addEventListener('DOMContentLoaded', () => {

    // --- ДАННЫЕ ---
    // Массив товаров в формате JSON
    const products = [
        {
            id: 1,
            name: "Чизбургер",
            ingredients: "Булочка, лист салата, фирменный соус, куриная котлета, бургер соус, маринованные огурцы, плавленый сыр, сырный соус",
            price: 289,
            imageUrl: "https://sun9-80.userapi.com/s/v1/ig2/-LvxWvykmJboq7E6ItS7bJf0af9MWZseIBwJul_59iFzth8qrKjfoqPVVDFrIuBbvF71pB3NXggGhEg4HMkDx4jW.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2139x2139&from=bu&u=Gl3ZW6KBrWGLFX83eJVvvGPjfbgx4AVOLhsMLMPVcqI&cs=540x0"
        },
        {
            id: 2,
            name: "Грибной бум",
            ingredients: "Булочка, лист салата, куриная котлета, фирменный соус, сыр, барбекю соус, помидоры, маринованные огурцы, шампиньоны , грибной соус",
            price: 339,
            imageUrl: "https://sun9-18.userapi.com/s/v1/ig2/gjN22I0D2LTBZyGWUyYxR7Obex5SaZ7pZRa6noHOQLm19ee4Pyhry9yT5p8yox6IUszB7jSvl8SEjAXSy-N9j-e6.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2160x2160&from=bu&u=daFgyNJkIWMAmaKDlH81Y5OzdW8uLMqCyAjr7ZPLA-Y&cs=540x0"
        },
        {
            id: 3,
            name: "Баракат бургер",
            ingredients: "Булочка, лист салата, двойная говяжья котлета, соус тар-тар, маринованный лук, сыр, гриль соус, помидоры, маринованные огурцы, бургер соус, медово-горчичный соус",
            price: 439,
            imageUrl: "https://sun9-12.userapi.com/s/v1/ig2/hYV-l4CXxm4OVbFh3XkuTPOnYxbdqKdIUGc33xNc5VethBp8grGjNx4Jy1-X3lDtCSWu0r7Fa9ZuWy8hFbr8dsHq.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080,1280x1280,1440x1440,2160x2160&from=bu&u=t9VjXCYh732w4EJ6d3_kMyeGagrpeHoMaSWJBK0QXKo&cs=540x0"
        }
    ];

    // --- ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ DOM ---
    let cart = []; // Массив для хранения товаров в корзине
    const burgersGrid = document.getElementById('burgers-grid');
    const cartIcon = document.getElementById('cart-icon');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartCounterEl = document.getElementById('cart-counter');
    const whatsappOrderBtn = document.getElementById('whatsapp-order-btn');

    // --- ФУНКЦИИ ---

    /**
     * Рендерит карточки товаров на странице
     */
    function renderProducts() {
        burgersGrid.innerHTML = ''; // Очищаем скелетоны
        products.forEach(product => {
            const card = `
                <div class="burger-card">
                    <div class="image-wrapper">
                        <img src="${product.imageUrl}" alt="${product.name}">
                    </div>
                    <div class="burger-card-content">
                        <h3>${product.name}</h3>
                        <p class="ingredients">${product.ingredients}</p>
                        <div class="burger-card-footer">
                            <span class="price">${product.price}₽/XXL</span>
                            <button class="add-to-cart-btn" data-id="${product.id}">
                                <i class="fa-solid fa-cart-shopping"></i> В корзину
                            </button>
                        </div>
                    </div>
                </div>
            `;
            burgersGrid.innerHTML += card;
        });
    }

    /**
     * Добавляет товар в корзину или увеличивает его количество
     * @param {number} productId - ID товара
     */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }

    /**
     * Обновляет отображение корзины (UI)
     */
    function updateCart() {
        renderCartItems();
        updateCartTotal();
        updateCartCounter();
        
        // Анимация для счетчика
        cartCounterEl.classList.add('updated');
        setTimeout(() => cartCounterEl.classList.remove('updated'), 200);
    }
    
    /**
     * Рендерит товары внутри модального окна корзины
     */
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">Ваша корзина пуста</p>';
            whatsappOrderBtn.disabled = true;
            return;
        }

        cartItemsContainer.innerHTML = '';
        whatsappOrderBtn.disabled = false;

        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} ₽</p>
                    </div>
                    <div class="cart-item-quantity">
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    </div>
                    <button class="cart-item-remove-btn"><i class="fa-solid fa-trash-alt"></i></button>
                </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
        });
    }

    /**
     * Обновляет общую стоимость в корзине
     */
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPriceEl.textContent = `${total} ₽`;
    }
    
    /**
     * Обновляет счетчик товаров на иконке корзины
     */
    function updateCartCounter() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounterEl.textContent = totalItems;
    }

    /**
     * Изменяет количество товара или удаляет его, если количество <= 0
     * @param {number} productId - ID товара
     * @param {number} quantity - Новое количество
     */
    function handleQuantityChange(productId, quantity) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            const cartItem = cart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity = quantity;
            }
        }
        updateCart();
    }
    
    /**
     * Удаляет товар из корзины
     * @param {number} productId - ID товара
     */
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    }

    /**
     * Генерирует и отправляет сообщение в WhatsApp
     */
    function formatOrderForWhatsApp() {
        const phoneNumber = '+79177774988'; // !!! ЗАМЕНИТЕ НА ВАШ НОМЕР ТЕЛЕФОНА
        const persons = document.getElementById('persons-input').value;
        const comment = document.getElementById('comment-input').value;
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        let message = `Добрый день! Хочу сделать заказ:\n\n`;

        cart.forEach(item => {
            message += `* ${item.name} - ${item.quantity} шт. (${item.price * item.quantity} ₽)\n`;
        });

        message += `\n*Итого:* ${total} ₽\n`;
        message += `*Количество персон:* ${persons}\n`;
        
        if (comment.trim() !== '') {
            message += `*Комментарий:* ${comment.trim()}\n`;
        }

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ---

    // Клик по кнопке "В корзину"
    burgersGrid.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const button = e.target.closest('.add-to-cart-btn');
            const productId = parseInt(button.dataset.id);
            addToCart(productId);
        }
    });

    // Открытие/закрытие корзины
    cartIcon.addEventListener('click', () => cartOverlay.classList.add('active'));
    closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) {
            cartOverlay.classList.remove('active');
        }
    });
    
    // Взаимодействие внутри корзины (удаление/изменение количества)
    cartItemsContainer.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.cart-item-remove-btn');
        if (removeBtn) {
            const cartItemEl = removeBtn.closest('.cart-item');
            const productId = parseInt(cartItemEl.dataset.id);
            removeFromCart(productId);
        }
    });
    cartItemsContainer.addEventListener('change', (e) => {
         const quantityInput = e.target.closest('.quantity-input');
        if (quantityInput) {
            const cartItemEl = quantityInput.closest('.cart-item');
            const productId = parseInt(cartItemEl.dataset.id);
            const newQuantity = parseInt(quantityInput.value);
            handleQuantityChange(productId, newQuantity);
        }
    });
    
    // Кнопка оформления заказа
    whatsappOrderBtn.addEventListener('click', formatOrderForWhatsApp);

    // "Липкая" шапка при скролле
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // --- ИНИЦИАЛИЗАЦИЯ ---
    renderProducts();
});
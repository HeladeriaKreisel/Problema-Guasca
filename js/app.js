/**
 * Lógica Principal de AgroGuasca - Del Campo al Comprador
 * Proyecto Integrador I - Universidad de La Salle
 */

// Estado global de la aplicación
const AppState = {
    products: [],
    producers: [],
    cart: [],
    selectedCategory: 'todos',
    searchQuery: '',
    deliveryZone: 'bogota-norte',
    deliveryCosts: {
        'bogota-norte': 8000,
        'bogota-centro': 9000,
        'sabana-centro': 6000,
        'guasca-recogida': 0
    }
};

// Cargar carrito desde localStorage
function loadCart() {
    const saved = localStorage.getItem('agroguasca_cart');
    if (saved) {
        try {
            AppState.cart = JSON.parse(saved);
        } catch (e) {
            AppState.cart = [];
        }
    }
}

// Guardar carrito
function saveCart() {
    localStorage.setItem('agroguasca_cart', JSON.stringify(AppState.cart));
    updateCartUI();
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    AppState.products = getStoredProducts();
    AppState.producers = getStoredProducers();
    loadCart();

    renderProducts();
    renderProducersCarousel();
    updateCartUI();
    setupEventListeners();
    updateWasteCounter();
});

// Configurar listeners de interfaz
function setupEventListeners() {
    // Filtros de categoría
    const filterButtons = document.querySelectorAll('[data-category]');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            AppState.selectedCategory = e.currentTarget.dataset.category;
            renderProducts();
        });
    });

    // Búsqueda en vivo
    const searchInput = document.getElementById('search-products');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value.toLowerCase().trim();
            renderProducts();
        });
    }

    // Selector de zona de entrega en carrito
    const zoneSelect = document.getElementById('cart-delivery-zone');
    if (zoneSelect) {
        zoneSelect.addEventListener('change', (e) => {
            AppState.deliveryZone = e.target.value;
            updateCartSummary();
        });
    }

    // Formulario de Checkout / WhatsApp
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
}

// Renderizado de Productos en Grid
function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    let filtered = AppState.products.filter(p => {
        const matchesCategory = (AppState.selectedCategory === 'todos') || (p.category === AppState.selectedCategory);
        const matchesSearch = !AppState.searchQuery || 
            p.name.toLowerCase().includes(AppState.searchQuery) ||
            p.description.toLowerCase().includes(AppState.searchQuery) ||
            p.producerName.toLowerCase().includes(AppState.searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-16 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mb-4 text-2xl">
                    🌾
                </div>
                <h3 class="text-xl font-bold text-gray-800">No encontramos productos con ese criterio</h3>
                <p class="text-gray-500 mt-2">Prueba seleccionando otra categoría o limpiando la búsqueda.</p>
                <button onclick="resetFilters()" class="mt-4 btn-primary-guasca">Ver todos los productos</button>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-card group">
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" 
                     onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';">
                <span class="product-badge-float">
                    ${product.badge || 'Directo de Guasca'}
                </span>
                ${product.demandAnticipation ? `
                    <span class="absolute bottom-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                        🌱 Cosecha Programable
                    </span>
                ` : ''}
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div class="product-producer-tag">
                        <span>🏡</span>
                        <span>${product.producerName} (${product.finca})</span>
                    </div>

                    <h3 class="text-lg font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                        ${product.name}
                    </h3>

                    <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                        ${product.description}
                    </p>

                    <div class="fair-trade-meter mt-3">
                        <span class="text-emerald-600 font-bold">✓</span>
                        <span>Impacto: <strong>${product.fairTradeMargin}</strong></span>
                    </div>
                </div>

                <div class="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span class="text-xs text-gray-400 block">${product.unit}</span>
                        <span class="text-xl font-extrabold text-emerald-900">
                            $${product.price.toLocaleString('es-CO')}
                        </span>
                    </div>

                    <div class="flex items-center gap-2">
                        <button onclick="openProductModal('${product.id}')" 
                                class="p-2.5 rounded-lg border border-gray-200 text-gray-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                                title="Ver detalles y origen">
                            ℹ️
                        </button>
                        <button onclick="addToCart('${product.id}')" 
                                class="btn-primary-guasca text-sm py-2 px-3.5">
                            <span>Agregar</span> 🛒
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Resetear filtros
function resetFilters() {
    AppState.selectedCategory = 'todos';
    AppState.searchQuery = '';
    const searchInput = document.getElementById('search-products');
    if (searchInput) searchInput.value = '';
    const filterButtons = document.querySelectorAll('[data-category]');
    filterButtons.forEach(b => {
        b.classList.toggle('active', b.dataset.category === 'todos');
    });
    renderProducts();
}

// Agregar al carrito
function addToCart(productId, quantity = 1) {
    const product = AppState.products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = AppState.cart.findIndex(item => item.productId === productId);
    if (existingIndex > -1) {
        AppState.cart[existingIndex].quantity += quantity;
    } else {
        AppState.cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            image: product.image,
            producerName: product.producerName,
            quantity: quantity,
            isPreorder: false
        });
    }

    saveCart();
    showToast(`🛒 "${product.name}" agregado a tu canasta comunitaria`);
}

// Modificar cantidad en carrito
function changeCartQuantity(productId, delta) {
    const itemIndex = AppState.cart.findIndex(i => i.productId === productId);
    if (itemIndex === -1) return;

    AppState.cart[itemIndex].quantity += delta;
    if (AppState.cart[itemIndex].quantity <= 0) {
        AppState.cart.splice(itemIndex, 1);
        showToast("Producto removido de la canasta");
    }
    saveCart();
}

// Actualizar UI del Carrito
function updateCartUI() {
    const totalCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Insignia en botón flotante y navbar
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
        b.textContent = totalCount;
        b.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    renderCartItems();
    updateCartSummary();
}

// Renderizado de ítems dentro del drawer del carrito
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (AppState.cart.length === 0) {
        container.innerHTML = `
            <div class="py-12 text-center text-gray-500">
                <div class="text-4xl mb-2">🧺</div>
                <p class="font-medium">Tu canasta está vacía</p>
                <p class="text-xs text-gray-400 mt-1">Explora los productos de San Francisco y apoya a los campesinos de Guasca.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = AppState.cart.map(item => `
        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-2">
            <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg">
            <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-gray-900 truncate">${item.name}</h4>
                <p class="text-xs text-gray-500 truncate">${item.producerName} • ${item.unit}</p>
                <p class="text-sm font-extrabold text-emerald-800">$${(item.price * item.quantity).toLocaleString('es-CO')}</p>
            </div>
            <div class="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1">
                <button onclick="changeCartQuantity('${item.productId}', -1)" class="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded">
                    -
                </button>
                <span class="w-5 text-center text-sm font-semibold">${item.quantity}</span>
                <button onclick="changeCartQuantity('${item.productId}', 1)" class="w-6 h-6 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-100 rounded">
                    +
                </button>
            </div>
        </div>
    `).join('');
}

// Actualizar resumen numérico del carrito
function updateCartSummary() {
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = AppState.cart.length > 0 ? (AppState.deliveryCosts[AppState.deliveryZone] || 0) : 0;
    const total = subtotal + shipping;

    const elSubtotal = document.getElementById('cart-subtotal');
    const elShipping = document.getElementById('cart-shipping');
    const elTotal = document.getElementById('cart-total');

    if (elSubtotal) elSubtotal.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    if (elShipping) elShipping.textContent = shipping === 0 ? 'Gratis (Guasca)' : `$${shipping.toLocaleString('es-CO')}`;
    if (elTotal) elTotal.textContent = `$${total.toLocaleString('es-CO')}`;

    // Deshabilitar checkout si carrito está vacío
    const checkoutBtn = document.getElementById('btn-open-checkout');
    if (checkoutBtn) {
        checkoutBtn.disabled = AppState.cart.length === 0;
        checkoutBtn.classList.toggle('opacity-50', AppState.cart.length === 0);
    }
}

// Abrir y cerrar Drawer del Carrito
function toggleCartDrawer(open = null) {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if (!drawer || !backdrop) return;

    const isOpen = drawer.classList.contains('active');
    const shouldOpen = open !== null ? open : !isOpen;

    if (shouldOpen) {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Modal de Detalles del Producto & Productor
function openProductModal(productId) {
    const product = AppState.products.find(p => p.id === productId);
    const producer = AppState.producers.find(pr => pr.id === product.producerId) || AppState.producers[0];
    if (!product) return;

    const modalContent = document.getElementById('product-modal-content');
    if (!modalContent) return;

    modalContent.innerHTML = `
        <div class="relative">
            <img src="${product.image}" class="w-full h-64 object-cover rounded-t-2xl">
            <button onclick="closeProductModal()" class="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center font-bold text-gray-700 shadow hover:bg-white">
                ✕
            </button>
            <span class="absolute bottom-4 left-4 bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                ${product.badge}
            </span>
        </div>

        <div class="p-6">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">${product.name}</h2>
                    <p class="text-emerald-700 font-semibold text-sm flex items-center gap-1 mt-1">
                        📍 Vereda La Trinidad, Sector San Francisco (Guasca)
                    </p>
                </div>
                <div class="text-right">
                    <span class="text-2xl font-black text-emerald-900">$${product.price.toLocaleString('es-CO')}</span>
                    <span class="block text-xs text-gray-400">${product.unit}</span>
                </div>
            </div>

            <p class="text-gray-600 mt-4 leading-relaxed">
                ${product.description}
            </p>

            <!-- Sección del Productor -->
            <div class="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                <img src="${producer.photo}" alt="${producer.name}" class="w-16 h-16 rounded-full object-cover border-2 border-emerald-600">
                <div class="flex-1">
                    <span class="text-xs font-bold uppercase tracking-wider text-emerald-800">Productor Responsable</span>
                    <h4 class="font-bold text-gray-900">${producer.name}</h4>
                    <p class="text-xs text-gray-600">${producer.finca} • ${producer.experience}</p>
                    <p class="text-xs text-emerald-900 font-medium italic mt-1">"${producer.bio}"</p>
                </div>
            </div>

            <!-- Desglose de Comercio Justo -->
            <div class="mt-5 grid grid-cols-2 gap-3 text-center text-xs">
                <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span class="text-gray-400 block mb-0.5">Esquema Tradicional</span>
                    <strong class="text-red-600 text-sm">Intermediario se queda con hasta el 65%</strong>
                </div>
                <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span class="text-emerald-700 block mb-0.5">Circuito Corto AgroGuasca</span>
                    <strong class="text-emerald-800 text-sm">${product.fairTradeMargin}</strong>
                </div>
            </div>

            <div class="mt-6 flex gap-3">
                <button onclick="addToCart('${product.id}'); closeProductModal();" class="flex-1 btn-primary-guasca py-3">
                    Agregar a la Canasta Comunitaria 🛒
                </button>
            </div>
        </div>
    `;

    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Abrir modal de Checkout
function openCheckoutModal() {
    toggleCartDrawer(false);
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// Procesar pedido y generar mensaje estructurado para WhatsApp
function handleCheckoutSubmit(e) {
    e.preventDefault();

    if (AppState.cart.length === 0) {
        showToast("Tu canasta está vacía");
        return;
    }

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const address = document.getElementById('client-address').value.trim();
    const zone = document.getElementById('client-zone').value;
    const deliveryDay = document.getElementById('client-day').value;
    const notes = document.getElementById('client-notes').value.trim();

    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = AppState.deliveryCosts[zone] || 0;
    const total = subtotal + shipping;

    const orderId = 'AG-' + Math.floor(1000 + Math.random() * 9000);

    // Crear orden para el registro
    const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        client: { name, phone, address, zone, deliveryDay, notes },
        items: [...AppState.cart],
        subtotal,
        shipping,
        total,
        status: 'Pendiente de Confirmación'
    };

    saveOrder(newOrder);

    // Construcción del mensaje para WhatsApp
    let waMessage = `🌿 *NUEVO PEDIDO AGROGUASCA - DEL CAMPO AL COMPRADOR* 🌿\n`;
    waMessage += `*Código de Pedido:* #${orderId}\n`;
    waMessage += `*Vereda de Origen:* La Trinidad, Sector San Francisco (Guasca)\n\n`;
    waMessage += `👤 *DATOS DEL COMPRADOR:*\n`;
    waMessage += `• Nombre: ${name}\n`;
    waMessage += `• Teléfono: ${phone}\n`;
    waMessage += `• Dirección: ${address}\n`;
    waMessage += `• Zona de Entrega: ${zone.toUpperCase()}\n`;
    waMessage += `• Día programado: ${deliveryDay}\n`;
    if (notes) waMessage += `• Observaciones: ${notes}\n`;
    waMessage += `\n🧺 *CANASTA DE PRODUCTOS CONSOLIDADOS:*\n`;

    AppState.cart.forEach((item, index) => {
        waMessage += `${index + 1}. *${item.name}* (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CO')}\n`;
        waMessage += `   _Productor:_ ${item.producerName} (${item.unit})\n`;
    });

    waMessage += `\n💰 *RESUMEN ECONÓMICO:*\n`;
    waMessage += `• Subtotal Cosecha: $${subtotal.toLocaleString('es-CO')}\n`;
    waMessage += `• Logística Circuito Corto: $${shipping.toLocaleString('es-CO')}\n`;
    waMessage += `• *TOTAL A PAGAR:* $${total.toLocaleString('es-CO')}\n\n`;
    waMessage += `🤝 *IMPACTO:* Este pedido evita intermediarios y apoya directamente a las familias campesinas de Guasca.\n`;
    waMessage += `_Generado a través de la plataforma comunitaria AgroGuasca (Proyecto Integrador I - Universidad de La Salle)_`;

    // Teléfono de la coordinación comunitaria / JAC de Guasca
    const coordinatorPhone = "573102345678";
    const waUrl = `https://wa.me/${coordinatorPhone}?text=${encodeURIComponent(waMessage)}`;

    // Limpiar carrito tras orden exitosa
    AppState.cart = [];
    saveCart();
    closeCheckoutModal();

    showToast("🎉 ¡Pedido generado con éxito! Abriendo WhatsApp...");

    setTimeout(() => {
        window.open(waUrl, '_blank');
    }, 800);
}

// Renderizado del carrusel/grid de productores de San Francisco
function renderProducersCarousel() {
    const container = document.getElementById('producers-container');
    if (!container) return;

    container.innerHTML = AppState.producers.map(prod => `
        <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
                <div class="flex items-center gap-4 mb-4">
                    <img src="${prod.photo}" alt="${prod.name}" class="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow">
                    <div>
                        <h4 class="font-bold text-gray-900 text-lg leading-snug">${prod.name}</h4>
                        <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            ${prod.finca}
                        </span>
                    </div>
                </div>
                <p class="text-xs text-gray-500 font-medium mb-2">📍 ${prod.sector}</p>
                <p class="text-sm text-gray-700 mb-3"><strong>Especialidad:</strong> ${prod.specialty}</p>
                <p class="text-xs text-gray-600 italic bg-gray-50 p-3 rounded-lg border-l-2 border-emerald-600">
                    "${prod.bio}"
                </p>
            </div>
            <div class="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                <span>Experiencia: <strong>${prod.experience}</strong></span>
                <span class="text-emerald-700 font-bold">✓ Verificado JAC</span>
            </div>
        </div>
    `).join('');
}

// Contador dinámico de impacto y desperdicio evitado
function updateWasteCounter() {
    const elWaste = document.getElementById('stat-waste-saved');
    if (!elWaste) return;

    const totalKg = AppState.products.reduce((acc, p) => acc + (p.wasteSavedKg || 0), 1250);
    elWaste.textContent = `+${totalKg.toLocaleString('es-CO')} kg`;
}

// Sistema de Notificaciones Toast
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<span>🍃</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

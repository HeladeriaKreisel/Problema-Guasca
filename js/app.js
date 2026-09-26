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
    deliveryZone: 'personalizado-domicilio',
    isExpressDelivery: false,
    expressFee: 14000,
    expressMinFee: 14000,
    expressTierName: 'Tarifa Mínima Express',
    expressReason: '',
    customDeliveryDate: '',
    customDeliverySlot: 'Urgente / Primera hora (7:00 AM - 9:00 AM)',
    deliveryCosts: {
        'personalizado-domicilio': 12000,
        'bogota-norte': 8000,
        'bogota-centro': 9000,
        'sabana-centro': 6000,
        'punto-comunitario-bogota-norte': 4000,
        'punto-comunitario-bogota-centro': 4000,
        'guasca-recogida': 0
    }
};

// Configuración de Puestos Comunitarios de Acopio y Recogida
const COMMUNITY_PICKUP_POINTS = {
    'punto-comunitario-bogota-norte': {
        name: 'Punto Comunitario Bogotá Norte',
        address: 'Puesto Comunitario Usaquén (Carrera 7 # 120-20, Bogotá)',
        notice: 'Se te avisará al WhatsApp en cuanto tu pedido se encuentre en el puesto comunitario de Bogotá Norte para que pases a reclamarlo.'
    },
    'punto-comunitario-bogota-centro': {
        name: 'Punto Comunitario Bogotá Centro',
        address: 'Puesto Comunitario Parkway Teusaquillo (Carrera 24 # 39B-15, Bogotá)',
        notice: 'Se te avisará al WhatsApp en cuanto tu pedido se encuentre en el puesto comunitario de Bogotá Centro para que pases a reclamarlo.'
    },
    'guasca-recogida': {
        name: 'Punto Comunitario San Francisco (Guasca)',
        address: 'Centro de Acopio JAC, Vereda La Trinidad, Sector San Francisco (Guasca)',
        notice: 'Se te avisará al WhatsApp en cuanto tu pedido se encuentre listo en el puesto comunitario de la vereda.'
    }
};

function isCommunityPoint(zone) {
    return !!COMMUNITY_PICKUP_POINTS[zone];
}

// Cargar carrito desde localStorage
function loadCart() {
    const saved = localStorage.getItem('agroguasca_cart');
    if (saved) {
        try {
            AppState.cart = JSON.parse(saved);
            // Sincronizar imagen actualizada si el producto cambió de foto
            AppState.cart.forEach(item => {
                const prod = AppState.products.find(p => p.id === item.productId);
                if (prod && prod.image) {
                    item.image = prod.image;
                }
            });
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

// Cálculo inteligente de fecha de entrega estándar según día y hora del pedido
function getCalculatedDeliveryInfo() {
    const now = new Date();
    const day = now.getDay(); // 0: Dom, 1: Lun, 2: Mar, 3: Mie, 4: Jue, 5: Vie, 6: Sab
    const hours = now.getHours();

    let targetDate = new Date(now);
    let routeName = "";
    let reason = "";

    // Ciclo de Cosechas comunitarias en Guasca:
    // Corte para Miércoles: Martes 5:00 PM (17:00).
    // Corte para Sábado: Viernes 5:00 PM (17:00).
    if (day === 0) { // Domingo -> Miércoles
        targetDate.setDate(now.getDate() + 3);
        routeName = "Miércoles Próximo";
        reason = "Pedido recibido en fin de semana. Cosecha fresca el martes temprano y despacho el miércoles.";
    } else if (day === 1) { // Lunes -> Miércoles
        targetDate.setDate(now.getDate() + 2);
        routeName = "Miércoles Próximo";
        reason = "A tiempo para la ruta comunitaria del miércoles. Corte de pedidos el martes a las 5:00 PM.";
    } else if (day === 2) { // Martes
        if (hours < 17) {
            targetDate.setDate(now.getDate() + 1);
            routeName = "Mañana Miércoles (¡Corte Activo!)";
            reason = "¡A tiempo! Tu pedido entró antes de las 5:00 PM. Se cosecha de inmediato para entrega mañana.";
        } else {
            targetDate.setDate(now.getDate() + 4);
            routeName = "Próximo Sábado";
            reason = "Tu pedido ingresó después de las 5:00 PM. Entra en el ciclo de cosecha para el sábado.";
        }
    } else if (day === 3) { // Miércoles -> Sábado
        targetDate.setDate(now.getDate() + 3);
        routeName = "Próximo Sábado";
        reason = "A tiempo para la ruta comunitaria del sábado. Corte de pedidos el viernes a las 5:00 PM.";
    } else if (day === 4) { // Jueves -> Sábado
        targetDate.setDate(now.getDate() + 2);
        routeName = "Próximo Sábado";
        reason = "A tiempo para la ruta comunitaria del sábado. Corte de pedidos el viernes a las 5:00 PM.";
    } else if (day === 5) { // Viernes
        if (hours < 17) {
            targetDate.setDate(now.getDate() + 1);
            routeName = "Mañana Sábado (¡Corte Activo!)";
            reason = "¡A tiempo! Tu pedido entró antes de las 5:00 PM. Se incluye en el despacho de mañana sábado.";
        } else {
            targetDate.setDate(now.getDate() + 5);
            routeName = "Próximo Miércoles";
            reason = "Ingresó después de las 5:00 PM. Se programa para la cosecha y despacho del próximo miércoles.";
        }
    } else if (day === 6) { // Sábado -> Miércoles
        targetDate.setDate(now.getDate() + 4);
        routeName = "Próximo Miércoles";
        reason = "Pedido ingresado en fin de semana. Cosecha y despacho para el próximo miércoles.";
    }

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = targetDate.toLocaleDateString('es-CO', options);
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    const currentTimeFormatted = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

    return {
        targetDate,
        formattedDate: capitalizedDate,
        routeName,
        reason,
        currentTimeFormatted
    };
}

// Cálculo dinámico de tarifa express según nivel de urgencia y tiempo de respuesta campesino
function calculateDynamicExpressFee(dateStr, slotStr) {
    const minFee = 14000; // Tarifa mínima obligatoria
    if (!dateStr) {
        return {
            fee: minFee,
            tierName: '✅ Tarifa Mínima Express',
            badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
            reason: 'Tarifa mínima base para despacho individual exclusivo en fecha programada con antelación.',
            diffHours: 48,
            isMinFee: true
        };
    }

    const now = new Date();
    const [year, month, day] = dateStr.split('-').map(Number);

    // Asignar hora aproximada según franja horaria seleccionada
    let targetHour = 10;
    if (slotStr && (slotStr.includes('7:00 AM') || slotStr.includes('Primera hora'))) {
        targetHour = 7.5; // 7:30 AM
    } else if (slotStr && (slotStr.includes('8:00 AM') || slotStr.includes('Mañana'))) {
        targetHour = 10.0; // 10:00 AM
    } else if (slotStr && (slotStr.includes('1:00 PM') || slotStr.includes('Tarde'))) {
        targetHour = 14.5; // 2:30 PM
    }

    const targetDate = new Date(year, month - 1, day, Math.floor(targetHour), (targetHour % 1) * 60, 0);
    const diffMs = targetDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Escala según rapidez y esfuerzo logístico de la comunidad:
    // 1. Menos de 15 horas (ej: pedido hoy en la noche a las 7:00 PM para mañana a primera hora):
    if (diffHours <= 15) {
        return {
            fee: 28000,
            tierName: '🔥 Ultra-Urgente (Madrugada)',
            badgeClass: 'bg-red-100 text-red-900 border-red-300',
            reason: `¡Máxima rapidez (${Math.max(1, Math.round(diffHours))}h de margen)! Requiere cosecha al alba en la parcela y despacho individual saliendo a las 5:00 AM desde Guasca.`,
            diffHours,
            isMinFee: false
        };
    }
    // 2. Entre 15 y 26 horas (ej: pedido para mañana en la tarde o mediodía):
    else if (diffHours <= 26) {
        return {
            fee: 22000,
            tierName: '⚡ Urgente (Día Siguiente)',
            badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
            reason: `Antelación moderada (~${Math.round(diffHours)}h). Permite cosechar al amanecer y realizar flete directo hacia tu domicilio en el día.`,
            diffHours,
            isMinFee: false
        };
    }
    // 3. Entre 27 y 44 horas (ej: pasado mañana):
    else if (diffHours <= 44) {
        return {
            fee: 17000,
            tierName: '🕒 Prioritario Intermedio (36h)',
            badgeClass: 'bg-blue-100 text-blue-900 border-blue-300',
            reason: `Antelación de ~${Math.round(diffHours)}h. Permite coordinar con el agricultor con un día completo de anticipación sin sobrecostos nocturnos.`,
            diffHours,
            isMinFee: false
        };
    }
    // 4. Más de 44 horas (más de 2 días de antelación): TARIFA MÍNIMA
    else {
        return {
            fee: minFee,
            tierName: '✅ Tarifa Mínima Express (Anticipada)',
            badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
            reason: `¡Excelente anticipación (${Math.round(diffHours)}h)! Los agricultores programan la recolección sin prisas. Se aplica la tarifa mínima legal de despacho individual.`,
            diffHours,
            isMinFee: true
        };
    }
}

// Actualizar caja de información de tarifa express en el carrito
function updateExpressInfoBox() {
    const infoBox = document.getElementById('express-fee-info-box');
    if (!infoBox) return;

    const rate = calculateDynamicExpressFee(AppState.customDeliveryDate, AppState.customDeliverySlot);
    AppState.expressFee = rate.fee;
    AppState.expressTierName = rate.tierName;
    AppState.expressReason = rate.reason;

    infoBox.innerHTML = `
        <div class="flex items-center justify-between font-bold mb-1">
            <span class="px-2 py-0.5 rounded text-[11px] border ${rate.badgeClass}">
                ${rate.tierName}
            </span>
            <span class="text-amber-950 font-black text-sm">
                +$${rate.fee.toLocaleString('es-CO')}
            </span>
        </div>
        <p class="text-[11px] text-amber-900 leading-snug">
            ${rate.reason}
        </p>
        <div class="mt-1.5 pt-1.5 border-t border-amber-200/80 flex items-center justify-between text-[10px] text-amber-800">
            <span>🛡️ Tarifa mínima base: <strong>$14.000 COP</strong></span>
            <span>${rate.isMinFee ? '✨ Aplicando tarifa mínima' : '⚡ Tarifa por inmediatez'}</span>
        </div>
    `;
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
        zoneSelect.value = AppState.deliveryZone;
        zoneSelect.addEventListener('change', (e) => {
            applyZoneToUI(e.target.value);
            updateCartSummary();
        });
    }

    // Selector de zona en modal de checkout
    const clientZoneSelect = document.getElementById('client-zone');
    if (clientZoneSelect) {
        clientZoneSelect.addEventListener('change', (e) => {
            applyZoneToUI(e.target.value);
            updateCartSummary();
        });
    }

    // Checkbox de Despacho Express / Fecha Personalizada
    const expressCheck = document.getElementById('express-delivery-check');
    const expressBox = document.getElementById('express-date-picker-box');
    const expressDateInput = document.getElementById('express-date-input');
    const expressSlotSelect = document.getElementById('express-time-slot');

    if (expressDateInput) {
        // Establecer fecha mínima para mañana
        const tomorrow = new Date(Date.now() + 86400000);
        expressDateInput.min = tomorrow.toISOString().split('T')[0];
        expressDateInput.value = tomorrow.toISOString().split('T')[0];
        AppState.customDeliveryDate = expressDateInput.value;

        expressDateInput.addEventListener('change', (e) => {
            AppState.customDeliveryDate = e.target.value;
            updateExpressInfoBox();
            updateCartSummary();
        });
    }

    if (expressSlotSelect) {
        expressSlotSelect.addEventListener('change', (e) => {
            AppState.customDeliverySlot = e.target.value;
            updateExpressInfoBox();
            updateCartSummary();
        });
    }

    if (expressCheck) {
        expressCheck.addEventListener('change', (e) => {
            AppState.isExpressDelivery = e.target.checked;
            if (expressBox) {
                expressBox.classList.toggle('hidden', !e.target.checked);
            }
            const surchargeRow = document.getElementById('row-express-surcharge');
            if (surchargeRow) {
                surchargeRow.classList.toggle('hidden', !e.target.checked);
                surchargeRow.classList.toggle('flex', e.target.checked);
            }
            if (e.target.checked) {
                updateExpressInfoBox();
            }
            updateCartSummary();
        });
    }

    // Formulario de Checkout / WhatsApp
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
}

// Aplicar lógica de Punto Comunitario (Bloqueo de dirección y aviso de llegada)
function applyZoneToUI(zone) {
    AppState.deliveryZone = zone;

    // Sincronizar selectores si existen
    const cartSelect = document.getElementById('cart-delivery-zone');
    const clientSelect = document.getElementById('client-zone');
    if (cartSelect && cartSelect.value !== zone) cartSelect.value = zone;
    if (clientSelect && clientSelect.value !== zone) clientSelect.value = zone;

    const cartNotice = document.getElementById('cart-community-notice');
    const checkoutNotice = document.getElementById('checkout-community-notice');
    const addressInput = document.getElementById('client-address');
    const addressLabel = document.getElementById('client-address-label');
    const zoneNote = document.getElementById('zone-description-note');

    if (isCommunityPoint(zone)) {
        const point = COMMUNITY_PICKUP_POINTS[zone];

        // Mostrar aviso destacado
        if (cartNotice) cartNotice.classList.remove('hidden');
        if (checkoutNotice) checkoutNotice.classList.remove('hidden');

        // Bloquear campo de dirección para que el usuario NO pueda poner su dirección personal
        if (addressInput) {
            addressInput.value = point.address;
            addressInput.readOnly = true;
            addressInput.classList.add('bg-blue-50', 'text-blue-950', 'font-semibold', 'cursor-not-allowed', 'border-blue-400');
            addressInput.classList.remove('bg-gray-50', 'bg-white');
        }

        if (addressLabel) {
            addressLabel.innerHTML = `🏢 Ubicación del Puesto Comunitario <span class="text-blue-700 font-bold">(Bloqueado - No requieres ingresar dirección)</span>:`;
        }

        if (zoneNote) {
            zoneNote.textContent = `🏢 ${point.notice}`;
        }
    } else {
        // Es entrega a domicilio (personalizado o por ruta)
        if (cartNotice) cartNotice.classList.add('hidden');
        if (checkoutNotice) checkoutNotice.classList.add('hidden');

        // Habilitar campo de dirección
        if (addressInput) {
            // Si tenía la dirección de un punto comunitario anterior, limpiarlo para que ingrese la suya
            const isPointAddress = Object.values(COMMUNITY_PICKUP_POINTS).some(p => p.address === addressInput.value);
            if (isPointAddress) {
                addressInput.value = '';
            }
            addressInput.readOnly = false;
            addressInput.classList.remove('bg-blue-50', 'text-blue-950', 'font-semibold', 'cursor-not-allowed', 'border-blue-400');
            addressInput.classList.add('bg-gray-50');
            addressInput.placeholder = 'Ej: Calle 127 # 15-40, Apto 302, Barrio Santa Bárbara';
        }

        if (addressLabel) {
            addressLabel.innerHTML = `Dirección Exacta de Tu Casa / Apartamento *`;
        }

        if (zoneNote) {
            if (zone === 'personalizado-domicilio') {
                zoneNote.textContent = '📍 Despacho personalizado directo a la puerta de tu casa en Bogotá o municipios aledaños.';
            } else if (zone === 'bogota-norte') {
                zoneNote.textContent = '🚛 Domicilio Ruta Norte: Usaquén, Suba, Rosales, Santa Bárbara, Cedritos.';
            } else if (zone === 'bogota-centro') {
                zoneNote.textContent = '🚛 Domicilio Ruta Centro: Chapinero, Teusaquillo, Parkway, Galerías.';
            } else if (zone === 'sabana-centro') {
                zoneNote.textContent = '🚛 Domicilio Ruta Sabana: Sopó, Chía, Cajicá, Zipaquirá.';
            }
        }
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
    const baseShipping = AppState.cart.length > 0 ? (AppState.deliveryCosts[AppState.deliveryZone] || 0) : 0;
    
    // Tarifa express dinámica según urgencia / antelación
    let expressFee = 0;
    if (AppState.isExpressDelivery && AppState.cart.length > 0) {
        const rate = calculateDynamicExpressFee(AppState.customDeliveryDate, AppState.customDeliverySlot);
        expressFee = rate.fee;
        AppState.expressFee = rate.fee;
        AppState.expressTierName = rate.tierName;
        AppState.expressReason = rate.reason;
    }

    const total = subtotal + baseShipping + expressFee;

    const elSubtotal = document.getElementById('cart-subtotal');
    const elShipping = document.getElementById('cart-shipping');
    const elExpressFee = document.getElementById('cart-express-fee');
    const elTotal = document.getElementById('cart-total');

    if (elSubtotal) elSubtotal.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    if (elShipping) elShipping.textContent = baseShipping === 0 ? 'Gratis (Guasca)' : `$${baseShipping.toLocaleString('es-CO')}`;
    if (elExpressFee) {
        elExpressFee.textContent = `+$${expressFee.toLocaleString('es-CO')}`;
    }
    if (elTotal) elTotal.textContent = `$${total.toLocaleString('es-CO')}`;

    // Actualizar banner inteligente de fecha según día y hora del pedido
    const schedBanner = document.getElementById('dynamic-schedule-banner');
    if (schedBanner) {
        const info = getCalculatedDeliveryInfo();
        schedBanner.innerHTML = `
            <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-emerald-900 flex items-center gap-1">
                    📅 Ruta Comunitaria: <strong>${info.routeName}</strong>
                </span>
                <span class="text-[10px] bg-emerald-200/60 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                    🕒 ${info.currentTimeFormatted}
                </span>
            </div>
            <p class="text-emerald-950 font-extrabold text-sm mb-1">${info.formattedDate}</p>
            <p class="text-[11px] text-emerald-800 leading-snug">
                ${info.reason}
            </p>
        `;
    }

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
    if (!modal) return;

    // Sincronizar zona y bloquear dirección si es punto comunitario
    applyZoneToUI(AppState.deliveryZone);

    const dayInput = document.getElementById('client-day');
    const expressBox = document.getElementById('checkout-express-details');
    const expressText = document.getElementById('checkout-express-text');

    if (AppState.isExpressDelivery) {
        const chosenDate = AppState.customDeliveryDate || 'Mañana';
        const rate = calculateDynamicExpressFee(AppState.customDeliveryDate, AppState.customDeliverySlot);
        if (dayInput) dayInput.value = `Express: ${chosenDate} (${AppState.customDeliverySlot})`;
        if (expressBox && expressText) {
            expressBox.classList.remove('hidden');
            expressText.innerHTML = `
                Despacho prioritario directo en fecha seleccionada: <strong>${chosenDate} (${AppState.customDeliverySlot})</strong>.<br>
                Nivel: <strong>${rate.tierName}</strong>. Recargo por inmediatez: <strong>+$${rate.fee.toLocaleString('es-CO')} COP</strong> (Tarifa mínima base: $14.000).
            `;
        }
    } else {
        const info = getCalculatedDeliveryInfo();
        if (dayInput) dayInput.value = `${info.routeName} (${info.formattedDate})`;
        if (expressBox) expressBox.classList.add('hidden');
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
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
    const baseShipping = AppState.deliveryCosts[zone] || 0;
    const expressFee = AppState.isExpressDelivery ? (AppState.expressFee || 14000) : 0;
    const totalShipping = baseShipping + expressFee;
    const total = subtotal + totalShipping;

    const orderId = 'AG-' + Math.floor(1000 + Math.random() * 9000);
    const isPickup = isCommunityPoint(zone);
    const pickupPoint = isPickup ? COMMUNITY_PICKUP_POINTS[zone] : null;

    // Crear orden para el registro
    const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        client: { 
            name, 
            phone, 
            address: isPickup ? pickupPoint.address : address, 
            zone, 
            isCommunityPickup: isPickup,
            pickupName: isPickup ? pickupPoint.name : null,
            deliveryDay, 
            isExpress: AppState.isExpressDelivery,
            expressTier: AppState.isExpressDelivery ? AppState.expressTierName : null,
            expressFee: expressFee,
            customSlot: AppState.isExpressDelivery ? AppState.customDeliverySlot : null,
            notes 
        },
        items: [...AppState.cart],
        subtotal,
        shipping: totalShipping,
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

    if (isPickup) {
        waMessage += `• Modalidad: 🏢 PUESTO COMUNITARIO DE RECOGIDA\n`;
        waMessage += `• Puesto Asignado: ${pickupPoint.name}\n`;
        waMessage += `• Dirección de Acopio: ${pickupPoint.address}\n`;
        waMessage += `• 📢 AVISO DE LLEGADA: Se le avisará al comprador por WhatsApp en cuanto el pedido se encuentre en el puesto comunitario.\n`;
    } else {
        waMessage += `• Modalidad: 📍 DOMICILIO PUERTA A PUERTA (A TU CASA)\n`;
        waMessage += `• Dirección de Entrega: ${address}\n`;
        waMessage += `• Zona: ${zone === 'personalizado-domicilio' ? 'DIRECTO A TU CASA (PERSONALIZADO)' : zone.toUpperCase()}\n`;
    }

    if (AppState.isExpressDelivery) {
        waMessage += `• Prioridad: 🚀 DESPACHO EXPRESS (${AppState.expressTierName})\n`;
        waMessage += `• Fecha Solicitada: ${deliveryDay}\n`;
        waMessage += `• Franja Horaria: ${AppState.customDeliverySlot}\n`;
    } else {
        waMessage += `• Fecha Programada: ${deliveryDay}\n`;
    }

    if (notes) waMessage += `• Observaciones/Comentarios: ${notes}\n`;
    waMessage += `\n🧺 *CANASTA DE PRODUCTOS CONSOLIDADOS:*\n`;

    AppState.cart.forEach((item, index) => {
        waMessage += `${index + 1}. *${item.name}* (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString('es-CO')}\n`;
        waMessage += `   _Productor:_ ${item.producerName} (${item.unit})\n`;
    });

    waMessage += `\n💰 *RESUMEN ECONÓMICO:*\n`;
    waMessage += `• Subtotal Cosecha: $${subtotal.toLocaleString('es-CO')}\n`;
    waMessage += `• Transporte Base: $${baseShipping.toLocaleString('es-CO')}\n`;
    if (AppState.isExpressDelivery) {
        waMessage += `• Recargo Despacho Express (${AppState.expressTierName}): $${expressFee.toLocaleString('es-CO')}\n`;
        waMessage += `   _(Tarifa mínima base: $14.000 COP)_\n`;
    }
    waMessage += `• *TOTAL A PAGAR:* $${total.toLocaleString('es-CO')}\n\n`;
    waMessage += `🤝 *IMPACTO:* Este pedido evita intermediarios y apoya directamente a las familias campesinas de Guasca.\n`;
    waMessage += `_Generado a través de la plataforma comunitaria AgroGuasca (Proyecto Integrador I - Universidad de La Salle)_`;

    // Teléfono de la coordinación comunitaria / JAC de Guasca
    const coordinatorPhone = "573102345678";
    const waUrl = `https://wa.me/${coordinatorPhone}?text=${encodeURIComponent(waMessage)}`;

    // Limpiar carrito tras orden exitosa
    AppState.cart = [];
    AppState.isExpressDelivery = false;
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

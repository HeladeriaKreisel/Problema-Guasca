/**
 * Portal del Productor y Junta de Acción Comunal (JAC) - AgroGuasca
 * Módulo de Gestión de Oferta, Lotes y Pedidos
 * Proyecto Integrador I - Universidad de La Salle
 */

document.addEventListener('DOMContentLoaded', () => {
    initProducerPortal();
});

function initProducerPortal() {
    renderProducerLots();
    renderIncomingOrders();
    setupProducerForms();
    updateProducerMetrics();
}

function updateProducerMetrics() {
    const products = getStoredProducts();
    const orders = getStoredOrders();

    const elTotalLots = document.getElementById('metric-total-lots');
    const elActiveStock = document.getElementById('metric-active-stock');
    const elTotalOrders = document.getElementById('metric-total-orders');
    const elEstimatedRevenue = document.getElementById('metric-estimated-revenue');

    if (elTotalLots) elTotalLots.textContent = products.length;

    const totalStock = products.reduce((acc, p) => acc + (p.stockKg || 0), 0);
    if (elActiveStock) elActiveStock.textContent = `${totalStock} kg/un`;

    if (elTotalOrders) elTotalOrders.textContent = orders.length;

    const totalRevenue = orders.reduce((acc, o) => acc + (o.subtotal || 0), 0);
    if (elEstimatedRevenue) elEstimatedRevenue.textContent = `$${totalRevenue.toLocaleString('es-CO')}`;
}

// Renderizar tabla/tarjetas de lotes publicados
function renderProducerLots() {
    const container = document.getElementById('producer-lots-table');
    if (!container) return;

    const products = getStoredProducts();

    if (products.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-8 text-gray-500">
                    No hay lotes publicados en este momento. ¡Publica tu primera cosecha!
                </td>
            </tr>
        `;
        return;
    }

    container.innerHTML = products.map((item, idx) => `
        <tr class="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
            <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded-lg border border-gray-200">
                    <div>
                        <strong class="text-gray-900 block font-semibold text-sm">${item.name}</strong>
                        <span class="text-xs text-gray-500">${item.producerName} (${item.finca})</span>
                    </div>
                </div>
            </td>
            <td class="py-3 px-4 text-xs font-semibold">
                <span class="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                    ${item.category}
                </span>
            </td>
            <td class="py-3 px-4 text-sm font-bold text-gray-800">
                $${item.price.toLocaleString('es-CO')} <span class="text-xs text-gray-500 font-normal">/ ${item.unit}</span>
            </td>
            <td class="py-3 px-4 text-sm font-medium text-gray-700">
                ${item.stockKg} disp.
            </td>
            <td class="py-3 px-4 text-xs">
                ${item.demandAnticipation ? `
                    <span class="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        🌱 Cosecha Bajo Pedido
                    </span>
                ` : `
                    <span class="inline-flex items-center gap-1 text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        📦 Listo para despacho
                    </span>
                `}
            </td>
            <td class="py-3 px-4 text-right">
                <button onclick="deleteProductLot('${item.id}')" 
                        class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Retirar lote">
                    🗑️
                </button>
            </td>
        </tr>
    `).join('');
}

// Renderizar pedidos recibidos de compradores urbanos
function renderIncomingOrders() {
    const container = document.getElementById('producer-orders-list');
    if (!container) return;

    const orders = getStoredOrders();

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                <span class="text-3xl block mb-2">📋</span>
                <p class="font-semibold text-gray-700">No hay pedidos registrados aún</p>
                <p class="text-xs text-gray-400 mt-1">Los pedidos generados desde la tienda aparecerán aquí para consolidación por la JAC.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4">
            <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div>
                    <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                        Pedido #${order.id}
                    </span>
                    <span class="text-xs text-gray-400 ml-2">
                        ${new Date(order.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusBadgeClass(order.status)}">
                        ${order.status}
                    </span>
                    <button onclick="toggleOrderStatus('${order.id}')" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded font-medium">
                        Cambiar Estado
                    </button>
                </div>
            </div>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <strong class="text-gray-900 block font-semibold">${order.client.name}</strong>
                    <p class="text-xs text-gray-600 mt-0.5">📞 Tel: ${order.client.phone}</p>
                    <p class="text-xs text-gray-600">📍 Entrega: ${order.client.address} (${order.client.zone})</p>
                    <p class="text-xs text-emerald-700 font-semibold mt-1">🗓️ Fecha de entrega: ${order.client.deliveryDay}</p>
                    ${order.client.isExpress ? `
                        <div class="mt-1.5 p-2 bg-amber-50 rounded-lg border border-amber-300 text-[11px] text-amber-950 font-bold">
                            ⚡ ${order.client.expressTier || 'Despacho Express'} (+ $${(order.client.expressFee || 14000).toLocaleString('es-CO')})
                            <span class="block font-normal text-amber-800 text-[10px]">Franja: ${order.client.customSlot || 'Inmediata'}</span>
                        </div>
                    ` : ''}
                    ${order.client.notes ? `<p class="text-xs text-gray-500 italic mt-1">"${order.client.notes}"</p>` : ''}
                </div>

                <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span class="text-xs font-bold text-gray-700 block mb-1">Productos Consolidados:</span>
                    <ul class="text-xs space-y-1 text-gray-600">
                        ${order.items.map(item => `
                            <li class="flex justify-between">
                                <span>• ${item.name} (x${item.quantity})</span>
                                <span class="font-semibold text-gray-800">$${(item.price * item.quantity).toLocaleString('es-CO')}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="mt-2 pt-2 border-t border-gray-200 flex justify-between font-bold text-emerald-900 text-sm">
                        <span>Total del Pedido:</span>
                        <span>$${order.total.toLocaleString('es-CO')}</span>
                    </div>
                </div>
            </div>

            <div class="mt-4 pt-2 flex justify-end gap-2">
                <a href="https://wa.me/57${order.client.phone}?text=${encodeURIComponent('Hola ' + order.client.name + ', te saludamos desde la Vereda La Trinidad (Guasca) respecto a tu pedido #' + order.id)}" 
                   target="_blank" 
                   class="btn-secondary-guasca text-xs py-1.5 px-3">
                    💬 Contactar Comprador por WhatsApp
                </a>
            </div>
        </div>
    `).join('');
}

function getStatusBadgeClass(status) {
    if (status === 'Confirmado') return 'bg-blue-100 text-blue-800';
    if (status === 'En Ruta') return 'bg-amber-100 text-amber-800';
    if (status === 'Entregado') return 'bg-emerald-100 text-emerald-800';
    return 'bg-purple-100 text-purple-800';
}

function toggleOrderStatus(orderId) {
    const orders = getStoredOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const statuses = ['Pendiente de Confirmación', 'Confirmado', 'En Ruta', 'Entregado'];
    let currentIdx = statuses.indexOf(order.status);
    let nextIdx = (currentIdx + 1) % statuses.length;
    order.status = statuses[nextIdx];

    localStorage.setItem('agroguasca_orders', JSON.stringify(orders));
    renderIncomingOrders();
}

// Configurar formulario de nuevo lote
function setupProducerForms() {
    const form = document.getElementById('new-lot-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('lot-name').value.trim();
        const category = document.getElementById('lot-category').value;
        const producerName = document.getElementById('lot-producer').value.trim();
        const finca = document.getElementById('lot-finca').value.trim();
        const price = parseInt(document.getElementById('lot-price').value, 10);
        const unit = document.getElementById('lot-unit').value.trim();
        const stockKg = parseInt(document.getElementById('lot-stock').value, 10);
        const harvestDate = document.getElementById('lot-date').value.trim();
        const description = document.getElementById('lot-desc').value.trim();
        const badge = document.getElementById('lot-badge').value.trim() || 'Cultivo de Guasca';
        const demandAnticipation = document.getElementById('lot-anticipation').checked;
        const imageUrl = document.getElementById('lot-image').value.trim() || getDefaultImageByCategory(category);

        const newProduct = {
            id: 'prod-item-' + Date.now(),
            name,
            category,
            producerId: 'prod-custom',
            producerName,
            finca,
            price,
            unit,
            stockKg,
            harvestDate,
            image: imageUrl,
            description,
            badge,
            demandAnticipation,
            fairTradeMargin: "85% directo al campesino",
            wasteSavedKg: Math.round(stockKg * 0.4)
        };

        const products = getStoredProducts();
        products.unshift(newProduct);
        saveProducts(products);

        form.reset();
        renderProducerLots();
        updateProducerMetrics();
        alert('✅ ¡Lote publicado exitosamente! Ya se encuentra visible en la tienda para los compradores urbanos.');
    });
}

function getDefaultImageByCategory(cat) {
    if (cat === 'frutas') return 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80';
    if (cat === 'tuberculos') return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80';
    if (cat === 'lacteos') return 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80';
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
}

function deleteProductLot(id) {
    if (!confirm('¿Estás seguro de que deseas retirar este lote del mercado?')) return;

    let products = getStoredProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    renderProducerLots();
    updateProducerMetrics();
}

function resetDemoData() {
    if (!confirm('¿Deseas restablecer todos los productos y datos originales de Guasca?')) return;
    localStorage.removeItem('agroguasca_products');
    localStorage.removeItem('agroguasca_producers');
    localStorage.removeItem('agroguasca_orders');
    location.reload();
}

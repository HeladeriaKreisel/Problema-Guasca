/**
 * Base de Datos Semilla y Modelo de Datos - AgroGuasca "Del Campo al Comprador"
 * Proyecto Integrador I - Universidad de La Salle
 * Autores: Dilan Santiago Correa Gelves & Juan David Espitia Gutiérrez
 * Vereda La Trinidad, Sector San Francisco (Guasca, Cundinamarca)
 */

const SEED_PRODUCERS = [
    {
        id: "prod-1",
        name: "Don Hernando Gómez",
        finca: "Finca La Floresta",
        sector: "Sector San Francisco, Vereda La Trinidad",
        experience: "28 años cultivando fresa y hortalizas",
        photo: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=600&auto=format&fit=crop&q=80",
        specialty: "Fresa Orgánica y Berries de Altura",
        bio: "Pionero en la transición hacia abonos orgánicos en la vereda. Sus fresas crecen con agua de manantial a 2.700 msnm.",
        phone: "573102345678",
        verified: true
    },
    {
        id: "prod-2",
        name: "Doña Rosalba Cuervo",
        finca: "Finca El Mirador",
        sector: "Sector San Francisco, Vereda La Trinidad",
        experience: "35 años en el campo, miembro activa de la JAC",
        photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
        specialty: "Papa Pastusa y R12 Ecológica",
        bio: "Cultiva variedades tradicionales de papa sin agroquímicos agresivos, protegiendo los suelos de ladera de Guasca.",
        phone: "573123456789",
        verified: true
    },
    {
        id: "prod-3",
        name: "Cooperativa CooTrinidad",
        finca: "Centro de Acopio Comunitario",
        sector: "Vereda La Trinidad",
        experience: "14 familias ganaderas asociadas",
        photo: "https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?w=600&auto=format&fit=crop&q=80",
        specialty: "Leche Fresca y Transformación Láctea Artesanal",
        bio: "Colectivo lechero que garantiza pago digno por litro a los pequeños hatos y elabora yogurt y queso campesino.",
        phone: "573154567890",
        verified: true
    },
    {
        id: "prod-4",
        name: "Mateo Espitia",
        finca: "Parcela El Renacer",
        sector: "Sector San Francisco, Vereda La Trinidad",
        experience: "Joven emprendedor rural (24 años)",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
        specialty: "Arándanos y Uchuva tipo exportación",
        bio: "Ejemplo del relevo generacional en Guasca. Se quedó a tecnificar el cultivo de berries utilizando acolchados biodegradables.",
        phone: "573187654321",
        verified: true
    },
    {
        id: "prod-5",
        name: "Asoc. Mujeres Emprendedoras",
        finca: "Taller Gastronómico Comunitario",
        sector: "Sector San Francisco",
        experience: "8 mujeres cabeza de familia",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
        specialty: "Arequipe de Paila y Mermeladas Naturales",
        bio: "Transforman los excedentes de frutas y leche en dulces típicos de altísima calidad con recetas ancestrales de la región.",
        phone: "573209876543",
        verified: true
    }
];

const SEED_PRODUCTS = [
    {
        id: "prod-item-1",
        name: "Fresa Orgánica de Guasca",
        category: "frutas",
        producerId: "prod-1",
        producerName: "Don Hernando Gómez",
        finca: "Finca La Floresta",
        price: 8500,
        unit: "Caja 500g",
        stockKg: 65,
        harvestDate: "Cosecha fresca cada 48 horas",
        image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80",
        description: "Fresa de altura con maduración natural en planta. No se aplican fungicidas sintéticos. Aroma dulce y textura firme.",
        badge: "100% Orgánica",
        demandAnticipation: true,
        fairTradeMargin: "82% directo al campesino",
        wasteSavedKg: 120
    },
    {
        id: "prod-item-2",
        name: "Arándano Azul Andino Fresco",
        category: "frutas",
        producerId: "prod-4",
        producerName: "Mateo Espitia",
        finca: "Parcela El Renacer",
        price: 11000,
        unit: "Domo 250g",
        stockKg: 40,
        harvestDate: "Lunes y Jueves",
        image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=600&auto=format&fit=crop&q=80",
        description: "Arándano cultivado por joven campesino en transición agroecológica. Rico en antioxidantes, recolectado a mano.",
        badge: "Relevo Generacional",
        demandAnticipation: true,
        fairTradeMargin: "85% directo al campesino",
        wasteSavedKg: 80
    },
    {
        id: "prod-item-3",
        name: "Papa Pastusa Ecológica Seleccionada",
        category: "tuberculos",
        producerId: "prod-2",
        producerName: "Doña Rosalba Cuervo",
        finca: "Finca El Mirador",
        price: 3200,
        unit: "Kilo (o bolsa x 5kg a $15.000)",
        stockKg: 300,
        harvestDate: "Lote cosechado esta semana",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
        description: "Papa lavada con agua limpia de páramo, sin químicos poscosecha. Ideal para purés, ajiacos y sopas tradicionales.",
        badge: "Tradición Campesina",
        demandAnticipation: false,
        fairTradeMargin: "78% directo a la productora",
        wasteSavedKg: 250
    },
    {
        id: "prod-item-4",
        name: "Uchuva Silvestre con Capacho",
        category: "frutas",
        producerId: "prod-4",
        producerName: "Mateo Espitia",
        finca: "Parcela El Renacer",
        price: 5800,
        unit: "Bolsa 500g",
        stockKg: 50,
        harvestDate: "Cosecha inmediata",
        image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80",
        description: "Uchuva andina jugosa y ácida, conservada en su capacho natural protector para máxima frescura en el viaje a la ciudad.",
        badge: "Superalimento",
        demandAnticipation: true,
        fairTradeMargin: "80% directo al productor",
        wasteSavedKg: 65
    },
    {
        id: "prod-item-5",
        name: "Zanahoria Dulce de Tierra Fría",
        category: "tuberculos",
        producerId: "prod-2",
        producerName: "Doña Rosalba Cuervo",
        finca: "Finca El Mirador",
        price: 2400,
        unit: "Kilo",
        stockKg: 180,
        harvestDate: "Fresca recién arrancada",
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?w=600&auto=format&fit=crop&q=80",
        description: "Zanahorias crujientes y dulces gracias a las noches frías y suelos ricos en materia orgánica de la vereda La Trinidad.",
        badge: "Cero Agroquímicos",
        demandAnticipation: false,
        fairTradeMargin: "80% directo a la productora",
        wasteSavedKg: 140
    },
    {
        id: "prod-item-6",
        name: "Yogurt Artesanal de Mora de Páramo",
        category: "lacteos",
        producerId: "prod-3",
        producerName: "Cooperativa CooTrinidad",
        finca: "Centro de Acopio La Trinidad",
        price: 9500,
        unit: "Litro en botella reciclable",
        stockKg: 90,
        harvestDate: "Producción diaria",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
        description: "Elaborado con leche de vacas de pastoreo de pequeños hatos de San Francisco y dulce de mora silvestre. Sin espesantes artificiales.",
        badge: "Transformación Local",
        demandAnticipation: false,
        fairTradeMargin: "75% distribuido entre familias cooperadas",
        wasteSavedKg: 180
    },
    {
        id: "prod-item-7",
        name: "Arequipe Campesino en Paila de Cobre",
        category: "lacteos",
        producerId: "prod-5",
        producerName: "Asoc. Mujeres Emprendedoras",
        finca: "Taller San Francisco",
        price: 7500,
        unit: "Frasco de vidrio 250g",
        stockKg: 45,
        harvestDate: "Lote de la semana",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        description: "Lenta cocción de 6 horas con leña seleccionada y leche entera pura. Color dorado oscuro y sabor inigualable.",
        badge: "Receta Ancestral",
        demandAnticipation: false,
        fairTradeMargin: "88% a las madres comunitarias",
        wasteSavedKg: 95
    },
    {
        id: "prod-item-8",
        name: "Queso Campesino Fresco Tajado",
        category: "lacteos",
        producerId: "prod-3",
        producerName: "Cooperativa CooTrinidad",
        finca: "Centro de Acopio La Trinidad",
        price: 12000,
        unit: "Bloque 500g",
        stockKg: 60,
        harvestDate: "Fresco del día",
        image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=600&auto=format&fit=crop&q=80",
        description: "Bajo en sal, textura suave y suave hilado. Elaborado con leche pura sin desnatar. Ideal para desayuno o derretir.",
        badge: "Pura Leche",
        demandAnticipation: false,
        fairTradeMargin: "76% cooperativa campesina",
        wasteSavedKg: 110
    },
    {
        id: "prod-item-9",
        name: "Canasta Comunitaria 'La Trinidad Familiar'",
        category: "canastas",
        producerId: "prod-3",
        producerName: "Alianza Comunitaria JAC Guasca",
        finca: "Multiproductores Sector San Francisco",
        price: 49000,
        unit: "Canasta variada (Aprox 9 kg)",
        stockKg: 35,
        harvestDate: "Entregas programadas Miércoles y Sábados",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
        description: "Incluye: 2kg papa pastusa, 1kg zanahoria, 1 caja fresa orgánica 500g, 1 domo arándano 250g, 1 litro de yogurt natural y 1 queso campesino 500g.",
        badge: "Ahorro Comunitario 15%",
        demandAnticipation: true,
        fairTradeMargin: "90% directo a las 5 familias",
        wasteSavedKg: 310
    },
    {
        id: "prod-item-10",
        name: "Papa Criolla Chaucha Dorada",
        category: "tuberculos",
        producerId: "prod-2",
        producerName: "Doña Rosalba Cuervo",
        finca: "Finca El Mirador",
        price: 4200,
        unit: "Kilo",
        stockKg: 150,
        harvestDate: "Cosecha fresca semanal",
        image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80",
        description: "Papa criolla de páramo con textura suave y cremosa. Cultivada en laderas altas sin agroquímicos agresivos. Perfecta para sopas, frituras y ajiacos.",
        badge: "100% Nativa",
        demandAnticipation: true,
        fairTradeMargin: "82% directo a la productora",
        wasteSavedKg: 110
    },
    {
        id: "prod-item-11",
        name: "Mora Silvestre de Castilla de Altura",
        category: "frutas",
        producerId: "prod-1",
        producerName: "Don Hernando Gómez",
        finca: "Finca La Floresta",
        price: 6500,
        unit: "Libra (500g)",
        stockKg: 75,
        harvestDate: "Cosecha de 48 horas",
        image: "https://images.unsplash.com/photo-1577069808021-5079a40590a9?w=600&auto=format&fit=crop&q=80",
        description: "Mora recolectada a mano a 2.700 msnm. Sabor intenso, rica en antioxidantes y con maduración natural en planta.",
        badge: "Cosecha del Día",
        demandAnticipation: true,
        fairTradeMargin: "85% directo al campesino",
        wasteSavedKg: 90
    },
    {
        id: "prod-item-12",
        name: "Miel Pura de Abejas de Bosque Altoandino",
        category: "canastas",
        producerId: "prod-4",
        producerName: "Mateo Espitia",
        finca: "Parcela El Renacer",
        price: 19000,
        unit: "Frasco de vidrio 500g",
        stockKg: 30,
        harvestDate: "Extracción artesanal en frío",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80",
        description: "Miel cruda sin pasteurizar con floración de frailejón, eucalipto y mora silvestre. Apicultura sostenible para la polinización de los cultivos de San Francisco.",
        badge: "Pura y Cruda",
        demandAnticipation: false,
        fairTradeMargin: "90% directo al apicultor joven",
        wasteSavedKg: 45
    },
    {
        id: "prod-item-13",
        name: "Queso Doble Crema Campesino Tajado",
        category: "lacteos",
        producerId: "prod-3",
        producerName: "Cooperativa CooTrinidad",
        finca: "Centro de Acopio La Trinidad",
        price: 14500,
        unit: "Bloque 500g",
        stockKg: 50,
        harvestDate: "Elaboración diaria",
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop&q=80",
        description: "Elaborado con 100% leche entera de vacas de pastoreo. Hilado artesanal, bajo en sodio y con fundido perfecto.",
        badge: "Pura Leche de Pastoreo",
        demandAnticipation: false,
        fairTradeMargin: "78% distribuido en cooperativa",
        wasteSavedKg: 130
    },
    {
        id: "prod-item-14",
        name: "Trucha Arcoíris Fresca de Páramo (Eviscerada)",
        category: "canastas",
        producerId: "prod-4",
        producerName: "Asoc. Acuícola San Francisco",
        finca: "Reserva Hídrica Guasca",
        price: 16000,
        unit: "Paquete x 2 unidades (550g)",
        stockKg: 40,
        harvestDate: "Pesca bajo pedido",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80",
        description: "Criada en corrientes de agua fría y pura de páramo. Carne firme, rosada y rica en Omega 3. Despachada en cadena de frío directa.",
        badge: "Pesca Bajo Pedido",
        demandAnticipation: true,
        fairTradeMargin: "84% directo a los acuicultores",
        wasteSavedKg: 70
    },
    {
        id: "prod-item-15",
        name: "Ramo Fresco de Hierbas y Aromáticas de Huerta",
        category: "tuberculos",
        producerId: "prod-2",
        producerName: "Doña Rosalba Cuervo",
        finca: "Finca El Mirador",
        price: 7500,
        unit: "Ramillete variado fresco",
        stockKg: 60,
        harvestDate: "Corte matutino",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
        description: "Variedad de menta, hierbabuena, tomillo, romero, caléndula y cidrón cultivadas en huerta orgánica campesina.",
        badge: "Huerta Limpia",
        demandAnticipation: true,
        fairTradeMargin: "88% directo a la productora",
        wasteSavedKg: 50
    },
    {
        id: "prod-item-16",
        name: "Mermelada Artesanal de Uchuva y Jengibre",
        category: "lacteos",
        producerId: "prod-5",
        producerName: "Asoc. Mujeres Emprendedoras",
        finca: "Taller Gastronómico Comunitario",
        price: 8500,
        unit: "Frasco de vidrio 250g",
        stockKg: 35,
        harvestDate: "Lote artesanal",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
        description: "Elaborada por madres campesinas con uchuva seleccionada de Guasca y panela ecológica. Sin colorantes ni pectinas artificiales.",
        badge: "Mujeres Rurales",
        demandAnticipation: false,
        fairTradeMargin: "90% a mujeres cabeza de familia",
        wasteSavedKg: 85
    }
];

const PROBLEM_TREE_DATA = {
    problem: {
        title: "Dificultad crítica en la comercialización y acceso a mercados de valor",
        subtitle: "Pequeños productores de la vereda La Trinidad, sector San Francisco (Guasca, Cundinamarca)",
        description: "A pesar de una alta capacidad productiva y productos diferenciados (fresa orgánica, berries, lácteos con valor agregado), los campesinos no logran conectar con compradores dispuestos a pagar el valor real, generando desecho de excedentes e inestabilidad económica."
    },
    causes: [
        {
            title: "Desconexión con Mercados Urbanos",
            description: "La demanda de productos orgánicos y diferenciados existe en Bogotá y municipios aledaños, pero los campesinos no tienen canales directos de venta ni logística consolidada.",
            icon: "truck"
        },
        {
            title: "Falta de Consolidación de la Oferta",
            description: "Cada agricultor vende de forma aislada e individual; los volúmenes dispersos impiden competir frente a grandes intermediarios o abastecer clientes urbanos continuos.",
            icon: "users"
        },
        {
            title: "Ausencia de Información Anticipada de Demanda",
            description: "Los campesinos siembran y cosechan sin saber con antelación quién comprará, asumiendo todo el riesgo financiero y perdiendo producto si el mercado local está saturado.",
            icon: "calendar-x"
        },
        {
            title: "Mercado Local no Remunera el Valor Diferenciado",
            description: "En plazas locales el consumidor no paga el sobrecosto de producir fresa orgánica o quesos artesanales, desincentivando las buenas prácticas agrícolas.",
            icon: "coins"
        }
    ],
    effects: [
        {
            title: "Pérdida y Desperdicio de Alimentos (40.5%)",
            description: "Los excedentes no vendidos se regalan, se tiran al ganado o se pudren en los lotes, destruyendo la inversión en jornales, insumos y tiempo (DNP, 2016).",
            severity: "grave"
        },
        {
            title: "Inestabilidad Económica y Rentabilidad Precaria",
            description: "Ingresos impredecibles que mantienen a las familias campesinas en vulnerabilidad e impiden la reinversión en sus parcelas.",
            severity: "critica"
        },
        {
            title: "Desincentivo a la Calidad y Producción Limpia",
            description: "Si el mercado no paga la fresa orgánica, el campesino abandona el proceso ecológico y regresa a esquemas tradicionales de baja rentabilidad.",
            severity: "alta"
        },
        {
            title: "Ruptura del Relevo Generacional y Éxodo Rural",
            description: "Los jóvenes campesinos migran a las ciudades no por falta de apego a la tierra, sino por falta de viabilidad económica demostrada.",
            severity: "grave"
        },
        {
            title: "Desconfianza Comunitaria hacia Intervenciones Externas",
            description: "Frustración acumulada frente a promesas institucionales sin soluciones verificables sobre el terreno.",
            severity: "social"
        }
    ],
    solution: {
        title: "Transición de Estado A a Estado B (Método de Koen)",
        stateA: "Producción individual, sin consolidación de oferta, sin información previa de la demanda, excedentes desperdiciados.",
        stateB: "Oferta consolidada comunitaria (JAC y cooperativa), cosecha bajo demanda anticipada, circuitos cortos directos a compradores urbanos."
    }
};

// Guardar y sincronizar con localStorage para persistencia
function getStoredProducts() {
    const stored = localStorage.getItem("agroguasca_products");
    if (!stored) {
        localStorage.setItem("agroguasca_products", JSON.stringify(SEED_PRODUCTS));
        return SEED_PRODUCTS;
    }
    try {
        let products = JSON.parse(stored);
        let updated = false;
        SEED_PRODUCTS.forEach(seed => {
            if (!products.some(p => p.id === seed.id)) {
                products.push(seed);
                updated = true;
            }
        });
        if (updated) {
            localStorage.setItem("agroguasca_products", JSON.stringify(products));
        }
        return products;
    } catch (e) {
        localStorage.setItem("agroguasca_products", JSON.stringify(SEED_PRODUCTS));
        return SEED_PRODUCTS;
    }
}

function saveProducts(products) {
    localStorage.setItem("agroguasca_products", JSON.stringify(products));
}

function getStoredProducers() {
    const stored = localStorage.getItem("agroguasca_producers");
    if (!stored) {
        localStorage.setItem("agroguasca_producers", JSON.stringify(SEED_PRODUCERS));
        return SEED_PRODUCERS;
    }
    return JSON.parse(stored);
}

function saveProducers(producers) {
    localStorage.setItem("agroguasca_producers", JSON.stringify(producers));
}

function getStoredOrders() {
    const stored = localStorage.getItem("agroguasca_orders");
    if (!stored) {
        return [];
    }
    return JSON.parse(stored);
}

function saveOrder(order) {
    const orders = getStoredOrders();
    orders.unshift(order);
    localStorage.setItem("agroguasca_orders", JSON.stringify(orders));
}

// Inicializar datos en primera carga
if (!localStorage.getItem("agroguasca_products")) {
    localStorage.setItem("agroguasca_products", JSON.stringify(SEED_PRODUCTS));
}
if (!localStorage.getItem("agroguasca_producers")) {
    localStorage.setItem("agroguasca_producers", JSON.stringify(SEED_PRODUCERS));
}

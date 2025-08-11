document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const productsContainer = document.getElementById('productsContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const searchInput = document.getElementById('searchInput');
    const cartCountSpan = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const processPaymentBtn = document.getElementById('processPaymentBtn');
    
    // Modales de Bootstrap
    const quantityModal = new bootstrap.Modal(document.getElementById('quantityModal'));
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));

    // --- ESTADO DE LA APLICACIÓN ---
    let vehiclesData = [];
    let cart = [];
    let selectedVehicle = null;

    // --- URL DEL JSON ---
    const DATA_URL = 'https://raw.githubusercontent.com/JUANCITOPENA/Pagina_Vehiculos_Ventas/refs/heads/main/vehiculos.json';

    /**
     * Carga los datos de los vehículos desde el JSON.
     */
    const loadVehicles = async () => {
        showSpinner(true);
        try {
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            vehiclesData = await response.json();
            displayVehicles(vehiclesData);
        } catch (error) {
            productsContainer.innerHTML = `<div class="col"><p class="text-danger text-center">Error al cargar los vehículos: ${error.message}</p></div>`;
            console.error("Error en fetch:", error);
        } finally {
            showSpinner(false);
        }
    };

    /**
     * Muestra u oculta el spinner de carga.
     * @param {boolean} show - True para mostrar, false para ocultar.
     */
    const showSpinner = (show) => {
        loadingSpinner.style.display = show ? 'block' : 'none';
    };

    /**
     * Muestra los vehículos en el DOM.
     * @param {Array} vehicles - El array de vehículos a mostrar.
     */
    const displayVehicles = (vehicles) => {
        productsContainer.innerHTML = '';
        if (vehicles.length === 0) {
            productsContainer.innerHTML = '<p class="text-center">No se encontraron vehículos que coincidan con la búsqueda.</p>';
            return;
        }

        vehicles.forEach(vehicle => {
            const card = document.createElement('div');
            card.className = 'col-lg-4 col-md-6 mb-4';
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${vehicle.imagen}" class="card-img-top" alt="${vehicle.marca} ${vehicle.modelo}" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title">${vehicle.marca} ${vehicle.modelo}</h5>
                        <p class="card-text">
                           <strong>Categoría:</strong> ${vehicle.categoria}<br>
                           <strong>Tipo:</strong> ${vehicle.tipo.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '').trim()}
                        </p>
                    </div>
                    <div class="card-footer-custom p-3">
                       <p class="h5 text-primary fw-bold">${formatCurrency(vehicle.precio_venta)}</p>
                       <button class="btn btn-primary w-100 addToCartBtn" data-codigo="${vehicle.codigo}">Añadir al Carrito</button>
                    </div>
                </div>
            `;
            productsContainer.appendChild(card);
        });
        addAddToCartListeners();
    };
    
    /**
     * Formatea un número como moneda (Euros).
     * @param {number} value - El valor numérico.
     * @returns {string} - El valor formateado.
     */
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);
    };

    /**
     * Añade listeners a todos los botones "Añadir al Carrito".
     */
    const addAddToCartListeners = () => {
        const buttons = document.querySelectorAll('.addToCartBtn');
        buttons.forEach(button => {
            button.addEventListener('click', (event) => {
                const codigo = parseInt(event.target.dataset.codigo);
                selectedVehicle = vehiclesData.find(v => v.codigo === codigo);
                showQuantityModal(selectedVehicle);
            });
        });
    };

    /**
     * Muestra el modal para seleccionar la cantidad.
     * @param {object} vehicle - El vehículo seleccionado.
     */
    const showQuantityModal = (vehicle) => {
        document.getElementById('quantityInput').value = 1;
        const addToCartBtn = document.getElementById('addToCartBtn');
        
        // Clonar y reemplazar el botón para eliminar listeners antiguos
        const newBtn = addToCartBtn.cloneNode(true);
        addToCartBtn.parentNode.replaceChild(newBtn, addToCartBtn);
        
        newBtn.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantityInput').value);
            if (quantity > 0) {
                addItemToCart(vehicle, quantity);
                quantityModal.hide();
            } else {
                alert("La cantidad debe ser mayor que cero.");
            }
        });
        quantityModal.show();
    };

    /**
     * Añade un ítem al carrito o actualiza su cantidad.
     * @param {object} vehicle - El vehículo a añadir.
     * @param {number} quantity - La cantidad.
     */
    const addItemToCart = (vehicle, quantity) => {
        const existingItem = cart.find(item => item.codigo === vehicle.codigo);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...vehicle, quantity: quantity });
        }
        updateCartUI();
    };

    /**
     * Actualiza la UI del carrito (contador, modal, total).
     */
    const updateCartUI = () => {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItems = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        } else {
            cart.forEach(item => {
                const subtotal = item.precio_venta * item.quantity;
                total += subtotal;
                totalItems += item.quantity;

                const cartItemDiv = document.createElement('div');
                cartItemDiv.className = 'cart-item';
                cartItemDiv.innerHTML = `
                    <img src="${item.imagen}" alt="${item.marca}" class="cart-item-img">
                    <div class="cart-item-details">
                        <strong>${item.marca} ${item.modelo}</strong><br>
                        <span>Cantidad: ${item.quantity}</span>
                    </div>
                    <strong class="text-end">${formatCurrency(subtotal)}</strong>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }
        
        cartTotalSpan.textContent = formatCurrency(total);
        cartCountSpan.textContent = totalItems;

        // Añadir animación al contador
        cartCountSpan.classList.add('pulse-animation');
        cartCountSpan.onanimationend = () => {
            cartCountSpan.classList.remove('pulse-animation');
        };
    };

    /**
     * Filtra los vehículos basados en el texto de búsqueda.
     */
    const filterVehicles = () => {
        const query = searchInput.value.toLowerCase().trim();
        const filteredVehicles = vehiclesData.filter(vehicle => {
            return vehicle.marca.toLowerCase().includes(query) ||
                   vehicle.modelo.toLowerCase().includes(query) ||
                   vehicle.categoria.toLowerCase().includes(query);
        });
        displayVehicles(filteredVehicles);
    };

    /**
     * Genera una factura en PDF con los detalles de la compra.
     */
    const generateInvoice = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const customerName = document.getElementById('cardName').value || "Cliente";
        let total = 0;
        
        doc.setFontSize(20);
        doc.text("Factura - GarageOnline", 105, 20, null, null, 'center');
        
        doc.setFontSize(12);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
        doc.text(`Cliente: ${customerName}`, 20, 40);

        let y = 60;
        doc.setFontSize(10);
        doc.text("Descripción", 20, y);
        doc.text("Cantidad", 120, y);
        doc.text("Subtotal", 170, y);
        y += 10;
        
        cart.forEach(item => {
            const subtotal = item.precio_venta * item.quantity;
            total += subtotal;
            doc.text(`${item.marca} ${item.modelo}`, 20, y);
            doc.text(item.quantity.toString(), 120, y);
            doc.text(formatCurrency(subtotal), 170, y);
            y += 7;
        });

        doc.setLineWidth(0.5);
        doc.line(20, y, 190, y);
        y += 10;
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(`Total: ${formatCurrency(total)}`, 140, y);
        
        doc.save(`factura-garageonline-${Date.now()}.pdf`);
    };

    // --- EVENT LISTENERS ---
    searchInput.addEventListener('input', filterVehicles);
    
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            cartModal.hide();
            paymentModal.show();
        } else {
            alert("Tu carrito está vacío.");
        }
    });

    processPaymentBtn.addEventListener('click', () => {
        const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;

        if (!cardName || !cardNumber) {
             alert("Por favor, completa todos los campos del formulario de pago.");
             return;
        }

        alert('Pago procesado con éxito. Generando factura...');
        generateInvoice();
        
        // Limpiar carrito y UI
        cart = [];
        updateCartUI();
        
        // Resetear formulario y ocultar modales
        document.getElementById('paymentForm').reset();
        paymentModal.hide();
    });

    // --- INICIALIZACIÓN ---
    loadVehicles();
});
/* Estilos Base */
body {
    /* Añade padding superior al body para compensar la barra de navegación fija */
    padding-top: 70px; 
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Header y Navegación */
#main-header {
    background-image: url('https://t4.ftcdn.net/jpg/02/82/00/75/360_F_282007508_wdCUP7hUMNK1Cuzj7XmOcFmzyzJ0Nnp9.jpg');
    background-size: cover;
    background-position: center;
    height: 50vh; /* 50% de la altura de la ventana */
    position: relative;
}

#inicio {
    height: calc(50vh - 70px); /* Ajusta la altura de la sección de inicio */
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.logo {
    font-weight: bold;
    font-size: 1.5rem;
}

/* Tarjetas de Producto */
.card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: none;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.2);
}

.card-img-top {
    width: 100%;
    height: 200px; /* Altura fija para todas las imágenes */
    object-fit: cover; /* Asegura que la imagen cubra el área sin deformarse */
}

/* Usa Flexbox para alinear el contenido de la tarjeta */
.card-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.card-title {
    height: 48px; /* Altura fija para dos líneas */
    overflow: hidden;
    font-size: 1.1rem;
}

.card-text {
    height: 4.5em; /* Permite hasta 3 líneas de descripción */
    overflow: hidden;
    flex-grow: 1; /* Permite que este elemento crezca y empuje el botón hacia abajo */
}

.card-footer-custom {
    margin-top: auto; /* Empuja el botón al final de la tarjeta */
    border-top: none;
    background-color: transparent;
}


/* Animación para el contador del carrito */
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
}

.pulse-animation {
    animation: pulse 0.5s ease;
}


/* Spinner de Carga */
#loadingSpinner {
    padding: 40px 0;
}

/* Estilos para el carrito dentro del modal */
.cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.cart-item-img {
    width: 80px;
    height: 60px;
    object-fit: cover;
    margin-right: 15px;
    border-radius: 5px;
}

.cart-item-details {
    flex-grow: 1;
}
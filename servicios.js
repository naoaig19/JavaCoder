// Alerta
window.alert("Hola bienvenid@ a nuestro sitio web! Por favor, selecciona los servicios deseados");

// Array
const carrito = [];

// Función para agregar un servicio al carrito
function agregarcarrito(servicio, precio) {
    console.log(`Agregando al carrito: ${servicio}`); // Lógica de depuración
    const existingItem = carrito.find(item => item.nombre === servicio);

    if (existingItem) {
        existingItem.cantidad += 1;
    } else {
        carrito.push({ nombre: servicio, precio: precio, cantidad: 1 });
    }

    // Actualiza la visualización del carrito
    actcarrito();
}

// Función para eliminar un servicio del carrito
function eliminarDelCarrito(servicio) {
    const itemIndex = carrito.findIndex(item => item.nombre === servicio);

    if (itemIndex !== -1) {
        carrito[itemIndex].cantidad -= 1;

        // Si la cantidad llega a cero, lo eliminamos del carrito
        if (carrito[itemIndex].cantidad === 0) {
            carrito.splice(itemIndex, 1);
        }

        // Actualiza la visualización del carrito
        actcarrito();
    }
}

// Función para actualizar la visualización del carrito
function actcarrito() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    carrito.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad}`;

        // Botón para eliminar del carrito
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.onclick = () => eliminarDelCarrito(item.nombre);

        listItem.appendChild(removeButton);
        cartItems.appendChild(listItem);
    });

    // Actualiza el total
    const totalAmount = totalCarrito();
    document.getElementById('total').textContent = `Total: $${totalAmount}`;
}

// Función para calcular el total del carrito
function totalCarrito() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Función para finalizar la selección y mostrar el total
function finalizarsolicitud() {
    const phoneNumber = prompt("Por favor, ingresa tu número de celular para que coordinemos la cita");

    if (phoneNumber) {
        const totalAmount = totalCarrito();
        alert("Su total es $" + totalAmount + ". En breve nos comunicaremos con usted al número " + phoneNumber + " para coordinar la cita y la seña.");

        // Reiniciar el carrito
        carrito.length = 0;
        actcarrito(); // Actualiza la visualización
        window.alert("Hola bienvenid@ a nuestro sitio web! Por favor, selecciona los servicios deseados");
    } else {
        alert("No se ingresó un número de celular. No se puede completar el pedido.");
    }
}

document.querySelectorAll('.service-content button').forEach(button => {
    button.addEventListener('click', function () {
        const servicio = this.previousElementSibling.previousElementSibling.textContent;
        const precio = parseInt(this.parentNode.querySelector('.price').textContent.replace(/[^\d]/g, ''), 10);
        agregarcarrito(servicio, precio);
    });
});

// Inicializa el carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Array de servicios
const servicios = [];

// Función para calcular el total del carrito
function totalCarrito() {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Funciones del Carrito
function agregarcarrito(servicio, precio) {
    const existingItem = carrito.find(item => item.nombre === servicio);

    if (existingItem) {
        existingItem.cantidad += 1;
    } else {
        carrito.push({ nombre: servicio, precio: precio, cantidad: 1 });
    }

    actualizarLocalStorage();
    actcarrito();
}

function eliminarDelCarrito(servicio) {
    const itemIndex = carrito.findIndex(item => item.nombre === servicio);

    if (itemIndex !== -1) {
        carrito[itemIndex].cantidad -= 1;

        if (carrito[itemIndex].cantidad === 0) {
            carrito.splice(itemIndex, 1);
        }

        actualizarLocalStorage();
        actcarrito();
    }
}

function actualizarLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actcarrito() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    carrito.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.onclick = () => eliminarDelCarrito(item.nombre);

        listItem.appendChild(removeButton);
        cartItems.appendChild(listItem);
    });

    const totalAmount = totalCarrito();
    document.getElementById('total').textContent = `Total: $${totalAmount}`;
}

function finalizarsolicitud() {
    const phoneNumber = prompt("Por favor, ingresa tu número de celular para que coordinemos la cita");

    if (phoneNumber) {
        const totalAmount = totalCarrito();
        //Modifique los alert por un sweet
        Swal.fire({
            title: "EXCELENTE",
            text: "Su total es $" + totalAmount + ". En breve nos comunicaremos con usted al número " + phoneNumber + " para coordinar la cita y la seña.",
            icon: "success",
            confirmButtonText: 'Aceptar'
        });

        carrito.length = 0;
        actualizarLocalStorage();
        actcarrito();
    } else {
        prompt("No se ingresó un número de celular. No se puede completar el pedido.");
    }
}

// Funciones de Servicios
const serviciosPreexistentes = async () => {
    if (servicios.length === 0) {
        try {
            const URLservicios = "./servicios.json";
            const serviciosBasePuro = await fetch(URLservicios);

            if (!serviciosBasePuro.ok) {
                throw new Error('Error en la red: ' + serviciosBasePuro.statusText);
            }

            const serviciosBase = await serviciosBasePuro.json();
            serviciosBase.forEach(serv => agregarServicio(serv));
        } catch (err) {
            console.error("Se produjo un error al realizar el fetch:", err);
        } finally {
            renderizarServicios(servicios);
        }
    } else {
        renderizarServicios(servicios);
    }
};

function agregarServicio(serv) {
    servicios.push(serv);
}

function renderizarServicios(servicios) {
    const container = document.getElementById('services-container');
    container.innerHTML = '';

    servicios.forEach(serv => {
        const serviceDiv = document.createElement('div');
        serviceDiv.className = 'service';

        const img = document.createElement('img');
        img.src = "./multimedia/karen.jpeg"; // Cambia esto si tienes imágenes específicas
        img.alt = serv.nombre;

        const serviceContent = document.createElement('div');
        serviceContent.className = 'service-content';

        const title = document.createElement('h2');
        title.className = 'nombreservicio';
        title.textContent = serv.nombre;

        const description = document.createElement('p');
        description.textContent = serv.descripcion;

        const price = document.createElement('p');
        price.className = 'precio';
        price.textContent = `Precio: $${serv.precio}`;

        const button = document.createElement('button');
        button.textContent = 'Añadir al carrito';
        button.onclick = () => agregarcarrito(serv.nombre, serv.precio);

        serviceContent.appendChild(title);
        serviceContent.appendChild(description);
        serviceContent.appendChild(price);
        serviceContent.appendChild(button);

        serviceDiv.appendChild(img);
        serviceDiv.appendChild(serviceContent);
        container.appendChild(serviceDiv);
    });
}

// Llama a las funciones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    serviciosPreexistentes();
    actcarrito();
});

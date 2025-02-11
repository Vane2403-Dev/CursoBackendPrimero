const socket = io();
onst socket = io();

// Recibir actualización de productos y renderizar en la página
socket.on('productosActualizados', (productos) => {
    const container = document.getElementById('product-list');
    container.innerHTML = '';
    productos.forEach(producto => {
        const div = document.createElement('div');
        div.classList.add('product-card');
        div.innerHTML = `
            <h2>${producto.title}</h2>
            <p><strong>Descripción:</strong> ${producto.description}</p>
            <p><strong>Categoría:</strong> ${producto.category}</p>
            <p><strong>Precio:</strong> $${producto.price}</p>
            <p><strong>Stock:</strong> ${producto.stock}</p>
            ${producto.thumbnail ? `<img src="${producto.thumbnail}" alt="${producto.title}">` : '<p>Sin imagen disponible</p>'}
        `;
        container.appendChild(div);
    });
});

// Enviar un nuevo producto desde el cliente (ejemplo)
document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        thumbnail: document.getElementById('thumbnail').value
    };

    socket.emit('nuevoProducto', newProduct);
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const productId = event.target.getAttribute('data-id');
        socket.emit('eliminarProducto', productId);
    }
});
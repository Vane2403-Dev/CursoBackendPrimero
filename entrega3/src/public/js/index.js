const socket = io();   





// Escuchar la actualización de productos y renderizar en la página
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
            <button class="delete-button" data-id="${producto._id}">Eliminar</button>
        `;
        container.appendChild(div);
    });
});

// Escuchar el evento de envío del formulario para agregar un producto
document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        thumbnail: document.getElementById('thumbnail')?.value || null
    };
    

    socket.emit('nuevoProducto', newProduct);
    e.target.reset();
});
// Escuchar evento de clic en los botones "Eliminar"
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const productId = event.target.getAttribute('data-id');
        socket.emit('eliminarProducto', productId);
    }
});

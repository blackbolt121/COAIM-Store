const productos = window.productosData || {};
const productosSeleccionados = {};

const buscador = document.getElementById("buscador");
const resultados = document.getElementById("resultados");
const tablaProductos = document.getElementById("tabla-productos");

buscador.addEventListener("input", () => {
    const termino = buscador.value.toLowerCase();
    resultados.innerHTML = "";

    if (termino.length === 0) {
        resultados.classList.add("hidden");
        return;
    }

    const coincidencias = productos
        .filter(p =>
            p.name.toLowerCase().includes(termino) ||
            p.sku.toLowerCase().includes(termino)
        )
        .slice(0, 20);

    coincidencias.forEach(prod => {
        const li = document.createElement("li");
        li.className = "cursor-pointer hover:bg-gray-100 px-4 py-2";
        li.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${prod.imageUrl}" class="w-8 h-8 object-cover rounded" alt="${prod.name}" />
        <div>
          <p class="font-medium text-gray-800">${prod.name}</p>
          <p class="text-sm text-gray-500">$${prod.price.toFixed(2)}</p>
        </div>
      </div>`;
        li.addEventListener("click", () => agregarProducto(prod));
        resultados.appendChild(li);
    });

    resultados.classList.remove("hidden");
});

function agregarProducto(prod) {
    resultados.classList.add("hidden");
    buscador.value = "";

    if (!productosSeleccionados[prod.id]) {
        productosSeleccionados[prod.id] = { ...prod, cantidad: 1 };
    }

    renderTabla();
}

function eliminarProducto(id) {
    delete productosSeleccionados[id];
    renderTabla();
}

function renderTabla() {
    tablaProductos.innerHTML = "";
    let subtotal = 0;

    Object.values(productosSeleccionados).forEach(p => {
        const totalProducto = p.price * p.cantidad;
        subtotal += totalProducto;

        const row = document.createElement("tr");
        row.innerHTML = `
      <td class="flex items-center gap-4 py-2 px-4">
        <img src="${p.imageUrl}" alt="${p.name}" class="w-12 h-12 object-cover rounded" />
        <div><span class="font-medium text-gray-800">${p.name}</span>
        <br>
        <span class="font-mono font-xs font-bold text-gray-900">${p.sku}</span></div>
      </td>
      <td class="text-right text-gray-700 font-semibold py-2 px-4">
        $${p.price.toFixed(2)} x
        <input type="number" min="1" value="${p.cantidad}" class="w-16 text-right border rounded p-1 ml-1 cantidad-input" data-id="${p.id}" />
        <div class="text-sm text-gray-500 mt-1">= $${totalProducto.toFixed(2)}</div>
      </td>
      <td class="py-2 px-4 text-center">
        <button onclick="eliminarProducto('${p.id}')" class="text-red-600 hover:text-red-800 transition-colors duration-150">❌</button>
      </td>`;
        tablaProductos.appendChild(row);
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("iva").textContent = `$${iva.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll(".cantidad-input").forEach(input => {
        input.addEventListener("change", e => {
            const id = e.target.getAttribute("data-id");
            const nuevaCantidad = parseInt(e.target.value);
            if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
                productosSeleccionados[id].cantidad = nuevaCantidad;
                renderTabla();
            }
        });
    });
}



let form = document.querySelector("#formCotizacion")

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    let productos = document.querySelector("#productoSeleccionados")
    productos.value = JSON.stringify(productosSeleccionados)
    form.submit()
})

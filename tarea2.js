/*
En el archivo tarea2.js podemos encontrar un código de un supermercado que vende productos.
El código contiene 
    - una clase Producto que representa un producto que vende el super
    - una clase Carrito que representa el carrito de compras de un cliente
    - una clase ProductoEnCarrito que representa un producto que se agrego al carrito
    - una función findProductBySku que simula una base de datos y busca un producto por su sku
El código tiene errores y varias cosas para mejorar / agregar
​
Ejercicios
1) Arreglar errores existentes en el código
    a) Al ejecutar agregarProducto 2 veces con los mismos valores debería agregar 1 solo producto con la suma de las cantidades.    
    b) Al ejecutar agregarProducto debería actualizar la lista de categorías solamente si la categoría no estaba en la lista.
    c) Si intento agregar un producto que no existe debería mostrar un mensaje de error.
​
2) Agregar la función eliminarProducto a la clase Carrito
    a) La función eliminarProducto recibe un sku y una cantidad (debe devolver una promesa)
    b) Si la cantidad es menor a la cantidad de ese producto en el carrito, se debe restar esa cantidad al producto
    c) Si la cantidad es mayor o igual a la cantidad de ese producto en el carrito, se debe eliminar el producto del carrito
    d) Si el producto no existe en el carrito, se debe mostrar un mensaje de error
    e) La función debe retornar una promesa
​
3) Utilizar la función eliminarProducto utilizando .then() y .catch()
​
*/

// Cada producto que vende el super es creado con esta clase
class Producto {
  sku; // Identificador único del producto
  nombre; // Su nombre
  categoria; // Categoría a la que pertenece este producto
  precio; // Su precio
  stock; // Cantidad disponible en stock

  constructor(sku, nombre, precio, categoria, stock) {
    this.sku = sku;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;

    // Si no me definen stock, pongo 10 por default
    if (stock) {
      this.stock = stock;
    } else {
      this.stock = 10;
    }
  }
}

// Creo todos los productos que vende mi super
const queso = new Producto("KS944RUR", "Queso", 10, "lacteos", 4);
const gaseosa = new Producto("FN312PPE", "Gaseosa", 5, "bebidas");
const cerveza = new Producto("PV332MJ", "Cerveza", 20, "bebidas");
const arroz = new Producto("XX92LKI", "Arroz", 7, "alimentos", 20);
const fideos = new Producto("UI999TY", "Fideos", 5, "alimentos");
const lavandina = new Producto("RT324GD", "Lavandina", 9, "limpieza");
const shampoo = new Producto("OL883YE", "Shampoo", 3, "higiene", 50);
const jabon = new Producto("WE328NJ", "Jabon", 4, "higiene", 3);

// Genero un listado de productos. Simulando base de datos
const productosDelSuper = [
  queso,
  gaseosa,
  cerveza,
  arroz,
  fideos,
  lavandina,
  shampoo,
  jabon,
];

// Cada cliente que venga a mi super va a crear un carrito
class Carrito {
  productos; // Lista de productos agregados
  categorias; // Lista de las diferentes categorías de los productos en el carrito
  precioTotal; // Lo que voy a pagar al finalizar mi compra

  // Al crear un carrito, empieza vació
  constructor() {
    this.precioTotal = 0;
    this.productos = [];
    this.categorias = [];
  }

  /**
   * función que agrega @{cantidad} de productos con @{sku} al carrito
   */
  async agregarProducto(sku, cantidad) {
    // Busco el producto en la "base de datos"
    try {
      const producto = await findProductBySku(sku);
      console.log("Producto encontrado ", producto);
          if (this.existenciaProductoEnCarro(producto)) {
            console.log("Actualizando contenido del carro de compras...");
            console.log(
              `Agregando al carrito ${cantidad}  ${this.mensajeCantidad(
                cantidad
              )}  ${producto.nombre}.....`);
            this.actualizarCantidadDelProducto(producto.sku, cantidad);
            this.actualizarPrecioTotal(producto.precio * cantidad);
        
            console.log(this.categorias);
          } else {
            console.log(
              `Agregando al carrito ${cantidad}  ${this.mensajeCantidad(
                cantidad
              )}  ${producto.nombre}.....`
            );
            // Creo un producto nuevo
            const nuevoProducto = new ProductoEnCarrito(
              sku,
              producto.nombre,
              cantidad
            );
            this.productos.push(nuevoProducto);
            this.actualizarPrecioTotal(producto.precio * cantidad);
            this.listaCategoria(producto);
          
            console.log(this.categorias);
          }  
         
       
    } catch (error) {
      console.error(error);
    }
  }

  /* Retorna un string en singular o plurarl según la cantidad. */
  mensajeCantidad(cantidad) {
    return cantidad != 1 ? "unidades" : "unidad";
  }

  /* Verificar la existencia de un producto en el carro */
  existenciaProductoEnCarro(producto) {
    return this.productos.find((item) => item.sku === producto.sku);
  }

  /* Actualiza la cantidades de un producto existente */
  actualizarCantidadDelProducto(sku, cantidad) {
    this.productos.forEach((item) => {
      if (item.sku === sku) {
        item.cantidad += cantidad;
      }
    });
  }

  /* Actualiza el precio total acumulado en el contenido del carrito */
  actualizarPrecioTotal(monto) {
    this.precioTotal += monto;
  }

  /* Muestra todo lo que tiene el carro de compras */
  mostrarCarroCompra() {
    console.log("Contenido del Carrito de Compra ");
    this.productos.forEach((item) => {
      console.log("Producto " + item.nombre + " Cantidad:" + item.cantidad);
    });
    console.log("El total es: $" + this.precioTotal);
  }

  /* Realizamos la carga de la lista de categorias */
  listaCategoria(producto) {
    if (this.categorias.find((categ) => categ === producto.categoria)) {
    } else {
      this.categorias.push(producto.categoria);
    }
    /*  console.log("Lista de Categorias");
    console.log(this.categorias); */
  }

  /* Eliminamos una categoria según corresponda. */
  async eliminarCategoria() {
    this.categorias = [];
    for (const producto of this.productos) {
      const prod = await findProductBySku(producto.sku);
      this.listaCategoria(prod);
    }
    console.log("La lista de Categorias\n") + console.log(this.categorias);
  }

 

  mostarTodasCategorias() {
    return (
      console.log("La lista de Categorias\n") + console.log(this.categorias)
    );
  }
  /* Por medio del código del producto elimina el mismo dependiendo de la cantidad de ese producto. */
  async eliminarProducto(sku, cantidad) {
    console.log("Eliminando Producto...");
    this.productos.forEach((producto) => {
      if (producto.sku === sku) {
        if (producto.cantidad <= cantidad) {
          this.productos = this.productos.filter((prod) => prod.sku != sku);
          this.eliminarCategoria();
          console.log(
            "Se eliminaron " +
              cantidad +
              " unidades de " +
              producto.nombre +
              " del carrito de compra."
          );
       
        } else {
          this.actualizarCantidadDelProducto(sku, -cantidad);
          console.log(
            "Se eliminaron " +
              cantidad +
              " unidades de " +
              producto.nombre +
              " del carrito de compra."
          );
       
        }
      }
    });
    const prod = await findProductBySku(sku);
    this.actualizarPrecioTotal(-(prod.precio * cantidad));
    this.mostrarCarroCompra();
  }

  /* Retorna una promesa dependiendo según corresponda cuando eliminamos un producto del carro */
  eliminarProductosCarrito(sku, cantidad) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.productos.find((item) => item.sku === sku)) {
          resolve(this.eliminarProducto(sku, cantidad));
        } else {
          reject(
            `No existe el código ${sku} del producto que quiere eliminar del carro.`
          );
        }
      }, 1500);
    });
  }

  /*  mostrarCategorias() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.categorias.length != 0) {
          resolve(this.mostarTodasCategorias());
        } else {
          reject(`La lista esta vacia`);
        }
      }, 1500);
    });
  } */

  /*  Retorna una promesa cuando intentamos mostrar el contenido del carrito de compra */
  mostrarCompra() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.productos.length != 0) {
          resolve(this.mostrarCarroCompra());
        } else {
          reject(`El carrito esta vacio`);
        }
      }, 1500);
    });
  }
}

// Cada producto que se agrega al carrito es creado con esta clase
class ProductoEnCarrito {
  sku; // Identificador único del producto
  nombre; // Su nombre
  cantidad; // Cantidad de este producto en el carrito

  constructor(sku, nombre, cantidad) {
    this.sku = sku;
    this.nombre = nombre;
    this.cantidad = cantidad;
  }
}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundProduct = productosDelSuper.find(
        (product) => product.sku === sku
      );
      if (foundProduct) {
        resolve(foundProduct);
      } else {
        reject(`El código ${sku} no se encuentra en la lista de productos`);
      }
    }, 1500);
  });
}





const carrito = new Carrito();
carrito.agregarProducto("WE328NJ", 5); //jabon
carrito.agregarProducto("XX92LKI", 1); //
carrito.agregarProducto("WE328J", 1);

carrito.agregarProducto("OL883YE", 1);
carrito.agregarProducto("WE328NJ", 1); //jabon
carrito.agregarProducto("WE328NJ", 1);//jabon

/* carrito
  .mostrarCompra()
  .then((obj) => console.log(obj))
  .catch((obj) => console.error(obj)); */
/* carrito.eliminarProducto("WE328NJ" , 5);  */
/* carrito.mostrarCompra().then(obj=> console.log(obj)).catch(obj=> console.error(obj)); */
carrito
  .eliminarProductosCarrito("WE328NJ", 2) //jabon
  .then((obj) => console.log(obj))
  .catch((obj) => console.error(obj));
/*   carrito.mostarTodasCategorias(); */
/*  carrito
  .mostrarCategorias()
  .then((obj) => console.log(obj))
  .catch((obj) => console.error(obj)); */

carrito.agregarProducto("WE328NJ", 5); //jabon

carrito
  .eliminarProductosCarrito("WE328NJ", 10) //jabon
  .then((obj) => console.log(obj))
  .catch((obj) => console.error(obj));



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
      checkNumber(cantidad)
      checkNumberNegativos(cantidad)
         const producto = await findProductBySku(sku);
          console.log("Producto encontrado  "+ producto.nombre + " ", producto);
            if(producto.stock!=0){
              const productoCarro = this.existenciaProductoEnCarro(producto);
              if (productoCarro) {
                checkNumberMayores(producto.stock,cantidad);
                console.log("Actualizando contenido del carro de compras...");
                producto.stock=actualizarStock(producto.stock,-cantidad);
                console.log(
                  `Agregando al carrito ${cantidad}  ${this.mensajeCantidad(
                    cantidad
                  )}  ${producto.nombre}.....`);
                  productoCarro.cantidad = actualizarStock(productoCarro.cantidad, cantidad);
                 this.actualizarPrecioTotal(producto.precio * cantidad);             
               console.log(this.categorias);
              } else {
                checkNumberMayores(producto.stock,cantidad);
                console.log(
                  `Intentando agregar al carrito ${cantidad}  ${this.mensajeCantidad(
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
                producto.stock = actualizarStock(producto.stock,-cantidad);
                this.listaCategoria(producto);
                console.log(this.categorias);         
              }  
            }else{
              console.error("No hay más "+producto.nombre+ " en stock");
            }
            mostrarStock();
            this.mostrarCompra()           
        } catch (error) {
          if(error)
          console.error(error);
          else
          console.error("No se pudo ejecutar la peticion Valores incorrectos.")
          console.log("\n");
        } 
  }

  /* Retorna un string en singular o plurarl según la cantidad. */
  mensajeCantidad(cantidad) {
    return cantidad != 1 ? "unidades de " : "unidad de ";
  }

  /* Verificar la existencia de un producto en el carro */
  existenciaProductoEnCarro(producto) {
    return this.productos.find((item) => item.sku === producto.sku);
  }

  /* Actualiza la cantidades de un producto existente */
  actualizarCantidadDelProducto(productoCarro, cantidad) {
    productoCarro.cantidad += cantidad;
  }

  /* Actualiza el precio total acumulado en el contenido del carrito */
  actualizarPrecioTotal(monto) {
    this.precioTotal =this.precioTotal + monto;  
  }



   /*  Retorna una promesa cuando intentamos mostrar el contenido del carrito de compra */
   mostrarCompra() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.productos.length != 0) {
          resolve(this.mostrarCarroCompra());
        } else {
          reject(`El carrito esta vacio`);
        }
      }, 1000);
    });
  }
  /* Muestra todo lo que tiene el carro de compras */
  mostrarCarroCompra() {
    console.log("Contenido del Carrito de Compra ");
    this.productos.forEach((item) => {
      console.log("Producto " + item.nombre + " Cantidad:" + item.cantidad);
    });
    console.log("El total es: $" + this.precioTotal);
    console.log("\n")
  }

  /* Realizamos la carga de la lista de categorias */
  listaCategoria(producto) {
    console.log("Actualizando la lista de categorias de los productos...")
    if (this.categorias.find((categ) => categ === producto.categoria)) {
    } else {
      this.categorias.push(producto.categoria);
    }
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
  async eliminarProducto( productoCarro, cantidad) {
    console.log("Eliminando Producto...");
    checkNumber(cantidad);
    checkNumberNegativos(cantidad);
        checkNumberMayores(productoCarro.cantidad,cantidad);
       if ( productoCarro.cantidad === cantidad) {
          this.productos = this.productos.filter((prod) => prod.sku !=  productoCarro.sku);
          this.eliminarCategoria();
          } else {  
          actualizarStock( productoCarro, -cantidad);
        }
      try {
        const prod = await findProductBySku(productoCarro.sku);
        actualizarStock(prod, cantidad); 
        this.actualizarPrecioTotal(-(prod.precio * cantidad));
        console.log("Se eliminaron " + productoCarro.cantidad + this.mensajeCantidad(cantidad) + productoCarro.nombre)
        mostrarStock();
        this.mostrarCompra();
      } catch (error) {
        console.error(error)
      }
   }

  /* Retorna una promesa dependiendo según corresponda cuando eliminamos un producto del carro */
  eliminarProductosCarrito(sku, cantidad) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const productoCarro = this.productos.find((item) => item.sku === sku);
        if(productoCarro)
          resolve(this.eliminarProducto( productoCarro, cantidad));
        else
          reject(
            `No existe el código ${sku} del producto que quiere eliminar del carro.`
          );
      }, 2000);
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
      console.log("Buscando si existe el producto en el SUPER...")
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

function actualizarStock(stock, cantidad) {
 return stock += cantidad;
}

function checkNumber(numero){
  let error = new Error();
  error.name = "Mi control de Error"

if(typeof(numero) === 'number'){
  return numero;
}
else{
  error.message = "El valor ingresado \""+ numero + "\""+ " No es un numero."
  throw (console.error(error));
}

}

function checkNumberNegativos(numero){
  let error = new Error();
  error.name = "Mi control de Errores"

if(numero >= 0){
  return numero;
}
else{
  error.message ="El valor ingresado \""+ numero + "\""+ " No es un numero Positivo."
  throw (console.error(error));
}

}

function checkNumberMayores(cantidadExistente, cantidad){
  let error = new Error();
  error.name = "Mi control de Error"

if(cantidadExistente >= cantidad){
  return cantidad;
}
else{
  error.message = "Debe ingresar una cantidad menor o igual a la existente que es "+ cantidadExistente ;
  throw (console.error(error));
}
}

/* Muestra el stock disponible del super*/
function mostrarStock() {
  console.log("Productos en STOCK ");
  productosDelSuper.forEach((item) => {
    console.log(item);

  });
  
}







async function main(){
  const carrito = new Carrito();
  try {
  await carrito.agregarProducto("KS944RUR",3); //jabon
  await  carrito.agregarProducto("XX92LKI", 1); //
  await  carrito.agregarProducto("PV332MJ", 11);
  await  carrito.agregarProducto("KS944RUR", 2); //jabon
  await  carrito.agregarProducto("PV332MJ", 11);
  await  carrito.agregarProducto("PV332MJ", 5);
  
  await carrito.agregarProducto("KS944RUR", 1); //jabon
  await  carrito.agregarProducto("XX92LKI", 1); //
  await carrito.agregarProducto("KS944RUR", "12a"); //jabon
  await  carrito.agregarProducto("WE328J", 1);
  
  await  carrito.agregarProducto("XX92LKI", 1); //
  
  await  carrito.agregarProducto("OL883YE", 1);
  await  carrito.agregarProducto("WE328NJ", 1); //jabon
  await  carrito.agregarProducto("WE328NJ", 1);//jabon

  console.log("\n")
 await carrito
 .eliminarProductosCarrito("WE328NJ", 2) //jabon
 .then()
 .catch((obj) => console.error(obj));
 console.log("\n")
 await carrito
 .eliminarProductosCarrito("XX92LKI", 1) //jabon
 .then()
 .catch((obj) => console.error(obj));
 console.log("\n")
 await carrito
  .eliminarProductosCarrito("WE328NJ", 10) //jabon
  .then((obj) => console.log(obj))
  .catch((obj) => console.error(obj));



  await  carrito.agregarProducto("WE328NJ", 5); //jabon
} catch (error) { 
  console.error(error);


}

}

main();








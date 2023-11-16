
import fs from 'fs'
import { json } from 'stream/consumers'

const JSONPath = './ProductManager.json'

class ProductManager{
    static products = []

    constructor(id, title, description, price, thumbnail, code, stock, path){
        this.id = id
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.path = path
    }

    static async addProduct(title, description, price, thumbnail, code, stock, path) {
      try{
        const dataJSON = await fs.promises.readFile(JSONPath, { encoding: 'utf-8'}, (err, data) => {
            return data
        }) 

        console.log(dataJSON)

        ProductManager.products = JSON.parse(dataJSON)

        let id = ProductManager.products.length + 1
        const idSearch = ProductManager.products.some((products) => {
            return products.id === id
        })

        if(idSearch){
            id +=1
        }

        if (!title || !description || !price || !thumbnail || !code || !stock) {
          console.log("Todos los campos son obligatorios.")
          return
        }
    
        const existingProduct = ProductManager.products.find((ProductManager) => ProductManager.code === code)
        if (existingProduct) {
          console.log(`El producto con el código ${code} ya existe.`)
          return
        }
    
        const newProduct = new ProductManager(id, title, description, price, thumbnail, code, stock, path)
        ProductManager.products.push(newProduct)
        const dataToWrite = JSON.stringify(ProductManager.products, null, 2)
        await fs.promises.writeFile(JSONPath, dataToWrite, 'utf-8')
        console.log(`Producto agregado con ID: ${newProduct.id}`)
      } catch(error){
        console.error(error.message)
      }
      }

    static async getProducts() {
      try{
        const dataJSON = await fs.promises.readFile(JSONPath, { encoding: 'utf-8'}, (err, data) => {
          return data
        }) 
        ProductManager.products = JSON.parse(dataJSON)
        return ProductManager.products
      } catch(error){
        console.error(error.message)
      }
      }

    static async getProductById(id) {
      try{
      const dataJSON = await fs.promises.readFile(JSONPath, { encoding: 'utf-8'}, (err, data) => {
        return data
      })
      ProductManager.products = JSON.parse(dataJSON)
        const product = ProductManager.products.find((ProductManager) => ProductManager.id === id)
        if (product) {
          return product
        } else {
          console.error("Producto no encontrado. ID no válido.")
        }
      } catch(error){
        console.error(error.message)
      }
    }

  static async updateProduct(id, updatedProduct) {
    try{
      const dataJSON = await fs.promises.readFile(JSONPath, { encoding: 'utf-8'}, (err, data) => {
        return data
    })
    ProductManager.products = JSON.parse(dataJSON)

      const productIndex = ProductManager.products.findIndex((product) => product.id === id)
      if (productIndex === -1) {
        console.error("Producto no encontrado. ID no válido.")
        return;
      }

      const existingProduct = ProductManager.products[productIndex];
      const updatingProduct = { ...existingProduct, ...updatedProduct};
      updatedProduct.id = id
      ProductManager.products[productIndex] = updatingProduct

      const dataToWrite = JSON.stringify(ProductManager.products, null, 2)
      await fs.promises.writeFile(JSONPath, dataToWrite, 'utf-8')
    } catch(error){
      console.error(error.message)
    }
  }

  static async deleteProduct(id) {
    try{
    const dataJSON = await fs.promises.readFile(JSONPath, { encoding: 'utf-8'}, (err, data) => {
        return data
    })
    ProductManager.products = JSON.parse(dataJSON)
      const productIndex = ProductManager.products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        console.error("Producto no encontrado. ID no válido.");
        return
      }
  
      ProductManager.products.splice(productIndex, 1);
      console.log(`Producto con ID ${id} ha sido eliminado.`);

      const dataToWrite = JSON.stringify(ProductManager.products, null, 2)
      await fs.promises.writeFile(JSONPath, dataToWrite, 'utf-8')
    } catch(error){
      console.error(error.message)
    }
  }
  }

await ProductManager.addProduct("Lies of P", "A Souls-like videogame", 40, "LiesofP.jpg", 2873, true, '/products/img/LiesOfP.jpg')
await ProductManager.addProduct("Sekiro: Shadow Die Twice", "Souls-like game with katanas", 60, "Sekiro.jpg", 2875, true, '/products/img/Sekiro.jpg')
await ProductManager.addProduct("Shadow of doubt", "A Detective sandbox game", 15, "ShadowOfDobut.jpg", 1168, true, '/products/img/ShadowOfDobut.jpg')
await ProductManager.addProduct("Neon White", "A Parkour game", 20, "NeonWhite.jpg", 1268, true, '/products/img/NeonWhite.jpg')

const allProducts = await ProductManager.getProducts()
console.log(allProducts)

//console.log(ProductManager.products)

const getProductById = await ProductManager.getProductById(2)
console.log(getProductById)

const nonExistentProduct = await ProductManager.getProductById(10)
console.log(nonExistentProduct)


await ProductManager.updateProduct(3, {
  title: "Zelda",
});

console.log(allProducts)


await ProductManager.deleteProduct(4)

console.log(allProducts) 
# Estructura
## Carpeta models
En esta encontramos los modelos que usa el Back-End y que estan connectados directamente a nuesta BD. 
El funcionamiento de cada fichero debe ser: 
- Nombre de fichero: <nombre del componente al que hace referencia (componente, usuario, etc...)>.model.js
- Imports: el mongoose y el Schema
- Se genera una constante con nombre lowerCamelCase con nombre: <NombreComponente>Schema 
- Dentro del Schema se definen las propiedades del documento (nombreUsuario, nombreSuscripcion, etc...)
- Se hace un export del modelo que se genera a partir del Schema: 
~~~
module.exports = mongoose.model(<nombreModelo>, <nombreSchema>, collection=<nombreColeccion>);
~~~

## Carpeta routes
En esta encontramos los endpoints de back-end separados por ficheros (p.e. fichero de usuarios, fichero de suscripciones, etc...).
El funcionamiento del fichero debe ser:
- Imports de express y Router. Aparte importar los modelos necesarios de la carpeta models.
- Para cada petición:
~~~
router.<tipo peticion (get, post, ...)>(<ruta a acceder>, (req, res) => {
  <Bloque de codigo>
 });
~~~

## Carpeta middlewares
En esta encontramos los middlewares que se deben usar antes de atender a una petición de ruta.

## server.js
Entrada principal del back-end. En esta se generan las configuraciones para la conexión a la base de datos, se asocian las rutas correctamente y se inicia el servidor.

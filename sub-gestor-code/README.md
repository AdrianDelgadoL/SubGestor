# Estructura

## Carpeta components

En esta encontramos los componentes globales de la aplicación. Actualmente tenemos el navbar y el AppRoutes. Este último se encarga de gestionar el acceso a los diferentes links de nuestra página, comprovando si el usuario tiene un token existente y si la página está marcada como privada.

## Carpeta config

En esta encontramos la configuración básica de la aplicación. Actualmente solo se encuentra el fichero de rutas de la aplicación, donde se marca el componente, si es privado, y el path al cual hace referencia.
Para definir una ruta lo hacemos de la siguiente forma:
~~~
{
      isPrivate: <true/false>, //En el caso que sea true solo se podrà acceder si el usuario està loggeado
      path:<link que se debe usar>,
      component: <Componente que se tiene que cargar>
},
~~~

## Carpeta context

En esta encontramos los componentes de gestión de autenticación y guardado del toquen en local. Actualmente encontramos el fichero context, que contiene el componente AuthProvider, esencial para que todos los hijos de este puedan acceder a los datos locales y dos funciones (useAuthDispatch y useAuthState) que nos sirven para acceder de forma fácil al contexto (almacenamiento local) desde otros componentes. También encontramos el fichero reducer, encargado de almacenar los datos y llevar un registro del estado actual.

## Carpeta pages

En esta encontramos todos los componentes/páginas de nuestra aplicación separadas por carpetas, como pueden ser las FAQ, el registro, la pantalla principal, etc...

### Ejemplo de página (SignUp)
Estructura principal:
~~~
const SignUp = () => {
    ... 
    return (...)
}

export default SignUp
~~~

Para tener un estado del componente (por ejemplo, los datos de un formulario o los mensajes de error) hacemos lo siguiente:

~~~
const SignUp = () => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [repPassword, setRepPassword] = useState(''); 
  const [emailError, setEmailError] = useState(''); 
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const dispatch = useAuthDispatch()
  ...
}
~~~
Observar que se llama a la función de useAuthDispatch() debido a que mas adelante se modificará el estado del token.


Para definir funciones del componente, por ejemplo comprobar si el estado del formulario es correcto:

~~~
const SignUp = () => {
  ...
  const formValid = () => {
    // Valida que los errores esten vacios
    if (emailError.length > 0 || passwordError > 0) return false
    if (email.length === 0 || password.length === 0 || repPassword.length === 0) return false
    return true
  };
  ...
}
~~~

Para hacer una peticion a Back-End, por ejemplo, registrar el usuario:
~~~
const SignUp = () => {
  ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Comprueba que el formulario es correcto, logea mail y contraseña por consola
    // o muestra error
    if (formValid()) {
      dispatch({ type: 'REQUEST_LOGIN' });
      axios.post('http://localhost:4000/user/create', {email, password, conf_pwd: repPassword})
          .then(response => {
            console.log(response.data)
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
          })
          .catch(function (error){
            dispatch({ type: 'LOGIN_ERROR', error: error.response.data.msg });
            setFormError(error.response.data.msg);
            setEmail("")
            setPassword("")
            setRepPassword("")
          })
    } else {
      setFormError("Invalid form")
    }
  };
  ...
}
~~~
En esta lo que se hace primero de todo es definir la funcion como asíncrona, pasandole el valor e (contiene los datos del formulario) por parámetro.
Dentro comprobamos si el formulario tiene algún error con la función creada anteriormente. En el caso que esté correcto, hacemos un dispatch al contexto marcando que se está haciendo un LogIn/Registro, pasandole el tipo como REQUEST_LOGIN. Una vez hecho el dispatch, se genera una petición POST con AXIOS pasando en el body de esta la información del formulario como un objeto JSON (IMPORTANTE: los nombres de los atributos del objeto deben coincidir con los nombres que recogerá el Back-End al recibir la petición).
En este caso se divide en dos bloques (then y catch): en el then, recibimos la respuesta del back-end dentro del parámetro response si el status de la respuesta está en 2xx. En el caso que así sea, el programa manda un dispatch al contexto indicando que el Registro/Login ha sido un éxito, pasandole en el payload el body de la respuesta (response.data). En el caso que entremos en el bloque de catch, indicará que ha habido un error con el registro (usuario existente, algún error con la contraseña, etc...) y por lo tanto, tendremos que enviar un dispatch al contexto indicando que ha habido un error en el Registro/Login, después se vacia el estado del formulario y se añade en el estado de mensajes de error (formError) el mensaje devuelto por el backend.

Respecto al return de un componente tendremos el bloque "HTLM" que queremos mostrar al cargar el componente por pantalla.
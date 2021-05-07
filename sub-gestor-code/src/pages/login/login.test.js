import React from 'react';
import SignIn from "./signIn.component";
import {AuthProvider} from '../../context/context';
import axios from 'axios';
import { render, fireEvent, waitFor} from "@testing-library/react";
import 'regenerator-runtime/runtime'
import { async } from 'regenerator-runtime/runtime';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

/* Esto nos sirve para borrar un mensaje de Warning que aparece siempre */
const originalError = console.error
beforeAll(() => {

  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})


describe("Funcionamiento lògico del componente", () => { 
  afterEach(() => {
    jest.clearAllMocks();
  })
  it("Envío de formulario vacío", async () => {   
    const history = []

    axios.post.mockResolvedValue([]); 

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <Router>
          <SignIn history={history}/>
        </Router>
      </AuthProvider>
    );
    const errorEsperado = "El formulario contiene errores"
    const submitButton = utils.getByRole('button', {name: "Inicia sesión"});
    fireEvent.click(submitButton);
    expect(axios.post).toHaveBeenCalledTimes(0);
    utils.getByText(errorEsperado);
  });

  it("Usuario especifica un email mal formatado", async () => {   
    const history = []

    axios.post.mockResolvedValue([]); 

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <Router>
          <SignIn history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEsperado = "El formulario contiene errores"
    const errorEmail = "Dirección de email incorrecta"
    const emailInput = utils.getByPlaceholderText('Introduce tu email')
    fireEvent.change(emailInput, { target: { value: 'e' } })
    utils.getByText(errorEmail);
    
    const submitButton = utils.getByRole('button', {name: "Inicia sesión"});
    fireEvent.click(submitButton);
    expect(axios.post).toHaveBeenCalledTimes(0);
    utils.getByText(errorEsperado);
  });

  it("Usuario especifica una contraseña mal formatada", async () => {   
    const history = []

    axios.post.mockResolvedValue([]); 

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <Router>
          <SignIn history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEsperado = "El formulario contiene errores"
    const errorPassword = "La contraseña tiene que contener una mayúscula y 8 o más carácteres"
    const passwordInput = utils.getByPlaceholderText('Introduce tu contraseña')
    fireEvent.change(passwordInput, { target: { value: 'e' } })
    utils.getByText(errorPassword);
    
    const submitButton = utils.getByRole('button', {name: "Inicia sesión"});
    fireEvent.click(submitButton);
    expect(axios.post).toHaveBeenCalledTimes(0);
    utils.getByText(errorEsperado);
  });

  it("Usuario solo especifica un email y envía", async () => {   
    const history = []

    axios.post.mockResolvedValue([]); 

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <Router>
          <SignIn history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEsperado = "El formulario contiene errores"
    const errorEmail = "Dirección de email incorrecta"
    
    const emailInput = utils.getByPlaceholderText('Introduce tu email')
    fireEvent.change(emailInput, { target: { value: 'emilian@email.com' } })
    expect(utils.queryByText(errorEmail)).toBeNull()
    
    const submitButton = utils.getByRole('button', {name: "Inicia sesión"});
    fireEvent.click(submitButton);
    expect(axios.post).toHaveBeenCalledTimes(0);
    utils.getByText(errorEsperado);
  });

  it("Usuario prueba de hacer login con un email inexistente", async () => {   
    const history = []
    const expectedPostBody = { userEmail: 'emilian@email.com', userPassword: '1234Abcd' }
    axios.post.mockImplementation(() => Promise.reject({ status: 400, response: {data: { msg: "No existe un usuario con este correo"} }}));

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <Router>
          <SignIn history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEsperado = "No existe un usuario con este correo"
    const errorEmailNoEsperado = "Dirección de email incorrecta"
    const errorPasswordNoEsperado = "La contraseña tiene que contener una mayúscula y 8 o más carácteres"
    
    const emailInput = utils.getByPlaceholderText('Introduce tu email')
    fireEvent.change(emailInput, { target: { value: 'emilian@email.com' } })
    expect(utils.queryByText(errorEmailNoEsperado)).toBeNull()

    const passwordInput = utils.getByPlaceholderText('Introduce tu contraseña')
    fireEvent.change(passwordInput, { target: { value: '1234Abcd' } })
    expect(utils.queryByText(errorPasswordNoEsperado)).toBeNull()

    const submitButton = utils.getByRole('button', {name: "Inicia sesión"});
    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    utils.getByText(errorEsperado);
    expect(axios.post.mock.calls[0][0]).toBe('http://localhost:4000/user/login');
    expect(axios.post.mock.calls[0][1].userEmail).toBe(expectedPostBody.userEmail);
    expect(axios.post.mock.calls[0][1].userPassword).toBe(expectedPostBody.userPassword);
  });

  it("Usuario hace un login correcto", async () => {   
    const history = []
    const expectedPostBody = { userEmail: 'emilian@email.com', userPassword: '1234Abcd' }
    axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: { token: "675das", user : {email: "emilian@email.com" }} }));

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <Router>
          <SignIn history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEmailNoEsperado = "Dirección de email incorrecta"
    const errorPasswordNoEsperado = "La contraseña tiene que contener una mayúscula y 8 o más carácteres"
    
    const emailInput = utils.getByPlaceholderText('Introduce tu email')
    fireEvent.change(emailInput, { target: { value: 'emilian@email.com' } })
    expect(utils.queryByText(errorEmailNoEsperado)).toBeNull()

    const passwordInput = utils.getByPlaceholderText('Introduce tu contraseña')
    fireEvent.change(passwordInput, { target: { value: '1234Abcd' } })
    expect(utils.queryByText(errorPasswordNoEsperado)).toBeNull()

    const submitButton = utils.getByRole('button', {name: "Inicia sesión"});
    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post.mock.calls[0][0]).toBe('http://localhost:4000/user/login');
    expect(axios.post.mock.calls[0][1].userEmail).toBe(expectedPostBody.userEmail);
    expect(axios.post.mock.calls[0][1].userPassword).toBe(expectedPostBody.userPassword);
    expect(history[0]).toBe("/home");
    expect(localStorage.getItem("token")).toBe("\"675das\"")
  });

})
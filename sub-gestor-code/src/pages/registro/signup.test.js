import React from 'react';
import SignUp from "./signUp.component";
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


describe("Funcionamiento lògico del componente de registro", () => { 
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
          <SignUp history={history}/>
        </Router>
      </AuthProvider>
    );
    const errorEsperado = "El formulario contiene errores"
    const submitButton = utils.getByRole('button', {name: "Crear cuenta"});
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
          <SignUp history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEsperado = "El formulario contiene errores"
    const errorEmail = "Dirección de email incorrecta"
    const emailInput = utils.getByPlaceholderText('Introduce tu email')
    fireEvent.change(emailInput, { target: { value: 'e' } })
    utils.getByText(errorEmail);
    
    const submitButton = utils.getByRole('button', {name: "Crear cuenta"});
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
          <SignUp history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEsperado = "El formulario contiene errores"
    const errorPassword = "La contraseña tiene que contener una mayúscula y 8 o más carácteres"
    const passwordInput = utils.getByPlaceholderText('Introduce tu contraseña')
    fireEvent.change(passwordInput, { target: { value: 'e' } })
    utils.getByText(errorPassword);
    
    const submitButton = utils.getByRole('button', {name: "Crear cuenta"});
    fireEvent.click(submitButton);
    expect(axios.post).toHaveBeenCalledTimes(0);
    utils.getByText(errorEsperado);
  });

  it("Usuario pone dos contraseñas diferentes", async () => {   
    const history = []

    axios.post.mockResolvedValue([]); 

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <Router>
          <SignUp history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEsperado = "El formulario contiene errores"
    const repPasswordError = "Las contraseñas no coinciden"
    
    const passwordInput = utils.getByPlaceholderText('Introduce tu contraseña')
    fireEvent.change(passwordInput, { target: { value: '1234Abcd' } })
    
    const repPasswordInput = utils.getByPlaceholderText('Repite la contraseña')
    fireEvent.change(repPasswordInput, { target: { value: '1234Abcf' } })

    utils.getByText(repPasswordError);
    
    const submitButton = utils.getByRole('button', {name: "Crear cuenta"});
    fireEvent.click(submitButton);
    expect(axios.post).toHaveBeenCalledTimes(0);
    utils.getByText(errorEsperado);
  });

  it("Usuario hace un registro con un mail ya registrado", async () => {   
    const history = []
    const expectedPostBody = { email: 'emilian@email.com', password: '1234Abcd', conf_pwd: '1234Abcd' }
    axios.post.mockImplementation(() => Promise.reject({ status: 400, response: {data: { msg: "Este usuario ya existe"} }}));

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <Router>
          <SignUp history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEsperado = "Este usuario ya existe"
    const errorEmailNoEsperado = "Dirección de email incorrecta"
    const errorPasswordNoEsperado = "La contraseña tiene que contener una mayúscula y 8 o más carácteres"
    const errorRepPasswordNoEsperado = "Las contraseñas no coinciden"
    
    const emailInput = utils.getByPlaceholderText('Introduce tu email')
    fireEvent.change(emailInput, { target: { value: 'emilian@email.com' } })
    expect(utils.queryByText(errorEmailNoEsperado)).toBeNull()

    const passwordInput = utils.getByPlaceholderText('Introduce tu contraseña')
    fireEvent.change(passwordInput, { target: { value: '1234Abcd' } })
    expect(utils.queryByText(errorPasswordNoEsperado)).toBeNull()

    const repPasswordInput = utils.getByPlaceholderText('Repite la contraseña')
    fireEvent.change(repPasswordInput, { target: { value: '1234Abcd' } })
    expect(utils.queryByText(errorRepPasswordNoEsperado)).toBeNull()

    const submitButton = utils.getByRole('button', {name: "Crear cuenta"});
    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    utils.getByText(errorEsperado);
    expect(axios.post.mock.calls[0][0]).toBe('http://localhost:4000/user/create');
    expect(axios.post.mock.calls[0][1].email).toBe(expectedPostBody.email);
    expect(axios.post.mock.calls[0][1].password).toBe(expectedPostBody.password);
    expect(axios.post.mock.calls[0][1].conf_pwd).toBe(expectedPostBody.conf_pwd);
  });

  it("Usuario hace un registro válido", async () => {   
    const history = []
    const expectedPostBody = { email: 'emilian@email.com', password: '1234Abcd', conf_pwd: '1234Abcd' }
    axios.post.mockImplementation(() => Promise.resolve({ status: 200, data: { token: "675das", user : {email: "emilian@email.com" }} }));

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <Router>
          <SignUp history={history}/>
        </Router>
      </AuthProvider>
    );

    const errorEmailNoEsperado = "Dirección de email incorrecta"
    const errorPasswordNoEsperado = "La contraseña tiene que contener una mayúscula y 8 o más carácteres"
    const errorRepPasswordNoEsperado = "Las contraseñas no coinciden"
    
    const emailInput = utils.getByPlaceholderText('Introduce tu email')
    fireEvent.change(emailInput, { target: { value: 'emilian@email.com' } })
    expect(utils.queryByText(errorEmailNoEsperado)).toBeNull()

    const passwordInput = utils.getByPlaceholderText('Introduce tu contraseña')
    fireEvent.change(passwordInput, { target: { value: '1234Abcd' } })
    expect(utils.queryByText(errorPasswordNoEsperado)).toBeNull()

    const repPasswordInput = utils.getByPlaceholderText('Repite la contraseña')
    fireEvent.change(repPasswordInput, { target: { value: '1234Abcd' } })
    expect(utils.queryByText(errorRepPasswordNoEsperado)).toBeNull()

    const submitButton = utils.getByRole('button', {name: "Crear cuenta"});
    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post.mock.calls[0][0]).toBe('http://localhost:4000/user/create');
    expect(axios.post.mock.calls[0][1].email).toBe(expectedPostBody.email);
    expect(axios.post.mock.calls[0][1].password).toBe(expectedPostBody.password);
    expect(axios.post.mock.calls[0][1].conf_pwd).toBe(expectedPostBody.conf_pwd);
    expect(history[0]).toBe("/home");
    expect(localStorage.getItem("token")).toBe("\"675das\"")
  });

})
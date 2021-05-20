import React from 'react';
import {AuthProvider} from '../../context/context';
import axios from 'axios';
import { render, fireEvent, waitFor} from "@testing-library/react";
import 'regenerator-runtime/runtime'
import { BrowserRouter as Router } from 'react-router-dom';
import { async } from 'regenerator-runtime/runtime';
import ChangePw from '../../pages/login/changePW_logeado.js';
require('dotenv').config()
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

const response = {
  data: {}
}

describe("Modificación de contraseña", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

    localStorage.setItem('currentUser', 'test@email.com')
    localStorage.setItem('prefered_currency', 'EUR')
    localStorage.setItem('frequency', 'none')
    localStorage.setItem('token', 'fakeado')

  it('TC_Modificacion_contraseña_1', async() =>{
    const match = {
        params : { 
          }
       }
    axios.put.mockResolvedValue([]);
    axios.put.mockImplementation(() => Promise.reject({ status: 400, data: { msg: "mala contraseña"} }));
    const utils = render(
        <AuthProvider>
          <Router>
            <ChangePw match={match}/>
          </Router>
        </AuthProvider>
      );
    const oldInput = utils.getByPlaceholderText('Contraseña actual');
    fireEvent.change(oldInput, { target: { value: 'hola'}});
    const newInput = utils.getByPlaceholderText('Nueva contraseña');
    fireEvent.change(newInput, { target: { value: 'NovaContra2'}});
    const repitInput = utils.getByPlaceholderText('Repite la contraseña');
    fireEvent.change(repitInput, { target: { value: 'NovaContra2'}});
    const submitButton = utils.getByRole('button', {name: "Aceptar"});
    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(0));
  })
});
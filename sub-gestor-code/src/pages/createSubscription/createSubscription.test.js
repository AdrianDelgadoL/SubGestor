import React from 'react';
import {AuthProvider} from '../../context/context';
import axios from 'axios';
import { render, fireEvent, waitFor} from "@testing-library/react";
import 'regenerator-runtime/runtime'
import { BrowserRouter as Router } from 'react-router-dom';
import { async } from 'regenerator-runtime/runtime';
import CreateSubscription from '../../pages/createSubscription/createSubscription.component.js';
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

describe("Creación de suscripción", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

    localStorage.setItem('currentUser', 'test@email.com')
    localStorage.setItem('prefered_currency', 'EUR')
    localStorage.setItem('frequency', 'none')
    localStorage.setItem('token', 'fakeado')
  
  it('TC_Creacion_1', () =>{
    const match = {
        params : { 
          }
       }
    const utils = render(
        <AuthProvider>
          <Router>
            <CreateSubscription match={match}/>
          </Router>
        </AuthProvider>
      );

    const submitButton = utils.getByRole('button', {name: "Crear suscripción"});
    fireEvent.click(submitButton);
    expect(axios.post).toHaveBeenCalledTimes(0);
  })

  it('TC_Creacion_2', async() =>{
    axios.post.mockResolvedValue([]);
    axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
    const match = {
        params : { 
          }
       }

    const history = [];
    const utils = render(
        <AuthProvider>
          <Router>
            <CreateSubscription match={match} history={history}/>
          </Router>
        </AuthProvider>
      );
    
    const nameInput = utils.getAllByRole('textbox', {name: ""});
    fireEvent.change(nameInput[0], { target: { value: 'modificado'}});
    expect(nameInput[0].value).toBe("modificado");
    const frequencyInput = utils.getAllByRole('combobox', {name: ''});
    fireEvent.change(frequencyInput[0], { target: { value: 'monthly'}})
    fireEvent.change(frequencyInput[1], { target: { value: 'USD'}});
    expect(frequencyInput[0].value).toBe('monthly');
    expect(frequencyInput[1].value).toBe('USD');
    const chargeDateInput = utils.getByLabelText('Fecha del pago:');
    fireEvent.change(chargeDateInput, { target: { value: '2021-06-06'}});
    const priceInput = utils.getByRole('spinbutton', {name: ''}); 
    //si no se añade un label asociado al id del input, no tiene nombre por el cual acceder a el
    fireEvent.change(priceInput, { target: { value: '10'}});

    const submitButton = utils.getByRole('button', {name: "Crear suscripción"});
    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post.mock.calls[0][0]).toBe('http://localhost:4000/subscription');
  })

});
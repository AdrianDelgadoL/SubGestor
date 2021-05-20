import React from 'react';
import {AuthProvider} from '../../context/context';
import axios from 'axios';
import { render, fireEvent, waitFor} from "@testing-library/react";
import {toBeDisabled} from "@testing-library/jest-dom"
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

  it('TC_Creacion_2', () =>{
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

    const nameInput = utils.getAllByRole('textbox', {name: ""});
    fireEvent.change(nameInput[0], { target: { value: 'modificado'}});
    expect(nameInput[0].value).toBe("modificado");
    const frequencyInput = utils.getAllByRole('combobox', {name: ''});
    fireEvent.change(frequencyInput[0], { target: { value: 'monthly'}})
    fireEvent.change(frequencyInput[1], { target: { value: 'USD'}});
    expect(frequencyInput[0].value).toBe('monthly');
    expect(frequencyInput[1].value).toBe('USD');
    const priceInput = utils.getByRole('spinbutton', {name: ''}); 
    fireEvent.change(priceInput, { target: { value: '10'}});
    //se deja por poner la fecha

    const submitButton = utils.getByRole('button', {name: "Crear suscripción"});
    fireEvent.click(submitButton);
    expect(axios.post).toHaveBeenCalledTimes(0);
  })

  it('TC_Creacion_3', async() =>{
    const expectedPostBody = { 
        name: 'modificado', 
        frequency: 'monthly', 
        divisa: 'USD', 
        charge_date: '2021-06-06',
        price: '10',
      };
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
    expect(axios.put.mock.calls[0][1].get("name")).toBe(expectedPostBody.name);
    expect(axios.put.mock.calls[0][1].get("frequency")).toBe(expectedPostBody.frequency);
    expect(axios.put.mock.calls[0][1].get("currency")).toBe(expectedPostBody.divisa);
    expect(axios.put.mock.calls[0][1].get("charge_date")).toBe(expectedPostBody.charge_date);
    expect(axios.put.mock.calls[0][1].get("price")).toBe(expectedPostBody.price);
  })

  it('TC_Creacion_4', async() =>{
    axios.post.mockResolvedValue([]);
    axios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
    
    const expectedPostBody = { 
        name: 'modificado', 
        frequency: 'monthly', 
        divisa: 'USD', 
        charge_date: '2021-06-06',
        price: '10',
        img_src: '/images/amazon.png',
        start_date: '2021-05-05',
        url: 'www.test.com',
        tags: 'tag1',
        description: 'testing'
      };
    
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
    fireEvent.change(nameInput[1], { target: { value: 'www.test.com'}});
    fireEvent.change(nameInput[2], { target: { value: 'testing'}});
    fireEvent.change(nameInput[3], { target: { value: 'tag1'}});
    const imgInput = utils.getByAltText('Imagen');
    fireEvent.change(imgInput, { target: { src: '/amazon.png'}});

    const submitButton = utils.getByRole('button', {name: "Crear suscripción"});
    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post.mock.calls[0][0]).toBe('http://localhost:4000/subscription');
    expect(axios.put.mock.calls[0][1].get("name")).toBe(expectedPostBody.name);
    expect(axios.put.mock.calls[0][1].get("frequency")).toBe(expectedPostBody.frequency);
    expect(axios.put.mock.calls[0][1].get("currency")).toBe(expectedPostBody.divisa);
    expect(axios.put.mock.calls[0][1].get("charge_date")).toBe(expectedPostBody.charge_date);
    expect(axios.put.mock.calls[0][1].get("price")).toBe(expectedPostBody.price);
    expect(axios.put.mock.calls[0][1].get("image")).toBe(expectedPostBody.img_src);
    expect(axios.put.mock.calls[0][1].get("start_date")).toBe(expectedPostBody.start_date);
    expect(axios.put.mock.calls[0][1].get("url")).toBe(expectedPostBody.url);
    expect(axios.put.mock.calls[0][1].get("tags")).toBe(expectedPostBody.tags);
    expect(axios.put.mock.calls[0][1].get("description")).toBe(expectedPostBody.description);

  })

  it('TC_Creacion_5', async() =>{
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

    const checkboxInput = utils.getAllByRole('checkbox', {name: ''}); 
    await waitFor(() => fireEvent.click(checkboxInput[0]));
    expect(checkboxInput[0].value).toBe("true");
    const frequencyInput = utils.getAllByRole('combobox', {name: ''});
    const priceInput = utils.getByRole('spinbutton', {name: ''}); 
    const chargeDateInput = utils.getByLabelText('Fecha del pago:');
    expect(chargeDateInput).toBeDisabled();
    expect(priceInput).toBeDisabled();
    expect(frequencyInput[1]).toBeDisabled();
    expect(frequencyInput[0]).toBeDisabled();

  });

  it('TC_Creacion_6', async() =>{
    const match = {
        params : { 
            id: 4
          }
       }
    
    const response = { 
        data: {
            name: 'modificado', 
            frequency: 'monthly', 
            divisa: 'USD', 
            url: 'www.test.com',
            price: '10',
            img_src: '/amazon.png'
        }
      };
    const history = [];
    const utils = render(
        <AuthProvider>
          <Router>
            <CreateSubscription match={match} history={history}/>
          </Router>
        </AuthProvider>
      );
      axios.get.mockResolvedValue(response);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const nameInput = utils.getAllByRole('textbox', {name: ""});
    expect(nameInput[0].value).toBe("modificado");
    const frequencyInput = utils.getAllByRole('combobox', {name: ''});
    expect(frequencyInput[0].value).toBe("monthly");
    expect(nameInput[1].value).toBe('www.test.com');
    const priceInput = utils.getByRole('spinbutton', {name: ''});
    expect(priceInput.value).toBe("10");
  });
});
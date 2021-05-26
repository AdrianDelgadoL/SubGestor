import React from 'react';
import {AuthProvider} from '../../context/context';
import axios from 'axios';
import { render, fireEvent, waitFor} from "@testing-library/react";
import 'regenerator-runtime/runtime'
import { BrowserRouter as Router } from 'react-router-dom';
import { async } from 'regenerator-runtime/runtime';
import SubCanceladas from '../../pages/subscriptions/subcanceladas.component.js';
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
    name: 'netflix',
    active: false,
    free_trial: false,
    free_trial_end: '',
    start_date: '2021-05-05T22:00:00.000Z',
    end: false,
    end_date: '',
    currency: 'EUR',
    frequency: 'onetime',
    url: 'www.test.es/desuscribir',
    charge_date: '2021-06-05T22:00:00.000Z',
    price: '9.75',
    description: 'testing',
    img_src: 'amazon.png',
    tags: ['tag1', 'tag2'],
    user_id: '1'
}

const response2 = {
  name: 'prova',
  active: false,
  free_trial: false,
  free_trial_end: null,
  start_date: null,
  end: false,
  end_date: null,
  currency: 'USD',
  frequency: 'monthly',
  url: '',
  charge_date: '2021-06-05T22:00:00.000Z',
  price: '14.75',
  description: '',
  img_src: 'disney.png',
  tags: '',
  user_id: '2'
}

describe("Modificación de contraseña", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

    localStorage.setItem('currentUser', 'test@email.com')
    localStorage.setItem('prefered_currency', 'EUR')
    localStorage.setItem('frequency', 'none')
    localStorage.setItem('token', 'fakeado')

    it('TC_Suscripciones_canceladas_1', async() =>{ 
        const match = {
            params : { 
                id: 1
              }
           }
        const history = [];

        //axios.get.mockResolvedValue(response); 
        axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response] })); //La respuesta ha de ser un array

        const utils = render(
            <AuthProvider>
              <Router>
                <SubCanceladas history={history} match={match}/>
              </Router>
            </AuthProvider>
          );
        
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
        const nameInput = utils.getByRole('img', {name: ""});
        expect(nameInput.src).toBe('http://localhost/images/amazon.png');
    });

    it('TC_Suscripciones_canceladas_2', async() =>{ 
      const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.reject({ status: 404, response: {data: {msg: 'error'}}}));

    const utils = render(
        <AuthProvider>
          <Router>
            <SubCanceladas history={history} match={match}/>
          </Router>
        </AuthProvider>
      );
    const expectedError = 'Parece que aún no existe ninguna suscripción cancelada';

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(utils.queryByText(expectedError));

    })

    it('TC_Busqueda_suscripciones_canceladas_1', async() =>{ 
      const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response, response2] })); //La respuesta ha de ser un array

    const utils = render(
        <AuthProvider>
          <Router>
            <SubCanceladas history={history} match={match}/>
          </Router>
        </AuthProvider>
      );
    const expectedError = 'No existe ninguna suscripción cancelada asociada a: "fallo"';
    
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const searchInput = utils.getByPlaceholderText('Buscar suscripciones canceladas por nombre o tag...');
    fireEvent.change(searchInput, { target: { value: 'fallo' } })
    expect(utils.queryByText(expectedError));
    })

    it('TC_Busqueda_suscripciones_canceladas_2', async() =>{ 
      const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response, response2] })); //La respuesta ha de ser un array

    const utils = render(
        <AuthProvider>
          <Router>
            <SubCanceladas history={history} match={match}/>
          </Router>
        </AuthProvider>
      );
    
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const searchInput = utils.getByPlaceholderText('Buscar suscripciones canceladas por nombre o tag...');
    fireEvent.change(searchInput, { target: { value: 'prova' } })
    const nameInput = utils.getByRole('img', {name: ""});
    expect(nameInput.src).toBe('http://localhost/images/disney.png');
    })

    it('TC_Busqueda_suscripciones_canceladas_3', async() =>{ 
      const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response, response2] })); //La respuesta ha de ser un array

    const utils = render(
        <AuthProvider>
          <Router>
            <SubCanceladas history={history} match={match}/>
          </Router>
        </AuthProvider>
      );
    
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const searchInput = utils.getByPlaceholderText('Buscar suscripciones canceladas por nombre o tag...');
    fireEvent.change(searchInput, { target: { value: 'pro' } })
    const nameInput = utils.getByRole('img', {name: ""});
    expect(nameInput.src).toBe('http://localhost/images/disney.png');
    })

    it('TC_Busqueda_suscripciones_canceladas_4', async() =>{ 
      const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response, response2] })); //La respuesta ha de ser un array

    const utils = render(
        <AuthProvider>
          <Router>
            <SubCanceladas history={history} match={match}/>
          </Router>
        </AuthProvider>
      );
    
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const searchInput = utils.getByPlaceholderText('Buscar suscripciones canceladas por nombre o tag...');
    fireEvent.change(searchInput, { target: { value: 'tag1' } })
    const nameInput = utils.getByRole('img', {name: ""});
    expect(nameInput.src).toBe('http://localhost/images/amazon.png');
    })

    it('TC_Busqueda_suscripciones_canceladas_5', async() =>{ 
      const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response, response2] })); //La respuesta ha de ser un array

    const utils = render(
        <AuthProvider>
          <Router>
            <SubCanceladas history={history} match={match}/>
          </Router>
        </AuthProvider>
      );
    
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const searchInput = utils.getByPlaceholderText('Buscar suscripciones canceladas por nombre o tag...');
    fireEvent.change(searchInput, { target: { value: 'a' } })
    const nameInput = utils.getAllByRole('img', {name: ""});
    expect(nameInput[0].src).toBe('http://localhost/images/amazon.png');
    expect(nameInput[1].src).toBe('http://localhost/images/disney.png');
    })

});
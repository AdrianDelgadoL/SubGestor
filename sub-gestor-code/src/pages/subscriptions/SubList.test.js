import React from 'react';
import {AuthProvider} from '../../context/context';
import axios from 'axios';
import { render, fireEvent, waitFor} from "@testing-library/react";
import 'regenerator-runtime/runtime'
import { BrowserRouter as Router } from 'react-router-dom';
import { async } from 'regenerator-runtime/runtime';
import SubList from '../../pages/subscriptions/SubList.components';
import '@testing-library/jest-dom/extend-expect'
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
    url: '',
    charge_date: '2021-05-27T22:00:00.000Z',
    price: '5',
    description: 'testing',
    img_src: 'netflix.png',
    tags: ['tag1', 'tag2'],
    user_id: '1'
}

const response2 = {
  name: 'amazon',
  active: false,
  free_trial: false,
  free_trial_end: null,
  start_date: null,
  end: false,
  end_date: null,
  currency: 'USD',
  frequency: 'monthly',
  url: '',
  charge_date: '2021-06-22T22:00:00.000Z',
  price: '6',
  description: '',
  img_src: 'amazon.png',
  tags: '',
  user_id: '2'
}

const response3 = {
  name: 'test',
  active: false,
  free_trial: false,
  free_trial_end: null,
  start_date: null,
  end: false,
  end_date: null,
  currency: 'EUR',
  frequency: 'monthly',
  url: 'www.google.es',
  charge_date: '2021-06-22T22:00:00.000Z',
  price: '15.55',
  description: '',
  img_src: 'amazon.png',
  tags: '',
  user_id: '2'
}

const response4 = {
  name: 'test',
  active: false,
  free_trial: false,
  free_trial_end: null,
  start_date: null,
  end: false,
  end_date: null,
  currency: 'USD',
  frequency: 'monthly',
  url: 'www.google.es',
  charge_date: '2021-06-22T22:00:00.000Z',
  price: '15.55',
  description: '',
  img_src: 'amazon.png',
  tags: '',
  user_id: '2'
}


localStorage.setItem('currentUser', 'test@email.com')
localStorage.setItem('prefered_currency', 'EUR')
localStorage.setItem('frequency', 'monthly')
localStorage.setItem('token', 'fakeado')

describe("Lista de suscripciones", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('TC_Listado_1', async() =>{ 
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
            <SubList history={history} match={match}/>
          </Router>
        </AuthProvider>
      );
    const expectedError = 'Parece que aún no existe ninguna suscripción';

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(utils.queryByText(expectedError));
  });

  it('TC_Listado_2', async() =>{ 
    const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.reject({ status: 401, response: {data: {msg: 'error'}}}));

    const utils = render(
        <AuthProvider>
          <Router>
            <SubList history={history} match={match}/>
          </Router>
        </AuthProvider>
      );
    const expectedError = 'Parece que aún no existe ninguna suscripción';

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(utils.queryByText(expectedError));
  });  

  it('TC_Listado_3', async() =>{ 
    const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response, response2]}));

    const utils = render(
        <AuthProvider>
          <Router>
            <SubList history={history} match={match}/>
          </Router>
        </AuthProvider>
      );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const listInput = utils.getAllByRole('img', {name: ""});
    expect(listInput[0].src).toBe('http://localhost/images/netflix.png');
    expect(listInput[1].src).toBe('http://localhost/images/amazon.png');
  }); 

  it('TC_Suscripcion_1', async() =>{ 
    const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response3]}));

    const utils = render(
        <AuthProvider>
          <Router>
            <SubList history={history} match={match}/>
          </Router>
        </AuthProvider>
      );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const linkInput = utils.getByRole('link', {name: "Cancelar suscripción"});
    expect(linkInput.href).toBe('http://localhost/www.google.es');
  }); 

  it('TC_Suscripcion_2', async() =>{ 
    const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response]}));

    const utils = render(
        <AuthProvider>
          <Router>
            <SubList history={history} match={match}/>
          </Router>
        </AuthProvider>
      );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(utils.queryByRole('link', {name: "Cancelar suscripción"})).toBeNull();
  }); 

  it('TC_Suscripcion_3', async() =>{ 
    const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response3]}));

    const utils = render(
        <AuthProvider>
          <Router>
            <SubList history={history} match={match}/>
          </Router>
        </AuthProvider>
      );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const currencyInput = utils.getByText('15.55 €/mes');
    expect(currencyInput).toHaveTextContent('15.55 €/mes');
  }); 

  it('TC_Suscripcion_4', async() =>{ 
    const match = {
        params : { 
            id: 1
          }
       }
    const history = [];

    //axios.get.mockResolvedValue(response); 
    axios.get.mockImplementation(() => Promise.resolve({ status: 200, data: [response4]}));

    const utils = render(
        <AuthProvider>
          <Router>
            <SubList history={history} match={match}/>
          </Router>
        </AuthProvider>
      );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(utils.getByText('15.55 $/mes'));
  }); 

  it('TC_Busqueda_suscripciones_1', async() =>{ 
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
          <SubList history={history} match={match}/>
        </Router>
      </AuthProvider>
    );
  const expectedError = 'No existe ninguna suscripción activa asociada a: "fallo"';

  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  const searchInput = utils.getByPlaceholderText('Buscar suscripciones activas por nombre o tag...');
  fireEvent.change(searchInput, { target: { value: 'fallo' } })
  expect(utils.queryByText(expectedError));
  })

  it('TC_Busqueda_suscripciones_2', async() =>{ 
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
          <SubList history={history} match={match}/>
        </Router>
      </AuthProvider>
    );

  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  const searchInput = utils.getByPlaceholderText('Buscar suscripciones activas por nombre o tag...');
  fireEvent.change(searchInput, { target: { value: 'netflix' } })
  const nameInput = utils.getByRole('img', {name: ""});
  expect(nameInput.src).toBe('http://localhost/images/netflix.png');
  })

  it('TC_Busqueda_suscripciones_3', async() =>{ 
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
          <SubList history={history} match={match}/>
        </Router>
      </AuthProvider>
    );

  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  const searchInput = utils.getByPlaceholderText('Buscar suscripciones activas por nombre o tag...');
  fireEvent.change(searchInput, { target: { value: 'ne' } })
  const nameInput = utils.getByRole('img', {name: ""});
  expect(nameInput.src).toBe('http://localhost/images/netflix.png');
  })

  it('TC_Busqueda_suscripciones_4', async() =>{ 
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
          <SubList history={history} match={match}/>
        </Router>
      </AuthProvider>
    );

  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  const searchInput = utils.getByPlaceholderText('Buscar suscripciones activas por nombre o tag...');
  fireEvent.change(searchInput, { target: { value: 'tag1' } })
  const nameInput = utils.getByRole('img', {name: ""});
  expect(nameInput.src).toBe('http://localhost/images/netflix.png');
  })

  it('TC_Busqueda_suscripciones_5', async() =>{ 
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
          <SubList history={history} match={match}/>
        </Router>
      </AuthProvider>
    );

  await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  const searchInput = utils.getByPlaceholderText('Buscar suscripciones activas por nombre o tag...');
  fireEvent.change(searchInput, { target: { value: 'n' } })
  const nameInput = utils.getAllByRole('img', {name: ""});
  expect(nameInput[0].src).toBe('http://localhost/images/netflix.png');
  expect(nameInput[1].src).toBe('http://localhost/images/amazon.png');
  })
});
import React from 'react';
import SubDetail from "../../pages/subDetails/subDetail.component.js";
import {AuthProvider} from '../../context/context';
import axios from 'axios';
import { render, fireEvent, waitFor} from "@testing-library/react";
import 'regenerator-runtime/runtime'
import { async } from 'regenerator-runtime/runtime';

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
  data: {
    name: 'netflix',
    active: true,
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
}

const response2 = {
  data: {
    name: 'prova',
    active: true,
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
    img_src: '',
    tags: '',
    user_id: '2'
  }
}

const response4 = {
  data: {
    name: 'freetrial',
    active: true,
    free_trial: true,
    free_trial_end: '2021-06-05T22:00:00.000Z',
    start_date: '2021-05-05T22:00:00.000Z',
    end: false,
    end_date: '',
    currency: 'EUR',
    frequency: 'monthly',
    url: '',
    charge_date: '',
    price: '9.75',
    description: '',
    img_src: '',
    tags: '',
    user_id: '4'
  }
}

const response5 = {
  data: {
    name: 'hasEnd',
    active: true,
    free_trial: false,
    free_trial_end: '',
    start_date: '2021-05-05T22:00:00.000Z',
    end: true,
    end_date: '2021-06-05T22:00:00.000Z',
    currency: 'EUR',
    frequency: 'monthly',
    url: '',
    charge_date: '',
    price: '9.75',
    description: '',
    img_src: '',
    tags: '',
    user_id: '5'
  }
}


describe("Detalle de componentes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

  it("Carga detalle con mock", async () => {
    /* Informacion que se le pasa al componente, en este caso el match para poder cojer el id de la URL y el history para poder hacer push*/
    const match = {
      params : { 
          id : 1 //any id you want to set
        }
     }
    const history = []

    /* Generación de los Mocks, en el primero se pone la response del get, en el segundo se le pasa la información del delete
    El formato puede ser qualquier de los dos tipos, es decir conn el mockResolvedValue (para el reject mirar como se hace) o con Promise */
    axios.get.mockResolvedValue(response); 
    axios.delete.mockImplementation(() => Promise.resolve({ status: 200, data: { msg: "todo ok"} }));

    /* Renderizado del componente, si necesitan acceder al token o al dispatch se encapsula con el componente AuthProvider */
    const utils = render(
      <AuthProvider>
        <SubDetail match={match} history={history}/>
      </AuthProvider>
    );

    /* Esperar a que el get devuelva los datos, esto es necesario porque puede tardar un poco y que los datos aun no esten puestos */
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));

    /* Aqui ya vendria mas el testing, por ejemplo cojer el innput del nombre y validar que tiene el valor que deberia tener, en este caso pasado por axios */
    const nameInput = utils.getByRole('textbox', {name: ""}); // Por alguna razon el input de name no tiene nombre
    expect(nameInput.value).toBe("netflix");
    // En este caso se comprueba la descripción

    const descriptionInput = utils.getByLabelText("Descripción:");
    expect(descriptionInput.value).toBe("testing");    

    /* Tambien podemos interactuar con el fireEvent para modificar la página como si fuesemos el usuario, en este caso se le dara al boton de eliminar suscripcion */
    const cancelInput = utils.getByRole('button', {name: "Eliminar suscripción"});
    fireEvent.click(cancelInput);
    
    /* Por último validamos si se ha llamado el delete de axios y si la URL de envio es la correcta */
    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete.mock.calls[0][0]).toBe('http://localhost:4000/subscription/1');

  });

  it("TC_Detalle_1", async () =>{
    const match = {
      params : { 
          id : 2 //any id you want to set
        }
     }
    const history = []

    axios.get.mockResolvedValue(response2); 

    const utils = render(
      <AuthProvider>
        <SubDetail match={match} history={history}/>
      </AuthProvider>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const nameInput = utils.getByRole('textbox', {name: ""}); // Por alguna razon el input de name no tiene nombre
    expect(nameInput.value).toBe("prova");
    const frequencyInput = utils.getByRole('combobox', {name: 'Frecuencia:'});
    expect(frequencyInput.value).toBe('monthly');
    const divisaInput = utils.getByRole('combobox', {name: 'Divisa:'});
    expect(divisaInput.value).toBe('USD');
    const chargeDateInput = utils.getByLabelText('Fecha de pago: (mm/dd/yyyy)');
    expect(chargeDateInput.value).toBe('2021-06-05');
    const priceInput = utils.getByRole('spinbutton', {name: 'Precio:'});
    expect(priceInput.value).toBe('14.75');
  });

  it("TC_Detalle_2", async () =>{
    const match = {
      params : { 
          id : 1 //any id you want to set
        }
     }
    const history = []

    axios.get.mockResolvedValue(response);
    const utils = render(
      <AuthProvider>
        <SubDetail match={match} history={history}/>
      </AuthProvider>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const nameInput = utils.getByRole('textbox', {name: ""}); // Por alguna razon el input de name no tiene nombre
    expect(nameInput.value).toBe("netflix");
    const frequencyInput = utils.getByRole('combobox', {name: 'Frecuencia:'});
    expect(frequencyInput.value).toBe('onetime');
    const divisaInput = utils.getByRole('combobox', {name: 'Divisa:'});
    expect(divisaInput.value).toBe('EUR');
    const chargeDateInput = utils.getByLabelText('Fecha de pago: (mm/dd/yyyy)');
    expect(chargeDateInput.value).toBe('2021-06-05');
    const priceInput = utils.getByRole('spinbutton', {name: 'Precio:'});
    expect(priceInput.value).toBe('9.75');
    const imgInput = utils.getByAltText(/imagen aleatoria/i);
    expect(imgInput.src).toBe('http://localhost/images/amazon.png');
    const startDateInput = utils.getByLabelText('Fecha de inicio:');
    expect(startDateInput.value).toBe('2021-05-05');
    const urlInput = utils.getByRole('textbox', {name: 'URL para desuscribirse:'});
    expect(urlInput.value).toBe('www.test.es/desuscribir');
    const tagInput = utils.getByRole('textbox', {name: 'Tags (separados por una coma):'});
    expect(tagInput.value).toBe('tag1,tag2');
    const descriptionInput = utils.getByRole('textbox', {name: 'Descripción:'});
    expect(descriptionInput.value).toBe('testing');
  });
  //TODO
  it("TC_Detalle_3", async () => {

  });

  it("TC_Detalle_4", async () => {
    const match = {
      params : { 
          id : 4 //any id you want to set
        }
     }
    const history = []

    axios.get.mockResolvedValue(response4);
    const utils = render(
      <AuthProvider>
        <SubDetail match={match} history={history}/>
      </AuthProvider>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const nameInput = utils.getByRole('textbox', {name: ""}); // Por alguna razon el input de name no tiene nombre
    expect(nameInput.value).toBe("freetrial");
    const freeTrialInput = utils.getByRole('checkbox', {name: 'Periodo de prueba'});
    expect(freeTrialInput.checked).toBe(true);
    const hasEndInput = utils.getByRole('checkbox', {name: 'Fecha de finalización'});
    expect(hasEndInput.checked).toBe(false);
    const startDateInput = utils.getByLabelText('Fecha de vencimiento:');
    expect(startDateInput.value).toBe('2021-06-05');
  });

  it("TC_Detalle_5", async() => {
    const match = {
      params : { 
          id : 5 //any id you want to set
        }
     }
    const history = []

    axios.get.mockResolvedValue(response5);
    const utils = render(
      <AuthProvider>
        <SubDetail match={match} history={history}/>
      </AuthProvider>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const nameInput = utils.getByRole('textbox', {name: ""}); // Por alguna razon el input de name no tiene nombre
    expect(nameInput.value).toBe("hasEnd");
    const hasEndInput = utils.getByRole('checkbox', {name: 'Fecha de finalización'});
    expect(hasEndInput.checked).toBe(true);
    const startDateInput = utils.getByLabelText('Fecha de finalización:');
    expect(startDateInput.value).toBe('2021-06-05');
  });
})

describe("Modificacion de suscripcion", () =>{
  afterEach(() => {
    jest.clearAllMocks();
  })

  it("TC_Modificacion_suscripcion_1", async() =>{
    const match = {
      params : { 
          id : 1 //any id you want to set
        }
     }
    const history = []
  
  const expectedPostBody = { name: 'modificado', frequency: 'monthly', divisa: 'USD', charge_date: '2021-06-06', price: '10'};
  axios.put.mockResolvedValue([]);
  axios.put.mockImplementation(() => Promise.resolve({ status: 200, data: {msg: 'Suscripción modificada'} }));

  axios.get.mockResolvedValue(response);
    const utils = render(
      <AuthProvider>
        <SubDetail match={match} history={history}/>
      </AuthProvider>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    
    const nameInput = utils.getByRole('textbox', {name: ""});
    fireEvent.change(nameInput, { target: { value: 'modificado'}});
    expect(nameInput.value).toBe("modificado");
    const frequencyInput = utils.getByRole('combobox', {name: 'Frecuencia:'});
    fireEvent.change(frequencyInput, { target: { value: 'monthly'}})
    const divisaInput = utils.getByRole('combobox', {name: 'Divisa:'});
    fireEvent.change(divisaInput, { target: { value: 'USD'}});
    const chargeDateInput = utils.getByLabelText('Fecha de pago: (mm/dd/yyyy)');
    fireEvent.change(chargeDateInput, { target: { value: '2021-06-06'}});
    const priceInput = utils.getByRole('spinbutton', {name: 'Precio:'});
    fireEvent.change(priceInput, { target: { value: '10'}});

    const submitInput = utils.getByRole('button', {name: "Guardar cambios"});
    fireEvent.click(submitInput);
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    expect(axios.put.mock.calls[0][0]).toBe('http://localhost:4000/subscription/1');
    console.log(axios.put.mock.calls[0]);
    expect(axios.put.mock.calls[0][1].name).toBe(expectedPostBody.name);
    expect(axios.put.mock.calls[0][1].frequency).toBe(expectedPostBody.frequency);
    expect(axios.put.mock.calls[0][1].currency).toBe(expectedPostBody.divisa);
    expect(axios.put.mock.calls[0][1].charge_date).toBe(expectedPostBody.charge_date);
    expect(axios.put.mock.calls[0][1].price).toBe(expectedPostBody.price);
  });
})
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


describe("Detalle de componentes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    const response = {
      data: {
        name: 'netflix',
        active: true,
        free_trial: false,
        free_trial_end: '2021-06-05T22:00:00.000Z',
        start_date: '2021-06-05T22:00:00.000Z',
        end: false,
        end_date: '2021-06-05T22:00:00.000Z',
        currency: 'EUR',
        frequency: 'mensual',
        url: 'www.google.es',
        charge_date: '2021-06-05T22:00:00.000Z',
        price: '9.75',
        description: 'testing',
        img_src: '',
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
        frequency: 'mensual',
        url: '',
        charge_date: '2021-06-05T22:00:00.000Z',
        price: '14.75',
        description: '',
        img_src: '',
        tags: '',
        user_id: '2'
      }
    }

  
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

  it("Mostrar suscripción básica", async () =>{
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
  });
})
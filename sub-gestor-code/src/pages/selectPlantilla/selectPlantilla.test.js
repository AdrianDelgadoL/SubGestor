import React from 'react';
import SelectPlantilla from "../../pages/selectPlantilla/selectPlantilla.component.js";
import {AuthProvider} from '../../context/context';
import axios from 'axios';
import { render, fireEvent, waitFor} from "@testing-library/react";
import 'regenerator-runtime/runtime'
import { BrowserRouter as Router } from 'react-router-dom';
import { async } from 'regenerator-runtime/runtime';
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
  data: [
    {
      _id: '000',
      img_src: 'netflix.png'
    },
    {
      _id: '001',
      img_src: 'amazon.png'
    },
    {
      _id: '002',
      img_src: 'spotify.png'
    }
  ]
}

describe("Seleccion de plantilla", () => {
  afterEach(() => {
    jest.clearAllMocks();
})
  it("TC_Seleccion_plantilla_1", async () => {
    axios.get.mockResolvedValue(response);

    const utils = render(
      <AuthProvider>
        <Router>
          <SelectPlantilla />
        </Router>
      </AuthProvider>
    );    
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const plantillasInput = utils.getAllByRole('img', {name: ""});
    expect(plantillasInput[0].src).toBe("http://localhost/images/netflix.png");    
    expect(plantillasInput[1].src).toBe("http://localhost/images/amazon.png");
    expect(plantillasInput[2].src).toBe("http://localhost/images/spotify.png");
  });

  it("TC_Seleccion_plantilla_2", async () => {
    axios.get.mockResolvedValue(response);

    const utils = render(
      <AuthProvider>
        <Router>
          <SelectPlantilla />
        </Router>
      </AuthProvider>
    );    
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    const plantillasInput = utils.getAllByRole('link', {name: ""});
    expect(plantillasInput[0].href).toBe("http://localhost/createSub/000");    
    expect(plantillasInput[1].href).toBe("http://localhost/createSub/001");
    expect(plantillasInput[2].href).toBe("http://localhost/createSub/002");
  });
});
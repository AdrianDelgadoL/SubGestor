import React from 'react';
import Perfil from "../../pages/modPerfil/modPerfil.component.js";
import {AuthProvider, useAuthState} from '../../context/context';
import axios from 'axios';
import { render, fireEvent, waitFor} from "@testing-library/react";
import 'regenerator-runtime/runtime'
import { BrowserRouter as Router } from 'react-router-dom';
require('dotenv').config()

jest.mock('axios');

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

describe("Modificación del perfil", () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    localStorage.setItem('currentUser', 'test@email.com')
    localStorage.setItem('prefered_currency', 'EUR')
    localStorage.setItem('frequency', 'none')
    localStorage.setItem('token', 'fakeado')
    
    it("TC_Modificacion_perfil_1", async () => {
        const utils = render(
            <AuthProvider>
                <Router>
                    <Perfil />
                </Router>
            </AuthProvider>
          );
        
        const input = utils.getAllByRole('combobox', {name: ""}); //la currency y la frequencia no tienen nombre
        expect(input[0].value).toBe("EUR");
        expect(input[1].value).toBe("none");
    })
    it("TC_Modificacion_perfil_2", async () => {
        const utils = render(
            <AuthProvider>
                <Router>
                    <Perfil />
                </Router>
            </AuthProvider>
          );
        
        const input = utils.getAllByRole('combobox', {name: ""}); //la currency y la frequencia no tienen nombre
        fireEvent.change(input[0], { target: { value: 'USD'}});
        expect(input[0].value).toBe("USD");
        fireEvent.change(input[1], { target: { value: 'monthly'}});
        expect(input[1].value).toBe("monthly");
    })

    it("TC_Modificacion_perfil_3", async () => {
        axios.put.mockResolvedValue([]);
        const utils = render(
            <AuthProvider>
                <Router>
                    <Perfil />
                </Router>
            </AuthProvider>
          );
        
        const input = utils.getAllByRole('combobox', {name: ""}); //la currency y la frequencia no tienen nombre
        fireEvent.change(input[0], { target: { value: 'USD'}});
        fireEvent.change(input[1], { target: { value: 'monthly'}});
        const submitButton = utils.getByRole('button', {name: "Modificar perfil"});
        fireEvent.click(submitButton);
        await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
        console.log(axios.put.mock.calls[0][1])
        expect(axios.put.mock.calls[0][0]).toBe('https://localhost:4000/user/configuration');
        expect(axios.put.mock.calls[0][1].frequency).toBe('monthly');
        expect(axios.put.mock.calls[0][1].prefered_currency).toBe('USD');
    })

    it("TC_Modificacion_perfil_4", async () => {
        axios.delete.mockResolvedValue([]);
        const utils = render(
            <AuthProvider>
                <Router>
                    <Perfil />
                </Router>
            </AuthProvider>
          );
        
        const deleteButton = utils.getByRole('button', {name: "Eliminar perfil"});
        fireEvent.click(deleteButton);
        expect(axios.delete).toHaveBeenCalledTimes(1);
    })
});
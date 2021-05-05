import React from 'react';
import subDetail from "../../pages/subDetails/subDetail.component.js";
import {shallow, configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import axios from 'axios';

jest.mock('axios');


configure({ adapter: new Adapter() });

describe("Detalle de componentes", () => {

    const resp = {
        name: 'netflix',
        active: true,
        free_trial: false,
        free_trial_end: Date(),
        start_date: Date(),
        end: false,
        end_date: Date(),
        currency: 'EUR',
        frequency: 'mensual',
        url: 'www.google.es',
        charge_date: Date(),
        price: '9.75',
        description: 'testing',
        img_src: '',
        tags: ['tag1', 'tag2'],
        user_id: '1'
    }

  it("Carga detalle con mock", () => {
    axios.get.mockResolvedValue(resp);
    const wrapper = shallow(<subDetail id="1"/>);
    const welcome = <h2>Información detallada de la suscripción</h2>;
    expect(wrapper.contains(welcome)).toEqual(true);
  });

})
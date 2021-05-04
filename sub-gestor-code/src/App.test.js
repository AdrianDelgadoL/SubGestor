import React from 'react';
import App from './App';
import Subscription from './pages/subscriptions/Subscription.components.js'
import {shallow, configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });


it.skip("renders without crashing", () => {
  shallow(<App />);
});
describe("Tarjetas de componentes", () => {

  it("Tarjeta contiene link de cancelar", () => {
    const wrapper = shallow(<Subscription title="Net" imageSource="netflix.png" card_price="15.5" payment_type="EUR" charge_date="2021-11-26T23:00:00.000+00:00" sub_id="21387GHJUG9321" url="http://netflix.com" />);
    const value = wrapper.find("a").text();
    expect(value).toEqual("Cancelar suscripción");
  });

  it("Tarjeta no contiene link de cancelar", () => {
    const wrapper = shallow(<Subscription title="Net" imageSource="netflix.png" card_price="15.5" payment_type="EUR" charge_date="2021-11-26T23:00:00.000+00:00" sub_id="21387GHJUG9321" url="" />);
    expect(wrapper.find("a").exists()).toBeFalsy()
  });

  it("Tarjeta muestra moneda euro correcta", () => {
    const wrapper = shallow(<Subscription title="Net" imageSource="netflix.png" card_price="15.5" payment_type="EUR" charge_date="2021-11-26T23:00:00.000+00:00" sub_id="21387GHJUG9321" url="http://netflix.com" />);
    const value = wrapper.find(".Subscription-precio").text();
    expect(value).toEqual("15.5€");
  });

  it("Tarjeta muestra moneda dolar correcta", () => {
    const wrapper = shallow(<Subscription title="Net" imageSource="netflix.png" card_price="15.5" payment_type="Dolars" charge_date="2021-11-26T23:00:00.000+00:00" sub_id="21387GHJUG9321" url="http://netflix.com" />);
    const value = wrapper.find(".Subscription-precio").text();
    expect(value).toEqual("15.5$");
  });

})
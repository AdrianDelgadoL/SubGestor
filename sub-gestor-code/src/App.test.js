import React from 'react';
import App from './App';
import Subscription from './pages/subscriptions/Subscription.components.js'
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from 'react-router-dom';
import "@testing-library/jest-dom/extend-expect";



it.skip("renders without crashing", () => {
  render(<App />);
});
describe("Tarjetas de componentes", () => {
  // Con regex
  it("Tarjeta contiene link de cancelar", () => {
    const {getByText} = render(<Router><Subscription title="Net" imageSource="netflix.png" card_price="15.5" payment_type="EUR" charge_date="2021-11-26T23:00:00.000+00:00" sub_id="21387GHJUG9321" url="http://netflix.com" /></Router>);
    expect(getByText(/Cancelar suscripción/)).toBeInTheDocument()
  });

  it("Tarjeta no contiene link de cancelar", () => {
    const {queryByText} = render(<Router><Subscription title="Net" imageSource="netflix.png" card_price="15.5" payment_type="EUR" charge_date="2021-11-26T23:00:00.000+00:00" sub_id="21387GHJUG9321" url="" /></Router>);
    expect(queryByText(/Cancelar suscripción/)).toBeNull()
  });

  // Con texto básico
  it("Tarjeta muestra moneda euro correcta", () => {
    const {queryByText} = render(<Router><Subscription title="Net" imageSource="netflix.png" card_price="15.5" payment_type="EUR" charge_date="2021-11-26T23:00:00.000+00:00" sub_id="21387GHJUG9321" url="http://netflix.com" /></Router>);
    expect(queryByText("15.5€")).toBeInTheDocument()
  });

  it("Tarjeta muestra moneda dolar correcta", () => {
    const {queryByText} = render(<Router><Subscription title="Net" imageSource="netflix.png" card_price="15.5" payment_type="Dolars" charge_date="2021-11-26T23:00:00.000+00:00" sub_id="21387GHJUG9321" url="http://netflix.com" /></Router>);
    expect(queryByText("15.5$")).toBeInTheDocument()
  });

})
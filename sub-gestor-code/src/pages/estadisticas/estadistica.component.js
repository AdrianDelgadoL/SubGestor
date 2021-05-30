import React, {useEffect, useState} from 'react';
import {Line} from 'react-chartjs-2';
import moment from 'moment'
import { useAuthState, useAuthDispatch } from '../../context/context'
import axios from "axios";

const Estadistica = (props) => {

  const dispatch = useAuthDispatch()
  const userDetails = useAuthState()
  const userToken = userDetails.token
  const userCurrency = userDetails.prefered_currency
  const [dataset, setDataset] = useState(undefined);
  const [table, setTable] = useState(undefined);

  function selectCurrency() {
    switch(userCurrency) {
    case "EUR":
        return "Euros"
    case "USD":
        return "Dólares"
    case "GBP":
        return "Libras"
    default:
        return ""
    }
  }

  function getStartDate(start_date) {
    if(start_date !== undefined ) return moment(start_date).format("DD/MM/YYYY")
    return "Sin definir"
  }

  function getActive(active) {
    if(active) return "Activa"
    return "Cancelada"
  }

  function getPriceCurrency() {
    switch(userCurrency) {
      case "EUR":
          return "€"
      case "USD":
          return "$"
      case "GBP":
          return "£"
      default:
          return ""
      }
  }

  let data = {
    datasets: [
      {
        label: selectCurrency(),
        data: dataset,
        fill: false,
        backgroundColor: 'rgb(150, 200, 132)',
        borderColor: 'rgba(150, 200, 132, 1)',
        pointBackgroundCollor: 'rgb(150, 200, 132)'
      },
    ],
  };

  useEffect(() => {
    axios.get(process.env.REACT_APP_SERVER_URL+'/statistics/', {headers: {"x-auth-token": userToken}})
    .then(response => {
      setTable(response.data.totalStatistics.map(sus => (
        <tr>
          <th scope="row">{sus.name}</th>
          <td>{getStartDate(sus.start_date)}</td>
          <td>{sus.total_price}{getPriceCurrency()}</td>
          <td>{getActive(sus.active)}</td>
        </tr>
      )))
      let auxDataset = []
      for(var key in response.data.chartStatistics) {
        auxDataset.push({x: key, y: response.data.chartStatistics[key]})
      }
     
      console.log(dataset)
      setDataset(auxDataset)
      console.log(data)
    })
  }, []);

  


    /*const dataset = [{x: "2021-05-27", y: 0}, {x: "2021-05-28", y: 15}, {x: "2021-05-29", y: 20}, {x: "2021-05-30", y: 0}, {x: "2021-05-31", y: 0}, {x: "2021-06-1", y: 0},
    {x: "2021-06-2", y: 10}, {x: "2021-06-3", y: 15}, {x: "2021-06-4", y: 0}, {x: "2021-06-5", y: 0}, {x: "2021-06-6", y: 0}, {x: "2021-06-7", y: 22}, {x: "2021-06-8", y: 0},
    {x: "2021-06-9", y: 30}, {x: "2021-06-10", y: 0}, {x: "2021-06-11", y: 0}, {x: "2021-06-12", y: 0}, {x: "2021-06-13", y: 0}, {x: "2021-06-14", y: 0}, {x: "2021-06-15", y: 0},
    {x: "2021-06-16", y: 17}, {x: "2021-06-17", y: 10}, {x: "2021-06-18", y: 0}, {x: "2021-06-19", y: 0}, {x: "2021-06-20", y: 0}, {x: "2021-06-21", y: 25}, {x: "2021-06-22", y: 0},
    {x: "2021-06-23", y: 0}, {x: "2021-06-24", y: 0}, {x: "2021-06-25", y: 0}, {x: "2021-06-26", y: 0}, {x: "2021-06-27", y: 0}]*/

    
    
    const style = {
        maxWidth: '1000px',
        maxHeight: '500px',
        margin: 'auto',
    };

    const tableStyle = {
      padding: '10px',
      margin: '20px',
      width: "auto"
  };

  if (dataset === undefined) {return(<h1>Loading...</h1>)}

    return (
      
      <div>
        {console.log(data)}
        <h2>Gastos en el siguiente mes</h2>
        <div style={style}>
            <Line data={data} options={{responsive: true}}>
            </Line>
        </div>
        <div>
          <h2>Historial de gastos</h2>
          <div class="table-responsive" style={tableStyle}>
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Fecha de inicio</th>
                  <th scope="col">Cantidad total</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {table}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
}

export default Estadistica;
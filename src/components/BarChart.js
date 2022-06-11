import React, { useState, useEffect, useContext } from 'react'
import {Bar} from 'react-chartjs-2'
import { AppContext } from './AppContext'

const BarChart = () => {

  const context = useContext(AppContext) // Otetaan konteksti käyttöön muuttujaan
  const [data,setData] = useState([]) // Tilamuuttuja kaavion datapointteja varten

  // Luodaan kaavion data
  const chartData = {
    labels: ["Tammi","Helmi","Huhti","Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"],
    datasets: [
      {
        label:"Luetut kirjat kuukausittain",
        data: data,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 3
      }
    ]
  }

  // Tämä funktio asettaa data-tilamuuttujaan arvon
  const getData = () => {
    const books = context.activeUser.books
    var tmpArr = [0,0,0,0,0,0,0,0,0,0,0,0] // Alustetaan jokainen kuukausi arrayhin
    try {
      for (let i = 0; i < books.length; i++) {      // Haetaan jokaisen kirjan lukukuukausi ja merkitään arrayhin
        const month = new Date( books[i].eDate ).getMonth() ;
        tmpArr[month] += 1
      }
    } catch (error) {
      console.log("Error reading book list: ", error.message)
    }
    setData(tmpArr) // Asetetaan array data-tilamuuttujan arvoksi
  }
  useEffect(getData,[context.activeUser]) // UseEffect-hookilla laukaistaan getData-funktio aina kun kontekstin activeUser-muuttujan arvo muuttuu

  // Renderöidään kaavio
  return(
      <div>
          <div id="barChart">
              <Bar data={chartData} />
          </div>
      </div>
  )
}

export default BarChart
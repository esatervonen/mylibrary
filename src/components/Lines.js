import React, { useState, useEffect, useContext } from 'react'
import {Line} from 'react-chartjs-2'
import { AppContext } from './AppContext'

// Tämä komponentti luo viivakaavion käyttäjälle merkittyjen kirjojen sivumääristä
const Lines = () => {

  const context = useContext(AppContext) // Tuodaan konteksti omaan muuttujaan
  const [data,setData] = useState([]) // Tilamuuttuja kaavion datapointteja varten

  // Luodaan kaavion data
  const chartData = {
    labels: ["Tammi","Helmi","Huhti","Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"],
    datasets: [
        {
            label:"Luetut sivut / kk",
            data: data,
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
          }
        ]
      }

  // Tämä funktio asettaa data-tilamuuttujaan arvon
  const getData = () => {
    const books = context.activeUser.books
    var tmpArr = [0,0,0,0,0,0,0,0,0,0,0,0] // Alustetaan jokainen kuukausi arrayhin
    try {
      for (let i = 0; i < books.length; i++) {      // Haetaan jokaisen kirjan lukukuukausi ja lisätään arrayhin ko.kuukauden kohdalle kirjan sivumäärä
        const month = new Date( books[i].eDate ).getMonth() ;
        tmpArr[month] += books[i].pages
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
        <Line data={chartData}/>
    </div>
  )
}

export default  Lines

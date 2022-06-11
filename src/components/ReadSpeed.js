import React, { useState, useEffect, useContext } from 'react'
import {Line} from 'react-chartjs-2'
import { AppContext } from './AppContext'

// Tämä komponentti luo kaavion, joka näyttää lukemisnopeuden vuorokausia per kirja
const ReadSpeed = () => {

    const context = useContext(AppContext) // Tuodaan konteksti omaan muuttujaan

    const [readData,setData] = useState([]) //  Tilamuuttuja kaavion datapointteja varten
    const [labels,setLabels] = useState([]) //  Tilamuuttuja datapointtien otsikoita varten

    // Luodaan kaavion data
    const chartData = {
            labels: labels,
            datasets: [
                {
                    label:"Lukemiseen käytetty aika (vrk / kirja)",
                    data: readData,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                }
            ],
    }

    const chartOptions = {
        options: {
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero : true,
                        max: 100,
                        min: 0
                    }
                }]
            }
        }
    }

  // Tämä funktio asettaa data-tilamuuttujalle arvon
  const getData = () => {
    const books = context.activeUser.books
    var tmpArrDur = []
    var tmpArrBooks = []
    try {
        // Lasketaan jokaiseen kirjaan käytetty aika vuorokausina Date-objektien avulla, tallennetaan aika omaan taulukkoon ja kirjan nimi omaan
        for (let i = 0; i < books.length; i++) {
            const startDate = new Date( books[i].sDate )
            const endDate = new Date( books[i].eDate )
            const duration = (endDate - startDate) / 1000 / 3600 / 24
            tmpArrDur.push(duration === 0 ? 1 : duration)
            tmpArrBooks.push(books[i].title)
        }
    } catch (error) {
        console.log("Error reading book list: ",error.message)
    }
    
    setData(tmpArrDur) // Asetetaan kaavion data-muuttujalle arvo
    setLabels(tmpArrBooks) // Asetetaan datapointtien otsikot
    }
    useEffect(getData,[context.activeUser]) // UseEffect-hookilla laukaistaan getData-funktio aina kun kontekstin activeUser-muuttujan arvo muuttuu

  // Renderöidään kaavio
  return(
        <Line data={chartData} options={chartOptions} />
    )
}

export default ReadSpeed
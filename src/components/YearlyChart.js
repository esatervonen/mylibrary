import React, { useState, useEffect, useContext } from 'react'
import {Bar} from 'react-chartjs-2'
import { AppContext } from './AppContext'

// Näytetään palkkikaaviossa luettujen kirjojen määrä vuosiluvuittain
const YearlyChart = () => {

  const context = useContext(AppContext) // Konteksti muuttujaan
  const [data,setData] = useState([]) // Datapointeille tilamuuttuja

  // Luodaan data kaaviolle
  const chartData = {
    labels: data.map((item) => (item.year)),
    datasets: [
      {
        label:"Luetut kirjat vuosittain",
        data: data.map((item) => (item.count)),
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 3
      }
    ]
  }
  const options = {
      scales: {
          yAxes: [{
              ticks: {
                  beginAtZero: true
              }
          }]
      }
  }

  // Tämä funktio asettaa data-tilamuuttujalle arvon
  const getData = () => {
    const books = context.activeUser.books
    var tmpArr = []
    var years = []
    try {
      for (let i = 0; i < books.length; i++) { // Haetaan kaikkien aktiivisen käyttäjän kirjojen vuosiluvut ja lisätää väliaikaiseen taulukkoon
        const year = new Date( books[i].eDate ).getFullYear()
        if(!years.includes(year)) {
            years.push(year)
            tmpArr.push({year: year, count: 1})
        } else {
            tmpArr.forEach((item) => { // Jos vuosiluku löytyy jo väliaikaiskansiosta, lisätään laskuriin
                if(item.year === year) item.count += 1
            })
        }
      }
    } catch (error) {
      console.log("Error reading book list: ", error.message)
    }
    tmpArr.sort((a,b) => {
      return a.year - b.year
    })
    setData(tmpArr)
  }
  useEffect(getData,[context.activeUser]) // Laukaistaan getData-funktio aina kun aktiivinen käyttäjä vaihtuu

  // Renderöi kaavio
  return(
      <div>
          <div id="YearlyChart">
              <Bar data={chartData} options={options} />
          </div>
      </div>
  )
}

export default YearlyChart
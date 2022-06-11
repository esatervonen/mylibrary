import React, { useState, useEffect, useContext } from 'react'
import { Bar} from 'react-chartjs-2'
import { AppContext } from './AppContext'

// Tämä komponentti luo palkkikaavion, jossa näytetään sivumäärät vuositasolla
const PagesYearlyChart = () => {

  const context = useContext(AppContext) // Tuodaan konteksti omaan muuttujaan
  const [data,setData] = useState([]) //  Tilamuuttuja kaavion datapointteja varten

  // Luodaan kaavion data
  const chartData = {
    labels: data.map((item) => (item.year)),
    datasets: [
      {
        label:"Luettu sivumäärä vuosittain",
        data: data.map((item) => (item.pages)),
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
    var years = [] // Väliaikainen taulukko vuosilukuja varten
    try {
      for (let i = 0; i < books.length; i++) {  // Haetaan jokaisen käyttäjälle merkityn kirjan vuosi, verrataan vuosilukukansion sisältöön ja lisätään kirjan sivumäärä tmpArray-taulukkoon vertailun tuloksen mukaan
        const year = new Date( books[i].eDate ).getFullYear()
        if(!years.includes(year)) {
            years.push(year)
            tmpArr.push({year: year, pages: books[i].pages ? books[i].pages : 0}) // Varmistellaan että pages-arvo on numero ternary-operaattorilla
        } else {
            tmpArr.forEach((item) => {
                if(item.year === year) item.pages += books[i].pages ? books[i].pages : 0
                })
        }
      }
    } catch (error) {
      console.log("Error reading book list: ", error.message)
    }
    tmpArr.sort((a,b) => {
      return a.year - b.year
    })
    setData(tmpArr) // Asetetaan array data-tilamuuttujan arvoksi
  }
  useEffect(getData,[context.activeUser]) // UseEffect-hookilla laukaistaan getData-funktio aina kun kontekstin activeUser-muuttujan arvo muuttuu

  // Renderöidään kaavio
  return(
      <div>
          <div id="YearlyChart">
              <Bar data={chartData} options={options} />
          </div>
      </div>
  )
}

export default PagesYearlyChart
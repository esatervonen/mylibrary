import React, { useRef, useContext } from 'react'
import BarChart from './BarChart.js'
import Lines from './Lines'
import ReadSpeed from './ReadSpeed.js'
import { AppContext } from './AppContext.js'
import YearlyChart from './YearlyChart.js'
import PagesYearlyChart from './PagesYearlyChart.js'

// Tämä komponentti toteuttaa navigoinnin kaavioiden välillä
const Stats = () => {

    const context = useContext(AppContext) // Konteksti muuttujaan
 
    // Kaikilla kaavioilla oma useRef-hook
    const statOne = useRef(null)
    const statTwo = useRef(null)
    const statThree = useRef(null)
    const statFour = useRef(null)
    const statFive = useRef(null)
    const wrapper = useRef(null)
    const refArray = [statFive,statFour,statThree,statTwo,statOne]

    // Hallitaan kaavioiden ulkoasua css-luokkien avulla
    const clickHandle = (event,ref) => {
        wrapper.current.classList.toggle('active')
        var spans = document.getElementById("statNav").children
        for (let i = 0; i < spans.length; i++) {
            spans[i].className = ""
            
        }
        event.target.className = "active-header"
        refArray.forEach((item) => {
            if(item === ref) {
                item.current.className = "active-chart"
            } else {
                item.current.className = "inactive-chart"
            }
        })
    }

    // Renderöidään navigointi ja kaaviot
    return(
        <>
        {!context.activeUser.books &&
            <div>Lisää kirjoja käyttäjälle {context.activeUser.name} niin voidaan näyttää tilastoja</div>
        }
        {context.activeUser.books &&
        <div>
            <div id="statNav">
                <span className="active-header" onClick={(event) => clickHandle(event,statOne)}>Kirjat kuukausittain</span> | 
                <span onClick={(event) => clickHandle(event,statTwo)}>Sivut kuukausittain</span> | 
                <span onClick={(event) => clickHandle(event,statThree)}>Lukemiseen käytetty aika</span> |
                <span onClick={(event) => clickHandle(event,statFour)}>Kirjat vuosittain</span> |
                <span onClick={(event) => clickHandle(event,statFive)}>Sivut vuosittain</span>
            </div>
            <div ref={wrapper} className="chartWrapper">
                <div className="active-chart" ref={statOne} id="barChart">
                    <BarChart />
                </div>
                <div className="inactive-chart" ref={statTwo} id="lineChart">
                    <Lines />
                </div>
                <div className="inactive-chart" ref={statThree} id="speedChart">
                    <ReadSpeed />
                </div>
                <div className="inactive-chart" ref={statFour} id="yearChart">
                    <YearlyChart />
                </div>
                <div className="inactive-chart" ref={statFive} id="yearChart">
                    <PagesYearlyChart />
                </div>
            </div>
        </div>
        }
        </>
    )
}

export default Stats
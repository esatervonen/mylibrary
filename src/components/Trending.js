import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from './AppContext'

// Aloitusnäkymään Top-10 lista kirjojen aiheista
const Trending = () => {

    const context = useContext(AppContext) // Kontekstitiedot muuttujaan

    // Tilamuuttujat listoille
    const [subjectList, setList] = useState([])
    const [topTenList, setTopTen] = useState([])

    // Haetaan kaikkien käyttäjien kaikkien kirjojen kaikki aiheet ja tallennetaan subjectList-muuttujaan
    const getList = () => {
        var subjArr = []
        var users = context.users
        users.forEach(user => {
            user.books.forEach(book => {
                if(book.subjects){
                    book.subjects.forEach(subject => {
                        subject.forEach(item => {
                            subjArr.push(item)
                        })
                    })
                }
            })
        })
        setList(subjArr)
    }
    useEffect(getList,[context.users]) // Ajetaan funktio aina kun käyttäjälista muuttuu

    // Suodatetaan epäolennaisia aiheita pois listalta
    const filterList = [
        'fict',
        'fikt',
        'suomen kieli',
        'englannin kieli',
        'ruotsin kieli',
        'engelska',
        'ryssk',
        'rysk litteratur',
    ]

    // Rakennetaan kaikkien aiheiden listasta top-10 lista aiheiden esiintymiskertojen mukaan
    const getTopTenList = () => {
        if(subjectList.length === 0) return
        var list = []
        var tmpArr = []
        subjectList.forEach(item => {
            var filterFlag = false
            filterList.forEach(filter => {
                if(item.toLowerCase().includes(filter)) filterFlag = true
            })
            if(filterFlag === false) {
                    if(!list.includes(item)) {
                        list.push(item)
                        tmpArr.push({subject: item, count: 1})
                    } else {
                        tmpArr.forEach(i => {
                            if(i.subject === item) i.count += 1
                        })
                    }
                }
        })
        list = []
        tmpArr.sort((a,b) => {
           return b.count - a.count
        })
        // console.log("top-lista: ", tmpArr)
        let i = 0
        while(list.length < 10 && i < tmpArr.length){
            list.push(tmpArr[i].subject)
            i++
        }
        setTopTen(list)
    }
    useEffect(getTopTenList, [subjectList]) // Muodostetaan uusi top-10 lista aina kun subjectList-muuttujan sisältö muuttuu

    return(
        <div>
            <ol>
                {
                    topTenList.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))
                }
            </ol>
        </div>
    )
}

export default Trending
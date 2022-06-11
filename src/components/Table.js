import React, { useRef, useContext } from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import book_cover from '../img/book_cover.png'
import { AppContext } from './AppContext'
import BookInfo from './BookInfo'

// Komponentti suorittaa haun Finnan tietokantaan, 
// hakee valitusta kirjasta lisätietoja OpenLibraryn API:n kautta ja 
// käsittelee tiedot ja tallettaa ne kontekstiin.

// Selkeyden kannalta olisi varmaan hyvä pilkkoa tämä pienemmiksi komponenteiksi..
const Table = (props) => {

    const context = useContext(AppContext) // Konteksti muuttujaan

    const [showDateInput, setVisibility] = useState(false) // Päivämäärien syöttökenttien näkyvyyden hallinta
    // Päivämäärille ja sivumäärälle useRef-hookit
    const sDate = useRef(null)
    const eDate = useRef(null)
    const pageInput = useRef(null)

    // Muuttuja valitun kirjan tietojen käsittelyä varten
    const[book,setBook] = useState([])

    // Openlibraryn datalle oma tilamuuttuja
    const [olData, setOlData] = useState([])
    
    // Haetaan data apin kautta data-tilamuuttujaan useState-hookin avulla
    const [data, setData] = useState([])
    const getData = () => {
        if(props.searchText !== "") {
            setVisibility(false)
            axios.get(`https://api.finna.fi/api/v1/search?lookfor=${props.searchText}&field[]=originalLanguages&field[]=imagesExtended&field[]=subjects&field[]=publishers&field[]=formats&field[]=id&field[]=title&filter[]=format:0/Book/&filter[]=-format:1/Book/eBook/&field[]=nonPresenterAuthors&field[]=year&field[]=cleanIsbn&field[]=fullRecord&page=1&limit=20&sort=relevance&lng=fi`)
            .then(response => {
                setData(response.data.records)
                console.log("data: ", response.data.records)            
            })
            .catch(error => {
                console.log("Download error: ", error)
            });
        }
    }
    useEffect(getData,[props.searchText]) // Haetaan data aina kun saadaan uusi hakuteksti

    // Haetaan Openlibraryn data isbn-numeron avulla
    const getOlData = () => {
        // console.log("getOlData book: ", book)
        if(book.cleanIsbn){
            axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${book.cleanIsbn}&jscmd=data&format=json`)
            .then(response => {
                if(olData === undefined && response.data[`ISBN:${book.cleanIsbn}`] === undefined) {
                    setOlData([])
                } else {
                    setOlData(response.data[`ISBN:${book.cleanIsbn}`])
                }
                console.log("Openlibrary data: ", response.data[`ISBN:${book.cleanIsbn}`])
            })
            .catch(error => {
                console.log("Download error: ", error)
            })
        } else {getBook()}
    }
    useEffect(getOlData,[book]) // Haetaan OL-data aina kun paikallinen book-muuttuja saa uuden arvon
    
    // Käsitellään valitun kirjan tietoja
    const getBook = () => {
        console.log("oldata: ", olData)
        var cover = book_cover
        if(Object.entries(book).length !== 0) {
            try {
                try{
                    cover = 'https://api.finna.fi' + book.imagesExtended[0].urls.medium
                } catch (error) {
                    console.log("Can't get cover urls from finna. ", error.message)
                }
                cover = olData.cover.medium
            } catch (error) {
                console.log("Can't find cover url: ", error.message)
            }
            var pages = ""
            var xmlDoc = new DOMParser().parseFromString(book.fullRecord,"text/xml")
            var dataFields = xmlDoc.getElementsByTagName("datafield")
            for (let i = 0; i < dataFields.length; i++) {
                const attributeNode = dataFields[i].getAttributeNode("tag").nodeValue;
                if(attributeNode === "300") { 
                    pages = dataFields[i].firstChild.nextSibling.firstChild.nodeValue
                    var str = ""
                    var it = 0
                    while(isNaN(pages[it]) || pages[it] === " "){ 
                        it++
                    }
                    while( !isNaN(parseInt(pages[it])) ) {
                        str += pages[it]
                        it++
                    }
                    pages = parseInt(str)
                }
            }
            pages = olData !== undefined && olData.length !== 0 ? olData.number_of_pages : pages
            console.log("pages: ", pages)
            // Asetetaan kontekstin book-muuttujaan käsitellyt tiedot
            context.setBook( {
                id: book.id,
                title: book.title,
                author: book.nonPresenterAuthors !== undefined ? book.nonPresenterAuthors[0].name : book.author,
                year: book.year,
                pages: pages,
                publishers: book.publishers,
                cover: cover,
                subjects: book.subjects,
                origLng: book.originalLanguages
            } )
            setVisibility(true) // Näytetään päivämäärän syöttö
            context.setBookVisibility(true) // Näytetään kirjan tiedot
        }
    }
    useEffect(getBook,[olData]) // Käsitellään kirjan tiedot kun olData on saanut arvon

    // Päivämäärän syötön jälkeen päivitetään aktiivisen käyttäjän kirjat
    const addToShelf = (event) => {   
        event.preventDefault() 
        if (!context.activeUser){
            alert("Valitse käyttäjä")
            return
        }
        var item = context.book    
        item.sDate = sDate.current.value
        item.eDate = eDate.current.value
        if(item.pages === undefined || item.pages === ""){
            item.pages = parseInt(pageInput.current.value)
        }
        setVisibility(false)
        var tmpArr = []
        if(context.activeUser.books){
            context.activeUser.books.forEach((element) => {
                tmpArr.push(element)
            })
            tmpArr.push(item)
            var tmpUsers = []
            var tmpUser
            try {
                context.users.forEach(user => {
                    if(user.id !== context.activeUser.id) tmpUsers.push(user)
                })
                tmpUser = {
                    id: context.activeUser.id,
                    name: context.activeUser.name,
                    
                    books: tmpArr 
                }
                tmpUsers.push(tmpUser)
                context.setActiveUser(tmpUser)
                context.updateUsers(tmpUsers)
            }catch (error) {
                console.log("Error: ", error)
                alert('Kirjan lisääminen epäonnistui. Muistitko valita käyttäjän?')
            }
        }
        context.setBooks(tmpArr)
    
    }

    // Renderöidään ehdollisesti elementit
    return(
        <div className="dateInput">
            
            {showDateInput && 
            <div id="dateDiv">
                <p className="back" onClick={() => {setVisibility(false); context.setBookVisibility(false)}}>Takaisin hakutuloksiin</p><br/>
                <div className="book" >
                    {context.showBookInfo &&    
                    <BookInfo />}
                </div>
                <form className="dates" onSubmit={addToShelf}>
                    <header>Milloin luit kirjan?</header>
                    <label>Aloituspvm: </label><input ref={sDate} type="date" placeholder="dd/mm/yyyy" required/><br />
                    <label>Lopetuspvm: </label><input ref={eDate} type="date" placeholder="dd/mm/yyyy" required/><br />
                    {(context.book.pages === undefined || context.book.pages === "") &&
                        <input ref={pageInput} type='number' placeholder='Anna sivumäärä' />
                    }
                    <br /><input type='submit' value='Lisää hyllyyn' />
                </form>
            </div>}
            
            {context.showBookInfo && !showDateInput &&
                <BookInfo />
            }

            {!data && 
            <p>Ei hakutuloksia</p>}
            {props.searchText && !showDateInput && !context.showBookInfo && data && 
            <table>
                <tbody>
                    <tr><th>Kirjan nimi</th><th>Kirjailija</th><th>Julkaisuvuosi</th><th></th></tr>
                {
                    data.map((item) => (
                    <tr key={item.id}><td>{item.title}</td><td>{item.nonPresenterAuthors.length === 0 ? "Tekijä tuntematon" : item.nonPresenterAuthors[0].name}</td><td>{item.year}</td><td><button onClick={() => {setBook(item)}}>Valitse kirja</button></td></tr>
                    ))
                }
                </tbody>
            </table>}
        </div>

    )
}

export default Table
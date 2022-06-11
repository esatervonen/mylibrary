import React, { useContext } from 'react'
import del from '../img/delete.png'
import { AppContext } from './AppContext'

// Tämä komponentti luo table, jossa näytetään käyttäjän kirjahyllyn sisältö
const Shelf = () => {

    const context = useContext(AppContext) // Konteksti muuttujaan

    // Funktio kirjan poistamista varten
    const removeFromShelf = (item) => {
        var books = []
        var user = context.activeUser
        user.books.forEach((book) => { // Käydään läpi aktiivisen käyttäjän kirjat ja lisätään väliaikaistaulukkoon muut paitsi poistettavaksi merkitty kirja
            if(book !== item) books.push(book)
        })
        user.books = books          // Asetetaan väliaikainen kirjataulukko väliaikaiselle käyttäjälle
        context.setActiveUser(user) // Asetetaan väliaikainen käyttäjä aktiiviseksi
    }

    // Näytetään kirja
    const showBook = (item) => {
        context.setBook(item)
        context.setBookVisibility(true)
    }

    // Renderöi aktiivisen käyttäjän kirjat taulukkoon
    return(
    <div className="shelf-container"><p>{context.activeUser.name}n kirjahylly</p>
            {context.activeUser.books.length === 0 ?  " on tyhjä" : context.activeUser.books.length > 0  &&
            <table className="shelf">
                <thead>
                    <tr><th>Kirjan nimi</th><th>Kirjailija</th><th></th></tr>
                </thead>
                <tbody>
                    {   
                        context.activeUser.books.map((item) => (
                        <tr onClick={() => showBook(item)} key={item.id}><td onClick={showBook}>{item.title}</td><td>{item.author}</td>
                        <td><img src={del} alt="poista" onClick={() => removeFromShelf(item)} /></td></tr>
                        ))
                    }
                </tbody>
            </table>}
        </div>
    )
}

export default Shelf

import React, { useContext } from 'react'
import { AppContext } from './AppContext'

// Tämä komponentti näyttää yksittäisen kirjan tiedot
const BookInfo = () => {

    const context = useContext(AppContext) // Tuodaan konteksti omaan muuttujaan

    // Lasketaan päivien lukumäärä Date-objektien avulla
    const getDays = (start, end) => {
        var diff = new Date(end).getTime() - new Date(start).getTime()
        diff = Math.floor(diff / 1000 / 60 / 60 / 24)
        return diff === 0 ? 1 : diff
    }

    // Renderöidään taulukko, johon mapataan kontekstista löytyvän kirjan tietoja
    return(
        <div className="book-info" >
            {!context.activeUser && <h4 style={{color:'red'}}>Valitse käyttäjä ennen kuin lisäät kirjan</h4>}
            <div className="cover-container"><img src={context.book.cover} alt="cover" /></div>
            <table>
                    <tbody>
                    <tr><th>Otsikko: </th><td>{context.book.title}</td></tr>
                    <tr><th>Kirjailija: </th><td>{context.book.author}</td></tr>
                    <tr><th>Julkaisija: </th><td>{context.book.publishers}</td></tr>
                    <tr><th>Julkaisuvuosi: </th><td>{context.book.year}</td></tr>
                    <tr><th>Sivumäärä: </th><td>{context.book.pages !== "" ? `${context.book.pages} sivua` : "Sivumäärä ei tiedossa"}</td></tr>
                    <tr><th>Alkuperäiskieli: </th><td>{context.book.origLng}</td></tr>
                    {context.book.subjects && 
                        <tr><th>Aiheet: </th><td><div style={{overflow:'auto', height:'100%', width:'300px'}}>
                                <ul style={{margin:'0px', listStyle:'none'}}>{context.book.subjects.map((item,idx) => (
                                    <li key={idx}><ul>{item.map((it,i) => (<li key={i}>{it}</li>))}</ul></li>))}
                                </ul>
                                </div></td>
                        </tr>
                    }
                    </tbody>
            {context.book.sDate &&
                    <tbody>
                        <tr><th>Aloitettu: </th><td>{String(context.book.sDate).slice(0,15)}</td></tr>
                        <tr><th>Luettu: </th><td>{String(context.book.eDate).slice(0,15)}</td></tr>
                        <tr><th>Lukupäivät: </th><td>{getDays(context.book.sDate, context.book.eDate)}</td></tr>
                    </tbody>
            }
            </table>
        </div>
    )
}
export default BookInfo
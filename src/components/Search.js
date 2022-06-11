import React, { useRef, useState, useContext } from 'react'
import Table from './Table'
import { AppContext } from './AppContext'

// Tämä komponentti luo elementin kirjojen hakua varten
const Search = () => {

    const context = useContext(AppContext) // Konteksti muuttujaan
    const nimi = useRef(null) // Useref-hookilla haetaan syötetty teksti input-elementistä
    const [searchText, setSearchText] = useState("") // Tilamuuttuja hakutekstille
    
    // Formin käsittely
    const handleSubmit = (event) => {
        event.preventDefault()
        setSearchText(nimi.current.value) // Asetetaan hakuteksti searchText-tilamuuttujaan
        nimi.current.addEventListener("focus",() => nimi.current.value = "") // Tyhjentää hakutekstikentän onFocus
        context.setBookVisibility(false) // Piilotetaan kirjan infot
    }

    // Renderöidään hakuformi sekä hakutulos-komponentti, jolle välitetään propsina hakuteksti
    return (
        <div className="search">
            <form onSubmit={handleSubmit}>
                <input ref={nimi} type="text" autoFocus={true} placeholder="Hae kirjan nimellä..." />
                <input type="submit" value="Hae"  />
            </form>
            <div id="searchResult">
                    <Table searchText={searchText} />
            </div>
        </div>
    )
}

export default Search
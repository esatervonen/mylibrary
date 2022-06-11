import React, { useState, useEffect, useRef, useContext } from 'react'
// import axios from 'axios'
import Shelf from './Shelf.js'
import del from '../img/delete.png'
import { AppContext } from './AppContext.js'

// Täällä haetaan käyttäjien tiedot palvelimelta
const Users = () => {

    const context = useContext(AppContext) // Asetetaan kontekstin tiedot omaan muuttujaan

    // const url = 'http://localhost:3001/users' // osoite userdata.json tiedostoon
    const name = useRef(null) // syötetty uusi käyttäjänimi tallennetaan tähän
    const [showShelf,toggleShelf] = useState(false) // Tilamuuttuja jolla kontrolloidaan kirjahyllytaulukon näkyvyyttä

    // Käyttäjätietojen haku palvelimelta
    // const getUsers = () => {
    //     axios.get(url)
    //     .then(response => {
    //         // context.setUsers(response.data)
    //         context.storage.users = JSON.stringify(response.data)
    //     })
    //     .catch(error => {
    //         console.log("Download error: ", error.data.message)
    //     });
    // }
    // useEffect(getUsers,[context.activeUser.books]) // haetaan tiedot aina kun aktiivisen käyttäjän kirjoissa tapahtuu muutos

    // Uuden käyttäjän lisäys palvelimelle
    const [newId, setNewId] = useState(0)
    const getNewId = () => {
        var id = 1
        var ids = []
        context.users.forEach((u) => {
            ids.push(u.id)
        })
        while(ids.includes(id)){
            id++
        }
        setNewId(id)
    }
    useEffect(getNewId,[context.users]) // Luodaan uusi id-arvo aina kun käyttäjälista muuttuu

    const handleSubmit = (event) => {
        event.preventDefault()

        // Lisätään käyttäjä local storageen
        var users = JSON.parse(context.storage.users)
        var newUser = {
            id: newId,
            name: name.current.value,
            books: []
        }
        console.log(`users: `,users)
        users.push(newUser)
        context.updateUsers(users)
        name.current.value = ""

    // Tehdään post request palvelimelle

    //     axios({method: 'post', url: url, data:{
    //         id: newId,
    //         name: name.current.value,
    //         books: []
    //         }
    //     })
    //     .then(response => {
    //         console.log("add user response: ", response.data)
    //         getUsers()
    //         context.setActiveUser(response.data)
    //     })
    //     name.current.value = "" // Tyhjennetään nimen syöttökenttä
    }

    // Käyttäjän poistaminen
    const deleteUser = (user) => {
        //local storage
        var tmpArr =[]
        context.users.forEach(item => {
            if(item.id !== user.id) tmpArr.push(item)
        })
        context.updateUsers(tmpArr)

        // axios http-pyyntö
        // axios({
        //     method: "delete",
        //     url: `${url}/${user.id}`,
        //     data: {
        //         id: user.id,
        //         name: user.name,
        //         books: user.books
        //     }
        // })
        // .then(response => {
        //     console.log("delete user response: ", response.data)
        //     getUsers()
        //     context.setActiveUser({name: "Käyttäjää ei valittu"})
        // })
        // .catch(error => {
        //     console.log("Delete error: ", error.message)
        // })
    }

    // Asetetaan valittu käyttäjä aktiiviseksi ja näytetään kirjahylly
    const getActiveUser = (user) => {
        context.setActiveUser(user)
        toggleShelf(true)
        context.setVisibility(false) // Piilotetaan tilastot
        // context.setBookVisibility(false) // Piilotetaan kirjainfo
    }


    // Päivitetään aktiivisen käyttäjän kirjat
    // const updateBooks = () => {
    //     console.log("update books: ", context.books)
    //     if(context.books.length > 0){
    //         var books = context.books
    //         var duplicate = false
    //         books.forEach(book => {if(book === context.book) duplicate=true})
    //         if(!duplicate) books.push(context.book) // Jos kirja on jo hyllyssä, sitä ei lisätä (joku saattaa tosin lukea saman kirjan uudestaankin..)

            /* axios http-request */
            // axios({method:'put',url:`http://localhost:3001/users/${context.activeUser.id}`,data:{
            //     id: context.activeUser.id,
            //     name: context.activeUser.name,
                
            //     books: books            
                
            // }})
            // .then(response => {
            //     context.setActiveUser(response.data)

            // })
            // .catch(error => {
            //     console.log("Upload error: ", error)
            //     alert('Kirjan lisääminen epäonnistui. Muistitko asettaa käyttäjän aktiiviseksi?')
            // })
    //     }          
    // }
    // useEffect(updateBooks,[context.books])

    // Renderöi käyttäjät sekä kirjahylly
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input ref={name} type="text" placeholder="Syötä uusi käyttäjä" required />
                <input type="submit" value="Lisää" />
            </form>
            <span>Valitse käyttäjä:</span>
            <table className="userTable">
                <thead><tr><th></th><th></th></tr></thead>
                <tbody>
                {
                    context.users.map((item) => (
                        <tr key={item.id}><td onClick={() => getActiveUser(item)}>{item.name}</td><td className="del"><img src={del} alt="poista" onClick={() => deleteUser(item)} /></td></tr>
                    ))
                }
                </tbody>
            </table>
            <p>Valittu käyttäjä:</p> {context.activeUser ? <p><b>{context.activeUser.name}</b></p> : "Käyttäjää ei valittu"}
            {context.activeUser && !context.showStats && <button onClick={() => {context.setVisibility(true);context.setBookVisibility(false)}}>Näytä tilastot</button>}
            {context.showStats && <button onClick={() => context.setVisibility(false)}>Piilota tilastot</button>}
            {showShelf && <Shelf />}
            <button style={{marginTop:'10px'}} onClick={() => {context.storage.clear()}}>Tyhjennä local storage</button>
        </div>
    )
}

export default Users
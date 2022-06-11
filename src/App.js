import React, { useState, useEffect } from 'react';
import './styles/style.css';
import Users from './components/Users';
import Bg from './img/bg.jpeg'
import Search from './components/Search';
import Stats from './components/Stats';
import {AppContext} from './components/AppContext'
import Trending from './components/Trending';

function App() {


  // Kontekstimuuttujat
  const [book, setBook] = useState({})
  const [showStats, setVisibility] = useState(false)
  const [showBookInfo, setBookVisibility] = useState(false)
  const [users, setUsers] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [books, setBooks] = useState([])
  // const [storage, setStorage] = useState(window.localStorage) 

  // Alustetaan local storage
  var storage = window.localStorage
  const initUsers = () => {
    if(!storage.users) storage.users = JSON.stringify([])
    setUsers(JSON.parse(storage.users))
  }
  useEffect(initUsers,[])

  // Kontekstissa välitettävät tiedot
  const values = {
    book: book,
    setBook: setBook,
    showBookInfo: showBookInfo,
    setBookVisibility: setBookVisibility,
    showStats: showStats,
    setVisibility: setVisibility,
    users: users,
    setUsers: setUsers,
    activeUser: activeUser,
    setActiveUser: setActiveUser,
    books: books,
    setBooks: setBooks,
    storage: storage,
    updateUsers: (users) => {
      setUsers(users)
      storage.users = JSON.stringify(users)
    }
  }

  // Sivupalkin asetuksia
  const [arrow, setArrow] = useState("<")
  const [clas, setClas] = useState("sidePanel")
  const [visib, setVisib] = useState("visible")
  
  // Sivupalkin näkyvyyttä hallitaan css-tyylimääreiden avulla
  const handleClick = () => {

    if(arrow === "<") {
      setArrow(">")
      setClas("side-hidden")
      setVisib("hidden")
    } else if(arrow === ">") {
      setArrow("<")
      setClas("sidePanel")
      setVisib("visible")
    }
  }

  // Sovelluksen otsikon klikkaus palauttaa alkunäkymän
  const startPage = () => {
    setBookVisibility(false)
    setVisibility(false)
  }

  // Renderöidään sovellus ja välitetään kontekstitiedot kaikille komponenteille
  return (
    <AppContext.Provider value={values}>
    <div id="bg">
      <img src={Bg} alt="tausta" />
      <div className='master-container' id="container">
        <div onClick={startPage} style={{cursor:'pointer'}}>
          <h1>Ex Libris</h1>
          <h3>-Pidä kirjaa lukemisistasi-</h3>
          <hr />
        </div>
        {!showStats && <div id="search">
        <p className="instruction">Tästä voit hakea lukemasi kirjat, ja ruudun vasemmassa laidassa voit hallinnoida käyttäjiä</p>
          <Search />
          </div>}
        <div id="stats">
          {showStats && <Stats/>}
        </div>
        <div style={{width:'50%', margin:'auto'}}>
          <h4>Yleisimmät aiheet luetuissa kirjoissa:</h4>
          <Trending />
        </div>
      </div>
      <div className={clas}>
        <div id="userSel" style={{visibility: visib}}>
          <Users />
        </div>
        <div className="sideSlide" onClick={handleClick}>{arrow}</div>
      </div>
    </div>
    </AppContext.Provider>
  )
}

export default App

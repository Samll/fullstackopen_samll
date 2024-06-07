import { useState, useEffect } from 'react' 
import './App.css'
import countryRetrieve from './services/countryRetrieve' //{ getAll, getCountry }
import CountryData from './components/CountryData'
import CountryDetails from './components/CountryDetails'
import Search from './components/Search'

function App() {
  const [searchName, setSearchName] = useState("")
  const [countries, setCountries] = useState([]) 
  const [countryCounter, setCountryCounter] = useState(0) 

  useEffect(() => {    
    countryRetrieve
      .getAll()
      .then(countriesList => {     
        setCountries(countriesList) 
      })
  }, [])

  const handleOnChangeName = (event) => {
    console.log("Text in event: ",event.target.value)
    setSearchName(event.target.value);
  }

  return (
    <> 
      <Search name={searchName} onChange={handleOnChangeName} />  
      <CountryData countries={countries} searchName={searchName} setSearchName={setSearchName}/>
    </>
  )
}

export default App

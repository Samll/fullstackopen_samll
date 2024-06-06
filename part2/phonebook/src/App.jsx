import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import NumberList from './components/NumberList'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response => setPersons(response.data))
  },[])

  const addPerson = (event) => {
    event.preventDefault()
    const currentPersons = persons.map(p => p.name)
    const newPerson = {"name":newName, "number":newNumber, "id": persons.length + 1} 
    if (currentPersons.includes(newName) === false) {
      setPersons(persons.concat(newPerson))
      setNewName(""); 
      setNewNumber(""); 
    }else{
      alert(`${newName} already added to numberbook`)
    }

  }

  const handleOnChangeName = (event) => {
    setNewName(event.target.value);  
  }
  const handleOnChangeNumber = (event) => {
    setNewNumber(event.target.value);  
  }
  const handleOnChangeFilterName = (event) => {
    setFilterName(event.target.value);  
  }

  return (
    <div>
      <h2>Numberbook</h2>
      <Filter onChange={handleOnChangeFilterName} value={filterName} />
      <h3>Add a new person</h3>
      <PersonForm 
            addPerson={addPerson} 
            handleOnChangeName={handleOnChangeName} 
            newName={newName} 
            handleOnChangeNumber={handleOnChangeNumber}
            newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <NumberList persons={persons} filter={filterName} />
    </div>
  )
}

export default App
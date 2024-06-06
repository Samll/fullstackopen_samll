import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import NumberList from './components/NumberList'
import personRegister from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    personRegister
      .getAll()
      .then(personsList => setPersons(personsList))
  },[])

  const addPerson = (event) => {
    event.preventDefault()
    const currentPersons = persons.map(p => p.name)
    const newPerson = {"name":newName, "number":newNumber} 
    if (!currentPersons.includes(newName)) {
      personRegister
        .create(newPerson)
        .then(person => {
          setPersons(persons.concat(person))
          setNewName(""); 
          setNewNumber(""); 
        })
    }else{
      if(window.confirm(`${newName} already added to numberbook. Do you want to change its Phone Number?`)){
        const personToEdit = persons.find(p => p.name === newName)
        const editedPerson = {...personToEdit, number: newNumber}
        personRegister
          .update(editedPerson.id,editedPerson)
          .then(updatedPerson =>{
            setPersons(persons.map(person => person.name === newName ? updatedPerson : person))
            setNewName(""); 
            setNewNumber(""); 
          })
      }
    }

  }

  const deletePerson = (id) => { 
    const person = persons.find(p => p.id === id)
    const message = `Do you really want do remove ${person.name}`
    if(window.confirm(message)){
      personRegister
        .remove(id)
        .then(response => {
          setPersons(persons.filter(p => p.id !== id))
        })
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
      <NumberList persons={persons} filter={filterName} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
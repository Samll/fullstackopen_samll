import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import NumberList from './components/NumberList'
import personRegister from './services/persons'
import NotificationHandler from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
          setNotificationMessage(`${person.name} has been created`)
          setTimeout(() => {
            setNotificationMessage(null)
    
          }, 2000)
        })
        .catch(error => {
          setErrorMessage(`${newPerson.name} cannot be created.` + error.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
    
          }, 5000)
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
            setNotificationMessage(`${editedPerson.name} has been updated`)
            setTimeout(() => {
              setNotificationMessage(null)
      
            }, 2000)
          })
          .catch(error => {
            console.log(error)
            setErrorMessage(`${editedPerson.name} cannot be edited, no longer existing in DB`)
            setTimeout(() => {
              setErrorMessage(null)
      
            }, 5000)
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
          setNotificationMessage(`${person.name} has been deleted`)
          setTimeout(() => {
            setNotificationMessage(null)
    
          }, 2000)
        })
        .catch(error => {
          console.log(error)
          setErrorMessage(`${person.name} no longer existing in DB`)
          setTimeout(() => {
            setErrorMessage(null)
    
          }, 5000)

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
      <h1>Mi Agenda de Teléfono</h1>
      <NotificationHandler.Notification message={notificationMessage} />
      <NotificationHandler.ErrorMessage message={errorMessage} />
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
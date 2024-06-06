import { useState, useEffect } from 'react'
import Note from "./components/Note" 
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'


const App = (props) => { 
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowall] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const notesToShow = showAll ? notes : notes.filter(note => note.important === true)

  useEffect(() => {
    noteService
      .getAll()
      .then(response => setNotes(response))
  }, [])  

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }

    noteService
      .create(noteObject)
      .then(initialNotes => {
        setNotes(notes.concat(initialNotes))
        setNewNote("")
      })
  }

  const handleNoteChange = (event) => { 
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id,changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote)) 
      })
      .catch(error => {
        setErrorMessage(`The note "${note.content}" was already deleted from server`)
        setTimeout(() => {
          setErrorMessage(null)
  
        }, 2000)
      })
      setNotes(notes.filter(n => n.id !== id))

    console.log(note)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowall(!showAll)}>
          Show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App


const PersonForm = ({addPerson, handleOnChangeName, newName, handleOnChangeNumber, newNumber}) => {
    return (
        <form onSubmit={addPerson}>
        <div>
          name: <input onChange={handleOnChangeName} value={newName} />
        </div>
        <div>
          phone: <input onChange={handleOnChangeNumber} value={newNumber} />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form> 
    )
}

export default PersonForm
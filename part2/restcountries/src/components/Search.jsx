const Search = ({name, onChange}) => {
    return(
      <form>
        Find Countries containing:
        <input value={name} onChange={onChange}></input>
      </form>
    )
  }  

  export default Search
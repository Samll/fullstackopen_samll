


const Filter = ({onChange,value}) => {
    return(   
        <>
            <label>Filter names containing </label> 
            <input onChange={onChange} value={value} />
      </>     
    )
}

export default Filter
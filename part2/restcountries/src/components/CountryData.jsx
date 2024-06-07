import CountryDetails from './CountryDetails'
    const TableRow = ({country,setSearchName}) =>{
        return(
        <tr>
            <td>
                {country.name.common} 
                <button key={"Set_"+country.name.common} onClick={() => setSearchName(country.name.common)}>Show</button>
            </td>
        </tr>
        )
    
    }
  
  const CountryData = ({countries,searchName, setSearchName}) => {
    if (countries === null){
        return (<></>)
    }
    const filteredCountriesList = countries.filter(country => country.name.common.toLowerCase().includes(searchName.toLowerCase())) 
    const filteredCountriesAmount = filteredCountriesList.length  
    if (filteredCountriesAmount > 10) {
      return(
        <> 
            <p style={{color:"red"}}>Too many countries to display, specify another filter</p>
        </>
      )
    }else if(filteredCountriesAmount === 1){
       return(
        <CountryDetails country={filteredCountriesList} />
        )
    }else{
    return(
        <>
            <table>
                <thead>
                    <tr>
                    <th>Country</th>
                    </tr>
                </thead>
                <tbody>
                {filteredCountriesList.map(country => <TableRow key={country.name.common} country={country} setSearchName={setSearchName} /> )}
                </tbody>
            </table>
        </> 
    )
    }
}

export default CountryData
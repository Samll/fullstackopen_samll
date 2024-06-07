import countryRetrieve from '../services/countryRetrieve' //{ getAll, getCountry }

const CountryDetails = ({country}) => {
    if (country === null){
      return(null)
    }else{
        const filteredCountry = country[0]
        const filteredCountryName = filteredCountry.name.common
        const request = countryRetrieve.getCountry(filteredCountryName)
        const languageKeys = Object.keys(filteredCountry.languages)
        let response = null
        request.then(res => response=res)
        return(
            <div>
                <h1>{filteredCountryName}</h1>
                <p>The Capital name is {filteredCountry.capital[0]}</p>
                <p>Its surface is {filteredCountry.area} km^2</p>
                <p>The following languages are spoken</p>
                <ul>
                    {languageKeys.map(key => <li key={key}>{filteredCountry.languages[key]}</li>)}
                </ul>
                <img src={filteredCountry.flags.png} alt='flag'  width='200'/> 

                
            </div>
          ) 
    }
  }

  export default CountryDetails
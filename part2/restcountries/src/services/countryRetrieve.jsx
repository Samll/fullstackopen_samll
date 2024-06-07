import axios from 'axios'

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/"

const getAll = () => { 
    const totalUrl = `${baseUrl}all`
    const request = axios.get(totalUrl)
    return request.then(response => response.data)
}

const getCountry = (name) => {
    const totalUrl = `${baseUrl}name/${name}`
    const request = axios.get(totalUrl)
    return request.then(response => response.data)
}

export default { getAll, getCountry }
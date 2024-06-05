import { useState } from 'react'

const Header = ({text}) => { 
  return(
    <>
      <h2>{text}</h2>
    </>
  )
}

const Button = ({onClick,text}) => {

  return(
    <>
      <button onClick={onClick}>{text}</button>
    </>
    
  )
}

const StadisticLine = ({stadisticName,stadisticValue}) => {
  return(
    <tr>
      <td>{stadisticName}</td>
      <td>{stadisticValue}</td>
    </tr>
  )
}

const Stadistics = ({goodCounter,neutralCounter,badCounter}) => {
  const allCounters = goodCounter + neutralCounter + badCounter;
  const averageCounters = (goodCounter - badCounter)/allCounters;
  if (allCounters === 0){
    return(
      <>
        <p>Waiting for votes to start</p>
      </>
    )
  }else{
    return(
      <table>
        <thead>
          <tr>
          <th>Parameter</th>
          <th>Value</th>
          </tr>
        </thead>
        <tbody>
        <StadisticLine stadisticName={"Good"} stadisticValue={goodCounter} /> 
        <StadisticLine stadisticName={"Neutral"} stadisticValue={neutralCounter} /> 
        <StadisticLine stadisticName={"Bad"} stadisticValue={badCounter} /> 
        <StadisticLine stadisticName={"All"} stadisticValue={allCounters} /> 
        <StadisticLine stadisticName={"Average"} stadisticValue={averageCounters} /> 
        <StadisticLine stadisticName={"Percentage Bad"} stadisticValue={`${(100*badCounter/allCounters).toFixed(2)}%`} /> 
        <StadisticLine stadisticName={"Percentage Neutral"} stadisticValue={`${(100*neutralCounter/allCounters).toFixed(2)}%`} /> 
        <StadisticLine stadisticName={"Percentage Positive"} stadisticValue={`${(100*goodCounter/allCounters).toFixed(2)}%`} />  
        </tbody>
      </table> 
    )
  }
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleSetGoodClick = () => {
    setGood(good + 1);
  }

  const handleSetNeutralClick = () => {
    setNeutral(neutral + 1);
  }

  const handleSetBadClick = () => {
    setBad(bad + 1);
  }

  return (
    <div>
      <Header text="Give Feedback" />
      <Button onClick={handleSetGoodClick} text={"good"} />
      <Button onClick={handleSetNeutralClick} text={"neutral"} />
      <Button onClick={handleSetBadClick} text={"bad"} />
      
      <Header text="Stadistics" />
      <Stadistics goodCounter={good} neutralCounter={neutral} badCounter={bad} />
    </div>
  )
}

export default App
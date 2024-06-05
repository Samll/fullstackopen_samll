import { useState } from 'react'

const Header = ({text}) => {
  return(
    <>
      <h1>{text}</h1>
    </>
  )
}
const Button = ({onClick,text}) =>{
  return( 
    <button onClick={onClick}>{text}</button>
  )

} 

const Anecdote = ({anecdote,votes,message}) => {
  return(
    <>
      <p>{anecdote}</p>
      <p>{message} {votes}</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const updateSelected = () => {
    setSelected( Math.floor(Math.random()*anecdotes.length));
  
  }

  const voteAnecdote = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    setVotes(newVotes);
  }

  const maxVotes = Math.max(...votes)
  const indexMax = votes.indexOf(maxVotes)

  return (
    <div>
      <Header text="Anecdote of the day" />
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]} message="This anecdote currently has " /> 
      <Button onClick={voteAnecdote} text="Vote" />
      <Button onClick={updateSelected} text="Next anecdote" /> 
      <Header text="Anecdote with most votes" />
      <Anecdote anecdote={anecdotes[indexMax]} votes={maxVotes} message="This anecdote is currently the winner with " /> 
    </div>
  )
}
 

export default App
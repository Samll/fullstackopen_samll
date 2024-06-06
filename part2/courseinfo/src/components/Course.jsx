const Header = ({course}) => { 
    return (
      <>
        <h1>{course.name}</h1>
      </>
    )
  
  }

  const Part = ({name, exercise}) => {
    return (
      <>
        <p>{name} {exercise}</p>
      </>
    )
  }
  
  const Content = ({parts}) => {  
    return (
      <>
        {parts.map(part => <Part key={part.id} name={part.name} exercise={part.exercises} />)} 
        <Total parts={parts}/>
      </>
    )
  
  }
  
  const Total = ({parts}) => {  
    const exercises = parts.map(part => part.exercises)
    const totalExercises = exercises.reduce((sum,val) => sum + val)
    return (
      <>
        <p><b>Number of exercises {totalExercises}</b></p>
      </>
    )
  
  }

  const Course = ({course}) =>{
    return(        
        <div>
            <Header course={course}/>
            <Content parts={course.parts}/>
        </div>
    )

  }
  export default Course
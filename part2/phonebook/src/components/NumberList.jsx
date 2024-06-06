
const DetailedPersonData = ({p, deletePerson}) => {
    return(
        <p key={"Tag" + p.id}>
            {p.id}:{p.name} @ {p.number}
            <button key={"Del" + p.id} onClick={() => deletePerson(p.id)}>Delete</button>
        </p>
    )

}


const NumberList = ({persons, filter, deletePerson}) => {
    const filteredPerson = persons.filter( p => p.name.toLowerCase().includes(filter.toLowerCase()))

    return(
        <>
            {filteredPerson.map(p => <DetailedPersonData key={"Detail"+p.name} p={p} deletePerson={deletePerson}/>)}
        </>
        
    )
}

export default NumberList
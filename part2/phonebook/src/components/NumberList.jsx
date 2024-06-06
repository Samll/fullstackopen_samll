
const DetailedPersonData = ({p}) => {
    return(
        <p key={"A" + p.name}>{p.id}:{p.name} @ {p.number}</p>
    )

}


const PhoneList = ({persons, filter}) => {
    const filteredPerson = persons.filter( p => p.name.toLowerCase().includes(filter.toLowerCase()))

    return(
        <>
            {filteredPerson.map(p => <DetailedPersonData key={"Detail"+p.name} p={p} />)}
        </>
        
    )
}

export default PhoneList
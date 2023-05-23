import React from 'react'
import { useState } from 'react'

const Record = ({ record }) => {
  return (
    <li>{record.name} {record.number}</li>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567', id: 1},
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2},
    { name: 'Dan Abramov', number: '12-43-234345', id: 3},
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilter] = useState('')

  const addPersonWithoutDuplicates = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number : newNumber,
      id: persons.length + 1,
    }
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
    console.log('button clicked', event.target)
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const personsToShow = 
  persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      {/* <div>debug: {newName}</div>
      <div>debug: {newNumber}</div> */}
      <div>
        filter shown with <input 
          onChange={handleFilterChange}
        />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPersonWithoutDuplicates}>
        <div>
          name: 
          <input 
            value={newName}
            onChange={handleNameChange}
          />
        </div>
        <div>
          number:
          <input 
            value={newNumber}
            onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {
        personsToShow.map(person => <Record key={person.name} record={person} />)
        }
      </ul>
    </div>
  )
}

export default App
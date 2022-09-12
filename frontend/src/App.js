import { useState, useEffect } from 'react'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [upDate, setUpDate] = useState(0)
  const [notifMessage, setNotifMessage] = useState(null)
  
  useEffect(() => {
    console.log("Effect")
    personsService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  },[upDate])

  const addNote = (event) =>{
    event.preventDefault()
  
    if (alreadyExists(persons,newName)){
      const noteObject = {name: newName, number:newNumber}
      if (window.confirm(`${newName} already exists, update number?`)) {
        var curr = persons.filter(x => {
          return x.name === newName
        })
        var id = curr[0].id
        personsService
          .update(id,noteObject)
          
      }
      setUpDate(upDate + 1);
      console.log(upDate)
      
      setNotifMessage(`${newName} was updated succesfully`);
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000);

      
    }
    else{
      const noteObject = {name:newName,number:newNumber} 
      personsService
        .create(noteObject)
        .then(response => {
          setPersons(persons.concat(response))
        })
        
        setNotifMessage(`${newName} was added succesfully`);
        setTimeout(() => {
          setNotifMessage(null)
        }, 5000);
    }    
  }

  const appRemove = (id,name) =>{
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      personsService
      .remove(id)
      
      .catch(error => {
        setNotifMessage("Data already removed from server");
      })
      setUpDate(upDate + 1);
      
      if (notifMessage != "fail"){setNotifMessage(`${name} was removed succesfully`);
      setTimeout(() => {
        setNotifMessage(null)
      }, 5000);}

      else{
        setNotifMessage(`${name} already removed from database`)
      }
    }
  }

  return (
    <div>
      <Notification message={notifMessage} />
      <h2>Phonebook</h2>
      <div>
        filter shown with: <input onChange={event => setFilterName(event.target.value)}/>
      </div>
      <h2>Add a new number</h2>
      <form onSubmit={addNote}>
        <div>
          name: <input onChange={event => setNewName(event.target.value)} />
        </div>
        <div>number: <input onChange={event => setNewNumber(event.target.value)}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {<GetEm names={[persons,setPersons]} filter={[filterName, setFilterName]} appRemove={appRemove}/>}
    </div>
  )
}

const GetEm = (props) =>{
  const appRemove = props.appRemove
  var lista = props.names[0]
  const filter = props.filter[0]

  if (filter.length > 0){
    var lista = filterPhoneBook(lista,filter);
    }
  
  return(
      <div>
          {lista.map(nimi =>{
            return(
              <div key={nimi.name}>
                <p>{nimi.name} {nimi.number}<button onClick={() => appRemove(nimi.id,nimi.name)}>Delete</button></p>
              </div>
            )
          })}  
      </div>
    )
}

const notificationStyle = {
  color: 'red',
  fontStyle: 'bold',
  fontSize: 36,
  backgroundColor: 'yellow',
  padding: 50,
  fontFamily: "Comic Sans MS",
  borderStyle: 'double',
  borderWidth: 15,
  borderColor: 'green',
  borderRadius: 15
  }

const failNotificationStyle = {
  color: 'blue',
  fontStyle: 'bold',
  fontSize: 36,
  backgroundColor: 'red',
  padding: 50,
  fontFamily: "Comic Sans MS",
  borderStyle: 'double',
  borderWidth: 15,
  borderColor: 'green',
  borderRadius: 16
  }

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if (message === "Data already removed from server"){
    return (
      <div style={failNotificationStyle}>
        {message}
      </div>
    )

  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

function alreadyExists (array,name){
  return array.some(function(check) {
    return check.name.toUpperCase() === name.toUpperCase();
  }); 
}

function filterPhoneBook(array, string) {
  return array.filter(v =>
      Object.keys(v).some(k => v[k].toString().toLowerCase().includes(string.toLowerCase())));
}

export default App

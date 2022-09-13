const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())

const cors = require('cors')

app.use(express.static('build'))



morgan.token('body', (req)=>JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));


let persons = [
    {
        "name": "Artsa Kallio",
        "number": "39-44-434543543",
        "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    },
    {
      "name": "Petteri Vasikka",
      "number": "040-342423",
      "id": 5
    },
    {
      "name": "Dan Maarhuust",
      "number": "055-49027432",
      "id": 6
    },
    {
      "name": "Veera Vallen",
      "number": "4324324",
      "id": 7
    },
    {
      "name": "Basilika Leipä",
      "number": "045-4832094",
      "id": 8
    },
    {
      "name": "Jaakko Hintikka ",
      "number": "044-4206969",
      "id": 9
    },
    {
      "name": "Uuli Uuno",
      "number": "040-5523023",
      "id": 10
    }
  ]

app.get('/',(req, res) => {
  res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)

})

app.post('/api/persons', function (req, res) {
    const randID = Math.floor(Math.random() * 19999);
    const body = req.body
    console.log("backend")

    if (!body.name) {
      return res.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
      return res.status(400).json({ 
        error: 'number missing' 
      })
    }

    if (persons.find(e => e.name === body.name)){
      return res.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    else {
      res.send({name:body.name,number:body.number,id:randID})
    }
    
    })

app.get('/info', (req, res) => {
    const length = persons.length;
    const d = new Date();
    let time = d
    res.send(`Phonebook has ${length} contacts </br>${time}`)
    })

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    res.json(person)
    })

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    
    res.status(204).end()
    })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
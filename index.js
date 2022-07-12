const express = require('express')
const morgan = require('morgan')
const cors = require("cors")
const PORT = process.env.PORT || 3001

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
//
morgan.token('custom', function(req, res){
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'))
//

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const info = `<p>Phonebook has info for ${persons.length} people</p>
              <p>${new Date()}</p>
`
app.get('/info', (request, response) => {
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id )
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    valid_id = persons.some(person => person.id === id)
    persons = persons.filter(person => person.id !== id)
    console.log(valid_id)
    if (valid_id){
        response.json(persons) 
    }else{
        console.log('Invalid id')
        return response.status(400).json({ 
            error: `The person with the id: ${id} does not exist ` 
        }).end()  
    }
    
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const number = request.body.number
    persons = persons.map(person => person.id !== id ? person: {...person, number:number})
    response.json(persons)
})

const generateId = () => {
    const id = Math.floor(Math.random()*1000000 + 1)
    return id
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({ 
        error: 'contact missing' 
        })
    }

    if (persons.some(person => person.name === body.name)){
        console.log('Duplicate found')
        return response.status(400).json({ 
        error: 'name must be unique' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)
    response.json(person)
})

//const PORT = 3001

app.listen(PORT, () => {
    console.log(`Phonebook server running at port ${PORT}`)
})

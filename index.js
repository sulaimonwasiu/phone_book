require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require("cors")

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
//
morgan.token('custom', function(req, res){
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :custom'))


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
    Person.find({}).then(result => {
        response.json(result)
    })
    
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if(person){
            response.json(person)
        }else{
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
   Person.findByIdAndRemove(request.params.id)
   .then(result => {
        console.log(result)
        //response.status(204).end()
        Person.find({})
        .then(result => {
            response.json(result)
        })
   })
   .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    /*
    const id = request.params.id
    const number = request.body.number
    persons = persons.map(person => person.id !== id ? person: {...person, number:number})
    response.json(persons)
    */
    const id = request.params.id
    const {body, number} = request.body

    Person.findByIdAndUpdate(id, {body, number}, 
        {new:true, runValidators: true, context: 'query'})
    .then(updatedNote => {
        console.log(updatedNote)
        Person.find({})
        .then(result => {
            response.json(result)
        })
    })
    .catch(error => next(error))

})


  
app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    
    person.save().then(personSaved => {
        response.json(personSaved)
    })
    .catch(error => {
        console.log(error.name)
        next(error)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    
  
    next(error)
  }

app.use(errorHandler)


app.listen(PORT, () => {
    console.log(`Phonebook server running at port ${PORT}`)
})

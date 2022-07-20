const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://m001-student:${password}@sandbox.8eola.mongodb.net/contactApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
name: String,
number: String
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}else if (process.argv.length === 3){
    //console.log('Listing the all contacts of persons')
    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')
        console.log('phonebook:')
        Person.find({})
        .then(persons => {
            persons.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
    }).catch(err => console.log(err))
}else {

    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')

        const person = new Person({
        name: name,
        number: number
        })

        return person.save()
    })
    .then((person) => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))

}


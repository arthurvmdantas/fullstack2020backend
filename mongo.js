const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

let url = `mongodb+srv://fullstack:${password}@cluster0.xpemf.mongodb.net/phonebook-app`;
url += `?retryWrites=true&w=majority`;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const schemaPerson = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', schemaPerson);

if (process.argv.length < 5) {
    Person.find({}).then(result => {
        result.forEach(n => console.log(n));
        mongoose.connection.close();
        process.exit(1);
    });
}

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({ name, number });

person.save()
    .then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    })
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const app = express();
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :body'));
app.use(express.static('build'));

morgan.token('body', (req, res) => JSON.stringify(req.body));

let persons = [
    {
        id: 1,
        name: 'Arti Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
];

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(result => {
            res.json(result);
        })
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(e => e.id === id);

    if (!person)
        res.status(404).end();
    else
        res.json(person);
});

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(e => e.id !== id);

    res.json(persons);
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.hasOwnProperty("name") || !body.hasOwnProperty("number"))
        return res.json({ error: "'name' and 'number' are required" });

    const person = new Person({
        name: body.name,
        number: body.number
    });

    person.save()
        .then(result => {
            res.json(result);
        })
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
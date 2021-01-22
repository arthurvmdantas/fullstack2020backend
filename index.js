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

app.get('/info', (req, res, next) => {
    Person.estimatedDocumentCount((error, result) => {
        if (error)
            next(error);
        else
            res.send(`<p>Phonebook has info for ${result} people</p><p>${new Date()}</p>`)
    })
});

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(result => {
            res.json(result);
        })
});

app.get('/api/persons/:id', async (req, res) => {
    try {
        const person = await Person.findById(req.params.id);

        if (!person)
            res.status(404).end();
        else
            res.json(person);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: "malformatted id" });
    }
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => next(error))
});

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    Person.findByIdAndUpdate(req.params.id, body, { new: true })
        .then(updatedNote => {
            res.json(updatedNote);
        })
        .catch(error => next(error));
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

// 404
app.use((req, res) => {
    res.status(404).send({ error: "unkown endpoint" });
});

// error handling middleware
app.use((err, req, res, next) => {
    console.log(err.message);

    if (err.name === 'CastError')
        return res.status(400).send({ error: "malformatted id" });

    next(error);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
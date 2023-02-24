// IMPORTS AT THE TOP
const express = require('express');
const Dog = require('./dog-model.js')
// INSTANCE OF EXPRESS APP
const server = express();
// GLOBAL MIDDLEWARE
server.use(express.json());
// ENDPOINTS
server.get('/hello-world', (req, res) => {
    res.status(200).json({ message: "hello, world" })
});
// [GET]    /             (Hello World endpoint)
server.get('/api/dogs', async (req, res) => {
    try {
        const dogs = await Dog.findAll()
        res.status(200).json(dogs) 
    } catch(err) {
        res.status(500).json({ message: `Something horrible ${err.message}!` })
    }
})
// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
server.get(`/api/dogs/:id`, async (req, res) => {
    try {
        const {id} = req.params;
        const dog = await Dog.findById(id)

        if (!dog) {
            res.status(404).json({message: `No dog with ID: ${id} can be found!`})
        } else {
            res.status(200).json(dog)
        }
    } catch(err) {
        res.status(500).json({ message: `Problem finding dog ${req.params.id}`})
    }
})
// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
server.post('/api/dogs', async (req, res) => {
    try {
        const {name, weight} = req.body;
        if (!name || !weight) {
            res.status(422).json({message: 'dog needs name and weight'})
        } else {

            const createdDog = await Dog.create({name, weight}) 
            
            res.status(201).json({
                message: 'success creating dog',
                data: createdDog
            })
        }
    } catch(err) {
        res.status(500).json({message: `Problem creating dog: ${err.message}!`})
    }
})
// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
server.put('/api/dogs/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const tempDog = await Dog.findById(id)
        const {name, weight} = req.body;
        if (!tempDog) {
            res.status(404).json({message: 'No mut found by that shit you put in!'})
        } else if (!name || !weight) {
            res.status(422).json({message: 'You fuckin up stupid'});
        } else {
            const dog = await Dog.update(id, {name, weight});
            res.status(202).json({
                message: "Mut Updated",
                data: dog
            })
        }
    } catch(err) {
        res.status(500).json({message: `Yo You Fucked Up Something ${err.message}`})
    }
})
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
server.delete('/api/dogs/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const deletedDog = await Dog.delete(id);
        if (!deletedDog) {
            res.status(404).json({message: "We can't seem to find that bitch!"})
        } else {
            
            res.json({
                message: 'Bitch Deleted',
                data: deletedDog
            })
        }
    } catch(err) {
        res.status(500).json({message: "You Stupid Ass!"})
    }
})
// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server;
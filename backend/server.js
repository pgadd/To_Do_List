const express = require("express");
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let todos = [
    { id: 1, text: 'Learn about Express.js', completed: false },
    { id: 2, text: 'Build a REST API', completed: false }
];

app.get("/", (req, res) => {
    res.send("Welcome to the api!");
})

app.get('/todos', (req, res) => {
    res.json(todos)
})

app.post('/todos', (req, res) => {
    const data = req.body;

    data.id = todos.length > 0 ? todos[todos.length -1].id +1 : 1;

    todos.push(data);

    res.status(201).json(data)
});

app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;

    const index = todos.findIndex(todo => todo.id == id);

    if(index !== -1){
        todos[index] = {...todos[index], ...updatedData, id: id};
        res.json(todos[index]);
    } else {
        res.status(400).send("To-do item not found");
    }

})

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = todos.findIndex(todo => todo.id == id);

    if (index !== -1){
        todos.splice(index, 1);
        res.status(200).send("Deleted the message");
    } else {
        res.status(400).send("Coudldn't find item to delete");
    }

})


app.listen(port, () => {
    console.log("server running on http://localhost:" + port)
});

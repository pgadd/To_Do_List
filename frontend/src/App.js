import logo from './logo.svg';
import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [modal, setModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [updatedTodo, setUpdatedTodo] = useState(editingTodo);

  useEffect(() => {
    fetch("http://localhost:3001/todos")
    .then(response => {
      return response.json() //response is converted to json before we can use it in this scenario
    })
    .then(data => setTodos(data))
  }, []);

    useEffect(() => {
    if (editingTodo) {
      setUpdatedTodo(editingTodo.text);
    }
  }, [editingTodo]);

  console.log(todos)
  console.log(input)

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/todos", {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({text: input})
    })
    .then(response => response.json())
    .then(data => {
      setTodos([...todos, data])
    });

    setInput("")
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/todos/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id: id})
    })
    .then(response => { 
      if(response.ok) {
        setTodos(todos.filter(todo => todo.id !== id))
      } else{
        console.error("Unable to delete item")
      }
    }
    )
  }

  const handleUpdate = (id) => {
    setEditingTodo(todos.find(todo => todo.id == id));
    setUpdatedTodo(editingTodo);
    setModal(true);

    todos.map(todo => todo.id == id ? {...todo, text: editingTodo} : todo)

  }

  const handleUpdateSubmit = (id) => {
    fetch(`http://localhost:3001/todos/${id}`, {
      method: "PUT", 
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text: updatedTodo})
    })
    .then(response => response.json())
    .then(data => {
      setTodos(todos.map(todo => todo.id == id ? data : todo));
      setModal(false);
      setEditingTodo(null);
      setUpdatedTodo("");
    })
  }

  return (
    <div className="App">
      <h1>My To-Do-App</h1>
      <form onSubmit={handleSubmit}> 
        <input type="text" value={input} onChange={e => setInput(e.target.value)}/>
        <button type="submit">Submit</button>
      </form>

      {modal && (
        <div style={{background: "rgba(0, 217, 255, 1)", marginLeft: "40%", marginRight: "40%"}}>
          <div className="modal-content">
            <h3>Update To-DO</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateSubmit(editingTodo.id); }}>
              <input type="text" value={updatedTodo} onChange={e => setUpdatedTodo(e.target.value)}/>
              <button type="submit">Update</button>
              
            </form>
            <button onClick={() => setModal(false)}>Close</button>
            
          </div>
        </div>)}

      { todos.map(todo => (<div style={{display: "flex", justifyContent: "center"}}>
        <p key={todo.id}>{todo.text}</p>
        <button style={{height: "2px", paddingTop: "5px", paddingBottom: "20px", marginTop: "10px", marginLeft: "5px"}} onClick={() => handleUpdate(todo.id)}>🔄</button>
        <button style={{height: "2px", paddingTop: "5px", paddingBottom: "20px", marginTop: "10px", marginLeft: "5px"}} onClick={() => handleDelete(todo.id)}>❌</button>
        </div>)) }
    </div>
  );
}

export default App;

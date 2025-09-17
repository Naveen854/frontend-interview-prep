require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const todos = [
  {
    id: "1",
    title: "Learn REST API",
    completed: false,
  },
  {
    id: "2",
    title: "Learn Communication Protocols",
    completed: false,
  },
];

app.get("/todos", async function (req, res) {
  return res.status(200).json(todos);
});

app.post("/todos", async function (req, res) {
  const { title, completed = false } = req.body;
  const todoItem = { id: (todos.length+1).toString(), title, completed };
  todos.push(todoItem);
  return res
    .status(201)  
    .json({ message: "Created new todo", status: "success", data: todoItem });
});

app.get("/todos/:id", async function (req, res) {
    const todoId = req.params.id;
    if (!todoId) {
      return res
        .status(400)
        .json({ message: "Missing todoId", status: "failure", data: null });
    }
    
    const todo = todos.find((todo) => todo.id === todoId);
    if (todo === undefined) {
      return res
        .status(404)
        .json({ message: "No todo item found", data: null, status: "failure" });
    }
    return res.status(200).json({
      message: "Successfully found todo item",
      data: todo,
      status: "success",
    });
});

app.put("/todos/:id",async function(req,res){
    const todoId = req.params.id
    const {title,completed} = req.body
    const todoIndex = todos.findIndex(todo => todo.id === todoId)
    if(todoIndex === -1){
        return res.status(404).json({message:"No todo item found to update",status:"failure",data:null})
    }
    let todoItem = todos[todoIndex]
    if(!!title && typeof title === "string" && title !== todoItem.title){
        todoItem.title = title
    }
    if(typeof completed === "boolean" && completed !== todoItem.completed){
        todoItem.completed = completed
    }
    todos.splice(todoIndex,1,todoItem)
    console.log("TODOS",todos)
    return res.status(200).json({message: 'Successfully updated todo item',status:"success"})
})

app.listen(PORT, () => {
  console.log(`Application Running on port: ${PORT}`);
});

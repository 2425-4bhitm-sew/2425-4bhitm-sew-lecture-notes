import { ToDo } from "./features/todo/todo"
import { loadAllToDos } from "./features/todo/todo-service"
import {model} from "./features/todo/model";
console.log("Hello World!")

start()

async function start() {
    model.todos = await loadAllToDos()
    console.log("todos: ", model.todos)
    console.log("myName: ", model.myName)
    const body = document.querySelector("body")
    render(body, model.todos)  // Problem: das rendern muss angestossen werden
    // Abhilfe: wir brauchen das Observer Pattern für JS
}

function render(base: HTMLElement, todos: ToDo[]) {
    const div = document.createElement("div")

    function createRow(toDo: ToDo) {
        const rowDivHtml = /*html*/`
            <div class="todo">${toDo.title}</div>
        `
        const rowDiv = document.createElement("div")
        rowDiv.innerHTML = rowDivHtml
        div.appendChild(rowDiv)
    }
    todos.forEach(createRow)   
    base.appendChild(div) 
}


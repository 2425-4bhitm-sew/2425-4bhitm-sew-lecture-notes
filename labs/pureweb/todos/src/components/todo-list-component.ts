import {subscribe} from "../features/todo/model";
import {ToDo} from "../features/todo/todo";

class TodoListComponent extends HTMLElement {
    connectedCallback(){
        console.log("Juhu connected")
        subscribe(model => {
            console.log("todos: ", model.todos)
            console.log("myName: ", model.myName)
            render(this, model.todos)
        })
    }
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

customElements.define("todo-list", TodoListComponent)
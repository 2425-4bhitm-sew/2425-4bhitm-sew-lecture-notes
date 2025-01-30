import { ToDo } from "./features/todo/todo"
import { loadAllToDos } from "./features/todo/todo-service"
import {model, subscribe} from "./features/todo/model";
import "./components/todo-list-component"
console.log("Hello World!")

subscribe(model => {console.log("model changed: ", model)})
window.addEventListener("DOMContentLoaded", start);


function start() {
    loadAllToDos()
}




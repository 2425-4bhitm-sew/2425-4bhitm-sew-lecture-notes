import { ToDo } from "./todo"
import {model} from "./model";

const BASE_URL = "https://jsonplaceholder.typicode.com"

export async function loadAllToDos() {
    const response = await fetch(`${BASE_URL}/todos`)
    const todos = await response.json() as ToDo[]
    //return todos
    model.todos = todos
}
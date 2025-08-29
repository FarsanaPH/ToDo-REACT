import { commonApi } from "./CommonApi"
import { serverURL } from "./ServerURL"

// Add ToDo
export const addToDoAPI = async(reqBody) => {
    return commonApi("POST",`${serverURL}/todos`,reqBody)
}

// get all ToDo
export const getAllToDoAPI = async() => {
    return commonApi("GET",`${serverURL}/todos`)
}

// Delete a ToDo
export const DeleteToDoAPI = async(id) => {
    return commonApi("DELETE",`${serverURL}/todos/${id}`)
}

// Edit a ToDo
export const getEditToDoAPI = async(id) => {
    return commonApi("GET",`${serverURL}/todos/${id}`)
}

// Update a ToDo
export const updateToDoAPI = async(id,reqBody) => {
    return commonApi("PUT",`${serverURL}/todos/${id}`,reqBody)
}
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'

import { parseUserId } from '../auth/utils'
const bucketName = process.env.IMAGES_S3_BUCKET
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]>{
	let userId = parseUserId(jwtToken)
	return todoAccess.getAllTodos(userId)
}

export async function createTodo(newTodo: CreateTodoRequest, 
	jwtToken: string):Promise<TodoItem>{
	const todoId = uuid.v4()
	let userId = parseUserId(jwtToken)
	const todo = {
		userId:userId,
		todoId: todoId,
		createdAt: new Date().toLocaleString(),
		done: false,
		attachmentUrl:`https://${bucketName}.s3.amazonaws.com/${todoId}`,
		...newTodo
	}


   return todoAccess.createTodo(todo)
}

export async function deleteTodo(todoId: string): Promise<boolean>{
   let flag=true;

   const validTodoId = await todoAccess.todoExist(todoId)
     if(validTodoId){
     	const result = todoAccess.deleteTodo(todoId)
     	flag = (result)? true: false;

     }else{
     	flag= false;
     }

	return (flag)?true:false;
}


export async function updateTodo(todoId: string, updatedTodo: UpdateTodoRequest ): Promise<boolean>{
   let flag=true;

   const validTodoId = await todoAccess.todoExist(todoId)
     if(validTodoId){
     	const result = todoAccess.updateTodo(todoId, updatedTodo)
     	flag = (result)? true: false;
     	
     }else{
     	flag= false;
     }

	return (flag)?true:false;
}
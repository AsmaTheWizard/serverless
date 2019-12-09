import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'


import { createTodo } from '../../businessLogic/todos'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("start of create")
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const todo = await createTodo(newTodo, jwtToken)


    if(todo){
    return{
      statusCode: 200,
      headers:{
        'Access-Control-Allow-Origin':'*',
         'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item:{
          todoId: todo.todoId,
          createdAt: todo.createdAt,
          name: todo.name,
          dueDate: todo.dueDate,
          done: todo.done,
          attachmentUrl: todo.attachmentUrl
        }
      })
    }
  }
  return {
    statusCode: 404,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body:''
  }
  
}

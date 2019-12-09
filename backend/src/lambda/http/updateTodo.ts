import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const todoId = event.pathParameters.todoId
	const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

	const validTodoId = await updateTodo(todoId, updatedTodo)

	if(! validTodoId){
		return{
			statusCode: 404,
			headers:{
				'Access-Control-Allow-Origin':'*'
			},
			body: JSON.stringify({
				error: 'Todo does not exist'
			})
		}
	}else{
		return{
			statusCode: 200,
			headers:{
				'Access-Control-Allow-Origin': '*'
			},
			body: ""
		}
	}





}


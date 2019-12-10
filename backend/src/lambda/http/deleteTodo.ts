import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteTodo } from '../../businessLogic/todos'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const todoId = event.pathParameters.todoId
	const authorization = event.headers.Authorization
	const split = authorization.split(' ')
	const jwtToken = split[1]
	const result = await deleteTodo(todoId, jwtToken)

	if(result){
		return{
			statusCode: 201,
			headers:{
				'Access-Control-Allow-Origin': '*'
			},
			body: ""
		}
	}else{
		return{
			statusCode: 400,
			headers:{
				'Access-Control-Allow-Origin': '*'
			},
			body: "issue"
		}
	}

}


import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {
	constructor (
		private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
		private readonly  todoTable = process.env.GROUPS_TABLE,
		private readonly  userIdIndex = process.env.USER_ID_INDEX) {
	}

	async getAllTodos(userId: string): Promise<TodoItem[]> {

		const result = await this.docClient.query({
			TableName: this.todoTable,
			IndexName: this.userIdIndex,
			KeyConditionExpression: 'userId = :userId',
			ExpressionAttributeValues:{
				':userId': userId
			}
		}).promise()

		const todos = result.Items

		return todos as TodoItem[]
	}


	async createTodo(todo: TodoItem): Promise<TodoItem>{
		await this.docClient.put({
			TableName: this.todoTable,
			Item: todo
		}).promise()

		return todo
	}

	async deleteTodo(todoId: string, userId:string): Promise<boolean>{
		await this.docClient.delete({
			TableName: this.todoTable,
			Key:  {"todoId":todoId.toString(), "userId":userId.toString()}
		}).promise()

		return true;
	}

	async todoExist(todoId: string, userId: string){
		const result = await this.docClient
		.get({
			TableName: this.todoTable,
			Key: {
				todoId, userId
			}
		}).promise()

		return !!result.Item
	}


	async updateTodo(todoId: string, updatedTodo: TodoUpdate, userId: string): Promise<boolean>{
		 await this.docClient.update({
			TableName: this.todoTable,
			Key:  {"todoId":todoId.toString(), "userId":userId.toString()},
			UpdateExpression: 'set #n = :name, dueDate = :dueDate, done = :done',
			ExpressionAttributeNames:{
				'#n': 'name',
			},
			ExpressionAttributeValues:{
				":name":updatedTodo.name,
				":dueDate":updatedTodo.dueDate,
				":done":updatedTodo.done
			},

		}).promise()

		return true;
	}
}
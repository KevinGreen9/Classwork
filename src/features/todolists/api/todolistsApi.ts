import {instance} from "../../../common/instance";
import {Todolist, TodolistAttributes} from "./todolistsApi.types.ts";
import {ApiResource, BaseResponse} from "../../../common/types";

const toTodolist = ({ id, attributes }: ApiResource<TodolistAttributes>): Todolist => ({
    id,
    ...attributes,
})
export const todolistsApi = {
   async getTodolists() {
     const res =  await instance.get<BaseResponse<ApiResource<TodolistAttributes>[]>>(`/boards/my`)
         return  res.data.data.map(toTodolist)
   },
    async changeTodolist(payload: {id: string, title: string}) {
       const {id, title} = payload
       const res =  await instance.patch<BaseResponse<ApiResource<TodolistAttributes>>>(`/boards/${id}`, {
           data: {type: "boards", attributes: { title }},
       })
        return toTodolist(res.data.data)
    },
    async createTodolist(title: string) {
        const res = await instance.post<BaseResponse<ApiResource<TodolistAttributes>>>("/boards", {
            data: {type: 'boards', attributes: {title}},
        });
        return toTodolist(res.data.data);
    },
   async deleteTodolist(id: string) {
       await instance.delete(`/boards/${id}`)
    }

}
import {instance} from "../../../common/instance";
import {DomainTask, GetTasksResponse, TaskAttributes, UpdateTaskModel} from "./tasksApi.types.ts";
import {ApiResource, BaseResponse} from "../../../common/types";

const toDomainTask = ({ id, attributes }: ApiResource<TaskAttributes>, todolistId: string): DomainTask => ({
    id,
    ...attributes,
    todolistId,
})

export const tasksApi = {
    async getTasks(todolistId: string) {
        const res = await instance.get<GetTasksResponse>(`/boards/${todolistId}/tasks`);
        return res.data.data.map((task) => toDomainTask(task, todolistId));
    },
    async createTask(payload: { todolistId: string, title: string }) {
        const {todolistId, title} = payload
        const res = await instance.post<BaseResponse<ApiResource<TaskAttributes>>>(`/boards/${todolistId}/tasks`, {
            data: {type: "tasks", attributes: {title}},
        });
        return toDomainTask(res.data.data, todolistId);
    },
   async updateTask(payload: { todolistId: string, taskId: string, model: UpdateTaskModel }) {
        const {todolistId, taskId, model} = payload
        const res = await instance.patch<BaseResponse<ApiResource<TaskAttributes>>>(`/boards/${todolistId}/tasks/${taskId}`, {
            data: {type: "tasks", attributes: model},
        });
           return toDomainTask(res.data.data, todolistId)
    },
    async deleteTask(payload: { todolistId: string, taskId: string }) {
        const {todolistId, taskId} = payload
        await instance.delete(`/boards/${todolistId}/tasks/${taskId}`)
    }
}
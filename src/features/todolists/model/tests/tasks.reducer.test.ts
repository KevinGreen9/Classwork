import {changeTaskStatusTC, changeTaskTitleTC, createTaskTC, deleteTaskTC, tasksReducer} from "../tasksSlice.ts";
import {beforeEach, expect, test} from 'vitest';
import {TaskPriority, TaskStatus} from "../../../../common/enums";
import {DomainTask} from "../../api/tasksApi.types.ts";

const taskDefaultValues = {
    deadline: null,
    addedAt: "",
    updatedAt: "",
    startDate: null,
    priority: TaskPriority.Low,
    order: 0,
}

let startState: Record<string, DomainTask[]>

 beforeEach(() => {
   startState = {
        todolistId1: [
            {
                id: "1",
                title: "CSS",
                status: TaskStatus.New,
                todolistId: "todolistId1",
                ...taskDefaultValues,
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatus.Completed,
                todolistId: "todolistId1",
                ...taskDefaultValues,
            },
            {
                id: "3",
                title: "React",
                status: TaskStatus.New,
                todolistId: "todolistId1",
                ...taskDefaultValues,
            },
        ],
        todolistId2: [
            {
                id: "1",
                title: "bread",
                status: TaskStatus.New,
                todolistId: "todolistId2",
                ...taskDefaultValues,
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatus.Completed,
                todolistId: "todolistId2",
                ...taskDefaultValues,
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatus.New,
                todolistId: "todolistId2",
                ...taskDefaultValues,
            },
        ],
    }
})
test('correct task should be removed', () => {
    const payload = { todolistId: 'todolistId2', taskId: '2' };
    const endState = tasksReducer(
        startState,
        deleteTaskTC.fulfilled(payload, 'requestId',payload));

    expect(endState['todolistId2'].length).toBe(2);
    expect(endState['todolistId2'].find(t => t.id === '2')).toBeUndefined();
    expect(endState['todolistId1'].length).toBe(3);
    expect(Object.keys(endState)).toHaveLength(2);
})

test('correct task should be added', () => {
    let newTask = "Good"
    const createdTask = {
        id: '4',
        title: newTask,
        status: TaskStatus.New,
        todolistId: 'todolistId2',
        ...taskDefaultValues,
    };


    const endState = tasksReducer(
        startState,
        createTaskTC.fulfilled( {task: createdTask},'requestId', {todolistId: 'todolistId2', title: newTask} ));

    expect(endState['todolistId2']).toHaveLength(4);
    expect(endState['todolistId2'][0].title).toBe("Good");
    expect(endState['todolistId2'][0].status).toBe(TaskStatus.New);
    expect(endState['todolistId2'][0].id).toBeDefined();

})

test('correct task should be change the status', () => {
    let newTaskStatus =  TaskStatus.Completed ;
    const arg = { todolistId: 'todolistId2', taskId: '2', status: newTaskStatus };

    const updatedTask: DomainTask = {
        ...startState['todolistId2'][1],
        status: newTaskStatus,
    };

    const endState = tasksReducer(
        startState,
        changeTaskStatusTC.fulfilled({task: updatedTask},'requestId', arg ));

    expect(endState['todolistId2'].find(t => t.id === '2')?.status).toBe(TaskStatus.Completed);

})

test('correct task should be change the title', () => {
    let newTaskTitle = "SportPit"  ;
    const arg = { todolistId: 'todolistId2', taskId: '2', title: newTaskTitle };

    const changedTask: DomainTask = {
        ...startState['todolistId2'][1],
        title: newTaskTitle,
    };

    const endState = tasksReducer(
        startState,
        changeTaskTitleTC.fulfilled({task: changedTask }, 'requestId', arg));

    expect(endState['todolistId2'].find(t => t.id === '2')?.title).toBe("SportPit");

})


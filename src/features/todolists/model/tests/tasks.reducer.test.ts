import {v1} from "uuid";
import { TaskStateType} from "../../../../AppWithReducer.tsx"
import {
    AddTaskAC,
    ChangeTaskStatusAC,
    ChangeTaskTitleAC,
    RemoveTaskAC,
    tasksSlice
} from "../tasks.slice.ts";
import {expect, test} from 'vitest';


test('correct task should be removed', () => {
    const todolistId_1 = v1()
    const todolistId_2 = v1();
    const taskIdRemove = v1();

    const startState: TaskStateType = {
            [todolistId_1]: [
                {id: v1(), title: "HTML&CSS", isDone: true},
                {id: v1(), title: "JS", isDone: true},
                {id: v1(), title: "ReactJS", isDone: false},
                {id: v1(), title: "Rest API", isDone: false},
                {id: v1(), title: "GraphQL", isDone: false}
            ],
            [todolistId_2]: [
                {id: v1(), title: "Travel", isDone: true},
                {id: taskIdRemove, title: "Shopping", isDone: true},
                {id: v1(), title: "Study", isDone: false},
                {id: v1(), title: "Relax", isDone: false},
                {id: v1(), title: "Sport", isDone: false}
            ]
        }


    const endState = tasksSlice(startState, RemoveTaskAC(todolistId_2, taskIdRemove));

    expect(endState[todolistId_2].length).toBe(4);
    expect(endState[todolistId_2].find(t => t.id === taskIdRemove)).toBeUndefined();
    expect(endState[todolistId_1].length).toBe(5);
    expect(Object.keys(endState)).toHaveLength(2);
})

test('correct task should be added', () => {
    const todolistId_1 = v1()
    const todolistId_2 = v1();
    let newTask = "Good"

    const startState: TaskStateType = {
        [todolistId_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false}
        ],
        [todolistId_2]: [
            {id: v1(), title: "Travel", isDone: true},
            {id: v1(), title: "Shopping", isDone: true},
            {id: v1(), title: "Study", isDone: false},
            {id: v1(), title: "Relax", isDone: false},
            {id: v1(), title: "Sport", isDone: false}
        ]
    }
    const endState = tasksSlice(startState, AddTaskAC(todolistId_2, newTask));

    expect(endState[todolistId_2]).toHaveLength(6);
    expect(endState[todolistId_2][5].title).toBe("Good");
    expect(endState[todolistId_2][5].isDone).toBe(false);
    expect(endState[todolistId_2][5].id).toBeDefined();

})

test('correct task should be change the status', () => {
    const todolistId_1 = v1()
    const todolistId_2 = v1();
    const taskIdToChange = v1();

    const startState: TaskStateType = {
        [todolistId_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false}
        ],
        [todolistId_2]: [
            {id: v1(), title: "Travel", isDone: true},
            {id: v1(), title: "Shopping", isDone: true},
            {id: v1(), title: "Study", isDone: false},
            {id: v1(), title: "Relax", isDone: false},
            {id: taskIdToChange, title: "Sport", isDone: false}
        ]
    }

    let newTaskStatus = true  ;

    const endState = tasksSlice(startState, ChangeTaskStatusAC(todolistId_2, taskIdToChange, newTaskStatus ));

    expect(endState[todolistId_2].find(t => t.id === taskIdToChange)?.isDone).toBe(true);




})

test('correct task should be change the title', () => {
    const todolistId_1 = v1()
    const todolistId_2 = v1();
    const taskIdToChange = v1();

    const startState: TaskStateType = {
        [todolistId_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false}
        ],
        [todolistId_2]: [
            {id: v1(), title: "Travel", isDone: true},
            {id: v1(), title: "Shopping", isDone: true},
            {id: v1(), title: "Study", isDone: false},
            {id: v1(), title: "Relax", isDone: false},
            {id: taskIdToChange, title: "Sport", isDone: false}
        ]
    }

    let newTaskTitle = "SportPit"  ;

    const endState = tasksSlice(startState, ChangeTaskTitleAC(todolistId_2, taskIdToChange, newTaskTitle ));

    expect(endState[todolistId_2].find(t => t.id === taskIdToChange)?.title).toBe("SportPit");

})


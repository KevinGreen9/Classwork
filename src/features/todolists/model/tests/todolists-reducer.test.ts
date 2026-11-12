import {AddTodoAC, ChangeFilterTodoAC, ChangeNameTodoAC, RemoveTodoAC, todolistsSlice} from "../todolistsSlice.ts";
import {expect, test} from 'vitest';
import {v1} from "uuid";
import {FilterValuesType, TodolistType} from "../../../../AppWithReducer.tsx";

test('correct todolist should be removed', () => {
    const todolistId_1 = v1()
    const todolistId_2 = v1();

    const startState: TodolistType[] = [
        {id: todolistId_1, title: "What to learn", filter: 'all'},
        {id: todolistId_2, title: "What to want?", filter: 'all'}
    ]

    const endState = todolistsSlice(startState, RemoveTodoAC(todolistId_2));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId_1);
})

test('correct todolist should be added', () => {
    const todolistId_1 = v1()
    const todolistId_2 = v1();

    const startState: TodolistType[] = [
        {id: todolistId_1, title: "What to learn", filter: 'all'},
        {id: todolistId_2, title: "What to want?", filter: 'all'}
    ]
    const newTodo: TodolistType['title'] = 'New Todolist!!'


    const endState = todolistsSlice(startState, AddTodoAC(newTodo));

    expect(endState.length).toBe(3);
    expect(endState[2].id).toBeDefined();
    expect(endState[2].filter).toBe('all');
    expect(endState[2].title).toBe('New Todolist!!');
})

test("correct todolist should be changes it's name", () => {
    const todolistId_1 = v1()
    const todolistId_2 = v1();

    const startState: TodolistType[] = [
        {id: todolistId_1, title: "What to learn", filter: 'all'},
        {id: todolistId_2, title: "What to want?", filter: 'all'}
    ]

    let newName = 'Old Todolist!!';
    const endState = todolistsSlice(startState, ChangeNameTodoAC(todolistId_1, newName));

    expect(endState[0].title).toBe('Old Todolist!!');
    expect(endState[0].filter).toBe('all');
    expect(endState[1].title).toBe('What to want?');
    expect(endState.length).toBe(2);
})

test("correct todolist should be changes it's filter", () => {
    const todolistId_1 = v1()
    const todolistId_2 = v1();

    const startState: TodolistType[] = [
        {id: todolistId_1, title: "What to learn", filter: 'all'},
        {id: todolistId_2, title: "What to want?", filter: 'all'}
    ]

let newFilter: FilterValuesType = 'active';
    const endState = todolistsSlice(startState, ChangeFilterTodoAC(todolistId_1, newFilter));

    expect(endState[1].filter).toBe('all');
    expect(endState[0].filter).toBe('active');
    expect(endState.length).toBe(2);
})


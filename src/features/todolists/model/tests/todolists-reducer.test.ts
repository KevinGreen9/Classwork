import {
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    createTodolistTC,
    deleteTodolistTC,
    DomainTodolist,
    FilterValues,
    todolistsReducer
} from "../todolistsSlice.ts";
import {expect, test} from 'vitest';


test('correct todolist should be removed', () => {
    const startState: DomainTodolist[] = [
        {id: 'todolistId1', title: "What to learn", addedAt: "", order: 0, filter: "all"},
        {id: 'todolistId2', title: "What to buy", addedAt: "", order: 0, filter: "all"},
    ]
    const endState = todolistsReducer(
        startState,
        deleteTodolistTC.fulfilled({id: 'todolistId1'}, "requestId", 'todolistId1'));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe('todolistId2');
})

test('correct todolist should be created', () => {
    const startState: DomainTodolist[] = [
        {id: 'todolistId1', title: "What to learn", filter: 'all', order: 0, addedAt: ''},
        {id: 'todolistId2', title: "What to want?", filter: 'all', order: 1, addedAt: ''}
    ]
    const newTodoTitle = 'New Todolist!!';
    const createdTodolist = {
        id: 'todolistId3',
        title: newTodoTitle,
        order: 2,
        addedAt: '',
    };


    const endState = todolistsReducer(startState,
        createTodolistTC.fulfilled({todolist: createdTodolist}, "requestId", newTodoTitle));

    expect(endState.length).toBe(3);
    expect(endState[0].id).toBeDefined();
    expect(endState[0].filter).toBe('all');
    expect(endState[0].title).toBe(newTodoTitle);
})

test("correct todolist should be changes it's name", () => {
    const startState: DomainTodolist[] = [
        {id: 'todolistId1', title: "What to learn", filter: 'all', order: 0, addedAt: ''},
        {id: 'todolistId2', title: "What to want?", filter: 'all', order: 1, addedAt: ''}
    ]

    let newName = 'Old Todolist!!';
    const arg = {id: 'todolistId1', title: newName};
    const endState = todolistsReducer(startState, changeTodolistTitleTC.fulfilled({
        todolist:
            {
                id: 'todolistId1',
                title: newName,
                order: 0,
                addedAt: '',
            }
    }, "requestId", arg));

    expect(endState[0].title).toBe(newName);
    expect(endState[0].filter).toBe('all');
    expect(endState[1].title).toBe('What to want?');
    expect(endState.length).toBe(2);
})

test("correct todolist should be changes it's filter", () => {

    const startState: DomainTodolist[] = [
        {id: 'todolistId1', title: "What to learn", filter: 'all', order: 0, addedAt: ''},
        {id: 'todolistId2', title: "What to want?", filter: 'all', order: 1, addedAt: ''}
    ]

    let newFilter: FilterValues = 'active';
    const endState = todolistsReducer(startState,
        changeTodolistFilterAC({id: 'todolistId1', filter: newFilter}));

    expect(endState[0].filter).toBe('active');
    expect(endState[1].filter).toBe('all');
    expect(endState.length).toBe(2);
})


'use strict'


const input = document.getElementById('input');
const form = document.getElementById('nameform');
const list = document.getElementById('listname');
const all = document.getElementById('all');
const completed = document.getElementById('completed');
const newItems = document.getElementById('new');




class Todo {
    constructor(text, completed = false) {
        this.text = text;
        this.completed = completed;
        this.listeners = [];
        this.deleted = false;
    }
    toggleCompleted() {
        this.completed = !this.completed;
        this.listeners.forEach(cb => cb());
    }
    delete() {
        this.deleted = true;
        this.listeners.forEach(cb => cb());

    }
    render() {

        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        if (this.completed) {
            todoItem.classList.add('completed');
        }
        const todoItemContent = document.createElement('div');
        todoItemContent.classList.add('todo-item-content');

        const text = document.createElement('span');
        text.innerText = this.text;

        const button = document.createElement('button');
        button.classList.add('basket');

        todoItemContent.appendChild(text);
        todoItem.appendChild(todoItemContent);
        todoItem.appendChild(button);
        todoItemContent.addEventListener('click', () => {
            this.toggleCompleted();
        })
        button.addEventListener('click', () => {
            this.delete();
        })
        return todoItem;

    }
    onChange(cb) {
        this.listeners.push(cb);
    }

}

class TodoList {
    constructor(listElement) {
        this.todos = (JSON.parse(localStorage.getItem('todos')) || []).map(item => {
            const todo = new Todo(item.text, item.completed)
            todo.onChange(() => this.render());
            return todo;
        });
        this.visibilityFilter = 'all';
        this.list = listElement;
        this.render();
    }
    get visibleTodos() {
        if (this.visibilityFilter === 'all') {
            return this.todos;


        }
        return this.todos.filter((item) => this.visibilityFilter === 'completed' ? item.completed : !item.completed);
    }
    addTodo(todo) {
        todo.onChange(() => this.render());
        this.todos.push(todo);
        this.render();
    }
    setVisibilityFilter(visibilityFilter) {
        this.visibilityFilter = visibilityFilter;
        this.render();

    }

    render() {
        this.todos = this.todos.filter((item) => !item.deleted);
        localStorage.setItem('todos', JSON.stringify(this.todos));
        this.list.innerHTML = '';
        this.visibleTodos.forEach(item => {
            this.list.appendChild(item.render());
        })
    }
}
const todoList = new TodoList(list);

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input.value) {
        return
    }

    todoList.addTodo(new Todo(input.value));
    input.value = '';

})

all.addEventListener('click', () => {
    all.classList.add('active');
    completed.classList.remove('active');
    newItems.classList.remove('active');
    todoList.setVisibilityFilter('all');
})

completed.addEventListener('click', () => {
    completed.classList.add('active');
    all.classList.remove('active');
    newItems.classList.remove('active');
    todoList.setVisibilityFilter('completed');
})

newItems.addEventListener('click', () => {
    newItems.classList.add('active');
    completed.classList.remove('active');
    all.classList.remove('active');
    todoList.setVisibilityFilter('new');
})
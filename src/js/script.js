import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './app/app';


let todoData = JSON.parse(localStorage.getItem('todoData'));

ReactDOM.render(
    <React.StrictMode>
        <TodoApp tasks={ todoData } />
    </React.StrictMode>,
    document.querySelector('#todo-app')
);
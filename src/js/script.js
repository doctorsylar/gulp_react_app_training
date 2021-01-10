import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './app/app';

ReactDOM.render(
    <React.StrictMode>
        <TodoApp />
    </React.StrictMode>,
    document.querySelector('#todo-app')
);
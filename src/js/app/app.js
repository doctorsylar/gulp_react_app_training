import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input : ''
        }
    }
    addNewTask = () => {
        if (this.state.input.length > 0) {
            this.props.addNewTask(this.state.input);
            this.setState({
                input: ''
            });
        }
    }
    changeInput = (event) => {
        this.setState({
            input: event.target.value
        });
    }
    handleEnter = (event) => {
        if (event.keyCode === 13 ) {
            this.addNewTask();
        }
    }
    render() {
        let inputText = this.state.input;
        return (
            <div className="todo-header">
                <div className="toggle-all-container marker-container">
                    <button type={'button'} className="toggle-all">{'\u2B9F'}</button>
                </div>
                <div className="input-container">
                    <input
                        onKeyDown={this.handleEnter}
                        onChange={this.changeInput}
                        value={ inputText }
                        type="text" placeholder={'Type something to do'}/>
                </div>
                <div className="button-container">
                    <button
                        onClick={ this.addNewTask }
                        type={'button'} className="submit-task">{'\u2714'}</button>
                </div>
            </div>
        );
    }
}
class Row extends React.Component {
    render() {
        let complete = this.props.item.complete ? 'todo-row complete' : 'todo-row';
        let id = this.props.item.id;
        return (
            <div className={ complete }>
                <div className="marker-container">
                    <button
                        onClick={() => this.props.changeTaskStatus(id)}
                        type={'button'} className="toggle">{'\u2714'}</button>
                </div>
                <div className="row-text">
                    { this.props.item.text }
                </div>
                <div className="button-container">
                    <button
                        onClick={() => this.props.removeTask(id)}
                        type={'button'} className="remove-task">{'\u2573'}</button>
                </div>
            </div>
        );
    }
}
class Body extends React.Component {
    render() {
        let items = this.props.tasks.map((task) =>
            <Row
                removeTask={this.props.removeTask}
                changeTaskStatus={this.props.changeTaskStatus}
                item={task} key={task.id}></Row>
        );
        return (
            <div className="todo-body">
                { items }
            </div>
        );
    }
}
class Footer extends React.Component {
    render() {
        return (
            <div className="todo-footer">

            </div>
        );
    }
}

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selection : 'all',
            tasks : [
                {
                    id : 1,
                    text : 'Test Task 1',
                    complete : false,
                },
                {
                    id : 2,
                    text : 'Test Task 2',
                    complete : false,
                },
                {
                    id : 3,
                    text : 'Test Task 3',
                    complete : true,
                },
            ]
        }
    }
    changeTaskStatus = (id) => {
        let tasks = this.state.tasks;
        for (let index in tasks) {
            if (tasks[index].id === id) {
                tasks[index].complete = !tasks[index].complete;
                break;
            }
        }
        this.setState({
            tasks : tasks
        });
    }
    removeTask = (id) => {
        let tasks = this.state.tasks;
        for (let index in tasks) {
            if (tasks[index].id === id) {
                tasks.splice(index, 1);
                break;
            }
        }
        this.setState({
            tasks : tasks
        });
    }
    addNewTask = ( string ) => {
        let tasks = this.state.tasks;
        let newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0;
        tasks.push({
            id : newId,
            text : string,
            complete : false
        });
        this.setState({
            tasks : tasks
        });
    }
    render() {
        return (
            <div className="todo-app-container">
                <Header
                    addNewTask={this.addNewTask}></Header>
                { this.state.tasks.length > 0 &&
                    <Body
                    changeTaskStatus={this.changeTaskStatus}
                    removeTask={this.removeTask}
                    tasks={this.state.tasks}></Body>
                }
                { this.state.tasks.length > 0 &&
                    <Footer></Footer>
                }
            </div>
        );
    }
}
export default TodoApp;

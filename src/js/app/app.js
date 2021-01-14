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
                    <button
                        onClick={this.props.markAllTasks}
                        type={'button'} className={this.props.allMarked ? 'toggled toggle-all' : 'toggle-all'}>{'\u2B9F'}</button>
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
    editRow = () => {
        this.props.editRow(this.props.item.id);
    }
    finishEditing = (event) => {
        this.props.finishEditing(this.props.item.id, event.target.value);
    }
    render() {
        let complete = this.props.item.complete ? 'todo-row complete' : 'todo-row';
        let id = this.props.item.id;
        let text = this.props.item.text;
        return (
            <div className={ complete }>
                <div className="marker-container">
                    <button
                        onClick={() => this.props.changeTaskStatus(id)}
                        type={'button'} className="toggle">{'\u2714'}</button>
                </div>
                {this.props.item.editing &&
                <div className="row-text editing">
                    <textarea
                        onBlur={this.finishEditing}
                        autoFocus={true}
                        defaultValue={text} />

                </div>
                }
                {!this.props.item.editing &&
                    <div className="row-text"
                         onClick={this.editRow}>
                        { this.props.item.text }
                    </div>
                }
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
                editRow={this.props.editRow}
                finishEditing={this.props.finishEditing}
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
    changeFilter = (event) => {
        this.props.changeFilter(event.target.value)
    }
    render() {
        return (
            <div className="todo-footer">
                <div className="tasks-left">{this.props.tasksLeft} tasks left</div>
                <div className="todo-filters">
                    <button onClick={this.changeFilter} className={this.props.activeFilter === 'all' ? 'active' : ''} type={'button'} value={'all'}>All</button>
                    <button onClick={this.changeFilter} className={this.props.activeFilter === 'active' ? 'active' : ''} type={'button'} value={'active'}>Active</button>
                    <button onClick={this.changeFilter} className={this.props.activeFilter === 'completed' ? 'active' : ''} type={'button'} value={'completed'}>Completed</button>
                </div>
                <div
                    onClick={this.props.clearCompleted}
                    className="clear">Clear completed</div>
            </div>
        );
    }
}

class TodoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selection : 'all',
            tasks : this.props.tasks === null ? [] : this.props.tasks,
        }
    }
    saveTasks = () => {
        if (this.state.tasks.length === 0) {
            localStorage.removeItem('todoData');
        }
        else {
            localStorage.setItem('todoData', JSON.stringify(this.state.tasks));
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
        }, this.saveTasks);
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
        }, this.saveTasks);
    }
    addNewTask = ( string ) => {
        let tasks = this.state.tasks;
        let newId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 0;
        tasks.push({
            id : newId,
            text : string,
            complete : false,
            editing : false
        });
        this.setState({
            tasks : tasks
        }, this.saveTasks);
    }
    markAllTasks = () => {
        let allMarked = this.state.tasks.length > 0 ? true : false;
        for (let index in this.state.tasks) {
            if (!this.state.tasks[index].complete) {
                allMarked = false;
                break;
            }
        }
        let tasks = this.state.tasks;
        if (allMarked) {
            for (let index in tasks) {
                tasks[index].complete = false;
            }
        }
        else {
            for (let index in tasks) {
                tasks[index].complete = true;
            }
        }
        this.setState({ tasks: tasks });
        this.changeFilter('all');
    }
    changeFilter = (filter) => {
        this.setState({
            selection : filter
        });
    }
    clearCompleted = () => {
        let tasks = [];
        for (let index in this.state.tasks) {
            if (!this.state.tasks[index].complete) {
                tasks.push(this.state.tasks[index]);
            }
        }
        this.setState({
            tasks : tasks
        }, this.saveTasks);
    }
    editRow = (id) => {
        let tasks = this.state.tasks;
        for (let index in tasks) {
            if (this.state.tasks[index].id === id) {
                this.state.tasks[index].editing = true;
                break;
            }
        }
        this.setState({
            tasks : tasks
        }, this.saveTasks);
    }
    finishEditing = (id, text) => {
        let tasks = this.state.tasks;
        for (let index in tasks) {
            if (this.state.tasks[index].id === id) {
                this.state.tasks[index].text = text;
                this.state.tasks[index].editing = false;
                break;
            }
        }
        this.setState({
            tasks : tasks
        }, this.saveTasks);
    }
    render() {
        let allMarked = this.state.tasks.length > 0 ? true : false;
        let tasksActive = 0;
        let tasks = [];
        for (let index in this.state.tasks) {
            if (!this.state.tasks[index].complete) {
                allMarked = false;
                tasksActive++;
                if (this.state.selection === 'all' || this.state.selection === 'active') {
                    tasks.push(this.state.tasks[index]);
                }
            }
            else {
                if (this.state.selection === 'all' || this.state.selection === 'completed') {
                    tasks.push(this.state.tasks[index]);
                }
            }
        }
        return (
            <div className="todo-app-container">
                <Header
                    allMarked={allMarked}
                    markAllTasks={this.markAllTasks}
                    addNewTask={this.addNewTask}></Header>
                { this.state.tasks.length > 0 &&
                    <Body
                    changeTaskStatus={this.changeTaskStatus}
                    editRow={this.editRow}
                    finishEditing={this.finishEditing}
                    removeTask={this.removeTask}
                    tasks={tasks}></Body>
                }
                { this.state.tasks.length > 0 &&
                    <Footer
                        changeFilter={this.changeFilter}
                        tasksLeft={tasksActive}
                        activeFilter={this.state.selection}
                        clearCompleted={this.clearCompleted}
                    ></Footer>
                }
            </div>
        );
    }
}
export default TodoApp;

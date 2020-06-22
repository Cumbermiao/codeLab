import React from 'react';
import PropTypes from 'prop-types';
import Todo from './Todo';

export default class TodoList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {  };
  }
  static PropTypes ={
    todos:PropTypes.arrayOf(
      PropTypes.shape({
        id:PropTypes.number,
        text:PropTypes.string,
        click:PropTypes.func
      })
    ),
    todoClick:PropTypes.func
  }

  render(){
    return (
      <ul>
        {this.todos.map((todo,idx)=>{
          return <Todo key={idx} {...todo} click={()=>{this.todoClick(idx)}}></Todo>
        })}
      </ul>
    )
  }
}
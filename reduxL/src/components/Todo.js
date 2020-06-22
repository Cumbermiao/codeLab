import React from "react";
import PropTypes from 'prop-types';

export default class Todo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {  };
  }

  static PropTypes = {
    text:PropTypes.string,
    complete:PropTypes.bool,
    click:PropTypes.func
  }

  render(){
    var style = {textDecoration:this.props.complete?"line-through":"none"};
    return(
      <li style={style} onClick={()=>{this.props.click()}}>
        {this.props.text}
      </li>
    );
  }
}
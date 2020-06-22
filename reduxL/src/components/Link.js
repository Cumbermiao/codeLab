import React from 'react';
import PropTypes from 'prop-types';

export default class Link extends React.Component{
  
  constructor(props){
    super(props);
    
  }
  
  static PropTypes ={
    active:PropTypes.bool,
    children:PropTypes.node,
    click:PropTypes.click
  }
  render(){
    if(this.active){
      return (<span onClick={()=>{this.click()} }>{this.children}</span>)
    }
    return (
      <a href="" onClick={(e)=>{e.preventDefault();this.click()}}>{this.children}</a>
    )
  }
}
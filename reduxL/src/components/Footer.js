import React, { Component } from 'react';
import FooterLink from './FooterLink';

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  render() {
    return (
      <p>
        show {' '}
        <FooterLink filter='All'>All</FooterLink>
        {','}
        <FooterLink filter='Active'>Active</FooterLink>
        {','}
        <FooterLink filter='Completed'>Completed</FooterLink>
      </p>      
    );
  }
}

export default Footer;
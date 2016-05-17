import React, { Component } from 'react';
import { Draggable } from 'react-dragndrop';

export default class Choice extends Component {
  getDefaultProps(){
    return {
      title: "default title",
      correctId: "any"
    }
  }

  render(){
    return (
      <Draggable manager={this.props.manager}>
        <h2>{this.props.title}</h2>
      </Draggable>
    );
  }
}

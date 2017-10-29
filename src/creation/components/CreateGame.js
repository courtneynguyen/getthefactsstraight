import axios from 'axios';
import React from 'react';
import ReactAddons from 'react-addons-update';

import SubList from './Sublist';
const defaultAnswer = function(id){
    return {
      name: 'choice',
      title: 'Truthy description',
      edit: false,
      id: 'answer-' + Math.random(),
      correctId: id ? id : null
    }
};
const defaultField = function(){
    let field = {
      name: 'column',
      title: 'Name column',
      edit: false,
      id: 'field-' + Math.random()
    };
    field.answers = [defaultAnswer(field.id)];
    return field;
};


export default class CreateGame extends React.Component {

    constructor(){
        super();
        this.state = {
            title: 'Common Logic Quiz',
            showField: false,
            columns: [defaultField()],
            choices: []
        }

        this.submitGame = this.submitGame.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.updateName = this.updateName.bind(this);
        this.toggleField = this.toggleField.bind(this);
        this.addField = this.addField.bind(this);
        this.removeField = this.removeField.bind(this);
        this.createList = this.createList.bind(this);
        this.updateList = this.updateList.bind(this);
        this.addAnswer = this.addAnswer.bind(this);
        this.createAnswerList = this.createAnswerList.bind(this);
        this.updateAnswer = this.updateAnswer.bind(this);
        this.toggleAnswer = this.toggleAnswer.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
    }
    createList(){
        let fields = this.state.columns.map((item, i) => {
          let list = this.createAnswerList(item, i);
          if(!item.edit){
            return (
              <li key={item.id}>
                <span className="addField" onClick={() => {this.addAnswer(i, item.id)}}></span>
                <span className="removeField" onClick={() => {this.removeField(i)}}></span>
                <h3 onClick={() => {this.toggleField(i)}}>{item.title}</h3>
                {list}
              </li>);
          }
          else {
            return (
              <li key={item.id}>
                <span className="addField" onClick={() => {this.addAnswer(i, item.id)}}></span>
                <span className="removeField" onClick={() => {this.removeField(i)}}></span>
                <h3>
                  <input
                  autoFocus
                  className="input-inline"
                  type="text"
                  onChange={(e, n)=>{this.updateList(e, item)}}
                  onBlur={() => {this.toggleField(i)}} placeholder={item.title} />
                </h3>
                {list}
              </li>
            )
          }
        });
    
        return fields;
      }
      updateList(e, editItem){
        let itemValue = e.target.value;
        let list = this.state.columns;
        list.forEach((item, i) => {
          if(item.id == editItem.id){
            list[i].title = itemValue;
          }
        });
        let newState = ReactAddons(this.state, {
          columns: { $set: list }
        });
        this.updateGame(newState);
      }
      addField(){
        let list = this.state.columns;
        let newState = ReactAddons(this.state, {
          columns: { $push: [defaultField()]}
        });
        this.updateGame(newState);
      }
      removeField(i){
        let list = this.state.columns;
        list.splice(i, 1);
        let newState = ReactAddons(this.state, {
          columns: { $set: list}
        });
        this.updateGame(newState);
      }
      toggleField(i){
        let list = this.state.columns;
        list[i].edit = !list[i].edit;
        let newState = ReactAddons(this.state, {
          columns: { $set: list }
        });
        this.updateGame(newState);
      }
      addAnswer(i, correctId){
        let list = this.state.columns;
        let answer = defaultAnswer(correctId);
        list[i].answers.push(answer);
        let newState = ReactAddons(this.state, {
          columns: { $set: list }
        });
        this.updateGame(newState);
      }
    createAnswerList(fieldColumn, i){
        let answers = fieldColumn.answers.map((answer, j) => {
          if(!answer.edit){
            return (
              <li key={answer.id} onClick={()=> {this.toggleAnswer(i, j)}}>
                <div className="flex-container">
                  <span className="removeField" onClick={() => {this.removeAnswer(i, j)}}></span>
                  <span className="description">{answer.title}</span>
                </div>
              </li>
            );
          }
          else {
            return (
              <li key={answer.id}>
              <div className="flex-container">
                  <span className="removeField" onClick={() => {this.removeAnswer(i, j)}}></span>
                  <input
                  className="input-inline"
                  type="text"
                  autoFocus
                  onBlur={()=> {this.toggleAnswer(i, j)}}
                  onChange={(e) => {this.updateAnswer(e, answer, i, j)}} />
                </div>
              </li>
            );
          }
    
        });
        return React.createElement('ul', {className: 'sub-sublist'}, answers);
    }
    updateName(name){
        let newState = ReactAddons(this.state, {$set: {title: name}});
        this.setState(newState);
    }
    updateAnswer(e, editItem, i, j){
        let itemValue = e.target.value;
        let list = this.state.columns;
        list[i].answers[j].title = itemValue;
        let newState = ReactAddons(this.state, {
          columns: { $set: list }
        });
        this.updateGame(newState);
    }
    removeAnswer(i, j){
        let list = this.state.columns;
        list[i].answers.splice(j, 1);
        let newState = ReactAddons(this.state, {
          columns: { $set: list }
        });
        this.updateGame(newState);
    }
    toggleAnswer(i, j){
        let list = this.state.columns;
        list[i].answers[j].edit = !list[i].answers[j].edit;
        let newState = ReactAddons(this.state, {
          columns: { $set: list }
        });
        this.updateGame(newState);
    }
    submitGame(){
        axios.post('/quiz', this.state).then(data => {
            console.log('pOSTED', data);
        });
    }
    updateGame(newState){
        let choices = newState.columns.reduce((columnA, columnB) => {
            console.log('columnB', columnA, columnB);
            return columnA.length > 0 ? columnA.concat(columnB.answers) : columnB.answers;
        }, []);
        let finalState = ReactAddons(this.state, {$set: {columns: newState.columns, choices}});
        this.setState(finalState);
    }
    render(){
        let editButton = this.createList();
        return (
        <div>
            <h1>Creating a Quiz is Easy...</h1>
            <label htmlFor="title">Title:</label>
            <input id="title" type="text" name="title" placeholder={this.state.title} className="input-wide" onChange={(e) => this.updateName(e.target.value)} />
            <label htmlFor="editor">Create columns to compare and contrast</label>
            <div className="sublist">
                <ul>
                    {editButton}
                </ul>
                <button type="button" onClick={() => {this.addField()}}>Add column</button>
            </div>
            <input type="button" onClick={() => this.submitGame()} value="Submit" />
          </div>
        );
    }
}
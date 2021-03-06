import Reflux from 'reflux';
import Actions from '../actions';
import AppStore from '../AppStore';
import axios from 'axios';

let BoardStore = Reflux.createStore({
  listenables: [Actions],
  init: function(){
    this.listenTo(AppStore, this.setBoard);
    this.inspectChoice = this.inspectChoice.bind(this);
  },
  setBoard: function(appState){
    console.log('RESET');
    this.boardState = appState.game;
    this.trigger(this.boardState);
  },
  getInitialState: function(){
    this.boardState = AppStore.getAppState().game;
    // Reflux.listenTo(Actions.choiceDropped, this.onChoiceDropped);
    return this.boardState;
  },
  onGameOver: function() {
    console.log('GAME OVER');
    this.boardState.gameOver = true;
    this.trigger(this.boardState);
  },
  inspectChoice: function(choiceIndex, columnIndex){
        return new Promise((resolve, reject) => {
            this.boardState.totalAnswered += 1;
            axios.post('/answer', {columnId: this.boardState.columns[columnIndex].id, answerId: this.boardState.choices[choiceIndex].id}).then(data => {
                if(data.data) {
                    this.boardState.totalCorrect += 1;
                }
                resolve(this.boardState.totalCorrect);
            });
        });
    },
    onChoiceDropped: async function(choiceIndex, index){
        if(this.boardState){
            var choice = this.boardState.choices[choiceIndex];
            let correct = await this.inspectChoice(choiceIndex, index);
            this.boardState.columns[index].list.push(choice);
            this.boardState.choices.splice(choiceIndex, 1);
            if(this.boardState.choices.length == 0){
                Actions.gameOver();
            }
            this.trigger(this.boardState);
        }
    }
});

module.exports = BoardStore;

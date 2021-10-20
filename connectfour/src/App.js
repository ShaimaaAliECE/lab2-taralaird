import React, { Component } from 'react';
import './App.css';


//spaces are what the player tokens can go in 
//4 spaces in a line win a game 
function Space(props){
  return <div className="Space"><div className={props.value}></div></div>
}

//columns are made up spaces 
//they are what can be clicked on
function Column(props){
    return <div className="Column" onClick={() => props.handleClick()}>
      {[...Array(props.spaces.length)].map((x, j) => 
        <Space key={j} value={props.spaces[j]}></Space>)}
      </div>
 }

class Board extends Component {

  constructor() {
    super();

    //used when app is just opened
    this.state = {
      //creates empty board 7 columns and 6 rows using a double array
      boardState: new Array(7).fill(new Array(6).fill(null)),
      //starts with the red player
      playerTurn: 'Red',
      //no winner yet
      winner: '',
      //all spaces are empty 
      full: 0
    }
  }

  //when user starts a game
  startGame(){
    this.setState({
       //board is empty 
       boardState: new Array(7).fill(new Array(6).fill(null)),
       //full is set back to zero
       full:0
    })
  }

  //when column is clicked a move is made 
  makeMove(colID){
    //creates a copy of the board of updating reasons
    const boardCopy = this.state.boardState.map(function(arr) {
      return arr.slice();
    });
    //makes sure column isn't full 
    if( boardCopy[colID].indexOf(null) !== -1 ){
      //adds player token to the board in that column 
      let newColumn = boardCopy[colID].reverse()
      newColumn[newColumn.indexOf(null)] = this.state.playerTurn
      newColumn.reverse()
      //once move is made the board is updated fully (the boardCopy becomes the actual Board)
      //and it becomes the next players turn, full is incremented by one 
      this.setState({
        playerTurn: (this.state.playerTurn === 'Red') ? 'Yellow' : 'Red',
        boardState: boardCopy,
        full: this.state.full+1
      })
      console.log(this.state.full); 
    }

  }

  //when clicked it will make a move
  handleClick(colID) {
    //only works if the game hasnt been won 
    if(this.state.winner === ''){
      this.makeMove(colID)
    }
  }
  
  //check for a winner everytime the board is updated (a move is made)
  componentDidUpdate(){
    let winner = checkWinner(this.state.boardState)
    if(this.state.winner !== winner)
      this.setState({winner: winner})
  }

  render(){

    //When the game is won display winner message
    let winnerMessageStyle
    if(this.state.winner !== ""){
      winnerMessageStyle = "winnerMessage appear"
    }else {
      winnerMessageStyle = "winnerMessage"
    }

    //Contruct columns
    let columns = [...Array(this.state.boardState.length)].map((x, i) => 
      <Column 
      //columns have an id, are made of spaces, and can be clicked
          key={i}
          spaces={this.state.boardState[i]}
          handleClick={() => this.handleClick(i)}
      ></Column>
    )

    //displays board made of columns, 
    //possibly shows winner meassage when game is won
    //then the button to start a new game when game is won, board if full, or game hasn't been selected 
    return (
      <div>
          <div className="Board">
            {columns}
          </div>
      
        <div className={winnerMessageStyle}>{this.state.winner}</div>
        {( this.state.winner !== ''|| this.state.full === 42) &&
          <div>
            <button onClick={() => this.startGame()}>Play a New Game</button>
          </div>
        }
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Connect Four</h2>
        </div>
        <div className="Game">
          <Board></Board>
        </div>
      </div>
    );
  }
}

//makes sure that the line is not empty and then checks that the line is composed of all the same colour
function checkLine(a,b,c,d) {
    return ((a !== null) && (a === b) && (a === c) && (a === d));
}

//checks for a winner and if there is winner returns a display message
function checkWinner(bs) {
//c are columns and r are rows 
//bs[c][r] are items in a double array that can be considered the spaces and are filled with player tokens
  //checks vertical lines
    for (let c = 0; c < 7; c++)
        for (let r = 0; r < 4; r++)
            if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
               return bs[c][r] +' wins!'

    //checks horizontal right
    for (let r = 0; r < 6; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
                 return bs[c][r] +' wins!'

    //checks diagonal lines going up to the left
    for (let r = 0; r < 3; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r+1], bs[c+2][r+2], bs[c+3][r+3]))
                return bs[c][r] +' wins!'

    //checks diagonal lines going up to the right
    for (let r = 0; r < 4; r++)
         for (let c = 3; c < 6; c++)
             if (checkLine(bs[c][r], bs[c-1][r+1], bs[c-2][r+2], bs[c-3][r+3]))
                return bs[c][r] +' wins!'

    //no winner so no winner message
    return "";
}

export default App;



import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text,  ImageBackground, Pressable } from 'react-native';
import React, { useState, useEffect,  } from 'react';


const copyArray=(original)=> {
  const copy=original.map((arr)=>{
    return arr.slice();
  });
  return copy;
}


export default function App() {
  const [map, setMap] = useState([
    ['','',''],
    ['','',''],
    ['','',''],
  ]);
  
  const [currentPlayer, setCurrentPlayer] = useState('x');
  const [gameMessage, setGameMessage]=useState('Current turn :  X');
  const [end, setEnd] = useState(false); 
  const [gameMode, setgameMode]=useState('friend');
  
  
  useEffect(()=> {
    if(currentPlayer==='o' && gameMode==='botEasy' ){
      botEasy();
    }  
    
    if(currentPlayer==='o' && gameMode==='botMed' ){
      botMed();
    }  

    if(currentPlayer==='o' && gameMode==='botHard' ){
      botHard();
    }  
  }, [currentPlayer]);


  const onPress= (rowIndex, columnIndex)=> {
    if (map[rowIndex][columnIndex]!=='' || end) {
      return;

    }

    const updatedMap = [...map];
    updatedMap[rowIndex][columnIndex] = currentPlayer;
    setMap(updatedMap);

    
    const nextPlayer = currentPlayer === 'x' ? 'o' : 'x';
    setCurrentPlayer(nextPlayer);
    
    setGameMessage(`Current turn :  ${nextPlayer.toUpperCase()}`);
    
    winner=checkWinner(updatedMap)
    if(winner){
      Win(winner);
    }
    
    if(!winner){
      Tie();
    }
  };


  //Functions
  const checkWinner =(winMap) => {
    let winner=null;
    //check rows
    for(let i =0; i<3; i++)
      {
        const rowX= winMap[i].every((cell)=> cell === 'x');
        const rowO= winMap[i].every((cell)=> cell === 'o');
        if (rowX){
          winner='x';
        }

        if(rowO){
          winner='o';
        }
      }
    //check columns
    for( let col=0;col<3; col++){
      let colX = true;
      let colO= true;

      for(let row=0; row<3; row++){
        if(winMap[row][col]!=='x'){
          colX=false;
        }

      if(winMap[row][col]!=='o'){
        colO=false;
        }
      }
      
      if(colX){
        winner='x';
      }

      if(colO){
        winner='o';
      }
    }

    //check diagonals
    let diag1X=true;
    let diag1O=true;
    let diag2X=true;
    let diag2O=true;

    for(let i=0; i<3; i++){
      if (winMap[i][i]!=='x'){
        diag1X=false;
      }

      if (winMap[i][i]!=='o'){
        diag1O=false;
      }

      if (winMap[i][2-i]!=='x'){
        diag2X=false;
      }

      if (winMap[i][2-i]!=='o'){
        diag2O=false;
      }
    }

    if (diag1X || diag2X){
      winner='x';
    }
    if (diag1O || diag2O){
      winner='o';
    }
    return winner;
  }


const Tie=()=>{
  if (getPossibleMoves().length==0){
    setEnd(true);
    setGameMessage('Oops! it is a tie.')
  }
}


const Win=(player) => {
  setEnd(true);
  setGameMessage(`Hurray! Player '${player.toUpperCase()}' won.`);
}
  

const reset=()=>{
  setMap([
    ['','',''],
    ['','',''],
    ['','',''],
  ]);
  setCurrentPlayer('x');
  setGameMessage('Current turn :  X');
  setEnd(false);
};


const getPossibleMoves=()=>{
  const possibleMoves=[];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === '') {
        possibleMoves.push({row: row, col: col});         
      }
    }
  }
  return possibleMoves;
}


//bots
const predictWin=(possibleMoves, player)=>{
  let move=null;
  possibleMoves.forEach((possibleMove)=>{
    const mapCopy=copyArray(map);
    
    mapCopy[possibleMove.row][possibleMove.col]=player;
    
    winner=checkWinner(mapCopy);
    if(winner === player){
        move=possibleMove;    
      }
  });
  return move; 
}


const botEasy = ()=> {
  const possibleMoves=getPossibleMoves();  
  const move=possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

  if (move){
    onPress(move.row,move.col);
  }
};


const botMed = ()=> {
  const possibleMoves=getPossibleMoves();
  let move=null;

  move=predictWin(possibleMoves, 'x');

  if(move==null){
    move=possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  if(move){
    onPress(move.row,move.col);
  }
  
};


const botHard=()=>{
  const possibleMoves=getPossibleMoves();
  let move=null;

  move=predictWin(possibleMoves, 'o');

  if(!move){
    move=predictWin(possibleMoves, 'x');
  }

  if(!move){
    move=possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  if (move){
    onPress(move.row,move.col);
  }
};


  return (  
    <View style={styles.container}>

      <View style={styles.modes}>

        <Text 
          style={{
            fontSize: 20,
            color: '#D400FF',
            }}>
            Play with:
        </Text>

        <Text 
          onPress={()=>{
            setgameMode('friend');
            reset();
          }}
          style={[
            styles.mode, 
            {backgroundColor: gameMode==='friend'? '#C000EB': '#000034'           
            }]
          }>
            Friend
        </Text>

        <Text 
          onPress={()=>{
            setgameMode('botEasy');
            reset();
          }}
          style={[
            styles.mode, 
            {backgroundColor: gameMode==='botEasy'? '#C000EB': '#000034'           
            }]
          }>
            Bot: Easy
          </Text>

        <Text 
          onPress={()=>{
            setgameMode('botMed'); 
            reset();
          }}
          style={[
            styles.mode, 
            {backgroundColor: gameMode==='botMed'? '#C000EB': '#000034'           
            }]
          }>
            Bot: Medium
        </Text>

        <Text 
          onPress={()=>{
            setgameMode('botHard');
            reset();
          }}
          style={[
            styles.mode, 
            {backgroundColor: gameMode==='botHard'? '#C000EB': '#000034'           
            }]
          }>
            Bot: Hard 
        </Text>

      </View>

      <Text style={styles.message}>
        {gameMessage}
      </Text>

      < ImageBackground source={require('./assets/bg.png')} style={styles.bg} resizeMode='cover'>     
        <View style={styles.map}>
          
          {map.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, columnIndex) => (
                <Pressable key={columnIndex} onPress={()=> onPress(rowIndex, columnIndex)} style={styles.cell}>
                 {cell === 'o' && <View style={styles.circle} />}
                 {cell === 'x' && (
                  <View style={styles.cross}>
                    <View style={styles.crossline} />
                    <View style={[styles.crossline, styles.crossline2]} />
                  </View>
                 )} 

                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ ImageBackground>

      <Text style={styles.restart} onPress={()=> reset()}>Restart</Text>
      
      <StatusBar style="auto" />
    </View>
  );
}

//styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000034',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modes: {
    position: 'absolute',
    flexDirection: 'column',
    top: 25,
    left: 10,
  },
  mode: {
    color: 'white',
    fontSize: 15,
  },

  message: {
    position: 'absolute',
    fontSize: 28,
    color: '#39FF14',
    top: 135,
  },

  restart: {
    position: 'absolute',
    fontSize: 40,
    color: 'white',
    bottom: 32,
    
  },

  bg: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  map: {
    width: '90%',
    aspectRatio: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },

  row: {
    flex: 1, 
    flexDirection: 'row',
    
  },

  cell: {   
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  circle: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: '#000034',
    borderWidth: 7,
    borderColor: '#04D9FF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cross: {
    position: 'absolute',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  crossline: {
    position: 'absolute',
    width: 7,
    height: 45,
    backgroundColor: '#F8EE23',
    borderRadius: 5,
    transform: [
      {
        rotate: '45deg',
      },
    ],
  },

  crossline2: {
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
});

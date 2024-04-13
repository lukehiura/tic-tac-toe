import React, { useState, useEffect } from 'react';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameMode, setGameMode] = useState(null);
  const [winner, setWinner] = useState(null);
  const [startingPlayer, setStartingPlayer] = useState('X');

  useEffect(() => {
    checkWinner();
    if (gameMode === 'pve' && currentPlayer === 'O' && !winner) {
      aiMove();
    }
  }, [currentPlayer]);

  const handleClick = (i) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const checkWinner = () => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
    if (!board.includes(null)) {
      setWinner('Draw');
    }
  };

  const minimax = (tempBoard, depth, isMaximizing) => {
    const result = checkWinnerForMinimax(tempBoard);
    if (result !== null) {
      return result === 'O' ? 10 : result === 'X' ? -10 : 0;
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < tempBoard.length; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'O';
          let score = minimax(tempBoard, depth + 1, false);
          tempBoard[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < tempBoard.length; i++) {
        if (tempBoard[i] === null) {
          tempBoard[i] = 'X';
          let score = minimax(tempBoard, depth + 1, true);
          tempBoard[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const aiMove = () => {
    let bestScore = -Infinity;
    let bestMove = null;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    handleClick(bestMove);
  };

  const checkWinnerForMinimax = (tempBoard) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (tempBoard[a] && tempBoard[a] === tempBoard[b] && tempBoard[a] === tempBoard[c]) {
        return tempBoard[a];
      }
    }
    if (tempBoard.every(cell => cell !== null)) {
      return 'Tie';
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    const nextPlayer = startingPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
    setStartingPlayer(nextPlayer);
  };

  const renderCell = (i) => (
    <button onClick={() => handleClick(i)} style={{
      width: '90vw',
      height: '90vw',
      fontSize: '10vw',
      maxWidth: '300px',
      maxHeight: '300px',
      minWidth: '150px',
      minHeight: '150px',
    }}>
      {board[i]}
    </button>
  );

  let status = winner ?
    winner === 'Draw' ? 'The game is a draw!' : `Winner: ${winner}` :
    'Next player: ' + (currentPlayer === 'X' ? 'X' : 'O');

  return (
    <div className="app-container">
      <div>
        <button onClick={() => setGameMode('pvp')}>Player vs Player</button>
        <button onClick={() => setGameMode('pve')}>Player vs AI</button>
      </div>
      <div>{status}</div>
      <button onClick={resetGame}>Reset Game</button>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '360vw',
        maxWidth: '900px',
        margin: 'auto'
      }}>
        {Array(9).fill(null).map((_, i) => renderCell(i))}
      </div>
    </div>
  );
}

export default TicTacToe;
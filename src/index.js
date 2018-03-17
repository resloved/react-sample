import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
        <div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(
            0, this.state.stepNumber + 1
        );
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        var status;
        if (winner) {
            status = winner + ' !';
        } else {
            status = (this.state.xIsNext ? 'X' : 'O') + ' ?';
        }
        const moves = history.map((step, move) => {
            const turn = (move % 2 === 0 ? 'X' : 'O');
            const last = move < history.length - 1 ? formatMove(lastMove(
                history[move].squares,
                history[move + 1].squares
            )) : 'NEXT';
            const cur = move === this.state.stepNumber ? '>' : '\u00A0'
            const desc = turn  + ' @ ' + last;
            return (
                <li>
                    <p>{cur}</p>
                    <p key={move} onClick={() => this.jumpTo(move)}>{desc}</p>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-status">{status}</div>
                <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) =>
                        this.handleClick(i)}
                />
                </div>
                <ul>{moves}</ul>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b]
            && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

function lastMove(last, current) {
    for (let i = 0; i < 10; i++) {
        if (last[i] != current[i]) {
            return i;
        };
    }
    return null;
};

function formatMove(move) {
    const offset = move % 3;
    return ((move - offset + 3) / 3) + ":" + (offset + 1);
};

// ========================================

    ReactDOM.render(
        <Game />,
        document.getElementById('root')
);

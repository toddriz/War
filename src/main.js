const _ = require('lodash');
const fs = require('fs');
const { dealCards } = require('./deck.js');
const { simulateGame } = require('./war.js');

const results = [];

const printGameResult = (
    { winner, battleCount, p1ShuffleCount, p2ShuffleCount, p1Deck, p1Discard, p2Deck, p2Discard, invalidGame },
    verbose,
    gameNumber
) => {
    console.log('\n**** Game', gameNumber, '****');
    if (invalidGame) {
        console.log('** INVALID GAME **');
    }
    console.log(winner === 'p1' ? 'Player One Wins!' : 'Player Two Wins!');
    console.log('Battle Count:', battleCount);
    if (verbose) {
        console.log('Player 1 Shuffle Count:', p1ShuffleCount);
        console.log('Player 2 Shuffle Count:', p2ShuffleCount);
        console.log('Player One Deck:', p1Deck);
        console.log('Player One Discard:', p1Discard);
        console.log('Player Two Deck:', p2Deck);
        console.log('Player Two Discard:', p2Discard);
    }
};

const gamesToRun = 10000;
const numberOfDecks = 2;
const cardsPerPlayer = 52;

const runGame = (index, printResults) => {
    const [initialP1Deck, initialP2Deck] = dealCards(numberOfDecks, cardsPerPlayer);

    const result = simulateGame({ initialP1Deck, initialP2Deck, cardsPerPlayer });

    results.push(result);

    printResults && printGameResult(result, false, index + 1);
};

_.times(gamesToRun, runGame);
fs.writeFileSync('results.json', JSON.stringify(results));

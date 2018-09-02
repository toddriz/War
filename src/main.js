const _ = require('lodash');
const { dealCards } = require('./deck.js');
const { simulateGame } = require('./war.js');

const printResults = (
    { winner, battleCount, p1ShuffleCount, p2ShuffleCount, p1Deck, p1Discard, p2Deck, p2Discard },
    verbose
) => {
    console.log(winner === 'p1' ? 'Player One Wins!' : 'Player Two Wins!');
    console.log('Battle Count:', battleCount);
    console.log('Player 1 Shuffle Count:', p1ShuffleCount);
    console.log('Player 2 Shuffle Count:', p2ShuffleCount);
    if (verbose) {
        console.log('Player One Deck:', p1Deck);
        console.log('Player One Discard:', p1Discard);
        console.log('Player Two Deck:', p2Deck);
        console.log('Player Two Discard:', p2Discard);
    }
};

const numberOfDecks = 4;
const cardsPerPlayer = 52;

const [initialP1Deck, initialP2Deck] = dealCards(numberOfDecks, cardsPerPlayer);

const results = simulateGame({ initialP1Deck, initialP2Deck, cardsPerPlayer });

printResults(results, true);

const _ = require('lodash');
const { dealCards } = require('./deck.js');
const { simulateGame } = require('./war.js');

const numberOfDecks = 4;
const cardsPerPlayer = 52;

const [p1Deck, p2Deck] = dealCards(numberOfDecks, cardsPerPlayer);

const result = simulateGame({ p1Deck, p2Deck });

console.log('result', result);

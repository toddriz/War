const _ = require('lodash');
const { getDeck, getCardStrength } = require('./deck');

const playerCardCount = 52;
const deck = getDeck();
const splitDeck = _.chunk(_.concat(_.shuffle(deck), _.shuffle(deck)), playerCardCount);

const p1Deck = splitDeck[0];
const p2Deck = splitDeck[1];
const p1Discard = [];
const p2Discard = [];

let p1ShuffleCount = 0;
let p2ShuffleCount = 0;
let battleCount = 0;

const printResults = () => {
    console.log(p1Deck.length ? 'Player One Wins!' : 'Player Two Wins!');
    console.log('Battle Count:', battleCount);
    console.log('Player 1 Shuffle Count:', p1ShuffleCount);
    console.log('Player 2 Shuffle Count:', p2ShuffleCount);
};

const main = () => {
    while (p1Deck.length && p2Deck.length) {
        while (p1Deck.length && p2Deck.length) {
            battle(p1Deck.shift(), p2Deck.shift());
        }

        reShuffleDeck(p1Deck, p1Discard, 'p1');
        reShuffleDeck(p2Deck, p2Discard, 'p2');

        const cardCountChecksum = p1Deck.length + p1Discard.length + p2Deck.length + p2Discard.length;
        if (cardCountChecksum !== playerCardCount * 2) {
            console.log('******bad game******');
            break;
        }
    }

    printResults();
};

const battle = (p1Card, p2Card, tieBreakerSpoils = []) => {
    const p1CardStrength = getCardStrength(p1Card);
    const p2CardStrength = getCardStrength(p2Card);

    const spoils = _.compact([p1Card, p2Card, ...tieBreakerSpoils]);

    if (p1CardStrength > p2CardStrength) {
        p1Discard.push(...spoils);
    } else if (p2CardStrength > p1CardStrength) {
        p2Discard.push(...spoils);
    } else {
        handleTieBreaker(spoils);
    }
    ++battleCount;
};

const handleTieBreaker = previousSpoils => {
    const p1NextFourCards = getNextFourCards(p1Deck, p1Discard);
    const p2NextFourCards = getNextFourCards(p2Deck, p2Discard);

    const p1TieBreakerCard = getNextCard(p1NextFourCards);
    const p2TieBreakerCard = getNextCard(p2NextFourCards);

    const spoils = [...previousSpoils, ...p1NextFourCards, ...p2NextFourCards];

    battle(p1TieBreakerCard, p2TieBreakerCard, spoils);
};

const getNextFourCards = (deck, discard) => {
    if (deck.length < 4) {
        deck.push(..._.shuffle(discard));
        discard.splice(0);
    }
    return deck.splice(-4);
};

const getNextCard = deck => {
    if (deck.length) {
        return deck.pop();
    }
};

const reShuffleDeck = (deck, discard, player) => {
    if (_.isEmpty(deck) && !_.isEmpty(discard)) {
        deck.push(..._.shuffle(discard));
        discard.splice(0);
        if (player === 'p1') {
            ++p1ShuffleCount;
        } else {
            ++p2ShuffleCount;
        }
    }
};

main();

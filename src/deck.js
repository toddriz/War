const _ = require('lodash');

const suits = ['Spades', 'Clubs', 'Hearts', 'Diamonds'];
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const getStandardDeck = () => {
    return _.flatten(
        suits.map(suit => {
            return cards.map(card => {
                return `${card}-of-${suit}`;
            });
        })
    );
};

exports.dealCards = (numberOfDecks, cardsPerPlayer) => {
    const allCards = _.shuffle(_.flatten(_.times(numberOfDecks, getStandardDeck)));

    return _.chunk(allCards, cardsPerPlayer);
};

exports.getCardStrength = card => {
    if (!card) {
        return -1;
    } else if (card.slice(0, 2) === '10') {
        return cards.indexOf('10');
    } else {
        return cards.indexOf(card.slice(0, 1));
    }
};

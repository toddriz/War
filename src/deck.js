const suits = ['Spades', 'Clubs', 'Hearts', 'Diamonds'];
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

exports.getDeck = () => {
    const deck = [];
    cards.forEach(card => {
        suits.forEach(suit => {
            deck.push(`${card}-of-${suit}`);
        });
    });

    return deck;
};

exports.getCardRank = card => {
    if (card.slice(0, 2) === '10') {
        return 8;
    } else {
        return cards.indexOf(card.slice(0, 1));
    }
};

const _ = require('lodash');
const { getCardStrength, getDeckStrength } = require('./deck');
// cooper
// todd

exports.simulateGame = ({ initialP1Deck, initialP2Deck }) => {
    let p1ShuffleCount = 0;
    let p2ShuffleCount = 0;
    let battleCount = 0;
    let p1TieBreakWins = 0;
    let p2TieBreakWins = 0;

    const p1Deck = [...initialP1Deck];
    const p2Deck = [...initialP2Deck];
    const p1Discard = [];
    const p2Discard = [];

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

    const battle = (p1Card, p2Card, tieBreakerSpoils = []) => {
        const p1CardStrength = getCardStrength(p1Card);
        const p2CardStrength = getCardStrength(p2Card);

        const spoils = _.compact([p1Card, p2Card, ...tieBreakerSpoils]);

        if (p1CardStrength > p2CardStrength) {
            if (tieBreakerSpoils.length) {
                p1TieBreakWins++;
            }
            p1Discard.push(...spoils);
        } else if (p2CardStrength > p1CardStrength) {
            if (tieBreakerSpoils.length) {
                p2TieBreakWins++;
            }
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

    const totalCards = initialP1Deck.length + initialP2Deck.length;
    while (p1Deck.length && p2Deck.length) {
        while (p1Deck.length && p2Deck.length) {
            battle(p1Deck.shift(), p2Deck.shift());
        }

        reShuffleDeck(p1Deck, p1Discard, 'p1');
        reShuffleDeck(p2Deck, p2Discard, 'p2');

        const cardCountChecksum = p1Deck.length + p1Discard.length + p2Deck.length + p2Discard.length;
        if (cardCountChecksum !== totalCards) {
            console.log('***********bad game***********');
            invalidGame = true;
            break;
        }
    }

    return {
        winner: p1Deck.length ? 'p1' : 'p2',
        battleCount,
        p1TieBreakWins,
        p2TieBreakWins,
        p1DeckStrength: getDeckStrength(initialP1Deck),
        p2DeckStrength: getDeckStrength(initialP2Deck),
        p1ShuffleCount,
        p2ShuffleCount
    };
};

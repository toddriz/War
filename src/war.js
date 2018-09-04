const _ = require('lodash');
const { getCardStrength, getDeckStrength } = require('./deck');
// cooper
// todd

exports.simulateGame = ({ initialP1Deck, initialP2Deck }) => {
    let battleCount = 0;
    let hasP1Shuffled;
    let hasP2Shuffled;
    const p1 = {
        deck: [...initialP1Deck],
        discard: [],
        deckStrength: getDeckStrength(initialP1Deck),
        shuffleCount: 0,
        tieBreakWins: 0,
        midGameDeckSize: 0,
        midGameDeckStrength: 0
    };
    const p2 = {
        deck: [...initialP2Deck],
        discard: [],
        deckStrength: getDeckStrength(initialP2Deck),
        shuffleCount: 0,
        tieBreakWins: 0,
        midGameDeckSize: 0,
        midGameDeckStrength: 0
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

    const battle = (p1Card, p2Card, tieBreakerSpoils = []) => {
        const p1CardStrength = getCardStrength(p1Card);
        const p2CardStrength = getCardStrength(p2Card);

        const spoils = _.compact([p1Card, p2Card, ...tieBreakerSpoils]);

        if (p1CardStrength > p2CardStrength) {
            if (tieBreakerSpoils.length) {
                p1.tieBreakWins++;
            }
            p1.discard.push(...spoils);
        } else if (p2CardStrength > p1CardStrength) {
            if (tieBreakerSpoils.length) {
                p2.tieBreakWins++;
            }
            p2.discard.push(...spoils);
        } else {
            handleTieBreaker(spoils);
        }
        ++battleCount;
    };

    const handleTieBreaker = previousSpoils => {
        if (p1.deck.length < 4) {
            p1.shuffleCount++;
        }
        const p1NextFourCards = getNextFourCards(p1.deck, p1.discard);
        if (p2.deck.length < 4) {
            p2.shuffleCount++;
        }
        const p2NextFourCards = getNextFourCards(p2.deck, p2.discard);

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
                if (!hasP1Shuffled) {
                    p1.midGameDeckSize = deck.length;
                    p1.midGameDeckStrength = getDeckStrength(deck);
                }
                hasP1Shuffled = true;
                ++p1.shuffleCount;
            } else {
                if (!hasP2Shuffled) {
                    p2.midGameDeckSize = deck.length;
                    p2.midGameDeckStrength = getDeckStrength(deck);
                }
                hasP2Shuffled = true;
                ++p2.shuffleCount;
            }
        }
    };

    const totalCards = initialP1Deck.length + initialP2Deck.length;
    while (p1.deck.length && p2.deck.length) {
        while (p1.deck.length && p2.deck.length) {
            battle(p1.deck.shift(), p2.deck.shift());
        }

        reShuffleDeck(p1.deck, p1.discard, 'p1');
        reShuffleDeck(p2.deck, p2.discard, 'p2');

        const cardCountChecksum = p1.deck.length + p1.discard.length + p2.deck.length + p2.discard.length;
        if (cardCountChecksum !== totalCards) {
            console.log('***********bad game***********');
            invalidGame = true;
            break;
        }
    }

    return {
        winner: p1.deck.length ? 'p1' : 'p2',
        battleCount,
        p1: _.omit(p1,['deck', 'discard']),
        p2: _.omit(p2, ['deck', 'discard'])
    };
};

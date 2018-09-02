const { getDeck, getCardRank } = require('./deck');
const _ = require('lodash');
const playerDeckSize = 52;
const deck = getDeck();
const splitDeck = _.chunk(_.concat(_.shuffle(deck), _.shuffle(deck)), playerDeckSize);
const playerOneDeck = splitDeck[0];
const playerTwoDeck = splitDeck[1];
const playerOneDiscard = [];
const playerTwoDiscard = [];
let p1ShuffleCount = 0;
let p2ShuffleCount = 0;
let battleCount = 0;

const printResults = () => {
    console.log(playerOneDeck.length ? 'Player One Wins!' : 'Player Two Wins!');
    console.log('Battle Count:', battleCount);
    console.log('Player 1 Shuffle Count:', p1ShuffleCount);
    console.log('Player 2 Shuffle Count:', p2ShuffleCount);
};

const main = () => {
    // console.log('playerOneDeck', playerOneDeck);
    // console.log('playerTwoDeck', playerTwoDeck, '\n');

    while (playerOneDeck.length && playerTwoDeck.length) {
        while (playerOneDeck.length && playerTwoDeck.length) {
            battle(playerOneDeck.shift(), playerTwoDeck.shift());
        }
        if (_.isEmpty(playerOneDeck)) {
            playerOneDeck.push(..._.shuffle(playerOneDiscard));
            playerOneDiscard.splice(0);
            if (_.size(playerOneDeck)) {
                ++p1ShuffleCount;
            }
        }

        if (_.isEmpty(playerTwoDeck)) {
            playerTwoDeck.push(..._.shuffle(playerTwoDiscard));
            playerTwoDiscard.splice(0);
            if (playerTwoDeck) {
                ++p2ShuffleCount;
            }
        }

        if (
            playerOneDeck.length + playerOneDiscard.length + playerTwoDeck.length + playerTwoDiscard.length !==
            playerDeckSize * 2
        ) {
            console.log('******bad game******');
            break;
        }
    }

    printResults();
};

const battle = (p1Card, p2Card) => {
    const result = getWinner(p1Card, p2Card);
    const spoils = [p1Card, p2Card];

    switch (result) {
        case 'p1':
            // console.log('p1');
            playerOneDiscard.push(...spoils);
            break;

        case 'p2':
            // console.log('p2');
            playerTwoDiscard.push(...spoils);
            break;

        case 'tie':
            // console.log('tie');
            handleTieBreaker(spoils);
            break;
    }
    ++battleCount;
};

const getWinner = (p1Card, p2Card) => {
    const p1Power = getCardRank(p1Card);
    const p2Power = getCardRank(p2Card);
    if (p1Power > p2Power) {
        return 'p1';
    } else if (p2Power > p1Power) {
        return 'p2';
    } else {
        return 'tie';
    }
};

const handleTieBreaker = previousSpoils => {
    const p1NextFour = getNextFourCards(playerOneDeck, playerOneDiscard);
    const p2NextFour = getNextFourCards(playerTwoDeck, playerTwoDiscard);

    const newP1Card = p1NextFour[p1NextFour.length - 1];
    const newP2Card = p2NextFour[p2NextFour.length - 1];

    const spoils = [...previousSpoils, ...p1NextFour, ...p2NextFour];

    if (!newP1Card) {
        playerTwoDiscard.push(...spoils);
    } else if (!newP2Card) {
        playerOneDiscard.push(...spoils);
    } else {
        const result = getWinner(newP1Card, newP2Card);
        switch (result) {
            case 'p1':
                playerOneDiscard.push(...spoils);
                break;

            case 'p2':
                playerTwoDiscard.push(...spoils);
                break;

            case 'tie':
                // console.log('double tie');
                // console.log('spoils', spoils);
                handleTieBreaker(spoils);
                break;
        }
    }
};

const getNextFourCards = (deck, discard) => {
    if (deck.length < 4) {
        deck.push(..._.shuffle(discard));
        discard.splice(0);
    }
    return deck.splice(-4);
};

main();

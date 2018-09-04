const fs = require('fs');
const resultsJson = fs.readFileSync('./results.json');

const results = JSON.parse(resultsJson);

const totalGames = results.length;
let gamePredictedCorrectly = 0;

const predictResult = result => {
    const actualWinner = result.winner;
    let predictedWinner;

    const tieWeight = 10;
    const midGameDeckSizeWeight = -0.5;
    const midGameDeckStrengthWeight = 0.0;
    const deckStrengthWeight = 0.15;
    const shuffleCountWeight = -3.0;

    const p1Score =
        result.p1.tieBreakWins * tieWeight +
        result.p1.midGameDeckSize * midGameDeckSizeWeight +
        result.p1.midGameDeckStrength * midGameDeckStrengthWeight +
        result.p1.deckStrength * deckStrengthWeight +
        result.p1.shuffleCount * shuffleCountWeight;

    const p2Score =
        result.p2.tieBreakWins * tieWeight +
        result.p2.midGameDeckSize * midGameDeckSizeWeight +
        result.p2.midGameDeckStrength * midGameDeckStrengthWeight +
        result.p2.deckStrength * deckStrengthWeight +
        result.p2.shuffleCount * shuffleCountWeight;

    predictedWinner = p1Score > p2Score ? 'p1' : 'p2';

    if (actualWinner === predictedWinner) {
        gamePredictedCorrectly++;
    }
};

results.forEach(predictResult);

console.log(
    `Prediction Results - ${(gamePredictedCorrectly / totalGames) * 100}% - ${gamePredictedCorrectly} / ${totalGames}`
);

import React from 'react';

const GameInstructions = () => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mt-4 text-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-3">How to Play the Stock Prediction Game</h2>

            <h3 className="text-base font-semibold text-gray-700 mb-2">Part 1: Price Prediction</h3>
            <ol className="list-decimal list-inside mb-4 space-y-1">
                <li>Select a stock from the dropdown menu.</li>
                <li>View the historical data and chart for the selected stock.</li>
                <li>Choose a future date for your prediction.</li>
                <li>Enter your prediction for the stock price on that date.</li>
                <li>Submit your prediction and see how it compares to the model's prediction.</li>
                <li>Earn points based on the accuracy of your prediction!</li>
            </ol>

            <h3 className="text-base font-semibold text-gray-700 mb-2">Part 2: Sentiment Analysis</h3>
            <ol className="list-decimal list-inside mb-4 space-y-1">
                <li>After submitting your price prediction, you'll see recent news headlines for the stock.</li>
                <li>Use the sentiment slider to indicate your overall sentiment about the stock based on these headlines.</li>
                <li>Click "Analyze Sentiment" to see how your sentiment compares to the average sentiment from our analysis.</li>
                <li>Earn additional points based on how closely your sentiment matches the analyzed sentiment!</li>
            </ol>

            <p className="text-gray-600 italic">
                Your final score combines both your price prediction accuracy and sentiment analysis skills.
                The more accurate you are in both aspects, the higher your total score!
            </p>
        </div>
    );
};

export default GameInstructions;
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    enum Choice { None, Rock, Paper, Scissors }

    function play(Choice playerChoice) external payable {
        require(msg.value > 0, "Bet amount must be greater than 0");
        require(playerChoice >= Choice.Rock && playerChoice <= Choice.Scissors, "Invalid choice");

        Choice contractChoice = randomChoice();
        Choice winner = determineWinner(playerChoice, contractChoice);
        uint256 payout = winner == playerChoice ? msg.value * 2 : 0;
        
        if (payout > 0) {
            payable(msg.sender).transfer(payout);
        }
    }

    function randomChoice() internal view returns (Choice) {
        uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty)));
        return Choice(rand % 3 + 1);
    }

    function determineWinner(Choice playerChoice, Choice contractChoice) internal pure returns (Choice) {
        if (playerChoice == contractChoice) {
            return Choice.None;
        } else if (playerChoice == Choice.Rock && contractChoice == Choice.Scissors) {
            return Choice.Rock;
        } else if (playerChoice == Choice.Paper && contractChoice == Choice.Rock) {
            return Choice.Paper;
        } else if (playerChoice == Choice.Scissors && contractChoice == Choice.Paper) {
            return Choice.Scissors;
        } else {
            return contractChoice;
        }
    }
}
//0xBfC5A0b6F9D3aa42daB7Ba0a07C2058c8d97E92a

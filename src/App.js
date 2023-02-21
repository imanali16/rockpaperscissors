import React, { Component } from "react";
import RockPaperScissors from "./contracts/RockPaperScissors.json";
import getWeb3 from "./getWeb3";



class App extends Component {
  state = { 
    web3: null, 
    account: null,
    contract: null,
    playerChoice: "",
    betAmount: 0,
    result: ""
  };

  async componentDidMount() {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = RockPaperScissors.networks[networkId];
      const contract = new web3.eth.Contract(
        RockPaperScissors.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log("web3:", web3);
      console.log("accounts:", accounts);
      console.log("deployedNetwork:", deployedNetwork);
      console.log("contract:", contract);
      this.setState({ web3, accounts, contract });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  play = async () => {
    const { account, contract, playerChoice, betAmount } = this.state;
    await contract.methods.play(playerChoice).send({ value: betAmount, from: account })
    .on('transactionHash', function(hash){
        document.getElementById("result").innerHTML = "Waiting for opponent's move...";
    })
    .on('receipt', function(receipt){
        const winner = receipt.events.Result.returnValues.winner;
        const payout = receipt.events.Result.returnValues.payout;
        if (winner === "player") {
            document.getElementById("result").innerHTML = "You win " + payout + " BNB!";
        } else if (winner === "opponent") {
            document.getElementById("result").innerHTML = "You lose. Better luck next time.";
        } else {
            document.getElementById("result").innerHTML = "It's a tie!";
        }
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Rock, Paper, Scissors Game</h1>
        <div id="account">Account: {this.state.account}</div>
        <br />
        <label htmlFor="playerChoice">Select your move:</label>
        <br />
        <button id="rockBtn" onClick={() => this.setState({ playerChoice: "rock" })}>Rock</button>
        <button id="paperBtn" onClick={() => this.setState({ playerChoice: "paper" })}>Paper</button>
        <button id="scissorsBtn" onClick={() => this.setState({ playerChoice: "scissors" })}>Scissors</button>
        <br />
        <label htmlFor="betAmount">Enter your bet amount (in BNB):</label>
        <br />
        <input type="number" id="betAmount" onChange={(e) => this.setState({ betAmount: e.target.value })}></input>
        <br />
        <button id="playBtn" onClick={this.play}>Play!</button>
        <br />
        <div id="result">{this.state.result}</div>
      </div>
    );
  }
}

export default App;

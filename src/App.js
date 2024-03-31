import "./App.css";
import React, { Component } from 'react';
import GameCard from "./GameCard.js"
import GameAddModal from "./GameAddModal.js"
import { Navbar, Button, Modal } from "react-bulma-components"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addGame: false,
      games: [
        {
          title: "Banishers: Ghosts of New Eden", 
          imgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.wallpapersden.com%2Fimage%2Fdownload%2Fbanishers-ghosts-of-new-eden-8k-gaming_bmZla2eUmZqaraWkpJRobWllrWdpZWU.jpg&f=1&nofb=1&ipt=26672634bf575db644752df3ec0b7698ddba992128bb83d0f1928c773f06646f&ipo=images",
          platform: "PC",
          ratingTotal: "9.6"
        },
        {
          title: "Assassin's Creed Valhalla", 
          imgUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp6364510.jpg&f=1&nofb=1&ipt=b49200f0e81fdeab99ccbe80f88c755affe775356b63de40807ef1ad5ec50d2d&ipo=images",
          platform: "PC",
          ratingTotal: "8.3"
        },
      ]
    }
    this.beginAddGame = this.beginAddGame.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  beginAddGame() {
    this.setState({
      addGame: true
    })
  }
  finishAddGame(gameState) {

  }
  closeModal() {
    this.setState({addGame: false});
  }
  render() {
    return (
      <div className="App">
        {/* NAVBAR */}
        <Navbar className="is-background-grey-light">
          <Navbar.Brand>
            <b className="navbar-item ml-2">GameRanker 🎮</b>
          </Navbar.Brand>
          <div className="navbar-end mr-2"/>
        </Navbar>

        {/* MAIN CONTENT */}
        <div className="mt-5 mx-4">
          {/* TOOLBAR */}
          <div className="mx-2 is-flex is-justify-content-space-between">
            <div>
              <Button onClick={this.beginAddGame}>Add Game</Button>
            </div>
            <div>
              <Button className="mr-1">Load</Button>
              <Button className="ml-1">Save</Button>
            </div>
          </div>
          {/* DISPLAY */}
          <div className="is-flex mt-5">
            {this.state.games.map(g => 
              (<GameCard
                name={g.title}
                imgSrc={g.imgUrl}
                platform={g.platform}
                rating={g.ratingTotal}
              />)
            )}
          </div>
        </div>

        {/* MODAL */}
        <Modal show={this.state.addGame} onClose={this.closeModal}>
          <GameAddModal 
            show={this.state.addGame} 
            onFinish={(g) => {this.state.games.push(g); this.closeModal()}}
          />
        </Modal>
      </div>
    );
  }
}

export default App;

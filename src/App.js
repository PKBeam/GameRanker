import "./App.css";
import React, { Component } from 'react';
import GameCard from "./GameCard.js"
import GameAddModal from "./GameAddModal.js"
import { Navbar, Button, Modal, Form } from "react-bulma-components"

class App extends Component {
  constructor(props) {
    super(props);
    let savedRanking = this.loadListFromWebStorage() ?? "[]"
    this.state = {
      addGame: false,
      games: JSON.parse(savedRanking),
      editIndex: null
    }
    this.beginAddGame = this.beginAddGame.bind(this)
    this.finishAddGame = this.finishAddGame.bind(this)
    this.saveList = this.saveList.bind(this)
    this.loadList = this.loadList.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  
  beginAddGame() {
    this.setState({
      addGame: true
    })
  }
  
  finishAddGame(gameState) {
    let games = this.state.games
    if (this.state.editIndex !== null) {
      if (gameState == null) {
        games.splice(this.state.editIndex, 1)
      } else {
        games[this.state.editIndex] = gameState
      }
    } else {
      games.push(gameState)
    }
    this.setState({
      games: games,
      editIndex: null
    }, () => {
      this.closeModal()
      this.saveListToWebStorage(JSON.stringify(this.state.games))
    })
  }

  beginEditGame(index) {
    this.setState({
      addGame: true,
      editIndex: parseInt(index)
    })
  }
  
  saveList() {
    const fileData = JSON.stringify(this.state.games);
    this.saveListToWebStorage(fileData)
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `rating-list-${Date.now()}.txt`;
    link.href = url;
    link.click();
  }

  saveListToWebStorage(list) {
    window.localStorage.setItem("savedRanking", list)
  }
  
  loadList(e) {
    var reader = new FileReader();

    reader.onload = (e) => {
      this.saveListToWebStorage(reader.result)
      var j = JSON.parse(reader.result)
      this.setState({
        games: j
      })
    }

    reader.readAsText(e.target.files[0], "utf-8");
  }

  loadListFromWebStorage() {
    return window.localStorage.getItem("savedRanking")
  }
  
  closeModal() {
    this.setState({
      addGame: false, 
      editIndex: null
    });
  }

  render() {
    let editingGame = this.state.editIndex === null ? null : this.state.games[parseInt(this.state.editIndex)]
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
            <div className="is-flex">
              <Form.InputFile className="mr-1" onInput={this.loadList} label="Load"></Form.InputFile>
              <div>
                <Button className="ml-1" onClick={this.saveList}>Save</Button>
              </div>
            </div>
          </div>
          {/* DISPLAY */}
          <div className="grid mt-5 is-col-min-1" style={{width: "100%"}}>
            {this.state.games.map((g, i) => 
              (<div className="cell" key={i}><GameCard
                name={g.title ?? "Untitled game"}
                imgSrc={g.imgUrl}
                platform={g.platform}
                rating={g.ratingTotal}
                onClick={(e) => this.beginEditGame(i)}
              /></div>)
            )}
          </div>
        </div>

        {/* MODAL */}
        <Modal show={this.state.addGame} onClose={this.closeModal}>
          <GameAddModal 
            isEditing={this.state.editIndex !== null}
            title={this.state.editIndex === null ? null : editingGame.title}
            imgUrl={this.state.editIndex === null ? null : editingGame.imgUrl}
            platform={this.state.editIndex === null ? null : editingGame.platform}
            ratingStory={this.state.editIndex === null ? null : editingGame.ratingStory}
            ratingGplay={this.state.editIndex === null ? null : editingGame.ratingGplay}
            ratingTotal={this.state.editIndex === null ? null : editingGame.ratingTotal}
            show={this.state.addGame}
            onFinish={this.finishAddGame}
          />
        </Modal>
      </div>
    );
  }
}

export default App;

import "./App.css";
import React, { Component } from 'react';
import GameCard from "./GameCard.js"
import GameAddModal from "./GameAddModal.js"
import { Navbar, Button, Dropdown, Modal, Form } from "react-bulma-components"

class App extends Component {
  sortKeys = {
    "Title": g => g.title?.toUpperCase(),
    "Rating": g => g.ratingTotal?.toUpperCase(),
  }
  filters = {
    "PC": g => g.platform === "PC",
    "Xbox": g => g.platform === "Xbox",
    "PlayStation": g => g.platform === "PlayStation",
    "Nintendo": g => g.platform === "Nintendo",
    "Mobile": g => g.platform === "Mobile",
    "Has selected rating": g => g[this.state.ratingDisplayOption] != null,
    "Has story rating": g => g.ratingStory != null,
    "Has gameplay rating": g => g.ratingGplay != null,
    "Has overall rating": g => g.ratingTotal != null,
  }
  filterCombines = {
    "AND": (x, y) => x && y,
    "OR": (x, y) => x || y,
  }

  constructor(props) {
    super(props);
    this.state = {
      addGame: false,
      games: JSON.parse(this.loadListFromWebStorage() ?? "[]"),
      editIndex: null,
      searchFilter: null,
      filterCombineOption: "AND",
      ratingDisplayOption: "ratingTotal",
      sortOption: 1,
      filterOptions: new Set(),
    }
    this.beginAddGame = this.beginAddGame.bind(this)
    this.finishAddGame = this.finishAddGame.bind(this)
    this.saveList = this.saveList.bind(this)
    this.loadList = this.loadList.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.addFilter = this.addFilter.bind(this)
    this.getGameIndex = this.getGameIndex.bind(this)
  }
  
  getGameIndex(g) {
    let games = this.state.games
    for (let i = 0; i < games.length; i++) {
      if (JSON.stringify(g) === JSON.stringify(games[i])) {
        console.log(i)
        return i
      }
    }
    return -1
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

  beginEditGame(game) {
    let index = this.getGameIndex(game)
    this.setState({
      addGame: true,
      editIndex: index
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
  
  sortedGames(option) {
    let sortKey = Math.abs(option)
    let direction = Math.sign(option)
    let games = structuredClone(this.state.games)
    games.sort((g1, g2) => {
      let getKeyFn = Object.values(this.sortKeys)[sortKey - 1]
      let k1 = getKeyFn(g1)
      let k2 = getKeyFn(g2)

      if (k1 == null || k2 == null) {
        return true
      }

      let result = k1 > k2
      if (direction === -1) {
        result = !result
      }
      return result
    })
    return games
  }

  addFilter(value) {
    let f = this.state.filterOptions;
    if (f.has(value)) {
      f.delete(value)
    } else {
      f.add(value); 
    }
    this.setState({filterOptions: f})
  }

  passesFilter(g) {
    if (this.state.filterOptions.size === 0) {
      return true
    }
    let filterResults = [...this.state.filterOptions].map(f => Object.values(this.filters)[f](g))
    return filterResults.reduce(this.filterCombines[this.state.filterCombineOption])
  }

  passesSearch(g) {
    if (this.state.searchFilter == null) {
      return true
    }
    let searchTerm = this.state.searchFilter.toUpperCase();
    let gameTitle = g.title.toUpperCase();

    // if alphanumeric search term, search only alphanumberic
    // otherwise include other special chars
    if (searchTerm.match(/^[a-z0-9]+$/i)) {
      gameTitle = gameTitle.replace(/\W/g, "")
    }

    return gameTitle.includes(searchTerm)
  }

  render() {
    let gamesSorted = this.sortedGames(this.state.sortOption)
    let editingGame = this.state.games[this.state.editIndex]
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
          <div className="mx-2 is-flex is-justify-content-space-between is-flex-wrap-wrap">
            {/* ADD GAME */}
            <div className="m-2">
              <Button className="pl-2" onClick={this.beginAddGame}>➕ Add Game</Button>
            </div>
            {/* RATING DISPLAY */}
            <div className="m-2">
              <Dropdown
                label="Rating display"
                icon={<div className="ml-2">▼</div>}
                onChange={(value) => {this.setState({ratingDisplayOption: value})}}
              >
                <Dropdown.Item value="ratingStory" className={"has-text-left" + (this.state.ratingDisplayOption === "ratingStory" ? " has-text-weight-bold" : "")} renderAs="a">{"Story"}</Dropdown.Item>
                <Dropdown.Item value="ratingGplay" className={"has-text-left" + (this.state.ratingDisplayOption === "ratingGplay" ? " has-text-weight-bold" : "")} renderAs="a">{"Gameplay"}</Dropdown.Item>
                <Dropdown.Item value="ratingTotal" className={"has-text-left" + (this.state.ratingDisplayOption === "ratingTotal" ? " has-text-weight-bold" : "")} renderAs="a">{"Overall"}</Dropdown.Item>
              </Dropdown>
            </div>
            {/* SEARCH */}
            <div className="m-2" style={{minWidth: "10em", flexGrow: "2"}}>
              <Form.Input
                placeholder="Search games..."
                onChange={(e) => {this.setState({searchFilter: e.target.value})}}
              >
              </Form.Input>
            </div>
            {/* SORT */}
            <div className="m-2">
              <Dropdown
                label="Sort"
                icon={<div className="ml-2">▼</div>}
                onChange={(value) => {this.setState({sortOption: value})}}
              >
                {Object.keys(this.sortKeys).flatMap((k, i) => {
                  return [
                    <Dropdown.Item key={2*i+1} value={i + 1} className={"has-text-left" + (this.state.sortOption ===  i + 1 ? " has-text-weight-bold" : "")} renderAs="a">{`${k} (ascending)`}</Dropdown.Item>,
                    <Dropdown.Item key={2*i} value={-(i + 1)} className={"has-text-left" + (this.state.sortOption === -i - 1 ? " has-text-weight-bold" : "")} renderAs="a">{`${k} (descending)`}</Dropdown.Item>
                  ]
                })}
              </Dropdown>
            </div>
            {/* FILTER */}
            <div className="m-2" style={{whiteSpace: "nowrap"}}>
              {/* FILTER OPTIONS */}
              <Dropdown
                label={`Filters (${this.state.filterOptions.size})`}
                icon={<div className="ml-2">▼</div>}
                onChange={this.addFilter}
                closeOnSelect={false}
              >
                {Object.keys(this.filters).map((f, i) => {
                  return <Dropdown.Item key={i} value={i} className={"has-text-left" + (this.state.filterOptions.has(i) ? " has-text-weight-bold" : "")} renderAs="a">{`${f}`}</Dropdown.Item>
                })}
              </Dropdown>
              {/* FILTER COMBINE */}
              <Dropdown
                label={this.state.filterCombineOption}
                icon={<div className="ml-2">▼</div>}
                onChange={(value) => {this.setState({filterCombineOption: value})}}
                className="ml-2"
              >
                <Dropdown.Item value="AND" className={"has-text-left" + (this.state.filterCombineOption === "AND" ? " has-text-weight-bold" : "")} renderAs="a">{"AND"}</Dropdown.Item>
                <Dropdown.Item value="OR" className={"has-text-left" + (this.state.filterCombineOption === "OR" ? " has-text-weight-bold" : "")} renderAs="a">{"OR"}</Dropdown.Item>
              </Dropdown>
            </div>
            {/* SAVE/LOAD */}
            <div className="is-flex m-2">
              <Form.InputFile className="mr-1" onInput={this.loadList} label="⬇ Load"></Form.InputFile>
              <div>
                <Button className="ml-1" onClick={this.saveList}>⬆ Save</Button>
              </div>
            </div>
          </div>
          {/* DISPLAY */}
          <div className="grid is-col-min-10 mx-2">
            {gamesSorted.map((g, i) => {
              return this.passesFilter(g) && this.passesSearch(g) ?
                (<div className="cell" key={i}>
                  <GameCard
                    name={g.title ?? "Untitled game"}
                    imgSrc={g.imgUrl}
                    platform={g.platform}
                    rating={g[this.state.ratingDisplayOption]}
                    onClick={(e) => this.beginEditGame(g)}
                  />
                </div>) : ""
            })}
          </div>
        </div>

        {/* MODAL */}
        <Modal show={this.state.addGame} onClose={this.closeModal}>
          { this.state.editIndex === null ? <GameAddModal show={this.state.addGame} onFinish={this.finishAddGame}/> :
            <GameAddModal 
              isEditing
              title={editingGame.title}
              imgUrl={editingGame.imgUrl}
              platform={editingGame.platform}
              ratingStory={editingGame.ratingStory}
              ratingGplay={editingGame.ratingGplay}
              ratingTotal={editingGame.ratingTotal}
              show={this.state.addGame}
              onFinish={this.finishAddGame}
            />
          }
        </Modal>
      </div>
    );
  }
}

export default App;

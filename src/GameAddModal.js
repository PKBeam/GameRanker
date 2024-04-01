import React, { Component } from 'react';
import { Button, Card, Form } from "react-bulma-components"

class GameAddModal extends Component {
  initialised = false
  constructor(props) {
    super(props);
    this.state = {
      isEditing: props.isEditing,
      deleteConfirm: false,
      game: {
        title: props.title,
        platform: props.platform ?? "PC",
        imgUrl: props.imgUrl,
        ratingStory: props.ratingStory,
        ratingGplay: props.ratingGplay,
        ratingTotal: props.ratingTotal,
      }
    }
    this.submit = this.submit.bind(this)
    this.delete = this.delete.bind(this)
    this.editGame = this.editGame.bind(this)
  }

  validateRating(x) {
    let nx = Number(x)
    if (x === null || x === "" || isNaN(nx)) {
      return null 
    } else {
      return Math.max(Math.min(nx, 10), 0)
    }
  }

  submit() {
    let rs = this.validateRating(this.state.game.ratingStory)
    let rg = this.validateRating(this.state.game.ratingGplay)
    let rt = this.validateRating(this.state.game.ratingTotal)
    
    let url = this.state.game.imgUrl
    if (url === "") {
      url = null
    }

    let game = this.state.game
    game.imgUrl = url
    game.ratingStory = rs
    game.ratingGplay = rg
    game.ratingTotal = rt

    this.setState({
      game: game
    }, () => {
      this.props.onFinish(game)
    })
  }

  delete() {
    if (!this.state.deleteConfirm) {
      this.setState({
        deleteConfirm: true
      })
    } else {
      this.setState({
        deleteConfirm: false
      }, () => {
        this.props.onFinish(null)
      })
    }
  }

  editGame(key, val) {
    let game = this.state.game
    game[key] = val.target.value
    this.setState({
      game: game
    })
  }

  render() {
    let game = this.state.game
    return (
      <Card>
        <Card.Header>
          <Card.Header.Title>Add a game</Card.Header.Title>
        </Card.Header>
        <Card.Content>
          <Form.Field>
            <Form.Label>Game Title</Form.Label>
            <Form.Input onChange={(e) => this.editGame("title", e)} defaultValue={game.title}/>
          </Form.Field>
          <Form.Field>
            <Form.Label>Platform</Form.Label>
            <Form.Select defaultValue={game.platform} onChange={(e) => this.editGame("platform", e)}>
              <option>PC</option>
              <option>Xbox</option>
              <option>PlayStation</option>
              <option>Nintendo</option>
              <option>Mobile</option>
              <option>Other</option>
            </Form.Select>
          </Form.Field>
          <Form.Field>
            <div className="is-flex is-align-items-baseline">
              <Form.Label>Image URL</Form.Label>
              <Form.Label className="is-size-7 ml-1" style={{fontWeight: "normal"}}>(optional)</Form.Label>
            </div>
            <Form.Input onChange={(e) => this.editGame("imgUrl", e)} defaultValue={game.imgUrl}/>
          </Form.Field>
          <div className="is-flex is-align-items-baseline">
            <Form.Label>Ratings</Form.Label>
            <Form.Label className="is-size-7 ml-1" style={{fontWeight: "normal"}}>(enter a number from 0 to 10 inclusive)</Form.Label>
          </div>
          <div className="is-flex">
            <div style={{width: "7em"}}>
              <Form.Field className="is-flex is-align-items-center">
                <Form.Label className="m-0 mr-3" style={{fontWeight: "normal"}}>Story</Form.Label>
                <Form.Input style={{width: "3.5em"}} onChange={(e) => this.editGame("ratingStory", e)} defaultValue={game.ratingStory}/>
              </Form.Field>
            </div>
            <div style={{width: "13em"}}>
              <Form.Field className="is-flex is-align-items-center mx-5">
                <Form.Label className="m-0 mr-3" style={{fontWeight: "normal"}}>Gameplay</Form.Label>
                <Form.Input style={{width: "3.5em"}} onChange={(e) => this.editGame("ratingGplay", e)} defaultValue={game.ratingGplay}/>
              </Form.Field>
            </div>
            <div style={{width: "7em"}}>
              <Form.Field className="is-flex is-align-items-center">
                <Form.Label className="m-0 mr-3" style={{fontWeight: "normal"}}>Overall</Form.Label>
                <Form.Input style={{width: "3.5em"}} onChange={(e) => this.editGame("ratingTotal", e)} defaultValue={game.ratingTotal}/>
              </Form.Field>
            </div>
          </div>
        </Card.Content>
        <Card.Footer className="is-flex is-justify-content-space-between">
          <div>
          {(!this.state.isEditing) ? null :
          <Button 
            className="my-3 ml-5 is-danger" 
            onClick={this.delete}
          >
            {this.state.deleteConfirm ? "Confirm Delete" : "Delete Game"}
          </Button>}
          </div>
          <Button 
            className="my-3 mr-5" 
            onClick={this.submit}
          >
            Done
          </Button>
        </Card.Footer>
      </Card>
    )
  }
}
export default GameAddModal;
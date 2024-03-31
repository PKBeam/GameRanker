import React, { Component } from 'react';
import { Button, Card, Form } from "react-bulma-components"

class GameAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      platform: null,
      imgUrl: null,
      ratingStory: null,
      ratingGplay: null,
      ratingTotal: null,
    }
    this.submit = this.submit.bind(this)
  }

  validateRating(x) {
    let nx = Number(x)
    if (x == "" || nx == NaN) {
      return null
    } else {
      return Math.max(Math.min(nx, 10), 0)
    }
  }

  imgUrlValid(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = () => {
      return request.status == 200
    }
  }

  submit() {
    let rs = this.validateRating(this.state.ratingStory)
    let rg = this.validateRating(this.state.ratingGplay)
    let rt = this.validateRating(this.state.ratingTotal)
    
    let url = this.state.imgUrl
    if (url == "" || !this.imgUrlValid(url)) {
      url = null
    }
    
    this.setState({
      imgUrl: url,
      ratingStory: rs,
      ratingGplay: rg,
      ratingTotal: rt
    }, () => {
      console.log(this.state)
      this.props.onFinish(this.state)
    })
  }

  render() {
    return (
      <Card>
        <Card.Header>
          <Card.Header.Title>Add a game</Card.Header.Title>
        </Card.Header>
        <Card.Content>
          <Form.Field>
            <Form.Label>Game Title</Form.Label>
            <Form.Input onChange={(e) => this.setState({title: e.target.value})}></Form.Input>
          </Form.Field>
          <Form.Field>
            <Form.Label>Platform</Form.Label>
            <Form.Select onChange={(e) => this.setState({platform: e.target.value})}>
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
            <Form.Input onChange={(e) => this.setState({imgUrl: e.target.value})}></Form.Input>
          </Form.Field>
          <div className="is-flex is-align-items-baseline">
            <Form.Label>Ratings</Form.Label>
            <Form.Label className="is-size-7 ml-1" style={{fontWeight: "normal"}}>(enter a number from 0 to 10 inclusive)</Form.Label>
          </div>
          <div className="is-flex">
            <div style={{width: "7em"}}>
              <Form.Field className="is-flex is-align-items-center">
                <Form.Label className="m-0 mr-3" style={{fontWeight: "normal"}}>Story</Form.Label>
                <Form.Input style={{width: "3.5em"}} onChange={(e) => this.setState({ratingStory: e.target.value})}></Form.Input>
              </Form.Field>
            </div>
            <div style={{width: "13em"}}>
              <Form.Field className="is-flex is-align-items-center mx-5">
                <Form.Label className="m-0 mr-3" style={{fontWeight: "normal"}}>Gameplay</Form.Label>
                <Form.Input style={{width: "3.5em"}} onChange={(e) => this.setState({ratingGplay: e.target.value})}></Form.Input>
              </Form.Field>
            </div>
            <div style={{width: "7em"}}>
              <Form.Field className="is-flex is-align-items-center">
                <Form.Label className="m-0 mr-3" style={{fontWeight: "normal"}}>Overall</Form.Label>
                <Form.Input style={{width: "3.5em"}} onChange={(e) => this.setState({ratingTotal: e.target.value})}></Form.Input>
              </Form.Field>
            </div>
          </div>
        </Card.Content>
        <Card.Footer className="is-flex is-justify-content-flex-end">
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
import React, { Component } from 'react';
import { Card } from "react-bulma-components"

class GameCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      imgSrc: props.imgSrc,
      platform: props.platform,
      rating: props.rating
    };            
  }

  getRatingColor() {
    let w = this.state.rating / 10
    let c1 = [ 76, 175, 80]
    let c2 = [255, 193,  7]
    let c3 = [244,  67, 54]

    let b1, b2;
    if (w > 0.5) {
      w -= 0.5
      w /= 0.5
      b1 = c1
      b2 = c2
    } else {
      b1 = c2
      b2 = c3
    }

    let b = [
      Math.round(w * b1[0] + (1-w) * b2[0]).toString(16).padStart(2, "0"),
      Math.round(w * b1[1] + (1-w) * b2[1]).toString(16).padStart(2, "0"),
      Math.round(w * b1[2] + (1-w) * b2[2]).toString(16).padStart(2, "0"),
    ]
    return "#" + b[0] + b[1] + b[2];
  }
       
  render() {
    return (
      <div className="mx-2">
        <Card style={{width: "200px"}}>
          <Card.Header>
            <Card.Header.Title className="is-size-7 mx-2 px-0 py-1" style={{whiteSpace: "nowrap", textOverflow: "clip", overflow: "scroll"}}>{this.state.name}</Card.Header.Title>
          </Card.Header>
          <div style={{maxHeight: "100px", minHeight:"100px", overflow: "hidden", objectFit: "cover"}}>
            <img src={this.state.imgSrc}/>
          </div>
          <Card.Footer>
            <Card.Footer.Item className="py-1 has-text-justified is-size-7" style={{minWidth: "33%"}}>{this.state.platform}</Card.Footer.Item>
            <Card.Footer.Item className="py-1 has-text-justified" style={{minWidth: "33%", fontWeight:"bold", backgroundColor: this.getRatingColor()}}>{(this.state.rating * 1).toPrecision(2)}</Card.Footer.Item>
            <Card.Header.Icon className="py-1 has-text-justified" style={{minWidth: "33%"}}>...</Card.Header.Icon>
          </Card.Footer>
        </Card>
      </div>
    )
  }
}
export default GameCard;
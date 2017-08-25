import React, {Component} from 'react';
import './Item.css';

class Item extends Component {

  render() {
    return (
      <li className="Item-root" onClick={this.props.onClick}>
        <span className="Item-name">{this.props.name}</span>
        <span className="Item-value">{parseFloat(this.props[this.props.display]).toFixed(2)}</span>
      </li>
    );
  }

}

export default Item;

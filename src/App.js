import React, { Component } from 'react';
import './App.css';
import logo from './icons/ticker-logo.svg';
import Item from './Item'

//https://coinmarketcap-nexuist.rhcloud.com/api/btc/(price)
//https://api.cryptonator.com/api/ticker/doge-usd
const API_BASE = 'https://api.cryptonator.com/api/ticker/';
const CUR_SYMBOLS = ['btc', 'eth', 'dash', 'ltc', 'etc', 'xrp'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseCurrency: 'usd',
      display: 'price',
      isLoaded: false,
      loadedCurrencies: [],
    };
  }

  componentWillMount() {
    this._refreshContent();
  }

  _handleToggleBase() {
    this.setState({
      baseCurrency: this.state.baseCurrency === 'usd' ? 'eur' : 'usd',
    }, () => {
      this._refreshContent();
    });
  }

  _handleToggleDisplay() {
    this.setState({
      display: this.state.display === 'price' ? 'volume' : 'price',
    });
  }

  _handleRefresh() {
    this.setState({
      isLoaded: false,
    });
    this._refreshContent();
  }

  _refreshContent() {
    const requests = CUR_SYMBOLS.map(function(symbol) {
      return fetch(`${API_BASE}${symbol}-${this.state.baseCurrency}`)
        .then(function(res) {
          return res.json();
        });
    }.bind(this));

    Promise.all(requests)
      .then(function (responses) {
        this.setState(function(state) {
          let currencies = [];
          for (const data of responses) {
            currencies.push({
              price: data.ticker.price,
              name: data.ticker.base,
              volume: data.ticker.volume,
              change: data.ticker.change,
            })
          }

          return {
            isLoaded: true,
            loadedCurrencies: currencies,
          };
        });
      }.bind(this));
  }

  _renderContent() {
    return this.state.loadedCurrencies.map(function(data) {
      // return <li key={data.name}>{data.name} - {data.price}</li>
      return <Item
        key={data.name}
        display={this.state.display}
        onClick={this._handleToggleDisplay.bind(this)}
        {...data}
      />;
    }.bind(this));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Crypto Ticker</h2>
          <div className="App-headerOptions">
            {this.state.baseCurrency === 'usd' && (
              <a onClick={this._handleToggleBase.bind(this)}>Switch EUR</a>
            )}
            {this.state.baseCurrency === 'eur' && (
              <a onClick={this._handleToggleBase.bind(this)}>Switch USD</a>
            )}
            <a onClick={this._handleRefresh.bind(this)}>Refresh</a>
          </div>
        </div>
        {!this.state.isLoaded && <p className="App-loading">
          Loading...
        </p>}
        {/* Insert new code here */}
        {this.state.isLoaded && (
          <ul className="App-list">
            {this._renderContent()}
          </ul>
        )}
      </div>
    );
  }
}

export default App;

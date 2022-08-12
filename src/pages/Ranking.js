import React, { Component } from 'react';
import propTypes from 'prop-types';

export default class Ranking extends Component {
  state = {
    userRanking: [],
  }

  componentDidMount() {
    this.getLocalStorage();
  }

  getLocalStorage = () => {
    const teste = JSON.parse(localStorage.getItem('ranking'));
    if (teste) {
      this.setState({ userRanking: teste.sort((a, b) => b.score - a.score) });
    }
  }

  render() {
    const { userRanking } = this.state;
    const { history } = this.props;
    return (
      <div>
        <h1 data-testid="ranking-title">Ranking</h1>
        {
          userRanking.length > 0 && (
            <div>
              {
                userRanking.map((rank, index) => (
                  <div key={ index }>
                    <img
                      src={ rank.picture }
                      alt="gravatar"
                    />
                    <p
                      data-testid={ `player-name-${index}` }
                    >
                      { rank.name }
                    </p>
                    <p
                      data-testid={ `player-score-${index}` }
                    >
                      {rank.score}
                    </p>
                  </div>
                ))
              }
            </div>
          )
        }
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ () => history.push('/') }
        >
          Play Again
        </button>
      </div>
    );
  }
}

Ranking.propTypes = {
  history: propTypes.objectOf(propTypes.any),
}.isRequired;

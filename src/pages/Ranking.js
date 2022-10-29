import React, { Component } from 'react';
import propTypes from 'prop-types';
import '../styles/Ranking.css';

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
      <div className="ranking-container">
        <div className="header-container">
          <span data-testid="ranking-title">Ranking</span>
        </div>
        <div className="all-rankings-container">
          {
            userRanking.length > 0 && (
              <div>
                {
                  userRanking.map((rank, index) => (
                    <div key={ index } className="users-container">
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
                        {'Score: '}
                        {rank.score}
                      </p>
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ () => history.push('/') }
          className="btn btn-warning"
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

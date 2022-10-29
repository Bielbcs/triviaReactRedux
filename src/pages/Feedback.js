import React, { Component } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';
import '../styles/Feedback.css';

class Feedback extends Component {
  resetGame = (path) => {
    const { history, dispatch } = this.props;
    const reset = {
      assertions: '',
      score: 0,
    };
    dispatch({ type: 'SCORE_ASSERTIONS_RESET', reset });
    history.push(path);
  }

  render() {
    const { assertions, score } = this.props;
    const MAGICTHREE = 3;
    return (
      <div className="feedback-container">
        <Header />
        <div className="feedback">
          <h2 data-testid="feedback-total-question">
            Assertions:
            {' '}
            {assertions}
          </h2>
          <h2 data-testid="feedback-total-score">
            Score:
            {' '}
            {score}
          </h2>
          <h1 data-testid="feedback-text">
            {
              assertions < MAGICTHREE ? 'Could be better...' : 'Well Done!'
            }
          </h1>
          <button
            type="button"
            className="btn btn-primary"
            data-testid="btn-play-again"
            onClick={ () => this.resetGame('/') }
          >
            Play Again
          </button>
          <button
            type="button"
            className="btn btn-warning"
            data-testid="btn-ranking"
            onClick={ () => this.resetGame('/ranking') }
          >
            Ranking
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ player: { assertions, score } }) => ({
  assertions,
  score,
});

Feedback.propTypes = {
  assertions: propTypes.string,
}.isRequired;

export default connect(mapStateToProps)(Feedback);

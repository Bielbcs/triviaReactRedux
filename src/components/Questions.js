import React, { Component } from 'react';
import md5 from 'crypto-js/md5';
import propTypes from 'prop-types';
import './Questions.css';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { COUNT_ASSERTIONS } from '../redux/actions/typeNames';
import { setLocalStorage } from '../services/api';

const CORRECT_ANSWER = 'correct-answer';
const CORRECT_ANSWER_CLASS = 'correct-answer btn btn-success';
const MAGIC_TEN = 10;
class Questions extends Component {
  state = {
    id: 0,
    randomized: [],
    isDisabled: true,
    countAssertions: 0,
    redirect: false,
    seconds: 30,
    disableAnswers: false,
    stopTimer: false,
    score: 0,
  }

  componentDidMount() {
    this.randomQuestions();
    this.setTimer();
    if (!localStorage.getItem('ranking')) {
      localStorage.setItem('ranking', JSON.stringify([]));
    }
  }

  randomQuestions = () => {
    const NUMBER = 0.5;
    const { id } = this.state;
    const { questions } = this.props;
    const answersArr = [questions[id].correct_answer, ...questions[id].incorrect_answers];
    answersArr.sort(() => Math.random() - NUMBER);
    this.setState({ randomized: answersArr, isDisabled: true });
  }

  setId = () => {
    const { questions } = this.props;
    this.setState((prevState) => ({
      ...prevState,
      id: prevState.id + 1,
    }), ({ id } = this.state) => id < questions.length && this.randomQuestions());
    this.resetTimerOnPage();
  };

  countAssertions = () => {
    const { countAssertions } = this.state;
    const { dispatch, player } = this.props;
    dispatch({ type: COUNT_ASSERTIONS, countAssertions });
    const gravatarEmail = `https://www.gravatar.com/avatar/${md5(player.gravatarEmail).toString()}`;
    setLocalStorage(gravatarEmail, player);
    return (<Redirect to="/feedback" />);
  }

  assertions = (e) => {
    this.setState({ isDisabled: false });
    if (e.target.getAttribute('data-testid') === CORRECT_ANSWER) {
      this.setState((prevState) => ({
        ...prevState,
        countAssertions: prevState.countAssertions + 1,
      }));
    }
    this.handleAnswerClick(e);
  }

  showColors = (alt) => {
    const { id } = this.state;
    const { questions } = this.props;
    return (
      questions[id].correct_answer === alt
        ? CORRECT_ANSWER_CLASS : 'wrong-answer btn btn-danger'
    );
  };

  resetTimerOnPage = () => {
    const { seconds, stopTimer } = this.state;
    if (seconds === 0 || stopTimer) {
      this.setTimer();
    }
    this.setState({ seconds: 30,
      isDisabled: true,
      disableAnswers: false,
      stopTimer: false });
  }

  scoreCalculator = () => {
    const { seconds, id } = this.state;
    const { questions } = this.props;
    const { difficulty } = questions[id];
    const obj = {
      hard: 3,
      medium: 2,
      easy: 1,
    };

    return (seconds * obj[difficulty]);
  }

  handleAnswerClick = ({ target }) => {
    this.setState({ isDisabled: false, stopTimer: true, disableAnswers: true });
    if (target.dataset.testid === CORRECT_ANSWER) {
      const CALC_NUMBER = 10;
      this.setState((prevState) => ({
        ...prevState,
        score: prevState.score + CALC_NUMBER + this.scoreCalculator(),
      }), () => {
        const { dispatch } = this.props;
        const { score } = this.state;
        dispatch({ type: 'SCORE_UPDATE', score });
      });
    }
  }

  setTimer = () => {
    const intervalTime = 1000;
    const timer = setInterval(() => {
      this.setState((prevState) => ({
        ...prevState,
        seconds: prevState.seconds - 1,
      }));
      const { seconds, stopTimer } = this.state;
      if (seconds === 0 || stopTimer) {
        clearInterval(timer);
        this.setState({ disableAnswers: true, isDisabled: false });
      }
    }, intervalTime);
  };

  render() {
    const { questions } = this.props;
    const { id, randomized, isDisabled, seconds, disableAnswers } = this.state;

    return (
      <div className="questions-container">
        {
          id < questions.length
            ? (
              <div>
                <aside>
                  <p
                    data-testid="question-category"
                    style={ {
                      fontWeight: 'bolder',
                    } }
                  >
                    {questions[id].category}

                  </p>
                  <p data-testid="question-text">{questions[id].question}</p>
                </aside>
                <aside>
                  <div data-testid="answer-options" className="btns-container">
                    {randomized.map((alt, index) => (
                      <button
                        data-testid={ questions[id].correct_answer === alt
                          ? CORRECT_ANSWER : `wrong-answer-${index}` }
                        type="button"
                        key={ index }
                        className={ !isDisabled ? this.showColors(alt)
                          : 'btn btn-secondary' }
                        onClick={ (e) => this.assertions(e) }
                        disabled={ disableAnswers }
                      >
                        {alt}
                      </button>))}
                  </div>
                  {!isDisabled
                  && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-testid="btn-next"
                      onClick={ this.setId }
                    >
                      Next
                    </button>
                  )}
                  <br />
                  <span
                    style={ { fontWeight: 'bold', fontSize: '20pt' } }
                    className={ seconds < MAGIC_TEN && 'fast' }
                  >
                    {seconds}
                  </span>
                </aside>
              </div>
            )
            : this.countAssertions()
        }
      </div>
    );
  }
}

Questions.propTypes = {
  questions: propTypes.arrayOf(propTypes.any),
  dispatch: propTypes.func,
}.isRequired;

const mapStateToProps = ({ player }) => ({
  player,
});

export default connect(mapStateToProps)(Questions);

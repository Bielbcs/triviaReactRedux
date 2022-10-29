import React, { Component } from 'react';
import propTypes from 'prop-types';
import Header from '../components/Header';
import { getQuestions } from '../services/api';
import Questions from '../components/Questions';

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
    };
  }

  componentDidMount() {
    this.lordHaveMercy();
  }

  lordHaveMercy = async () => {
    const FAILED_CODE = 3;
    const returnedQuestions = await getQuestions();
    const { history } = this.props;
    if (returnedQuestions.response_code === FAILED_CODE) {
      localStorage.removeItem('token');
      history.push('/');
    } else {
      this.setState({
        questions: returnedQuestions.results,
      });
    }
  }

  render() {
    const { questions } = this.state;
    return (
      <div className="general-container">
        <Header />
        {questions.length > 0 && <Questions
          questions={ questions }
        />}
      </div>
    );
  }
}

Game.propTypes = {
  history: propTypes.objectOf(propTypes.any).isRequired,
};

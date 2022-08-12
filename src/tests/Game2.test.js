import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {createBrowserHistory} from 'history';

import App from '../App';
import Game from '../pages/Game';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';
import Ranking from '../pages/Ranking';

const mockToken = {
  response_code: 0,
  response_message: 'Token Generated Successfully!',
  token: '0ec81be17f30ba6887f1de3fc170790adccec263504220f730334f3836a80902'};
const mockQuestions = {
  "response_code": 3,
  "results": [
      {
          "category": "Animals",
          "type": "multiple",
          "difficulty": "medium",
          "question": "What color/colour is a polar bear&#039;s skin?",
          "correct_answer": "Black",
          "incorrect_answers": [
              "White",
              "Pink",
              "Green"
          ]
      },
      {
          "category": "General Knowledge",
          "type": "boolean",
          "difficulty": "easy",
          "question": "The color orange is named after the fruit.",
          "correct_answer": "True",
          "incorrect_answers": [
              "False"
          ]
      },
  ]
}

const initialState = { player: {
  nome: 'teste',
  assertions: '',
  score: 0,
  gravatarEmail: 'teste@teste.com',
}};

global.fetch = jest.fn(
  () => {
    return Promise.resolve({
      json: () => Promise.resolve(mockToken),
    })
  }
)
global.fetch = jest.fn(
  () => {
    return Promise.resolve({
      json: () => Promise.resolve(mockQuestions),
    })
  }
)

describe('Testes de falha', () => {
  it('Testa se retorna para a home caso a API seja negada', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByTestId('input-gravatar-email');
    const nameInput = screen.getByTestId('input-player-name');
    const buttonInput = screen.getByTestId('btn-play');

    userEvent.type(emailInput, 'teste@teste.com');
    userEvent.type(nameInput, 'qualquer nome');
    userEvent.click(buttonInput);

    await waitFor(() => {
      expect(history.location.pathname).toBe('/');
    });
  });

  it('testa se nenhum placar é renderizado em ranking', async () => {
    const { history } = renderWithRouterAndRedux(<App />)
    history.push('/ranking');
    expect(screen.queryByTestId('player-score-0')).not.toBeInTheDocument();
  });
});
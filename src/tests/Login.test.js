import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import App from '../App';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';

const mockToken = {
  response_code: 0,
  response_message: 'Token Generated Successfully!',
  token: '0ec81be17f30ba6887f1de3fc170790adccec263504220f730334f3836a80902'};
const mockQuestions = {
  "response_code": 0,
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
      {
          "category": "Entertainment: Comics",
          "type": "multiple",
          "difficulty": "medium",
          "question": "Which issue of the &quot;Sonic the Hedgehog&quot; comic did Scourge the Hedgehog make his first appearance?",
          "correct_answer": "Sonic the Hedgehog #11",
          "incorrect_answers": [
              "Sonic Universe #32",
              "Sonic the Hedgehog #161",
              "Sonic the Hedgehog #47"
          ]
      },
      {
          "category": "General Knowledge",
          "type": "multiple",
          "difficulty": "medium",
          "question": "The website &quot;Shut Up &amp; Sit Down&quot; reviews which form of media?",
          "correct_answer": "Board Games",
          "incorrect_answers": [
              "Television Shows",
              "Video Games",
              "Films"
          ]
      },
      {
          "category": "Science & Nature",
          "type": "multiple",
          "difficulty": "hard",
          "question": "What causes the sound of a heartbeat?",
          "correct_answer": "Closure of the heart valves",
          "incorrect_answers": [
              "Contraction of the heart chambers",
              "Blood exiting the heart",
              "Relaxation of the heart chambers"
          ]
      }
  ]
}

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

describe('Requisito "(1-4)" LOGIN ', () => {
  test('teste se a tela de login é renderezida', () => {
    renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByTestId('input-gravatar-email');
    const nameInput = screen.getByTestId('input-player-name');
    const buttonInput = screen.getByTestId('btn-play');
    expect(emailInput).toBeInTheDocument();
    expect(nameInput).toBeInTheDocument();
    expect(buttonInput).toBeInTheDocument();
  });
  test('testa se ao logar o usuario é redirecionado para página de game', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByTestId('input-gravatar-email');
    const nameInput = screen.getByTestId('input-player-name');
    const buttonInput = screen.getByTestId('btn-play');
    userEvent.type(emailInput, 'teste@teste.com');
    userEvent.type(nameInput, 'qualquer nome');
    userEvent.click(buttonInput);
    await waitFor( () => {
      const rota = history.location.pathname;
      expect(rota).toBe('/game')} );
  });
  test('testa se ao logar o usuario é redirecionado para página de game', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const buttonInput = screen.getByTestId('btn-settings');
    userEvent.click(buttonInput);
      const rota = history.location.pathname;
      expect(rota).toBe('/config');
  });
});

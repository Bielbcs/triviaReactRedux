import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {createBrowserHistory} from 'history';

import App from '../App';
import Game from '../pages/Game';
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
describe('Requisito "(5-11)" GAME ', () => {
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
  const history = createBrowserHistory();
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
    const userName = screen.queryByTestId("header-player-name");
    expect(rota).toBe('/game');
    expect(userName).toBeInTheDocument();
    });
  });
  test('testa se uma pergunta é renderizada na tela', async () => {
    const initialState = { player: {
    nome: 'teste',
    assertions: '',
    score: 0,
    gravatarEmail: 'teste@teste.com',
    }};
    renderWithRouterAndRedux(<Game history={ history }/>, initialState);
    await waitFor(() => {
    const question = screen.queryByTestId('question-text').textContent;
    expect(question).toBe("What color/colour is a polar bear&#039;s skin?");
    })
  });
  test('testa se ao clicar na resposta uma className é setada', async () => {
    const initialState = { player: {
    nome: 'teste',
    assertions: '',
    score: 0,
    gravatarEmail: 'teste@teste.com',
    }};
    renderWithRouterAndRedux(<Game history={ history }/>, initialState);
    await waitFor(() => {
    const answer = screen.queryByTestId('correct-answer');
    userEvent.click(answer);
    expect(answer).toHaveClass('correct-answer')
    })
  });
  test('testa se ao clicar no botão de Next uma nova pergunta é renderizada', async () => {
    const initialState = { player: {
    nome: 'teste',
    assertions: '',
    score: 0,
    gravatarEmail: 'teste@teste.com',
    }};
    renderWithRouterAndRedux(<Game history={ history }/>, initialState);

    await waitFor(() => {
    const questionOld = screen.queryByTestId('question-text').textContent;
    const answer = screen.queryByTestId('correct-answer');
    userEvent.click(answer);
    const buttonNext = screen.getByText('Next');
    userEvent.click(buttonNext);
    const questionNew = screen.queryByTestId('question-text').textContent;
    expect(questionOld).not.toBe(questionNew);
    })
  });
});

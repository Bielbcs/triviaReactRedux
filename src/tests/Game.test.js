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


describe('Requisito "(5-11)" GAME ', () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');
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
    renderWithRouterAndRedux(<Game history={ history }/>, initialState);
    await waitFor(() => {
    const question = screen.queryByTestId('question-text').textContent;
    expect(question).toBe("What color/colour is a polar bear&#039;s skin?");
    })
  });

  test('testa se ao clicar na resposta uma className é setada', async () => {
    renderWithRouterAndRedux(<Game history={ history }/>, initialState);
    await waitFor(() => {
    const answer = screen.queryByTestId('correct-answer');
    userEvent.click(answer);
    expect(answer).toHaveClass('correct-answer')
    })
  });

  test('testa se ao clicar no botão de Next uma nova pergunta é renderizada', async () => {
    renderWithRouterAndRedux(<Game history={ history }/>, initialState);

    await waitFor(() => {
    const questionOld = screen.queryByTestId('question-text').textContent;
    const answer = screen.getByTestId('wrong-answer-1');
    userEvent.click(answer);
    const buttonNext = screen.getByText('Next');
    userEvent.click(buttonNext);
    const questionNew = screen.queryByTestId('question-text').textContent;
    expect(questionOld).not.toBe(questionNew);
    })
  });

  test('Testa se os botões são desabilitados', async () => {
    renderWithRouterAndRedux(<Game history={ history }/>, initialState);
    await waitFor(() => {
      expect(screen.getByTestId('btn-next')).toBeInTheDocument();
      expect(screen.queryByTestId('correct-answer')).toBeDisabled();
    })
  });

  test('Testa a quantidade de acertos', async () => {
    const { history } = renderWithRouterAndRedux(<App />);
    const emailInput = screen.getByTestId('input-gravatar-email');
    const nameInput = screen.getByTestId('input-player-name');
    const buttonInput = screen.getByTestId('btn-play');

    userEvent.type(emailInput, 'teste@teste.com');
    userEvent.type(nameInput, 'qualquer nome');
    userEvent.click(buttonInput);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('btn-next'));
      userEvent.click(screen.queryByTestId('correct-answer'));
      userEvent.click(screen.getByTestId('btn-next'));
      expect(screen.getByText('1')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('btn-ranking'));

    expect(screen.getByTestId('ranking-title')).toBeInTheDocument();

    userEvent.click(screen.getByTestId('btn-go-home'));
    expect(history.location.pathname).toBe('/');
  });
});

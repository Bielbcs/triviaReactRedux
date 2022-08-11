import { screen, waitFor } from '@testing-library/react';
import md5 from 'crypto-js/md5';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';

import Feedback from '../pages/Feedback';
import { renderWithRouterAndRedux } from './helpers/renderWithRouterAndRedux';



describe('Testa a página de Feedback', () => {
 it('Testa se os elementos da página são exibidos',() => {
  const initialState = { player: {
    nome: 'teste',
    assertions: 2,
    score: 100,
    gravatarEmail: 'teste@teste.com',
    }}; 
    renderWithRouterAndRedux(<Feedback />, initialState);
    const displayedScore = screen.getByTestId('feedback-total-score');
    const displayedAssertions = screen.getByTestId('feedback-total-question');
    const displayedText = screen.getByTestId('feedback-text');
    expect(displayedScore.textContent).toBe('100');
    expect(displayedAssertions.textContent).toBe('2');
    expect(displayedText.textContent).toBe('Could be better...');
  });
 it('Testa se recebe "Wll Done!" quando há 4 assertions', () => {
  const initialState = { player: {
    nome: 'teste',
    assertions: 4,
    score: 100,
    gravatarEmail: 'teste@teste.com',
    }}; 
    renderWithRouterAndRedux(<Feedback />, initialState);
    const displayedText = screen.getByTestId('feedback-text');
    expect(displayedText.textContent).toBe('Well Done!');
  });
  it('Testa se os botões "Play Again" e "Ranking" redirecionam a página', () => {
    const { history } = renderWithRouterAndRedux(<App />);
    history.push('/feedback');
    const playAgainBtn = screen.getByTestId('btn-play-again');
    userEvent.click(playAgainBtn);
    const route = history.location.pathname;
      expect(route).toBe('/');
   });

  it('Testa se os botões "Play Again" e "Ranking" redirecionam a página', () => {
    const initialState = { player: {
      nome: 'teste',
      assertions: 4,
      score: 100,
      gravatarEmail: 'teste@teste.com',
      }};
    const ranking = [{ 
        name: 'meu nome',
        score: 10,
        picture: `https://www.gravatar.com/avatar/${md5('teste@teste.com').toString()}` }];
    localStorage.setItem('ranking', JSON.stringify(ranking));
    const { history } = renderWithRouterAndRedux(<App />, initialState);
    history.push('/feedback');
    const rankingBtn = screen.getByTestId('btn-ranking');
    userEvent.click(rankingBtn);
    const route = history.location.pathname;
      expect(route).toBe('/ranking');
   });
});
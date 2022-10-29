import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/Header.css';

class Header extends Component {
  render() {
    const { gravatarEmail, nome, score } = this.props;

    return (
      <div className="header-container">
        <img
          src={ `https://www.gravatar.com/avatar/${md5(gravatarEmail).toString()}` }
          alt="gravatar"
          data-testid="header-profile-picture"
        />
        <span data-testid="header-player-name">{ nome }</span>
        <span data-testid="header-score">
          Pontos:
          {' '}
          {score}
        </span>
      </div>
    );
  }
}

const mapStateToProps = ({ player: { gravatarEmail, nome, score } }) => ({
  gravatarEmail,
  nome,
  score,
});

Header.propTypes = {
  gravatarEmail: PropTypes.string,
  nome: PropTypes.string,
}.isRequired;

export default connect(mapStateToProps)(Header);

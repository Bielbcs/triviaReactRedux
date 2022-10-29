import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { getApi } from '../services/api';
import { LOGIN_INFO } from '../redux/actions/typeNames';
import '../styles/Login.css';

class Login extends React.Component {
  state = {
    name: '',
    email: '',
  };

  emailValidation = () => {
    const { email, name } = this.state;
    const check = /\S+@\S+\.\S+/;
    if (check.test(email) && name.length !== 0) return false;
    return true;
  }

  fetchToken = async () => {
    await getApi();
    const { history, dispatch } = this.props;
    history.push('/game');
    dispatch({ type: LOGIN_INFO, payload: this.state });
  }

  render() {
    const { name, email } = this.state;
    const { history } = this.props;
    return (
      <div className="general-container">
        <form autoComplete="off" className="row mb-3 login-form-container">
          <div className="input-group mb-3">
            <input
              value={ name }
              placeholder="Name..."
              type="text"
              className="form-control"
              aria-label="Username"
              aria-describedby="basic-addon1"
              id="name"
              onChange={ (e) => this.setState({ name: e.currentTarget.value }) }
              data-testid="input-player-name"
            />
          </div>
          <div className="input-group mb-3">
            <input
              value={ email }
              placeholder="Email..."
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              className="form-control"
              type="email"
              id="email"
              data-testid="input-gravatar-email"
              onChange={ (e) => this.setState({ email: e.currentTarget.value }) }
            />
            <span className="input-group-text" id="basic-addon2">@example.com</span>
          </div>
          <button
            type="button"
            data-testid="btn-play"
            className="btn btn-success"
            onClick={ this.fetchToken }
            disabled={ this.emailValidation() }
          >
            Play
          </button>
          <button
            type="button"
            data-testid="btn-settings"
            className="btn btn-primary"
            onClick={ () => history.push('/config') }
          >
            Configurations
          </button>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  history: propTypes.objectOf(propTypes.any),
  dispatch: propTypes.func,
}.isRequired;

export default connect()(Login);

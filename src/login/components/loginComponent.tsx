import React, { FunctionComponent } from 'react';
import { TextInput } from 'hds-react';

const LoginComponent: FunctionComponent = () => {
  return (
    <div className={'login-component'}>
      <h1>{'Kirjaudu sisään'}</h1>
      <TextInput
        id='username'
        label='Käyttäjätunnus'
        placeholder='Kirjoita käyttäjätunnuksesi'
        required
      />
      <TextInput
        type='password'
        id='password'
        label='Salasana'
        placeholder='Kirjoita salasanasi'
        required
      />
      <div>{'Salasana unohtunut? | Rekisteröidy'}</div>
    </div>
  );
};

export default LoginComponent;
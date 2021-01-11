import React, { FunctionComponent } from 'react';

const LoginComponent: FunctionComponent = () => {
  return (
    <div className={'login-component'}>
      <h1>{'Kirjaudu sisään'}</h1>
      <div>{'Käyttäjätunnus'}</div>
      <input/>
      <div>{'Salasana'}</div>
      <input/>
      <div>{'Salasana unohtunut? | Rekisteröidy'}</div>
    </div>
  );
};

export default LoginComponent;
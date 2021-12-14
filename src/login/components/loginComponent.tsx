import React, { FunctionComponent } from 'react';
import { TextInput } from 'hds-react';
import { useTranslation } from 'react-i18next';

const LoginComponent: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className={'login-component'}>
      <h1>{t('login.form.title', 'Log in')}</h1>
      <TextInput
        id="username"
        label={t('login.form.username.label', 'Username')}
        placeholder={t(
          'login.form.username.placeholder',
          'Please type your username'
        )}
        required
      />
      <TextInput
        type="password"
        id="password"
        label={t('login.form.password.label', 'Password')}
        placeholder={t(
          'login.form.password.placeholder',
          'Please type your password'
        )}
        required
      />
      <div className={'cover'}>
        {t('login.form.forgotPasswordLink', 'Forgot your password?')}
        {' | '}
        {t('login.form.newAccountLink', 'Create an account')}
      </div>
    </div>
  );
};

export default LoginComponent;

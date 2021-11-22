import React from 'react';

import TopNavigation from './topNavigation/topNavigation';
import Footer from './footer/footer';
import LoginModal from './login/loginModal';
import './main.scss';

interface Props {
  children?: JSX.Element;
}

const App = ({ children }: Props): JSX.Element => {
  return (
    <div className={'app'}>
      <LoginModal />
      <TopNavigation />
      {children}
      <Footer />
    </div>
  );
};

export default App;

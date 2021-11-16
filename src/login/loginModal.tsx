import React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../root/rootReducer';
import ConfirmationModal from '../modal/confirmationModal';
import {
  Language,
} from '../language/types';
import translations from './translations';
import { hideLoginModal } from './actions';
import LoginComponent from './components/loginComponent';

interface State {
  currentLanguage: Language,
  isLoginModalOpen: boolean,
}

interface Dispatch {
  hideLoginModal: () => void,
}

interface Props {
  currentLanguage: Language,
  isLoginModalOpen: boolean,
  hideLoginModal: () => void,
}

const LoginModal = (props: Props): JSX.Element => {

  const {
    currentLanguage,
    hideLoginModal,
    isLoginModalOpen,
  } = props;

  return (
    <ConfirmationModal
      confirmButtonLabel={translations[currentLanguage].LOGIN}
      cancelButtonLabel = {translations[currentLanguage].CANCEL}
      isOpen={isLoginModalOpen} // isLoginModalOpen
      onCancel={() => hideLoginModal()}
      onClose={() => hideLoginModal()}
      onSave={() => console.log('save')}
      title={translations[currentLanguage].LOGIN_TITLE}
    >
      <LoginComponent/>
    </ConfirmationModal>
  );
};

const mapDispatchToProps: Dispatch = {
  hideLoginModal,
};

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
  isLoginModalOpen: state.login.isLoginModalOpen,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);

import React, { Component } from 'react';

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

class LoginModal extends Component<State & Dispatch> {

  render() {
    const { 
      currentLanguage, 
      hideLoginModal,
      isLoginModalOpen,
    } = this.props;

    return (
      <ConfirmationModal
        confirmButtonLabel={translations[currentLanguage].LOGIN}
        cancelButtonLabel = {translations[currentLanguage].CANCEL}
        isOpen={isLoginModalOpen} // isLoginModalOpen
        label={'label'}
        onCancel={() => hideLoginModal()}
        onClose={() => hideLoginModal()}
        onSave={() => console.log('save')}
        title={'asdf'}
      >
        <LoginComponent/>
      </ConfirmationModal>
    );
  }
}

const mapDispatchToProps: Dispatch = {
  hideLoginModal,
};

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
  isLoginModalOpen: state.login.isLoginModalOpen,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { RootState } from '../root/rootReducer';
import ConfirmationModal from '../modal/confirmationModal';
import {
  Language,
} from '../language/types';
import translations from './translations';

interface State {
  currentLanguage: Language,
}

class LoginModal extends Component<State> {

  render() {
    const { currentLanguage } = this.props;

    return (
      <ConfirmationModal
        confirmButtonLabel={translations[currentLanguage].LOGIN_TEXT}
        isOpen={false} // isLoginModalOpen
        label={'label'}
        onCancel={() => console.log('cancel')}
        onClose={() => console.log('close')}
        onSave={() => console.log('save')}
        title={'asdf'}
      >
        {'Kirjaudu sisään'}
      </ConfirmationModal>
    );
  }
}

const mapStateToProps = (state: RootState): State => ({
  currentLanguage: state.language.current,
});

export default connect(mapStateToProps)(LoginModal);

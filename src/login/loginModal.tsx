import React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../root/rootReducer';
import ConfirmationModal from '../modal/confirmationModal';
import { hideLoginModal } from './actions';
import LoginComponent from './components/loginComponent';
import { useTranslation } from 'react-i18next';

interface State {
  isLoginModalOpen: boolean;
}

interface Dispatch {
  hideLoginModal: () => void;
}

interface Props {
  isLoginModalOpen: boolean;
  hideLoginModal: () => void;
}

const LoginModal = (props: Props): JSX.Element => {
  const { hideLoginModal, isLoginModalOpen } = props;
  const { t } = useTranslation();

  return (
    <ConfirmationModal
      confirmButtonLabel={t('login.login', 'Log in')}
      cancelButtonLabel={t('login.cancel', 'Cancel')}
      isOpen={isLoginModalOpen}
      onCancel={() => hideLoginModal()}
      onClose={() => hideLoginModal()}
      onSave={() => console.log('save')}
      title={t('login.title', 'To search plots, please login to the service.')}
    >
      <LoginComponent />
    </ConfirmationModal>
  );
};

const mapDispatchToProps: Dispatch = {
  hideLoginModal,
};

const mapStateToProps = (state: RootState): State => ({
  isLoginModalOpen: state.login.isLoginModalOpen,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);

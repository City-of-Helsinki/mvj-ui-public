import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Dialog } from 'hds-react';
import { useLocation } from 'react-router';

import { RootState } from '../root/rootReducer';
import { hideLoginModal } from './actions';
// import LoginForm from './components/loginForm';
import { userManager } from '../auth/userManager';
import { AppRoutes, getRouteById } from '../root/routes';
import { setRedirectUrlToSessionStorage } from '../auth/util';

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
  const { pathname, search } = useLocation();

  const titleId = 'LoginModalTitle';
  const descriptionId = 'LoginFormDescriptor';

  const loginRedirect = () => {
    setRedirectUrlToSessionStorage(
      `${pathname}${search}` || getRouteById(AppRoutes.HOME),
    );

    userManager.signinRedirect().then();
  };

  return (
    <Dialog
      isOpen={isLoginModalOpen}
      close={hideLoginModal}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      closeButtonLabelText={t('login.close', 'Close')}
      id="LoginModal"
      className="LoginModal"
    >
      <Dialog.Header id={titleId} title={t('login.title', 'Log in')} />
      <Dialog.Content>
        <p id="LoginFormDescriptor">
          {t(
            'login.descriptor',
            'To search plots, please log in through one of the supported services.',
          )}
        </p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button onClick={() => loginRedirect()}>
          {t('login.login', 'Log in')}
        </Button>
        <Button onClick={hideLoginModal} variant="secondary">
          {t('login.cancel', 'Cancel')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

const mapDispatchToProps: Dispatch = {
  hideLoginModal,
};

const mapStateToProps = (state: RootState): State => ({
  isLoginModalOpen: state.login.isLoginModalOpen,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);

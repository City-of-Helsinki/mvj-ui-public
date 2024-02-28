import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-grid-system';
import { Helmet } from 'react-helmet';
import { Button, Notification } from 'hds-react';
import { openLoginModal } from '../login/actions';
import MainContentElement from '../a11y/MainContentElement';
import AuthDependentContent from '../auth/components/authDependentContent';
import { generateFavourite } from './actions';
import { RootState } from '../root/rootReducer';
import { getRouteById, getPageTitle, AppRoutes } from '../root/helpers';
import BlockLoader from '../loader/blockLoader';

interface State {
  isGeneratingFavourite: boolean;
  generationFailed: boolean;
  generationSuccessful: boolean;
}

interface Props {
  isGeneratingFavourite: boolean;
  generationFailed: boolean;
  generationSuccessful: boolean;
  openLoginModal: () => void;
  generateFavourite: (id: string) => void;
}

const DirectReservationPage = ({
  openLoginModal,
  generateFavourite,
  isGeneratingFavourite,
  generationFailed,
  generationSuccessful,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <AuthDependentContent>
      {(loading, loggedIn) => {
        useEffect(() => {
          if (loggedIn && id && !isGeneratingFavourite) {
            generateFavourite(id);
          }

          if (generationSuccessful) {
            navigate(getRouteById(AppRoutes.FAVOURITES));
          }
        }, [loggedIn, generationSuccessful]);

        return (
          <MainContentElement className="DirectReservationPage">
            <Helmet>
              <title>
                {getPageTitle(
                  t('directReservation.pageTitle', 'Direct reservation'),
                )}
              </title>
            </Helmet>
            <Container className="DirectReservationPage__content">
              {!loggedIn && !loading && (
                <>
                  <p>
                    {t(
                      'directReservation.error.notLoggedIn',
                      'Please log in first in order to apply for direct reservation plots.',
                    )}
                  </p>
                  <Button variant="primary" onClick={openLoginModal}>
                    {t('directReservation.buttons.login', 'Log in')}
                  </Button>
                </>
              )}

              {loading || (isGeneratingFavourite && <BlockLoader />)}
              {generationFailed && (
                <Notification type="error">
                  {t(
                    'directReservation.errors.favouriteGenerationError',
                    'Something went wrong! Try again later or contact the city official you received the direct reservation link from.',
                  )}
                </Notification>
              )}
            </Container>
          </MainContentElement>
        );
      }}
    </AuthDependentContent>
  );
};

const mapStateToProps = (state: RootState): State => ({
  isGeneratingFavourite: state.directReservation.isGeneratingFavourite,
  generationFailed: state.directReservation.generationFailed,
  generationSuccessful: state.directReservation.generationSuccessful,
});

export default connect(mapStateToProps, {
  openLoginModal,
  generateFavourite,
})(DirectReservationPage);

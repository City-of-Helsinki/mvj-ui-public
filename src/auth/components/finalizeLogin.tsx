import { useEffect, useState } from 'react';
import { CallbackComponent } from 'redux-oidc';
import { useNavigate } from 'react-router-dom';

import { userManager } from '../userManager';
import BlockLoader from '../../loader/blockLoader';
import { getRedirectUrlFromSessionStorage } from '../util';
import { logError } from '../../root/helpers';

const FinalizeLogin = (): JSX.Element | null => {
  const navigate = useNavigate();
  const [redirectTarget, redirect] = useState<string | null>(null);

  useEffect(() => {
    if (redirectTarget) {
      navigate(redirectTarget);
    }
  }, [redirectTarget]);

  if (redirectTarget) {
    // Callback component shouldn't be re-rendered when we're just about to leave.
    return null;
  }

  const savedRedirectUrl = getRedirectUrlFromSessionStorage();

  return (
    // this redux-oidc library is not react18 compatible and gives typescript overload
    // error from missing children -prop definition
    // @ts-expect-error: TS2769: No overload matches this call
    <CallbackComponent
      userManager={userManager}
      successCallback={() => {
        redirect(savedRedirectUrl);
      }}
      errorCallback={(e) => {
        logError(e);
        redirect(savedRedirectUrl);
      }}
    >
      <BlockLoader />
    </CallbackComponent>
  );
};

export default FinalizeLogin;

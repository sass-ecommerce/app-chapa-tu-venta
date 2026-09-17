import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';

import { useGoogleLoginMutation, useOnboardingStatusMutation } from '../queries';
import { COGNITO_CONFIG, GOOGLE_AUTH_SCOPES, cognitoDiscovery } from '../utils/cognito';
import { routeAfterLogin } from '../utils/navigation';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleSignIn() {
  const googleLoginMutation = useGoogleLoginMutation();
  const onboardingStatusMutation = useOnboardingStatusMutation();
  const [error, setError] = React.useState(false);

  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: COGNITO_CONFIG.clientId,
      redirectUri,
      scopes: GOOGLE_AUTH_SCOPES,
      extraParams: { identity_provider: 'Google' },
    },
    cognitoDiscovery
  );

  React.useEffect(() => {
    if (response?.type !== 'success' || !request?.codeVerifier) return;

    (async () => {
      try {
        await googleLoginMutation.mutateAsync({
          code: response.params.code,
          codeVerifier: request.codeVerifier!,
          redirectUri,
        });

        const onboarding = await onboardingStatusMutation.mutateAsync();
        await routeAfterLogin(onboarding);
      } catch {
        setError(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  // preferEphemeralSession evita que iOS reutilice las cookies de la sesión
  // anterior (Cognito Hosted UI / Google) entre intentos de login: sin esto,
  // luego de un logout Google no vuelve a mostrar el selector de cuenta
  // porque ASWebAuthenticationSession comparte el cookie store con Safari.
  const promptGoogleSignIn = React.useCallback(
    () => promptAsync({ preferEphemeralSession: true }),
    [promptAsync]
  );

  return {
    promptAsync: promptGoogleSignIn,
    isLoading:
      !request || googleLoginMutation.isPending || onboardingStatusMutation.isPending,
    error,
    clearError: () => setError(false),
  };
}

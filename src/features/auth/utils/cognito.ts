import * as AuthSession from 'expo-auth-session';

export const COGNITO_CONFIG = {
  domain: process.env.EXPO_PUBLIC_COGNITO_DOMAIN!,
  // TODO: reemplazar con el Client ID real una vez creado en AWS Console
  clientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID!,
};

// Cognito Hosted UI no expone .well-known/openid-configuration de forma
// confiable solo con el dominio, así que se arman los endpoints a mano.
export const cognitoDiscovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: `${COGNITO_CONFIG.domain}/oauth2/authorize`,
  tokenEndpoint: `${COGNITO_CONFIG.domain}/oauth2/token`,
  revocationEndpoint: `${COGNITO_CONFIG.domain}/oauth2/revoke`,
};

export const GOOGLE_AUTH_SCOPES = ['openid', 'email', 'profile'];

export interface GoogleIdTokenClaims {
  email: string;
  given_name?: string;
  family_name?: string;
}

export function decodeIdTokenClaims(idToken: string): GoogleIdTokenClaims {
  const payload = idToken.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
  return JSON.parse(json);
}

export async function exchangeGoogleAuthCode(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<AuthSession.TokenResponse> {
  return AuthSession.exchangeCodeAsync(
    {
      clientId: COGNITO_CONFIG.clientId,
      code,
      redirectUri,
      extraParams: { code_verifier: codeVerifier },
    },
    cognitoDiscovery
  );
}

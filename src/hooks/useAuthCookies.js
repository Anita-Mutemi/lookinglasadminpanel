import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const ACCESS_TOKEN_COOKIE_NAME = 'ARBM_ADMIN_ACCESS_TOKEN';

export function useAuthCookies() {
  const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN_COOKIE_NAME]);
  const [accessToken, setAccessToken] = useState(
    cookies[ACCESS_TOKEN_COOKIE_NAME] || null,
  );

  useEffect(() => {
    setAccessToken(cookies[ACCESS_TOKEN_COOKIE_NAME] || null);
  }, [cookies]);

  const setAccessTokenCookie = (token) => {
    setCookie(ACCESS_TOKEN_COOKIE_NAME, token, { path: '/' });
  };

  const removeAccessTokenCookie = () => {
    removeCookie(ACCESS_TOKEN_COOKIE_NAME);
  };

  return {
    accessToken,
    setAccessTokenCookie,
    removeAccessTokenCookie,
  };
}

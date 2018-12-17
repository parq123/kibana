export default function (server, request) {
  // if (request.auth.isAuthenticated)
  // console.log(request.auth);
  
  //const sessionKey = server.config().get('own_home.get_username_from_session.key');
  const sessionKey = 'sid';
  const yarKey = 'remote_user';
  if (request.auth && request.auth.isAuthenticated && request.auth.credentials && request.auth.credentials[sessionKey]) {
    try {
      request.yar.set(yarKey, { key: request.auth.credentials[sessionKey] });
    } catch (error) {
      server.log(['plugin:own-home', 'error'], 'Failed to store remote_user in session: ' + error);
    }
    return request.auth.credentials[sessionKey];
  } else {
    try {
      const remoteUser = request.yar.get(yarKey);
      return remoteUser.key;
    } catch (error) {
      return null;
    }
  }
}

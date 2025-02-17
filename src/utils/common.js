export const logout = async (setToken, magic) => {
  if (await magic?.user.isLoggedIn()) {
    await magic?.user.logout();
  }
  localStorage.setItem('token', '');
  localStorage.setItem('user', '');
  setToken('');
};

export const saveUserInfo = (token, loginMethod, userAddress) => {
  localStorage.setItem('token', token);
  localStorage.setItem('isAuthLoading', 'false');
  localStorage.setItem('loginMethod', loginMethod);
  localStorage.setItem('user', userAddress);
};

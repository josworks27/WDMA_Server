module.exports = {
  // * POST: /auth
  postAuth: (req, res) => {
    res.send('auth');
  },

  // * POST: /auth/check
  postAuthCheck: (req, res) => {
    res.send('auth check');
  },
};

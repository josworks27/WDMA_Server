module.exports = {
  // * GET: /dresses
  getDresses: (req, res) => {
    res.json('get dresses');
  },

  // * POST: /dresses
  postDresses: (req, res) => {
    res.send('post dresses');
  },

  // * POST: /dresses/search
  postDressesSearch: (req, res) => {
    res.send('search dresses');
  },

  // * GET: /dresses/stats
  getDressesStats: (req, res) => {
    res.send('get dresses stats');
  },

  // * GET: /dresses/:id
  getDressDetail: (req, res) => {
    res.send('get dress detail');
  },

  // * PUT: /dresses/:id
  putDressDetail: (req, res) => {
    res.send('put dress detail');
  },

  // * DELETE: /dresses/:id
  deleteDressDetail: (req, res) => {
    res.send('delete dress detail');
  },

  // * POST: /dresses/:id/events
  postDressEvent: (req, res) => {
    res.send('post dressses events');
  },

  // * PUT: /dresses/:id/events/:id
  putDressEvent: (req, res) => {
    res.send('put dressses events');
  },

  // * DELETE: /dresses/:id/events/:id
  deleteDressEvent: (req, res) => {
    res.send('delete dressses events');
  },
};

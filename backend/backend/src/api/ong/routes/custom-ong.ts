module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/ong/register',
      handler: 'api::ong.ong.register', 
      config: {
        auth: false, 
      },
    },
  ],
};
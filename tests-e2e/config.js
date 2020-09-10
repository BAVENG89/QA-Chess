const config = {
  development: {
    p1: {
      baseUrl: 'http://localhost:8080/',
      baseApiUrl: 'http://localhost:8080',
    },
  },
};

exports.get = function get(env = 'development', player = 'pl') {
  return config[env][player];
};

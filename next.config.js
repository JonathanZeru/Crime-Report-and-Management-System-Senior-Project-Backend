module.exports = {
    async headers() {
      return [
        {
          source: '/uploads/:path*',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: 'http://localhost:5173',
            },
          ],
        },
      ];
    },
  };
  
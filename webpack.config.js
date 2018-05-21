//const webpack = require('webpack');
module.exports = {
  entry:
  { app: __dirname + "/src/App.jsx"
  },
  output: {
    path: __dirname + "/static",
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',

        query: {
          presets: ['react','es2015']
        }
      },
    { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
    { test: /\.(css)$/, loader: 'css-loader' },
    ]
  }
};

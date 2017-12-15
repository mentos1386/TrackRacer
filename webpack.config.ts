import * as webpack from 'webpack';
import * as path from 'path';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';

const nodeEnv = process.env.NODE_ENV || 'development';

const config: webpack.Configuration = {
  devtool: 'source-map',
  context: path.resolve('./src'),
  entry: {
    main: './main.ts',
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].bundle.map',
    devtoolModuleFilenameTemplate(info) {
      return 'file:///' + info.absoluteResourcePath;
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts?$/,
        exclude: ['node_modules'],
        use: ['tslint-loader'],
      },
      {
        test: /\.ts?$/,
        exclude: ['node_modules'],
        use: ['babel-loader', 'awesome-typescript-loader', 'source-map-loader'],
      },
      {
        test: /\.(js?)$/,
        exclude: ['node_modules'],
        use: ['babel-loader'],
      },
      { test: /\.(glsl|vs|fs)$/, loader: 'ts-shader-loader' },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
      { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Track Racer',
      template: '!!ejs-loader!src/index.html',
    }),
    new webpack.optimize.UglifyJsPlugin({
      test: /\.js($|\?)/i,
      compress: { warnings: false },
      sourceMap: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist/'),
    compress: true,
    port: 3000,
    hot: true,
  },
};

export default config;

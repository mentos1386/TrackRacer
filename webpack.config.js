const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const nodeEnv = process.env.NODE_ENV || "development";

var config = {
  devtool: "source-map",
  context: path.resolve("./src"),
  entry: {
    main: "./main.ts",
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].bundle.js",
    sourceMapFilename: "[name].bundle.map",
    devtoolModuleFilenameTemplate: function (info) {
        return "file:///" + info.absoluteResourcePath;
    }
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.ts?$/,
        exclude: ["node_modules"],
        use: ["tslint-loader"]
      },
      {
        test: /\.ts?$/,
        exclude: ["node_modules"],
        use: ["awesome-typescript-loader", "source-map-loader"]
      },
      { test: /\.html$/, loader: "html-loader" },
      { test: /\.css$/, loaders: ["style-loader", "css-loader"] },
      { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // eslint-disable-line quote-props
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    new HtmlWebpackPlugin({
      title: "Track Racer",
      template: "!!ejs-loader!src/index.html"
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist/"),
    compress: true,
    port: 3000,
    hot: true
  }
};

module.exports = config;

const path = require("path")
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.ts",
    logic: "./src/logic.ts",
    render: "./src/render.ts",
    communication: "./src/communication.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "" },
      ],
    }),
  ],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
}
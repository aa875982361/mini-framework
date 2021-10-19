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
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "" },
      ],
    }),
  ],
  devServer: {
    hot: true, // 热更新
    static: {
      directory: path.join(__dirname, 'dist'),
    }, // 静态文件目录
    port: 8090,
    historyApiFallback: true, // 找不到的都可替换为index.html
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
}
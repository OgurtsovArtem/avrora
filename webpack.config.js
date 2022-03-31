const path = require("path");
const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  entry: {
    script: "./src/scripts/script.js",
  },
  mode: isDev ? "development" : "production",
  output: {
    filename: "[name].min.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

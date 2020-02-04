module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": 0,
    "no-debugger": 0,
    "no-unused-vars": 1,
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};

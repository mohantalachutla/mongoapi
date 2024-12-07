{
    "*.css": [
      "stylelint --fix",
      "prettier --write"
    ],
    "*.{js,jsx, ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "!(*.css|*.js|*.jsx)": [
      "prettier --write"
    ]
  }
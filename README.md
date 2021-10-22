# eslint-plugin-i18next-no-undefined-translation-keys

Detects translation keys in use which are missing from translation files

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-i18next-no-undefined-translation-keys`:

```sh
npm install eslint-plugin-i18next-no-undefined-translation-keys --save-dev
```

## Usage

Add `i18next-no-undefined-translation-keys` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "i18next-no-undefined-translation-keys"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "i18next-no-undefined-translation-keys/no-undefined-translation-keys": 2
    }
}
```

## Supported Rules

* `i18next-no-undefined-translation-keys/no-undefined-translation-keys`



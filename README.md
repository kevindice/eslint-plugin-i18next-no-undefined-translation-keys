# eslint-plugin-i18next-no-undefined-translation-keys

Provides two rules:
- `translation-key-string-literal` - Asserts that translation keys should be string literals only
- `no-undefined-translation-keys` - Detects translation keys in use which are missing from translation files

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
        "i18next-no-undefined-translation-keys/translation-key-string-literal": "error",
        "i18next-no-undefined-translation-keys/no-undefined-translation-keys": [
            "error",
            {
                "namespaceTranslationMappingFile": "namespaceMapping.json",
                "defaultNamespace": "default"
            }
        ]
    }
}
```

And your `namespaceMapping.json` file should map your namespaces to translation file paths like so:

```json
{
  "shared": "packages/shared/lang/en.json",
  "unitsOfMeasure": "packages/shared/lang/uom-en.json",
  "user": "packages/user/lang/en.json"
}
```

Note: The `no-undefined-translation-keys` rule will ignore any non-string-literal calls to `t()`.

## Supported Rules

* `i18next-no-undefined-translation-keys/translation-key-string-literal`
* `i18next-no-undefined-translation-keys/no-undefined-translation-keys`

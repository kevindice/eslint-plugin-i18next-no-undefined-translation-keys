# eslint-plugin-i18next-no-undefined-translation-keys

## Why?

A few years ago, I was working on a very large React Native project with a couple hundred engineers.  In the early phase of the project, there wasn't formal governance around modularity and code-sharing - these things tend to evolve organically at first.  As adjacent teams started to see value in sharing certain things with each other, it became common to move significant chunks of code into a shared module.  Unfortunately, it was also common for translations to silently break in the process.  Each team had their one 1 or 2 lerna modules, each with their own i18next namespace.  As code got moved, there was no automated check in place that the new namespace in which it rendered had all the same keys defined.

Even today, the i18next project docs recommend a Typescript-based approach.  This is fraught with caveats - you have to use TS 5, you have to enable `strict` mode, if your project has multiple i18next instances, then you probably can't use type-safe translations.

Frankly, the TS-based approach does not solve the problem very well.  And, for those who need it most - people on big sprawling projects with multiple i18next instances - it doesn't solve the problem at all.

Instead, I went with an eslint-based approach.

## What?

This plugin gives you two rules:
- `translation-key-string-literal` - Asserts that translation keys should be string literals only - otherwise, we can't statically analyze them
- `no-undefined-translation-keys` - Detects translation keys in your code which are missing from translation files

These are intended to be used in conjunction with:
- `i18n-json/valid-json` (who doesn't love well-formed JSON?)
- `i18n-json/identical-keys` (ensures that amongst all of your languages, the exact same set of keys is defined)
- `i18n-json/sorted-keys` (optional, but it is nice to have your keys alphabetized)

### Operational Note:

Since we know that translations for other languages aren't immediately available, the recommendation here is to put empty strings in place where you are still waiting for a translation.  Then, on whatever cadence makes sense, you can run a recursive check on each file to source the empty strings and batch those together for the translators to work on.

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

For those who don't use i18next namespaces (most people), you can skip defining `defaultNamespace`, and your `namespaceMapping.json` file can be as simple as this:

```json
{
  "default": "libs/path/to/your/english.json"
}
```

Note: The `no-undefined-translation-keys` rule will ignore any non-string-literal calls to `t()`.

## Supported Rules

* `i18next-no-undefined-translation-keys/translation-key-string-literal`
* `i18next-no-undefined-translation-keys/no-undefined-translation-keys`

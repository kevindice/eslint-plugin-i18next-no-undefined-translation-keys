/**
 * @fileoverview Disallows use of translation keys which have no definition
 * @author Kevin Dice
 */
"use strict";

const requireNoCache = require('../requireNoCache');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const possiblePluralSuffixes = ['zero', 'singular', 'one', 'two', 'few', 'many', 'other'];

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: "Disallows use of translation keys which have no definition",
      category: "internationalization",
      recommended: false,
      url: "https://github.com/kevindice/eslint-plugin-i18next-no-undefined-keys/blob/master/README.md",
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [{
        "type": "object",
        "properties": {
          "namespaceTranslationMappingFile": {
            "type": "string",
          },
          "defaultNamespace": {
            "type": "string",
            "default": "default",
          },
        },
        "required": ["namespaceTranslationMappingFile"],
        "additionalProperties": false
      }],
  },

  create(context) {
    const options = context.options[0];

    const namespaceTranslationMappingFile = requireNoCache(options?.namespaceTranslationMappingFile);
    const translationKeysFromFiles = Object.keys(namespaceTranslationMappingFile).reduce((acc, namespace) => ({
      ...acc,
      [namespace]: requireNoCache(namespaceTranslationMappingFile[namespace]),
    }), {});

    const defaultNamespace = options?.defaultNamespace || 'default';

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function getTranslationKey(namespace, key) {
      let obj = translationKeysFromFiles[namespace];
      const arr = key.split(".");
      while(arr.length) {
        const keyToAccess = arr.shift();
        const prevObj = obj;
        obj = obj?.[keyToAccess];

        /* If we're at the last key segment and appear to have a miss,
        * let's try the plural suffixes */
        if (!arr.length && !obj && keyToAccess) {
          for (let i = 0; i < possiblePluralSuffixes.length; i++) {
            obj = prevObj?.[`${keyToAccess}_${possiblePluralSuffixes[i]}`];
            if (obj) {
              break;
            }
          }
        }
      }
      return obj;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression(node) {
        if (node.callee.name === 't') {
          if (node.arguments?.[0]?.type !== 'Literal') {
            // The translation-key-string-literal rule handles this case
            // If it's not a literal, we can't proceed.
            return;
          }

          const ancestors = context.sourceCode.getAncestors(node);
          let prefix = null;
          let namespace = null;
          ancestors?.forEach(ancestor => {
            if (ancestor.body?.length > 0) {
              ancestor.body.forEach(body => {
                if (body.declarations?.length > 0) {
                  body.declarations.forEach(declaration => {
                    if (declaration.init?.callee?.name === 'useTranslation') {
                      prefix = declaration.init?.arguments[1]?.properties[0]?.value?.value;
                      namespace = declaration.init?.arguments[0]?.value;
                    }
                  });
                }
              });
            }
          });

          const key = prefix ? [prefix, node.arguments?.[0]?.value].join('.') : node.arguments?.[0]?.value;
          const keyWithoutNamespace = key.indexOf(':') === -1 ? key : key.slice(key.indexOf(':') + 1);
          namespace = (key === keyWithoutNamespace) ? (namespace ?? defaultNamespace) : key.slice(0, key.indexOf(':'));

          if (getTranslationKey(namespace, keyWithoutNamespace) === undefined) {
            context.report({
              node: node,
              message: `Translation key "${keyWithoutNamespace}" in namespace "${namespace}" is used here but missing in the translations file.`
            });
          }
        }
      }
    };
  },
};

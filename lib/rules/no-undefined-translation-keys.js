/**
 * @fileoverview Disallows use of translation keys which have no definition
 * @author Kevin Dice
 */
"use strict";

const requireNoCache = require('../requireNoCache');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

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
        obj = obj?.[keyToAccess];
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

          const key = node.arguments?.[0]?.value
          const keyWithoutNamespace = key.indexOf(':') === -1 ? key : key.slice(key.indexOf(':') + 1);
          const namespace = (key === keyWithoutNamespace) ? defaultNamespace : key.slice(0, key.indexOf(':'));

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

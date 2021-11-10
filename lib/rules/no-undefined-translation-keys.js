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
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Disallows use of translation keys which have no definition",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        "type": "object",
        "properties": {
          "referenceTranslationFile": {
            "type": "array",
            "items": {
              "type": "string",
            },
          },
          "skipNamespacedKeys": {
            "type": "boolean",
            "default": true,
          },
          "ignoreNamespaces": {
            "type": "boolean",
            "default": false,
          },
          "allowNonLiteralKeys": {
            "type": "boolean",
            "default": false,
          },
        },
        "additionalProperties": false
      }
    ],
  },

  create(context) {
    // variables should be defined here
    const referenceTranslationFiles = context.options?.[0]?.referenceTranslationFiles || ['./lang/en.json'];
    const translationKeysFromFile = referenceTranslationFiles.reduce(
        (acc, referenceTranslationFile) => ({
          ...acc,
          ...requireNoCache(referenceTranslationFile)
        })
    );
    const skipNamespacedKeys = context.options?.[0]?.skipNamespacedKeys;
    const ignoreNamespaces = context.options?.[0]?.ignoreNamespaces;
    const allowNonLiteralKeys = context.options?.[0]?.allowNonLiteralKeys;

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function getTranslationKey(key) {
      let obj = translationKeysFromFile;
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
            if (!allowNonLiteralKeys) {
              context.report({
                node: node,
                message: "Translation keys must be string literals"
              });
            }

            // Either way, this is as far as we can process non-string-literals
            // so we return
            return;
          }

          const key = node.arguments?.[0]?.value
          const keyWithoutNamespace = key.slice(key.indexOf(':') + 1);

          if (skipNamespacedKeys && key !== keyWithoutNamespace) {
            // skip namespaced keys
            return;
          }

          const lookupKey = ignoreNamespaces ? keyWithoutNamespace : key

          if (getTranslationKey(lookupKey) === undefined) {
            context.report({
              node: node,
              message: `Translation key ${lookupKey} is used here but missing in the translations files.`
            });
          }
        }
      }
    };
  },
};

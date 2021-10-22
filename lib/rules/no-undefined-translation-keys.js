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
              "type": "string"
            }
        },
        "additionalProperties": false
      }
    ],
  },

  create(context) {
    // variables should be defined here
    const referenceTranslationFile = context.options?.[0]?.referenceTranslationFile || './lang/en.json';
    const translationKeysFromFile = requireNoCache(referenceTranslationFile);

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function getTranslationKey(key) {
      let obj = translationKeysFromFile;
      const arr = key.split(".");
      while(arr.length) { obj = obj?.[arr.shift()]; }
      return obj;
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression(node) {
        if (node.callee.name === 't') {
          if (node.arguments?.[0]?.type !== 'Literal') {
            context.report({
              node: node,
              message: "Translation keys must be string literals"
            });
            return;
          }

          const key = node.arguments?.[0]?.value

          if (getTranslationKey(key) === undefined) {
            context.report({
              node: node,
              message: `Translation key ${key} is used here but missing in the translations files.`
            });
          }
        }
      }
    };
  },
};

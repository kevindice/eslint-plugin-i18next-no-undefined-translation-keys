/**
 * @fileoverview Disallows translation keys that aren't string literals
 * @author Kevin Dice
 */
"use strict";

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
            description: "Disallows translation keys that aren't string literals",
            category: "Fill me in",
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
    },

    create(context) {
        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

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
                    }
                }
            }
        };
    },
};

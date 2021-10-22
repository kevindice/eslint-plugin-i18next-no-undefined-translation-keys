/**
 * @fileoverview Disallows use of translation keys which have no definition
 * @author Kevin Dice
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-undefined-translation-keys"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-undefined-translation-keys", rule, {
  valid: [
    {
      code: "t('pizza')"
    },
    {
      code: "t('records.contracts')"
    }
  ],

  invalid: [
    {
      code: "t(pizza)",
      errors: [
          "Translation keys must be string literals"
      ]
    },
    {
      code: "t('thisOneIsMissing')",
      errors: [
          "Translation key thisOneIsMissing is used here but missing in the translations files."
      ]
    }
  ],
});

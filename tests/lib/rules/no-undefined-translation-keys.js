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
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: "If a call to react i18next's t function is for a key that is absent from the translations files, it will throw an error.",
      errors: [{ message: "Fill me in.", type: "Me too" }],
    },
  ],
});

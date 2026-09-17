# AI usage

I have used AI to review the project, for debugging, and for writing extensive and repetitive code.

## Tools

Claude Desktop | Model: Sonnet 5.
The model was initially used to explore the project. This provided an overview of its structure and potential areas to focus on first.
This proved very useful because it allowed for a quick understanding of the scope of the tests integrated with PyTest, thereby avoiding redundant decisions.

In addition, it was part of the debugging process for the CI area and for refactoring `select-tests.js` so that it would include a fallback for unknown changes or impacts, thereby preventing a situation where no tests would run.

## What I accepted

The main accepted contribution was the refactoring of `select-tests.js`.
In this regard, the change to properly handle file mapping involved adding some logic. The proposal to add logic for file matching was accepted, along with adding a fallback to return a status code of 0 for unknown impacts, thereby running only a smoke test instead of all the tests in the suite and flagging the files that were left out.

I have also accepted the idea that, whenever there are changes to the project's general settings, the full suite of tests should be run. This is because changes to the settings are global.

## What I changed or rejected

In the extension of the e2e test suite in `tests/e2e/list.spec.ts`, the idea of adding the name of the first row as the first validation before applying the filters was discarded.
Given how the UI works and the functionality being tested, that validation did not add robustness to the suite and was unnecessary code. The validation must occur after the data is filtered to verify whether or not a match exists, as appropriate.

## What I verified myself

The changes made to `playwright.yml` were verified to ensure that the workflow would not break and that it would take file mapping into account when determining which tests to run during the CI process.
We also verified that the entries added to test-impact.yml were correct for the main cases.
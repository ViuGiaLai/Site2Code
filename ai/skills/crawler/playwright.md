<!-- Source: https://skills.sh/currents-dev/playwright-best-practices-skill/playwright-best-practices -->
<!-- Installed via: npx skills add currents-dev/playwright-best-practices-skill@playwright-best-practices -->
---
name: playwright-best-practices
description: Use when writing Playwright tests, fixing flaky tests, debugging failures, implementing Page Object Model, configuring CI/CD, optimizing performance, mocking APIs, handling authentication or OAuth, testing accessibility (axe-core), file uploads/downloads, date/time mocking, WebSockets, geolocation, permissions, multi-tab/popup flows, mobile/responsive layouts, touch gestures, GraphQL, error handling, offline mode, multi-user collaboration, third-party services (payments, email verification), console error monitoring, global setup/teardown, test annotations (skip, fixme, slow), test tags (@smoke, @fast, @critical, filtering with --grep), project dependencies, security testing (XSS, CSRF, auth), performance budgets (Web Vitals, Lighthouse), iframes, component testing, canvas/WebGL, service workers/PWA, test coverage, i18n/localization, Electron apps, or browser extension testing. Covers E2E, component, API, visual, accessibility, security, Electron, and extension testing.
license: MIT
metadata:
  author: currents.dev
  version: "1.1"
---

# Playwright Best Practices

This skill provides comprehensive guidance for all aspects of Playwright test development, from writing new tests to debugging and maintaining existing test suites.

## Activity-Based Reference Guide

Consult these references based on what you're doing:

### Writing New Tests

**When to use**: Creating new test files, writing test cases, implementing test scenarios

| Activity                            | Reference Files                                                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **Writing E2E tests**               | [test-suite-structure.md](core/test-suite-structure.md), [locators.md](core/locators.md), [assertions-waiting.md](core/assertions-waiting.md) |
| **Writing component tests**         | [component-testing.md](testing-patterns/component-testing.md), [test-suite-structure.md](core/test-suite-structure.md)                        |
| **Writing API tests**               | [api-testing.md](testing-patterns/api-testing.md), [test-suite-structure.md](core/test-suite-structure.md)                                    |
| **Writing GraphQL tests**           | [graphql-testing.md](testing-patterns/graphql-testing.md), [api-testing.md](testing-patterns/api-testing.md)                                  |
| **Writing visual regression tests** | [visual-regression.md](testing-patterns/visual-regression.md), [canvas-webgl.md](testing-patterns/canvas-webgl.md)                            |
| **Structuring test code with POM**  | [page-object-model.md](core/page-object-model.md), [test-suite-structure.md](core/test-suite-structure.md)                                    |
| **Setting up test data/fixtures**   | [fixtures-hooks.md](core/fixtures-hooks.md), [test-data.md](core/test-data.md)                                                                |
| **Handling authentication**         | [authentication.md](advanced/authentication.md), [authentication-flows.md](advanced/authentication-flows.md)                                  |
| **Testing date/time features**      | [clock-mocking.md](advanced/clock-mocking.md)                                                                                                 |
| **Testing file upload/download**    | [file-operations.md](testing-patterns/file-operations.md), [file-upload-download.md](testing-patterns/file-upload-download.md)                |
| **Testing forms/validation**        | [forms-validation.md](testing-patterns/forms-validation.md)                                                                                   |
| **Testing drag and drop**           | [drag-drop.md](testing-patterns/drag-drop.md)                                                                                                 |
| **Testing accessibility**           | [accessibility.md](testing-patterns/accessibility.md)                                                                                         |
| **Testing security (XSS, CSRF)**    | [security-testing.md](testing-patterns/security-testing.md)                                                                                   |
| **Using test annotations**          | [annotations.md](core/annotations.md)                                                                                                         |
| **Using test tags**                 | [test-tags.md](core/test-tags.md)                                                                                                             |
| **Testing iframes**                 | [iframes.md](browser-apis/iframes.md)                                                                                                         |
| **Testing canvas/WebGL**            | [canvas-webgl.md](testing-patterns/canvas-webgl.md)                                                                                           |
| **Internationalization (i18n)**     | [i18n.md](testing-patterns/i18n.md)                                                                                                           |
| **Testing Electron apps**           | [electron.md](testing-patterns/electron.md)                                                                                                   |
| **Testing browser extensions**      | [browser-extensions.md](testing-patterns/browser-extensions.md)                                                                               |

### Mobile & Responsive Testing

**When to use**: Testing mobile devices, touch interactions, responsive layouts

| Activity                        | Reference Files                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------- |
| **Device emulation**            | [mobile-testing.md](advanced/mobile-testing.md)                                  |
| **Touch gestures (swipe, tap)** | [mobile-testing.md](advanced/mobile-testing.md)                                  |
| **Viewport/breakpoint testing** | [mobile-testing.md](advanced/mobile-testing.md)                                  |
| **Mobile-specific UI**          | [mobile-testing.md](advanced/mobile-testing.md), [locators.md](core/locators.md) |

### Real-Time & Browser APIs

**When to use**: Testing WebSockets, geolocation, permissions, multi-tab flows

| Activity                        | Reference Files                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| **WebSocket/real-time testing** | [websockets.md](browser-apis/websockets.md)                                              |
| **Geolocation mocking**         | [browser-apis.md](browser-apis/browser-apis.md)                                          |
| **Permission handling**         | [browser-apis.md](browser-apis/browser-apis.md)                                          |
| **Clipboard testing**           | [browser-apis.md](browser-apis/browser-apis.md)                                          |
| **Camera/microphone mocking**   | [browser-apis.md](browser-apis/browser-apis.md)                                          |
| **Multi-tab/popup flows**       | [multi-context.md](advanced/multi-context.md)                                            |
| **OAuth popup handling**        | [third-party.md](advanced/third-party.md), [multi-context.md](advanced/multi-context.md) |

### Debugging & Troubleshooting

**When to use**: Test failures, element not found, timeouts, unexpected behavior

| Activity                                          | Reference Files                                                                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Debugging test failures**                       | [debugging.md](debugging/debugging.md), [assertions-waiting.md](core/assertions-waiting.md)                                                    |
| **Fixing flaky tests**                            | [flaky-tests.md](debugging/flaky-tests.md), [debugging.md](debugging/debugging.md), [assertions-waiting.md](core/assertions-waiting.md)        |
| **Debugging flaky parallel runs**                 | [flaky-tests.md](debugging/flaky-tests.md), [performance.md](infrastructure-ci-cd/performance.md), [fixtures-hooks.md](core/fixtures-hooks.md) |
| **Ensuring test isolation / avoiding state leak** | [flaky-tests.md](debugging/flaky-tests.md), [fixtures-hooks.md](core/fixtures-hooks.md), [performance.md](infrastructure-ci-cd/performance.md) |
| **Fixing selector issues**                        | [locators.md](core/locators.md), [debugging.md](debugging/debugging.md)                                                                        |
| **Investigating timeout issues**                  | [assertions-waiting.md](core/assertions-waiting.md), [debugging.md](debugging/debugging.md)                                                    |
| **Using trace viewer**                            | [debugging.md](debugging/debugging.md)                                                                                                         |
| **Debugging race conditions**                     | [flaky-tests.md](debugging/flaky-tests.md), [debugging.md](debugging/debugging.md), [assertions-waiting.md](core/assertions-waiting.md)        |
| **Debugging console/JS errors**                   | [console-errors.md](debugging/console-errors.md), [debugging.md](debugging/debugging.md)                                                       |

### Error & Edge Case Testing

**When to use**: Testing error states, offline mode, network failures, validation

| Activity                       | Reference Files                                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Error boundary testing**     | [error-testing.md](debugging/error-testing.md)                                                        |
| **Network failure simulation** | [error-testing.md](debugging/error-testing.md), [network-advanced.md](advanced/network-advanced.md)   |
| **Offline mode testing**       | [error-testing.md](debugging/error-testing.md), [service-workers.md](browser-apis/service-workers.md) |
| **Service worker testing**     | [service-workers.md](browser-apis/service-workers.md)                                                 |
| **Loading state testing**      | [error-testing.md](debugging/error-testing.md)                                                        |
| **Form validation testing**    | [error-testing.md](debugging/error-testing.md)                                                        |

### Multi-User & Collaboration Testing

**When to use**: Testing features involving multiple users, roles, or real-time collaboration

| Activity                       | Reference Files                                                                      |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| **Multiple users in one test** | [multi-user.md](advanced/multi-user.md)                                              |
| **Real-time collaboration**    | [multi-user.md](advanced/multi-user.md), [websockets.md](browser-apis/websockets.md) |
| **Role-based access testing**  | [multi-user.md](advanced/multi-user.md)                                              |
| **Concurrent action testing**  | [multi-user.md](advanced/multi-user.md)                                              |

### Architecture Decisions

**When to use**: Choosing test patterns, deciding between approaches, planning test architecture

| Activity                     | Reference Files                                           |
| ---------------------------- | --------------------------------------------------------- |
| **POM vs fixtures decision** | [pom-vs-fixtures.md](architecture/pom-vs-fixtures.md)     |
| **Test type selection**      | [test-architecture.md](architecture/test-architecture.md) |
| **Mock vs real services**    | [when-to-mock.md](architecture/when-to-mock.md)           |
| **Test suite structure**     | [test-suite-structure.md](core/test-suite-structure.md)   |

### Framework-Specific Testing

**When to use**: Testing React, Angular, Vue, or Next.js applications

| Activity                  | Reference Files                     |
| ------------------------- | ----------------------------------- |
| **Testing React apps**    | [react.md](frameworks/react.md)     |
| **Testing Angular apps**  | [angular.md](frameworks/angular.md) |
| **Testing Vue/Nuxt apps** | [vue.md](frameworks/vue.md)         |
| **Testing Next.js apps**  | [nextjs.md](frameworks/nextjs.md)   |

### Refactoring & Maintenance

**When to use**: Improving existing tests, code review, reducing duplication

| Activity                             | Reference Files                                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Refactoring to Page Object Model** | [page-object-model.md](core/page-object-model.md), [test-suite-structure.md](core/test-suite-structure.md) |
| **Improving test organization**      | [test-suite-structure.md](core/test-suite-structure.md), [page-object-model.md](core/page-object-model.md) |
| **Extracting common setup/teardown** | [fixtures-hooks.md](core/fixtures-hooks.md)                                                                |
| **Replacing brittle selectors**      | [locators.md](core/locators.md)                                                                            |
| **Removing explicit waits**          | [assertions-waiting.md](core/assertions-waiting.md)                                                        |
| **Creating test data factories**     | [test-data.md](core/test-data.md)                                                                          |
| **Configuration setup**              | [configuration.md](core/configuration.md)                                                                  |

### Infrastructure & Configuration

**When to use**: Setting up projects, configuring CI/CD, optimizing performance

| Activity                                | Reference Files                                                                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Configuring Playwright project**      | [configuration.md](core/configuration.md), [projects-dependencies.md](core/projects-dependencies.md)                     |
| **Setting up CI/CD pipelines**          | [ci-cd.md](infrastructure-ci-cd/ci-cd.md), [github-actions.md](infrastructure-ci-cd/github-actions.md)                   |
| **GitHub Actions setup**                | [github-actions.md](infrastructure-ci-cd/github-actions.md)                                                              |
| **GitLab CI setup**                     | [gitlab.md](infrastructure-ci-cd/gitlab.md)                                                                              |
| **Other CI providers**                  | [other-providers.md](infrastructure-ci-cd/other-providers.md)                                                            |
| **Docker/container setup**              | [docker.md](infrastructure-ci-cd/docker.md)                                                                              |
| **Global setup & teardown**             | [global-setup.md](core/global-setup.md)                                                                                  |
| **Project dependencies**                | [projects-dependencies.md](core/projects-dependencies.md)                                                                |
| **Optimizing test performance**         | [performance.md](infrastructure-ci-cd/performance.md), [test-suite-structure.md](core/test-suite-structure.md)           |
| **Configuring parallel execution**      | [parallel-sharding.md](infrastructure-ci-cd/parallel-sharding.md), [performance.md](infrastructure-ci-cd/performance.md) |
| **Isolating test data between workers** | [fixtures-hooks.md](core/fixtures-hooks.md), [performance.md](infrastructure-ci-cd/performance.md)                       |
| **Test coverage**                       | [test-coverage.md](infrastructure-ci-cd/test-coverage.md)                                                                |
| **Test reporting/artifacts**            | [reporting.md](infrastructure-ci-cd/reporting.md)                                                                        |

### Advanced Patterns

**When to use**: Complex scenarios, API mocking, network interception

| Activity                             | Reference Files                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Mocking API responses**            | [test-suite-structure.md](core/test-suite-structure.md), [network-advanced.md](advanced/network-advanced.md) |
| **Network interception**             | [network-advanced.md](advanced/network-advanced.md), [assertions-waiting.md](core/assertions-waiting.md)     |
| **GraphQL mocking**                  | [network-advanced.md](advanced/network-advanced.md)                                                          |
| **HAR recording/playback**           | [network-advanced.md](advanced/network-advanced.md)                                                          |
| **Custom fixtures**                  | [fixtures-hooks.md](core/fixtures-hooks.md)                                                                  |
| **Advanced waiting strategies**      | [assertions-waiting.md](core/assertions-waiting.md)                                                          |
| **OAuth/SSO mocking**                | [third-party.md](advanced/third-party.md), [multi-context.md](advanced/multi-context.md)                     |
| **Payment gateway mocking**          | [third-party.md](advanced/third-party.md)                                                                    |
| **Email/SMS verification mocking**   | [third-party.md](advanced/third-party.md)                                                                    |
| **Failing on console errors**        | [console-errors.md](debugging/console-errors.md)                                                             |
| **Security testing (XSS, CSRF)**     | [security-testing.md](testing-patterns/security-testing.md)                                                  |
| **Performance budgets & Web Vitals** | [performance-testing.md](testing-patterns/performance-testing.md)                                            |
| **Lighthouse integration**           | [performance-testing.md](testing-patterns/performance-testing.md)                                            |
| **Test annotations (skip, fixme)**   | [annotations.md](core/annotations.md)                                                                        |
| **Test tags (@smoke, @fast)**        | [test-tags.md](core/test-tags.md)                                                                            |
| **Test steps for reporting**         | [annotations.md](core/annotations.md)                                                                        |

## Quick Decision Tree

```
What are you doing?
â”‚
â”œâ”€ Writing a new test?
â”‚  â”œâ”€ E2E test â†’ core/test-suite-structure.md, core/locators.md, core/assertions-waiting.md
â”‚  â”œâ”€ Component test â†’ testing-patterns/component-testing.md
â”‚  â”œâ”€ API test â†’ testing-patterns/api-testing.md, core/test-suite-structure.md
â”‚  â”œâ”€ GraphQL test â†’ testing-patterns/graphql-testing.md
â”‚  â”œâ”€ Visual regression â†’ testing-patterns/visual-regression.md
â”‚  â”œâ”€ Visual/canvas test â†’ testing-patterns/canvas-webgl.md, core/test-suite-structure.md
â”‚  â”œâ”€ Accessibility test â†’ testing-patterns/accessibility.md
â”‚  â”œâ”€ Mobile/responsive test â†’ advanced/mobile-testing.md
â”‚  â”œâ”€ i18n/locale test â†’ testing-patterns/i18n.md
â”‚  â”œâ”€ Electron app test â†’ testing-patterns/electron.md
â”‚  â”œâ”€ Browser extension test â†’ testing-patterns/browser-extensions.md
â”‚  â”œâ”€ Multi-user test â†’ advanced/multi-user.md
â”‚  â”œâ”€ Form validation test â†’ testing-patterns/forms-validation.md
â”‚  â””â”€ Drag and drop test â†’ testing-patterns/drag-drop.md
â”‚
â”œâ”€ Testing specific features?
â”‚  â”œâ”€ File upload/download â†’ testing-patterns/file-operations.md, testing-patterns/file-upload-download.md
â”‚  â”œâ”€ Date/time dependent â†’ advanced/clock-mocking.md
â”‚  â”œâ”€ WebSocket/real-time â†’ browser-apis/websockets.md
â”‚  â”œâ”€ Geolocation/permissions â†’ browser-apis/browser-apis.md
â”‚  â”œâ”€ OAuth/SSO mocking â†’ advanced/third-party.md, advanced/multi-context.md
â”‚  â”œâ”€ Payments/email/SMS â†’ advanced/third-party.md
â”‚  â”œâ”€ iFrames â†’ browser-apis/iframes.md
â”‚  â”œâ”€ Canvas/WebGL/charts â†’ testing-patterns/canvas-webgl.md
â”‚  â”œâ”€ Service workers/PWA â†’ browser-apis/service-workers.md
â”‚  â”œâ”€ i18n/localization â†’ testing-patterns/i18n.md
â”‚  â”œâ”€ Security (XSS, CSRF) â†’ testing-patterns/security-testing.md
â”‚  â””â”€ Performance/Web Vitals â†’ testing-patterns/performance-testing.md
â”‚
â”œâ”€ Architecture decisions?
â”‚  â”œâ”€ POM vs fixtures â†’ architecture/pom-vs-fixtures.md
â”‚  â”œâ”€ Test type selection â†’ architecture/test-architecture.md
â”‚  â”œâ”€ Mock vs real services â†’ architecture/when-to-mock.md
â”‚  â””â”€ Test suite structure â†’ core/test-suite-structure.md
â”‚
â”œâ”€ Framework-specific testing?
â”‚  â”œâ”€ React app â†’ frameworks/react.md
â”‚  â”œâ”€ Angular app â†’ frameworks/angular.md
â”‚  â”œâ”€ Vue/Nuxt app â†’ frameworks/vue.md
â”‚  â””â”€ Next.js app â†’ frameworks/nextjs.md
â”‚
â”œâ”€ Authentication testing?
â”‚  â”œâ”€ Basic auth patterns â†’ advanced/authentication.md
â”‚  â””â”€ Complex flows (MFA, reset) â†’ advanced/authentication-flows.md
â”‚
â”œâ”€ Test is failing/flaky?
â”‚  â”œâ”€ Flaky test investigation â†’ debugging/flaky-tests.md
â”‚  â”œâ”€ Element not found â†’ core/locators.md, debugging/debugging.md
â”‚  â”œâ”€ Timeout issues â†’ core/assertions-waiting.md, debugging/debugging.md
â”‚  â”œâ”€ Race conditions â†’ debugging/flaky-tests.md, debugging/debugging.md
â”‚  â”œâ”€ Flaky only with multiple workers â†’ debugging/flaky-tests.md, infrastructure-ci-cd/performance.md
â”‚  â”œâ”€ State leak / isolation â†’ debugging/flaky-tests.md, core/fixtures-hooks.md
â”‚  â”œâ”€ Console/JS errors â†’ debugging/console-errors.md, debugging/debugging.md
â”‚  â””â”€ General debugging â†’ debugging/debugging.md
â”‚
â”œâ”€ Testing error scenarios?
â”‚  â”œâ”€ Network failures â†’ debugging/error-testing.md, advanced/network-advanced.md
â”‚  â”œâ”€ Offline (unexpected) â†’ debugging/error-testing.md
â”‚  â”œâ”€ Offline-first/PWA â†’ browser-apis/service-workers.md
â”‚  â”œâ”€ Error boundaries â†’ debugging/error-testing.md
â”‚  â””â”€ Form validation â†’ testing-patterns/forms-validation.md, debugging/error-testing.md
â”‚
â”œâ”€ Refactoring existing code?
â”‚  â”œâ”€ Implementing POM â†’ core/page-object-model.md
â”‚  â”œâ”€ Improving selectors â†’ core/locators.md
â”‚  â”œâ”€ Extracting fixtures â†’ core/fixtures-hooks.md
â”‚  â”œâ”€ Creating data factories â†’ core/test-data.md
â”‚  â””â”€ Configuration setup â†’ core/configuration.md
â”‚
â”œâ”€ Setting up infrastructure?
â”‚  â”œâ”€ CI/CD â†’ infrastructure-ci-cd/ci-cd.md
â”‚  â”œâ”€ GitHub Actions â†’ infrastructure-ci-cd/github-actions.md
â”‚  â”œâ”€ GitLab CI â†’ infrastructure-ci-cd/gitlab.md
â”‚  â”œâ”€ Other CI providers â†’ infrastructure-ci-cd/other-providers.md
â”‚  â”œâ”€ Docker/containers â†’ infrastructure-ci-cd/docker.md
â”‚  â”œâ”€ Sharding/parallel â†’ infrastructure-ci-cd/parallel-sharding.md
â”‚  â”œâ”€ Reporting/artifacts â†’ infrastructure-ci-cd/reporting.md
â”‚  â”œâ”€ Global setup/teardown â†’ core/global-setup.md
â”‚  â”œâ”€ Project dependencies â†’ core/projects-dependencies.md
â”‚  â”œâ”€ Test performance â†’ infrastructure-ci-cd/performance.md
â”‚  â”œâ”€ Test coverage â†’ infrastructure-ci-cd/test-coverage.md
â”‚  â””â”€ Project config â†’ core/configuration.md, core/projects-dependencies.md
â”‚
â”œâ”€ Organizing tests?
â”‚  â”œâ”€ Skip/fixme/slow tests â†’ core/annotations.md
â”‚  â”œâ”€ Test tags (@smoke, @fast) â†’ core/test-tags.md
â”‚  â”œâ”€ Filtering tests (--grep) â†’ core/test-tags.md
â”‚  â”œâ”€ Test steps â†’ core/annotations.md
â”‚  â””â”€ Conditional execution â†’ core/annotations.md
â”‚
â””â”€ Running subset of tests?
   â”œâ”€ By tag (@smoke, @critical) â†’ core/test-tags.md
   â”œâ”€ Exclude slow/flaky tests â†’ core/test-tags.md
   â”œâ”€ PR vs nightly tests â†’ core/test-tags.md, infrastructure-ci-cd/ci-cd.md
   â””â”€ Project-specific filtering â†’ core/test-tags.md, core/configuration.md
```

## Test Validation Loop

After writing or modifying tests:

1. **Run tests**: `npx playwright test --reporter=list`
2. **If tests fail**:
   - Review error output and trace (`npx playwright show-trace`)
   - Fix locators, waits, or assertions
   - Re-run tests
3. **Only proceed when all tests pass**
4. **Run multiple times** for critical tests: `npx playwright test --repeat-each=5`


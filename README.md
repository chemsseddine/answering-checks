[![Node.js CI](https://github.com/chemsseddine/answering-checks/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/chemsseddine/answering-checks/actions/workflows/ci.yml)

# Answering Checks Application

This App is built with React and using vite as build & Dev tool and deployed here : https://chemsseddine.github.io/answering-checks/

# Project

I tried to keep it simple , and use whatever necessary to do the job

1. Data Fetching: [React Query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/)

2. UI Component Library : [Semantic UI](https://react.semantic-ui.com/)

3. For Custom Styles , a CSS-in-JS approach with [styled-components](https://styled-components.com/)

4. For Testing: [Jest](https://jestjs.io/) as a test runner and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

App is using continuous integration powered by GitHub Action, one workflow for building and testing the app

## Installation

Project is using [vite](https://vitejs.dev/) , a fast build tool compared to CRA

Environnement: Node.js >= 14.xx

```sh
yarn  # install dependencies
yarn dev # launch development server
yarn build # for production bundle
yarn test # run jest
yarn test:coverage # same as above with coverage report
```

## What The App does ?

1. Display All checks by order of priority
2. First Check is enabled by default
3. Every Check could be answered with Yes or No
4. Yes will enable the next check preventing the user to submit
5. No will early exit the flow and enable the user to submit
6. Checks could be navigated with arrow keys (up & down)
7. Checks could be switched from Yes to No with Keyboard Keys (1 & 2)
8. Every selection will be saved
9. A success submission will display a success message and reset the user selection
10. A failed submission will display an error message and let the user submit again

## Test

The app is at 77.47% test coverage

The function `updateChecks` responsible of generating the next checks state is fully covered !

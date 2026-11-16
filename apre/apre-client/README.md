# ApreClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Week 4 M-085: Agent Performance by Month

In `apre/apre-server`, run `npm install` then `npm start`.
In `apre/apre-client`, run `npm install` then `npm start`.
Sign in and navigate to `/reports/agent-performance/agent-performance-by-month`.
The Angular component fetches `GET /api/reports/agent-performance/by-month` and displays monthly per-agent call counts and call durations.

Test commands (tests have not been executed in this environment):
- Server: `npm test -- --runInBand` from `apre/apre-server`
- Client: `npm test -- --watch=false` from `apre/apre-client`

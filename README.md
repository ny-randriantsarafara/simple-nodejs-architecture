#### 5 Test Endpoints:

- Create Issues: Create multiple issues and group them by video and category in problems: (`POST /issues`).
- Change Status: Update problems & issue statuses: (`POST /change-status/<status>`).
- Create Tickets: Create tickets in 2 mocked apps: (`POST /create-ticket/<third-party>/<problemId>`).
- Update Tickets: Update tickets in 2 mocked apps (`POST /update-ticket/<third-party>/<problemId>`).
- Close Tickets: Close tickets in 2 mocked apps (`POST /close-ticket/<third-party>/<problemId>`).

#### Installation and Startup:

- Basic setup: Run npm install to install dependencies.
- Production: Build the app for production with `npm build`. Then, start the server with `npm start`.
- Development: For hot reloading during development, use `npm run start:dev`.

#### Running Automated Tests:

Execute `npm run test` to run automated tests and ensure everything's functioning properly.
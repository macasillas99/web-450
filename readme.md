
## Week 2 Major Development Task — M-063

### Sales Data Report

Added a Sales Data Report that displays total sales and transaction counts by region.

The server API retrieves sales data from MongoDB and groups it by region. The Angular component requests the report data and displays it using the shared TableComponent.

### Server Setup

From the `apre/apre-server` folder:

```bash
npm install
npm start
```

API endpoint: `GET /api/reports/sales/summary`

Run the three server unit tests:

```bash
npm test -- --runInBand test/routes/reports/sales/summary.spec.js
```

### Client Setup

From the `apre/apre-client` folder:

```bash
npm install
npm start
```

Open the application on port 4200 and navigate to:

**Sales Reports → Sales Data Report**

Run the three Angular unit tests:

```bash
npm test -- --watch=false --include=src/app/reports/sales/sales-data-report/sales-data-report.component.spec.ts
```

### Verification

The report includes loading, empty-data, and error messages. Six unit tests were added: three for the server endpoint and three for the Angular component.

The server requires the configured MongoDB connection.
```

5. Click **Commit changes**.
6. Commit directly to `main` with this message:

`Week2-Major: document sales report setup and testing`

**Next:** We'll verify the code and tests before creating the final Blackboard ZIP.

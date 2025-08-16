const express = require('express');
const dashboardRouter = require('./routes/dashboard');

const app = express();
app.use(express.json());

app.use('/api/admin', dashboardRouter);

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Start server when run directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;

const express = require('express');
const attributeGroupsRoute = require('./attributeGroupsRoute');

const app = express();
app.use(express.json());
app.use('/api', attributeGroupsRoute);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on ${port}`);
  });
}

module.exports = app;

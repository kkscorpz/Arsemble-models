const express = require('express');
const app = express();
app.use(express.json());

// Import handlers for each intent
const ramHandler = require('./ram-model');
const cpuHandler = require('./cpu-model');

// Webhook endpoint for Dialogflow
app.post('/webhook', (req, res) => {
  const intentName = req.body.queryResult.intent.displayName;

  if (intentName === 'ram-model') {
    ramHandler(req, res);
  } else if (intentName === 'cpu-model') {
    cpuHandler(req, res);
  } else {
    res.json({
      fulfillmentText: `No handler found for intent: ${intentName}`,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` server is running on port ${PORT}`);
});

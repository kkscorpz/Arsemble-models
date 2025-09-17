// index.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


const { handleCPUIntent } = require('./cpu-model');
const { handleRAMIntent } = require('./ram-model');
const { handleMotherboardIntent } = require('./motherboard-model');
const { handleGPUIntent } = require('./gpu-model');
const { handleCaseFanIntent } = require('./case-fan-model');
const { handleCPUCoolerIntent } = require('./cpu-cooler-model');
const { handleStorageIntent } = require('./storage-model');
const { handlePSUIntent } = require('./psu-model');
const { handleCompatibilityIntent } = require('./compatibility-handler');


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Dialogflow Webhook Server is Running!');
});


app.post('/webhook', (req, res) => {
    const queryResult = req.body.queryResult;
    const intentDisplayName = queryResult?.intent?.displayName;
    const parameters = queryResult?.parameters;
    const inputContexts = queryResult?.outputContexts || [];

    const sessionParts = req.body.session.split('/');
    const projectId = sessionParts[1];
    const sessionId = sessionParts[4];

    console.log(`[Webhook Request] Session: ${sessionId}, Intent: "${intentDisplayName}", Parameters:`, parameters);


    if (!intentDisplayName || !parameters) {
        console.error('ERROR: Invalid Dialogflow request payload - missing intent display name or parameters.');
        return res.json({ fulfillmentText: 'Invalid request payload.' });
    }


    let fulfillmentResponse = {
        fulfillmentText: 'Sorry, I couldn\'t process that request.',
        outputContexts: []
    };

    // --- Intent Handling Logic ---
    if (intentDisplayName === 'Get_CPU_Details') {
        const handlerResult = handleCPUIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = handlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = handlerResult.outputContexts;
    }
    else if (intentDisplayName === 'Get_RAM_Details') {
        const handlerResult = handleRAMIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = handlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = handlerResult.outputContexts;
    }
    else if (intentDisplayName === 'Get_Motherboard_Details') {
        const handlerResult = handleMotherboardIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = handlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = handlerResult.outputContexts;
    }
    else if (intentDisplayName === 'Get_GPU_Details') {
        const handlerResult = handleGPUIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = handlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = handlerResult.outputContexts;
    }
    else if (intentDisplayName === 'Get_Case_Fan_Details') {
        const handlerResult = handleCaseFanIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = handlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = handlerResult.outputContexts;
    }
    else if (intentDisplayName === 'Get_CPU_Cooler_Details') {
        const handlerResult = handleCPUCoolerIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = handlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = handlerResult.outputContexts;
    }
    else if (intentDisplayName === 'Get_Storage_Details') {
        const handlerResult = handleStorageIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = handlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = handlerResult.outputContexts;
    }
    else if (intentDisplayName === 'Get_PSU_Details') {
        const handlerResult = handlePSUIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = handlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = handlerResult.outputContexts;
    }
    else if (intentDisplayName === 'Get_Compatibility_Details') {
        const handlerResult = handleCompatibilityIntent(parameters);
        fulfillmentResponse.fulfillmentText = handlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = handlerResult.outputContexts;
    }
    else {
        console.warn(`[Webhook] Unhandled intent received: "${intentDisplayName}".`);
        fulfillmentResponse.fulfillmentText = 'I\'m sorry, I don\'t have information for that component type yet, or I didn\'t understand your request fully.';
    }

    return res.json(fulfillmentResponse);
});


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Access webhook at: http://localhost:${PORT}/webhook`);
});

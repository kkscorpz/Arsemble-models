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

    // Log incoming request details for debugging
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
    // Use 'if-else if' structure to route requests to appropriate handlers based on intent display name.

    // 1. Handle the generic RAM Intent
    if (intentDisplayName === 'Get_RAM_Details') {
        const ramHandlerResult = handleRAMIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = ramHandlerResult.fulfillmentText;
        fulfillmentResponse.fulfillmentMessages = ramHandlerResult.fulfillmentMessages;
        fulfillmentResponse.outputContexts = ramHandlerResult.outputContexts;
    }
    // 2. Handle the generic CPU Intent
    else if (intentDisplayName === 'Get_CPU_Details') {
        fulfillmentResponse.fulfillmentText = handleCPUIntent(intentDisplayName, parameters);
    }
    // 3. Handle the generic Case Fan Intent
    else if (intentDisplayName === 'Get_Case_Fan_Details') {
        const caseFanHandlerResult = handleCaseFanIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = caseFanHandlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = caseFanHandlerResult.outputContexts;
    }
    // 4. Handle the generic GPU Intent
    else if (intentDisplayName === 'Get_GPU_Details') {
        const gpuHandlerResult = handleGPUIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = gpuHandlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = gpuHandlerResult.outputContexts;
    }
    // 5. Handle the generic CPU Cooler Intent
    else if (intentDisplayName === 'Get_CPU_Cooler_Details') {
        const cpuCoolerHandlerResult = handleCPUCoolerIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = cpuCoolerHandlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = cpuCoolerHandlerResult.outputContexts;
    }
    // 6. Handle the generic Motherboard Intent
    else if (intentDisplayName === 'Get_Motherboard_Details') {
        const motherboardHandlerResult = handleMotherboardIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = motherboardHandlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = motherboardHandlerResult.outputContexts;
    }
    // 7. Handle the generic PSU Intent
    else if (intentDisplayName === 'Get_PSU_Details') {
        const psuHandlerResult = handlePSUIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = psuHandlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = psuHandlerResult.outputContexts;
    }
    // 8. Handle the generic Storage Intent (CHANGED)
    else if (intentDisplayName === 'Get_Storage_Details') { // Changed from checking storageIntents array
        const storageHandlerResult = handleStorageIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = storageHandlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = storageHandlerResult.outputContexts;
    }
    else if (intentDisplayName === 'Get_Build_Details') {
    const result = handleBuildIntent(parameters);
    fulfillmentResponse.fulfillmentText = result;
    }

    // Fallback for any intent not explicitly handled above
    else {
        console.warn(`[Webhook] Unhandled intent received: "${intentDisplayName}".`);
        fulfillmentResponse.fulfillmentText = 'I\'m sorry, I don\'t have information for that component type yet, or I didn\'t understand your request fully.';
    }

    // Send the final response back to Dialogflow
    return res.json(fulfillmentResponse);
});

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Access webhook at: http://localhost:${PORT}/webhook`);
});

// --- Arrays for Other Component Intents ---
// REMOVED storageIntents array, now handled by generic intent

// index.js

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable PORT or default to 3000

// Import handler functions for different component types
const { handleCPUIntent } = require('./cpu-model');
const { handleRAMIntent } = require('./ram-model');
const { handleMotherboardIntent } = require('./motherboard-model');
const { handleGPUIntent } = require('./gpu-model'); // Updated import
const { handleCaseFanIntent } = require('./case-fan-model');
const { handleCPUCoolerIntent } = require('./cpu-cooler-model');
const { handleStorageIntent } = require('./storage-model');
const { handlePSUIntent } = require('./psu-model');

app.use(express.json()); // Middleware to parse incoming JSON payloads from Dialogflow

// Basic route to check if the server is running
app.get('/', (req, res) => {
    res.send('Dialogflow Webhook Server is Running!');
});

// Main webhook endpoint for Dialogflow
app.post('/webhook', (req, res) => {
    // Extract necessary information from the Dialogflow request body
    const queryResult = req.body.queryResult;
    const intentDisplayName = queryResult?.intent?.displayName;
    const parameters = queryResult?.parameters;
    const inputContexts = queryResult?.outputContexts || []; // Output contexts for managing conversation flow
    
    // Extract session ID for context management or logging
    const sessionParts = req.body.session.split('/');
    const projectId = sessionParts[1];
    const sessionId = sessionParts[4];

    // Log incoming request details for debugging
    console.log(`[Webhook Request] Session: ${sessionId}, Intent: "${intentDisplayName}", Parameters:`, parameters);

    // Validate the incoming request
    if (!intentDisplayName || !parameters) {
        console.error('ERROR: Invalid Dialogflow request payload - missing intent display name or parameters.');
        return res.json({ fulfillmentText: 'Invalid request payload.' });
    }

    // Initialize the response object
    let fulfillmentResponse = {
        fulfillmentText: 'Sorry, I couldn\'t process that request.',
        outputContexts: [] // Default empty contexts
    };

    // --- Intent Handling Logic ---
    // Use 'if-else if' structure to route requests to appropriate handlers based on intent display name.

    // 1. Handle the generic RAM Intent
    if (intentDisplayName === 'Get_RAM_Details') {
        const ramHandlerResult = handleRAMIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = ramHandlerResult.fulfillmentText;
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
    // 4. Handle the generic GPU Intent (THIS IS THE CORRECTED PART)
    // Make sure 'Get_GPU_Details' is the exact name of your generic GPU intent in Dialogflow.
    else if (intentDisplayName === 'Get_GPU_Details') {
        const gpuHandlerResult = handleGPUIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = gpuHandlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = gpuHandlerResult.outputContexts; // Pass contexts back
    }
    // 5. Handle other component intents (still using specific lists for now)
    else if (motherboardIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handleMotherboardIntent(intentDisplayName, parameters);
    } else if (cpuCoolerIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handleCPUCoolerIntent(intentDisplayName, parameters);
    } else if (storageIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handleStorageIntent(intentDisplayName, parameters);
    } else if (psuIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handlePSUIntent(intentDisplayName, parameters);
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
// REMOVED gpuIntents array as it's now handled by a single generic intent
const motherboardIntents = [
    "Get_Motherboard_ASUS_PRIME_B550M-K_Details", "Get_Motherboard_MSI_B450M_A_Pro_Max_II_Details",
    "Get_Motherboard_MSI_Pro_H610M_S_DDR4_Details", "Get_Motherboard_RAMSTA_RS-B450MP_Details",
    "Get_Motherboard_RAMSTA_RS-H311D4_Details", "Get_Motherboard_MSI_B650M_Gaming_Plus_WiFi_Details",
    "Get_Motherboard_MSI_B760M_Gaming_Plus_WiFi_DDR4_Details", "Get_Motherboard_MSI_B450M-A_PRO_MAX_II_Details",
    "Get_Motherboard_GIGABYTE_H610M_K_DDR4_Details"
];

const cpuCoolerIntents = ["Get_CPU_Cooler_COOLMOON_AOSOR_S400_Details", "Get_CPU_Cooler_Cooler_Master_Hyper_212_Black_Edition_Details", "Get_CPU_Cooler_Thermalright_Peerless_Assassin_120_SE_Details", "Get_CPU_Cooler_Deepcool_LE500_MARRS_Details"];
const storageIntents = ["Get_Storage_Seagate_Barracuda_1TB_Details", "Get_Storage_Western_Digital_Blue_2TB_Details", "Get_Storage_Samsung_970_EVO_Plus_1TB_Details", "Get_Storage_Crucial_MX500_500GB_Details"];
const psuIntents = ["Get_PSU_Corsair_RM850x_Details", "Get_PSU_Cooler_Master_MWE_White_750W_Details", "Get_PSU_Corsair_CX650_Details", "Get_PSU_Cougar_GX-F_750W_Details", "Get_PSU_Seasonic_Focus_Plus_Gold_550W_Details"];

// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Import handler functions for different components
const { handleCPUIntent } = require('./cpu-model');
const { handleRAMIntent } = require('./ram-model');
const { handleMotherboardIntent } = require('./motherboard-model');
const { handleGPUIntent } = require('./gpu-model');
const { handleCaseFanIntent } = require('./case-fan-model');
const { handleCPUCoolerIntent } = require('./cpu-cooler-model');
const { handleStorageIntent } = require('./storage-model');
const { handlePSUIntent } = require('./psu-model');

app.use(express.json()); // Middleware to parse JSON request bodies

// Basic GET route for server health check
app.get('/', (req, res) => {
    res.send('Dialogflow Webhook Server is Running!');
});

// Main webhook endpoint for Dialogflow POST requests
app.post('/webhook', (req, res) => {
    const queryResult = req.body.queryResult;
    const intentDisplayName = queryResult?.intent?.displayName;
    const parameters = queryResult?.parameters;
    const inputContexts = queryResult?.outputContexts || []; // Active contexts from Dialogflow

    // Extract Project ID and Session ID from the session string
    // e.g., "projects/your-project-id/agent/sessions/your-session-id"
    const sessionParts = req.body.session.split('/');
    const projectId = sessionParts[1];
    const sessionId = sessionParts[4];

    // Basic validation
    if (!intentDisplayName || !parameters) {
        return res.json({ fulfillmentText: 'Invalid request payload from Dialogflow.' });
    }

    let fulfillmentResponse = { // Initialize response object for Dialogflow
        fulfillmentText: 'Sorry, I couldn\'t process that request.',
        outputContexts: [] // Initialize with empty array
    };

    // --- Intent Routing ---
    // Define the unified intent for RAM
    const unifiedRamIntent = 'Get_RAM_Attribute'; // Corrected to the unified intent name

    // Lists of specific intents for other components - these will be replaced with unified intents
    // as we set them up for each component.
    const cpuIntents = [
        "Get_CPU_AMD_Ryzen_3_3200G_Details", "Get_CPU_AMD_Ryzen_5_5600G_Details",
        "Get_CPU_AMD_Ryzen_5_5600X_Details", "Get_CPU_AMD_Ryzen_7_5700X_Details",
        "Get_CPU_AMD_Ryzen_7_7700X_Details", "Get_CPU_AMD_Ryzen_9_7950X_Details",
        "Get_CPU_AMD_Ryzen_9_9900X3D_Details", "Get_CPU_AMD_Ryzen_9_9900X_Details",
        "Get_CPU_Intel_Core_i3-13100_Details", "Get_CPU_Intel_Core_i3-14100_Details",
        "Get_CPU_Intel_Core_i5-13400_Details", "Get_CPU_Intel_Core_i5-14500_Details",
        "Get_CPU_Intel_Core_i5-14600K_Details", "Get_CPU_Intel_Core_i7-13700K_Details",
        "Get_CPU_Intel_Core_i7-14700K_Details", "Get_CPU_Intel_Core_i9-14900K_Details"
    ];
    const motherboardIntents = [
        "Get_Motherboard_ASUS_PRIME_B550M-K_Details", "Get_Motherboard_MSI_B450M_A_Pro_Max_II_Details",
        "Get_Motherboard_MSI_Pro_H610M_S_DDR4_Details", "Get_Motherboard_RAMSTA_RS-B450MP_Details",
        "Get_Motherboard_RAMSTA_RS-H311D4_Details", "Get_Motherboard_MSI_B650M_Gaming_Plus_WiFi_Details",
        "Get_Motherboard_MSI_B760M_Gaming_Plus_WiFi_DDR4_Details", "Get_Motherboard_MSI_B450M-A_PRO_MAX_II_Details",
        "Get_Motherboard_GIGABYTE_H610M_K_DDR4_Details"
    ];
    const gpuIntents = ["Get_GPU_Gigabyte_RTX_3050_EAGLE_OC_Details"];
    const caseFanIntents = ["Get_Case_Fan_COOLMOON_YX120_Details", "Get_Case_Fan_Cooler_Master_SickleFlow_120_ARGB_Details", "Get_Case_Fan_Arctic_P12_PWM_PST_Details"];
    const cpuCoolerIntents = ["Get_CPU_Cooler_COOLMOON_AOSOR_S400_Details", "Get_CPU_Cooler_Cooler_Master_Hyper_212_Black_Edition_Details", "Get_CPU_Cooler_Thermalright_Peerless_Assassin_120_SE_Details", "Get_CPU_Cooler_Deepcool_LE500_MARRS_Details"];
    const storageIntents = ["Get_Storage_Seagate_Barracuda_1TB_Details", "Get_Storage_Western_Digital_Blue_2TB_Details", "Get_Storage_Samsung_970_EVO_Plus_1TB_Details", "Get_Storage_Crucial_MX500_500GB_Details"];
    const psuIntents = ["Get_PSU_Corsair_RM850x_Details", "Get_PSU_Cooler_Master_MWE_White_750W_Details", "Get_PSU_Corsair_CX650_Details", "Get_PSU_Cougar_GX-F_750W_Details", "Get_PSU_Seasonic_Focus_Plus_Gold_550W_Details"];

    // Route the request to the appropriate handler function
    if (intentDisplayName === unifiedRamIntent) {
        const ramHandlerResult = handleRAMIntent(parameters, inputContexts, projectId, sessionId);
        fulfillmentResponse.fulfillmentText = ramHandlerResult.fulfillmentText;
        fulfillmentResponse.outputContexts = ramHandlerResult.outputContexts;
    } else if (cpuIntents.includes(intentDisplayName)) {
        // If other handlers (e.g., handleCPUIntent) are updated to return
        // an object { fulfillmentText, outputContexts }, use this pattern:
        // const cpuHandlerResult = handleCPUIntent(parameters, inputContexts, projectId, sessionId);
        // fulfillmentResponse.fulfillmentText = cpuHandlerResult.fulfillmentText;
        // fulfillmentResponse.outputContexts = cpuHandlerResult.outputContexts;
        // Otherwise, assume it returns a string:
        fulfillmentResponse.fulfillmentText = handleCPUIntent(intentDisplayName, parameters);
    } else if (motherboardIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handleMotherboardIntent(intentDisplayName, parameters);
    } else if (gpuIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handleGPUIntent(intentDisplayName, parameters);
    } else if (caseFanIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handleCaseFanIntent(intentDisplayName, parameters);
    } else if (cpuCoolerIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handleCPUCoolerIntent(intentDisplayName, parameters);
    } else if (storageIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handleStorageIntent(intentDisplayName, parameters);
    } else if (psuIntents.includes(intentDisplayName)) {
        fulfillmentResponse.fulfillmentText = handlePSUIntent(intentDisplayName, parameters);
    } else {
        fulfillmentResponse.fulfillmentText = 'I\'m sorry, I don\'t have information for that component type yet.';
    }

    // Send the full response object back to Dialogflow
    return res.json(fulfillmentResponse);
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Import handler functions for different components
const { handleCPUIntent } = require('./cpu-model');
const { handleRAMIntent } = require('./ram-model');
const { handleMotherboardIntent } = require('./motherboard-model');

// Middleware to parse JSON request bodies from Dialogflow
app.use(express.json());

// Basic GET route for checking if the server is running
app.get('/', (req, res) => {
    console.log('GET / request received. Webhook server is alive!');
    res.send('Dialogflow Webhook Server is Running!');
});

// Main webhook endpoint for Dialogflow POST requests
app.post('/webhook', (req, res) => {
    console.log('\n--- Dialogflow Webhook Request Received ---');
    console.log('Full Request Body:', JSON.stringify(req.body, null, 2)); // Detailed log of the entire request

    const intentDisplayName = req.body.queryResult?.intent?.displayName;
    const parameters = req.body.queryResult?.parameters;

    console.log('Detected Intent:', intentDisplayName);
    console.log('Received Parameters:', parameters); // Crucial for debugging parameter names and values

    // Basic validation for essential Dialogflow request parts
    if (!intentDisplayName || !parameters) {
        console.error('ERROR: Invalid request payload. Missing intent display name or parameters.');
        return res.json({ fulfillmentText: 'Invalid request payload from Dialogflow.' });
    }

    let fulfillmentResponseText = 'Sorry, I couldn\'t process that request.'; // Default fallback response

    // Define arrays of intents that each handler function will manage
    const cpuIntents = [
        "Get_CPU_AMD_Ryzen_3_3200G_Details",
        "Get_CPU_AMD_Ryzen_5_5600G_Details",
        "Get_CPU_AMD_Ryzen_5_5600X_Details",
        "Get_CPU_AMD_Ryzen_7_5700X_Details",
        "Get_CPU_AMD_Ryzen_7_7700X_Details",
        "Get_CPU_AMD_Ryzen_9_7950X_Details",
        "Get_CPU_AMD_Ryzen_9_9900X3D_Details",
        "Get_CPU_AMD_Ryzen_9_9900X_Details",
        "Get_CPU_Intel_Core_i3-13100_Details",
        "Get_CPU_Intel_Core_i3-14100_Details",
        "Get_CPU_Intel_Core_i5-13400_Details",
        "Get_CPU_Intel_Core_i5-14500_Details",
        "Get_CPU_Intel_Core_i5-14600K_Details",
        "Get_CPU_Intel_Core_i7-13700K_Details",
        "Get_CPU_Intel_Core_i7-14700K_Details",
        "Get_CPU_Intel_Core_i9-14900K_Details"
    ];

    const ramIntents = [
        'Get_RAM_Kingston_FURY_Beast_DDR4_Details',
        'Get_RAM_Kingston_HyperX_FURY_DDR3_Details',
        'Get_RAM_HKC_PC_DDR4-3200_DIMM_Details',
        'Get_RAM_HKCMEMORY_HU40_DDR4_16GB_Details',
        'Get_RAM_HKCMEMORY_HU40_DDR4_8GB_Details'
    ];

    const motherboardIntents = [
        "Get_Motherboard_ASUS_PRIME_B550M-K_Details",
        "Get_Motherboard_MSI_B450M_A_Pro_Max_II_Details",
        "Get_Motherboard_MSI_Pro_H610M_S_DDR4_Details",
        "Get_Motherboard_RAMSTA_RS-B450MP_Details",
        "Get_Motherboard_RAMSTA_RS-H311D4_Details",
        "Get_Motherboard_MSI_B650M_Gaming_Plus_WiFi_Details",
        "Get_Motherboard_MSI_B760M_Gaming_Plus_WiFi_DDR4_Details",
        "Get_Motherboard_MSI_B450M-A_PRO_MAX_II_Details",
        "Get_Motherboard_GIGABYTE_H610M_K_DDR4_Details"
    ];

    // Route the request to the appropriate handler function
    if (cpuIntents.includes(intentDisplayName)) {
        fulfillmentResponseText = handleCPUIntent(intentDisplayName, parameters);
    } else if (ramIntents.includes(intentDisplayName)) {
        fulfillmentResponseText = handleRAMIntent(intentDisplayName, parameters);
    } else if (motherboardIntents.includes(intentDisplayName)) {
        fulfillmentResponseText = handleMotherboardIntent(intentDisplayName, parameters);
    } else {
        console.warn(`WARN: Intent '${intentDisplayName}' not found in any handler's list.`);
        fulfillmentResponseText = 'I\'m sorry, I don\'t have information for that component type yet.';
    }

    console.log('Sending Fulfillment Text:', fulfillmentResponseText);
    console.log('--- Webhook Request End ---\n');
    return res.json({ fulfillmentText: fulfillmentResponseText });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

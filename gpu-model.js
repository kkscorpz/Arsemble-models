// gpu-model.js
// GPU database
const gpuDatabase = {
    "gigabyte rtx 3050 eagle oc": {
        name: "Gigabyte RTX 3050 EAGLE OC",
        vram: "8GB GDDR6",
        clock_speed: "~1777 MHz (Boost)", // Changed to underscore
        power_consumption: "~130 Watts", // Changed to underscore
        slot_type: "PCIe 4.0 x16", // Changed to underscore
        compatibility: "Requires a motherboard with an available PCIe x16 slot (compatible with PCIe 3.0/4.0/5.0). Needs a PSU with sufficient wattage (450W-550W recommended total system power) and at least one 8-pin PCIe power connector. Ensure your case has enough physical clearance."
    },
    // Add more GPU models here as you expand your database
};

// GPU Model Variants (mapping user inputs to database keys)
const gpuModelMap = {
    "gigabyte rtx 3050 eagle oc": "gigabyte rtx 3050 eagle oc",
    "rtx 3050 eagle oc": "gigabyte rtx 3050 eagle oc",
    "gigabyte 3050": "gigabyte rtx 3050 eagle oc",
    "rtx 3050": "gigabyte rtx 3050 eagle oc",
    "3050 eagle oc": "gigabyte rtx 3050 eagle oc",
    "3050": "gigabyte rtx 3050 eagle oc",
};

/**
 * Handles Dialogflow intents related to GPU (Graphics Card) information.
 * @param {object} parameters - Dialogflow extracted parameters.
 * @param {Array} inputContexts - Active contexts from Dialogflow.
 * @param {string} projectId - Google Cloud Project ID.
 * @param {string} sessionId - Dialogflow session ID.
 * @returns {object} An object with `fulfillmentText` and `outputContexts`.
 */
function handleGPUIntent(parameters, inputContexts, projectId, sessionId) {
    let gpuModelRaw = parameters["gpu-model"]; // Assuming Dialogflow parameter for GPU model

    // Assuming Dialogflow parameter for detail type is 'gpu-detail-type'
    let requestedDetail = parameters["gpu-detail-type"];
    if (Array.isArray(requestedDetail) && requestedDetail.length > 0) {
        requestedDetail = requestedDetail[0];
    }
    if (typeof requestedDetail === 'string') {
        requestedDetail = requestedDetail.toLowerCase().replace(/[\s-]/g, '_');
    }

    let modelKey;
    if (gpuModelRaw) {
        if (Array.isArray(gpuModelRaw) && gpuModelRaw.length > 0) {
            gpuModelRaw = gpuModelRaw[0];
        }
        const lowerCaseRaw = String(gpuModelRaw).toLowerCase().trim();
        modelKey = gpuModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Check 'gpu_details_context' for follow-up questions
    if (!modelKey && inputContexts && inputContexts.length > 0) {
        const gpuContext = inputContexts.find(context => context.name.endsWith('/contexts/gpu_details_context'));
        if (gpuContext && gpuContext.parameters && gpuContext.parameters['gpu-model']) {
            let contextGpuModelRaw = gpuContext.parameters['gpu-model'];
            if (Array.isArray(contextGpuModelRaw) && contextGpuModelRaw.length > 0) {
                contextGpuModelRaw = contextGpuModelRaw[0];
            }
            const lowerCaseContextRaw = String(contextGpuModelRaw).toLowerCase().trim();
            modelKey = gpuModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!gpuModelRaw) {
                gpuModelRaw = contextGpuModelRaw;
            }
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that Graphics Card model.';
    let outputContexts = [];

    const gpu = gpuDatabase[modelKey];

    // --- DEBUGGING LOGS ---
    console.log('--- handleGPUIntent Debug ---');
    console.log('Parameters received from Dialogflow:', parameters);
    console.log('gpuModelRaw (processed):', gpuModelRaw);
    console.log('requestedDetail (processed):', requestedDetail);
    console.log('modelKey (used for database lookup):', modelKey);
    console.log('GPU object found in database:', gpu);
    if (gpu && requestedDetail) {
        console.log(`Value for gpu[${requestedDetail}]:`, gpu[requestedDetail]);
    }
    console.log('--- End Debug ---');
    // --- END DEBUGGING LOGS ---

    if (gpu) {
        if (requestedDetail && gpu[requestedDetail]) {
            // Specific attribute response
            switch (requestedDetail) {
                case "name":
                    fulfillmentText = `The name of the graphics card is ${gpu.name}.`;
                    break;
                case "vram":
                    fulfillmentText = `The ${gpu.name} has ${gpu.vram} VRAM.`;
                    break;
                case "clock_speed":
                    fulfillmentText = `The boost clock speed of the ${gpu.name} is ${gpu.clock_speed}.`;
                    break;
                case "power_consumption":
                    fulfillmentText = `The ${gpu.name} consumes approximately ${gpu.power_consumption}.`;
                    break;
                case "slot_type":
                    fulfillmentText = `The ${gpu.name} uses a ${gpu.slot_type} slot.`;
                    break;
                case "compatibility":
                    fulfillmentText = `Regarding compatibility for ${gpu.name}: ${gpu.compatibility}`;
                    break;
                default:
                    fulfillmentText = `For ${gpu.name}, the ${requestedDetail.replace(/_/g, ' ')} is: ${gpu[requestedDetail]}.`;
                    break;
            }
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail.replace(/_/g, ' ')} for ${gpu.name}.`;
        } else {
            // General details
            let response = `The ${gpu.name} has ${gpu.vram} VRAM, a boost clock of ${gpu.clock_speed}, and consumes approximately ${gpu.power_consumption}. `;
            response += `It uses a ${gpu.slot_type} slot. Compatibility: ${gpu.compatibility}`;
            fulfillmentText = response;
        }

        // Set 'gpu_details_context'
        if (gpuModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/gpu_details_context`,
                lifespanCount: 5,
                parameters: {
                    'gpu-model': gpuModelRaw
                }
            });
        }
    } else {
        fulfillmentText = `Sorry, I couldn't find details for "${gpuModelRaw || 'that Graphics Card model'}". Please ensure the name is correct or try another model.`;
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { gpuDatabase, gpuModelMap, handleGPUIntent };

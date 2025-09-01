// gpu-model.js
const gpuDatabase = {
    "rtx 3050": {
        name: "Gigabyte RTX 3050 EAGLE OC",
        vram: "8GB GDDR6",
        clockSpeed: "~1777 MHz (Boost)",
        powerConsumption: "~130 Watts",
        slotType: "PCIe 4.0 x16",
        compatibility: "Requires a motherboard with an available PCIe x16 slot (compatible with PCIe 3.0/4.0/5.0). Needs a PSU with sufficient wattage (450W-550W recommended total system power) and at least one 8-pin PCIe power connector. Ensure your case has enough physical clearance."
    },
    "rtx 4060": {
        name: "MSI RTX 4060 GAMING X",
        vram: "8GB GDDR6",
        clockSpeed: "~2595 MHz (Boost)",
        powerConsumption: "~115 Watts",
        slotType: "PCIe 4.0 x8",
        compatibility: "Requires a motherboard with an available PCIe x16 slot. Needs a 550W+ PSU with one 8-pin PCIe power connector. Compatible with modern cases."
    }
};

// GPU Model Variants (mapping user inputs to database keys)
const gpuModelMap = {
    "gigabyte rtx 3050 eagle oc": "rtx 3050",
    "rtx 3050 eagle oc": "rtx 3050",
    "gigabyte 3050": "rtx 3050",
    "rtx 3050": "rtx 3050",
    "3050 eagle oc": "rtx 3050",
    "3050": "rtx 3050",

    "msi rtx 4060 gaming x": "rtx 4060",
    "rtx 4060 gaming x": "rtx 4060",
    "msi 4060": "rtx 4060",
    "rtx 4060": "rtx 4060",
    "4060 gaming x": "rtx 4060",
    "4060": "rtx 4060"
};

/**
 * Handles Dialogflow intents related to GPU (Graphics Card) information.
 * @param {object} parameters - The parameters extracted by Dialogflow, including 'gpu-model' and 'requested_detail'.
 * @param {array} inputContexts - The input contexts from Dialogflow request.
 * @param {string} projectId - The Dialogflow project ID.
 * @param {string} sessionId - The Dialogflow session ID.
 * @returns {object} An object containing fulfillmentText and outputContexts.
 */
function handleGPUIntent(parameters, inputContexts, projectId, sessionId) {
    console.log('[GPU Handler] Called.');
    console.log('[GPU Handler] Received parameters:', parameters);
    console.log('[GPU Handler] Received inputContexts:', inputContexts);

    let gpuModelRaw = parameters["Gpu-model"];
    const requestedDetail = parameters['gpu-detail'];

    let gpuModelKey;
    if (gpuModelRaw) {
        const lowerCaseRaw = gpuModelRaw.toLowerCase().trim();
        gpuModelKey = gpuModelMap[lowerCaseRaw] || lowerCaseRaw;
        console.log(`[GPU Handler] Resolved gpuModelKey: ${gpuModelKey}`);
    }

    if (!gpuModelKey && inputContexts && inputContexts.length > 0) {
        const gpuContext = inputContexts.find(context => context.name.endsWith('/contexts/gpu_details_context'));
        if (gpuContext && gpuContext.parameters && gpuContext.parameters['Gpu-model']) {
            const contextGpuModelRaw = gpuContext.parameters['Gpu-model'];
            const lowerCaseContextRaw = contextGpuModelRaw.toLowerCase().trim();
            gpuModelKey = gpuModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!gpuModelRaw) gpuModelRaw = contextGpuModelRaw;
            console.log('[GPU Handler] Retrieved gpu-model from context:', gpuModelKey);
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that Graphics Card model.';
    let outputContexts = [];

    const gpu = gpuDatabase[gpuModelKey];

    if (gpu) {
        if (requestedDetail && gpu[requestedDetail]) {
            fulfillmentText = `For the ${gpu.name}, the ${requestedDetail} is: ${gpu[requestedDetail]}.`;
            console.log(`[GPU Handler] Responding with specific detail: ${requestedDetail}`);
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${gpu.name}.`;
            console.log(`[GPU Handler] Requested detail "${requestedDetail}" not found for ${gpu.name}.`);
        } else {
            // General info if no specific detail was requested
            let response = `The ${gpu.name} has ${gpu.vram} VRAM, a boost clock of ${gpu.clockSpeed}, and consumes approximately ${gpu.powerConsumption}. `;
            response += `It uses a ${gpu.slotType} slot. Compatibility: ${gpu.compatibility}`;
            fulfillmentText = response;
            console.log('[GPU Handler] Responding with general info.');
        }

        // Set the output context to remember the GPU model for follow-up questions
        if (gpuModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/gpu_details_context`,
                lifespanCount: 5,
                parameters: {
                    'gpu-model': gpuModelRaw
                }
            });
            console.log('[GPU Handler] Set output context: gpu_details_context');
        } else {
            console.warn('[GPU Handler] WARNING: gpuModelRaw was empty, could not set gpu_details_context.');
        }
    } else {
        console.log(`[GPU Handler] GPU model "${gpuModelRaw}" (key: "${gpuModelKey}") not found in database.`);
    }

    console.log('[GPU Handler] Fulfillment Text:', fulfillmentText);
    console.log('[GPU Handler] Output Contexts:', outputContexts);
    return { fulfillmentText, outputContexts };
}

module.exports = { handleGPUIntent };

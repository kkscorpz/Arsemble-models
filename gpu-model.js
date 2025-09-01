// gpu-model.js
const gpuDatabase = {
    "gpu-key-example": {
        name: "GPU Name Example",
        vram: "XGB GDDR6",
        clockSpeed: "~XXXX MHz (Boost)",
        powerConsumption: "~XXX Watts",
        slotType: "PCIe X.X xX",
        compatibility: "Describe motherboard, PSU, and case requirements here."
    },
    // Add more GPU models here
};

const gpuModelMap = {
    "gpu-key-example": "gpu-key-example",
    "gpu-short-name": "gpu-key-example",
    "gpu-alias": "gpu-key-example",
    // Add more variants/aliases here
};

/**
 * Handles Dialogflow intents related to GPU (Graphics Card) information.
 */
function handleGPUIntent(parameters, inputContexts, projectId, sessionId) {
    console.log('   [GPU Handler] Called.');
    console.log('   [GPU Handler] Received parameters:', parameters);
    console.log('   [GPU Handler] Received inputContexts:', inputContexts);

    let gpuModelRaw = parameters["gpu-model"];
    const requestedDetail = parameters['gpu-detail'];

    let gpuModelKey;
    if (gpuModelRaw) {
        const lowerCaseRaw = gpuModelRaw.toLowerCase().trim();
        gpuModelKey = gpuModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    if (!gpuModelKey && inputContexts && inputContexts.length > 0) {
        const gpuContext = inputContexts.find(context => context.name.endsWith('/contexts/gpu_details_context'));
        if (gpuContext && gpuContext.parameters && gpuContext.parameters['gpu-model']) {
            const contextGpuModelRaw = gpuContext.parameters['gpu-model'];
            const lowerCaseContextRaw = contextGpuModelRaw.toLowerCase().trim();
            gpuModelKey = gpuModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!gpuModelRaw) { gpuModelRaw = contextGpuModelRaw; }
            console.log('   [GPU Handler] Retrieved gpu-model from context:', gpuModelKey);
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that Graphics Card model.';
    let outputContexts = [];

    const gpu = gpuDatabase[gpuModelKey];

    if (gpu) {
        if (requestedDetail && gpu[requestedDetail]) {
            fulfillmentText = `For the ${gpu.name}, the ${requestedDetail} is: ${gpu[requestedDetail]}.`;
            console.log(`   [GPU Handler] Responding with specific detail: ${requestedDetail}`);
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${gpu.name}.`;
            console.log(`   [GPU Handler] Requested detail "${requestedDetail}" not found for ${gpu.name}.`);
        } else {
            let response = `The ${gpu.name} has ${gpu.vram} VRAM, a boost clock of ${gpu.clockSpeed}, and consumes approximately ${gpu.powerConsumption}. `;
            response += `It uses a ${gpu.slotType} slot. Compatibility: ${gpu.compatibility}`;
            fulfillmentText = response;
            console.log('   [GPU Handler] Responding with general info.');
        }

        if (gpuModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/gpu_details_context`,
                lifespanCount: 5,
                parameters: {
                    'gpu-model': gpuModelRaw
                }
            });
            console.log('   [GPU Handler] Set output context: gpu_details_context');
        } else {
            console.warn('   [GPU Handler] WARNING: gpuModelRaw was empty, could not set gpu_details_context.');
        }
    } else {
        console.log(`   [GPU Handler] GPU model "${gpuModelRaw}" (key: "${gpuModelKey}") not found in database.`);
    }

    console.log('   [GPU Handler] Fulfillment Text:', fulfillmentText);
    console.log('   [GPU Handler] Output Contexts:', outputContexts);
    return { fulfillmentText, outputContexts };
}

module.exports = { handleGPUIntent };

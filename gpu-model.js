// GPU database
const gpuDatabase = {
    "gigabyte rtx 3050 eagle oc": {
        name: "Gigabyte RTX 3050 EAGLE OC",
        vram: "8GB GDDR6",
        clockSpeed: "~1777 MHz (Boost)",
        powerConsumption: "~130 Watts",
        slotType: "PCIe 4.0 x16",
        compatibility: "Requires a motherboard with an available PCIe x16 slot (compatible with PCIe 3.0/4.0/5.0). Needs a PSU with sufficient wattage (450W-550W recommended total system power) and at least one 8-pin PCIe power connector. Ensure your case has enough physical clearance."
    },
    // Add more GPU models here as you expand your database
    // Example for another GPU:
    // "msi rtx 4060 gaming x": {
    //     name: "MSI RTX 4060 GAMING X",
    //     vram: "8GB GDDR6",
    //     clockSpeed: "~2595 MHz (Boost)",
    //     powerConsumption: "~115 Watts",
    //     slotType: "PCIe 4.0 x8",
    //     compatibility: "Requires a motherboard with an available PCIe x16 slot. Needs a 550W+ PSU with one 8-pin PCIe power connector. Compatible with modern cases."
    // }
};

// GPU Model Variants (mapping user inputs to database keys)
const gpuModelMap = {
    "gigabyte rtx 3050 eagle oc": "gigabyte rtx 3050 eagle oc",
    "rtx 3050 eagle oc": "gigabyte rtx 3050 eagle oc",
    "gigabyte 3050": "gigabyte rtx 3050 eagle oc",
    "rtx 3050": "gigabyte rtx 3050 eagle oc",
    "3050 eagle oc": "gigabyte rtx 3050 eagle oc",
    "3050": "gigabyte rtx 3050 eagle oc", // Be careful with generic names if you have other 3050 variants
    // Add more synonyms for "Gigabyte RTX 3050 EAGLE OC" or other GPUs here
    // "msi rtx 4060 gaming x": "msi rtx 4060 gaming x",
    // "rtx 4060 gaming x": "msi rtx 4060 gaming x",
    // "msi 4060": "msi rtx 4060 gaming x",
    // "rtx 4060": "msi rtx 4060 gaming x"
};

/**
 * Handles Dialogflow intents related to GPU (Graphics Card) information.
 * @param {string} intent - The display name of the intent.
 * @param {object} parameters - The parameters extracted by Dialogflow.
 * @returns {string} The fulfillment text response.
 */
function handleGPUIntent(intent, parameters) {
    console.log('  [GPU Handler] Called for intent:', intent);
    console.log('  [GPU Handler] Received parameters:', parameters);

    // CRITICAL: Access the parameter using the exact name Dialogflow sends, which is 'gpu_model' (with an underscore)
    const gpuModelRaw = parameters["gpu-model"];

    if (!gpuModelRaw) {
        console.warn('  [GPU Handler] WARNING: "gpu_model" parameter is missing in the request.');
        return 'Please specify the Graphics Card model you are interested in (e.g., "Gigabyte RTX 3050 EAGLE OC").';
    }

    const modelKey = gpuModelMap[gpuModelRaw.toLowerCase().trim()];
    if (!modelKey) {
        console.warn(`  [GPU Handler] WARNING: No matching model key found in gpuModelMap for "${gpuModelRaw}".`);
        return `Sorry, I couldn't find detailed specifications for the Graphics Card model "${gpuModelRaw}".`;
    }

    const gpu = gpuDatabase[modelKey];
    if (!gpu) {
        console.error(`  [GPU Handler] ERROR: No GPU data found in gpuDatabase for key: "${modelKey}".`);
        return `Sorry, I couldn't find full specifications for "${gpuModelRaw}". The data might be missing or incorrect.`;
    }

    // Construct the detailed response
    let response = `The ${gpu.name} has ${gpu.vram} VRAM, a boost clock of ${gpu.clockSpeed}, and consumes approximately ${gpu.powerConsumption}. `;
    response += `It uses a ${gpu.slotType} slot. Compatibility: ${gpu.compatibility}`;

    console.log('  [GPU Handler] Generated response:', response);
    return response;
}

module.exports = { handleGPUIntent };

// RAM database
const ramDatabase = {
    "kingston fury beast ddr4": {
        name: "Kingston FURY Beast DDR4",
        capacity: "8GB, 16GB, or 32GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.35 V",
        compatibility: "Requires motherboard with DDR4 DIMM slots (288-pin) supporting 1.35V and 3200 MHz. Check motherboard QVL for compatibility."
    },
    "kingston hyperx fury ddr3": {
        name: "Kingston HyperX FURY DDR3",
        capacity: "8GB",
        type: "DDR3",
        speed: "1600 MHz",
        voltage: "1.5 V",
        compatibility: "For older systems only. Requires a DDR3 (240-pin) motherboard. Incompatible with modern DDR4/DDR5 systems."
    },
    "hkc pc ddr4-3200 dimm": {
        name: "HKC PC DDR4-3200 DIMM",
        capacity: "8GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.2 V",
        compatibility: "Works with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Recommend using matched pairs and checking motherboard QVL."
    },
    "hkcmemory hu40 ddr4 (16gb)": {
        name: "HKCMEMORY HU40 DDR4 (16GB)",
        capacity: "16GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.2 V",
        compatibility: "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Check QVL for higher capacity module compatibility."
    },
    "hkcmemory hu40 ddr4 (8gb)": {
        name: "HKCMEMORY HU40 DDR4 (8GB)",
        capacity: "8GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.2 V",
        compatibility: "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Matched pairs recommended for dual-channel. Always check motherboard QVL."
    }
};

// RAM Model Variants (mapping user inputs to database keys)
// You might want to expand this more fully as you have for CPU
const ramModelMap = {
    "kingston fury beast ddr4": "kingston fury beast ddr4",
    "fury beast ddr4": "kingston fury beast ddr4",
    "kingston hyperx fury ddr3": "kingston hyperx fury ddr3",
    "hyperx fury ddr3": "kingston hyperx fury ddr3",
    "hkc pc ddr4-3200 dimm": "hkc pc ddr4-3200 dimm",
    "hkcmemory hu40 ddr4 (16gb)": "hkcmemory hu40 ddr4 (16gb)",
    "hkcmemory hu40 ddr4 (8gb)": "hkcmemory hu40 ddr4 (8gb)",
    // Add more common user input variations here to map to your database keys
    "hkc 3200 dimm": "hkc pc ddr4-3200 dimm", // Example of a shorter variant
    "hu40 16gb": "hkcmemory hu40 ddr4 (16gb)",
    "hu40 8gb": "hkcmemory hu40 ddr4 (8gb)"
};


/**
 * Handles Dialogflow intents related to RAM information.
 * @param {string} intent - The display name of the intent.
 * @param {object} parameters - The parameters extracted by Dialogflow.
 * @returns {string} The fulfillment text response.
 */
function handleRAMIntent(intent, parameters) {
    console.log('  [RAM Handler] Called for intent:', intent);
    console.log('  [RAM Handler] Received parameters:', parameters);

    // CRITICAL: Access the parameter using the exact name Dialogflow sends (lowercase 'ram-model')
    const ramModelRaw = parameters["ram-model"];

    if (!ramModelRaw) {
        console.warn('  [RAM Handler] WARNING: "ram-model" parameter is missing in the request.');
        return 'Please specify the RAM model you are interested in (e.g., "Kingston FURY Beast DDR4").';
    }

    const modelKey = ramModelMap[ramModelRaw.toLowerCase().trim()];
    if (!modelKey) {
        console.warn(`  [RAM Handler] WARNING: No matching model key found in ramModelMap for "${ramModelRaw}".`);
        return `Sorry, I couldn't find detailed specifications for the RAM model "${ramModelRaw}".`;
    }

    const ram = ramDatabase[modelKey];
    if (!ram) {
        console.error(`  [RAM Handler] ERROR: No RAM data found in ramDatabase for key: "${modelKey}".`);
        return `Sorry, I couldn't find full specifications for "${ramModelRaw}". The data might be missing or incorrect.`;
    }

    // Construct the detailed response
    let response = `The ${ram.name} RAM comes in ${ram.capacity}, is a ${ram.type} type, runs at ${ram.speed}, and uses ${ram.voltage}. `;
    response += `Compatibility: ${ram.compatibility}`;

    console.log('  [RAM Handler] Generated response:', response);
    return response;
}

module.exports = { handleRAMIntent };

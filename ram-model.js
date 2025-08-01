// ram-model.js
const ramDatabase = {
    "kingston fury beast ddr4": {
        name: "Kingston FURY Beast DDR4",
        capacity: "8GB, 16GB, or 32GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.35 V",
        compatibility: "Requires motherboard with DDR4 DIMM slots (288-pin) supporting 1.35V and 3200 MHz. Check motherboard QVL (Qualified Vendor List) for guaranteed compatibility."
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

const ramModelMap = {
    "kingston fury beast ddr4": "kingston fury beast ddr4",
    "fury beast ddr4": "kingston fury beast ddr4",
    "kingston fury beast": "kingston fury beast ddr4",
    "beast ddr4": "kingston fury beast ddr4",
    "kingston hyperx fury ddr3": "kingston hyperx fury ddr3",
    "hyperx fury ddr3": "kingston hyperx fury ddr3",
    "hkc pc ddr4-3200 dimm": "hkc pc ddr4-3200 dimm",
    "hkc 3200 dimm": "hkc pc ddr4-3200 dimm",
    "hkcmemory hu40 ddr4 (16gb)": "hkcmemory hu40 ddr4 (16gb)",
    "hu40 16gb": "hkcmemory hu40 ddr4 (16gb)",
    "hkcmemory hu40 ddr4 (8gb)": "hkcmemory hu40 ddr4 (8gb)",
    "hu40 8gb": "hkcmemory hu40 ddr4 (8gb)"
};

function handleRAMIntent(parameters, inputContexts, projectId, sessionId) {
    console.log('   [RAM Handler] Called.');
    console.log('   [RAM Handler] Received parameters:', parameters);
    console.log('   [RAM Handler] Received inputContexts:', inputContexts);

    let ramModelRaw = parameters["ram-model"];
    const requestedDetail = parameters.requested_detail; // This can be undefined if not provided

    let ramModelKey;
    if (ramModelRaw) {
        const lowerCaseRaw = ramModelRaw.toLowerCase().trim();
        ramModelKey = ramModelMap[lowerCaseRaw] || lowerCaseRaw; // Use map, fallback to raw if no specific map entry
    }

    // Try to get ram-model from context if it's not provided in the current turn
    if (!ramModelKey && inputContexts && inputContexts.length > 0) {
        const ramContext = inputContexts.find(context => context.name.endsWith('/contexts/ram_details_context'));
        if (ramContext && ramContext.parameters && ramContext.parameters['ram-model']) {
            const contextRamModelRaw = ramContext.parameters['ram-model'];
            const lowerCaseContextRaw = contextRamModelRaw.toLowerCase().trim();
            ramModelKey = ramModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            // If ramModelRaw was empty in current turn, update it from context for context output
            if (!ramModelRaw) { ramModelRaw = contextRamModelRaw; } 
            console.log('   [RAM Handler] Retrieved ram-model from context:', ramModelKey);
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that RAM model.';
    let outputContexts = []; // Initialize to empty

    const ram = ramDatabase[ramModelKey];

    if (ram) {
        if (requestedDetail && ram[requestedDetail]) {
            fulfillmentText = `For ${ram.name}, the ${requestedDetail} is: ${ram[requestedDetail]}.`;
            console.log(`   [RAM Handler] Responding with specific detail: ${requestedDetail}`);
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${ram.name}.`;
            console.log(`   [RAM Handler] Requested detail "${requestedDetail}" not found for ${ram.name}.`);
        } else {
            // General info if no specific detail was requested
            fulfillmentText = `The ${ram.name} RAM comes in ${ram.capacity} capacities, is a ${ram.type} type, runs at ${ram.speed}, and uses ${ram.voltage}. Compatibility: ${ram.compatibility}`;
            console.log('   [RAM Handler] Responding with general info.');
        }

        // Always set the output context if a valid RAM model was found,
        // so subsequent questions can refer back to it.
        if (ramModelRaw) { // Ensure ramModelRaw is available before setting context
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/ram_details_context`,
                lifespanCount: 5, // Keep context active for 5 turns
                parameters: {
                    'ram-model': ramModelRaw // Store the original raw model name
                }
            });
            console.log('   [RAM Handler] Set output context: ram_details_context');
        } else {
            console.warn('   [RAM Handler] WARNING: ramModelRaw was empty, could not set ram_details_context.');
        }
    } else {
        console.log(`   [RAM Handler] RAM model "${ramModelRaw}" (key: "${ramModelKey}") not found in database.`);
    }
    
    console.log('   [RAM Handler] Fulfillment Text:', fulfillmentText);
    console.log('   [RAM Handler] Output Contexts:', outputContexts);
    return { fulfillmentText, outputContexts };
}

module.exports = { ramDatabase, ramModelMap, handleRAMIntent };

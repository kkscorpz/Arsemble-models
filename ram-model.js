// ram-model.js

// Database of RAM components with their details
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

// Map common user input variations to standard database keys
const ramModelMap = {
    "kingston fury beast ddr4": "kingston fury beast ddr4",
    "fury beast ddr4": "kingston fury beast ddr4",
    "kingston fury beast": "kingston fury beast ddr4",
    "beast ddr4": "kingston fury beast ddr4",
    "kingston hyperx fury ddr3": "kingston hyperx fury ddr3",
    "hyperx fury ddr3": "kingston hyperx fury ddr3",
    "hkc pc ddr4-3200 dimm": "hkc pc ddr4-3200 dimm",
    "hkc ddr4-3200": "hkc pc ddr4-3200 dimm",
    "hkc pc dimm": "hkc pc ddr4-3200 dimm",
    "ddr4-3200 dimm": "hkc pc ddr4-3200 dimm",
    "hkc 3200 dimm": "hkc pc ddr4-3200 dimm",
    "hkcmemory hu40 ddr4 (16gb)": "hkcmemory hu40 ddr4 (16gb)",
    "hu40 16gb": "hkcmemory hu40 ddr4 (16gb)",
    "hkcmemory hu40 ddr4 (8gb)": "hkcmemory hu40 ddr4 (8gb)",
    "hu40 8gb": "hkcmemory hu40 ddr4 (8gb)"
};

/**
 * Handles Dialogflow intents for RAM information.
 * Manages contexts for follow-up questions.
 * @param {object} parameters - Dialogflow extracted parameters.
 * @param {Array} inputContexts - Active contexts from Dialogflow.
 * @param {string} projectId - Google Cloud Project ID.
 * @param {string} sessionId - Dialogflow session ID.
 * @returns {object} An object with `fulfillmentText` and `outputContexts`.
 */
function handleRAMIntent(parameters, inputContexts, projectId, sessionId) {
    let ramModelRaw = parameters["ram-model"];

    // Handle requested_detail parameter, which can sometimes come as an array
    let requestedDetail = parameters.requested_detail;
    if (Array.isArray(requestedDetail) && requestedDetail.length > 0) {
        requestedDetail = requestedDetail[0]; // Take the first element if it's an array
    }
    // Convert to lowercase to match database keys
    if (typeof requestedDetail === 'string') {
        requestedDetail = requestedDetail.toLowerCase();
    }

    let ramModelKey;
    // Prioritize ram-model from current intent parameters
    if (ramModelRaw) {
        // Ensure ramModelRaw is a string if it comes as an array, then convert to lowercase
        if (Array.isArray(ramModelRaw) && ramModelRaw.length > 0) {
            ramModelRaw = ramModelRaw[0];
        }
        const lowerCaseRaw = String(ramModelRaw).toLowerCase().trim(); // Ensure string conversion
        ramModelKey = ramModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // If ram-model not in current parameters, check the 'ram_details_context'
    if (!ramModelKey && inputContexts && inputContexts.length > 0) {
        const ramContext = inputContexts.find(context => context.name.endsWith('/contexts/ram_details_context'));
        if (ramContext && ramContext.parameters && ramContext.parameters['ram-model']) {
            let contextRamModelRaw = ramContext.parameters['ram-model'];
            // Ensure contextRamModelRaw is a string if it comes as an array
            if (Array.isArray(contextRamModelRaw) && contextRamModelRaw.length > 0) {
                contextRamModelRaw = contextRamModelRaw[0];
            }
            const lowerCaseContextRaw = String(contextRamModelRaw).toLowerCase().trim();
            ramModelKey = ramModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!ramModelRaw) { // Set ramModelRaw if it came from context for output context
                ramModelRaw = contextRamModelRaw;
            }
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that RAM model.';
    let outputContexts = [];

    // Ensure the ramModelKey is consistently used for lookup
    const ram = ramDatabase[ramModelKey];

    // --- DEBUGGING LOGS (keep these for testing, they are very helpful!) ---
    console.log('--- handleRAMIntent Debug ---');
    console.log('Parameters received from Dialogflow:', parameters);
    console.log('ramModelRaw (initial):', parameters["ram-model"]);
    console.log('requestedDetail (initial):', parameters.requested_detail);
    console.log('ramModelRaw (processed):', ramModelRaw);
    console.log('requestedDetail (processed):', requestedDetail);
    console.log('ramModelKey (used for database lookup):', ramModelKey);
    console.log('ram object found in database:', ram);
    if (ram) {
        console.log(`Value for ram[${requestedDetail}]:`, ram[requestedDetail]);
    }
    console.log('--- End Debug ---');
    // --- END DEBUGGING LOGS ---


    if (ram) { // RAM data found
        if (requestedDetail && ram[requestedDetail]) {
            // Updated to match "The ${ramModel} has a capacity of ${specificRam.capacity}." format
            // Uses a switch for more flexible phrasing based on attribute
            switch (requestedDetail) {
                case "capacity":
                    fulfillmentText = `The ${ram.name} has a capacity of ${ram.capacity}.`;
                    break;
                case "type":
                    fulfillmentText = `The ${ram.name} is a ${ram.type} RAM module.`;
                    break;
                case "speed":
                    fulfillmentText = `The ${ram.name} runs at ${ram.speed}.`;
                    break;
                case "voltage":
                    fulfillmentText = `The ${ram.name} uses ${ram.voltage} of voltage.`;
                    break;
                case "compatibility":
                    fulfillmentText = `Regarding compatibility for ${ram.name}: ${ram.compatibility}`;
                    break;
                default:
                    fulfillmentText = `For ${ram.name}, the ${requestedDetail} is: ${ram[requestedDetail]}.`;
                    break;
            }
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${ram.name}.`;
        } else {
            // General details if no specific detail was requested
            fulfillmentText = `The ${ram.name} RAM comes in ${ram.capacity} capacities, is a ${ram.type} type, runs at ${ram.speed}, and uses ${ram.voltage}. Compatibility: ${ram.compatibility}`;
        }

        // Set 'ram_details_context' to remember the current RAM model for follow-up questions
        // Only set context if a RAM model was identified successfully
        if (ramModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/ram_details_context`,
                lifespanCount: 5, // Lifespan of the context
                parameters: {
                    'ram-model': ramModelRaw // Store the identified RAM model (original format)
                }
            });
        }
    } else {
        // Fallback if no RAM model was found or identified
        fulfillmentText = `Sorry, I couldn't find details for "${ramModelRaw || 'that RAM model'}". Please ensure the name is correct or try another RAM model.`;
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { ramDatabase, ramModelMap, handleRAMIntent };

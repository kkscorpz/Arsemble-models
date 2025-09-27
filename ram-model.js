// ================== RAM HANDLER ==================

// RAM Database
const ramDatabase = {
    "kingston fury beast ddr4": {
        name: "Kingston FURY Beast DDR4",
        capacity: "8GB, 16GB, or 32GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.35 V",
        compatibility: "Requires motherboard with DDR4 DIMM slots (288-pin) supporting 1.35V and 3200 MHz. Check motherboard QVL for guaranteed compatibility.",
        price: "₱2,000"
    },
    "kingston hyperx fury ddr3": {
        name: "Kingston HyperX FURY DDR3",
        capacity: "8GB",
        type: "DDR3",
        speed: "1600 MHz",
        voltage: "1.5 V",
        compatibility: "For older systems only. Requires a DDR3 (240-pin) motherboard. Incompatible with modern DDR4/DDR5 systems.",
        price: "₱1,200"
    },
    "hkc pc ddr4-3200 dimm": {
        name: "HKC PC DDR4-3200 DIMM",
        capacity: "8GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.2 V",
        compatibility: "Works with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Recommend using matched pairs and checking motherboard QVL.",
        price: "₱1,800"
    },
    "hkcmemory hu40 ddr4 (16gb)": {
        name: "HKCMEMORY HU40 DDR4 (16GB)",
        capacity: "16GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.2 V",
        compatibility: "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Check QVL for higher capacity module compatibility.",
        price: "₱3,500"
    }
};

// RAM Model Variants (mapping user inputs to database keys)
const ramModelMap = {
    // Kingston Fury Beast DDR4
    "kingston fury beast ddr4": "kingston fury beast ddr4",
    "fury beast ddr4": "kingston fury beast ddr4",
    "kingston beast ddr4": "kingston fury beast ddr4",

    // Kingston HyperX Fury DDR3
    "kingston hyperx fury ddr3": "kingston hyperx fury ddr3",
    "hyperx fury ddr3": "kingston hyperx fury ddr3",
    "kingston fury ddr3": "kingston hyperx fury ddr3",

    // HKC PC DDR4-3200 DIMM
    "hkc pc ddr4-3200 dimm": "hkc pc ddr4-3200 dimm",
    "hkc ddr4-3200": "hkc pc ddr4-3200 dimm",
    "hkc pc ddr4": "hkc pc ddr4-3200 dimm",

    // HKCMemory HU40 DDR4 16GB
    "hkcmemory hu40 ddr4 (16gb)": "hkcmemory hu40 ddr4 (16gb)",
    "hu40 ddr4 16gb": "hkcmemory hu40 ddr4 (16gb)",
    "hkc hu40 ddr4": "hkcmemory hu40 ddr4 (16gb)"
};

/**
 * Handles Dialogflow intents related to RAM information.
 * @param {object} parameters - The parameters extracted by Dialogflow, including 'ram-model' and 'ram-detail'.
 * @param {array} inputContexts - The input contexts from Dialogflow request.
 * @param {string} projectId - The Dialogflow project ID.
 * @param {string} sessionId - The Dialogflow session ID.
 * @returns {object} An object containing fulfillmentText and outputContexts.
 */
function handleRAMIntent(parameters, inputContexts, projectId, sessionId) {
    console.log("[RAM Handler] Called.", parameters);

    let ramModelRaw = parameters["ram-model"];
    const requestedDetail = parameters["ram-detail"];

    let ramModelKey;
    if (ramModelRaw) {
        const lowerCaseRaw = ramModelRaw.toLowerCase().trim();
        ramModelKey = ramModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Retrieve model from context if missing
    if (!ramModelKey && inputContexts?.length > 0) {
        const ramContext = inputContexts.find(ctx => ctx.name.endsWith("/contexts/ram_details_context"));
        if (ramContext?.parameters?.["ram-model"]) {
            const contextModelRaw = ramContext.parameters["ram-model"];
            const lowerCaseContextRaw = contextModelRaw.toLowerCase().trim();
            ramModelKey = ramModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!ramModelRaw) ramModelRaw = contextModelRaw;
        }
    }

    let fulfillmentText = "Sorry, I couldn’t find details for that RAM.";
    let outputContexts = [];
    const ram = ramDatabase[ramModelKey];

    if (ram) {
        if (requestedDetail) {
            const detailValue = ram[requestedDetail];
            if (detailValue !== undefined) {
                fulfillmentText = `For the ${ram.name}, the ${requestedDetail} is: ${detailValue}.`;
            } else {
                fulfillmentText = `Sorry, I don't have info about the ${requestedDetail} for ${ram.name}.`;
            }
        } else {
            fulfillmentText = `The ${ram.name} is a ${ram.capacity} ${ram.type} RAM running at ${ram.speed}, with a voltage of ${ram.voltage}. Compatibility: ${ram.compatibility}. Price: ${ram.price}.`;
        }

        if (ramModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/ram_details_context`,
                lifespanCount: 5,
                parameters: {
                    "ram-model": ramModelRaw,
                    "ram-detail": requestedDetail || null
                }
            });
        }
    }

    console.log("[RAM Handler] Fulfillment Text:", fulfillmentText);
    console.log("[RAM Handler] Output Contexts:", outputContexts);

    return { fulfillmentText, outputContexts };
}

module.exports = { handleRAMIntent };

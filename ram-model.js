// ram-model.js
const ramDatabase = {
    "kingston fury beast ddr4": {
        name: "Kingston FURY Beast DDR4",
        capacity: "8GB, 16GB, or 32GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.35 V",
        compatibility: "Requires motherboard with DDR4 DIMM slots (288-pin) supporting 1.35V and 3200 MHz. Check motherboard QVL (Qualified Vendor List) for guaranteed compatibility.",
        price: "₱2,000" // Added price
    },
    "kingston hyperx fury ddr3": {
        name: "Kingston HyperX FURY DDR3",
        capacity: "8GB",
        type: "DDR3",
        speed: "1600 MHz",
        voltage: "1.5 V",
        compatibility: "For older systems only. Requires a DDR3 (240-pin) motherboard. Incompatible with modern DDR4/DDR5 systems.",
        price: "₱1,200" // Added price
    },
    "hkc pc ddr4-3200 dimm": {
        name: "HKC PC DDR4-3200 DIMM",
        capacity: "8GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.2 V",
        compatibility: "Works with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Recommend using matched pairs and checking motherboard QVL.",
        price: "₱1,800" // Added price
    },
    "hkcmemory hu40 ddr4 (16gb)": {
        name: "HKCMEMORY HU40 DDR4 (16GB)",
        capacity: "16GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.2 V",
        compatibility: "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Check QVL for higher capacity module compatibility.",
        price: "₱3,500" // Added price
    },
    "hkcmemory hu40 ddr4 (8gb)": {
        name: "HKCMEMORY HU40 DDR4 (8GB)",
        capacity: "8GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.2 V",
        compatibility: "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Matched pairs recommended for dual-channel. Always check motherboard QVL.",
        price: "₱1,600" // Added price
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
    let ramModelRaw = parameters["Ram-model"];
    const requestedDetail = parameters.requested_detail;

    let ramModelKey;
    if (ramModelRaw) {
        const lowerCaseRaw = ramModelRaw.toLowerCase().trim();
        ramModelKey = ramModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    if (!ramModelKey && inputContexts && inputContexts.length > 0) {
        const ramContext = inputContexts.find(context => context.name.endsWith('/contexts/ram_details_context'));
        if (ramContext && ramContext.parameters && ramContext.parameters['ram-model']) {
            const contextRamModelRaw = ramContext.parameters['ram-model'];
            const lowerCaseContextRaw = contextRamModelRaw.toLowerCase().trim();
            ramModelKey = ramModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!ramModelRaw) { ramModelRaw = contextRamModelRaw; }
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that RAM model.';
    let outputContexts = [];

    const ram = ramDatabase[ramModelKey];

    if (ram) {
        if (requestedDetail) {
            let detailValue = ram[requestedDetail];
            if (detailValue !== undefined) {
                 fulfillmentText = `For ${ram.name}, the ${requestedDetail} is: ${detailValue}.`;
            } else {
                 fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${ram.name}.`;
            }
        } else {
            fulfillmentText = `The ${ram.name} RAM comes in ${ram.capacity} capacities, is a ${ram.type} type, runs at ${ram.speed}, uses ${ram.voltage}, and costs around ${ram.price}. Compatibility: ${ram.compatibility}`;
        }

        if (ramModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/ram_details_context`,
                lifespanCount: 5,
                parameters: {
                    'ram-model': ramModelRaw
                }
            });
        }
    }
    return { fulfillmentText, outputContexts };
}

module.exports = { ramDatabase, ramModelMap, handleRAMIntent };

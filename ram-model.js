// ram-model.js
// RAM Database
const ramDatabase = {
    "kingston fury beast ddr4": {
        name: "Kingston FURY Beast DDR4",
        capacity: "8GB, 16GB, or 32GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.35 V",
        compatibility: "Requires motherboard with DDR4 DIMM slots (288-pin) supporting 1.35V and 3200 MHz. Check motherboard QVL (Qualified Vendor List) for guaranteed compatibility.",
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
    },
    "hkcmemory hu40 ddr4 (8gb)": {
        name: "HKCMEMORY HU40 DDR4 (8GB)",
        capacity: "8GB",
        type: "DDR4",
        speed: "3200 MHz",
        voltage: "1.2 V",
        compatibility: "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz.",
        price: "₱1,700"
    }
};

// RAM Model Variants (mapping user inputs to database keys)
const ramModelMap = {
    "kingston fury beast ddr4": "kingston fury beast ddr4",
    "fury beast ddr4": "kingston fury beast ddr4",
    "kingston beast ddr4": "kingston fury beast ddr4",
    "kingston fury beast": "kingston fury beast ddr4",
    "fury beast": "kingston fury beast ddr4",

    "kingston hyperx fury ddr3": "kingston hyperx fury ddr3",
    "hyperx fury ddr3": "kingston hyperx fury ddr3",
    "kingston fury ddr3": "kingston hyperx fury ddr3",
    "hyperx fury": "kingston hyperx fury ddr3",

    "hkc pc ddr4-3200 dimm": "hkc pc ddr4-3200 dimm",
    "hkc ddr4-3200": "hkc pc ddr4-3200 dimm",
    "hkc pc ddr4": "hkc pc ddr4-3200 dimm",
    "hkc 3200 dimm": "hkc pc ddr4-3200 dimm",

    "hkcmemory hu40 ddr4 (16gb)": "hkcmemory hu40 ddr4 (16gb)",
    "hu40 ddr4 16gb": "hkcmemory hu40 ddr4 (16gb)",
    "hkc hu40 ddr4": "hkcmemory hu40 ddr4 (16gb)",
    "hu40 16gb": "hkcmemory hu40 ddr4 (16gb)",
    "hkcmemory hu40": "hkcmemory hu40 ddr4 (16gb)",
    "hu40": "hkcmemory hu40 ddr4 (16gb)",

    "hkcmemory hu40 ddr4 (8gb)": "hkcmemory hu40 ddr4 (8gb)",
    "hu40 ddr4 8gb": "hkcmemory hu40 ddr4 (8gb)",
    "hu40 8gb": "hkcmemory hu40 ddr4 (8gb)"
};

// map of common detail-name synonyms -> database key
const detailKeyMap = {
    "speed": "speed",
    "frequency": "speed",
    "clock": "speed",
    "type": "type",
    "ram type": "type",
    "capacity": "capacity",
    "size": "capacity",
    "voltage": "voltage",
    "compatibility": "compatibility",
    "price": "price",
    "cost": "price"
};

// helper to get parameter from several possible names and handle arrays
function getParam(parameters, ...names) {
    for (const n of names) {
        if (parameters[n] !== undefined) {
            const v = parameters[n];
            return Array.isArray(v) ? v[0] : v;
        }
    }
    return undefined;
}

/**
 * Handles Dialogflow intents related to RAM information.
 * Returns { fulfillmentText, outputContexts } to be used by index.js webhook.
 */
function handleRAMIntent(parameters = {}, inputContexts = [], projectId = "proj", sessionId = "sess") {
    console.log("🟢 [RAM Handler] Called.", { parameters });

    // accept multiple parameter name variants (Dialogflow sometimes uses different casings)
    let ramModelRaw = getParam(parameters, "Ram-model", "ram-model", "ramModel");
    let requestedDetailRaw = getParam(parameters, "Ram-detail-type", "ram-detail-type", "ramDetail");

    if (Array.isArray(ramModelRaw)) ramModelRaw = ramModelRaw[0];
    if (Array.isArray(requestedDetailRaw)) requestedDetailRaw = requestedDetailRaw[0];

    console.log("   [RAM Handler] Model (raw):", ramModelRaw);
    console.log("   [RAM Handler] Requested Detail (raw):", requestedDetailRaw);

    let ramModelKey;
    if (ramModelRaw) {
        const lowerCaseRaw = ramModelRaw.toString().toLowerCase().trim();
        ramModelKey = ramModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // fallback to context if model missing
    if (!ramModelKey && inputContexts && inputContexts.length > 0) {
        const ramContext = inputContexts.find(ctx => ctx.name && ctx.name.endsWith('/contexts/ram_details_context'));
        if (ramContext && ramContext.parameters) {
            const ctxModel = getParam(ramContext.parameters, "Ram-model", "ram-model");
            if (ctxModel) {
                const lower = ctxModel.toString().toLowerCase().trim();
                ramModelKey = ramModelMap[lower] || lower;
                if (!ramModelRaw) ramModelRaw = ctxModel;
                console.log("   [RAM Handler] Retrieved model from context:", ramModelKey);
            }
        }
    }

    const ram = ramDatabase[ramModelKey];
    let fulfillmentText = "Sorry, I couldn't find details for that RAM model.";
    let outputContexts = [];

    if (ram) {
        // Normalize requested detail
        let requestedKey = null;
        if (requestedDetailRaw) {
            const raw = requestedDetailRaw.toString().toLowerCase().trim();
            // try exact mapping first (synonyms)
            requestedKey = detailKeyMap[raw];
            // if not found, try fuzzy: remove spaces and match against ram keys
            if (!requestedKey) {
                const norm = raw.replace(/\s+/g, "");
                const found = Object.keys(ram).find(k => k.toLowerCase().replace(/\s+/g, "").includes(norm));
                if (found) requestedKey = found;
            }
        }

        if (requestedKey && ram[requestedKey] !== undefined) {
            // Respond with the specific detail ONLY
            fulfillmentText = `For the ${ram.name}, the ${requestedDetailRaw} is: ${ram[requestedKey]}.`;
            console.log("   [RAM Handler] Specific detail response:", requestedKey, ram[requestedKey]);
        } else if (requestedDetailRaw) {
            fulfillmentText = `Sorry, I don't have information about "${requestedDetailRaw}" for ${ram.name}.`;
            console.log(`   [RAM Handler] Requested detail "${requestedDetailRaw}" not found for ${ram.name}.`);
        } else {
            // General info
            fulfillmentText = `The ${ram.name} is a ${ram.type} RAM module. `;
            fulfillmentText += `It has ${ram.capacity} capacity options, running at ${ram.speed}. `;
            fulfillmentText += `Voltage: ${ram.voltage}. `;
            fulfillmentText += `The estimated price is ${ram.price}. `;
            fulfillmentText += `Compatibility: ${ram.compatibility}`;
            console.log("   [RAM Handler] General info response.");
        }

        // set output context so follow-ups can omit the model
        const base = inputContexts[0]?.name ? inputContexts[0].name.split('/contexts/')[0] : `projects/${projectId}/agent/sessions/${sessionId}`;
        outputContexts.push({
            name: `${base}/contexts/ram_details_context`,
            lifespanCount: 5,
            parameters: { "Ram-model": ramModelRaw }
        });
    } else {
        console.log("   [RAM Handler] RAM model key not found:", ramModelKey);
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { handleRAMIntent };

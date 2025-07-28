// psu-model.js
// PSU database
const psuDatabase = {
    "corsair rm850x": {
        name: "Corsair RM850x",
        wattage: "850W",
        efficiency_rating: "80 Plus Gold", // Changed to underscore
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Suitable for most high-performance gaming PCs, especially with RTX 30-series/40-series or RX 6000/7000 series GPUs. Its modularity helps with cable management. Ensure your case has enough space for an ATX PSU."
    },
    "cooler master mwe white 750w": {
        name: "Cooler Master MWE White 750W",
        wattage: "750W",
        efficiency_rating: "80 Plus White",
        modularity: "Non-Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Suitable for most mid-range gaming PCs with single-GPU setups. Its non-modular design means all cables are fixed, so ensure good cable management in your case. Verify it has sufficient PCIe power connectors for your chosen GPU."
    },
    "corsair cx650": {
        name: "Corsair CX650",
        wattage: "650W",
        efficiency_rating: "80 Plus Bronze",
        modularity: "Non-Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Sufficient for many builds using CPUs like Ryzen 5/Intel i5 and GPUs like RTX 3050/3060 or RX 6600/6700. Like other non-modular PSUs, plan for cable management. Ensure required PCIe power connectors for your GPU."
    },
    "cougar gx-f 750w": {
        name: "Cougar GX-F 750W",
        wattage: "750W",
        efficiency_rating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "A good choice for mid to high-end systems. Its fully modular design simplifies cable management, reducing clutter in your PC build. Ensure it has enough PCIe connectors for your GPU."
    },
    "seasonic focus plus gold 550w": {
        name: "Seasonic Focus Plus Gold 550W",
        wattage: "550W",
        efficiency_rating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Ideal for entry-level to mid-range builds with less power-hungry GPUs (e.g., RTX 3050/3060, RX 6600). Its fully modular design is great for clean builds. Always check your GPU's minimum recommended PSU wattage."
    }
};

// PSU Model Variants (mapping user inputs to database keys)
const psuModelMap = {
    "corsair rm850x": "corsair rm850x",
    "rm850x": "corsair rm850x",
    "corsair 850w psu": "corsair rm850x",
    "850w rm850x": "corsair rm850x",
    "rm850x psu": "corsair rm850x",

    "cooler master mwe white 750w": "cooler master mwe white 750w",
    "mwe white 750w": "cooler master mwe white 750w",
    "cooler master 750w psu": "cooler master mwe white 750w",
    "750w mwe white": "cooler master mwe white 750w",
    "mwe white psu": "cooler master mwe white 750w",

    "corsair cx650": "corsair cx650",
    "cx650": "corsair cx650",
    "corsair 650w psu": "corsair cx650",
    "650w cx650": "corsair cx650",
    "cx650 psu": "corsair cx650",

    "cougar gx-f 750w": "cougar gx-f 750w",
    "gx-f 750w": "cougar gx-f 750w",
    "cougar 750w psu": "cougar gx-f 750w",
    "750w gx-f": "cougar gx-f 750w",
    "gx-f psu": "cougar gx-f 750w",

    "seasonic focus plus gold 550w": "seasonic focus plus gold 550w",
    "focus plus gold 550w": "seasonic focus plus gold 550w",
    "seasonic 550w psu": "seasonic focus plus gold 550w",
    "550w focus plus": "seasonic focus plus gold 550w",
    "focus plus psu": "seasonic focus plus gold 550w"
};

/**
 * Handles Dialogflow intents related to PSU (Power Supply Unit) information.
 * @param {object} parameters - Dialogflow extracted parameters.
 * @param {Array} inputContexts - Active contexts from Dialogflow.
 * @param {string} projectId - Google Cloud Project ID.
 * @param {string} sessionId - Dialogflow session ID.
 * @returns {object} An object with `fulfillmentText` and `outputContexts`.
 */
function handlePSUIntent(parameters, inputContexts, projectId, sessionId) {
    let psuModelRaw = parameters["psu-model"]; // Assuming Dialogflow parameter for PSU model

    // Assuming Dialogflow parameter for detail type is 'psu-detail-type'
    let requestedDetail = parameters["psu_detail_type"];
    if (Array.isArray(requestedDetail) && requestedDetail.length > 0) {
        requestedDetail = requestedDetail[0];
    }
    if (typeof requestedDetail === 'string') {
        requestedDetail = requestedDetail.toLowerCase().replace(/[\s-]/g, '_');
    }

    let modelKey;
    if (psuModelRaw) {
        if (Array.isArray(psuModelRaw) && psuModelRaw.length > 0) {
            psuModelRaw = psuModelRaw[0];
        }
        const lowerCaseRaw = String(psuModelRaw).toLowerCase().trim();
        modelKey = psuModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Check 'psu_details_context' for follow-up questions
    if (!modelKey && inputContexts && inputContexts.length > 0) {
        const psuContext = inputContexts.find(context => context.name.endsWith('/contexts/psu_details_context'));
        if (psuContext && psuContext.parameters && psuContext.parameters['psu-model']) {
            let contextPsuModelRaw = psuContext.parameters['psu-model'];
            if (Array.isArray(contextPsuModelRaw) && contextPsuModelRaw.length > 0) {
                contextPsuModelRaw = contextPsuModelRaw[0];
            }
            const lowerCaseContextRaw = String(contextPsuModelRaw).toLowerCase().trim();
            modelKey = psuModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!psuModelRaw) {
                psuModelRaw = contextPsuModelRaw;
            }
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that PSU model.';
    let outputContexts = [];

    const psu = psuDatabase[modelKey];

    // --- DEBUGGING LOGS ---
    console.log('--- handlePSUIntent Debug ---');
    console.log('Parameters received from Dialogflow:', parameters);
    console.log('psuModelRaw (processed):', psuModelRaw);
    console.log('requestedDetail (processed):', requestedDetail);
    console.log('modelKey (used for database lookup):', modelKey);
    console.log('PSU object found in database:', psu);
    if (psu && requestedDetail) {
        console.log(`Value for psu[${requestedDetail}]:`, psu[requestedDetail]);
    }
    console.log('--- End Debug ---');
    // --- END DEBUGGING LOGS ---

    if (psu) {
        if (requestedDetail && psu[requestedDetail]) {
            // Specific attribute response
            switch (requestedDetail) {
                case "name":
                    fulfillmentText = `The name of the PSU is ${psu.name}.`;
                    break;
                case "wattage":
                    fulfillmentText = `The ${psu.name} has a wattage of ${psu.wattage}.`;
                    break;
                case "efficiency_rating":
                    fulfillmentText = `The ${psu.name} has an efficiency rating of ${psu.efficiency_rating}.`;
                    break;
                case "modularity":
                    fulfillmentText = `The ${psu.name} is a ${psu.modularity} power supply.`;
                    break;
                case "cables":
                    fulfillmentText = `The ${psu.name} typically includes cables for ${psu.cables}.`;
                    break;
                case "compatibility":
                    fulfillmentText = `Regarding compatibility for ${psu.name}: ${psu.compatibility}`;
                    break;
                default:
                    fulfillmentText = `For ${psu.name}, the ${requestedDetail.replace(/_/g, ' ')} is: ${psu[requestedDetail]}.`;
                    break;
            }
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail.replace(/_/g, ' ')} for ${psu.name}.`;
        } else {
            // General details
            let response = `The ${psu.name} is a ${psu.wattage}, ${psu.efficiency_rating} certified, ${psu.modularity} power supply. `;
            response += `It typically includes cables for ${psu.cables}. `;
            response += `Compatibility: ${psu.compatibility}`;
            fulfillmentText = response;
        }

        // Set 'psu_details_context'
        if (psuModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/psu_details_context`,
                lifespanCount: 5,
                parameters: {
                    'psu-model': psuModelRaw
                }
            });
        }
    } else {
        fulfillmentText = `Sorry, I couldn't find details for "${psuModelRaw || 'that PSU model'}". Please ensure the name is correct or try another model.`;
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { psuDatabase, psuModelMap, handlePSUIntent };

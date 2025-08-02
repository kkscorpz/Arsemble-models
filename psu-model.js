// psu.js
const psuDatabase = {
    "corsair rm850x": {
        name: "Corsair RM850x",
        wattage: "850W",
        efficiencyRating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Suitable for most high-performance gaming PCs, especially with RTX 30-series/40-series or RX 6000/7000 series GPUs. Its modularity helps with cable management. Ensure your case has enough space for an ATX PSU."
    },
    "cooler master mwe white 750w": {
        name: "Cooler Master MWE White 750W",
        wattage: "750W",
        efficiencyRating: "80 Plus White",
        modularity: "Non-Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Suitable for most mid-range gaming PCs with single-GPU setups. Its non-modular design means all cables are fixed, so ensure good cable management in your case. Verify it has sufficient PCIe power connectors for your chosen GPU."
    },
    "corsair cx650": {
        name: "Corsair CX650",
        wattage: "650W",
        efficiencyRating: "80 Plus Bronze",
        modularity: "Non-Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Sufficient for many builds using CPUs like Ryzen 5/Intel i5 and GPUs like RTX 3050/3060 or RX 6600/6700. Like other non-modular PSUs, plan for cable management. Ensure required PCIe power connectors for your GPU."
    },
    "cougar gx-f 750w": {
        name: "Cougar GX-F 750W",
        wattage: "750W",
        efficiencyRating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "A good choice for mid to high-end systems. Its fully modular design simplifies cable management, reducing clutter in your PC build. Ensure it has enough PCIe connectors for your GPU."
    },
    "seasonic focus plus gold 550w": {
        name: "Seasonic Focus Plus Gold 550W",
        wattage: "550W",
        efficiencyRating: "80 Plus Gold",
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
 * @param {object} parameters - The parameters extracted by Dialogflow, including 'psu-model' and 'psu-detail'.
 * @param {array} inputContexts - The input contexts from Dialogflow request.
 * @param {string} projectId - The Dialogflow project ID.
 * @param {string} sessionId - The Dialogflow session ID.
 * @returns {object} An object containing fulfillmentText and outputContexts.
 */
function handlePSUIntent(parameters, inputContexts, projectId, sessionId) {
    console.log('    [PSU Handler] Called.');
    console.log('    [PSU Handler] Received parameters:', parameters);
    console.log('    [PSU Handler] Received inputContexts:', inputContexts);

    let psuModelRaw = parameters["psu-model"]; // Expecting 'psu-model' from Dialogflow
    const requestedDetail = parameters["psu-detail"]; // Expecting 'psu-detail' for specific requests

    let psuModelKey;
    if (psuModelRaw) {
        const lowerCaseRaw = psuModelRaw.toLowerCase().trim();
        psuModelKey = psuModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Try to get psu-model from context if not provided in current turn
    if (!psuModelKey && inputContexts && inputContexts.length > 0) {
        const psuContext = inputContexts.find(context => context.name.endsWith('/contexts/psu_details_context'));
        if (psuContext && psuContext.parameters && psuContext.parameters['psu-model']) {
            const contextPsuModelRaw = psuContext.parameters['psu-model'];
            const lowerCaseContextRaw = contextPsuModelRaw.toLowerCase().trim();
            psuModelKey = psuModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!psuModelRaw) { psuModelRaw = contextPsuModelRaw; } // Update raw if it was empty
            console.log('    [PSU Handler] Retrieved psu-model from context:', psuModelKey);
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that Power Supply Unit model.';
    let outputContexts = [];

    const psu = psuDatabase[psuModelKey];

    if (psu) {
        // Handle specific detail request
        if (requestedDetail && psu[requestedDetail]) {
            fulfillmentText = `For the ${psu.name}, the ${requestedDetail} is: ${psu[requestedDetail]}.`;
            console.log(`    [PSU Handler] Responding with specific detail: ${requestedDetail}`);
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${psu.name}.`;
            console.log(`    [PSU Handler] Requested detail "${requestedDetail}" not found for ${psu.name}.`);
        } else {
            // General info if no specific detail was requested
            let response = `The ${psu.name} is a ${psu.wattage}, ${psu.efficiencyRating} certified, ${psu.modularity} power supply. `;
            response += `It typically includes cables for ${psu.cables}. `;
            response += `Compatibility: ${psu.compatibility}`;
            fulfillmentText = response;
            console.log('    [PSU Handler] Responding with general info.');
        }

        // Set the output context to remember the PSU model for follow-up questions
        if (psuModelRaw) { // Ensure model is available to store in context
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/psu_details_context`,
                lifespanCount: 5,
                parameters: {
                    'psu-model': psuModelRaw
                }
            });
            console.log('    [PSU Handler] Set output context: psu_details_context');
        } else {
            console.warn('    [PSU Handler] WARNING: psuModelRaw was empty, could not set psu_details_context.');
        }
    } else {
        console.log(`    [PSU Handler] PSU model "${psuModelRaw}" (key: "${psuModelKey}") not found in database.`);
    }

    console.log('    [PSU Handler] Fulfillment Text:', fulfillmentText);
    console.log('    [PSU Handler] Output Contexts:', outputContexts);
    return { fulfillmentText, outputContexts };
}

module.exports = { handlePSUIntent };

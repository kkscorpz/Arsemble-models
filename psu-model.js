// ================== PSU HANDLER ==================

// PSU Database
const psuDatabase = {
    "corsair rm850x": {
        name: "Corsair RM850x",
        wattage: "850W",
        efficiencyRating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Great for high-performance gaming PCs (RTX 30/40, RX 6000/7000).",
        price: "₱8,000"
    },
    "cooler master mwe white 750w": {
        name: "Cooler Master MWE White 750W",
        wattage: "750W",
        efficiencyRating: "80 Plus White",
        modularity: "Non-Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Best for mid-range PCs. Ensure your GPU’s PCIe connectors match. Non-modular = harder cable management.",
        price: "₱3,500"
    },
    "corsair cx650": {
        name: "Corsair CX650",
        wattage: "650W",
        efficiencyRating: "80 Plus Bronze",
        modularity: "Non-Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Good for Ryzen 5/i5 builds with GPUs like RTX 3050/3060 or RX 6600. Watch for cable clutter (non-modular).",
        price: "₱4,000"
    },
    "cougar gx-f 750w": {
        name: "Cougar GX-F 750W",
        wattage: "750W",
        efficiencyRating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Great for mid to high-end builds. Fully modular makes cable management easier.",
        price: "₱5,500"
    },
    "seasonic focus plus gold 550w": {
        name: "Seasonic Focus Plus Gold 550W",
        wattage: "550W",
        efficiencyRating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Ideal for entry-level to mid-range builds with RTX 3050/3060, RX 6600. Fully modular = neat builds.",
        price: "₱6,000"
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
    console.log("[PSU Handler] Called.", parameters);

    let psuModelRaw = parameters["psu-model"];
    const requestedDetail = parameters["psu-detail"];

    let psuModelKey;
    if (psuModelRaw) {
        const lowerCaseRaw = psuModelRaw.toLowerCase().trim();
        psuModelKey = psuModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Retrieve model from context if missing
    if (!psuModelKey && inputContexts?.length > 0) {
        const psuContext = inputContexts.find(ctx => ctx.name.endsWith("/contexts/psu_details_context"));
        if (psuContext?.parameters?.["psu-model"]) {
            const contextModelRaw = psuContext.parameters["psu-model"];
            const lowerCaseContextRaw = contextModelRaw.toLowerCase().trim();
            psuModelKey = psuModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!psuModelRaw) psuModelRaw = contextModelRaw;
        }
    }

    let fulfillmentText = "Sorry, I couldn’t find details for that PSU.";
    let outputContexts = [];
    const psu = psuDatabase[psuModelKey];

    if (psu) {
        if (requestedDetail) {
            const detailValue = psu[requestedDetail];
            if (detailValue !== undefined) {
                fulfillmentText = `For the ${psu.name}, the ${requestedDetail} is: ${detailValue}.`;
            } else {
                fulfillmentText = `Sorry, I don't have info about the ${requestedDetail} for ${psu.name}.`;
            }
        } else {
            fulfillmentText = `The ${psu.name} is a ${psu.wattage}, ${psu.efficiencyRating} certified, ${psu.modularity} PSU. It comes with ${psu.cables}. Compatibility: ${psu.compatibility}. Price: ${psu.price}.`;
        }

        if (psuModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/psu_details_context`,
                lifespanCount: 5,
                parameters: {
                    "psu-model": psuModelRaw,
                    "psu-detail": requestedDetail || null
                }
            });
        }
    }

    console.log("[PSU Handler] Fulfillment Text:", fulfillmentText);
    console.log("[PSU Handler] Output Contexts:", outputContexts);

    return { fulfillmentText, outputContexts };
}

module.exports = { handlePSUIntent };

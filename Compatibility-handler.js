// compatibility-handler.js

const motherboardDatabase = {
    "atx": {
        name: "ATX",
        description: "The standard size for motherboards. They are larger and often include more expansion slots, more RAM slots, and more connectivity options. ATX boards are typically used in mid-tower and full-tower PC cases.",
    },
    "matx": {
        name: "mATX (micro ATX)",
        description: "A more compact version of the ATX standard. They are physically smaller and fit into smaller PC cases. Due to their size, they usually have fewer expansion slots and may have fewer features.",
    }
};

const socketDatabase = {
    "am4": {
        name: "AM4",
        description: "A socket developed by AMD for their Ryzen series of processors, including the Ryzen 3, 5, 7, and 9 series up to the 5000 series. It supports DDR4 RAM.",
        compatibleCPUs: ["AMD Ryzen 3 3200G", "AMD Ryzen 5 5600X", "AMD Ryzen 5 5600G", "AMD Ryzen 7 5700X"],
    },
    "am5": {
        name: "AM5",
        description: "AMD's latest desktop socket, designed for the newer Ryzen 7000 and future Ryzen 9000 series CPUs. It is an LGA socket and exclusively supports DDR5 RAM.",
        compatibleCPUs: ["AMD Ryzen 7 7700X", "AMD Ryzen 9 7950X", "AMD Ryzen 9 9900X", "AMD Ryzen 9 9900X3D"],
    },
    "lga1700": {
        name: "LGA 1700",
        description: "The socket used by Intel for its 12th, 13th, and 14th generation Core processors. It supports both DDR4 and DDR5 RAM, depending on the motherboard model.",
        compatibleCPUs: ["Intel Core i3-13100", "Intel Core i3-14100", "Intel Core i5-13400", "Intel Core i5-14500", "Intel Core i5-14600K", "Intel Core i7-13700K", "Intel Core i7-14700K", "Intel Core i9-14900K"],
    }
};

/**
 * Handles Dialogflow intents related to motherboard and CPU socket compatibility.
 * @param {object} parameters - The parameters extracted by Dialogflow.
 * @param {array} inputContexts - The input contexts from Dialogflow request.
 * @param {string} projectId - The Dialogflow project ID.
 * @param {string} sessionId - The Dialogflow session ID.
 * @returns {object} An object with fulfillmentText and outputContexts.
 */
function handleCompatibilityIntent(parameters, inputContexts, projectId, sessionId) {
    console.log('[Compatibility Handler] Called.');
    console.log('[Compatibility Handler] Received parameters:', parameters);

    const formFactor = parameters['motherboard-form-factor']?.toLowerCase();
    const socket = parameters['cpu-socket']?.toLowerCase() || parameters['cpu_detail_type.original']?.toLowerCase(); 
    
    let fulfillmentText = "I'm sorry, I don't have information on that specific compatibility question. Please try asking in a different way.";
    let outputContexts = [];

    // --- Scenario 1: User asks for form factor details (e.g., "what is ATX?") ---
    if (formFactor) {
        const factorInfo = motherboardDatabase[formFactor];
        if (factorInfo) {
            fulfillmentText = `A/An ${factorInfo.name} motherboard is ${factorInfo.description}`;
        }
    }

    // --- Scenario 2: User asks for socket details (e.g., "what is AM5?" or "what is LGA1700?") ---
    if (socket) {
        const socketInfo = socketDatabase[socket];
        if (socketInfo) {
            if (parameters['detail_type'] === 'compatibleCPUs') {
                 fulfillmentText = `The ${socketInfo.name} socket is compatible with the following CPUs: ${socketInfo.compatibleCPUs.join(", ")}.`;
            } else {
                fulfillmentText = `The ${socketInfo.name} socket is ${socketInfo.description}`;
            }
        }
    }

    // --- Scenario 3: User asks for a comparison ---
    if (parameters['form-factor-1'] && parameters['form-factor-2']) {
        const ff1 = parameters['form-factor-1'].toLowerCase();
        const ff2 = parameters['form-factor-2'].toLowerCase();
        if ((ff1 === 'atx' && ff2 === 'matx') || (ff1 === 'matx' && ff2 === 'atx')) {
            fulfillmentText = `The primary difference between ATX and mATX is size. ATX boards are standard and larger, offering more expansion slots, while mATX boards are more compact, fitting in smaller cases but with fewer slots.`;
        } else {
            fulfillmentText = "I can't compare those form factors right now.";
        }
    }

    if (parameters['socket-1'] && parameters['socket-2']) {
        const s1 = parameters['socket-1'].toLowerCase();
        const s2 = parameters['socket-2'].toLowerCase();
        if ((s1 === 'am5' && s2 === 'am4') || (s1 === 'am4' && s2 === 'am5')) {
             fulfillmentText = `The AM5 socket is AMD's newest platform, exclusively for DDR5 RAM and newer Ryzen CPUs (7000 series and up), while the AM4 socket is an older platform for DDR4 RAM and older Ryzen CPUs (up to 5000 series).`;
        } else {
            fulfillmentText = "I can't compare those sockets right now.";
        }
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { handleCompatibilityIntent };

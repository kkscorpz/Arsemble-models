// compatibility-handler.js

// Database for motherboard form factors and their compatibility.
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

// Database for CPU sockets and their compatible CPUs.
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
 * @param {object} parameters - The parameters extracted by Dialogflow, including 'motherboard-form-factor' and 'cpu-socket'.
 * @returns {string} The fulfillment text response.
 */
function handleCompatibilityIntent(parameters) {
    console.log('[Compatibility Handler] Called.');
    console.log('[Compatibility Handler] Received parameters:', parameters);

    const formFactor = parameters['motherboard-form-factor']?.toLowerCase();
    const socket = parameters['cpu-socket']?.toLowerCase();

    // Handle requests for form factor definitions
    if (formFactor) {
        const factorInfo = motherboardDatabase[formFactor];
        if (factorInfo) {
            return `A/An ${factorInfo.name} motherboard is ${factorInfo.description}`;
        }
    }

    // Handle requests for socket definitions or compatible CPUs
    if (socket) {
        const socketInfo = socketDatabase[socket];
        if (socketInfo) {
            // Check if the user is asking for compatibility
            const intentDisplayName = parameters['intent_name']; // You might need to adjust how you get the intent name
            if (intentDisplayName === 'Get_Compatibility_Details' && parameters['subject'] === 'cpu-compatibility') {
                return `The ${socketInfo.name} socket is compatible with the following CPUs: ${socketInfo.compatibleCPUs.join(", ")}.`;
            }
            // General definition of the socket
            return `The ${socketInfo.name} socket is ${socketInfo.description}`;
        }
    }

    // Handle the difference between ATX and mATX
    if (formFactor === 'atx' && parameters['compare-form-factor'] === 'matx') {
        return `The primary difference between ATX and mATX is size. ATX boards are standard and larger, offering more expansion slots, while mATX boards are more compact, fitting in smaller cases but with fewer slots.`;
    }

    // Handle the difference between sockets
    if (socket === 'am5' && parameters['compare-socket'] === 'am4') {
        return `The AM5 socket is AMD's newest platform, exclusively for DDR5 RAM and newer Ryzen CPUs (7000 series and up), while the AM4 socket is an older platform for DDR4 RAM and older Ryzen CPUs (up to 5000 series).`;
    }

    return "I'm sorry, I don't have information on that specific compatibility question. Please try asking in a different way, such as 'What is AM5?' or 'What CPUs are compatible with LGA1700?'";
}

module.exports = { handleCompatibilityIntent };

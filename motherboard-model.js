// motherboard-model.js
const motherboardDatabase = {
    "asus prime b550m-k": {
        name: "ASUS PRIME B550M-K",
        socket: "AM4",
        chipset: "B550",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 128GB",
        features: "PCIe 4.0, HDMI, DVI-D, Realtek audio, 1Gb LAN",
        compatibility: "Ryzen 3000/5000 series (excluding 3200G/3400G without BIOS update)",
        price: "₱6,500" // Added price
    },
    "msi b450m a pro max ii": {
        name: "MSI B450M A PRO MAX II",
        socket: "AM4",
        chipset: "B450",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 64GB",
        features: "PCIe 3.0, HDMI, DVI, USB 3.2 Gen1, basic VRM",
        compatibility: "Supports Ryzen 1000 to 5000 series with BIOS update",
        price: "₱4,500" // Added price
    },
    "msi pro h610m s ddr4": {
        name: "MSI PRO H610M-S DDR4",
        socket: "LGA 1700",
        chipset: "H610",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 64GB",
        features: "Basic IO, 1x PCIe x16, HDMI, VGA, 1Gb LAN",
        compatibility: "Supports 12th/13th/14th Gen Intel CPUs",
        price: "₱5,000" // Added price
    },
    "ramsta rs-b450mp": {
        name: "RAMSTA RS-B450MP",
        socket: "AM4",
        chipset: "B450",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 64GB",
        features: "Entry-level, basic IO ports",
        compatibility: "Supports Ryzen 1000 to 5000 series (BIOS update may be needed)",
        price: "₱3,800" // Added price
    },
    "ramsta rs-h311d4": {
        name: "RAMSTA RS-H311D4",
        socket: "LGA 1151",
        chipset: "H310",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 32GB",
        features: "Legacy board, VGA/HDMI, USB 3.0",
        compatibility: "Supports Intel 8th/9th Gen CPUs (Coffee Lake)",
        price: "₱2,900" // Added price
    },
    "msi b650m gaming plus wifi": {
        name: "MSI B650M Gaming Plus WiFi",
        socket: "AM5",
        chipset: "B650",
        formFactor: "Micro-ATX",
        memorySupport: "DDR5, up to 128GB",
        features: "WiFi 6E, PCIe 4.0, 2.5Gb LAN, USB-C",
        compatibility: "Supports Ryzen 7000/8000 series",
        price: "₱12,500" // Added price
    },
    "msi b760m gaming plus wifi ddr4": {
        name: "MSI B760M Gaming Plus WiFi DDR4",
        socket: "LGA 1700",
        chipset: "B760",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 128GB",
        features: "PCIe 5.0, WiFi 6, HDMI/DP, 2.5Gb LAN",
        compatibility: "Supports Intel 12th/13th/14th Gen CPUs",
        price: "₱8,000" // Added price
    },
    "gigabyte h610m k ddr4": {
        name: "GIGABYTE H610M K DDR4",
        socket: "LGA 1700",
        chipset: "H610",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 64GB",
        features: "HDMI, VGA, Realtek audio, PCIe 4.0",
        compatibility: "Supports Intel 12th/13th/14th Gen CPUs",
        price: "₱4,800" // Added price
    }
};

// Motherboard Model Variants (mapping user inputs to database keys)
const motherboardModelMap = {
    "asus prime b550m-k": "asus prime b550m-k",
    "prime b550m-k": "asus prime b550m-k",
    "b550m-k": "asus prime b550m-k",
    "asus b550m-k": "asus prime b550m-k",

    "msi b450m a pro max ii": "msi b450m a pro max ii",
    "b450m a pro max ii": "msi b450m a pro max ii",
    "msi b450m-a pro max ii": "msi b450m a pro max ii",
    "b450m-a pro max ii": "msi b450m a pro max ii",
    "msi b450m-a": "msi b450m a pro max ii",

    "msi pro h610m s ddr4": "msi pro h610m s ddr4",
    "pro h610m s ddr4": "msi pro h610m s ddr4",
    "h610m s ddr4": "msi pro h610m s ddr4",
    "msi h610m-s ddr4": "msi pro h610m s ddr4",

    "ramsta rs-b450mp": "ramsta rs-b450mp",
    "rs-b450mp": "ramsta rs-b450mp",
    "ramsta b450mp": "ramsta rs-b450mp",

    "ramsta rs-h311d4": "ramsta rs-h311d4",
    "rs-h311d4": "ramsta rs-h311d4",
    "ramsta h311d4": "ramsta rs-h311d4",

    "msi b650m gaming plus wifi": "msi b650m gaming plus wifi",
    "b650m gaming plus wifi": "msi b650m gaming plus wifi",
    "msi b650m wifi": "msi b650m gaming plus wifi",

    "msi b760m gaming plus wifi ddr4": "msi b760m gaming plus wifi ddr4",
    "b760m gaming plus wifi ddr4": "msi b760m gaming plus wifi ddr4",
    "msi b760m wifi ddr4": "msi b760m gaming plus wifi ddr4",

    "gigabyte h610m k ddr4": "gigabyte h610m k ddr4",
    "h610m k ddr4": "gigabyte h610m k ddr4",
    "gigabyte h610m ddr4": "gigabyte h610m k ddr4"
};

/**
 * Handles Dialogflow intents related to Motherboard information.
 * @param {object} parameters - The parameters extracted by Dialogflow, including 'motherboard-model' and 'motherboard-detail'.
 * @param {array} inputContexts - The input contexts from Dialogflow request.
 * @param {string} projectId - The Dialogflow project ID.
 * @param {string} sessionId - The Dialogflow session ID.
 * @returns {object} An object containing fulfillmentText and outputContexts.
 */
function handleMotherboardIntent(parameters, inputContexts, projectId, sessionId) {
    console.log('    [MB Handler] Called.');
    console.log('    [MB Handler] Received parameters:', parameters);
    console.log('    [MB Handler] Received inputContexts:', inputContexts);

    let motherboardModelRaw = parameters["motherboard-model"];
    const requestedDetail = parameters["motherboard-detail"];

    let motherboardModelKey;
    if (motherboardModelRaw) {
        const lowerCaseRaw = motherboardModelRaw.toLowerCase().trim();
        motherboardModelKey = motherboardModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Try to get motherboard-model from context if not provided in current turn
    if (!motherboardModelKey && inputContexts && inputContexts.length > 0) {
        const mbContext = inputContexts.find(context => context.name.endsWith('/contexts/motherboard_details_context'));
        if (mbContext && mbContext.parameters && mbContext.parameters['motherboard-model']) {
            const contextMbModelRaw = mbContext.parameters['motherboard-model'];
            const lowerCaseContextRaw = contextMbModelRaw.toLowerCase().trim();
            motherboardModelKey = motherboardModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!motherboardModelRaw) { motherboardModelRaw = contextMbModelRaw; }
            console.log('    [MB Handler] Retrieved motherboard-model from context:', motherboardModelKey);
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that Motherboard model.';
    let outputContexts = [];

    const mb = motherboardDatabase[motherboardModelKey];

    if (mb) {
        // Handle specific detail request
        if (requestedDetail) {
            let detailValue = mb[requestedDetail];
            if (detailValue !== undefined) {
                fulfillmentText = `For the ${mb.name}, the ${requestedDetail} is: ${detailValue}.`;
                console.log(`    [MB Handler] Responding with specific detail: ${requestedDetail}`);
            } else {
                fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${mb.name}.`;
                console.log(`    [MB Handler] Requested detail "${requestedDetail}" not found for ${mb.name}.`);
            }
        } else {
            // General info if no specific detail was requested
            let response = `The ${mb.name} uses the ${mb.socket} socket with the ${mb.chipset} chipset. `;
            response += `It is a ${mb.formFactor} board supporting ${mb.memorySupport}. `;
            response += `Key features include: ${mb.features}. `;
            response += `Compatibility: ${mb.compatibility}. `;
            response += `The estimated price is ${mb.price}.`; // Added price to the general response
            fulfillmentText = response;
            console.log('    [MB Handler] Responding with general info.');
        }

        // Set the output context to remember the Motherboard model for follow-up questions
        if (motherboardModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/motherboard_details_context`,
                lifespanCount: 5,
                parameters: {
                    'motherboard-model': motherboardModelRaw
                }
            });
            console.log('    [MB Handler] Set output context: motherboard_details_context');
        } else {
            console.warn('    [MB Handler] WARNING: motherboardModelRaw was empty, could not set motherboard_details_context.');
        }
    } else {
        console.log(`    [MB Handler] Motherboard model "${motherboardModelRaw}" (key: "${motherboardModelKey}") not found in database.`);
    }

    console.log('    [MB Handler] Fulfillment Text:', fulfillmentText);
    console.log('    [MB Handler] Output Contexts:', outputContexts);
    return { fulfillmentText, outputContexts };
}

module.exports = { handleMotherboardIntent };
// motherboard-model.js
// Motherboard database
const motherboardDatabase = {
    "asus prime b550m-k": {
        name: "ASUS PRIME B550M-K",
        socket: "AM4",
        chipset: "B550",
        form_factor: "Micro-ATX", // Changed to underscore
        memory_support: "DDR4, up to 128GB", // Changed to underscore
        features: "PCIe 4.0, HDMI, DVI-D, Realtek audio, 1Gb LAN",
        compatibility: "Ryzen 3000/5000 series (excluding 3200G/3400G without BIOS update)"
    },
    "msi b450m a pro max ii": {
        name: "MSI B450M A PRO MAX II",
        socket: "AM4",
        chipset: "B450",
        form_factor: "Micro-ATX", // Changed to underscore
        memory_support: "DDR4, up to 64GB", // Changed to underscore
        features: "PCIe 3.0, HDMI, DVI, USB 3.2 Gen1, basic VRM",
        compatibility: "Supports Ryzen 1000 to 5000 series with BIOS update"
    },
    "msi pro h610m s ddr4": {
        name: "MSI PRO H610M-S DDR4",
        socket: "LGA 1700",
        chipset: "H610",
        form_factor: "Micro-ATX", // Changed to underscore
        memory_support: "DDR4, up to 64GB", // Changed to underscore
        features: "Basic IO, 1x PCIe x16, HDMI, VGA, 1Gb LAN",
        compatibility: "Supports 12th/13th/14th Gen Intel CPUs"
    },
    "ramsta rs-b450mp": {
        name: "RAMSTA RS-B450MP",
        socket: "AM4",
        chipset: "B450",
        form_factor: "Micro-ATX", // Changed to underscore
        memory_support: "DDR4, up to 64GB", // Changed to underscore
        features: "Entry-level, basic IO ports",
        compatibility: "Supports Ryzen 1000 to 5000 series (BIOS update may be needed)"
    },
    "ramsta rs-h311d4": {
        name: "RAMSTA RS-H311D4",
        socket: "LGA 1151",
        chipset: "H310",
        form_factor: "Micro-ATX", // Changed to underscore
        memory_support: "DDR4, up to 32GB", // Changed to underscore
        features: "Legacy board, VGA/HDMI, USB 3.0",
        compatibility: "Supports Intel 8th/9th Gen CPUs (Coffee Lake)"
    },
    "msi b650m gaming plus wifi": {
        name: "MSI B650M Gaming Plus WiFi",
        socket: "AM5",
        chipset: "B650",
        form_factor: "Micro-ATX", // Changed to underscore
        memory_support: "DDR5, up to 128GB", // Changed to underscore
        features: "WiFi 6E, PCIe 4.0, 2.5Gb LAN, USB-C",
        compatibility: "Supports Ryzen 7000/8000 series"
    },
    "msi b760m gaming plus wifi ddr4": {
        name: "MSI B760M Gaming Plus WiFi DDR4",
        socket: "LGA 1700",
        chipset: "B760",
        form_factor: "Micro-ATX", // Changed to underscore
        memory_support: "DDR4, up to 128GB", // Changed to underscore
        features: "PCIe 5.0, WiFi 6, HDMI/DP, 2.5Gb LAN",
        compatibility: "Supports Intel 12th/13th/14th Gen CPUs"
    },
    "gigabyte h610m k ddr4": {
        name: "GIGABYTE H610M K DDR4",
        socket: "LGA 1700",
        chipset: "H610",
        form_factor: "Micro-ATX", // Changed to underscore
        memory_support: "DDR4, up to 64GB", // Changed to underscore
        features: "HDMI, VGA, Realtek audio, PCIe 4.0",
        compatibility: "Supports Intel 12th/13th/14th Gen CPUs"
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
 * @param {object} parameters - Dialogflow extracted parameters.
 * @param {Array} inputContexts - Active contexts from Dialogflow.
 * @param {string} projectId - Google Cloud Project ID.
 * @param {string} sessionId - Dialogflow session ID.
 * @returns {object} An object with `fulfillmentText` and `outputContexts`.
 */
function handleMotherboardIntent(parameters, inputContexts, projectId, sessionId) {
    let mbModelRaw = parameters["motherboard-model"]; // Assuming Dialogflow parameter for motherboard model

    // Assuming Dialogflow parameter for detail type is 'motherboard-detail-type'
    let requestedDetail = parameters["motherboard-detail-type"];
    if (Array.isArray(requestedDetail) && requestedDetail.length > 0) {
        requestedDetail = requestedDetail[0];
    }
    if (typeof requestedDetail === 'string') {
        requestedDetail = requestedDetail.toLowerCase().replace(/[\s-]/g, '_');
    }

    let modelKey;
    if (mbModelRaw) {
        if (Array.isArray(mbModelRaw) && mbModelRaw.length > 0) {
            mbModelRaw = mbModelRaw[0];
        }
        const lowerCaseRaw = String(mbModelRaw).toLowerCase().trim();
        modelKey = motherboardModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Check 'motherboard_details_context' for follow-up questions
    if (!modelKey && inputContexts && inputContexts.length > 0) {
        const mbContext = inputContexts.find(context => context.name.endsWith('/contexts/motherboard_details_context'));
        if (mbContext && mbContext.parameters && mbContext.parameters['motherboard-model']) {
            let contextMbModelRaw = mbContext.parameters['motherboard-model'];
            if (Array.isArray(contextMbModelRaw) && contextMbModelRaw.length > 0) {
                contextMbModelRaw = contextMbModelRaw[0];
            }
            const lowerCaseContextRaw = String(contextMbModelRaw).toLowerCase().trim();
            modelKey = motherboardModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!mbModelRaw) {
                mbModelRaw = contextMbModelRaw;
            }
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that Motherboard model.';
    let outputContexts = [];

    const mb = motherboardDatabase[modelKey];

    // --- DEBUGGING LOGS ---
    console.log('--- handleMotherboardIntent Debug ---');
    console.log('Parameters received from Dialogflow:', parameters);
    console.log('mbModelRaw (processed):', mbModelRaw);
    console.log('requestedDetail (processed):', requestedDetail);
    console.log('modelKey (used for database lookup):', modelKey);
    console.log('Motherboard object found in database:', mb);
    if (mb && requestedDetail) {
        console.log(`Value for mb[${requestedDetail}]:`, mb[requestedDetail]);
    }
    console.log('--- End Debug ---');
    // --- END DEBUGGING LOGS ---

    if (mb) {
        if (requestedDetail && mb[requestedDetail]) {
            // Specific attribute response
            switch (requestedDetail) {
                case "name":
                    fulfillmentText = `The name of the motherboard is ${mb.name}.`;
                    break;
                case "socket":
                    fulfillmentText = `The ${mb.name} uses the ${mb.socket} socket.`;
                    break;
                case "chipset":
                    fulfillmentText = `The ${mb.name} has the ${mb.chipset} chipset.`;
                    break;
                case "form_factor":
                    fulfillmentText = `The ${mb.name} is a ${mb.form_factor} motherboard.`;
                    break;
                case "memory_support":
                    fulfillmentText = `The ${mb.name} supports ${mb.memory_support} memory.`;
                    break;
                case "features":
                    fulfillmentText = `Key features of the ${mb.name} include: ${mb.features}.`;
                    break;
                case "compatibility":
                    fulfillmentText = `Regarding compatibility for ${mb.name}: ${mb.compatibility}`;
                    break;
                default:
                    fulfillmentText = `For ${mb.name}, the ${requestedDetail.replace(/_/g, ' ')} is: ${mb[requestedDetail]}.`;
                    break;
            }
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail.replace(/_/g, ' ')} for ${mb.name}.`;
        } else {
            // General details
            let response = `The ${mb.name} uses the ${mb.socket} socket with the ${mb.chipset} chipset. `;
            response += `It is a ${mb.form_factor} board supporting ${mb.memory_support}. `;
            response += `Key features include: ${mb.features}. `;
            response += `Compatibility: ${mb.compatibility}.`;
            fulfillmentText = response;
        }

        // Set 'motherboard_details_context'
        if (mbModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/motherboard_details_context`,
                lifespanCount: 5,
                parameters: {
                    'motherboard-model': mbModelRaw
                }
            });
        }
    } else {
        fulfillmentText = `Sorry, I couldn't find details for "${mbModelRaw || 'that Motherboard model'}". Please ensure the name is correct or try another model.`;
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { motherboardDatabase, motherboardModelMap, handleMotherboardIntent };

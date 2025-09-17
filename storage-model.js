// storage.js
// Storage database (HDD and SSD)
const storageDatabase = {
    "seagate barracuda 1tb": {
        name: "Seagate Barracuda 1TB",
        type: "HDD",
        capacity: "1TB",
        interface: "SATA 6Gb/s",
        formFactor: "3.5-inch",
        rpm: "7200 RPM",
        compatibility: "Requires a motherboard with an available SATA port and a SATA power connector from the PSU. Ensure your case has a 3.5-inch drive bay. It's a good choice for bulk storage."
    },
    "western digital blue 2tb": {
        name: "Western Digital Blue 2TB",
        type: "HDD",
        capacity: "2TB",
        interface: "SATA 6Gb/s",
        formFactor: "3.5-inch",
        rpm: "5400/7200 RPM (typically 5400 for Blue)", // Reflecting common WD Blue variations
        compatibility: "Requires a motherboard with an available SATA port and a SATA power connector from the PSU. Ensure your case has a 3.5-inch drive bay. Excellent for larger storage needs."
    },
    "samsung 970 evo plus 1tb": {
        name: "Samsung 970 EVO Plus 1TB",
        type: "NVMe SSD",
        capacity: "1TB",
        interface: "PCIe Gen 3.0 x4",
        formFactor: "M.2 2280",
        readSpeed: "~3500MB/s",
        writeSpeed: "~3300MB/s",
        compatibility: "Requires a motherboard with an available M.2 slot supporting PCIe Gen 3.0 x4 NVMe SSDs. Check if your motherboard shares M.2 bandwidth with SATA ports."
    },
    "crucial mx500 500gb": {
        name: "Crucial MX500 500GB",
        type: "SATA SSD",
        capacity: "500GB",
        interface: "SATA 6Gb/s",
        formFactor: "2.5-inch",
        readSpeed: "~560MB/s",
        writeSpeed: "~510MB/s",
        compatibility: "Requires a motherboard with an available SATA port and a SATA power connector from the PSU. Ensure your case has a 2.5-inch drive bay. It's a reliable and cost-effective option for a fast boot drive or general storage."
    }
};

// Storage Model Variants (mapping user inputs to database keys)
const storageModelMap = {
    "seagate barracuda 1tb": "seagate barracuda 1tb",
    "barracuda 1tb": "seagate barracuda 1tb",
    "seagate 1tb hdd": "seagate barracuda 1tb",
    "1tb barracuda": "seagate barracuda 1tb",
    "barracuda 1tb hdd": "seagate barracuda 1tb",

    "western digital blue 2tb": "western digital blue 2tb",
    "wd blue 2tb": "western digital blue 2tb",
    "western digital 2tb hdd": "western digital blue 2tb",
    "2tb blue hdd": "western digital blue 2tb",
    "wd blue 2tb hdd": "western digital blue 2tb",

    "samsung 970 evo plus 1tb": "samsung 970 evo plus 1tb",
    "970 evo plus 1tb": "samsung 970 evo plus 1tb",
    "samsung nvme 1tb": "samsung 970 evo plus 1tb",
    "1tb 970 evo plus": "samsung 970 evo plus 1tb",
    "970 evo plus": "samsung 970 evo plus 1tb",

    "crucial mx500 500gb": "crucial mx500 500gb",
    "mx500 500gb": "crucial mx500 500gb",
    "crucial 500gb ssd": "crucial mx500 500gb",
    "500gb mx500": "crucial mx500 500gb",
    "mx500 ssd": "crucial mx500 500gb"
};

/**
 * Handles Dialogflow intents related to Storage (HDD/SSD) information.
 * @param {object} parameters - The parameters extracted by Dialogflow, including 'storage-model' and 'storage-detail'.
 * @param {array} inputContexts - The input contexts from Dialogflow request.
 * @param {string} projectId - The Dialogflow project ID.
 * @param {string} sessionId - The Dialogflow session ID.
 * @returns {object} An object containing fulfillmentText and outputContexts.
 */
function handleStorageIntent(parameters, inputContexts, projectId, sessionId) {
    console.log('    [Storage Handler] Called.');
    console.log('    [Storage Handler] Received parameters:', parameters);
    console.log('    [Storage Handler] Received inputContexts:', inputContexts);

    let storageModelRaw = parameters["storage-model"]; // Expecting 'storage-model' from Dialogflow
    const requestedDetail = parameters["storage-detail"]; // Expecting 'storage-detail' for specific requests

    let storageModelKey;
    if (storageModelRaw) {
        const lowerCaseRaw = storageModelRaw.toLowerCase().trim();
        storageModelKey = storageModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Try to get storage-model from context if not provided in current turn
    if (!storageModelKey && inputContexts && inputContexts.length > 0) {
        const storageContext = inputContexts.find(context => context.name.endsWith('/contexts/storage_details_context'));
        if (storageContext && storageContext.parameters && storageContext.parameters['storage-model']) {
            const contextStorageModelRaw = storageContext.parameters['storage-model'];
            const lowerCaseContextRaw = contextStorageModelRaw.toLowerCase().trim();
            storageModelKey = storageModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!storageModelRaw) { storageModelRaw = contextStorageModelRaw; } // Update raw if it was empty
            console.log('    [Storage Handler] Retrieved storage-model from context:', storageModelKey);
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that Storage device model.';
    let outputContexts = [];

    const storage = storageDatabase[storageModelKey];

    if (storage) {
        // Handle specific detail request
        if (requestedDetail) {
            let detailValue = storage[requestedDetail];
            if (detailValue !== undefined) {
                 fulfillmentText = `For the ${storage.name}, the ${requestedDetail} is: ${detailValue}.`;
                 console.log(`    [Storage Handler] Responding with specific detail: ${requestedDetail}`);
            } else {
                 fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${storage.name}.`;
                 console.log(`    [Storage Handler] Requested detail "${requestedDetail}" not found for ${storage.name}.`);
            }
        } else {
            // General info if no specific detail was requested
            let response = `The ${storage.name} is a ${storage.formFactor} ${storage.type} with ${storage.capacity} capacity, using a ${storage.interface} interface. `;

            if (storage.type === "HDD") {
                response += `It spins at ${storage.rpm}. `;
            } else if (storage.type.includes("SSD")) { // Covers NVMe SSD and SATA SSD
                response += `It offers read speeds of up to ${storage.readSpeed} and write speeds up to ${storage.writeSpeed}. `;
            }

            response += `Compatibility: ${storage.compatibility}`;
            fulfillmentText = response;
            console.log('    [Storage Handler] Responding with general info.');
        }

        // Set the output context to remember the Storage model for follow-up questions
        if (storageModelRaw) { // Ensure model is available to store in context
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/storage_details_context`,
                lifespanCount: 5,
                parameters: {
                    'storage-model': storageModelRaw
                }
            });
            console.log('    [Storage Handler] Set output context: storage_details_context');
        } else {
            console.warn('    [Storage Handler] WARNING: storageModelRaw was empty, could not set storage_details_context.');
        }
    } else {
        console.log(`    [Storage Handler] Storage model "${storageModelRaw}" (key: "${storageModelKey}") not found in database.`);
    }

    console.log('    [Storage Handler] Fulfillment Text:', fulfillmentText);
    console.log('    [Storage Handler] Output Contexts:', outputContexts);
    return { fulfillmentText, outputContexts };
}

module.exports = { handleStorageIntent };
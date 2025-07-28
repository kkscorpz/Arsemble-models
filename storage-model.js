// storage-model.js
// Storage database (HDD and SSD)
const storageDatabase = {
    "seagate barracuda 1tb": {
        name: "Seagate Barracuda 1TB",
        type: "HDD",
        capacity: "1TB",
        interface: "SATA 6Gb/s",
        form_factor: "3.5-inch", // Changed to underscore
        rpm: "7200 RPM",
        compatibility: "Requires a motherboard with an available SATA port and a SATA power connector from the PSU. Ensure your case has a 3.5-inch drive bay. It's a good choice for bulk storage."
    },
    "western digital blue 2tb": {
        name: "Western Digital Blue 2TB",
        type: "HDD",
        capacity: "2TB",
        interface: "SATA 6Gb/s",
        form_factor: "3.5-inch",
        rpm: "5400/7200 RPM (typically 5400 for Blue)", // Reflecting common WD Blue variations
        compatibility: "Requires a motherboard with an available SATA port and a SATA power connector from the PSU. Ensure your case has a 3.5-inch drive bay. Excellent for larger storage needs."
    },
    "samsung 970 evo plus 1tb": {
        name: "Samsung 970 EVO Plus 1TB",
        type: "NVMe SSD",
        capacity: "1TB",
        interface: "PCIe Gen 3.0 x4",
        form_factor: "M.2 2280",
        read_speed: "~3500MB/s", // Changed to underscore
        write_speed: "~3300MB/s", // Changed to underscore
        compatibility: "Requires a motherboard with an available M.2 slot supporting PCIe Gen 3.0 x4 NVMe SSDs. Check if your motherboard shares M.2 bandwidth with SATA ports."
    },
    "crucial mx500 500gb": {
        name: "Crucial MX500 500GB",
        type: "SATA SSD",
        capacity: "500GB",
        interface: "SATA 6Gb/s",
        form_factor: "2.5-inch",
        read_speed: "~560MB/s",
        write_speed: "~510MB/s",
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
 * @param {object} parameters - Dialogflow extracted parameters.
 * @param {Array} inputContexts - Active contexts from Dialogflow.
 * @param {string} projectId - Google Cloud Project ID.
 * @param {string} sessionId - Dialogflow session ID.
 * @returns {object} An object with `fulfillmentText` and `outputContexts`.
 */
function handleStorageIntent(parameters, inputContexts, projectId, sessionId) {
    let storageModelRaw = parameters["storage-model"]; // Assuming Dialogflow parameter for storage model

    // Assuming Dialogflow parameter for detail type is 'storage-detail-type'
    let requestedDetail = parameters["storage-detail-type"];
    if (Array.isArray(requestedDetail) && requestedDetail.length > 0) {
        requestedDetail = requestedDetail[0];
    }
    if (typeof requestedDetail === 'string') {
        requestedDetail = requestedDetail.toLowerCase().replace(/[\s-]/g, '_');
    }

    let modelKey;
    if (storageModelRaw) {
        if (Array.isArray(storageModelRaw) && storageModelRaw.length > 0) {
            storageModelRaw = storageModelRaw[0];
        }
        const lowerCaseRaw = String(storageModelRaw).toLowerCase().trim();
        modelKey = storageModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Check 'storage_details_context' for follow-up questions
    if (!modelKey && inputContexts && inputContexts.length > 0) {
        const storageContext = inputContexts.find(context => context.name.endsWith('/contexts/storage_details_context'));
        if (storageContext && storageContext.parameters && storageContext.parameters['storage-model']) {
            let contextStorageModelRaw = storageContext.parameters['storage-model'];
            if (Array.isArray(contextStorageModelRaw) && contextStorageModelRaw.length > 0) {
                contextStorageModelRaw = contextStorageModelRaw[0];
            }
            const lowerCaseContextRaw = String(contextStorageModelRaw).toLowerCase().trim();
            modelKey = storageModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!storageModelRaw) {
                storageModelRaw = contextStorageModelRaw;
            }
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that storage model.';
    let outputContexts = [];

    const storage = storageDatabase[modelKey];

    // --- DEBUGGING LOGS ---
    console.log('--- handleStorageIntent Debug ---');
    console.log('Parameters received from Dialogflow:', parameters);
    console.log('storageModelRaw (processed):', storageModelRaw);
    console.log('requestedDetail (processed):', requestedDetail);
    console.log('modelKey (used for database lookup):', modelKey);
    console.log('Storage object found in database:', storage);
    if (storage && requestedDetail) {
        console.log(`Value for storage[${requestedDetail}]:`, storage[requestedDetail]);
    }
    console.log('--- End Debug ---');
    // --- END DEBUGGING LOGS ---

    if (storage) {
        if (requestedDetail && storage[requestedDetail]) {
            // Specific attribute response
            switch (requestedDetail) {
                case "name":
                    fulfillmentText = `The name of the storage device is ${storage.name}.`;
                    break;
                case "type":
                    fulfillmentText = `The ${storage.name} is a ${storage.type}.`;
                    break;
                case "capacity":
                    fulfillmentText = `The ${storage.name} has a capacity of ${storage.capacity}.`;
                    break;
                case "interface":
                    fulfillmentText = `The ${storage.name} uses a ${storage.interface} interface.`;
                    break;
                case "form_factor":
                    fulfillmentText = `The form factor of the ${storage.name} is ${storage.form_factor}.`;
                    break;
                case "rpm":
                    if (storage.type === "HDD") {
                        fulfillmentText = `The ${storage.name} spins at ${storage.rpm}.`;
                    } else {
                        fulfillmentText = `The ${storage.name} is an SSD and does not have an RPM.`;
                    }
                    break;
                case "read_speed":
                    if (storage.type.includes("SSD")) {
                        fulfillmentText = `The ${storage.name} has a read speed of up to ${storage.read_speed}.`;
                    } else {
                        fulfillmentText = `The ${storage.name} is an HDD and typically doesn't specify read/write speeds in this manner.`;
                    }
                    break;
                case "write_speed":
                    if (storage.type.includes("SSD")) {
                        fulfillmentText = `The ${storage.name} has a write speed of up to ${storage.write_speed}.`;
                    } else {
                        fulfillmentText = `The ${storage.name} is an HDD and typically doesn't specify read/write speeds in this manner.`;
                    }
                    break;
                case "compatibility":
                    fulfillmentText = `Regarding compatibility for ${storage.name}: ${storage.compatibility}`;
                    break;
                default:
                    fulfillmentText = `For ${storage.name}, the ${requestedDetail.replace(/_/g, ' ')} is: ${storage[requestedDetail]}.`;
                    break;
            }
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail.replace(/_/g, ' ')} for ${storage.name}.`;
        } else {
            // General details
            let response = `The ${storage.name} is a ${storage.form_factor} ${storage.type} with ${storage.capacity} capacity, using a ${storage.interface} interface. `;

            if (storage.type === "HDD") {
                response += `It spins at ${storage.rpm}. `;
            } else if (storage.type.includes("SSD")) { // Covers NVMe SSD and SATA SSD
                response += `It offers read speeds of up to ${storage.read_speed} and write speeds up to ${storage.write_speed}. `;
            }
            response += `Compatibility: ${storage.compatibility}`;
            fulfillmentText = response;
        }

        // Set 'storage_details_context'
        if (storageModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/storage_details_context`,
                lifespanCount: 5,
                parameters: {
                    'storage-model': storageModelRaw
                }
            });
        }
    } else {
        fulfillmentText = `Sorry, I couldn't find details for "${storageModelRaw || 'that storage model'}". Please ensure the name is correct or try another model.`;
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { storageDatabase, storageModelMap, handleStorageIntent };

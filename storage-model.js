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
 * @param {string} intent - The display name of the intent.
 * @param {object} parameters - The parameters extracted by Dialogflow.
 * @returns {string} The fulfillment text response.
 */
function handleStorageIntent(intent, parameters) {
    console.log('  [Storage Handler] Called for intent:', intent);
    console.log('  [Storage Handler] Received parameters:', parameters);

    // CRITICAL: Access the parameter using the exact name Dialogflow sends, which is 'storage_model' (with an underscore)
    const storageModelRaw = parameters["storage-model"];

    if (!storageModelRaw) {
        console.warn('  [Storage Handler] WARNING: "storage_model" parameter is missing in the request.');
        return 'Please specify the Storage device model you are interested in (e.g., "Seagate Barracuda 1TB").';
    }

    const modelKey = storageModelMap[storageModelRaw.toLowerCase().trim()];
    if (!modelKey) {
        console.warn(`  [Storage Handler] WARNING: No matching model key found in storageModelMap for "${storageModelRaw}".`);
        return `Sorry, I couldn't find detailed specifications for the Storage model "${storageModelRaw}".`;
    }

    const storage = storageDatabase[modelKey];
    if (!storage) {
        console.error(`  [Storage Handler] ERROR: No Storage data found in storageDatabase for key: "${modelKey}".`);
        return `Sorry, I couldn't find full specifications for "${storageModelRaw}". The data might be missing or incorrect.`;
    }

    // Construct the detailed response based on the storage type (HDD vs. SSD)
    let response = `The ${storage.name} is a ${storage.formFactor} ${storage.type} with ${storage.capacity} capacity, using a ${storage.interface} interface. `;

    if (storage.type === "HDD") {
        response += `It spins at ${storage.rpm}. `;
    } else if (storage.type.includes("SSD")) { // Covers NVMe SSD and SATA SSD
        response += `It offers read speeds of up to ${storage.readSpeed} and write speeds up to ${storage.writeSpeed}. `;
    }

    response += `Compatibility: ${storage.compatibility}`;

    console.log('  [Storage Handler] Generated response:', response);
    return response;
}

module.exports = { handleStorageIntent };

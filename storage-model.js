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
        compatibility: "Requires a motherboard with an available SATA port and a SATA power connector from the PSU. Ensure your case has a 3.5-inch drive bay. It's a good choice for bulk storage.",
        price: "₱2,500"
    },
    "western digital blue 2tb": {
        name: "Western Digital Blue 2TB",
        type: "HDD",
        capacity: "2TB",
        interface: "SATA 6Gb/s",
        formFactor: "3.5-inch",
        rpm: "5400/7200 RPM (typically 5400 for Blue)",
        compatibility: "Requires a motherboard with an available SATA port and a SATA power connector from the PSU. Ensure your case has a 3.5-inch drive bay. Excellent for larger storage needs.",
        price: "₱3,800"
    },
    "samsung 970 evo plus 1tb": {
        name: "Samsung 970 EVO Plus 1TB",
        type: "NVMe SSD",
        capacity: "1TB",
        interface: "PCIe Gen 3.0 x4",
        formFactor: "M.2 2280",
        readSpeed: "~3500MB/s",
        writeSpeed: "~3300MB/s",
        compatibility: "Requires a motherboard with an available M.2 slot supporting PCIe Gen 3.0 x4 NVMe SSDs. Check if your motherboard shares M.2 bandwidth with SATA ports.",
        price: "₱5,500"
    },
    "crucial mx500 500gb": {
        name: "Crucial MX500 500GB",
        type: "SATA SSD",
        capacity: "500GB",
        interface: "SATA 6Gb/s",
        formFactor: "2.5-inch",
        readSpeed: "~560MB/s",
        writeSpeed: "~510MB/s",
        compatibility: "Requires a motherboard with an available SATA port and a SATA power connector from the PSU. Ensure your case has a 2.5-inch drive bay. It's a reliable and cost-effective option for a fast boot drive or general storage.",
        price: "₱3,000"
    }
};

// Storage Model Variants
const storageModelMap = {
    "seagate barracuda 1tb": "seagate barracuda 1tb",
    "barracuda 1tb": "seagate barracuda 1tb",
    "seagate 1tb hdd": "seagate barracuda 1tb",
    "1tb barracuda": "seagate barracuda 1tb",

    "western digital blue 2tb": "western digital blue 2tb",
    "wd blue 2tb": "western digital blue 2tb",
    "2tb blue hdd": "western digital blue 2tb",

    "samsung 970 evo plus 1tb": "samsung 970 evo plus 1tb",
    "970 evo plus 1tb": "samsung 970 evo plus 1tb",
    "samsung nvme 1tb": "samsung 970 evo plus 1tb",
    "970 evo plus": "samsung 970 evo plus 1tb",

    "crucial mx500 500gb": "crucial mx500 500gb",
    "mx500 500gb": "crucial mx500 500gb",
    "crucial 500gb ssd": "crucial mx500 500gb",
    "mx500 ssd": "crucial mx500 500gb"
};

// Synonyms for detail names
const detailKeyMap = {
    "type": "type",
    "drive type": "type",

    "capacity": "capacity",
    "size": "capacity",

    "interface": "interface",
    "connection": "interface",
    "bus": "interface",

    "form": "formFactor",
    "formfactor": "formFactor",
    "form factor": "formFactor",

    "rpm": "rpm",
    "speed": "rpm", // for HDD

    "read": "readSpeed",
    "read speed": "readSpeed",
    "write": "writeSpeed",
    "write speed": "writeSpeed",

    "compatibility": "compatibility",

    "price": "price",
    "cost": "price"
};

// Helper to safely extract params
function getParam(parameters, ...names) {
    for (const n of names) {
        if (parameters[n] !== undefined) {
            const v = parameters[n];
            return Array.isArray(v) ? v[0] : v;
        }
    }
    return undefined;
}

// Main handler
function handleStorageIntent(parameters = {}, inputContexts = [], projectId = "proj", sessionId = "sess") {
    console.log("🟢 [Storage Handler] Called.", { parameters });

    let storageModelRaw = getParam(parameters, "storage-model", "Storage-model");
    let requestedDetailRaw = getParam(parameters, "storage-detail", "Storage-detail");

    if (Array.isArray(storageModelRaw)) storageModelRaw = storageModelRaw[0];
    if (Array.isArray(requestedDetailRaw)) requestedDetailRaw = requestedDetailRaw[0];

    console.log("   [Storage Handler] Model (raw):", storageModelRaw);
    console.log("   [Storage Handler] Requested Detail (raw):", requestedDetailRaw);

    let storageModelKey;
    if (storageModelRaw) {
        const lower = storageModelRaw.toLowerCase().trim();
        storageModelKey = storageModelMap[lower] || lower;
    }

    // fallback to context
    if (!storageModelKey && inputContexts.length > 0) {
        const ctx = inputContexts.find(c => c.name && c.name.endsWith("/contexts/storage_details_context"));
        if (ctx?.parameters?.["storage-model"]) {
            const lower = ctx.parameters["storage-model"].toLowerCase().trim();
            storageModelKey = storageModelMap[lower] || lower;
            if (!storageModelRaw) storageModelRaw = ctx.parameters["storage-model"];
            console.log("   [Storage Handler] Retrieved model from context:", storageModelKey);
        }
    }

    const storage = storageDatabase[storageModelKey];
    let fulfillmentText = "Sorry, I couldn't find details for that Storage device.";
    let outputContexts = [];

    if (storage) {
        let requestedKey = null;
        if (requestedDetailRaw) {
            const raw = requestedDetailRaw.toString().toLowerCase().trim();
            requestedKey = detailKeyMap[raw];
        }

        if (requestedKey && storage[requestedKey] !== undefined) {
            fulfillmentText = `For the ${storage.name}, the ${requestedDetailRaw} is: ${storage[requestedKey]}.`;
            console.log("   [Storage Handler] Specific detail response:", requestedKey, storage[requestedKey]);
        } else if (requestedDetailRaw) {
            fulfillmentText = `Sorry, I don't have information about "${requestedDetailRaw}" for ${storage.name}.`;
        } else {
            // General info
            let response = `The ${storage.name} is a ${storage.formFactor} ${storage.type} with ${storage.capacity} capacity, using a ${storage.interface} interface. `;
            if (storage.type === "HDD") {
                response += `It spins at ${storage.rpm}. `;
            } else if (storage.type.includes("SSD")) {
                response += `It offers read speeds of up to ${storage.readSpeed} and write speeds up to ${storage.writeSpeed}. `;
            }
            response += `Compatibility: ${storage.compatibility}. `;
            response += `The estimated price is ${storage.price}.`;
            fulfillmentText = response;
        }

        // Save context for follow-ups
        const base = inputContexts[0]?.name ? inputContexts[0].name.split('/contexts/')[0] : `projects/${projectId}/agent/sessions/${sessionId}`;
        outputContexts.push({
            name: `${base}/contexts/storage_details_context`,
            lifespanCount: 5,
            parameters: { "storage-model": storageModelRaw }
        });
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { handleStorageIntent };

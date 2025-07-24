// CPU Cooler database
const cpuCoolerDatabase = {
    "coolmoon aosor s400": {
        name: "COOLMOON AOSOR S400",
        type: "Air Cooler",
        fanSize: "120mm",
        tdp: "Up to 130W",
        rgb: "Addressable RGB",
        compatibility: "Supports Intel LGA 1700/1200/115X and AMD AM4 sockets. Make sure your case has enough clearance for its height (approx. 155mm). The RGB requires a compatible 3-pin 5V ARGB header or controller."
    },
    "cooler master hyper 212 black edition": {
        name: "Cooler Master Hyper 212 Black Edition",
        type: "Air Cooler",
        fanSize: "120mm",
        tdp: "Up to 150W",
        rgb: "No integrated RGB",
        compatibility: "Supports Intel LGA 1700/1200/115X and AMD AM4/AM5 (with adapter kit) sockets. Check case clearance (approx. 159mm height). Reliable and quiet cooling for mid-range CPUs."
    },
    "thermalright peerless assassin 120 se": {
        name: "Thermalright Peerless Assassin 120 SE",
        type: "Dual-Tower Air Cooler",
        fanSize: "2x 120mm",
        tdp: "Up to 245W",
        rgb: "No RGB",
        compatibility: "Supports Intel LGA 1700/1200/115X and AMD AM4/AM5 sockets. Excellent performance for high-end CPUs. Ensure significant case clearance (approx. 155mm height) and check RAM clearance, especially with tall heatspreaders."
    },
    "deepcool le500 marrs": {
        name: "Deepcool LE500 MARRS",
        type: "AIO Liquid Cooler",
        radiatorSize: "240mm", // Specific for AIOs
        tdp: "Up to 220W",
        rgb: "No RGB (has blue LED pump)",
        compatibility: "Supports Intel LGA 1700/1200/115X and AMD AM4/AM5 sockets. Requires a case that can mount a 240mm radiator (top or front). Ensure your case has enough clearance for the radiator and fans."
    }
};

// CPU Cooler Model Variants (mapping user inputs to database keys)
const cpuCoolerModelMap = {
    "coolmoon aosor s400": "coolmoon aosor s400",
    "aosor s400": "coolmoon aosor s400",
    "coolmoon s400": "coolmoon aosor s400",
    "s400 cpu cooler": "coolmoon aosor s400",
    "coolmoon aosor": "coolmoon aosor s400",

    "cooler master hyper 212 black edition": "cooler master hyper 212 black edition",
    "hyper 212 black edition": "cooler master hyper 212 black edition",
    "cm hyper 212": "cooler master hyper 212 black edition",
    "hyper 212": "cooler master hyper 212 black edition",
    "cooler master hyper 212": "cooler master hyper 212 black edition",

    "thermalright peerless assassin 120 se": "thermalright peereless assassin 120 se",
    "peerless assassin 120 se": "thermalright peereless assassin 120 se",
    "thermalright pa120 se": "thermalright peereless assassin 120 se",
    "pa120 se": "thermalright peereless assassin 120 se",
    "peerless assassin": "thermalright peereless assassin 120 se",

    "deepcool le500 marrs": "deepcool le500 marrs",
    "le500 marrs": "deepcool le500 marrs",
    "deepcool le500": "deepcool le500 marrs",
    "le500 liquid cooler": "deepcool le500 marrs",
    "le500 aio": "deepcool le500 marrs"
};

/**
 * Handles Dialogflow intents related to CPU Cooler information.
 * @param {string} intent - The display name of the intent.
 * @param {object} parameters - The parameters extracted by Dialogflow.
 * @returns {string} The fulfillment text response.
 */
function handleCPUCoolerIntent(intent, parameters) {
    console.log('  [CPU Cooler Handler] Called for intent:', intent);
    console.log('  [CPU Cooler Handler] Received parameters:', parameters);

    // CRITICAL: Access the parameter using the exact name Dialogflow sends, which is 'cooler_model' (with an underscore)
    const coolerModelRaw = parameters["cooler-model"];

    if (!coolerModelRaw) {
        console.warn('  [CPU Cooler Handler] WARNING: "cooler_model" parameter is missing in the request.');
        return 'Please specify the CPU Cooler model you are interested in (e.g., "COOLMOON AOSOR S400").';
    }

    const modelKey = cpuCoolerModelMap[coolerModelRaw.toLowerCase().trim()];
    if (!modelKey) {
        console.warn(`  [CPU Cooler Handler] WARNING: No matching model key found in cpuCoolerModelMap for "${coolerModelRaw}".`);
        return `Sorry, I couldn't find detailed specifications for the CPU Cooler model "${coolerModelRaw}".`;
    }

    const cooler = cpuCoolerDatabase[modelKey];
    if (!cooler) {
        console.error(`  [CPU Cooler Handler] ERROR: No CPU Cooler data found in cpuCoolerDatabase for key: "${modelKey}".`);
        return `Sorry, I couldn't find full specifications for "${coolerModelRaw}". The data might be missing or incorrect.`;
    }

    // Construct the detailed response based on the cooler's properties
    let response = `The ${cooler.name} is a ${cooler.type}. `;

    if (cooler.type.includes("Air Cooler")) {
        response += `It uses a ${cooler.fanSize} fan and is rated for CPUs up to ${cooler.tdp}. `;
    } else if (cooler.type.includes("Liquid Cooler")) {
        response += `It has a ${cooler.radiatorSize} radiator and is rated for CPUs up to ${cooler.tdp}. `;
    }

    response += `It features ${cooler.rgb}. `;
    response += `Compatibility: ${cooler.compatibility}`;

    console.log('  [CPU Cooler Handler] Generated response:', response);
    return response;
}

module.exports = { handleCPUCoolerIntent };

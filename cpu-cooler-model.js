// cpu-cooler-model.js
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

    "thermalright peerless assassin 120 se": "thermalright peerless assassin 120 se", // Corrected typo here
    "peerless assassin 120 se": "thermalright peerless assassin 120 se", // Corrected typo here
    "thermalright pa120 se": "thermalright peerless assassin 120 se", // Corrected typo here
    "pa120 se": "thermalright peerless assassin 120 se", // Corrected typo here
    "peerless assassin": "thermalright peerless assassin 120 se", // Corrected typo here

    "deepcool le500 marrs": "deepcool le500 marrs",
    "le500 marrs": "deepcool le500 marrs",
    "deepcool le500": "deepcool le500 marrs",
    "le500 liquid cooler": "deepcool le500 marrs",
    "le500 aio": "deepcool le500 marrs"
};

/**
 * Handles Dialogflow intents related to CPU Cooler information.
 * @param {object} parameters - The parameters extracted by Dialogflow, including 'cpu-cooler-model' and 'cpu-cooler-detail'.
 * @param {array} inputContexts - The input contexts from Dialogflow request.
 * @param {string} projectId - The Dialogflow project ID.
 * @param {string} sessionId - The Dialogflow session ID.
 * @returns {object} An object containing fulfillmentText and outputContexts.
 */
function handleCPUCoolerIntent(parameters, inputContexts, projectId, sessionId) {
    console.log('    [CPU Cooler Handler] Called.');
    console.log('    [CPU Cooler Handler] Received parameters:', parameters);
    console.log('    [CPU Cooler Handler] Received inputContexts:', inputContexts);

    let cpuCoolerModelRaw = parameters["cpu-cooler-model"]; // Expecting 'cpu-cooler-model' from Dialogflow
    const requestedDetail = parameters["cpu-cooler-detail"]; // Expecting 'cpu-cooler-detail' for specific requests

    let cpuCoolerModelKey;
    if (cpuCoolerModelRaw) {
        const lowerCaseRaw = cpuCoolerModelRaw.toLowerCase().trim();
        cpuCoolerModelKey = cpuCoolerModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Try to get cpu-cooler-model from context if not provided in current turn
    if (!cpuCoolerModelKey && inputContexts && inputContexts.length > 0) {
        const cpuCoolerContext = inputContexts.find(context => context.name.endsWith('/contexts/cpu_cooler_details_context'));
        if (cpuCoolerContext && cpuCoolerContext.parameters && cpuCoolerContext.parameters['cpu-cooler-model']) {
            const contextCpuCoolerModelRaw = cpuCoolerContext.parameters['cpu-cooler-model'];
            const lowerCaseContextRaw = contextCpuCoolerModelRaw.toLowerCase().trim();
            cpuCoolerModelKey = cpuCoolerModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!cpuCoolerModelRaw) { cpuCoolerModelRaw = contextCpuCoolerModelRaw; } // Update raw if it was empty
            console.log('    [CPU Cooler Handler] Retrieved cpu-cooler-model from context:', cpuCoolerModelKey);
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that CPU Cooler model.';
    let outputContexts = [];

    const cooler = cpuCoolerDatabase[cpuCoolerModelKey];

    if (cooler) {
        // Handle specific detail request
        if (requestedDetail && cooler[requestedDetail]) {
            fulfillmentText = `For the ${cooler.name}, the ${requestedDetail} is: ${cooler[requestedDetail]}.`;
            console.log(`    [CPU Cooler Handler] Responding with specific detail: ${requestedDetail}`);
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${cooler.name}.`;
            console.log(`    [CPU Cooler Handler] Requested detail "${requestedDetail}" not found for ${cooler.name}.`);
        } else {
            // General info if no specific detail was requested
            let response = `The ${cooler.name} is a ${cooler.type}. `;

            if (cooler.type.includes("Air Cooler")) {
                response += `It uses a ${cooler.fanSize} fan and is rated for CPUs up to ${cooler.tdp}. `;
            } else if (cooler.type.includes("Liquid Cooler")) {
                response += `It has a ${cooler.radiatorSize} radiator and is rated for CPUs up to ${cooler.tdp}. `;
            }

            response += `It features ${cooler.rgb}. `;
            response += `Compatibility: ${cooler.compatibility}`;
            fulfillmentText = response;
            console.log('    [CPU Cooler Handler] Responding with general info.');
        }

        // Set the output context to remember the CPU Cooler model for follow-up questions
        if (cpuCoolerModelRaw) { // Ensure model is available to store in context
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/cpu_cooler_details_context`,
                lifespanCount: 5,
                parameters: {
                    'cpu-cooler-model': cpuCoolerModelRaw
                }
            });
            console.log('    [CPU Cooler Handler] Set output context: cpu_cooler_details_context');
        } else {
            console.warn('    [CPU Cooler Handler] WARNING: cpuCoolerModelRaw was empty, could not set cpu_cooler_details_context.');
        }
    } else {
        console.log(`    [CPU Cooler Handler] CPU Cooler model "${cpuCoolerModelRaw}" (key: "${cpuCoolerModelKey}") not found in database.`);
    }

    console.log('    [CPU Cooler Handler] Fulfillment Text:', fulfillmentText);
    console.log('    [CPU Cooler Handler] Output Contexts:', outputContexts);
    return { fulfillmentText, outputContexts };
}

module.exports = { handleCPUCoolerIntent };

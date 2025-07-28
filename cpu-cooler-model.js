// cpu-cooler-model.js
// CPU Cooler database
const cpuCoolerDatabase = {
    "coolmoon aosor s400": {
        name: "COOLMOON AOSOR S400",
        type: "Air Cooler",
        fan_size: "120mm", // Changed to underscore
        tdp: "Up to 130W",
        rgb: "Addressable RGB",
        compatibility: "Supports Intel LGA 1700/1200/115X and AMD AM4 sockets. Make sure your case has enough clearance for its height (approx. 155mm). The RGB requires a compatible 3-pin 5V ARGB header or controller."
    },
    "cooler master hyper 212 black edition": {
        name: "Cooler Master Hyper 212 Black Edition",
        type: "Air Cooler",
        fan_size: "120mm", // Changed to underscore
        tdp: "Up to 150W",
        rgb: "No integrated RGB",
        compatibility: "Supports Intel LGA 1700/1200/115X and AMD AM4/AM5 (with adapter kit) sockets. Check case clearance (approx. 159mm height). Reliable and quiet cooling for mid-range CPUs."
    },
    "thermalright peerless assassin 120 se": {
        name: "Thermalright Peerless Assassin 120 SE",
        type: "Dual-Tower Air Cooler",
        fan_size: "2x 120mm", // Changed to underscore
        tdp: "Up to 245W",
        rgb: "No RGB",
        compatibility: "Supports Intel LGA 1700/1200/115X and AMD AM4/AM5 sockets. Excellent performance for high-end CPUs. Ensure significant case clearance (approx. 155mm height) and check RAM clearance, especially with tall heatspreaders."
    },
    "deepcool le500 marrs": {
        name: "Deepcool LE500 MARRS",
        type: "AIO Liquid Cooler",
        radiator_size: "240mm", // Changed to underscore
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

    "thermalright peerless assassin 120 se": "thermalright peerless assassin 120 se", // Corrected map value
    "peerless assassin 120 se": "thermalright peerless assassin 120 se",
    "thermalright pa120 se": "thermalright peerless assassin 120 se",
    "pa120 se": "thermalright peerless assassin 120 se",
    "peerless assassin": "thermalright peerless assassin 120 se",

    "deepcool le500 marrs": "deepcool le500 marrs",
    "le500 marrs": "deepcool le500 marrs",
    "deepcool le500": "deepcool le500 marrs",
    "le500 liquid cooler": "deepcool le500 marrs",
    "le500 aio": "deepcool le500 marrs"
};

/**
 * Handles Dialogflow intents related to CPU Cooler information.
 * @param {object} parameters - Dialogflow extracted parameters.
 * @param {Array} inputContexts - Active contexts from Dialogflow.
 * @param {string} projectId - Google Cloud Project ID.
 * @param {string} sessionId - Dialogflow session ID.
 * @returns {object} An object with `fulfillmentText` and `outputContexts`.
 */
function handleCPUCoolerIntent(parameters, inputContexts, projectId, sessionId) {
    let coolerModelRaw = parameters["cooler-model"]; // Assuming Dialogflow parameter for cooler model

    // Assuming Dialogflow parameter for detail type is 'cpu-cooler-detail-type'
    let requestedDetail = parameters["cpu_cooler_detail_type"];
    if (Array.isArray(requestedDetail) && requestedDetail.length > 0) {
        requestedDetail = requestedDetail[0];
    }
    if (typeof requestedDetail === 'string') {
        requestedDetail = requestedDetail.toLowerCase().replace(/[\s-]/g, '_');
    }

    let modelKey;
    if (coolerModelRaw) {
        if (Array.isArray(coolerModelRaw) && coolerModelRaw.length > 0) {
            coolerModelRaw = coolerModelRaw[0];
        }
        const lowerCaseRaw = String(coolerModelRaw).toLowerCase().trim();
        modelKey = cpuCoolerModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Check 'cpu_cooler_details_context' for follow-up questions
    if (!modelKey && inputContexts && inputContexts.length > 0) {
        const coolerContext = inputContexts.find(context => context.name.endsWith('/contexts/cpu_cooler_details_context'));
        if (coolerContext && coolerContext.parameters && coolerContext.parameters['cooler-model']) {
            let contextCoolerModelRaw = coolerContext.parameters['cooler-model'];
            if (Array.isArray(contextCoolerModelRaw) && contextCoolerModelRaw.length > 0) {
                contextCoolerModelRaw = contextCoolerModelRaw[0];
            }
            const lowerCaseContextRaw = String(contextCoolerModelRaw).toLowerCase().trim();
            modelKey = cpuCoolerModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!coolerModelRaw) {
                coolerModelRaw = contextCoolerModelRaw;
            }
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that CPU Cooler model.';
    let outputContexts = [];

    const cooler = cpuCoolerDatabase[modelKey];

    // --- DEBUGGING LOGS ---
    console.log('--- handleCPUCoolerIntent Debug ---');
    console.log('Parameters received from Dialogflow:', parameters);
    console.log('coolerModelRaw (processed):', coolerModelRaw);
    console.log('requestedDetail (processed):', requestedDetail);
    console.log('modelKey (used for database lookup):', modelKey);
    console.log('Cooler object found in database:', cooler);
    if (cooler && requestedDetail) {
        console.log(`Value for cooler[${requestedDetail}]:`, cooler[requestedDetail]);
    }
    console.log('--- End Debug ---');
    // --- END DEBUGGING LOGS ---

    if (cooler) {
        if (requestedDetail && cooler[requestedDetail]) {
            // Specific attribute response
            switch (requestedDetail) {
                case "name":
                    fulfillmentText = `The name of the CPU cooler is ${cooler.name}.`;
                    break;
                case "type":
                    fulfillmentText = `The ${cooler.name} is a ${cooler.type}.`;
                    break;
                case "fan_size":
                    if (cooler.fan_size) { // Only for air coolers
                        fulfillmentText = `The ${cooler.name} uses a ${cooler.fan_size} fan.`;
                    } else {
                        fulfillmentText = `The ${cooler.name} is a liquid cooler and doesn't have a single fan size like air coolers.`;
                    }
                    break;
                case "radiator_size":
                    if (cooler.radiator_size) { // Only for liquid coolers
                        fulfillmentText = `The ${cooler.name} has a ${cooler.radiator_size} radiator.`;
                    } else {
                        fulfillmentText = `The ${cooler.name} is an air cooler and doesn't have a radiator.`;
                    }
                    break;
                case "tdp":
                    fulfillmentText = `The ${cooler.name} is rated for CPUs up to ${cooler.tdp}.`;
                    break;
                case "rgb":
                    fulfillmentText = `The ${cooler.name} features ${cooler.rgb}.`;
                    break;
                case "compatibility":
                    fulfillmentText = `Regarding compatibility for ${cooler.name}: ${cooler.compatibility}`;
                    break;
                default:
                    fulfillmentText = `For ${cooler.name}, the ${requestedDetail.replace(/_/g, ' ')} is: ${cooler[requestedDetail]}.`;
                    break;
            }
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail.replace(/_/g, ' ')} for ${cooler.name}.`;
        } else {
            // General details
            let response = `The ${cooler.name} is a ${cooler.type}. `;
            if (cooler.type.includes("Air Cooler")) {
                response += `It uses a ${cooler.fan_size} fan and is rated for CPUs up to ${cooler.tdp}. `;
            } else if (cooler.type.includes("Liquid Cooler")) {
                response += `It has a ${cooler.radiator_size} radiator and is rated for CPUs up to ${cooler.tdp}. `;
            }
            response += `It features ${cooler.rgb}. `;
            response += `Compatibility: ${cooler.compatibility}`;
            fulfillmentText = response;
        }

        // Set 'cpu_cooler_details_context'
        if (coolerModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/cpu_cooler_details_context`,
                lifespanCount: 5,
                parameters: {
                    'cooler-model': coolerModelRaw
                }
            });
        }
    } else {
        fulfillmentText = `Sorry, I couldn't find details for "${coolerModelRaw || 'that CPU Cooler model'}". Please ensure the name is correct or try another model.`;
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { cpuCoolerDatabase, cpuCoolerModelMap, handleCPUCoolerIntent };

// case-fan-model.js

// Case Fan database
const caseFanDatabase = {
    "coolmoon yx120": {
        name: "COOLMOON YX120",
        size: "120mm",
        rpm_range: "1200 RPM", // Changed to underscore for consistency
        airflow: "38 CFM",
        noise_level: "20 dBA", // Changed to underscore
        rgb: "Addressable RGB",
        compatibility: "Requires a 120mm fan mount in your PC case. For RGB, it needs a compatible motherboard header (usually 3-pin 5V ARGB) or a dedicated controller. Check if your case has enough fan mounts."
    },
    "cooler master sickleflow 120 argb": {
        name: "Cooler Master SickleFlow 120 ARGB",
        size: "120mm",
        rpm_range: "650-1800 RPM", // Changed to underscore
        airflow: "62 CFM",
        noise_level: "8-27 dBA", // Changed to underscore
        rgb: "Addressable RGB",
        compatibility: "Requires a 120mm fan mount. For ARGB, needs a compatible 3-pin 5V ARGB header or controller. Optimal for case intake/exhaust due to high airflow."
    },
    "arctic p12 pwm pst": {
        name: "Arctic P12 PWM PST",
        size: "120mm",
        rpm_range: "200-1800 RPM", // Changed to underscore
        airflow: "56.3 CFM",
        static_pressure: "2.2 mmH2O", // Changed to underscore
        noise_level: "0.3 Sone", // Changed to underscore
        rgb: "No RGB",
        compatibility: "Ideal for radiators or restricted airflow areas due to high static pressure. Uses a 4-pin PWM connector and 'PST' allows daisy-chaining fans, requiring fewer motherboard headers. Ensure your motherboard has enough PWM headers."
    }
};

// Case Fan Model Variants (mapping user inputs to database keys)
const caseFanModelMap = {
    "coolmoon yx120": "coolmoon yx120",
    "yx120": "coolmoon yx120",
    "coolmoon fan": "coolmoon yx120",
    "coolmoon yx120 fan": "coolmoon yx120",

    "cooler master sickleflow 120 argb": "cooler master sickleflow 120 argb",
    "sickleflow 120 argb": "cooler master sickleflow 120 argb",
    "cooler master sickleflow": "cooler master sickleflow 120 argb",
    "sickleflow argb": "cooler master sickleflow 120 argb",
    "sickleflow 120": "cooler master sickleflow 120 argb",

    "arctic p12 pwm pst": "arctic p12 pwm pst",
    "p12 pwm pst": "arctic p12 pwm pst",
    "arctic p12": "arctic p12 pwm pst",
    "p12 pst": "arctic p12 pwm pst",
    "arctic p12 fan": "arctic p12 pwm pst"
};

/**
 * Handles Dialogflow intents related to Case Fan information.
 * @param {object} parameters - Dialogflow extracted parameters.
 * @param {Array} inputContexts - Active contexts from Dialogflow.
 * @param {string} projectId - Google Cloud Project ID.
 * @param {string} sessionId - Dialogflow session ID.
 * @returns {object} An object with `fulfillmentText` and `outputContexts`.
 */
function handleCaseFanIntent(parameters, inputContexts, projectId, sessionId) {
    let caseFanModelRaw = parameters["case-fan-model"];

    // Assuming Dialogflow parameter for detail type is 'case-fan-detail-type'
    let requestedDetail = parameters["case-fan-detail-type"]; 
    if (Array.isArray(requestedDetail) && requestedDetail.length > 0) {
        requestedDetail = requestedDetail[0];
    }
    if (typeof requestedDetail === 'string') {
        // Convert to lowercase and replace spaces/hyphens with underscores to match database keys
        requestedDetail = requestedDetail.toLowerCase().replace(/[\s-]/g, '_'); 
    }

    let modelKey;
    if (caseFanModelRaw) {
        if (Array.isArray(caseFanModelRaw) && caseFanModelRaw.length > 0) {
            caseFanModelRaw = caseFanModelRaw[0];
        }
        const lowerCaseRaw = String(caseFanModelRaw).toLowerCase().trim();
        modelKey = caseFanModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Check 'case_fan_details_context' for follow-up questions
    if (!modelKey && inputContexts && inputContexts.length > 0) {
        const fanContext = inputContexts.find(context => context.name.endsWith('/contexts/case_fan_details_context'));
        if (fanContext && fanContext.parameters && fanContext.parameters['case-fan-model']) {
            let contextFanModelRaw = fanContext.parameters['case-fan-model'];
            if (Array.isArray(contextFanModelRaw) && contextFanModelRaw.length > 0) {
                contextFanModelRaw = contextFanModelRaw[0];
            }
            const lowerCaseContextRaw = String(contextFanModelRaw).toLowerCase().trim();
            modelKey = caseFanModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!caseFanModelRaw) {
                caseFanModelRaw = contextFanModelRaw;
            }
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that Case Fan model.';
    let outputContexts = [];

    const fan = caseFanDatabase[modelKey];

    // --- DEBUGGING LOGS ---
    console.log('--- handleCaseFanIntent Debug ---');
    console.log('Parameters received from Dialogflow:', parameters);
    console.log('caseFanModelRaw (processed):', caseFanModelRaw);
    console.log('requestedDetail (processed):', requestedDetail);
    console.log('modelKey (used for database lookup):', modelKey);
    console.log('Fan object found in database:', fan);
    if (fan && requestedDetail) {
        console.log(`Value for fan[${requestedDetail}]:`, fan[requestedDetail]);
    }
    console.log('--- End Debug ---');
    // --- END DEBUGGING LOGS ---

    if (fan) {
        if (requestedDetail && fan[requestedDetail]) {
            // Specific attribute response
            switch (requestedDetail) {
                case "name":
                    fulfillmentText = `The name of the case fan is ${fan.name}.`;
                    break;
                case "size":
                    fulfillmentText = `The ${fan.name} is a ${fan.size} case fan.`;
                    break;
                case "rpm_range":
                    fulfillmentText = `The ${fan.name} has an RPM range of ${fan.rpm_range}.`;
                    break;
                case "airflow":
                    fulfillmentText = `The ${fan.name} provides ${fan.airflow} of airflow.`;
                    break;
                case "noise_level":
                    fulfillmentText = `The noise level of the ${fan.name} is ${fan.noise_level}.`;
                    break;
                case "rgb":
                    fulfillmentText = `The ${fan.name} features ${fan.rgb}.`;
                    break;
                case "static_pressure":
                    if (fan.static_pressure) {
                        fulfillmentText = `The ${fan.name} has a static pressure of ${fan.static_pressure}.`;
                    } else {
                        fulfillmentText = `The ${fan.name} does not have a specified static pressure, or it's not its primary feature.`;
                    }
                    break;
                case "compatibility":
                    fulfillmentText = `Regarding compatibility for ${fan.name}: ${fan.compatibility}`;
                    break;
                default:
                    // Fallback for attributes not explicitly handled in switch
                    fulfillmentText = `For ${fan.name}, the ${requestedDetail.replace(/_/g, ' ')} is: ${fan[requestedDetail]}.`;
                    break;
            }
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail.replace(/_/g, ' ')} for ${fan.name}.`;
        } else {
            // General details if no specific detail was requested
            let response = `The ${fan.name} is a ${fan.size} case fan. `;
            response += `It runs at ${fan.rpm_range}, providing ${fan.airflow} airflow `;
            if (fan.static_pressure) {
                response += `with ${fan.static_pressure} static pressure, `;
            }
            response += `and has a noise level of ${fan.noise_level}. `;
            response += `It features ${fan.rgb}. `;
            response += `Compatibility: ${fan.compatibility}`;
            fulfillmentText = response;
        }

        // Set 'case_fan_details_context' to remember the current fan model for follow-up questions
        if (caseFanModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/case_fan_details_context`,
                lifespanCount: 5,
                parameters: {
                    'case-fan-model': caseFanModelRaw
                }
            });
        }
    } else {
        fulfillmentText = `Sorry, I couldn't find details for "${caseFanModelRaw || 'that Case Fan model'}". Please ensure the name is correct or try another model.`;
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { caseFanDatabase, caseFanModelMap, handleCaseFanIntent };

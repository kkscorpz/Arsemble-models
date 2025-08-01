// case-fan-model.js
const caseFanDatabase = {
    "coolmoon yx120": {
        name: "COOLMOON YX120",
        size: "120mm",
        rpmRange: "1200 RPM",
        airflow: "38 CFM",
        noiseLevel: "20 dBA",
        rgb: "Addressable RGB",
        compatibility: "Requires a 120mm fan mount in your PC case. For RGB, it needs a compatible motherboard header (usually 3-pin 5V ARGB) or a dedicated controller. Check if your case has enough fan mounts."
    },
    "cooler master sickleflow 120 argb": {
        name: "Cooler Master SickleFlow 120 ARGB",
        size: "120mm",
        rpmRange: "650-1800 RPM",
        airflow: "62 CFM",
        noiseLevel: "8-27 dBA",
        rgb: "Addressable RGB",
        compatibility: "Requires a 120mm fan mount. For ARGB, needs a compatible 3-pin 5V ARGB header or controller. Optimal for case intake/exhaust due to high airflow."
    },
    "arctic p12 pwm pst": {
        name: "Arctic P12 PWM PST",
        size: "120mm",
        rpmRange: "200-1800 RPM",
        airflow: "56.3 CFM",
        staticPressure: "2.2 mmH2O", // Specific to static pressure fans
        noiseLevel: "0.3 Sone",
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
 * @param {object} parameters - The parameters extracted by Dialogflow, including 'case-fan-model' and 'requested_detail'.
 * @param {array} inputContexts - The input contexts from Dialogflow request.
 * @param {string} projectId - The Dialogflow project ID.
 * @param {string} sessionId - The Dialogflow session ID.
 * @returns {object} An object containing fulfillmentText and outputContexts.
 */
function handleCaseFanIntent(parameters, inputContexts, projectId, sessionId) {
    console.log('   [Case Fan Handler] Called.');
    console.log('   [Case Fan Handler] Received parameters:', parameters);
    console.log('   [Case Fan Handler] Received inputContexts:', inputContexts);

    let caseFanModelRaw = parameters["case-fan-model"]; // This is the exact parameter name from Dialogflow
    const requestedDetail = parameters.requested_detail;

    let caseFanModelKey;
    if (caseFanModelRaw) {
        const lowerCaseRaw = caseFanModelRaw.toLowerCase().trim();
        caseFanModelKey = caseFanModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Try to get case-fan-model from context if not provided in current turn
    if (!caseFanModelKey && inputContexts && inputContexts.length > 0) {
        const fanContext = inputContexts.find(context => context.name.endsWith('/contexts/case_fan_details_context'));
        if (fanContext && fanContext.parameters && fanContext.parameters['case-fan-model']) {
            const contextFanModelRaw = fanContext.parameters['case-fan-model'];
            const lowerCaseContextRaw = contextFanModelRaw.toLowerCase().trim();
            caseFanModelKey = caseFanModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!caseFanModelRaw) { caseFanModelRaw = contextFanModelRaw; } // Update raw if it was empty
            console.log('   [Case Fan Handler] Retrieved case-fan-model from context:', caseFanModelKey);
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that Case Fan model.';
    let outputContexts = [];

    const fan = caseFanDatabase[caseFanModelKey];

    if (fan) {
        if (requestedDetail && fan[requestedDetail]) {
            fulfillmentText = `For the ${fan.name}, the ${requestedDetail} is: ${fan[requestedDetail]}.`;
            console.log(`   [Case Fan Handler] Responding with specific detail: ${requestedDetail}`);
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail} for ${fan.name}.`;
            console.log(`   [Case Fan Handler] Requested detail "${requestedDetail}" not found for ${fan.name}.`);
        } else {
            // General info if no specific detail was requested
            let response = `The ${fan.name} is a ${fan.size} case fan. `;
            response += `It runs at ${fan.rpmRange}, providing ${fan.airflow} airflow `;
            if (fan.staticPressure) {
                response += `with ${fan.staticPressure} static pressure, `;
            }
            response += `and has a noise level of ${fan.noiseLevel}. `;
            response += `It features ${fan.rgb}. `;
            response += `Compatibility: ${fan.compatibility}`;
            fulfillmentText = response;
            console.log('   [Case Fan Handler] Responding with general info.');
        }

        // Set the output context to remember the fan model for follow-up questions
        if (caseFanModelRaw) { // Ensure model is available to store in context
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/case_fan_details_context`,
                lifespanCount: 5,
                parameters: {
                    'case-fan-model': caseFanModelRaw
                }
            });
            console.log('   [Case Fan Handler] Set output context: case_fan_details_context');
        } else {
            console.warn('   [Case Fan Handler] WARNING: caseFanModelRaw was empty, could not set case_fan_details_context.');
        }
    } else {
        console.log(`   [Case Fan Handler] Case Fan model "${caseFanModelRaw}" (key: "${caseFanModelKey}") not found in database.`);
    }

    console.log('   [Case Fan Handler] Fulfillment Text:', fulfillmentText);
    console.log('   [Case Fan Handler] Output Contexts:', outputContexts);
    return { fulfillmentText, outputContexts };
}

module.exports = { handleCaseFanIntent };

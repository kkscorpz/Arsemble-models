// Case Fan database
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
 * @param {string} intent - The display name of the intent.
 * @param {object} parameters - The parameters extracted by Dialogflow.
 * @returns {string} The fulfillment text response.
 */
function handleCaseFanIntent(intent, parameters) {
    console.log('  [Case Fan Handler] Called for intent:', intent);
    console.log('  [Case Fan Handler] Received parameters:', parameters);

    // CRITICAL: Access the parameter using the exact name Dialogflow sends, which is 'case_fan_model' (with an underscore)
    const caseFanModelRaw = parameters["case-fan-model"];

    if (!caseFanModelRaw) {
        console.warn('  [Case Fan Handler] WARNING: "case_fan_model" parameter is missing in the request.');
        return 'Please specify the Case Fan model you are interested in (e.g., "COOLMOON YX120").';
    }

    const modelKey = caseFanModelMap[caseFanModelRaw.toLowerCase().trim()];
    if (!modelKey) {
        console.warn(`  [Case Fan Handler] WARNING: No matching model key found in caseFanModelMap for "${caseFanModelRaw}".`);
        return `Sorry, I couldn't find detailed specifications for the Case Fan model "${caseFanModelRaw}".`;
    }

    const fan = caseFanDatabase[modelKey];
    if (!fan) {
        console.error(`  [Case Fan Handler] ERROR: No Case Fan data found in caseFanDatabase for key: "${modelKey}".`);
        return `Sorry, I couldn't find full specifications for "${caseFanModelRaw}". The data might be missing or incorrect.`;
    }

    // Construct the detailed response based on the fan's properties
    let response = `The ${fan.name} is a ${fan.size} case fan. `;
    response += `It runs at ${fan.rpmRange}, providing ${fan.airflow} airflow `;
    if (fan.staticPressure) { // Include static pressure if applicable
        response += `with ${fan.staticPressure} static pressure, `;
    }
    response += `and has a noise level of ${fan.noiseLevel}. `;
    response += `It features ${fan.rgb}. `;
    response += `Compatibility: ${fan.compatibility}`;

    console.log('  [Case Fan Handler] Generated response:', response);
    return response;
}

module.exports = { handleCaseFanIntent };

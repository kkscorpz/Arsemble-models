// PSU database
const psuDatabase = {
    "corsair rm850x": {
        name: "Corsair RM850x",
        wattage: "850W",
        efficiencyRating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Suitable for most high-performance gaming PCs, especially with RTX 30-series/40-series or RX 6000/7000 series GPUs. Its modularity helps with cable management. Ensure your case has enough space for an ATX PSU."
    },
    "cooler master mwe white 750w": {
        name: "Cooler Master MWE White 750W",
        wattage: "750W",
        efficiencyRating: "80 Plus White",
        modularity: "Non-Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Suitable for most mid-range gaming PCs with single-GPU setups. Its non-modular design means all cables are fixed, so ensure good cable management in your case. Verify it has sufficient PCIe power connectors for your chosen GPU."
    },
    "corsair cx650": {
        name: "Corsair CX650",
        wattage: "650W",
        efficiencyRating: "80 Plus Bronze",
        modularity: "Non-Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Sufficient for many builds using CPUs like Ryzen 5/Intel i5 and GPUs like RTX 3050/3060 or RX 6600/6700. Like other non-modular PSUs, plan for cable management. Ensure required PCIe power connectors for your GPU."
    },
    "cougar gx-f 750w": {
        name: "Cougar GX-F 750W",
        wattage: "750W",
        efficiencyRating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "A good choice for mid to high-end systems. Its fully modular design simplifies cable management, reducing clutter in your PC build. Ensure it has enough PCIe connectors for your GPU."
    },
    "seasonic focus plus gold 550w": {
        name: "Seasonic Focus Plus Gold 550W",
        wattage: "550W",
        efficiencyRating: "80 Plus Gold",
        modularity: "Fully Modular",
        cables: "ATX 24-pin, EPS 4+4-pin, PCIe 6+2-pin, SATA, Molex",
        compatibility: "Ideal for entry-level to mid-range builds with less power-hungry GPUs (e.g., RTX 3050/3060, RX 6600). Its fully modular design is great for clean builds. Always check your GPU's minimum recommended PSU wattage."
    }
};

// PSU Model Variants (mapping user inputs to database keys)
const psuModelMap = {
    "corsair rm850x": "corsair rm850x",
    "rm850x": "corsair rm850x",
    "corsair 850w psu": "corsair rm850x",
    "850w rm850x": "corsair rm850x",
    "rm850x psu": "corsair rm850x",

    "cooler master mwe white 750w": "cooler master mwe white 750w",
    "mwe white 750w": "cooler master mwe white 750w",
    "cooler master 750w psu": "cooler master mwe white 750w",
    "750w mwe white": "cooler master mwe white 750w",
    "mwe white psu": "cooler master mwe white 750w",

    "corsair cx650": "corsair cx650",
    "cx650": "corsair cx650",
    "corsair 650w psu": "corsair cx650",
    "650w cx650": "corsair cx650",
    "cx650 psu": "corsair cx650",

    "cougar gx-f 750w": "cougar gx-f 750w",
    "gx-f 750w": "cougar gx-f 750w",
    "cougar 750w psu": "cougar gx-f 750w",
    "750w gx-f": "cougar gx-f 750w",
    "gx-f psu": "cougar gx-f 750w",

    "seasonic focus plus gold 550w": "seasonic focus plus gold 550w",
    "focus plus gold 550w": "seasonic focus plus gold 550w",
    "seasonic 550w psu": "seasonic focus plus gold 550w",
    "550w focus plus": "seasonic focus plus gold 550w",
    "focus plus psu": "seasonic focus plus gold 550w"
};

/**
 * Handles Dialogflow intents related to PSU (Power Supply Unit) information.
 * @param {string} intent - The display name of the intent.
 * @param {object} parameters - The parameters extracted by Dialogflow.
 * @returns {string} The fulfillment text response.
 */
function handlePSUIntent(intent, parameters) {
    console.log('  [PSU Handler] Called for intent:', intent);
    console.log('  [PSU Handler] Received parameters:', parameters);

    // CRITICAL: Access the parameter using the exact name Dialogflow sends, which is 'psu_model' (with an underscore)
    const psuModelRaw = parameters["psu_model"];

    if (!psuModelRaw) {
        console.warn('  [PSU Handler] WARNING: "psu_model" parameter is missing in the request.');
        return 'Please specify the Power Supply Unit model you are interested in (e.g., "Corsair RM850x").';
    }

    const modelKey = psuModelMap[psuModelRaw.toLowerCase().trim()];
    if (!modelKey) {
        console.warn(`  [PSU Handler] WARNING: No matching model key found in psuModelMap for "${psuModelRaw}".`);
        return `Sorry, I couldn't find detailed specifications for the PSU model "${psuModelRaw}".`;
    }

    const psu = psuDatabase[modelKey];
    if (!psu) {
        console.error(`  [PSU Handler] ERROR: No PSU data found in psuDatabase for key: "${modelKey}".`);
        return `Sorry, I couldn't find full specifications for "${psuModelRaw}". The data might be missing or incorrect.`;
    }

    // Construct the detailed response
    let response = `The ${psu.name} is a ${psu.wattage}, ${psu.efficiencyRating} certified, ${psu.modularity} power supply. `;
    response += `It typically includes cables for ${psu.cables}. `;
    response += `Compatibility: ${psu.compatibility}`;

    console.log('  [PSU Handler] Generated response:', response);
    return response;
}

module.exports = { handlePSUIntent };

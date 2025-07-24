// Motherboard database
const motherboardDatabase = {
    "asus prime b550m-k": {
        name: "ASUS PRIME B550M-K",
        socket: "AM4",
        chipset: "B550",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 128GB",
        features: "PCIe 4.0, HDMI, DVI-D, Realtek audio, 1Gb LAN",
        compatibility: "Ryzen 3000/5000 series (excluding 3200G/3400G without BIOS update)"
    },
    "msi b450m a pro max ii": {
        name: "MSI B450M A PRO MAX II",
        socket: "AM4",
        chipset: "B450",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 64GB",
        features: "PCIe 3.0, HDMI, DVI, USB 3.2 Gen1, basic VRM",
        compatibility: "Supports Ryzen 1000 to 5000 series with BIOS update"
    },
    "msi pro h610m s ddr4": {
        name: "MSI PRO H610M-S DDR4",
        socket: "LGA 1700",
        chipset: "H610",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 64GB",
        features: "Basic IO, 1x PCIe x16, HDMI, VGA, 1Gb LAN",
        compatibility: "Supports 12th/13th/14th Gen Intel CPUs"
    },
    "ramsta rs-b450mp": {
        name: "RAMSTA RS-B450MP",
        socket: "AM4",
        chipset: "B450",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 64GB",
        features: "Entry-level, basic IO ports",
        compatibility: "Supports Ryzen 1000 to 5000 series (BIOS update may be needed)"
    },
    "ramsta rs-h311d4": {
        name: "RAMSTA RS-H311D4",
        socket: "LGA 1151",
        chipset: "H310",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 32GB",
        features: "Legacy board, VGA/HDMI, USB 3.0",
        compatibility: "Supports Intel 8th/9th Gen CPUs (Coffee Lake)"
    },
    "msi b650m gaming plus wifi": {
        name: "MSI B650M Gaming Plus WiFi",
        socket: "AM5",
        chipset: "B650",
        formFactor: "Micro-ATX",
        memorySupport: "DDR5, up to 128GB",
        features: "WiFi 6E, PCIe 4.0, 2.5Gb LAN, USB-C",
        compatibility: "Supports Ryzen 7000/8000 series"
    },
    "msi b760m gaming plus wifi ddr4": {
        name: "MSI B760M Gaming Plus WiFi DDR4",
        socket: "LGA 1700",
        chipset: "B760",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 128GB",
        features: "PCIe 5.0, WiFi 6, HDMI/DP, 2.5Gb LAN",
        compatibility: "Supports Intel 12th/13th/14th Gen CPUs"
    },
    "gigabyte h610m k ddr4": {
        name: "GIGABYTE H610M K DDR4",
        socket: "LGA 1700",
        chipset: "H610",
        formFactor: "Micro-ATX",
        memorySupport: "DDR4, up to 64GB",
        features: "HDMI, VGA, Realtek audio, PCIe 4.0",
        compatibility: "Supports Intel 12th/13th/14th Gen CPUs"
    }
};

// Motherboard Model Variants (mapping user inputs to database keys)
// Ensure these map correctly to your database keys. Expand as needed for more synonyms.
const motherboardModelMap = {
    "asus prime b550m-k": "asus prime b550m-k",
    "prime b550m-k": "asus prime b550m-k",
    "b550m-k": "asus prime b550m-k",
    "asus b550m-k": "asus prime b550m-k",

    "msi b450m a pro max ii": "msi b450m a pro max ii",
    "b450m a pro max ii": "msi b450m a pro max ii",
    "msi b450m-a pro max ii": "msi b450m a pro max ii",
    "b450m-a pro max ii": "msi b450m a pro max ii",
    "msi b450m-a": "msi b450m a pro max ii",

    "msi pro h610m s ddr4": "msi pro h610m s ddr4",
    "pro h610m s ddr4": "msi pro h610m s ddr4",
    "h610m s ddr4": "msi pro h610m s ddr4",
    "msi h610m-s ddr4": "msi pro h610m s ddr4",

    "ramsta rs-b450mp": "ramsta rs-b450mp",
    "rs-b450mp": "ramsta rs-b450mp",
    "ramsta b450mp": "ramsta rs-b450mp",

    "ramsta rs-h311d4": "ramsta rs-h311d4",
    "rs-h311d4": "ramsta rs-h311d4",
    "ramsta h311d4": "ramsta rs-h311d4",

    "msi b650m gaming plus wifi": "msi b650m gaming plus wifi",
    "b650m gaming plus wifi": "msi b650m gaming plus wifi",
    "msi b650m wifi": "msi b650m gaming plus wifi",

    "msi b760m gaming plus wifi ddr4": "msi b760m gaming plus wifi ddr4",
    "b760m gaming plus wifi ddr4": "msi b760m gaming plus wifi ddr4",
    "msi b760m wifi ddr4": "msi b760m gaming plus wifi ddr4",

    "gigabyte h610m k ddr4": "gigabyte h610m k ddr4",
    "h610m k ddr4": "gigabyte h610m k ddr4",
    "gigabyte h610m ddr4": "gigabyte h610m k ddr4"
};

/**
 * Handles Dialogflow intents related to Motherboard information.
 * @param {string} intent - The display name of the intent.
 * @param {object} parameters - The parameters extracted by Dialogflow.
 * @returns {string} The fulfillment text response.
 */
function handleMotherboardIntent(intent, parameters) {
    console.log('  [MB Handler] Called for intent:', intent);
    console.log('  [MB Handler] Received parameters:', parameters);

    // CRITICAL: Access the parameter using the exact name Dialogflow sends (lowercase 'motherboard-model')
    const rawModel = parameters["motherboard-model"];

    if (!rawModel) {
        console.warn('  [MB Handler] WARNING: "motherboard-model" parameter is missing in the request.');
        return 'Please specify the motherboard model you are interested in (e.g., "ASUS PRIME B550M-K").';
    }

    const modelKey = motherboardModelMap[rawModel.toLowerCase().trim()];
    if (!modelKey) {
        console.warn(`  [MB Handler] WARNING: No matching model key found in motherboardModelMap for "${rawModel}".`);
        return `Sorry, I couldn't find detailed specifications for the motherboard model "${rawModel}".`;
    }

    const mb = motherboardDatabase[modelKey];
    if (!mb) {
        console.error(`  [MB Handler] ERROR: No motherboard data found in motherboardDatabase for key: "${modelKey}".`);
        return `Sorry, I couldn't find full specifications for "${rawModel}". The data might be missing or incorrect.`;
    }

    // Construct the detailed response
    let response = `The ${mb.name} uses the ${mb.socket} socket with the ${mb.chipset} chipset. `;
    response += `It is a ${mb.formFactor} board supporting ${mb.memorySupport}. `;
    response += `Key features include: ${mb.features}. `;
    response += `Compatibility: ${mb.compatibility}.`;

    console.log('  [MB Handler] Generated response:', response);
    return response;
}

module.exports = { handleMotherboardIntent };

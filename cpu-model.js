// cpu-model.js

// This database holds the actual specifications for each CPU, now including price.
// Keys here MUST be all lowercase to match the normalized input from Dialogflow.
const cpuDatabase = {
    "intel core i9-14900k": {
        name: "Intel Core i9-14900K",
        price: "₱39,000",
        socket: "LGA 1700",
        baseClock: "3.2 GHz (P), 2.4 GHz (E)",
        coresThreads: "24 cores (8P + 16E), 32 threads",
        tdp: "125W TDP / 253W max",
        compatibility: "Intel 600/700 series chipsets, BIOS update may be needed, Z790 recommended, requires strong cooling (240mm+), 750W+ PSU"
    },
    "intel core i7-14700k": {
        name: "Intel Core i7-14700K",
        price: "₱29,000",
        socket: "LGA 1700",
        baseClock: "3.4 GHz (P), 2.5 GHz (E)",
        coresThreads: "20 cores (8P + 12E), 28 threads",
        tdp: "125W TDP / 253W max",
        compatibility: "Z790 or B760, high-performance cooling, 750W+ PSU"
    },
    "intel core i7-13700k": {
        name: "Intel Core i7-13700K",
        price: "₱25,000",
        socket: "LGA 1700",
        baseClock: "~3.4 GHz (P), ~2.5 GHz (E)",
        coresThreads: "16 cores (8P + 8E), 24 threads",
        tdp: "125W TDP / 253W max",
        compatibility: "Z790 or B760, strong cooling, 700W+ PSU"
    },
    "intel core i5-14600k": {
        name: "Intel Core i5-14600K",
        price: "₱19,000",
        socket: "LGA 1700",
        baseClock: "3.5 GHz (P), 2.6 GHz (E)",
        coresThreads: "14 cores (6P + 8E), 20 threads",
        tdp: "125W TDP / 181W max",
        compatibility: "B760 or Z790, mid to high-end cooling, 650W+ PSU"
    },
    "intel core i5-14500": {
        name: "Intel Core i5-14500",
        price: "₱15,000",
        socket: "LGA 1700",
        baseClock: "2.6 GHz (P), 1.9 GHz (E)",
        coresThreads: "14 cores (6P + 8E), 20 threads",
        tdp: "65W TDP / 154W max",
        compatibility: "B760 or H610, basic cooling, 550W+ PSU"
    },
    "intel core i5-13400": {
        name: "Intel Core i5-13400",
        price: "₱13,000",
        socket: "LGA 1700",
        baseClock: "2.5 GHz (P), 1.8 GHz (E)",
        coresThreads: "10 cores (6P + 4E), 16 threads",
        tdp: "65W TDP / 148W max",
        compatibility: "H610 or B760, basic cooling, 500W+ PSU"
    },
    "intel core i3-14100": {
        name: "Intel Core i3-14100",
        price: "₱8,000",
        socket: "LGA 1700",
        baseClock: "3.5 GHz (P)",
        coresThreads: "4 cores (P only), 8 threads",
        tdp: "60W TDP / 110W max",
        compatibility: "H610 or B760, stock or basic cooling, 450W+ PSU"
    },
    "intel core i3-13100": {
        name: "Intel Core i3-13100",
        price: "₱7,500",
        socket: "LGA 1700",
        baseClock: "3.4 GHz (P)",
        coresThreads: "4 cores, 8 threads",
        tdp: "60W TDP / ~89W max",
        compatibility: "H610 or B760, stock or basic cooling, 450W+ PSU"
    },
    "amd ryzen 9 7950x": {
        name: "AMD Ryzen 9 7950X",
        price: "₱34,000",
        socket: "AM5",
        baseClock: "4.5 GHz",
        coresThreads: "16 cores / 32 threads",
        tdp: "170W TDP / 230W max",
        compatibility: "AM5 boards (X670E/X670/B650E), DDR5 only, 360mm+ AIO, 850W+ PSU"
    },
    "amd ryzen 9 9900x": {
        name: "AMD Ryzen 9 9900X",
        price: "TBD",
        socket: "AM5 (expected)",
        baseClock: "TBD",
        coresThreads: "TBD",
        tdp: "TBD",
        compatibility: "Expected AM5 + DDR5 + high cooling"
    },
    "amd ryzen 9 9900x3d": {
        name: "AMD Ryzen 9 9900X3D",
        price: "TBD",
        socket: "AM5 (expected)",
        baseClock: "TBD",
        coresThreads: "TBD",
        tdp: "TBD",
        compatibility: "Expected AM5, DDR5, advanced cooling due to 3D V-Cache"
    },
    "amd ryzen 7 7700x": {
        name: "AMD Ryzen 7 7700X",
        price: "₱21,000",
        socket: "AM5",
        baseClock: "4.5 GHz",
        coresThreads: "8 cores / 16 threads",
        tdp: "105W TDP",
        compatibility: "AM5 only, DDR5 only, 240mm AIO or mid-high air cooling, 650W+ PSU"
    },
    "amd ryzen 7 5700x": {
        name: "AMD Ryzen 7 5700X",
        price: "₱14,000",
        socket: "AM4",
        baseClock: "3.4 GHz",
        coresThreads: "8 cores / 16 threads",
        tdp: "65W TDP",
        compatibility: "AM4 boards (B550, X570), DDR4, BIOS update may be needed, 550W+ PSU"
    },
    "amd ryzen 5 5600x": {
        name: "AMD Ryzen 5 5600X",
        price: "₱11,000",
        socket: "AM4",
        baseClock: "3.7 GHz",
        coresThreads: "6 cores / 12 threads",
        tdp: "65W TDP",
        compatibility: "AM4 DDR4, B550/X570, basic to mid-air cooling, 550W+ PSU"
    },
    "amd ryzen 5 5600g": {
        name: "AMD Ryzen 5 5600G",
        price: "₱9,000",
        socket: "AM4",
        baseClock: "3.9 GHz",
        coresThreads: "6 cores / 12 threads",
        tdp: "65W TDP",
        compatibility: "AM4 DDR4, integrated GPU, stock cooling OK, 450W+ PSU"
    },
    "amd ryzen 3 3200g": {
        name: "AMD Ryzen 3 3200G",
        price: "₱5,000",
        socket: "AM4",
        baseClock: "3.6 GHz",
        coresThreads: "4 cores / 4 threads",
        tdp: "65W TDP",
        compatibility: "AM4, Vega graphics, stock cooler OK, 400W+ PSU"
    }
};

// This map helps convert various user inputs (synonyms) into the standard keys
// used in cpuDatabase. All keys here should be lowercase.
const cpuModelMap = {
    // Intel CPUs
    "intel core i9-14900k": "intel core i9-14900k", "core i9-14900k": "intel core i9-14900k", "i9-14900k": "intel core i9-14900k", "intel i9-14900k": "intel core i9-14900k", "14900k": "intel core i9-14900k", "intel core i9 14900k": "intel core i9-14900k", "core i9 14900k": "intel core i9-14900k", "i9 14900k": "intel core i9-14900k",
    "intel core i7-14700k": "intel core i7-14700k", "core i7-14700k": "intel core i7-14700k", "i7-14700k": "intel core i7-14700k", "intel i7-14700k": "intel core i7-14700k", "14700k": "intel core i7-14700k", "intel core i7 14700k": "intel core i7-14700k", "core i7 14700k": "intel core i7-14700k", "i7 14700k": "intel core i7-14700k",
    "intel core i7-13700k": "intel core i7-13700k", "core i7-13700k": "intel core i7-13700k", "i7-13700k": "intel core i7-13700k", "intel i7-13700k": "intel core i7-13700k", "13700k": "intel core i7-13700k", "intel core i7 13700k": "intel core i7-13700k", "core i7 13700k": "intel core i7-13700k", "i7 13700k": "intel core i7-13700k",
    "intel core i5-14600k": "intel core i5-14600k", "core i5-14600k": "intel core i5-14600k", "i5-14600k": "intel core i5-14600k", "intel i5-14600k": "intel core i5-14600k", "14600k": "intel core i5-14600k", "intel core i5 14600k": "intel core i5-14600k", "core i5 14600k": "intel core i5-14600k", "i5 14600k": "intel core i5-14600k",
    "intel core i5-14500": "intel core i5-14500", "core i5-14500": "intel core i5-14500", "i5-14500": "intel core i5-14500", "intel i5-14500": "intel core i5-14500", "14500": "intel core i5-14500", "intel core i5 14500": "intel core i5-14500", "core i5 14500": "intel core i5-14500", "i5 14500": "intel core i5-14500",
    "intel core i5-13400": "intel core i5-13400", "core i5-13400": "intel core i5-13400", "i5-13400": "intel core i5-13400", "intel i5-13400": "intel core i5-13400", "13400": "intel core i5-13400", "intel core i5 13400": "intel core i5-13400", "core i5 13400": "intel core i5-13400", "i5 13400": "intel core i5-13400",
    "intel core i3-14100": "intel core i3-14100", "core i3-14100": "intel core i3-14100", "i3-14100": "intel core i3-14100", "intel i3-14100": "intel core i3-14100", "14100": "intel core i3-14100", "intel core i3 14100": "intel core i3-14100", "core i3 14100": "intel core i3-14100", "i3 14100": "intel core i3-14100",
    "intel core i3-13100": "intel core i3-13100", "core i3-13100": "intel core i3-13100", "i3-13100": "intel core i3-13100", "intel i3-13100": "intel core i3-13100", "13100": "intel core i3-13100", "intel core i3 13100": "intel core i3-13100", "core i3 13100": "intel core i3-13100", "i3 13100": "intel core i3-13100",

    // AMD CPUs
    "amd ryzen 9 7950x": "amd ryzen 9 7950x", "ryzen 9 7950x": "amd ryzen 9 7950x", "7950x": "amd ryzen 9 7950x", "amd 7950x": "amd ryzen 9 7950x", "ryzen9 7950x": "amd ryzen 9 7950x", "ryzen 9 7950 x": "amd ryzen 9 7950x",
    "amd ryzen 9 9900x": "amd ryzen 9 9900x", "ryzen 9 9900x": "amd ryzen 9 9900x", "9900x": "amd ryzen 9 9900x", "amd 9900x": "amd ryzen 9 9900x", "ryzen9 9900x": "amd ryzen 9 9900x", "ryzen 9 9900 x": "amd ryzen 9 9900x",
    "amd ryzen 9 9900x3d": "amd ryzen 9 9900x3d", "ryzen 9 9900x3d": "amd ryzen 9 9900x3d", "9900x3d": "amd ryzen 9 9900x3d", "amd 9900x3d": "amd ryzen 9 9900x3d", "ryzen9 9900x3d": "amd ryzen 9 9900x3d", "ryzen 9 9900 x3d": "amd ryzen 9 9900x3d",
    "amd ryzen 7 7700x": "amd ryzen 7 7700x", "ryzen 7 7700x": "amd ryzen 7 7700x", "7700x": "amd ryzen 7 7700x", "amd 7700x": "amd ryzen 7 7700x", "ryzen7 7700x": "amd ryzen 7 7700x", "ryzen 7 7700 x": "amd ryzen 7 7700x",
    "amd ryzen 7 5700x": "amd ryzen 7 5700x", "ryzen 7 5700x": "amd ryzen 7 5700x", "5700x": "amd ryzen 7 5700x", "amd 5700x": "amd ryzen 7 5700x", "ryzen7 5700x": "amd ryzen 7 5700x", "ryzen 7 5700 x": "amd ryzen 7 5700x",
    "amd ryzen 5 5600x": "amd ryzen 5 5600x", "ryzen 5 5600x": "amd ryzen 5 5600x", "5600x": "amd ryzen 5 5600x", "amd 5600x": "amd ryzen 5 5600x", "ryzen5 5600x": "amd ryzen 5 5600x", "ryzen 5 5600 x": "amd ryzen 5 5600x",
    "amd ryzen 5 5600g": "amd ryzen 5 5600g", "ryzen 5 5600g": "amd ryzen 5 5600g", "5600g": "amd ryzen 5 5600g", "amd 5600g": "amd ryzen 5 5600g", "ryzen5 5600g": "amd ryzen 5 5600g", "ryzen 5 5600 g": "amd ryzen 5 5600g",
    "amd ryzen 3 3200g": "amd ryzen 3 3200g", "ryzen 3 3200g": "amd ryzen 3 3200g", "3200g": "amd ryzen 3 3200g", "amd 3200g": "amd ryzen 3 3200g", "ryzen3 3200g": "amd ryzen 3 3200g", "ryzen 3 3200 g": "amd ryzen 3 3200g",
};

/**
 * Handles Dialogflow intents related to CPU information.
 * It extracts the CPU model parameter and retrieves its details from the cpuDatabase.
 * @param {string} intent - The display name of the intent. (e.g., 'Get_CPU_Details')
 * @param {object} parameters - The parameters extracted by Dialogflow, including the 'cpu-model'.
 * @returns {string} The fulfillment text response.
 */
function handleCPUIntent(intent, parameters) {
    console.log('   [CPU Handler] Called for intent:', intent);
    console.log('   [CPU Handler] Received parameters:', parameters);

    // Get the raw CPU model value from Dialogflow's parameters.
    const cpuModelRaw = parameters["cpu-model"];
    const requestedDetail = parameters['cpu_detail_type']; // NEW: Get the detail-type parameter

    if (!cpuModelRaw) {
        console.warn('   [CPU Handler] WARNING: "cpu-model" parameter is missing. Dialogflow did not extract the CPU model.');
        return 'Please specify the exact CPU model you are interested in (e.g., "Intel Core i5-14500").';
    }

    // Normalize the input from Dialogflow: convert to lowercase and remove extra spaces.
    const normalizedCpuModel = cpuModelRaw.toLowerCase().trim();

    // Use the cpuModelMap to find the standardized key for the cpuDatabase.
    const modelKey = cpuModelMap[normalizedCpuModel];

    if (!modelKey) {
        console.warn(`   [CPU Handler] WARNING: No matching model key found in cpuModelMap for normalized input: "${normalizedCpuModel}".`);
        return `Sorry, I couldn't find detailed specifications for the CPU model "${cpuModelRaw}". Please check the spelling or try a different model.`;
    }

    // Retrieve the CPU data from the cpuDatabase using the standardized key.
    const cpu = cpuDatabase[modelKey];

    if (!cpu) {
        console.error(`   [CPU Handler] ERROR: No CPU data found in cpuDatabase for canonical key: "${modelKey}". This indicates a mismatch between cpuModelMap and cpuDatabase.`);
        return `Sorry, I found "${cpuModelRaw}" but couldn't retrieve its full specifications. The data might be missing or incorrect.`;
    }

    // NEW: Check if a specific detail type was requested.
    const detailType = requestedDetail ? requestedDetail.toLowerCase() : null;
    const availableDetails = ['price', 'socket', 'baseClock', 'coresThreads', 'tdp', 'compatibility'];

    if (detailType && availableDetails.includes(detailType)) {
        // Return a short, focused response with only the requested detail.
        const detailValue = cpu[detailType];
        if (detailValue) {
            return `The ${detailType} of the ${cpu.name} is ${detailValue}.`;
        } else {
            return `I'm sorry, the ${detailType} information for the ${cpu.name} is not available.`;
        }
    } else {
        // Construct the detailed, user-friendly response if no specific detail was requested.
        let response = `Here are the details for the ${cpu.name}: `;
        response += `It has ${cpu.coresThreads} and a base clock speed of ${cpu.baseClock}. `;
        response += `It uses the ${cpu.socket} socket and has a TDP (Thermal Design Power) of ${cpu.tdp}. `;
        response += `For compatibility, it works with ${cpu.compatibility}.`;
        
        // Add a price note if it's available.
        if (cpu.price && cpu.price !== "TBD") {
            response += ` The estimated price is ${cpu.price}.`;
        } else if (cpu.price === "TBD") {
            response += " Pricing is not yet available for this model.";
        }

        console.log('   [CPU Handler] Generated response:', response);
        return response;
    }
}

// Export the handler function so it can be imported by index.js
module.exports = { handleCPUIntent };

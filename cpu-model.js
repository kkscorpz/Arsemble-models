// CPU database
const cpuDatabase = {
    "intel core i9-14900k": {
        name: "Intel Core i9-14900K",
        socket: "LGA 1700",
        base_clock: "3.2 GHz (P), 2.4 GHz (E)", // Changed to underscore
        cores_threads: "24 cores (8P + 16E), 32 threads", // Changed to underscore
        tdp: "125W TDP / 253W max",
        compatibility: "Intel 600/700 series chipsets, BIOS update may be needed, Z790 recommended, requires strong cooling (240mm+), 750W+ PSU"
    },
    "intel core i7-14700k": {
        name: "Intel Core i7-14700K",
        socket: "LGA 1700",
        base_clock: "3.4 GHz (P), 2.5 GHz (E)",
        cores_threads: "20 cores (8P + 12E), 28 threads",
        tdp: "125W TDP / 253W max",
        compatibility: "Z790 or B760, high-performance cooling, 750W+ PSU"
    },
    "intel core i7-13700k": {
        name: "Intel Core i7-13700K",
        socket: "LGA 1700",
        base_clock: "~3.4 GHz (P), ~2.5 GHz (E)",
        cores_threads: "16 cores (8P + 8E), 24 threads",
        tdp: "125W TDP / 253W max",
        compatibility: "Z790 or B760, strong cooling, 700W+ PSU"
    },
    "intel core i5-14600k": {
        name: "Intel Core i5-14600K",
        socket: "LGA 1700",
        base_clock: "3.5 GHz (P), 2.6 GHz (E)",
        cores_threads: "14 cores (6P + 8E), 20 threads",
        tdp: "125W TDP / 181W max",
        compatibility: "B760 or Z790, mid to high-end cooling, 650W+ PSU"
    },
    "intel core i5-14500": {
        name: "Intel Core i5-14500",
        socket: "LGA 1700",
        base_clock: "2.6 GHz (P), 1.9 GHz (E)",
        cores_threads: "14 cores (6P + 8E), 20 threads",
        tdp: "65W TDP / 154W max",
        compatibility: "B760 or H610, basic cooling, 550W+ PSU"
    },
    "intel core i5-13400": {
        name: "Intel Core i5-13400",
        socket: "LGA 1700",
        base_clock: "2.5 GHz (P), 1.8 GHz (E)",
        cores_threads: "10 cores (6P + 4E), 16 threads",
        tdp: "65W TDP / 148W max",
        compatibility: "H610 or B760, basic cooling, 500W+ PSU"
    },
    "intel core i3-14100": {
        name: "Intel Core i3-14100",
        socket: "LGA 1700",
        base_clock: "3.5 GHz (P)",
        cores_threads: "4 cores (P only), 8 threads",
        tdp: "60W TDP / 110W max",
        compatibility: "H610 or B760, stock or basic cooling, 450W+ PSU"
    },
    "intel core i3-13100": {
        name: "Intel Core i3-13100",
        socket: "LGA 1700",
        base_clock: "3.4 GHz (P)",
        cores_threads: "4 cores, 8 threads",
        tdp: "60W TDP / ~89W max",
        compatibility: "H610 or B760, stock or basic cooling, 450W+ PSU"
    },
    "amd ryzen 9 7950x": {
        name: "AMD Ryzen 9 7950X",
        socket: "AM5",
        base_clock: "4.5 GHz",
        cores_threads: "16 cores / 32 threads",
        tdp: "170W TDP / 230W max",
        compatibility: "AM5 boards (X670E/X670/B650E), DDR5 only, 360mm+ AIO, 850W+ PSU"
    },
    "amd ryzen 9 9900x": {
        name: "AMD Ryzen 9 9900X",
        socket: "AM5 (expected)",
        base_clock: "TBD",
        cores_threads: "TBD",
        tdp: "TBD",
        compatibility: "Expected AM5 + DDR5 + high cooling"
    },
    "amd ryzen 9 9900x3d": {
        name: "AMD Ryzen 9 9900X3D",
        socket: "AM5 (expected)",
        base_clock: "TBD",
        cores_threads: "TBD",
        tdp: "TBD",
        compatibility: "Expected AM5, DDR5, advanced cooling due to 3D V-Cache"
    },
    "amd ryzen 7 7700x": {
        name: "AMD Ryzen 7 7700X",
        socket: "AM5",
        base_clock: "4.5 GHz",
        cores_threads: "8 cores / 16 threads",
        tdp: "105W TDP",
        compatibility: "AM5 only, DDR5 only, 240mm AIO or mid-high air cooling, 650W+ PSU"
    },
    "amd ryzen 7 5700x": {
        name: "AMD Ryzen 7 5700X",
        socket: "AM4",
        base_clock: "3.4 GHz",
        cores_threads: "8 cores / 16 threads",
        tdp: "65W TDP",
        compatibility: "AM4 boards (B550, X570), DDR4, BIOS update may be needed, 550W+ PSU"
    },
    "amd ryzen 5 5600x": {
        name: "AMD Ryzen 5 5600X",
        socket: "AM4",
        base_clock: "3.7 GHz",
        cores_threads: "6 cores / 12 threads",
        tdp: "65W TDP",
        compatibility: "AM4 DDR4, B550/X570, basic to mid-air cooling, 550W+ PSU"
    },
    "amd ryzen 5 5600g": {
        name: "AMD Ryzen 5 5600G",
        socket: "AM4",
        base_clock: "3.9 GHz",
        cores_threads: "6 cores / 12 threads",
        tdp: "65W TDP",
        compatibility: "AM4 DDR4, integrated GPU, stock cooling OK, 450W+ PSU"
    },
    "amd ryzen 3 3200g": {
        name: "AMD Ryzen 3 3200G",
        socket: "AM4",
        base_clock: "3.6 GHz",
        cores_threads: "4 cores / 4 threads",
        tdp: "65W TDP",
        compatibility: "AM4, Vega graphics, stock cooler OK, 400W+ PSU"
    }
};

// CPU Model Variants (mapping user inputs to database keys)
// Ensure these keys exactly match the keys in cpuDatabase
const cpuModelMap = {
    "intel core i9-14900k": "intel core i9-14900k",
    "core i9-14900k": "intel core i9-14900k",
    "i9-14900k": "intel core i9-14900k",
    "intel i9-14900k": "intel core i9-14900k",

    "intel core i7-14700k": "intel core i7-14700k",
    "core i7-14700k": "intel core i7-14700k",
    "i7-14700k": "intel core i7-14700k",
    "intel i7-14700k": "intel core i7-14700k",

    "intel core i7-13700k": "intel core i7-13700k",
    "core i7-13700k": "intel core i7-13700k",
    "i7-13700k": "intel core i7-13700k",
    "intel i7-13700k": "intel core i7-13700k",

    "intel core i5-14600k": "intel core i5-14600k",
    "core i5-14600k": "intel core i5-14600k",
    "i5-14600k": "intel core i5-14600k",
    "intel i5-14600k": "intel core i5-14600k",

    "intel core i5-14500": "intel core i5-14500",
    "core i5-14500": "intel core i5-14500",
    "i5-14500": "intel core i5-14500",
    "intel i5-14500": "intel core i5-14500",

    "intel core i5-13400": "intel core i5-13400",
    "core i5-13400": "intel core i5-13400",
    "i5-13400": "intel core i5-13400",
    "intel i5-13400": "intel core i5-13400",

    "intel core i3-14100": "intel core i3-14100",
    "core i3-14100": "intel core i3-14100",
    "i3-14100": "intel core i3-14100",
    "intel i3-14100": "intel core i3-14100",

    "intel core i3-13100": "intel core i3-13100",
    "core i3-13100": "intel core i3-13100",
    "i3-13100": "intel core i3-13100",
    "intel i3-13100": "intel core i3-13100",

    "amd ryzen 9 7950x": "amd ryzen 9 7950x",
    "ryzen 9 7950x": "amd ryzen 9 7950x",
    "7950x": "amd ryzen 9 7950x",

    "amd ryzen 9 9900x": "amd ryzen 9 9900x",
    "ryzen 9 9900x": "amd ryzen 9 9900x",
    "9900x": "amd ryzen 9 9900x",

    "amd ryzen 9 9900x3d": "amd ryzen 9 9900x3d",
    "ryzen 9 9900x3d": "amd ryzen 9 9900x3d",
    "9900x3d": "amd ryzen 9 9900x3d",

    "amd ryzen 7 7700x": "amd ryzen 7 7700x",
    "ryzen 7 7700x": "amd ryzen 7 7700x",
    "7700x": "amd ryzen 7 7700x",

    "amd ryzen 7 5700x": "amd ryzen 7 5700x",
    "ryzen 7 5700x": "amd ryzen 7 5700x",
    "5700x": "amd ryzen 7 5700x",

    "amd ryzen 5 5600x": "amd ryzen 5 5600x",
    "ryzen 5 5600x": "amd ryzen 5 5600x",
    "5600x": "amd ryzen 5 5600x",

    "amd ryzen 5 5600g": "amd ryzen 5 5600g",
    "ryzen 5 5600g": "amd ryzen 5 5600g",
    "5600g": "amd ryzen 5 5600g",

    "amd ryzen 3 3200g": "amd ryzen 3 3200g",
    "ryzen 3 3200g": "amd ryzen 3 3200g",
    "3200g": "amd ryzen 3 3200g",
};

/**
 * Handles Dialogflow intents related to CPU information.
 * @param {object} parameters - Dialogflow extracted parameters.
 * @param {Array} inputContexts - Active contexts from Dialogflow.
 * @param {string} projectId - Google Cloud Project ID.
 * @param {string} sessionId - Dialogflow session ID.
 * @returns {object} An object with `fulfillmentText` and `outputContexts`.
 */
function handleCPUIntent(parameters, inputContexts, projectId, sessionId) {
    let cpuModelRaw = parameters["cpu-model"]; // Assuming Dialogflow parameter for CPU model

    // Assuming Dialogflow parameter for detail type is 'cpu-detail-type'
    let requestedDetail = parameters["cpu_detail_type"];
    if (Array.isArray(requestedDetail) && requestedDetail.length > 0) {
        requestedDetail = requestedDetail[0];
    }
    if (typeof requestedDetail === 'string') {
        requestedDetail = requestedDetail.toLowerCase().replace(/[\s-]/g, '_');
    }

    let modelKey;
    if (cpuModelRaw) {
        if (Array.isArray(cpuModelRaw) && cpuModelRaw.length > 0) {
            cpuModelRaw = cpuModelRaw[0];
        }
        const lowerCaseRaw = String(cpuModelRaw).toLowerCase().trim();
        modelKey = cpuModelMap[lowerCaseRaw] || lowerCaseRaw;
    }

    // Check 'cpu_details_context' for follow-up questions
    if (!modelKey && inputContexts && inputContexts.length > 0) {
        const cpuContext = inputContexts.find(context => context.name.endsWith('/contexts/cpu_details_context'));
        if (cpuContext && cpuContext.parameters && cpuContext.parameters['cpu-model']) {
            let contextCpuModelRaw = cpuContext.parameters['cpu-model'];
            if (Array.isArray(contextCpuModelRaw) && contextCpuModelRaw.length > 0) {
                contextCpuModelRaw = contextCpuModelRaw[0];
            }
            const lowerCaseContextRaw = String(contextCpuModelRaw).toLowerCase().trim();
            modelKey = cpuModelMap[lowerCaseContextRaw] || lowerCaseContextRaw;
            if (!cpuModelRaw) {
                cpuModelRaw = contextCpuModelRaw;
            }
        }
    }

    let fulfillmentText = 'Sorry, I couldn\'t find details for that CPU model.';
    let outputContexts = [];

    const cpu = cpuDatabase[modelKey];

    // --- DEBUGGING LOGS ---
    console.log('--- handleCPUIntent Debug ---');
    console.log('Parameters received from Dialogflow:', parameters);
    console.log('cpuModelRaw (processed):', cpuModelRaw);
    console.log('requestedDetail (processed):', requestedDetail);
    console.log('modelKey (used for database lookup):', modelKey);
    console.log('CPU object found in database:', cpu);
    if (cpu && requestedDetail) {
        console.log(`Value for cpu[${requestedDetail}]:`, cpu[requestedDetail]);
    }
    console.log('--- End Debug ---');
    // --- END DEBUGGING LOGS ---

    if (cpu) {
        if (requestedDetail && cpu[requestedDetail]) {
            // Specific attribute response
            switch (requestedDetail) {
                case "name":
                    fulfillmentText = `The name of the CPU is ${cpu.name}.`;
                    break;
                case "socket":
                    fulfillmentText = `The ${cpu.name} uses the ${cpu.socket} socket.`;
                    break;
                case "base_clock":
                    fulfillmentText = `The base clock speed of the ${cpu.name} is ${cpu.base_clock}.`;
                    break;
                case "cores_threads":
                    fulfillmentText = `The ${cpu.name} has ${cpu.cores_threads}.`;
                    break;
                case "tdp":
                    fulfillmentText = `The ${cpu.name} has a TDP of ${cpu.tdp}.`;
                    break;
                case "compatibility":
                    fulfillmentText = `Regarding compatibility for ${cpu.name}: ${cpu.compatibility}`;
                    break;
                default:
                    fulfillmentText = `For ${cpu.name}, the ${requestedDetail.replace(/_/g, ' ')} is: ${cpu[requestedDetail]}.`;
                    break;
            }
        } else if (requestedDetail) {
            fulfillmentText = `Sorry, I don't have information about the ${requestedDetail.replace(/_/g, ' ')} for ${cpu.name}.`;
        } else {
            // General details
            let response = `The ${cpu.name} has ${cpu.cores_threads} and a base clock speed of ${cpu.base_clock}. `;
            response += `It uses the ${cpu.socket} socket and has a TDP of ${cpu.tdp}. `;
            response += `For compatibility, it works with ${cpu.compatibility}.`;
            fulfillmentText = response;
        }

        // Set 'cpu_details_context'
        if (cpuModelRaw) {
            outputContexts.push({
                name: `projects/${projectId}/agent/sessions/${sessionId}/contexts/cpu_details_context`,
                lifespanCount: 5,
                parameters: {
                    'cpu-model': cpuModelRaw
                }
            });
        }
    } else {
        fulfillmentText = `Sorry, I couldn't find details for "${cpuModelRaw || 'that CPU model'}". Please ensure the name is correct or try another model.`;
    }

    return { fulfillmentText, outputContexts };
}

module.exports = { cpuDatabase, cpuModelMap, handleCPUIntent };

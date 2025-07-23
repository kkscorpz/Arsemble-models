const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CPU Data
const cpuDatabase = {
  "intel core i9-14900k": {
    name: "Intel Core i9-14900K",
    socket: "LGA 1700",
    baseClock: "3.2 GHz (P), 2.4 GHz (E)",
    coresThreads: "24 cores (8P + 16E), 32 threads",
    tdp: "125W TDP / 253W max",
    compatibility: "Intel 600/700 series chipsets, BIOS update may be needed, Z790 recommended, requires strong cooling (240mm+), 750W+ PSU"
  },
  "intel core i7-14700k": {
    name: "Intel Core i7-14700K",
    socket: "LGA 1700",
    baseClock: "3.4 GHz (P), 2.5 GHz (E)",
    coresThreads: "20 cores (8P + 12E), 28 threads",
    tdp: "125W TDP / 253W max",
    compatibility: "Z790 or B760, high-performance cooling, 750W+ PSU"
  },
  "intel core i7-13700k": {
    name: "Intel Core i7-13700K",
    socket: "LGA 1700",
    baseClock: "~3.4 GHz (P), ~2.5 GHz (E)",
    coresThreads: "16 cores (8P + 8E), 24 threads",
    tdp: "125W TDP / 253W max",
    compatibility: "Z790 or B760, strong cooling, 700W+ PSU"
  },
  "intel core i5-14600k": {
    name: "Intel Core i5-14600K",
    socket: "LGA 1700",
    baseClock: "3.5 GHz (P), 2.6 GHz (E)",
    coresThreads: "14 cores (6P + 8E), 20 threads",
    tdp: "125W TDP / 181W max",
    compatibility: "B760 or Z790, mid to high-end cooling, 650W+ PSU"
  },
  "intel core i5-14500": {
    name: "Intel Core i5-14500",
    socket: "LGA 1700",
    baseClock: "2.6 GHz (P), 1.9 GHz (E)",
    coresThreads: "14 cores (6P + 8E), 20 threads",
    tdp: "65W TDP / 154W max",
    compatibility: "B760 or H610, basic cooling, 550W+ PSU"
  },
  "intel core i5-13400": {
    name: "Intel Core i5-13400",
    socket: "LGA 1700",
    baseClock: "2.5 GHz (P), 1.8 GHz (E)",
    coresThreads: "10 cores (6P + 4E), 16 threads",
    tdp: "65W TDP / 148W max",
    compatibility: "H610 or B760, basic cooling, 500W+ PSU"
  },
  "intel core i3-14100": {
    name: "Intel Core i3-14100",
    socket: "LGA 1700",
    baseClock: "3.5 GHz (P)",
    coresThreads: "4 cores (P only), 8 threads",
    tdp: "60W TDP / 110W max",
    compatibility: "H610 or B760, stock or basic cooling, 450W+ PSU"
  },
  "intel core i3-13100": {
    name: "Intel Core i3-13100",
    socket: "LGA 1700",
    baseClock: "3.4 GHz (P)",
    coresThreads: "4 cores, 8 threads",
    tdp: "60W TDP / ~89W max",
    compatibility: "H610 or B760, stock or basic cooling, 450W+ PSU"
  },

  // AMD CPUs
  "amd ryzen 9 7950x": {
    name: "AMD Ryzen 9 7950X",
    socket: "AM5",
    baseClock: "4.5 GHz",
    coresThreads: "16 cores / 32 threads",
    tdp: "170W TDP / 230W max",
    compatibility: "AM5 boards (X670E/X670/B650E), DDR5 only, 360mm+ AIO, 850W+ PSU"
  },
  "amd ryzen 9 9900x": {
    name: "AMD Ryzen 9 9900X",
    socket: "AM5 (expected)",
    baseClock: "TBD",
    coresThreads: "TBD",
    tdp: "TBD",
    compatibility: "Expected AM5 + DDR5 + high cooling"
  },
  "amd ryzen 9 9900x3d": {
    name: "AMD Ryzen 9 9900X3D",
    socket: "AM5 (expected)",
    baseClock: "TBD",
    coresThreads: "TBD",
    tdp: "TBD",
    compatibility: "Expected AM5, DDR5, advanced cooling due to 3D V-Cache"
  },
  "amd ryzen 7 7700x": {
    name: "AMD Ryzen 7 7700X",
    socket: "AM5",
    baseClock: "4.5 GHz",
    coresThreads: "8 cores / 16 threads",
    tdp: "105W TDP",
    compatibility: "AM5 only, DDR5 only, 240mm AIO or mid-high air cooling, 650W+ PSU"
  },
  "amd ryzen 7 5700x": {
    name: "AMD Ryzen 7 5700X",
    socket: "AM4",
    baseClock: "3.4 GHz",
    coresThreads: "8 cores / 16 threads",
    tdp: "65W TDP",
    compatibility: "AM4 boards (B550, X570), DDR4, BIOS update may be needed, 550W+ PSU"
  },
  "amd ryzen 5 5600x": {
    name: "AMD Ryzen 5 5600X",
    socket: "AM4",
    baseClock: "3.7 GHz",
    coresThreads: "6 cores / 12 threads",
    tdp: "65W TDP",
    compatibility: "AM4 DDR4, B550/X570, basic to mid-air cooling, 550W+ PSU"
  },
  "amd ryzen 5 5600g": {
    name: "AMD Ryzen 5 5600G",
    socket: "AM4",
    baseClock: "3.9 GHz",
    coresThreads: "6 cores / 12 threads",
    tdp: "65W TDP",
    compatibility: "AM4 DDR4, integrated GPU, stock cooling OK, 450W+ PSU"
  },
  "amd ryzen 3 3200g": {
    name: "AMD Ryzen 3 3200G",
    socket: "AM4",
    baseClock: "3.6 GHz",
    coresThreads: "4 cores / 4 threads",
    tdp: "65W TDP",
    compatibility: "AM4, Vega graphics, stock cooler OK, 400W+ PSU"
  }
};

// Root route
app.get('/', (req, res) => {
  res.send('CPU Webhook Server is running!');
});

// Webhook route
app.post('/webhook', (req, res) => {
  const intent = req.body.queryResult?.intent?.displayName;
  const parameters = req.body.queryResult?.parameters;

  if (!intent || !parameters) {
    return res.json({ fulfillmentText: 'Invalid request payload.' });
  }

  const supportedIntents = [
    "Get_CPU_Intel_Core_i9_14900K_Details",
  "Get_CPU_Intel_Core_i7_14700K_Details",
  "Get_CPU_Intel_Core_i5_14600K_Details",
  "Get_CPU_Intel_Core_i9_13900K_Details",
  "Get_CPU_Intel_Core_i7_13700K_Details",
  "Get_CPU_Intel_Core_i5_13600K_Details",
  "Get_CPU_Intel_Core_i5_12400F_Details",
  "Get_CPU_Intel_Core_i3_12100F_Details",
  "Get_CPU_AMD_Ryzen_9_7950X_Details",
  "Get_CPU_AMD_Ryzen_9_7900X_Details",
  "Get_CPU_AMD_Ryzen_7_7700X_Details",
  "Get_CPU_AMD_Ryzen_5_7600X_Details",
  "Get_CPU_AMD_Ryzen_9_5950X_Details",
  "Get_CPU_AMD_Ryzen_7_5800X_Details",
  "Get_CPU_AMD_Ryzen_5_5600X_Details",
  "Get_CPU_AMD_Ryzen_3_3200G_Details"
    
  ];

  if (supportedIntents.includes(intent)) {
    const cpuModelRaw = parameters["CPU-model"];
    if (!cpuModelRaw) {
      return res.json({ fulfillmentText: 'Please specify the CPU model.' });
    }

    const cpuModel = cpuModelRaw.toLowerCase().trim();
    const cpu = cpuDatabase[cpuModel];

    if (cpu) {
      const responseText = `The ${cpu.name} has ${cpu.cores}, ${cpu.threads}, a base clock of ${cpu.baseClock}, and a boost up to ${cpu.boostClock}. It uses the ${cpu.socket} socket and has a TDP of ${cpu.tdp}. Compatibility: ${cpu.compatibility}`;
      return res.json({ fulfillmentText: responseText });
    } else {
      return res.json({ fulfillmentText: `Sorry, I couldn't find specs for the CPU model "${cpuModelRaw}".` });
    }
  } else {
    return res.json({ fulfillmentText: `Intent "${intent}" not handled.` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

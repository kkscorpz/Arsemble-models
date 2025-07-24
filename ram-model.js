const ramDatabase = {
  "kingston fury beast ddr4": {
    name: "Kingston FURY Beast DDR4",
    capacity: "8GB, 16GB, or 32GB",
    type: "DDR4",
    speed: "3200 MHz",
    voltage: "1.35 V",
    compatibility: "Requires motherboard with DDR4 DIMM slots (288-pin) supporting 1.35V and 3200 MHz. Check motherboard QVL for compatibility."
  },
  "kingston hyperx fury ddr3": {
    name: "Kingston HyperX FURY DDR3",
    capacity: "8GB",
    type: "DDR3",
    speed: "1600 MHz",
    voltage: "1.5 V",
    compatibility: "For older systems only. Requires a DDR3 (240-pin) motherboard. Incompatible with modern DDR4/DDR5 systems."
  },
  "hkc pc ddr4-3200 dimm": {
    name: "HKC PC DDR4-3200 DIMM",
    capacity: "8GB",
    type: "DDR4",
    speed: "3200 MHz",
    voltage: "1.2 V",
    compatibility: "Works with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Recommend using matched pairs and checking motherboard QVL."
  },
  "hkcmemory hu40 ddr4 (16gb)": {
    name: "HKCMEMORY HU40 DDR4 (16GB)",
    capacity: "16GB",
    type: "DDR4",
    speed: "3200 MHz",
    voltage: "1.2 V",
    compatibility: "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Check QVL for higher capacity module compatibility."
  },
  "hkcmemory hu40 ddr4 (8gb)": {
    name: "HKCMEMORY HU40 DDR4 (8GB)",
    capacity: "8GB",
    type: "DDR4",
    speed: "3200 MHz",
    voltage: "1.2 V",
    compatibility: "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Matched pairs recommended for dual-channel. Always check motherboard QVL."
  }
};

function handleRAMIntent(intent, parameters) {
  const ramModelRaw = parameters["ram-model"];
  if (!ramModelRaw) {
    return 'Please specify the RAM model.';
  }

  const ramModel = ramModelRaw.toLowerCase().trim();
  const ram = ramDatabase[ramModel];

  if (ram) {
    return `The ${ram.name} RAM comes in ${ram.capacity}, is ${ram.type} type, runs at ${ram.speed}, and uses ${ram.voltage}. Compatibility: ${ram.compatibility}`;
  } else {
    return `Sorry, I couldn't find specs for the RAM model "${ramModelRaw}".`;
  }
}

module.exports = { handleRAMIntent };

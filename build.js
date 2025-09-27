// builds.js

const builds = {
    "entry-level": {
        name: "Entry-Level Build",
        total: 21750,
        components: [
            { component: "CPU", model: "Intel Core i3-13100 (4C/8T, LGA1700)", price: 7500, notes: "Good for daily use" },
            { component: "Motherboard", model: "MSI PRO H610M-S DDR4", price: 5000, notes: "Compatible with 12th/13th/14th Gen i3" },
            { component: "RAM", model: "Kingston FURY Beast DDR4 8GB 3200MHz", price: 2000, notes: "Single stick, can upgrade later" },
            { component: "Storage", model: "Crucial MX500 500GB SSD", price: 3000, notes: "Fast boot & storage" },
            { component: "PSU", model: "Corsair CX650 650W", price: 4000, notes: "Reliable entry PSU" },
            { component: "Case + Fan", model: "COOLMOON YX120 (120mm ARGB)", price: 250, notes: "Budget fan" },
            { component: "CPU Cooler", model: "Stock cooler (included)", price: 0, notes: "Adequate for i3" },
            { component: "GPU", model: "Integrated (Intel UHD)", price: 0, notes: "No discrete GPU needed" },
        ]
    },
    "mid-range": {
        name: "Mid-Range Build",
        total: 53600,
        components: [
            { component: "CPU", model: "Intel Core i5-14500 (14C/20T, LGA1700)", price: 15000, notes: "Great for gaming/multitasking" },
            { component: "Motherboard", model: "MSI B760M Gaming Plus WiFi DDR4", price: 8000, notes: "DDR4 support, WiFi ready" },
            { component: "RAM", model: "HKCMEMORY HU40 DDR4 (16GB, 3200MHz)", price: 3500, notes: "Dual channel recommended" },
            { component: "Storage", model: "Samsung 970 EVO Plus 1TB NVMe", price: 5500, notes: "Super fast loading" },
            { component: "PSU", model: "Cooler Master MWE White 750W", price: 3500, notes: "Enough for RTX 3050/4060" },
            { component: "Case + Fan", model: "Cooler Master SickleFlow 120 ARGB", price: 600, notes: "Better cooling & RGB" },
            { component: "CPU Cooler", model: "Cooler Master Hyper 212 Black Edition", price: 2500, notes: "Classic mid-range cooler" },
            { component: "GPU", model: "Gigabyte RTX 3050 Eagle OC 8GB", price: 15000, notes: "Solid 1080p gaming" },
        ]
    },
    "high-end": {
        name: "High-End Build",
        total: 85750,
        components: [
            { component: "CPU", model: "Intel Core i7-14700K (20C/28T)", price: 29000, notes: "Strong performance" },
            { component: "Motherboard", model: "MSI B760M Gaming Plus WiFi DDR4", price: 8000, notes: "Supports i7 well" },
            { component: "RAM", model: "Kingston FURY Beast DDR4 32GB (2x16GB, 3200MHz)", price: 8000, notes: "Big multitasking headroom" },
            { component: "Storage", model: "Samsung 970 EVO Plus 1TB NVMe + WD Blue 2TB HDD", price: 9300, notes: "Fast OS + big storage" },
            { component: "PSU", model: "Corsair RM850x 850W", price: 8000, notes: "High efficiency, modular" },
            { component: "Case + Fan", model: "Arctic P12 PWM PST (120mm)", price: 450, notes: "Silent & efficient" },
            { component: "CPU Cooler", model: "Thermalright Peerless Assassin 120 SE", price: 3000, notes: "Handles high TDP" },
            { component: "GPU", model: "MSI RTX 4060 Gaming X 8GB", price: 20000, notes: "Great 1080p/1440p gaming" },
        ]
    }
};

// Handler function with normalization (no username)
function handleBuildIntent(parameters) {
    let buildType = parameters['build_type']?.toLowerCase();

    // Normalize synonyms and typos
    if (buildType === 'high-range' || buildType === 'high end' || buildType === 'high' || buildType === 'premium' || buildType === 'advanced') buildType = 'high-end';
    if (buildType === 'midrange' || buildType === 'mid range' || buildType === 'middle' || buildType === 'intermediate') buildType = 'mid-range';
    if (buildType === 'entry level' || buildType === 'beginner' || buildType === 'basic') buildType = 'entry-level';

    const build = builds[buildType];

    if (!build) return "I don't have that build type. Please choose entry-level, mid-range, or high-end.";

    let response = `${build.name} (Total: ₱${build.total})\n\nComponents:\n`;
    build.components.forEach(c => {
        response += `- ${c.component}: ${c.model} | ₱${c.price} | ${c.notes}\n`;
    });
    return response;
}

module.exports = { handleBuildIntent };

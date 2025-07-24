const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const { handleCPUIntent } = require('./cpu-model');
const { handleRAMIntent } = require('./ram-model');
const { handleMotherboardIntent } = require('./motherboard-model');


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Dialogflow Webhook Server is Running!');
});

app.post('/webhook', (req, res) => {
  const intent = req.body.queryResult?.intent?.displayName;
  const parameters = req.body.queryResult?.parameters;

  if (!intent || !parameters) {
    return res.json({ fulfillmentText: 'Invalid request payload.' });
  }

  const cpuIntents = [
    //ryzen
     "Get_CPU_AMD_Ryzen_3_3200G_Details",
  "Get_CPU_AMD_Ryzen_5_5600G_Details",
  "Get_CPU_AMD_Ryzen_5_5600X_Details",
  "Get_CPU_AMD_Ryzen_7_5700X_Details",
  "Get_CPU_AMD_Ryzen_7_7700X_Details",
  "Get_CPU_AMD_Ryzen_9_7950X_Details",
  "Get_CPU_AMD_Ryzen_9_9900X3D_Details",
  "Get_CPU_AMD_Ryzen_9_9900X_Details",

  //intel
  "Get_CPU_Intel_Core_i3-13100_Details",
  "Get_CPU_Intel_Core_i3-14100_Details",
  "Get_CPU_Intel_Core_i5-13400_Details",
  "Get_CPU_Intel_Core_i5-14500_Details",
  "Get_CPU_Intel_Core_i5-14600K_Details",
  "Get_CPU_Intel_Core_i7-13700K_Details",
  "Get_CPU_Intel_Core_i7-14700K_Details",
  "Get_CPU_Intel_Core_i9-14900K_Details"

  ];

  const ramIntents = [
    'Get_RAM_Kingston_FURY_Beast_DDR4_Details',
    'Get_RAM_Kingston_HyperX_FURY_DDR3_Details',
    'Get_RAM_HKC_PC_DDR4-3200_DIMM_Details',
    'Get_RAM_HKCMEMORY_HU40_DDR4_16GB_Details',
    'Get_RAM_HKCMEMORY_HU40_DDR4_8GB_Details'
  ];


  const motherboardIntents = [
  'Get_Motherboard_ASUS_Prime_B450M-A_II_Details',
  'Get_Motherboard_MSI_B660M_MORTAR_WIFI_DDR4_Details'
];


  let responseText = 'Intent not recognized.';

  if (cpuIntents.includes(intent)) {
  responseText = handleCPUIntent(intent, parameters);
} else if (ramIntents.includes(intent)) {
  responseText = handleRAMIntent(intent, parameters);
} else if (motherboardIntents.includes(intent)) {
  responseText = handleMotherboardIntent(intent, parameters);
}

  return res.json({ fulfillmentText: responseText });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

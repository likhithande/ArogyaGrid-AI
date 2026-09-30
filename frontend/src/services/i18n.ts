// ArogyaGrid AI Multilingual Dictionary (Point 46)
// Seamless localization across English (EN), Hindi (HI), Telugu (TE)
import { Language } from '../types';

export interface TranslationDict {
  modes: {
    observe: string;
    predict: string;
    intervene: string;
  };
  modeDescriptions: {
    observe: string;
    predict: string;
    intervene: string;
  };
  vitals: {
    supplyPressure: string;
    demandPressure: string;
    networkResilience: string;
    phcsAtRisk: string;
    aiConfidence: string;
  };
  vitalSubs: {
    supplySub: string;
    demandSub: string;
    resilienceSub: string;
    riskSub: string;
    confidenceSub: string;
  };
  threeQuestions: {
    why: string;
    whatIf: string;
    whatNext: string;
  };
  simulation: {
    simulatedFuture: string;
    patientDemandSurge: string;
    scenarioBranching: string;
    baseline: string;
  };
  splitReality: {
    currentReality: string;
    aiForecast: string;
    liveTelemetry: string;
    trajectory72h: string;
  };
  federated: {
    title: string;
    privacyBadge: string;
    localProtected: string;
    modelUpdating: string;
    globalBrain: string;
  };
  warRoom: {
    emergencyTitle: string;
    monsoonFlood: string;
    affectedDistricts: string;
    demandSurge: string;
    resourceGap: string;
    responsePath: string;
  };
  loadingStates: {
    syncing: string;
    analyzing: string;
    calculating: string;
    buildingTwin: string;
    insightReady: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {
    modes: {
      observe: 'OBSERVE',
      predict: 'PREDICT',
      intervene: 'INTERVENE',
    },
    modeDescriptions: {
      observe: 'Current Network Realities & Telemetry',
      predict: '72H AI Risk Projections & Emerging Halos',
      intervene: 'Active AI Redistribution Proposals',
    },
    vitals: {
      supplyPressure: 'Supply Pressure',
      demandPressure: 'Demand Pressure',
      networkResilience: 'Network Resilience',
      phcsAtRisk: 'PHCs at Risk',
      aiConfidence: 'AI Confidence',
    },
    vitalSubs: {
      supplySub: '↑ from 58 yesterday · NH-16 corridor',
      demandSub: '+31% monsoon surge in coastal belt',
      resilienceSub: 'Stable · 1,248 active facilities',
      riskSub: 'Pre-positioning required < 48H',
      confidenceSub: 'XAI · Grounded in MoHFW protocol',
    },
    threeQuestions: {
      why: 'WHY?',
      whatIf: 'WHAT IF?',
      whatNext: 'WHAT NEXT?',
    },
    simulation: {
      simulatedFuture: 'SIMULATED DIGITAL TWIN',
      patientDemandSurge: 'Patient Demand Surge',
      scenarioBranching: 'Scenario Branching',
      baseline: 'Baseline',
    },
    splitReality: {
      currentReality: 'CURRENT REALITY',
      aiForecast: 'AI FORECAST (+72H)',
      liveTelemetry: 'Live Telemetry Feed',
      trajectory72h: 'Grounded Predictive Trajectory',
    },
    federated: {
      title: 'FEDERATED AI INTELLIGENCE',
      privacyBadge: 'DIFFERENTIAL PRIVACY ε=0.85 · ZERO RAW DATA LEAKAGE',
      localProtected: 'LOCAL PHC DATA BOUNDARY',
      modelUpdating: 'ENCRYPTED MODEL UPDATE',
      globalBrain: 'RESILIENCE GLOBAL MODEL',
    },
    warRoom: {
      emergencyTitle: 'AI WAR ROOM · MISSION CONTROL',
      monsoonFlood: 'GODAVARI MONSOON SURGE · ACTIVE',
      affectedDistricts: '3 DISTRICTS IMPACTED',
      demandSurge: '+42% Surge',
      resourceGap: '18% Resource Gap',
      responsePath: 'Detect → Predict → Simulate → Optimize → Review',
    },
    loadingStates: {
      syncing: 'SYNCING HEALTHCARE NETWORK…',
      analyzing: 'ANALYZING 1,248 TELEMETRY NODES…',
      calculating: 'CALCULATING 72H RISK TRAJECTORIES…',
      buildingTwin: 'COMPUTING DIGITAL TWIN EQUILIBRIUM…',
      insightReady: 'AI RESILIENCE INSIGHT READY',
    },
  },
  hi: {
    modes: {
      observe: 'निरीक्षण',
      predict: 'पूर्वानुमान',
      intervene: 'हस्तक्षेप',
    },
    modeDescriptions: {
      observe: 'वर्तमान स्वास्थ्य नेटवर्क स्थिति और डेटा',
      predict: '72 घंटे का एआई जोखिम पूर्वानुमान',
      intervene: 'सक्रिय एआई संसाधन पुनर्वितरण प्रस्ताव',
    },
    vitals: {
      supplyPressure: 'आपूर्ति दबाव',
      demandPressure: 'मांग दबाव',
      networkResilience: 'नेटवर्क लचीलापन',
      phcsAtRisk: 'जोखिम में प्राथमिक केंद्र',
      aiConfidence: 'एआई विश्वसनीयता',
    },
    vitalSubs: {
      supplySub: '↑ कल से 58 बढ़ा · एनएच-16 कॉरिडोर',
      demandSub: '+31% मानसून मांग में तटीय वृद्धि',
      resilienceSub: 'स्थिर · 1,248 सक्रिय स्वास्थ्य केंद्र',
      riskSub: '48 घंटे के भीतर हस्तक्षेप आवश्यक',
      confidenceSub: 'एक्सएआई · स्वास्थ्य मंत्रालय प्रोटोकॉल',
    },
    threeQuestions: {
      why: 'कारण क्या?',
      whatIf: 'यदि क्या?',
      whatNext: 'आगे क्या?',
    },
    simulation: {
      simulatedFuture: 'सिम्युलेटेड डिजिटल ट्विन',
      patientDemandSurge: 'रोगी मांग वृद्धि',
      scenarioBranching: 'परिदृश्य शाखाएं',
      baseline: 'मूल रेखा',
    },
    splitReality: {
      currentReality: 'वर्तमान वास्तविकता',
      aiForecast: 'एआई पूर्वानुमान (+72 घंटे)',
      liveTelemetry: 'लाइव टेलीमेट्री फीड',
      trajectory72h: 'सटीक भविष्य प्रक्षेपवक्र',
    },
    federated: {
      title: 'फ़ेडरेटेड एआई इंटेलिजेंस',
      privacyBadge: 'डिफरेंशियल प्राइवेसी ε=0.85 · शून्य डेटा रिसाव',
      localProtected: 'स्थानीय डेटा सुरक्षित सीमा',
      modelUpdating: 'एन्क्रिप्टेड मॉडल अपडेट',
      globalBrain: 'ग्लोबल एआई रेजिलिएंस मॉडल',
    },
    warRoom: {
      emergencyTitle: 'एआई वार रूम · आपातकालीन नियंत्रण कक्ष',
      monsoonFlood: 'गोदावरी मानसून बाढ़ स्थिति · सक्रिय',
      affectedDistricts: '3 जिले प्रभावित',
      demandSurge: '+42% मांग वृद्धि',
      resourceGap: '18% संसाधन कमी',
      responsePath: 'पहचान → पूर्वानुमान → सिमुलेशन → अनुकूलन → समीक्षा',
    },
    loadingStates: {
      syncing: 'स्वास्थ्य नेटवर्क समन्वय प्रगति पर…',
      analyzing: '1,248 केंद्रों का विश्लेषण जारी…',
      calculating: '72 घंटे के जोखिम का आकलन…',
      buildingTwin: 'डिजिटल मॉडल संतुलित किया जा रहा है…',
      insightReady: 'एआई इनसाइट तैयार',
    },
  },
  te: {
    modes: {
      observe: 'పరిశీలన',
      predict: 'అంచనా',
      intervene: 'జోక్యం',
    },
    modeDescriptions: {
      observe: 'ప్రస్తుత ఆరోగ్య నెట్‌వర్క్ ప్రత్యక్ష స్థితి',
      predict: '72 గంటల ఏఐ ముందస్తు ప్రమాద సూచన',
      intervene: 'ఏఐ వనరుల పునఃపంపిణీ ప్రతిపాదనలు',
    },
    vitals: {
      supplyPressure: 'సరఫరా ఒత్తిడి',
      demandPressure: 'డిమాండ్ ఒత్తిడి',
      networkResilience: 'నెట్‌వర్క్ సామర్థ్యం',
      phcsAtRisk: 'ప్రమాదంలో ఉన్న పిహెచ్‌సీలు',
      aiConfidence: 'ఏఐ విశ్వసనీయత',
    },
    vitalSubs: {
      supplySub: '↑ నిన్నటి కంటే 58 పెరుగుదల',
      demandSub: '+31% తీరప్రాంత వర్షాకాల డిమాండ్',
      resilienceSub: 'స్థిరమైనది · 1,248 క్రియాశీల కేంద్రాలు',
      riskSub: '48 గంటల్లో పరిష్కారం అవసరం',
      confidenceSub: 'ఎక్స్‌ఏఐ · ఆరోగ్య మంత్రిత్వ శాఖ ప్రమాణం',
    },
    threeQuestions: {
      why: 'ఎందుకు?',
      whatIf: 'ఒకవేళ ఏమైతే?',
      whatNext: 'తదుపరి ఏమిటి?',
    },
    simulation: {
      simulatedFuture: 'సిమ్యులేటెడ్ డిజిటల్ ట్విన్',
      patientDemandSurge: 'రోగుల డిమాండ్ పెరుగుదల',
      scenarioBranching: 'పరిస్థితుల విశ్లేషణ',
      baseline: 'ప్రాథమిక స్థాయి',
    },
    splitReality: {
      currentReality: 'ప్రస్తుత వాస్తవికత',
      aiForecast: 'ఏఐ అంచనా (+72 గంటలు)',
      liveTelemetry: 'ప్రత్యక్ష నెట్‌వర్క్ డేటా',
      trajectory72h: 'ఖచ్చితమైన భవిష్యత్ మార్గం',
    },
    federated: {
      title: 'ఫెడరేటెడ్ ఏఐ ఇంటెలిజెన్స్',
      privacyBadge: 'డిఫరెన్షియల్ ప్రైవసీ ε=0.85 · రోగి డేటా రక్షణ',
      localProtected: 'స్థానిక రక్షిత పరిధి',
      modelUpdating: 'ఎన్‌క్రిప్ట్ చేసిన మోడల్ అప్‌డేట్',
      globalBrain: 'గ్లోబల్ రెసిలియెన్స్ మోడల్',
    },
    warRoom: {
      emergencyTitle: 'ఏఐ వార్ రూమ్ · అత్యవసర కమాండ్ సెంటర్',
      monsoonFlood: 'గోదావరి వరద విపత్తు · క్రియాశీలం',
      affectedDistricts: '3 ప్రభావిత జిల్లాలు',
      demandSurge: '+42% పెరిగిన డిమాండ్',
      resourceGap: '18% వనరుల కొరత',
      responsePath: 'గుర్తింపు → అంచనా → సిమ్యులేషన్ → ఆప్టిమైజేషన్ → సమీక్ష',
    },
    loadingStates: {
      syncing: 'ఆరోగ్య నెట్‌వర్క్ సమాచారం నవీకరణ…',
      analyzing: '1,248 కేంద్రాల విశ్లేషణ జరుగుతోంది…',
      calculating: '72 గంటల ప్రమాదాల అంచనా…',
      buildingTwin: 'డిజిటల్ ట్విన్ రూపకల్పన…',
      insightReady: 'ఏఐ సలహా సిద్ధంగా ఉంది',
    },
  },
};

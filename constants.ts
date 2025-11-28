
import { Bus, Translation } from './types';

export const CSV_FILE_URL = './FleetList.csv';
export const LAST_UPDATED = '26/11/2025';

export const parseFleetData = (csvText: string): Bus[] => {
  const lines = csvText.trim().split('\n');
  // Skip header
  const dataLines = lines.slice(1);
  
  return dataLines.map((line, index) => {
    // Handle potential carriage returns and skip lines that are just commas or empty
    const cleanedLine = line.replace('\r', '').trim();
    
    // Skip empty lines or those starting with comma (like ",,,,,,,,,")
    if (!cleanedLine || cleanedLine.startsWith(',')) return null;
    
    const cols = cleanedLine.split(',');
    
    // Ensure we have enough columns and the first column (Depot) is not empty
    if (cols.length < 10 || !cols[0].trim()) return null;

    return {
      id: `bus-${index}`,
      depot: cols[0].trim(),
      fleetNumber: cols[1].trim(),
      registrationNumber: cols[2].trim(),
      make: cols[3].trim(),
      model: cols[4].trim(),
      operator: cols[5].trim(),
      isAC: cols[6].trim().toLowerCase() === 'yes',
      serviceType: cols[7].trim(),
      registrationDate: cols[8].trim(),
      status: (cols[9].trim() || 'Active') as 'Active' | 'Maintenance' | 'Retired'
    };
  }).filter((item): item is Bus => item !== null);
};

export const TRANSLATIONS: Record<'en' | 'ta', Translation> = {
  en: {
    appTitle: 'Fleet List',
    appSubtitle: 'MTC Chennai',
    dashboard: 'Dashboard',
    fleetSearch: 'Fleet Search',
    depotBreakdown: 'Depot Details',
    systemStatus: 'System Status',
    online: 'Online',
    trackedFleet: 'Tracked Fleet',
    electricFleet: 'Electric Fleet',
    vidiyalPayanam: 'Vidiyal Payanam',
    acBuses: 'AC Buses',
    serviceTypeDist: 'Service Type Distribution',
    searchPlaceholder: 'Search by reg number, fleet #...',
    allDepots: 'All Depots',
    allServices: 'All Services',
    fleetNumber: 'Fleet #',
    regNumber: 'Reg #',
    depot: 'Depot',
    makeModel: 'Make/Model',
    service: 'Service',
    showing: 'Showing',
    of: 'of',
    vehicles: 'vehicles',
    previous: 'Previous',
    next: 'Next',
    depotFleetBreakdown: 'Depotwise Details',
    breakdownSubtitle: 'Detailed count of vehicles by service type across all depots',
    depotName: 'Depot Name',
    total: 'Total',
    grandTotal: 'Grand Total',
    slogan: 'Ithu Ungal Soththu',
    loading: 'Loading VandiPattiyal',
    fetching: 'Fetching Fleet Master Database...',
    rowsPerPage: 'Rows per page',
    lastUpdatedLabel: 'Last updated',
    regDate: 'Reg. Date',
    ptsc: 'PTSC Model',
    gcc: 'GCC Model',
    ownership: 'Ownership',
    financials: 'Financial Implications',
    operations: 'Operations',
    keyDifferences: 'Key Differences'
  },
  ta: {
    appTitle: 'வண்டி பட்டியல்',
    appSubtitle: 'MTC சென்னை',
    dashboard: 'முகப்பு',
    fleetSearch: 'வாகனத் தேடல்',
    depotBreakdown: 'பணிமனை விவரங்கள்',
    systemStatus: 'கணினி நிலை',
    online: 'இயங்குகிறது',
    trackedFleet: 'மொத்த வாகனங்கள்',
    electricFleet: 'மின்சார வாகனங்கள்',
    vidiyalPayanam: 'விடியல் பயணம்',
    acBuses: 'AC பேருந்துகள்',
    serviceTypeDist: 'சேவை வகை விநியோகம்',
    searchPlaceholder: 'பதிவு எண், வாகன எண் மூலம் தேடுக...',
    allDepots: 'அனைத்து பணிமனைகள்',
    allServices: 'அனைத்து சேவைகள்',
    fleetNumber: 'வாகன எண்',
    regNumber: 'பதிவு எண்',
    depot: 'பணிமனை',
    makeModel: 'வாகன வகை',
    service: 'சேவை',
    showing: 'காட்டப்படுவது',
    of: 'மொத்தம்',
    vehicles: 'வாகனங்கள்',
    previous: 'முந்தைய',
    next: 'அடுத்த',
    depotFleetBreakdown: 'பணிமனை வாரியாக வாகன விவரங்கள்',
    breakdownSubtitle: 'அனைத்து பணிமனைகளிலும் உள்ள சேவை வகை வாரியான வாகனங்களின் எண்ணிக்கை',
    depotName: 'பணிமனை பெயர்',
    total: 'மொத்தம்',
    grandTotal: 'பெருமொத்தம்',
    slogan: 'இது உங்கள் சொத்து',
    loading: 'வண்டிப்பட்டியல் ஏற்றப்படுகிறது',
    fetching: 'வாகனத் தரவுத்தளம் பெறப்படுகிறது...',
    rowsPerPage: 'பக்க அளவு',
    lastUpdatedLabel: 'கடைசியாக புதுப்பிக்கப்பட்டது',
    regDate: 'பதிவு தேதி',
    ptsc: 'PTSC மாதிரி',
    gcc: 'GCC மாதிரி',
    ownership: 'உரிமை',
    financials: 'நிதி தாக்கங்கள்',
    operations: 'செயல்பாடுகள்',
    keyDifferences: 'முக்கிய வேறுபாடுகள்'
  }
};

export const CONTRACT_CONTENT = {
  en: {
    PTSC: {
      title: "Public Transit Service Contract (PTSC)",
      subtitle: "The Traditional Ownership & Operation Model",
      description: "Under the Public Transit Service Contract (often referred to as the traditional or Net Cost model in STUs), the public transport authority (MTC) owns the assets, operates the services, and retains all revenue risk.",
      sections: [
        {
          title: "Ownership",
          content: "The MTC (State Transport Undertaking) holds full ownership of the fleet (buses), depots, and infrastructure. The buses are procured directly by the government using public funds."
        },
        {
          title: "Financial Implications",
          content: "High upfront capital expenditure (Capex) is required from the government to purchase buses. The MTC also bears all operational costs (Opex) including fuel, maintenance, and staff salaries. Ticket revenue collected is kept by the MTC to offset these costs."
        },
        {
          title: "Operations",
          content: "The MTC is responsible for all aspects of operations: route planning, scheduling, driving, conducting, and vehicle maintenance. Drivers and conductors are direct employees of the corporation."
        }
      ]
    },
    GCC: {
      title: "Gross Cost Contract (GCC)",
      subtitle: "The Private Partnership Model",
      description: "The Gross Cost Contract (GCC) is a model where a private operator owns and maintains the buses, while the public authority (MTC) pays them a fixed rate per kilometer to run the service.",
      sections: [
        {
          title: "Ownership",
          content: "The Private Operator owns the buses. MTC does not need to buy the vehicles. The operator is responsible for the lifecycle of the bus assets."
        },
        {
          title: "Financial Implications",
          content: "MTC pays the operator a fixed 'Gross Cost' fee per kilometer operated. The operator bears the cost of the vehicle (Capex) and maintenance. MTC typically provides the electricity/fuel (depending on contract) and collects all ticket revenue. This shifts the operational cost risk to the private player while MTC retains revenue risk."
        },
        {
          title: "Operations",
          content: "The Private Operator provides the drivers and handles maintenance. MTC provides the conductors (for revenue collection) and decides the routes and schedules. This ensures the public authority retains control over service planning."
        }
      ]
    }
  },
  ta: {
    PTSC: {
      title: "பொது போக்குவரத்து சேவை ஒப்பந்தம் (PTSC)",
      subtitle: "பாரம்பரிய உரிமை மற்றும் செயல்பாட்டு முறை",
      description: "பாரம்பரிய முறையில் (PTSC), அரசு போக்குவரத்துக் கழகம் (MTC) வாகனங்களை முழுமையாக சொந்தமாக வைத்து, இயக்கி, வருவாய் அபாயத்தை ஏற்றுக்கொள்கிறது.",
      sections: [
        {
          title: "உரிமை",
          content: "பேருந்துகள், பணிமனைகள் மற்றும் உள்கட்டமைப்புகள் அனைத்தும் MTC-க்குச் சொந்தமானவை. அரசு நிதியைப் பயன்படுத்தி பேருந்துகள் நேரடியாக வாங்கப்படுகின்றன."
        },
        {
          title: "நிதி தாக்கங்கள்",
          content: "பேருந்துகளை வாங்க அரசுக்கு அதிக ஆரம்ப மூலதனச் செலவு (Capex) தேவைப்படுகிறது. எரிபொருள், பராமரிப்பு மற்றும் ஊழியர்களின் சம்பளம் உட்பட அனைத்து செயல்பாட்டுச் செலவுகளையும் (Opex) MTC ஏற்கிறது. பயணச்சீட்டு வருவாய் முழுவதும் MTC-க்குச் செல்கிறது."
        },
        {
          title: "செயல்பாடுகள்",
          content: "வழித்தடத் திட்டமிடல், அட்டவணைப்படுத்தல், ஓட்டுநர் மற்றும் நடத்துநர் பணி, மற்றும் வாகனப் பராமரிப்பு என அனைத்தையும் MTC நிர்வகிக்கிறது. ஓட்டுநர்கள் மற்றும் நடத்துநர்கள் கழகத்தின் நேரடி ஊழியர்கள் ஆவர்."
        }
      ]
    },
    GCC: {
      title: "மொத்த செலவு ஒப்பந்தம் (GCC)",
      subtitle: "தனியார் கூட்டாண்மை முறை",
      description: "GCC முறையில், தனியார் நிறுவனமே பேருந்துகளை வாங்கிப் பராமரிக்கிறது. MTC அவர்கள் இயக்கும் ஒவ்வொரு கிலோமீட்டருக்கும் ஒரு குறிப்பிட்ட கட்டணத்தை வழங்குகிறது.",
      sections: [
        {
          title: "உரிமை",
          content: "பேருந்துகள் தனியார் நிறுவனத்திற்குச் சொந்தமானவை. MTC வாகனங்களை வாங்க வேண்டிய அவசியமில்லை."
        },
        {
          title: "நிதி தாக்கங்கள்",
          content: "இயக்கப்படும் ஒவ்வொரு கிலோமீட்டருக்கும் MTC ஒரு நிலையான கட்டணத்தை (Gross Cost) வழங்குகிறது. வாகனத்தின் விலை மற்றும் பராமரிப்புச் செலவை தனியார் நிறுவனம் ஏற்கிறது. MTC பயணச்சீட்டு வருவாயை வசூலிக்கிறது."
        },
        {
          title: "செயல்பாடுகள்",
          content: "தனியார் நிறுவனம் ஓட்டுநர்களை நியமித்து பராமரிப்பை மேற்கொள்கிறது. MTC நடத்துநர்களை (வருவாய் வசூலிக்க) வழங்குகிறது மற்றும் வழித்தடங்களையும் நேரங்களையும் தீர்மானிக்கிறது."
        }
      ]
    }
  }
};

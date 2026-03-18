/**
 * Test accounts representing companies in different industries.
 * Used across E2E tests to validate matching, filtering, and display
 * for varied company profiles.
 *
 * Email pattern: test-{industry}@winly-test.com
 * Password: all use the same password for simplicity.
 */

export const TEST_PASSWORD = 'WinlyTest2026!';

export type SubscriptionTier = 'Explorer' | 'Starter' | 'Professional' | 'Enterprise';

export interface TestAccount {
  email: string;
  password: string;
  companyName: string;
  services: string;
  techStack: string;
  cpvCodes: string;        // comma-separated 2-digit CPV divisions
  majorCompetitors: string[];
  minBudget: number;
  maxBudget: number;
  vatId?: string;
  tier: SubscriptionTier;
  /** Human-readable label for the test scenario */
  industry: string;
}

/**
 * 8 test accounts across distinct industries with realistic profiles.
 */
export const TEST_ACCOUNTS: Record<string, TestAccount> = {
  itServices: {
    email: 'test-it@winly-test.com',
    password: TEST_PASSWORD,
    companyName: 'DigiNova Solutions Lda.',
    services:
      'Custom software development, cloud migration, cybersecurity audits, managed IT infrastructure, ERP implementation and integration for public sector organisations.',
    techStack: 'Python, React, AWS, Azure, Kubernetes, Terraform, PostgreSQL',
    cpvCodes: '72, 48',
    majorCompetitors: ['Novabase', 'Axians', 'Altran'],
    minBudget: 50_000,
    maxBudget: 2_000_000,
    vatId: '501442600',
    tier: 'Enterprise',
    industry: 'IT Services & Software',
  },

  construction: {
    email: 'test-construction@winly-test.com',
    password: TEST_PASSWORD,
    companyName: 'Lusitana Obras S.A.',
    services:
      'Civil engineering, road and bridge construction, public building renovation, structural reinforcement, water infrastructure and sewage systems for municipalities.',
    techStack: 'AutoCAD, BIM, Revit, Primavera P6',
    cpvCodes: '45, 44, 71',
    majorCompetitors: ['Mota-Engil', 'Teixeira Duarte', 'Casais'],
    minBudget: 200_000,
    maxBudget: 15_000_000,
    vatId: '503215478',
    tier: 'Professional',
    industry: 'Construction & Civil Engineering',
  },

  healthcare: {
    email: 'test-health@winly-test.com',
    password: TEST_PASSWORD,
    companyName: 'MedTech Portugal Lda.',
    services:
      'Medical equipment supply, hospital information systems, telemedicine solutions, diagnostic imaging equipment maintenance, pharmaceutical logistics.',
    techStack: 'HL7 FHIR, DICOM, SAP, Java, MSSQL',
    cpvCodes: '33, 85',
    majorCompetitors: ['Siemens Healthineers', 'Philips Healthcare', 'GE Healthcare'],
    minBudget: 25_000,
    maxBudget: 5_000_000,
    tier: 'Professional',
    industry: 'Healthcare & Medical Equipment',
  },

  environmental: {
    email: 'test-environment@winly-test.com',
    password: TEST_PASSWORD,
    companyName: 'EcoVerde Ambiente S.A.',
    services:
      'Urban waste management, recycling plant operation, environmental impact assessments, water treatment facility design, hazardous waste disposal and soil remediation.',
    techStack: 'GIS, QGIS, ArcGIS, IoT sensors, SCADA',
    cpvCodes: '90, 41, 71',
    majorCompetitors: ['SUMA', 'Veolia', 'Hidurbe'],
    minBudget: 100_000,
    maxBudget: 10_000_000,
    vatId: '509876543',
    tier: 'Enterprise',
    industry: 'Environmental Services & Waste Management',
  },

  consulting: {
    email: 'test-consulting@winly-test.com',
    password: TEST_PASSWORD,
    companyName: 'Strategos Consultoria Lda.',
    services:
      'Management consulting, public policy advisory, EU funding application support, organisational restructuring, training programme design for government agencies.',
    techStack: 'Power BI, Tableau, Excel, SharePoint',
    cpvCodes: '79, 73, 80',
    majorCompetitors: ['Deloitte', 'PwC', 'McKinsey'],
    minBudget: 15_000,
    maxBudget: 500_000,
    tier: 'Starter',
    industry: 'Business Consulting & Advisory',
  },

  transport: {
    email: 'test-transport@winly-test.com',
    password: TEST_PASSWORD,
    companyName: 'TransLuso Mobilidade S.A.',
    services:
      'Public transport fleet management, school bus services, logistics and freight transport, vehicle maintenance workshops, fleet GPS tracking and telematics.',
    techStack: 'SAP TM, Fleet management software, GPS/GPRS, ERP',
    cpvCodes: '60, 34, 50',
    majorCompetitors: ['Barraqueiro', 'Transdev', 'Arriva'],
    minBudget: 50_000,
    maxBudget: 8_000_000,
    vatId: '507654321',
    tier: 'Starter',
    industry: 'Transport & Logistics',
  },

  security: {
    email: 'test-security@winly-test.com',
    password: TEST_PASSWORD,
    companyName: 'Vigilis Segurança Lda.',
    services:
      'Physical security services, CCTV and surveillance installation, access control systems, fire detection and alarm systems, security consulting for public buildings.',
    techStack: 'CCTV IP systems, Access control (HID), Fire alarm (Notifier), VMS',
    cpvCodes: '35, 32, 51',
    majorCompetitors: ['Securitas', 'Prosegur', 'G4S'],
    minBudget: 10_000,
    maxBudget: 1_000_000,
    tier: 'Explorer',
    industry: 'Security & Defence Equipment',
  },

  catering: {
    email: 'test-catering@winly-test.com',
    password: TEST_PASSWORD,
    companyName: 'Sabores do Tejo Catering Lda.',
    services:
      'School meal catering, hospital food services, institutional catering, event catering for public entities, nutritional planning and HACCP compliance.',
    techStack: 'ERP, HACCP management software, Nutrium',
    cpvCodes: '55, 15',
    majorCompetitors: ['Gertal', 'Eurest', 'Sodexo'],
    minBudget: 20_000,
    maxBudget: 3_000_000,
    vatId: '504321987',
    tier: 'Explorer',
    industry: 'Catering & Food Services',
  },
};

/** Convenience: all accounts as an array */
export const ALL_TEST_ACCOUNTS = Object.values(TEST_ACCOUNTS);

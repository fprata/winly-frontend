import { describe, it, expect } from 'vitest';
import { onboardingSchema } from '@/lib/validations';

describe('Onboarding schema validation', () => {
  const validProfile = {
    companyName: 'DigiNova Solutions Lda.',
    services: 'Custom software development, cloud migration, cybersecurity audits.',
    techStack: 'Python, React, AWS',
    cpv_codes: '72, 48',
    major_competitors: JSON.stringify(['Novabase', 'Axians']),
    minBudget: 50000,
    maxBudget: 2000000,
  };

  it('accepts a valid IT services profile', () => {
    const result = onboardingSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it('accepts a valid construction profile', () => {
    const result = onboardingSchema.safeParse({
      companyName: 'Lusitana Obras S.A.',
      services: 'Civil engineering, road and bridge construction, public building renovation.',
      techStack: 'AutoCAD, BIM, Revit',
      cpv_codes: '45, 44, 71',
      major_competitors: JSON.stringify(['Mota-Engil', 'Casais']),
      minBudget: 200000,
      maxBudget: 15000000,
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid healthcare profile', () => {
    const result = onboardingSchema.safeParse({
      companyName: 'MedTech Portugal Lda.',
      services: 'Medical equipment supply, hospital information systems, telemedicine solutions.',
      cpv_codes: '33, 85',
      minBudget: 25000,
      maxBudget: 5000000,
    });
    expect(result.success).toBe(true);
  });

  it('accepts profile with optional fields omitted', () => {
    const result = onboardingSchema.safeParse({
      companyName: 'Minimal Co.',
      services: 'Consulting services for public sector organisations.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty company name', () => {
    const result = onboardingSchema.safeParse({
      ...validProfile,
      companyName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects company name shorter than 2 characters', () => {
    const result = onboardingSchema.safeParse({
      ...validProfile,
      companyName: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('rejects services shorter than 10 characters', () => {
    const result = onboardingSchema.safeParse({
      ...validProfile,
      services: 'IT',
    });
    expect(result.success).toBe(false);
  });

  it('accepts null budgets', () => {
    const result = onboardingSchema.safeParse({
      ...validProfile,
      minBudget: null,
      maxBudget: null,
    });
    expect(result.success).toBe(true);
  });

  it('coerces string budgets to numbers', () => {
    const result = onboardingSchema.safeParse({
      ...validProfile,
      minBudget: '50000',
      maxBudget: '2000000',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.minBudget).toBe(50000);
      expect(result.data.maxBudget).toBe(2000000);
    }
  });

  it('accepts empty string for optional cpv_codes', () => {
    const result = onboardingSchema.safeParse({
      ...validProfile,
      cpv_codes: '',
    });
    expect(result.success).toBe(true);
  });

  it('accepts multiple CPV codes as comma-separated string', () => {
    const result = onboardingSchema.safeParse({
      ...validProfile,
      cpv_codes: '72, 48, 30, 32',
    });
    expect(result.success).toBe(true);
  });
});

describe('Industry-specific profile validation', () => {
  const industries = [
    {
      name: 'Environmental Services',
      profile: {
        companyName: 'EcoVerde Ambiente S.A.',
        services: 'Urban waste management, recycling plant operation, environmental impact assessments.',
        techStack: 'GIS, QGIS, ArcGIS, IoT sensors',
        cpv_codes: '90, 41, 71',
      },
    },
    {
      name: 'Business Consulting',
      profile: {
        companyName: 'Strategos Consultoria Lda.',
        services: 'Management consulting, public policy advisory, EU funding application support.',
        cpv_codes: '79, 73, 80',
      },
    },
    {
      name: 'Transport & Logistics',
      profile: {
        companyName: 'TransLuso Mobilidade S.A.',
        services: 'Public transport fleet management, school bus services, logistics and freight transport.',
        techStack: 'SAP TM, Fleet management software',
        cpv_codes: '60, 34, 50',
      },
    },
    {
      name: 'Security & Defence',
      profile: {
        companyName: 'Vigilis Segurança Lda.',
        services: 'Physical security services, CCTV and surveillance installation, access control systems.',
        cpv_codes: '35, 32, 51',
      },
    },
    {
      name: 'Catering & Food Services',
      profile: {
        companyName: 'Sabores do Tejo Catering Lda.',
        services: 'School meal catering, hospital food services, institutional catering, event catering.',
        cpv_codes: '55, 15',
      },
    },
  ];

  for (const industry of industries) {
    it(`accepts valid ${industry.name} profile`, () => {
      const result = onboardingSchema.safeParse(industry.profile);
      expect(result.success).toBe(true);
    });
  }
});

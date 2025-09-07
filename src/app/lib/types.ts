export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  workType: string;
  salary: number;
  industry: string;
  description: string;
  workLifeBalanceRating: number;
  workCulture: string;
  learningPrograms: boolean;
  hasMentorship: boolean;
  flexibleHours: boolean;
  degreeRequired: string;

  // Flat properties from the DB
  agePreference_1?: number;
  agePreference_2?: number;
  benefits_1?: string;
  benefits_2?: string;
  benefits_3?: string;
  careerPath_nextRole?: string;
  careerPath_salaryIncrease?: number;
  careerPath_timeframe?: string;
  relatedMajors_1?: string;
  relatedMajors_2?: string;
  relatedMajors_3?: string;
  relatedMajors_4?: string;
  requiredSkills_1?: string;
  requiredSkills_2?: string;
  requiredSkills_3?: string;
  requiredSkills_4?: string;

  // This field is calculated, not from the database
  matchScore: number; 
}

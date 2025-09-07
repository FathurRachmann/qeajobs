export interface Job {
  id: number;
  title: string;
  company: string;
  description: string;
  workType?: string;
  salary?: number;
  flexibleHours?: boolean;
  requiredSkills_1?: string;
  requiredSkills_2?: string;
  requiredSkills_3?: string;
  matchScore: number;
}

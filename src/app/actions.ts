'use server';

import { supabase } from '../lib/supabase';
import { Job } from './lib/types';

export async function getJobs(formData: FormData): Promise<Job[]> {
    console.log('Memulai analisis cerdas dengan 8 faktor dinamis...');

    // 1. Mengambil dan mem-parsing semua input pengguna
    const qualifications = formData.get('qualifications') as string || '';
    const aspirations = formData.get('aspirations') as string || '';
    const major = formData.get('major') as string || '';
    const workType = formData.get('workType') as string || 'any';
    const desiredSalary = parseInt(formData.get('salary') as string, 10) || 0;
    const wlbPreference = parseInt(formData.get('wlbPreference') as string, 10) || 3;
    const desiredBenefits = formData.get('desiredBenefits') as string || '';

    console.log('Input Pengguna:', { qualifications, aspirations, major, workType, desiredSalary, wlbPreference, desiredBenefits });

    const { data: jobs, error } = await supabase.from('jobs').select('*').returns<Job[]>();

    if (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
    if (!jobs) {
        console.log('Tidak ada pekerjaan di database.');
        return [];
    }

    console.log(`Ditemukan ${jobs.length} pekerjaan. Mulai menghitung skor kecocokan...`);

    const recommendedJobs = jobs.map((job: Job) => {
        let matchScore = 0;

        // Pra-pemrosesan: Agregasi data dari format datar ke array
        const jobSkills = [job.requiredSkills_1, job.requiredSkills_2, job.requiredSkills_3, job.requiredSkills_4].filter(Boolean) as string[];
        const jobBenefits = [job.benefits_1, job.benefits_2, job.benefits_3].filter(Boolean) as string[];
        const jobMajors = [job.relatedMajors_1, job.relatedMajors_2, job.relatedMajors_3, job.relatedMajors_4].filter(Boolean) as string[];

        // Faktor 1: Keahlian (Bobot 25%)
        if (jobSkills.length > 0) {
            const userSkills = qualifications.toLowerCase().split(',').map(s => s.trim());
            const matchedSkills = jobSkills.filter(skill => userSkills.includes(skill.toLowerCase()));
            matchScore += (matchedSkills.length / jobSkills.length) * 25;
        }

        // Faktor 2: Jenjang Pendidikan & Jurusan (Bobot 10%)
        if (major) {
            const majorLower = major.toLowerCase().trim();
            const isMajorMatch = jobMajors.some(m => m.toLowerCase().includes(majorLower)) || job.degreeRequired?.toLowerCase().includes(majorLower);
            if (isMajorMatch) {
                matchScore += 10;
            }
        }
        
        // Faktor 3: Industri & Aspirasi (Bobot 10%)
        if (aspirations && job.industry) {
            if (job.industry.toLowerCase().includes(aspirations.toLowerCase().trim())) {
                matchScore += 10;
            }
        }

        // Faktor 4: Gaji (Bobot 10%)
        if (desiredSalary > 0 && job.salary) {
            if (job.salary >= desiredSalary) matchScore += 10;
            else if (job.salary >= desiredSalary * 0.9) matchScore += 7;
            else if (job.salary >= desiredSalary * 0.8) matchScore += 4;
        } else {
            matchScore += 5; // Netral jika tidak ada input
        }

        // Faktor 5: Tipe Pekerjaan (Bobot 5%)
        if (workType !== 'any' && job.workType) {
            if (workType.toLowerCase() === job.workType.toLowerCase()) {
                matchScore += 5;
            }
        } else {
            matchScore += 2.5; // Netral jika fleksibel
        }

        // Faktor 6: Work-Life Balance (Bobot 20%)
        if (job.workLifeBalanceRating) {
            const diff = Math.abs(wlbPreference - job.workLifeBalanceRating);
            const score = (1 - (diff / 4)) * 20; // Max diff is 4 (1 vs 5)
            matchScore += score;
        }

        // Faktor 7: Benefits (Bobot 20%)
        const userBenefits = desiredBenefits.toLowerCase().split(',').map(b => b.trim()).filter(b => b);
        if (userBenefits.length > 0 && jobBenefits.length > 0) {
            const matchedBenefits = userBenefits.filter(b => jobBenefits.some(jobBenefit => jobBenefit.toLowerCase().includes(b)));
            matchScore += (matchedBenefits.length / userBenefits.length) * 20;
        } else {
            matchScore += 10; // Netral jika tidak ada input
        }

        // Faktor 8: Fleksibilitas & Kultur (Bobot Tambahan 5%)
        if (job.flexibleHours) matchScore += 2.5;
        if (job.workCulture === 'startup') matchScore += 2.5; // Sedikit bonus untuk kultur modern

        return { ...job, matchScore };
    });

    const finalJobs = recommendedJobs
        .filter((job) => job.matchScore > 40) // Ambang batas yang lebih tinggi untuk hasil berkualitas
        .sort((a, b) => b.matchScore - a.matchScore);
    
    console.log(`Menyortir dan mengembalikan ${finalJobs.length} pekerjaan yang direkomendasikan.`);

    return finalJobs;
}

export async function getAllJobs(): Promise<Job[]> {
    const { data: jobs, error } = await supabase.from('jobs').select('*').returns<Job[]>();

    if (error) {
        console.error('Error fetching all jobs:', error);
        return [];
    }
    if (!jobs) {
        console.log('Tidak ada pekerjaan di database.');
        return [];
    }
    // Assign a default matchScore for display purposes, or handle as needed.
    // For this page, we just want to display all, so no complex scoring is needed.
    return jobs.map(job => ({ ...job, matchScore: 0 })); // Add a dummy matchScore if needed by JobCard
}

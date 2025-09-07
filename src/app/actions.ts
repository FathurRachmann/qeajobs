'use server';

import { supabase } from '../lib/supabase';

export async function getJobs(formData: FormData) {
    console.log('Mulai analisis dengan 6 faktor...');

    // Ambil data dari formulir, termasuk jurusan
    const qualifications = formData.get('qualifications') as string || '';
    const aspirations = formData.get('aspirations') as string || '';
    const major = formData.get('major') as string || '';
    const workType = formData.get('workType') as string || 'any';
    const desiredSalary = parseInt(formData.get('salary') as string, 10) || 0;
    const wantsFlexibleHours = formData.get('flexibleHours') === 'true';

    console.log('Input Pengguna:', { qualifications, aspirations, major, workType, desiredSalary, wantsFlexibleHours });

    const { data: jobs, error } = await supabase.from('jobs').select('*');

    if (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
    if (!jobs || jobs.length === 0) {
        console.log('Tidak ada pekerjaan di database.');
        return [];
    }

    console.log(`Ditemukan ${jobs.length} pekerjaan. Mulai menghitung skor...`);

    const recommendedJobs = jobs.map((job: { requiredSkills_1: any; requiredSkills_2: any; requiredSkills_3: any; requiredSkills_4: any; relatedMajors_1: any; relatedMajors_2: any; relatedMajors_3: any; relatedMajors_4: any; description: string; workType: string; salary: number; flexibleHours: any; }) => {
        let matchScore = 0;

        // Faktor 1: Keahlian (Bobot 35%)
        const jobSkills = [job.requiredSkills_1, job.requiredSkills_2, job.requiredSkills_3, job.requiredSkills_4]
            .filter(s => typeof s === 'string' && s)
            .flatMap(s => s.split(',').map((skill: string) => skill.trim().toLowerCase()));
        if (jobSkills.length > 0) {
            const userSkills = qualifications.toLowerCase().split(',').map(s => s.trim());
            const matchedSkills = new Set(jobSkills.filter(skill => userSkills.includes(skill)));
            matchScore += (matchedSkills.size / new Set(jobSkills).size) * 35;
        }

        // Faktor 2: Jurusan (Bobot 25%)
        const jobMajors = [job.relatedMajors_1, job.relatedMajors_2, job.relatedMajors_3, job.relatedMajors_4]
            .filter(m => typeof m === 'string' && m)
            .map(m => m.trim().toLowerCase());
        if (jobMajors.length > 0 && major) {
            const userMajor = major.toLowerCase().trim();
            if (jobMajors.includes(userMajor)) {
                matchScore += 25; // Skor penuh jika jurusan cocok
            }
        }

        // Faktor 3: Aspirasi (Bobot 15%)
        if (aspirations && job.description) {
            const aspirationWords = new Set(aspirations.toLowerCase().split(/\s+/).filter(w => w.length > 2));
            const descriptionWords = new Set(job.description.toLowerCase().split(/\s+/));
            const matchedWords = [...aspirationWords].filter(word => descriptionWords.has(word));
            if (aspirationWords.size > 0) {
                matchScore += (matchedWords.length / aspirationWords.size) * 15;
            }
        }

        // Faktor 4: Tipe Pekerjaan (Bobot 10%)
        if (workType && workType !== 'any' && job.workType) {
            if (workType.toLowerCase() === job.workType.toLowerCase()) {
                matchScore += 10; // Cocok
            }
        } else {
            matchScore += 5; // Pengguna fleksibel, beri setengah poin
        }

        // Faktor 5: Gaji (Bobot 10%)
        if (desiredSalary > 0 && job.salary) {
            if (job.salary >= desiredSalary) {
                matchScore += 10; // Gaji sesuai atau lebih tinggi
            } else if (job.salary >= desiredSalary * 0.9) {
                matchScore += 7; // Gaji dalam 90% dari harapan
            } else if (job.salary >= desiredSalary * 0.8) {
                matchScore += 4; // Gaji dalam 80% dari harapan
            }
        } else {
            matchScore += 5; // Pengguna tidak memasukkan gaji, beri setengah poin
        }

        // Faktor 6: Jam Fleksibel (Bobot 5%)
        if (wantsFlexibleHours) {
            if (job.flexibleHours) {
                matchScore += 5; // Keduanya ingin jam fleksibel
            }
        } else {
            matchScore += 2.5; // Pengguna tidak mementingkan jam fleksibel, beri setengah poin
        }

        return { ...job, matchScore };
    });

    // Saring pekerjaan dengan skor di atas ambang batas dan urutkan
    const finalJobs = recommendedJobs
        .filter((job: { matchScore: number; }) => job.matchScore > 20)
        .sort((a: { matchScore: number; }, b: { matchScore: number; }) => b.matchScore - a.matchScore);
    
    console.log(`Menyortir dan mengembalikan ${finalJobs.length} pekerjaan yang direkomendasikan.`);

    return finalJobs;
}
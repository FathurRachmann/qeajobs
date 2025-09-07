'use client';

import { Tag, Progress } from 'antd';
import { 
    GlobalOutlined, 
    DollarCircleOutlined, 
    ThunderboltFilled, 
    BankOutlined,
    RocketOutlined,
    TrophyOutlined,
    SmileOutlined,
    TeamOutlined,
    BookOutlined,
    UsergroupAddOutlined,
    StarFilled
} from '@ant-design/icons';
import { Job } from '../lib/types';

const CardSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="mb-4 last:mb-0">
        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wider">
            {icon}
            {title}
        </h4>
        <div className="pl-6 text-gray-600">{children}</div>
    </div>
);

const JobCard = ({ job }: { job: Job }) => {
    const benefits = [job.benefits_1, job.benefits_2, job.benefits_3].filter(Boolean) as string[];
    const skills = [job.requiredSkills_1, job.requiredSkills_2, job.requiredSkills_3, job.requiredSkills_4].filter(Boolean) as string[];

    const formatSalary = (salary: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(salary);
    };

    const matchScore = Math.round(job.matchScore);

    const getProgressColor = (score: number) => {
        if (score > 85) return { from: '#10b981', to: '#34d399' }; // Green
        if (score > 70) return { from: '#f59e0b', to: '#fbbf24' }; // Amber
        return { from: '#ef4444', to: '#f87171' }; // Red
    }

    return (
        <div className="bg-white rounded-xl shadow-lg h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-gray-200">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{job.title}</h3>
                <p className="text-base text-gray-700 mt-1">{job.company}</p>
                <div className="flex items-center text-sm text-gray-500 mt-2 gap-4">
                    <span className="flex items-center gap-1.5"><BankOutlined /> {job.location}</span>
                    <span className="flex items-center gap-1.5"><GlobalOutlined /> {job.workType}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-6 space-y-5">
                {skills.length > 0 && (
                    <CardSection title="Skill Utama" icon={<ThunderboltFilled className="text-orange-500" />}>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <Tag key={index} className="bg-orange-50 text-orange-800 border-none px-3 py-1 text-xs rounded-full">{skill}</Tag>
                            ))}
                        </div>
                    </CardSection>
                )}

                {benefits.length > 0 && (
                    <CardSection title="Benefit Unggulan" icon={<TrophyOutlined className="text-green-500" />}>
                        <div className="flex flex-wrap gap-2">
                             {benefits.map((benefit, index) => (
                                <Tag key={index} className="bg-green-50 text-green-800 border-none px-3 py-1 text-xs rounded-full">{benefit}</Tag>
                            ))}
                        </div>
                    </CardSection>
                )}

                {job.careerPath_nextRole && (
                     <CardSection title="Jenjang Karier" icon={<RocketOutlined className="text-blue-500" />}>
                        <p className='text-gray-600'>Peran selanjutnya: <strong className="text-gray-800">{job.careerPath_nextRole}</strong> ({job.careerPath_timeframe})</p>
                    </CardSection>
                )}
                
                 <CardSection title="Kultur & Lingkungan" icon={<SmileOutlined className="text-purple-500" />}>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {job.hasMentorship && <div className="flex items-center gap-2"><TeamOutlined /> Mentorship</div>}
                        {job.learningPrograms && <div className="flex items-center gap-2"><BookOutlined /> Program Belajar</div>}
                        {job.flexibleHours && <div className="flex items-center gap-2"><SmileOutlined /> Jam Fleksibel</div>}
                        {job.agePreference_1 && <div className="flex items-center gap-2"><UsergroupAddOutlined /> Usia: {job.agePreference_1}-{job.agePreference_2}</div>}
                    </div>
                 </CardSection>
            </div>

            {/* Footer - Match Score */}
            <div className="mt-auto px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
                 <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                        <StarFilled className="text-yellow-500"/>
                        Skor Kecocokan
                    </p>
                    <p className="font-bold text-2xl text-orange-600">
                        {matchScore}
                    </p>
                </div>
                <Progress 
                    percent={matchScore} 
                    showInfo={false} 
                    size="small" 
                    className="mt-2" 
                    strokeColor={getProgressColor(matchScore)}
                />
            </div>
        </div>
    );
};

export default JobCard;

'use client';

import { Tag, Progress, Tooltip } from 'antd';
import { GlobalOutlined, DollarCircleOutlined, ClockCircleOutlined, ThunderboltFilled, StarFilled } from '@ant-design/icons';
import { Job } from '../lib/types';

const InfoPill = ({ icon, text, tooltip }: { icon: React.ReactNode; text: string | number; tooltip: string }) => (
    <Tooltip title={tooltip}>
        <div className="flex items-center gap-2 text-gray-300 bg-slate-900/50 px-3 py-1.5 rounded-full text-xs">
            {icon}
            <span className="font-semibold">{text}</span>
        </div>
    </Tooltip>
);

const JobCard = ({ job }: { job: Job }) => {
    const skills = [...new Set([
        job.requiredSkills_1, job.requiredSkills_2, job.requiredSkills_3
    ].filter(Boolean).flatMap(s => s ? s.split(',').map((sk: string) => sk.trim()) : []))];

    const formatSalary = (salary?: number) => {
        if (!salary) return 'N/A';
        return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(salary);
    };

    const getVibe = (score: number) => {
        if (score > 85) return { text: 'Vibe Check: Sempurna!', color: '#23b26d', gradient: 'from-green-400 to-cyan-400' };
        if (score > 70) return { text: 'Vibe Check: Cocok Banget', color: '#00b4d8', gradient: 'from-cyan-400 to-blue-400' };
        if (score > 50) return { text: 'Vibe Check: Boleh Dicoba', color: '#ffc107', gradient: 'from-yellow-400 to-orange-400' };
        return { text: 'Vibe Check: Kurang Pas', color: '#ff4d4f', gradient: 'from-pink-500 to-red-500' };
    };

    const vibe = getVibe(job.matchScore);

    return (
        <div className="glassmorphism flex flex-col h-full group transition-all duration-300 hover:border-purple-500/80 hover:shadow-2xl hover:shadow-purple-800/20">
            {/* Header */}
            <div className="p-6 border-b-2 border-slate-700/50">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300 leading-tight">{job.title}</h3>
                <p className="text-md text-gray-400 mt-1">{job.company}</p>
            </div>

            {/* Main Content */}
            <div className="p-6 flex-grow flex flex-col gap-y-5">
                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-2">
                    <InfoPill icon={<GlobalOutlined />} text={job.workType || 'N/A'} tooltip="Tipe Pekerjaan" />
                    <InfoPill icon={<DollarCircleOutlined />} text={formatSalary(job.salary)} tooltip="Gaji" />
                    {job.flexibleHours && <InfoPill icon={<ClockCircleOutlined />} text="Fleksibel" tooltip="Jam Kerja" />}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed h-24 overflow-auto flex-grow">
                    {job.description}
                </p>

                {/* Core Skills */}
                <div>
                    <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2"><ThunderboltFilled className="text-yellow-400" /> Skill Utama</h4>
                    <div className="flex flex-wrap gap-2">
                        {skills.slice(0, 4).map((skill: string, index: number) => (
                            <Tag key={index} color="blue" className="bg-blue-900/70 border-blue-700 text-blue-300">{skill}</Tag>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer - Vibe Meter */}
            <div className="p-6 border-t-2 border-slate-700/50 mt-auto">
                 <div className="flex justify-between items-center mb-1.5">
                    <p className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${vibe.gradient}`}>{vibe.text}</p>
                    <p className="font-bold text-lg flex items-center gap-1.5" style={{color: vibe.color}}>
                        <StarFilled />
                        {Math.round(job.matchScore)}
                    </p>
                </div>
                <Progress percent={Math.round(job.matchScore)} showInfo={false} strokeColor={vibe.color} trailColor="rgba(255,255,255,0.1)" size="small" />
            </div>
        </div>
    );
};

export default JobCard;

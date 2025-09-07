
import { getAllJobs } from '../actions';
import JobCard from '../components/JobCard';
import { Empty } from 'antd';
import { BookOutlined } from '@ant-design/icons';

export default async function JobsPage() {
  const allJobs = await getAllJobs(); 

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Semua Pekerjaan yang Tersedia</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Jelajahi semua peluang kerja yang terdaftar di platform kami.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {allJobs && allJobs.length > 0 ? (
            allJobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <div className="lg:col-span-3 text-center py-16 bg-gray-50 rounded-2xl shadow-sm border border-gray-200">
                <Empty
                    image={<BookOutlined style={{ fontSize: 64, color: 'rgba(0,0,0,0.2)' }}/>}
                    description={
                        <span className="text-gray-500 text-lg">Belum ada pekerjaan yang tersedia.</span>
                    }
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

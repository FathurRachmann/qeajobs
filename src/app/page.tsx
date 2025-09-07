import JobFinder from './components/JobFinder';

export default function Home() {
  return (
    <div className="bg-white">
      <div id="job-finder" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-base font-semibold leading-7 text-orange-600">Mulai Perjalanan Karier Anda</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Temukan Jodoh Karier Anda</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Isi formulir di bawah ini dengan preferensi Anda. AI kami akan menganalisis profil Anda untuk menemukan peluang kerja yang paling cocok.
              </p>
            </div>
            <div className="mt-16">
              <JobFinder />
           </div>
        </div>
      </div>
    </div>
  );
}

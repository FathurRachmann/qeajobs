import JobFinder from './components/JobFinder';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 sm:p-8 md:p-12">
      <div className="relative flex place-items-center mb-12 md:mb-16 text-center z-10">
        <div className="flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter text-balance">
              Let&apos;s Find Your
              <span className="block mt-1 md:mt-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Dream Job</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl text-balance">
             Bukan cuma pekerjaan. Temukan tempat di mana Anda bisa berkembang, berinovasi, dan menjadi diri sendiri. Cukup ceritakan passion Anda, kami urus sisanya.
            </p>
        </div>
      </div>

      <JobFinder />
    </main>
  );
}

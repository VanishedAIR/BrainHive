export default function Overview() {
  return (
    <div
      id="overview"
      className="relative min-h-screen py-16 px-8"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <img
            src="https://images-websitehunt.s3.amazonaws.com/website/discuuver_homepage.png"
            alt="Overview Image"
            className="w-full max-w-2xl h-auto object-contain rounded-lg shadow-xl"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-4xl font-bold text-amber-800 leading-tight">
            Website Part 1
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            blah blah blah
          </p>
        </div>
      </div>
    </div>
  );
}

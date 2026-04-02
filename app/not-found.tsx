import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#efefec] px-5 pb-16 pt-[104px] text-foreground md:px-10 md:pt-[150px]">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-10 md:mb-14">
          <img
            src="/yks-purple.png"
            alt="YKS"
            className="h-auto w-[184px] md:w-[245px]"
          />
        </div>

        <div className="max-w-[980px] space-y-6 md:space-y-8">
          <p className="max-w-[860px] font-['Perfektta'] text-[22px] leading-[1.02] tracking-[-0.03em] text-[#2F4DFF] sm:text-[28px] sm:leading-[1.04] md:text-[40px] md:leading-[0.98]">
            Page not found.
          </p>

          <div className="pt-2">
            <Link
              href="/"
              className="font-['Perfektta'] text-[20px] leading-none text-[#7B00FF] transition-opacity hover:opacity-70 focus-visible:rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:text-[26px]"
            >
              Back to home.
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Project = {
  title: string;
  client: string;
  mediaType: "video" | "image";
  previewSrc: string;
  modalSrc: string;
  description: string;
};

export default function Home() {
  const projects: Project[] = [
    {
      title: "Good with Money",
      client: "Starling",
      mediaType: "video",
      previewSrc: "/good-with-money.mp4",
      modalSrc: "/good-with-money.mp4",
      description: "Placeholder description",
    },
    {
      title: "Good with Money",
      client: "Starling",
      mediaType: "video",
      previewSrc: "/good-with-money.mp4",
      modalSrc: "/good-with-money.mp4",
      description: "Placeholder description",
    },
    {
      title: "Hello, Starling Bank.",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/hello-starling-bank.mp4",
      modalSrc: "/hello-starling-bank.mp4",
      description:
        "Highlighting the ease and simplicity of Starling's signing up process.",
    },
  ];

  const tickerItems = ["Design and Creative", "London, UK", "2026"];

  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    const overlay = overlayRef.current;
    const modal = modalRef.current;
    const preview = previewRef.current;

    if (!overlay || !modal || !preview) return;

    const previewRect = preview.getBoundingClientRect();

    gsap.set(modal, { opacity: 0, display: "block" });
    const modalRect = modal.getBoundingClientRect();
    gsap.set(modal, { display: "" });

    const clone = preview.cloneNode(true) as HTMLElement;
    document.body.appendChild(clone);

    gsap.set(clone, {
      position: "fixed",
      top: previewRect.top,
      left: previewRect.left,
      width: previewRect.width,
      height: previewRect.height,
      margin: 0,
      zIndex: 200,
    });

    gsap.set(overlay, { opacity: 0 });
    gsap.set(modal, { opacity: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => clone.remove(),
    });

    tl.to(overlay, {
      opacity: 1,
      duration: 0.25,
    })
      .to(
        clone,
        {
          top: modalRect.top,
          left: modalRect.left,
          width: modalRect.width,
          height: modalRect.height,
          duration: 0.6,
        },
        0
      )
      .to(
        modal,
        {
          opacity: 1,
          duration: 0.25,
        },
        0.35
      );

    return () => tl.kill();
  }, [selectedProject]);

  function closeModal() {
    if (!overlayRef.current || !modalRef.current) {
      setSelectedProject(null);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => setSelectedProject(null),
    });

    tl.to(modalRef.current, {
      opacity: 0,
      duration: 0.2,
    }).to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
      },
      0
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#efefec] text-black">
      <div className="fixed left-0 right-0 top-0 z-40 overflow-hidden border-b border-black/10 bg-[#efefec]">
        <div className="marquee-track flex w-max whitespace-nowrap py-3">
          {Array.from({ length: 8 })
            .flatMap(() => tickerItems)
            .map((item, i) => (
              <span key={i} className="mr-12 text-[14px] md:text-[16px]">
                {item}
              </span>
            ))}
        </div>
      </div>

      <div className="px-6 pb-16 pt-20 md:px-10 md:pt-24">
        <div className="max-w-[1400px]">
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-8">
            <div className="md:col-span-12">
              <div className="text-[44px] leading-none tracking-[-0.04em] md:text-[62px]">
                Yadkram
              </div>
            </div>

            <section
              className="relative min-h-[480px] md:col-span-12"
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className="grid md:grid-cols-12 md:gap-x-8">
                <div className="md:col-span-7 space-y-5">
                  {projects.map((project, i) => {
                    const isActive = activeProject === project;

                    return (
                      <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setActiveProject(project)}
                      onFocus={() => setActiveProject(project)}
                      onClick={() => setSelectedProject(project)}
                      className="block text-left"
                    >
                        <div className="flex items-start gap-6">
                          <span
                            className={`text-[52px] md:text-[72px] leading-[0.95] tracking-[-0.05em] ${
                              isActive ? "relative z-30 text-white" : ""
                            }`}
                          >
                            {project.title}
                          </span>

                          <span className="pt-4 text-[18px] text-black/45">
                            {project.client}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center md:flex">
                  {activeProject && (
                    <div ref={previewRef} className="w-[700px]">
                  <video
                    src={activeProject.previewSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full object-cover"
                  />
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="mt-6 md:col-span-12 md:mt-8">
              <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-8">
                <div className="min-w-0 md:col-span-4">
                  <h2 className="mb-4 text-[16px] font-semibold">Experience</h2>

                  <div className="space-y-6 text-[18px] leading-[1.2]">
                    <div>
                      <p>Starling Bank / Art Director</p>
                      <p>November 2017 - September 2025</p>
                    </div>

                    <div>
                      <p>Village PR / Art Director</p>
                      <p>2017</p>
                    </div>

                    <div>
                      <p>OMD International</p>
                      <p>2014 - 2017</p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 md:col-span-4">
                  <h2 className="mb-4 text-[16px] font-semibold">Coverage</h2>

                  <p className="text-[18px] leading-[1.25] underline decoration-black/60 underline-offset-2">
                    Dezeen, Design Week, Design Week (10 biggest product launches
                    of 2018), Creative Review, The Verge, The Drum, Forbes,
                    Finextra, Under Consideration, Money Saving Expert, GQ Italia,
                    Yanko Design, American Banker, Financial Times, Creative Pool.
                  </p>
                </div>

                <div className="min-w-0 md:col-span-4">
                  <h2 className="mb-4 text-[16px] font-semibold">Brands</h2>

                  <p className="text-[18px] leading-[1.25]">
                    Aries Arise, Baracuta, Beats by Dre, Brooks, Canon, Champion,
                    Disney, Google, KIA, Marmite, McDonald&apos;s, Nutella,
                    Smirnoff, Starling Bank.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {selectedProject && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-[1100px] bg-[#efefec] p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 text-[14px] text-black/60 hover:text-black"
            >
              Close
            </button>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.35fr_0.65fr]">
              <div className="overflow-hidden bg-black">
                <video
                  src={selectedProject.modalSrc}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div>
                  <p className="text-[32px] leading-[0.98] tracking-[-0.04em] md:text-[44px]">
                    {selectedProject.title}
                  </p>

                  <p className="mt-2 text-[16px] text-black/60">
                    {selectedProject.client}
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-[12px] uppercase tracking-[0.08em] text-black/50">
                    Bio
                  </h3>

                  <p className="text-[18px] leading-[1.35]">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
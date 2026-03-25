"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* =========================
   TYPES
========================= */
type Project = {
  title: string;
  client: string;
  mediaType: "video" | "image";
  previewSrc: string;
  modalSrc: string;
  description: string;
};

export default function Home() {
  /* =========================
     DATA
  ========================= */
  const projects: Project[] = [
    {
      title: "Starling Bank Rebrand",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/projects/starling-brand.mp4",
      modalSrc: "/projects/starling-brand.mp4",
      description:
        "Starling’s most significant rebrand since 2017, evolving the visual identity across product, marketing and brand touchpoints.",
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
    {
      title: "Good with Money",
      client: "Starling",
      mediaType: "video",
      previewSrc: "/good-with-money.mp4",
      modalSrc: "/good-with-money.mp4",
      description: "Placeholder description",
    },
  ];

  const tickerItems = ["Design and Creative", "London, UK", "2026"];

  /* =========================
     STATE
  ========================= */
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  /* =========================
     REFS
  ========================= */
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  /* =========================
     ESC CLOSE
  ========================= */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* =========================
     GSAP TRANSITION
  ========================= */
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

    return () => {
      tl.kill();
      clone.remove();
    };
  }, [selectedProject]);

  /* =========================
     CLOSE MODAL
  ========================= */
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

  /* =========================
     RENDER
  ========================= */
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#efefec] text-black">
      {/* =========================
         TOP TICKER
      ========================= */}
      <div className="fixed left-0 right-0 top-0 z-40 overflow-hidden border-b border-black/10 bg-[#efefec]">
        <div className="marquee-track flex w-max whitespace-nowrap py-3">
          {Array.from({ length: 8 })
            .flatMap(() => tickerItems)
            .map((item, i) => (
              <span key={i} className="mr-12 text-[14px] text-blue-600 md:text-[16px]">
                {item}
              </span>
            ))}
        </div>
      </div>

      {/* =========================
         PAGE WRAPPER
      ========================= */}
      <div className="px-6 pb-16 pt-20 md:px-10 md:pt-24">
        <div className="max-w-[1400px]">
          {/* =========================
             GRID LAYOUT
          ========================= */}
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-8">
            {/* =========================
               LOGO
            ========================= */}
            <div className="md:col-span-12">
              <div className="text-[56px] text-red-500 md:text-[72px]">YKS</div>
            </div>

            {/* =========================
               PROJECT LIST
            ========================= */}
            <section
              className="relative min-h-[480px] md:col-span-12"
              onMouseLeave={() => setActiveProject(null)}
            >
              <div className="grid md:grid-cols-12 md:gap-x-8">
                {/* PROJECT TITLES */}
                <div className="space-y-5 md:col-span-9">
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
        <div className="flex flex-col md:block">

          <span
            className={`${isActive ? "relative z-30 text-white" : ""}`}
            style={{
              fontFamily: "Perfektta, Arial, sans-serif",
              fontSize: "clamp(56px, 8vw, 110px)",
              letterSpacing: "-0.03em",
              lineHeight: "0.92",
              wordBreak: "keep-all",
            }}
          >
            {project.title === "Starling Bank Rebrand" ? (
              <>
                Starling{" "}
                <span
                  style={{
                    textDecoration: "line-through",
                    textDecorationThickness: "8px",
                    textDecorationColor: "currentColor",
                  }}
                >
                  Bank
                </span>{" "}
                Rebrand
              </>
            ) : (
              project.title
            )}

            <span
              className={`hidden md:inline ${
                isActive ? "text-white/80" : "text-black/65"
              }`}
              style={{
                fontFamily: "Teodor, Georgia, serif",
                fontSize: "clamp(15px, 1.2vw, 18px)",
                lineHeight: "1.05",
                letterSpacing: "0em",
                marginLeft: "clamp(10px, 1vw, 18px)",
                transform: "translateY(0.12em)",
                whiteSpace: "nowrap",
              }}
            >
              {project.client}
            </span>
          </span>

          <span
            className={`md:hidden ${
              isActive ? "text-white/80" : "text-black/65"
            }`}
            style={{
              fontFamily: "Teodor, Georgia, serif",
              fontSize: "16px",
              marginTop: "clamp(6px, 0.6vw, 10px)",
            }}
          >
            {project.client}
          </span>

        </div>
      </button>
    );
  })}
</div>

                {/* =========================
                   HOVER PREVIEW
                ========================= */}
                <div className="pointer-events-none absolute inset-0 z-20 hidden items-center justify-center md:flex">
                  {activeProject && (
                   <div
                   ref={previewRef}
                   className={
                     activeProject?.previewSrc === "/projects/starling-brand.mp4"
                       ? "w-[520px]"
                       : "w-[700px]"
                   }
                 >
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

            {/* =========================
               LOWER INFO SECTION
            ========================= */}
            <section className="mt-6 md:col-span-12 md:mt-8">
              <div className="grid grid-cols-1 gap-y-10 md:grid-cols-12 md:gap-x-8">
                {/* COVERAGE */}
                <div className="md:col-span-4">
                  <h2 className="mb-4 text-[16px] font-semibold">Coverage</h2>
                  <p className="text-[18px] leading-[1.35]">
                    <span className="underline decoration-black/60 underline-offset-2">
                      Design Week (10 biggest product launches of 2018)
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      Creative Review
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      The Verge
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      The Drum
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      Forbes
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      Finextra
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      Under Consideration
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      Money Saving Expert
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      GQ Italia
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      Yanko Design
                    </span>,{" "}
                    <span className="underline decoration-black/60 underline-offset-2">
                      American Banker
                    </span>.
                  </p>
                </div>

                {/* BRANDS */}
                <div className="md:col-span-4">
                  <h2 className="mb-4 text-[16px] font-semibold">Brands</h2>
                  <p className="text-[18px]">
                    Aries Arise, Canon, Google, KIA, McDonald's, Nutella, Starling Bank.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* =========================
         MODAL
      ========================= */}
      {selectedProject && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6 backdrop-blur-md"
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
              className="absolute right-4 top-4 text-[14px]"
            >
              Close
            </button>

            <div className="grid gap-6 md:grid-cols-[1.35fr_0.65fr]">
              <video src={selectedProject.modalSrc} controls className="w-full" />

              <div>
                <p className="text-[40px]">{selectedProject.title}</p>
                <p>{selectedProject.client}</p>
                <p>{selectedProject.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
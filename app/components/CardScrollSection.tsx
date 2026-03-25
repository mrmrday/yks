"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CardScrollSection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const sheenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(
            cardRef.current,
            {
              rotateY: -30,
              rotateX: 10,
              y: 120,
              scale: 0.8,
            },
            {
              rotateY: 360,
              rotateX: 0,
              y: -20,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=2400",
                scrub: 1,
                pin: true,
              },
            }
          );
          gsap.fromTo(
            sheenRef.current,
            {
              xPercent: -120,
              opacity: 0.35,
            },
            {
              xPercent: 120,
              opacity: 0.75,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=2400",
                scrub: 1,
              },
            }
          );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center bg-black text-white"
      style={{ perspective: "1600px" }}
    >
      <div
        ref={cardRef}
        className="relative h-[220px] w-[350px] md:h-[320px] md:w-[510px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 rounded-[20px] overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src="/card-front.svg"
            alt="Card front"
            className="w-full h-full object-cover"
          />
          

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0)_12%,rgba(255,255,255,0.12)_28%,rgba(255,255,255,0.52)_48%,rgba(255,255,255,0.22)_58%,rgba(255,255,255,0)_78%)] opacity-90" />
         
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.08)_18%,rgba(255,255,255,0)_42%,rgba(0,0,0,0.08)_100%)]" />
        </div>

        <div
          className="absolute inset-0 rounded-[20px] overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <img
            src="/card-back.svg"
            alt="Card back"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
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
  hoverPreviewSrc?: string;
  modalSrc?: string;
  gallery?: string[];
  description: string;
};

type GalleryLayoutItem = {
  type: "single" | "triptych" | "pair" | "quad" | "grid6";
  assets: string[];
  index: number;
};

const COVERAGE_LINKS = [
  {
    label: "Dezeen",
    href: "https://www.dezeen.com/2018/07/31/starling-bank-vertical-debit-card-money-design/",
  },
  {
    label: "Design Week",
    href: "https://www.designweek.co.uk/issues/23-29-july-2018/online-bank-starling-introduces-vertical-bank-card/",
  },
  {
    label: "Little Black Book",
    href: "https://lbbonline.com/news/starling-bank-manages-money-for-all-in-new-brand-platform",
  },
  {
    label: "Design Week (10 biggest product launches of 2018)",
    href: "https://www.designweek.co.uk/issues/17-23-december-2018/the-10-biggest-product-and-app-launches-of-2018/",
  },
  {
    label: "Creative Review",
    href: "https://www.creativereview.co.uk/starling-now-had-vertical-bank-card-do-we-need-the-disruption/",
  },
  {
    label: "The Verge",
    href: "https://www.theverge.com/2018/7/27/17620894/starling-bank-portrait-mastercard-debit-card-uk",
  },
  {
    label: "The Drum",
    href: "http://www.thedrum.com/news/2018/08/15/how-challenger-bank-redesigned-the-credit-card-the-vertical-era",
  },
  {
    label: "Forbes",
    href: "https://www.forbes.com/sites/madhvimavadiya/2018/07/25/starling-bank-new-vertical-debit-card-fintech/#4428ff7bb9b7",
  },
  {
    label: "Finextra",
    href: "https://www.finextra.com/newsarticle/32428/starling-bank-flips-the-debit-card-on-its-head",
  },
  {
    label: "Under Consideration",
    href: "https://www.underconsideration.com/brandnew/archives/credit_cards_flipped.php",
  },
  {
    label: "MSE",
    href: "https://www.moneysavingexpert.com/news/2018/07/starling-bank-launches-vertical-debit-card/",
  },
  {
    label: "GQ Italia",
    href: "https://www.gqitalia.it/lifestyle/design/2018/08/03/carta-di-credito-verticale-design-pratico-starling-bank/?refresh_ce=",
  },
  {
    label: "Yanko Design",
    href: "http://www.yankodesign.com/2018/07/30/we-should-have-had-credit-cards-in-portrait-mode-all-along/",
  },
  {
    label: "American Banker",
    href: "https://www.americanbanker.com/payments/news/banks-design-vertical-credit-cards-for-customers-with-disabilities",
  },
];

const BRANDS =
  "Aries Rise, Baracuta, Brooks, Canon, Champion, Disney, Google, KIA, McDonald’s, Nutella, Smirnoff, Starling Bank.";
const CONTACT_EMAIL = "hello@yks.com";

function getProjectGallery(project: Project) {
  if (project.gallery && project.gallery.length > 0) {
    return project.gallery;
  }

  return [project.modalSrc ?? project.previewSrc];
}

function getHoverPreviewSrc(project: Project) {
  return project.hoverPreviewSrc ?? project.previewSrc;
}

function isVideoAsset(src: string) {
  return src.endsWith(".mp4");
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getGalleryFrameClass(index: number, total: number) {
  if (total === 1) {
    return "mx-auto max-w-[1120px]";
  }

  const patterns = [
    "mx-auto max-w-[1120px]",
    "mx-auto max-w-[1040px]",
    "mx-auto max-w-[980px]",
    "mx-auto max-w-[1040px]",
  ];

  return patterns[index % patterns.length];
}

function getPreviewWidth(project: Project) {
  if (project.title === "Good With Money") return 700;
  if (project.title === "Kick On") return 600;
  if (project.title === "The Bank Built For You") return 640;
  return 700;
}

function getGalleryLayout(
  project: Project,
  gallery: string[]
): GalleryLayoutItem[] {
  if (
    project.title === "Good With Money" &&
    gallery.length >= 3 &&
    isVideoAsset(gallery[0]) &&
    isVideoAsset(gallery[1])
  ) {
    return [
      { type: "single", assets: [gallery[0]], index: 0 },
      { type: "pair", assets: gallery.slice(1, 3), index: 1 },
    ];
  }

  if (project.title === "The Bank Built For You" && gallery.length >= 7) {
    return [
      { type: "pair", assets: gallery.slice(0, 2), index: 0 },
      { type: "triptych", assets: gallery.slice(2, 5), index: 1 },
      { type: "pair", assets: gallery.slice(5, 7), index: 2 },
    ];
  }

  if (project.title === "Football Sponsorship" && gallery.length >= 10) {
    return [
      { type: "quad", assets: gallery.slice(0, 4), index: 0 },
      { type: "grid6", assets: gallery.slice(4, 10), index: 1 },
    ];
  }

  if (project.title === "Set Your Business Free" && gallery.length >= 2) {
    return [{ type: "pair", assets: gallery.slice(0, 2), index: 0 }];
  }

  if (project.title === "Set Yourself Free" && gallery.length >= 2) {
    return [{ type: "pair", assets: gallery.slice(0, 2), index: 0 }];
  }

  if (
    project.title === "Helping Business Fly" &&
    gallery.length >= 4 &&
    isVideoAsset(gallery[0])
  ) {
    return [
      { type: "single" as const, assets: [gallery[0]], index: 0 },
      { type: "triptych" as const, assets: gallery.slice(1, 4), index: 1 },
    ];
  }

  return gallery.map((asset, index) => ({
    type: "single" as const,
    assets: [asset],
    index,
  }));
}

function renderProjectWordmark(
  project: Project,
  isActive = false,
  isModal = false
) {
  return (
    <>
      <span
        className={`project-wordmark ${
          isModal ? "project-wordmark--modal" : "project-wordmark--list"
        } ${isActive ? "relative z-30 text-red-accent" : ""}`}
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
          className={`project-client-inline ${
            isActive ? "text-white/80" : "text-foreground-65"
          } ${isModal ? "project-client-inline--modal" : ""}`}
        >
          {project.client}
        </span>
      </span>
    </>
  );
}

function SectionLinks() {
  return (
    <p className="overlay-copy text-[18px] leading-[1.35] tracking-[-0.01em]">
      {COVERAGE_LINKS.map((link, index) => (
        <span key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-current/50 underline-offset-2 transition-opacity hover:opacity-70 focus-visible:rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            {link.label}
          </a>
          {index === COVERAGE_LINKS.length - 1 ? "." : ", "}
        </span>
      ))}
    </p>
  );
}

function LowerInfoSection({ mobile = false }: { mobile?: boolean }) {
  if (mobile) {
    return (
      <section className="overlay-copy">
        <div className="grid grid-cols-1 gap-y-8">
          <div>
            <h2 className="mb-5 text-[18px] leading-none tracking-[-0.01em]">
              Coverage
            </h2>
            <SectionLinks />
          </div>

          <div>
            <h2 className="mb-5 text-[18px] leading-none tracking-[-0.01em]">
              Brands
            </h2>
            <p className="text-[16px] tracking-[-0.01em]">{BRANDS}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overlay-copy">
      <div className="hidden md:grid md:grid-cols-12 md:gap-x-8 md:gap-y-5">
        <div className="md:col-span-4 md:col-start-1">
          <h2 className="text-[18px] leading-none tracking-[-0.01em]">
            Coverage
          </h2>
        </div>

        <div className="md:col-span-4 md:col-start-5">
          <h2 className="text-[18px] leading-none tracking-[-0.01em]">
            Brands
          </h2>
        </div>

        <div className="md:col-span-4 md:col-start-1">
          <SectionLinks />
        </div>

        <div className="md:col-span-4 md:col-start-5">
          <p className="text-[18px] leading-[1.35] tracking-[-0.01em]">
            {BRANDS}
          </p>
        </div>
      </div>
    </section>
  );
}

function MediaAsset({
  src,
  alt,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
}) {
  if (isVideoAsset(src)) {
    return (
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className={className}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={imageClassName ?? className}
    />
  );
}

export default function Home() {
  /* =========================
    DATA
  ========================= */
  const projects: Project[] = [
    {
      title: "Good With Money",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/good-with-money.mp4",
      hoverPreviewSrc: "/good-with-money-hover.mp4",
      modalSrc: "/good-with-money.mp4",
      gallery: [
        "/good-with-money.mp4",
        "/projects/starling-brand.mp4",
        "/projects/starling-brand.jpg",
      ],
      description:
        "Starling — Good With Money\n\nA major brand update repositioning Starling Bank around a simple but ambitious idea: everyone can be good with money.\n\nMoving beyond awareness, the platform reframed financial wellbeing as a behaviour, not a balance — shifting the narrative from wealth to confidence, control and everyday decision-making. Built in response to a challenging economic landscape, the work set out to normalise money management and make it feel accessible, human and within reach.\n\nThe relaunch extended across identity, product and communications — from a refreshed visual system and app experience to a new brand voice and integrated campaign ecosystem. Developed in collaboration with Wolff Olins and The Sunshine Company, the platform unified Starling’s proposition around a single mission: helping the UK build a healthier relationship with money.\n\nA shift from product-first to people-first thinking — positioning Starling not just as a bank, but as a tool for better financial habits.",
    },
    {
      title: "The Bank Built For You",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/projects/tbbfy-preview.mp4",
      hoverPreviewSrc: "/projects/tbbfy-hover.mp4",
      gallery: [
        "/projects/tbbfy-1.mp4",
        "/projects/tbbfy-2.mp4",
        "/projects/tbbfy-3.jpg",
        "/projects/tbbfy-4.jpg",
        "/projects/tbbfy-5.jpg",
        "/projects/tbbfy-6.jpg",
        "/projects/tbbfy-7.jpg",
      ],
      description:
        "A brand platform repositioning Starling around the lives of its customers. The work translates product into narrative — embedding features within everyday, character-led stories rather than traditional financial messaging. Built as an integrated system across film, OOH and digital, the platform creates a consistent language that adapts across audiences and life stages. A shift from feature-led advertising to human-centred storytelling.",
    },
    {
      title: "Joined At The Chip",
      client: "Starling Bank",
      mediaType: "image",
      previewSrc: "/projects/joined-1.jpg",
      gallery: [
        "/projects/joined-2.jpg",
        "/projects/joined-3.jpg",
        "/projects/joined-4.jpg",
        "/projects/joined-5.jpg",
      ],
      description:
        "Managing bills, saving for shared goals or just splitting the dinner tab: do life together with a joint account.\n\nCommitted media spend but the need to change direction at short notice. Executed in house with support from trusted friends. Proud of this one.",
    },
    {
      title: "Football Sponsorship",
      client: "Starling Bank",
      mediaType: "image",
      previewSrc: "/projects/womens-euro-2022-4.jpg",
      gallery: [
        "/projects/womens-euro-2022-1.jpg",
        "/projects/womens-euro-2022-2.jpg",
        "/projects/womens-euro-2022-3.jpg",
        "/projects/womens-euro-2022-4.jpg",
        "/projects/sfc-1.jpg",
        "/projects/sfc-2.jpg",
        "/projects/sfc-3.jpg",
        "/projects/sfc-4.jpg",
        "/projects/sfc-5.jpg",
        "/projects/sfc-6.jpg",
      ],
      modalSrc: "/projects/womens-euro-2022-4.jpg",
      description:
        "A long-term initiative built through women’s football. Launching with UEFA Women’s EURO 2022, the work transformed sponsorship into a fully integrated system — spanning national OOH, ambassador storytelling and product-led activations. The ‘Our Time’ campaign brought elite players into everyday contexts, reframing representation through a distinctly Starling lens. Extended through club partnerships, including front-of-shirt sponsorship of Southampton FC Women, alongside community investment and fan-led initiatives. A sustained expression of brand purpose — positioning Starling at the intersection of culture, equality and sport.",
    },
    {
      title: "Set Your Business Free",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/projects/set-your-business-free-preview.mp4",
      hoverPreviewSrc: "/projects/set-your-business-free-hover.mp4",
      modalSrc: "/projects/set-your-business-free-2.mp4",
      gallery: [
        "/projects/set-your-business-free.mp4",
        "/projects/set-your-business-free-2.mp4",
      ],
      description:
        "A continuation of Starling’s ‘Here to Change’ platform, extending the idea of freedom into the context of business banking. Set Your Business Free translates product benefits into a simple, visual system — using levitation as a metaphor for removing friction across everyday operations. Centred around a series of character-led vignettes, the campaign captures small business environments in moments of transformation, where tools, materials and ultimately the founders themselves lift into weightlessness. The work balances cinematic craft with functional clarity — embedding features such as zero fees and mobile-first tools within an emotive narrative. Deployed across TV and VOD, the campaign reframes business banking as an enabler of ease and momentum — shifting perception from administrative burden to a sense of lightness, control and forward movement.",
    },
    {
      title: "Set Yourself Free",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/projects/set-yourself-free-preview.mp4",
      hoverPreviewSrc: "/projects/set-yourself-free-hover.mp4",
      modalSrc: "/projects/set-yourself-free.mp4",
      gallery: [
        "/projects/set-yourself-free-preview.mp4",
        "/projects/set-yourself-free.mp4",
      ],
      description:
        "A brand campaign introducing Starling’s ‘Here to Change’ platform, designed to reframe the relationship people have with their bank. Set Yourself Free translates product proposition into a clear visual metaphor — using weightlessness and flight to express liberation from legacy banking systems. Centred around a cinematic narrative, the work contrasts the friction of traditional banking with the ease of a mobile-first experience, establishing a distinctive brand language built on freedom, simplicity and control.",
    },
    {
      title: "Kick On",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/projects/kick-on.mp4",
      hoverPreviewSrc: "/projects/kick-on-hover.mp4",
      modalSrc: "/projects/kick-on.mp4",
      description:
        "An extension of Starling’s women’s football platform, designed to address structural barriers across grassroots participation. Kick On translates brand into system — providing fully funded kits, coaching support and practical resources that enable clubs to grow. Alongside this, the Kick On Pitch Pack acts as a designed intervention, supporting teams in securing fair access to playing facilities. A move from campaign to infrastructure — embedding the brand within the everyday realities of the game.",
    },
    {
      title: "Helping Business Fly",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/projects/helping-business-fly-preview.mp4",
      hoverPreviewSrc: "/projects/helping-business-fly-hover.mp4",
      gallery: [
        "/projects/helping-business-fly-0.mp4",
        "/projects/helping-business-fly-1.jpg",
        "/projects/helping-business-fly-2.jpg",
        "/projects/helping-business-fly-3.jpg",
      ],
      description:
        "A campaign positioning Starling’s business offering through a cinematic metaphor of entrepreneurial risk and reward. Helping Business Fly translates the realities of building a business into a physical journey — from instability and uncertainty to clarity and control. Blending live action with miniature model-making and practical effects, the work introduces a crafted, tactile visual language that distinguishes it from typical financial advertising. The narrative follows a founder navigating turbulence before breaking through the clouds. The campaign reframes business banking from a functional service into a source of confidence and momentum — aligning the brand with ambition, resilience and growth.",
    },

    {
      title: "Hello, Starling Bank.",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/hello-starling-bank.mp4",
      hoverPreviewSrc: "/hello-starling-bank-hover.mp4",
      modalSrc: "/hello-starling-bank.mp4",
      description:
        "Highlighting the ease and simplicity of Starling's signing up process.",
    },
  ];

  /* =========================
    STATE
  ========================= */
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(
    null
  );
  const [activePreviewTop, setActivePreviewTop] = useState<number>(240);
  const [ukTime, setUkTime] = useState("--:--");
  const [ukTimeZone, setUkTimeZone] = useState("UK");
  const [londonWeather, setLondonWeather] = useState("London weather loading...");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isModalVideoPlaying, setIsModalVideoPlaying] = useState(false);
  const [isModalVideoMuted, setIsModalVideoMuted] = useState(true);

  /* =========================
    REFS
  ========================= */
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const projectListSectionRef = useRef<HTMLElement | null>(null);
  const projectButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastFocusedProjectIndexRef = useRef<number | null>(null);

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

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Europe/London",
    });
    const zoneFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      timeZoneName: "short",
    });

    function updateUkTime() {
      const now = new Date();
      setUkTime(formatter.format(now));
      const zonePart = zoneFormatter
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName");
      setUkTimeZone(zonePart?.value ?? "UK");
    }

    updateUkTime();
    const intervalId = window.setInterval(updateUkTime, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updatePreference() {
      setPrefersReducedMotion(mediaQuery.matches);
    }

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    function updateViewport() {
      setIsMobileViewport(mediaQuery.matches);
    }

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    setIsModalVideoPlaying(false);
    setIsModalVideoMuted(true);
  }, [selectedProject]);

  useEffect(() => {
    const weatherCodeLabels: Record<number, string> = {
      0: "Clear",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime fog",
      51: "Light drizzle",
      53: "Drizzle",
      55: "Dense drizzle",
      56: "Freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Light rain",
      63: "Rain",
      65: "Heavy rain",
      66: "Freezing rain",
      67: "Heavy freezing rain",
      71: "Light snow",
      73: "Snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Rain showers",
      81: "Heavy showers",
      82: "Violent showers",
      85: "Snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm and hail",
      99: "Heavy thunderstorm and hail",
    };

    let isMounted = true;

    async function updateLondonWeather() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=51.5072&longitude=-0.1276&current=temperature_2m,weather_code&timezone=Europe%2FLondon"
        );

        if (!response.ok) {
          throw new Error("Weather request failed");
        }

        const data = await response.json();
        const temperature = Math.round(data.current?.temperature_2m);
        const weatherCode = data.current?.weather_code;
        const label =
          typeof weatherCode === "number"
            ? weatherCodeLabels[weatherCode] ?? "Current conditions"
            : "Current conditions";

        if (isMounted) {
          setLondonWeather(`${label}, ${temperature}°C`);
        }
      } catch {
        if (isMounted) {
          setLondonWeather("currently unavailable");
        }
      }
    }

    updateLondonWeather();
    const intervalId = window.setInterval(updateLondonWeather, 900000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
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

    closeButtonRef.current?.focus();

    if (!overlay || !modal || !preview || prefersReducedMotion) {
      if (overlay && modal) {
        gsap.set(overlay, { opacity: 1 });
        gsap.set(modal, { opacity: 1 });
      }
      return;
    }

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
  }, [prefersReducedMotion, selectedProject]);

  useEffect(() => {
    const { body } = document;

    if (selectedProject) {
      body.classList.add("modal-scroll-lock");
    } else {
      body.classList.remove("modal-scroll-lock");
    }

    return () => {
      body.classList.remove("modal-scroll-lock");
    };
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) return;

    const lastFocusedIndex = lastFocusedProjectIndexRef.current;

    if (lastFocusedIndex !== null) {
      projectButtonRefs.current[lastFocusedIndex]?.focus();
    }
  }, [selectedProject]);

  useEffect(() => {
    if (!previewRef.current || prefersReducedMotion) return;

    if (!activeProject) {
      gsap.to(previewRef.current, {
        opacity: 0,
        duration: 0.16,
        ease: "power2.out",
      });
      return;
    }

    gsap.to(previewRef.current, {
      top: activePreviewTop,
      opacity: 1,
      duration: 0.28,
      ease: "power2.out",
      overwrite: true,
    });
  }, [activePreviewTop, activeProject, prefersReducedMotion]);

  /* =========================
    CLOSE MODAL
  ========================= */
  function closeModal() {
    if (prefersReducedMotion) {
      setSelectedProject(null);
      return;
    }

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

  function toggleModalVideoPlayback() {
    const video = modalVideoRef.current;

    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsModalVideoPlaying(true);
      return;
    }

    video.pause();
    setIsModalVideoPlaying(false);
  }

  function toggleModalVideoMuted() {
    const video = modalVideoRef.current;

    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsModalVideoMuted(nextMuted);
  }

  function handleProjectPreview(project: Project, index: number) {
    setActiveProject(project);
    setActiveProjectIndex(index);

    const section = projectListSectionRef.current;
    const button = projectButtonRefs.current[index];

    if (!section || !button) return;

    const sectionRect = section.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const nextPreviewCenter =
      buttonRect.top - sectionRect.top + buttonRect.height / 2;

    const previewWidth = getPreviewWidth(project);
    const previewHeight = previewWidth * 0.62;
    const minTop = previewHeight / 2 + 20;
    const maxTop = sectionRect.height - previewHeight / 2 - 20;
    const clampedTop = Math.min(Math.max(nextPreviewCenter, minTop), maxTop);

    setActivePreviewTop(clampedTop);
  }

  function clearProjectPreview() {
    setActiveProject(null);
    setActiveProjectIndex(null);
  }

  const selectedProjectGallery = selectedProject
    ? getProjectGallery(selectedProject)
    : [];
  const selectedProjectGalleryLayout = selectedProject
    ? getGalleryLayout(selectedProject, selectedProjectGallery)
    : [];
  const rawDescriptionParagraphs = selectedProject
    ? selectedProject.description
        .split("\n\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];
  const descriptionParagraphs =
    selectedProject &&
    rawDescriptionParagraphs.length > 0 &&
    normalizeText(rawDescriptionParagraphs[0]).includes(
      normalizeText(selectedProject.title)
    )
      ? rawDescriptionParagraphs.slice(1)
      : rawDescriptionParagraphs;
  const tickerItems = [
    "YKS",
    "Design and Creative",
    "London, UK",
    `${ukTime} (${ukTimeZone})`,
    "Have a nice day :)",
    londonWeather,
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#efefec] text-foreground">
      {/* =========================
        TOP TICKER
      ========================= */}

      <div className="fixed left-0 right-0 top-0 z-40 overflow-hidden border-b border-foreground-soft bg-[#efefec]">
        <div className="marquee-track flex w-max whitespace-nowrap py-2.5 md:py-3">
          {Array.from({ length: 8 })
            .flatMap(() => tickerItems)
            .map((item, i) => (
              <span
                key={i}
                className="mr-10 text-[13px] text-blue-accent md:mr-12 md:text-[16px]"
              >
                {item}
              </span>
            ))}
        </div>
      </div>

      <div className="fixed left-0 right-0 top-[38px] z-30 md:top-[43px]">
        <div className="px-5 py-4 md:px-10 md:py-6">
          <div className="max-w-[1400px]">
            <img
              src="/yks-purple.png"
              alt="YKS"
              className="h-auto w-[184px] md:w-[245px]"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 hidden text-blue-accent md:block">
        <div className="px-6 py-5 md:px-10 md:py-6">
          <div className="max-w-[1400px]">
            <LowerInfoSection />
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-4 right-5 z-30 transition-opacity md:bottom-6 md:right-10 ${
          selectedProject ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-[13px] text-blue-accent transition-opacity hover:opacity-70 focus-visible:rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:text-[16px]"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      {/* =========================
        PAGE WRAPPER
      ========================= */}
      <div className="px-5 pb-24 pt-[104px] md:px-10 md:pb-[210px] md:pt-[150px]">
        <div className="max-w-[1400px]">
          {/* =========================
            GRID LAYOUT
          ========================= */}
          <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-8">
            {/* =========================
              PROJECT LIST
            ========================= */}
            <section
              ref={projectListSectionRef}
              className="relative min-h-0 md:col-span-12 md:min-h-[480px]"
              onMouseLeave={clearProjectPreview}
            >
              <div className="grid md:grid-cols-12 md:gap-x-8">
                {/* PROJECT TITLES */}
                <div className="space-y-4 md:col-span-9 md:space-y-5">
                  {projects.map((project, i) => {
                    const isActive = activeProjectIndex === i;

                    return (
                      <button
                        key={i}
                        ref={(node) => {
                          projectButtonRefs.current[i] = node;
                        }}
                        type="button"
                        onMouseEnter={() => handleProjectPreview(project, i)}
                        onFocus={() => handleProjectPreview(project, i)}
                        onClick={() => {
                          lastFocusedProjectIndexRef.current = i;
                          setSelectedProject(project);
                        }}
                        aria-label={`Open project ${project.title}`}
                        className="block text-left focus-visible:rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-accent"
                      >
                        <div className="flex flex-col md:block">
                          {renderProjectWordmark(project, isActive)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* =========================
                  HOVER PREVIEW
                ========================= */}

                <div className="pointer-events-none absolute inset-0 z-20 hidden md:grid md:grid-cols-12 md:gap-x-8">
                  {activeProject && (
                    <div className="relative md:col-span-5 md:col-start-6">
                      <div
                        ref={previewRef}
                        className="absolute left-0 -translate-y-1/2"
                        style={{
                          top: `${activePreviewTop}px`,
                          width: `${getPreviewWidth(activeProject)}px`,
                        }}
                      >
                        {isVideoAsset(getHoverPreviewSrc(activeProject)) ? (
                          <video
                            src={getHoverPreviewSrc(activeProject)}
                            autoPlay={!prefersReducedMotion}
                            muted
                            loop={!prefersReducedMotion}
                            playsInline
                            preload="none"
                            className="w-full object-cover"
                          />
                        ) : (
                          <img
                            src={getHoverPreviewSrc(activeProject)}
                            alt={activeProject.title}
                            loading="lazy"
                            className="w-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="mt-8 pr-24 text-blue-accent md:hidden">
              <LowerInfoSection mobile />
            </div>

          </div>
        </div>
      </div>

      {/* =========================
        MODAL
      ========================= */}
      {selectedProject && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/72 px-2 py-2 backdrop-blur-xl sm:px-4 sm:py-4 md:px-6 md:py-6"
          onClick={closeModal}
        >
          <div className="pointer-events-none fixed right-5 top-5 z-[120] sm:right-7 sm:top-7 md:right-10 md:top-10">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[24px] leading-none text-black shadow-[0_10px_40px_rgba(0,0,0,0.18)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-12 sm:w-12 sm:text-[26px]"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>

          <div className="flex min-h-full items-start justify-center py-10 sm:items-center">
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              className="relative w-full max-w-[1240px] overflow-hidden rounded-[22px] border border-white/20 bg-[#f3f0ea] shadow-[0_30px_120px_rgba(0,0,0,0.35)] sm:rounded-[28px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="relative overflow-hidden bg-[#dcd7cb]">
                  <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black/20 to-transparent" />
                  {isVideoAsset(selectedProject.previewSrc) ? (
                    <>
                      <video
                        ref={modalVideoRef}
                        src={selectedProject.previewSrc}
                        muted
                        playsInline
                        controls={!isMobileViewport}
                        preload="metadata"
                        onPlay={() => setIsModalVideoPlaying(true)}
                        onPause={() => setIsModalVideoPlaying(false)}
                        onVolumeChange={(event) =>
                          setIsModalVideoMuted(event.currentTarget.muted)
                        }
                        className="aspect-[4/5] w-full bg-black object-cover sm:aspect-[16/10] md:aspect-[16/9]"
                      />

                      {isMobileViewport && (
                        <>
                          <button
                            type="button"
                            onClick={toggleModalVideoMuted}
                            className="font-display absolute right-4 top-4 z-20 flex min-w-[84px] items-center justify-center rounded-full bg-black/45 px-4 py-2 text-[18px] leading-none tracking-[-0.02em] text-white backdrop-blur-sm transition hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                            aria-label={
                              isModalVideoMuted ? "Unmute video" : "Mute video"
                            }
                          >
                            {isModalVideoMuted ? "sound" : "mute"}
                          </button>

                          <button
                            type="button"
                            onClick={toggleModalVideoPlayback}
                            className="absolute inset-0 z-10 flex items-center justify-center"
                            aria-label={
                              isModalVideoPlaying ? "Pause video" : "Play video"
                            }
                          >
                            <span className="font-display flex min-w-[108px] items-center justify-center rounded-full bg-black/42 px-6 py-4 text-[22px] leading-none tracking-[-0.02em] text-white backdrop-blur-sm">
                              {isModalVideoPlaying ? "pause" : "play"}
                            </span>
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <img
                      src={selectedProject.previewSrc}
                      alt={selectedProject.title}
                      className="aspect-[4/5] w-full object-cover sm:aspect-[16/10] md:aspect-[16/9]"
                    />
                  )}
                </div>

                <div className="px-5 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10">
                  <div className="max-w-[980px]">
                    <div id="project-modal-title" className="flex flex-col">
                      {renderProjectWordmark(selectedProject, false, true)}
                    </div>

                    <div className="mt-5 max-w-[1080px] space-y-4 sm:mt-6 sm:space-y-5 md:mt-5 md:space-y-4">
                      {descriptionParagraphs.map((paragraph, index) => (
                        <p
                          key={`${selectedProject.title}-${index}`}
                          className={`${
                            index === 0
                              ? "max-w-[980px] text-[22px] leading-[1.02] tracking-[-0.03em] text-foreground sm:text-[28px] sm:leading-[1.04] md:text-[40px] md:leading-[0.98]"
                              : "max-w-[1040px] text-[17px] leading-[1.38] text-foreground-78 sm:text-[18px] sm:leading-[1.42] md:text-[20px] md:leading-[1.34]"
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {selectedProjectGallery.length > 0 && (
                      <div className="mt-10 border-t border-foreground-soft pt-6 sm:mt-12 sm:pt-8">
                        <div className="space-y-4 sm:space-y-6 md:space-y-8">
                          {selectedProjectGalleryLayout.map((item) => (
                            <article
                              key={`${selectedProject?.title}-${item.index}`}
                              className={`w-full ${getGalleryFrameClass(
                                item.index,
                                selectedProjectGalleryLayout.length
                              )}`}
                            >
                              {item.type === "triptych" ? (
                                <div className="grid gap-2 rounded-[20px] border border-black/5 bg-[#e4ddd0] p-2 sm:gap-3 sm:rounded-[24px] sm:p-3 md:grid-cols-3 md:gap-4 md:p-4">
                                  {item.assets.map((src, assetIndex) => (
                                    <div
                                      key={src}
                                      className="flex items-center justify-center overflow-hidden rounded-[16px] bg-[#d8d1c2] sm:rounded-[18px]"
                                    >
                                      <img
                                        src={src}
                                        alt={`${selectedProject.title} triptych image ${assetIndex + 1}`}
                                        loading="lazy"
                                        className="h-full max-h-[68vh] w-full object-contain"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : item.type === "quad" ? (
                                <div className="grid gap-2 rounded-[20px] border border-black/5 bg-[#e4ddd0] p-2 sm:grid-cols-2 sm:gap-3 sm:rounded-[24px] sm:p-3 md:gap-4 md:p-4">
                                  {item.assets.map((src, assetIndex) => (
                                    <div
                                      key={src}
                                      className="flex items-center justify-center overflow-hidden rounded-[16px] bg-[#d8d1c2] sm:rounded-[18px]"
                                    >
                                      <img
                                        src={src}
                                        alt={`${selectedProject.title} grid image ${assetIndex + 1}`}
                                        loading="lazy"
                                        className="h-full max-h-[52vh] w-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : item.type === "grid6" ? (
                                <div className="grid gap-2 rounded-[20px] border border-black/5 bg-[#e4ddd0] p-2 sm:grid-cols-2 sm:gap-3 sm:rounded-[24px] sm:p-3 md:grid-cols-3 md:gap-4 md:p-4">
                                  {item.assets.map((src, assetIndex) => (
                                    <div
                                      key={src}
                                      className="flex items-center justify-center overflow-hidden rounded-[16px] bg-[#d8d1c2] sm:rounded-[18px]"
                                    >
                                      <img
                                        src={src}
                                        alt={`${selectedProject.title} supporting image ${assetIndex + 1}`}
                                        loading="lazy"
                                        className="h-full max-h-[42vh] w-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : item.type === "pair" ? (
                                <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                                  {item.assets.map((src, assetIndex) => (
                                    <div
                                      key={src}
                                      className="flex justify-center overflow-hidden rounded-[20px] border border-black/5 bg-[#e4ddd0] sm:rounded-[24px]"
                                    >
                                      <MediaAsset
                                        src={src}
                                        alt={`${selectedProject.title} paired asset ${assetIndex + 1}`}
                                        className="max-h-[72vh] w-full bg-black object-cover"
                                        imageClassName="max-h-[72vh] w-full object-contain"
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex justify-center overflow-hidden rounded-[20px] border border-black/5 bg-[#e4ddd0] sm:rounded-[24px]">
                                  <MediaAsset
                                    src={item.assets[0]}
                                    alt={`${selectedProject.title} asset ${item.index + 1}`}
                                    className="max-h-[78vh] w-full bg-black object-cover"
                                    imageClassName="max-h-[78vh] w-full object-contain"
                                  />
                                </div>
                              )}
                            </article>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import type { ReactNode } from "react";
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
  subtitle?: string;
  body?: string;
  credits?: ProjectCredit[];
  mediaSections?: ProjectMediaSection[];
  description?: string;
};

type ProjectCredit = {
  label: string;
  value: string;
  href?: string;
};

type ProjectMediaSection = {
  title: string;
  body?: string;
  credits?: ProjectCredit[];
};

const CREDIT_LINKS: Record<string, string> = {
  "Marko Anstice": "https://markoanstice.com/motion",
  "The Sunshine Company": "https://thesunshinecompany.com/",
  "Wolff Olins": "https://wolffolins.com/",
  "Alice Coffey": "https://uk.linkedin.com/in/alicecoffey",
  "Conor Knight": "https://uk.linkedin.com/in/conorknight",
  "Jeremy Downes": "https://uk.linkedin.com/in/jeremy-downes-1b083398",
  "Zarah Mughal": "https://uk.linkedin.com/in/zarah-mughal",
  "Thomas Reynhart": "https://uk.linkedin.com/in/thomas-reynhart-5177131a0",
  "Gina Atanesian": "https://uk.linkedin.com/in/gina-onegina",
  "Studio Soeur": "https://www.studiosoeur.co/",
  "Wonderhood Studios": "https://wonderhoodstudios.com/",
  Frisian: "https://www.frisian.co.uk/",
  "Choé Bailly": "https://www.instagram.com/cloebailly/",
  "Sam Wright": "https://www.instagram.com/_sam_wright_photo/?hl=en",
  "Sam Pilling": "https://www.sampilling.com/",
  "Elliot Dear": "https://www.blinkink.co.uk/directors/elliot-dear",
  "Artem Nadyozhin": "https://www.nadyozh.in/",
  Ekstasy: "https://www.ekstasy.com/",
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
const CONTACT_EMAIL = "hello@yks.works";
const ABOUT_PARAGRAPHS = [
  "YKS, a London-based creative and design director working across brand, campaigns and design systems.",
  "I spent eight years at Starling Bank, helping shape the brand from early-stage challenger to one of the UK’s leading digital banks. As design lead within the marketing team, I led a multidisciplinary group of designers overseeing the visual output of the bank across film, photography, campaigns, debit cards and packaging. The focus was building a clear, consistent visual language that could scale with the business while staying simple, human and distinctive.",
  "I’m drawn to ideas that are easy to understand but hard to ignore, ideas that can stretch across different channels without losing their clarity. My approach is collaborative and hands-on, working closely with writers, designers, filmmakers and developers to shape things from concept through to execution.",
  "Now working independently, I’m interested in projects that sit across brand and product, especially where there’s a chance to define something from the ground up, or rethink what’s already there.",
];

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

function getPreviewWidth(project: Project, containerWidth?: number) {
  let baseWidth = 700;

  if (project.title === "Kick On") baseWidth = 600;
  if (project.title === "The Bank Built For You") baseWidth = 640;

  if (!containerWidth) return baseWidth;

  const responsiveWidth = Math.max(380, Math.round(containerWidth * 0.42));
  return Math.min(baseWidth, responsiveWidth);
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

  if (project.title === "Set Yourself Free" && gallery.length >= 3) {
    return [{ type: "triptych", assets: gallery.slice(0, 3), index: 0 }];
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
        } ${
          isActive
            ? "relative z-30 text-red-accent"
            : isModal
              ? "text-[#7B00FF]"
              : ""
        }`}
        aria-label={`${project.title}, ${project.client}`}
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

        {" "}
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

function splitParagraphs(value?: string) {
  return value
    ? value
        .split("\n\n")
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
    : [];
}

function renderCreditValue(value: string, href?: string) {
  if (href) {
    return [
      <a
        key={`${value}-${href}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-current/35 underline-offset-2 transition-opacity hover:opacity-70"
      >
        {value}
      </a>,
    ];
  }

  const linkedNames = Object.keys(CREDIT_LINKS).sort(
    (a, b) => b.length - a.length
  );
  const parts: ReactNode[] = [];
  let remaining = value;
  let keyIndex = 0;

  while (remaining.length > 0) {
    const nextMatch = linkedNames
      .map((name) => {
        const index = remaining.indexOf(name);
        return index >= 0 ? { name, index } : null;
      })
      .filter((match): match is { name: string; index: number } => match !== null)
      .sort((a, b) => a.index - b.index || b.name.length - a.name.length)[0];

    if (!nextMatch) {
      parts.push(<span key={`text-${keyIndex++}`}>{remaining}</span>);
      break;
    }

    if (nextMatch.index > 0) {
      parts.push(
        <span key={`text-${keyIndex++}`}>
          {remaining.slice(0, nextMatch.index)}
        </span>
      );
    }

    parts.push(
      <a
        key={`link-${keyIndex++}`}
        href={CREDIT_LINKS[nextMatch.name]}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-current/35 underline-offset-2 transition-opacity hover:opacity-70"
      >
        {nextMatch.name}
      </a>
    );

    remaining = remaining.slice(nextMatch.index + nextMatch.name.length);
  }

  return parts;
}

function CreditsList({ credits }: { credits: ProjectCredit[] }) {
  return (
    <div className="space-y-1 text-[15px] leading-[1.2] text-black sm:text-[16px] sm:leading-[1.18]">
      {credits.map((credit) => (
        <p key={`${credit.label}-${credit.value}`}>
          <span className="font-['Perfektta']">{credit.label}:</span>{" "}
          {renderCreditValue(credit.value, credit.href)}
        </p>
      ))}
    </div>
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
      subtitle: "Pioneering banking for enterprising people.",
      body:
        "A major brand update repositioning Starling Bank around a simple but ambitious idea: everyone can be good with money.\n\nMoving beyond awareness, the platform reframed financial wellbeing as a behaviour, not a balance — shifting the narrative from wealth to confidence, control and everyday decision-making. Built in response to a challenging economic landscape, the work set out to normalise money management and make it feel accessible, human and within reach.\n\nThe relaunch extended across identity, product and communications — from a refreshed visual system and app experience to a new brand voice and integrated campaign ecosystem. Developed in collaboration with Wolff Olins and The Sunshine Company, the platform unified Starling’s proposition around a single mission: helping the UK build a healthier relationship with money.\n\nA shift from product-first to people-first thinking — positioning Starling not just as a bank, but as a tool for better financial habits.",
      mediaSections: [
        {
          title: "The Design",
          body:
            "An updated art direction, design and visual system was needed to inspire and continue a pattern and behaviour of action. Our art direction needed a new set of visual principles for static and moving image that clearly linked back to our new brand strategy. Active teal and Starling purple as the core palette, with new vibrant secondary colours to support. An updated wordmark to evoke confidence and recognition - most noticeably dropping Bank from the naming. Starling’s typographic system pairs Avantt, a contemporary geometric grotesk, with CoFo Sans Semi Mono, a system-led semi-monospaced sans. Avantt carries the brand voice—confident, modern and approachable—while CoFo introduces a layer of precision and digital clarity. Together, they balance expression with functionality, reflecting both the human and technical sides of modern banking. We needed a distinctive illustration style to add more depth and personality to the brand, enrich complex topics in app – capturing how the product worked and benefited customers in a satisfying and simple way. The direction was agreed with WO and developed in house.",
          credits: [
            { label: "Design Direction", value: "Wolff Olins" },
            {
              label: "Design Team",
              value:
                "YKS, Alice Coffey, Conor Knight, Jeremy Downes, Thomas Reynhart, Zarah Mughal.",
            },
          ],
        },
        {
          title: "The Story",
          credits: [
            { label: "Creative and Design", value: "YKS" },
            { label: "Animation", value: "Marko Anstice" },
            { label: "Brand Strategy", value: "The Sunshine Company" },
          ],
        },
      ],
    },
    {
      title: "Debit Cards and Packaging",
      client: "Starling Bank",
      mediaType: "image",
      previewSrc: "/projects/starling-photo-4.jpg",
      modalSrc: "/projects/starling-bank-business-card.jpg",
      gallery: ["/projects/starling-photo-5.jpg", "/projects/starling-photo-6.png"],
      body:
        "A redesign of Starling’s debit cards and packaging—using one of the bank’s most visible, physical touchpoints to express both product values and brand evolution.\n\nThe project began with the introduction of recycled PVC cards, making Starling the first UK bank to move to rPVC at scale. Rather than treating sustainability as a layer of messaging, the approach was matter-of-fact—embedded into the product itself and communicated with clarity.\n\nThe card became a canvas for the updated brand. As part of the wider relaunch, the design evolved to reflect a more confident, contemporary identity—refined colour, simplified layouts and a clearer expression of the wordmark. Subtle but deliberate changes brought the physical product in line with the broader shift toward a more human, accessible brand.\n\nPackaging followed the same thinking. Reduced, considered and functional, it removed unnecessary elements and focused on the essentials—both in material and communication. The experience was designed to feel straightforward and intentional, reinforcing the idea that good financial habits are built through simple, everyday interactions.\n\nA small but constant presence in customers’ lives—used daily, carried everywhere. The work turns the debit card into more than a utility, aligning product, brand and behaviour in a single, considered object.",
      credits: [{ label: "Creative and Design", value: "YKS" }],
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
      body:
        "Managing bills, saving for shared goals or just splitting the dinner tab: do life together with a joint account. Committed media spend but a need to change direction at short notice. Executed in house with support from trusted friends. Proud of this one.",
      credits: [
        { label: "Creative and Design", value: "YKS" },
        { label: "Photography", value: "Gina Atanesian" },
        { label: "Production", value: "Studio Soeur" },
        {
          label: "Retouch",
          value: "Frisian",
          href: "https://www.frisian.co.uk/",
        },
      ],
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
        "/projects/tbbfy-5.jpeg",
        "/projects/tbbfy-6.jpeg",
        "/projects/tbbfy-7.jpeg",
      ],
      subtitle:
        "A brand platform repositioning Starling around the lives of its customers.",
      body:
        "The work translates product into narrative — embedding features within everyday, character-led stories rather than traditional financial messaging. Built as an integrated system across film, OOH and digital nationally, the platform creates a consistent language that adapts across audiences and life stages. A shift from feature-led advertising to human-centred storytelling.",
      credits: [
        { label: "Brand Strategy and Creative Direction", value: "Wonderhood Studios" },
        { label: "Design", value: "YKS" },
        { label: "Photography", value: "Gina Atanesian" },
      ],
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
      subtitle:
        "A long-term brand platform built through women’s football—positioning Starling as an active driver of visibility, access and equality within the game.",
      body:
        "Launching with UEFA Women’s EURO 2022, the work transformed sponsorship into a fully integrated system spanning national OOH, broadcast, ambassador storytelling and product-led activations. The \"Our Time\" campaign brought elite players into everyday contexts, reframing representation through a distinctly Starling lens—shifting perception from occasional visibility to cultural normality.\n\nBeyond the tournament, the platform extends into sustained partnerships and grassroots investment. This includes front-of-shirt sponsorship of Southampton FC Women, support for emerging talent, and initiatives designed to increase participation and access at a community level. Starling also committed to equal media investment and long-term backing of the women’s game—ensuring visibility isn’t cyclical, but continuous.\n\nExecuted across film, digital, social and live experiences, the system balances cultural storytelling with tangible action—embedding the brand within the fabric of the sport rather than sitting adjacent to it. A sustained expression of brand purpose—positioning Starling at the intersection of culture, equality and sport, delivering on Starling’s brand strategy in a meaningful way.",
      credits: [
        { label: "Creative and Design", value: "YKS" },
        { label: "Production", value: "Studio Soeur" },
      ],
    },
    {
      title: "Set Your Business Free",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/projects/set-your-business-free-preview.mp4",
      hoverPreviewSrc: "/projects/set-your-business-free-hover.mp4",
      modalSrc: "/projects/set-your-business-free.mp4",
      gallery: ["/projects/set-your-business-free-2.mp4"],
      body:
        "An extension of the previously launched Set Yourself Free, Starling Bank’s Set Your Business Free campaign reframed the relationship between small businesses and traditional banking—shifting the narrative from constraint to liberation. Built around the insight that legacy banks create friction, the work positions Starling as a tool for independence: intuitive, fast, and built for how modern businesses actually operate.\n\nCreatively, the campaign leans into a bold, expressive visual language—combining confident typography, kinetic motion, and a sense of lightness that mirrors the idea of release. Business owners are depicted not as burdened operators, but as energised individuals, freed from outdated systems and able to focus on what matters most: running and growing their business.\n\nThe identity system was designed to work fluidly across film, digital, and out-of-home—balancing clarity with character. Messaging is direct and optimistic, while the visual world introduces a sense of uplift and momentum, reinforcing the core proposition at every touchpoint. This was a shift from functional banking communications to something more human and emotionally resonant—positioning Starling not just as a better bank, but as an enabler of progress.",
      credits: [
        { label: "Creative", value: "Wonderhood Studios" },
        { label: "Director", value: "Choé Bailly" },
        { label: "Photography", value: "Sam Wright" },
        { label: "Design", value: "YKS" },
      ],
    },
    {
      title: "Set Yourself Free",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/projects/set-yourself-free-preview.mp4",
      hoverPreviewSrc: "/projects/set-yourself-free-hover.mp4",
      modalSrc: "/projects/set-yourself-free.mp4",
      gallery: [
        "/projects/set-yourself-free-1.png",
        "/projects/set-yourself-free-2.png",
        "/projects/set-yourself-free-3.png",
      ],
      subtitle:
        "Set Yourself Free marked a step-change in Starling’s brand platform—broadening the proposition from business banking to a universal, human truth: people feel constrained by traditional banks.",
      body:
        "Rooted in the idea of liberation, the campaign dramatises the everyday frustrations of legacy banking and contrasts them with the immediacy and control offered by Starling. It reframes switching not as a chore, but as a release—simple, empowering, and long overdue.\n\nThe creative direction embraces a heightened, almost surreal visual language. Scenes of restriction give way to openness and movement, using choreography, pacing, and spatial transitions to bring the concept of “freedom” to life. Typography and motion work in tandem—light, expansive, and unencumbered—reinforcing the emotional shift at the heart of the campaign.\n\nDesigned as a fully integrated system, the work spans film, digital, and out-of-home, maintaining a clear and confident voice throughout. The result is a campaign that moves beyond product messaging, positioning Starling as a catalyst for change—giving people the tools, and the confidence, to break free.",
      credits: [
        { label: "Creative", value: "Wonderhood Studios" },
        { label: "Director", value: "Sam Pilling" },
        { label: "Photography", value: "Artem Nadyozhin" },
        { label: "Design", value: "YKS" },
      ],
    },
    {
      title: "Kick On",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/projects/kick-on.mp4",
      hoverPreviewSrc: "/projects/kick-on-hover.mp4",
      modalSrc: "/projects/kick-on.mp4",
      subtitle:
        "A continuation of Starling’s broader platform, turning brand purpose into practical impact.",
      body:
        "Kick On extends Starling’s commitment to women’s football beyond visibility into tangible support—addressing the structural barriers that limit participation at grassroots level. Built as an open, ongoing initiative, Kick On provides funding, resources and equipment to teams and organisations across the UK. From financial grants to partnerships like Gift of Kit, the programme tackles one of the game’s most immediate challenges: access.\n\nBy removing practical obstacles—whether that’s kit, facilities or funding—it enables more women and girls to start, continue and thrive in the sport. Creatively, the work shifts away from traditional campaign mechanics toward something more embedded and utility-led. The identity is intentionally simple and direct—designed to scale, flex and live within communities rather than sit above them.\n\nMessaging prioritises clarity and action, reinforcing Starling’s role not just as a sponsor, but as an enabler. Executed across digital platforms, partnerships and community touchpoints, Kick On operates as both campaign and infrastructure—supporting the game from the ground up.",
      credits: [
        { label: "Creative and Production", value: "Studio Soeur" },
        { label: "Art Direction and Design", value: "YKS" },
        { label: "Photography", value: "Gina Atanesian" },
      ],
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
      subtitle:
        "Helping Your Business Fly introduced Starling’s business proposition to a wider audience—shifting perception from challenger bank to credible, fully fledged partner for small businesses.",
      body:
        "Built around the metaphor of flight, the campaign visualises the experience of running a business with Starling as lighter, faster and more controlled. Administrative burden and financial friction are replaced with clarity and momentum—positioning the bank as an enabler of progress rather than an obstacle to it.\n\nThe creative centres on a distinctive, cinematic world where business owners are quite literally lifted—moving through space with a sense of ease and acceleration. This visual metaphor is carried through film, supported by a clean, confident graphic system that reinforces simplicity and control across digital and out-of-home executions.\n\nBalancing product truth with brand storytelling, the campaign marked a step forward in tone—more assured, more expressive, and designed to build emotional resonance alongside functional understanding. A foundational moment in establishing Starling’s business offering—bringing clarity, confidence and a sense of forward motion to the category.",
      credits: [
        { label: "Creative and Production", value: "Wonderhood Studios" },
        { label: "Director", value: "Elliot Dear" },
        { label: "Design", value: "YKS" },
      ],
    },

    {
      title: "Hello, Starling Bank.",
      client: "Starling Bank",
      mediaType: "video",
      previewSrc: "/hello-starling-bank.mp4",
      hoverPreviewSrc: "/hello-starling-bank-hover.mp4",
      modalSrc: "/hello-starling-bank.mp4",
      subtitle: "A new kind of banking experience – anywhere life takes you.",
      body:
        "Hello, Starling Bank. introduced a new way of banking—one that lives entirely on your phone, and works wherever you are. At the time, that shift wasn’t yet familiar. Banking was still tied to branches, opening hours and physical spaces. The campaign set out to make this new behaviour feel normal—showing that managing your money could happen anywhere, in the middle of everyday life.\n\nThe creative focuses on simple, uplifting and recognisable moments—on the street, at home, on the move—where banking becomes part of the flow rather than a separate task. The product is always in hand, quietly doing its job, removing the need to plan, queue or wait.\n\nVisually, the direction is clean and unobtrusive, allowing the idea to land clearly. A light, conversational tone reinforces the sense of ease—positioning Starling as something immediate, intuitive and always available. A straightforward introduction to a new behaviour—making mobile-first banking feel not just possible, but obvious.",
      credits: [
        { label: "Creative and Design", value: "YKS" },
        { label: "Production", value: "Ekstasy" },
        { label: "Photography", value: "Sam Wright" },
      ],
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
  const [activePreviewWidth, setActivePreviewWidth] = useState<number>(700);
  const [ukTime, setUkTime] = useState("--:--");
  const [ukTimeZone, setUkTimeZone] = useState("UK");
  const [londonWeather, setLondonWeather] = useState("London weather loading...");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
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
    if (!selectedProject && !isAboutOpen) return;

    const overlay = overlayRef.current;
    const modal = modalRef.current;
    const preview = previewRef.current;

    closeButtonRef.current?.focus();

    if (!overlay || !modal || prefersReducedMotion) {
      if (overlay && modal) {
        gsap.set(overlay, { opacity: 1 });
        gsap.set(modal, { opacity: 1 });
      }
      return;
    }

    if (isAboutOpen && !selectedProject) {
      gsap.set(overlay, { opacity: 0 });
      gsap.set(modal, { opacity: 0, y: 18 });

      const tl = gsap.timeline();

      tl.to(overlay, {
        opacity: 1,
        duration: 0.22,
        ease: "power2.out",
      }).to(
        modal,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        0.06
      );

      return () => {
        tl.kill();
      };
    }

    if (!preview) {
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
  }, [isAboutOpen, prefersReducedMotion, selectedProject]);

  useEffect(() => {
    const { body } = document;

    if (selectedProject || isAboutOpen) {
      body.classList.add("modal-scroll-lock");
    } else {
      body.classList.remove("modal-scroll-lock");
    }

    return () => {
      body.classList.remove("modal-scroll-lock");
    };
  }, [isAboutOpen, selectedProject]);

  useEffect(() => {
    if (selectedProject || isAboutOpen) return;

    const lastFocusedIndex = lastFocusedProjectIndexRef.current;

    if (lastFocusedIndex !== null) {
      projectButtonRefs.current[lastFocusedIndex]?.focus();
    }
  }, [isAboutOpen, selectedProject]);

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
      setIsAboutOpen(false);
      return;
    }

    if (!overlayRef.current || !modalRef.current) {
      setSelectedProject(null);
      setIsAboutOpen(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setSelectedProject(null);
        setIsAboutOpen(false);
      },
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

    const previewWidth = getPreviewWidth(project, sectionRect.width);
    const previewHeight = previewWidth * 0.62;
    const minTop = previewHeight / 2 + 20;
    const maxTop = sectionRect.height - previewHeight / 2 - 20;
    const clampedTop = Math.min(Math.max(nextPreviewCenter, minTop), maxTop);

    setActivePreviewWidth(previewWidth);
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
  const subtitle = selectedProject?.subtitle;
  const descriptionParagraphs = selectedProject
    ? splitParagraphs(selectedProject.body ?? selectedProject.description)
    : [];
  const heroSrc = selectedProject?.modalSrc ?? selectedProject?.previewSrc;
  const isModalOpen = Boolean(selectedProject) || isAboutOpen;
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

      <div
        className="fixed left-0 right-0 top-0 z-40 overflow-hidden border-b border-foreground-soft bg-[#efefec]"
        aria-hidden="true"
      >
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
              src="/yks-full.png"
              alt="YKS"
              className="h-auto w-[184px] md:w-[245px]"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </div>

      <div
        className={`fixed right-5 top-[56px] z-30 transition-opacity md:right-10 md:top-[74px] ${
          isModalOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsAboutOpen(true)}
          className="font-['Perfektta'] text-[16px] text-[#7B00FF] transition-opacity hover:opacity-70 focus-visible:rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:text-[19px]"
        >
          About
        </button>
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
          isModalOpen ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-['Perfektta'] text-[16px] text-[#7B00FF] transition-opacity hover:opacity-70 focus-visible:rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:text-[19px]"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      {/* =========================
        PAGE WRAPPER
      ========================= */}
      <div className="px-5 pb-24 pt-[124px] md:px-10 md:pb-[210px] md:pt-[150px]">
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
                          width: `${activePreviewWidth}px`,
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
      {isModalOpen && (
        <>
          <div className="pointer-events-none fixed right-5 top-5 z-[130] sm:right-7 sm:top-7 md:right-10 md:top-10">
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

          <div
            ref={overlayRef}
            className={`fixed inset-0 z-[100] overflow-y-auto px-2 py-2 backdrop-blur-xl sm:px-4 sm:py-4 md:px-6 md:py-6 ${
              isAboutOpen ? "bg-[rgba(255,255,255,0.65)]" : "bg-black/72"
            }`}
            onClick={closeModal}
          >
            <div className="flex min-h-full items-start justify-center py-10 sm:items-center">
              {selectedProject ? (
                <div
                  ref={modalRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="project-modal-title"
                  className="relative w-full max-w-[1240px] overflow-hidden rounded-[22px] border border-white/20 bg-[#f3f0ea] shadow-[0_30px_120px_rgba(0,0,0,0.35)] sm:rounded-[28px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative overflow-hidden bg-[#dcd7cb]">
                    <div className="absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black/20 to-transparent" />
                    {heroSrc && isVideoAsset(heroSrc) ? (
                      <>
                        <video
                          ref={modalVideoRef}
                          src={heroSrc}
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
                        src={heroSrc}
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

                      <div className="mt-5 max-w-[1080px] space-y-4 sm:mt-6 sm:space-y-5 md:mt-4 md:space-y-3">
                        {subtitle ? (
                          <p className="max-w-[980px] font-['Perfektta'] text-[22px] leading-[1.02] tracking-[-0.03em] text-[#2F4DFF] sm:text-[28px] sm:leading-[1.04] md:text-[40px] md:leading-[0.98]">
                            {subtitle}
                          </p>
                        ) : null}

                        {descriptionParagraphs.map((paragraph, index) => (
                          <p
                            key={`${selectedProject.title}-${index}`}
                            className="max-w-[1040px] text-[17px] leading-[1.38] text-[#000000] sm:text-[18px] sm:leading-[1.42] md:text-[20px] md:leading-[1.28]"
                          >
                            {paragraph}
                          </p>
                        ))}

                        {selectedProject.credits?.length ? (
                          <div className="space-y-3 pt-1">
                            <p className="font-['Perfektta'] text-[18px] leading-none tracking-[-0.01em] text-[#2F4DFF] sm:text-[20px]">
                              Credits
                            </p>
                            <CreditsList credits={selectedProject.credits} />
                          </div>
                        ) : null}
                      </div>

                      {selectedProjectGallery.length > 0 && (
                        <div className="mt-6 border-t border-foreground-soft pt-4 sm:mt-8 sm:pt-5">
                          <div className="space-y-6 sm:space-y-8 md:space-y-10">
                            {selectedProjectGalleryLayout.map((item) => (
                              <article
                                key={`${selectedProject?.title}-${item.index}`}
                                className={`w-full ${getGalleryFrameClass(
                                  item.index,
                                  selectedProjectGalleryLayout.length
                                )}`}
                              >
                                {selectedProject.mediaSections?.[item.index] ? (
                                  <div className="mb-4 space-y-3 sm:mb-5 sm:space-y-4">
                                    <p className="max-w-[980px] font-['Perfektta'] text-[22px] leading-[1.02] tracking-[-0.03em] text-[#2F4DFF] sm:text-[28px] sm:leading-[1.04] md:text-[40px] md:leading-[0.98]">
                                      {selectedProject.mediaSections[item.index].title}
                                    </p>
                                    {splitParagraphs(
                                      selectedProject.mediaSections[item.index].body
                                    ).map((paragraph, sectionParagraphIndex) => (
                                      <p
                                        key={`${selectedProject.title}-${item.index}-${sectionParagraphIndex}`}
                                        className="max-w-[1040px] text-[17px] leading-[1.38] text-[#000000] sm:text-[18px] sm:leading-[1.42] md:text-[20px] md:leading-[1.28]"
                                      >
                                        {paragraph}
                                      </p>
                                    ))}
                                    {selectedProject.mediaSections[item.index].credits
                                      ?.length ? (
                                      <div className="space-y-3 pt-1">
                                        <p className="font-['Perfektta'] text-[18px] leading-none tracking-[-0.01em] text-[#2F4DFF] sm:text-[20px]">
                                          Credits
                                        </p>
                                        <CreditsList
                                          credits={
                                            selectedProject.mediaSections[item.index]
                                              .credits as ProjectCredit[]
                                          }
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
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
              ) : (
                <div
                  ref={modalRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="about-modal-title"
                  className="relative w-full max-w-[1040px] overflow-hidden rounded-[22px] bg-transparent sm:rounded-[28px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-5 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12">
                    <div className="max-w-[860px]">
                      <div id="about-modal-title" className="sr-only">
                        About
                      </div>
                      <div className="space-y-4 sm:space-y-5 md:space-y-4">
                        {ABOUT_PARAGRAPHS.map((paragraph, index) => (
                          <p
                            key={`about-${index}`}
                            className={`max-w-[860px] text-[#000000] ${
                              index === 0
                                ? "font-['Perfektta'] text-[22px] leading-[1.02] tracking-[-0.03em] text-[#7B00FF] sm:text-[28px] sm:leading-[1.04] md:text-[40px] md:leading-[0.98]"
                                : "text-[17px] leading-[1.38] sm:text-[18px] sm:leading-[1.42] md:text-[20px] md:leading-[1.28]"
                            }`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

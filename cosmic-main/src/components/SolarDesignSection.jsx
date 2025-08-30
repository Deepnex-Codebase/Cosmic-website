import React from "react";
import { Link } from "react-router-dom";

/* ────────── inline icons (swap with brand icons if you wish) ────────── */
const ReturnIcon = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 11V5h6M4 5l6 6M20 13v6h-6M20 19l-6-6" strokeLinecap="round" />
  </svg>
);
const AwardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M8.5 13h7L12 22l-3.5-9z" strokeLinecap="round" />
  </svg>
);
const BulbIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4 min-w-4" fill="currentColor">
    <path d="M8 1a4.5 4.5 0 00-2.29 8.41L5.5 11h5l-.21-1.59A4.5 4.5 0 008 1zm-.75 12a.75.75 0 100 1.5h1.5a.75.75 0 100-1.5h-1.5z" />
  </svg>
);
const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* bullets list reused for both columns */
const bullets = [
  "Maximize Energy Production",
  "Reduce Electricity Bills",
  "Custom Design for Your Property",
];

const SolarDesignSection = () => (
  <section
    className="relative overflow-hidden bg-white"
    style={{
      backgroundImage:
        "url('https://zolar.wpengine.com/wp-content/uploads/2024/11/hero-bg-pattern.svg')",
      backgroundSize: "cover",
    }}
  >
    {/* ---- mobile / tablet: blurred background image ---- */}
    <img
      src="/solar_design.png"                 // place your image in public/
      alt=""
      className="absolute inset-0 w-full h-full object-cover opacity-25 blur-[2px] lg:hidden"
    />
    {/* soft white veil so text stays readable */}
    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm lg:hidden" />

    {/* ---- content grid ---- */}
    <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 lg:items-stretch">
      {/* left column: full-height image on ≥lg */}
      <div className="hidden lg:block relative h-full">
        <img
          src="/planproject.jpg"
          alt="Engineer with solar panel"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* right column: text + features (centred on mobile) */}
      <div className="space-y-10 flex flex-col justify-center text-center lg:text-left">
        {/* header */}
        <div className="space-y-4">
          <p className="font-semibold uppercase tracking-wider text-gray-700 inline-block relative before:content-['—'] before:mr-2 after:content-['—'] after:ml-2">
            Professional Solar Solutions
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold">
            Solar System Design
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto lg:mx-0">
            Our expert team designs customized solar power systems that maximize energy production while minimizing costs. We analyze your energy needs, roof structure, and local climate conditions to create the most efficient solar solution for your property.
          </p>
        </div>

        {/* features: 2 columns on ≥sm */}
        <div className="grid sm:grid-cols-2 gap-10">
          {[
            { icon: <AwardIcon />, title: "Expert Design" },
          ].map(({ icon, title }) => (
            <div key={title}>
              <div className="flex items-center gap-3 mb-4 justify-center sm:justify-start">
                {icon}
                <h3 className="text-2xl font-bold">{title}</h3>
              </div>

              <ul className="space-y-4">
                {bullets.map((txt) => (
                  <li key={txt} className="flex items-start gap-2">
                    <BulbIcon className="text-[#b4dc6b]" />
                    <span className="text-gray-900">{txt}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="#"
                className="inline-flex items-center gap-2 text-lg font-semibold mt-8 group"
              >
                Design Your System
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-black text-white group-hover:bg-gray-800 transition">
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default SolarDesignSection;

import React from "react";
import { Link } from "react-router-dom";

/* icons */
const PvIcon = () => <svg viewBox="0 0 64 64" className="w-16 h-16"><path d="M10 44h44M10 34h44M10 24h44M14 14h36" stroke="currentColor" strokeWidth="4" fill="none"/></svg>;
const RepairIcon = () => <svg viewBox="0 0 64 64" className="w-16 h-16"><circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="4" fill="none"/><path d="M26 26l18 18" stroke="currentColor" strokeWidth="4"/></svg>;
const PowerIcon = () => <svg viewBox="0 0 64 64" className="w-16 h-16"><path d="M32 4v24" stroke="currentColor" strokeWidth="4"/><circle cx="32" cy="36" r="24" stroke="currentColor" strokeWidth="4" fill="none"/></svg>;
const ArrowIcon = () => <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>;

/* data */
const services = [
  {
    title: "Solar PV system",
    desc: "Sed ut perspiciatis unde omnis iste natus error sit, eaque ipsa quae ab illo inventore veritatis efficitur minfinibus ultra.",
    img: "https://zolar.wpengine.com/wp-content/uploads/2024/12/Home2-services-bg-img-1.jpg",
    Icon: PvIcon,
  },
  {
    title: "Panel Repair",
    desc: "Inceptos eu scelerisque nisi augue curabitur odio. Et vitae cras sollicitudin nam fusce habitasse elemen celurto.",
    img: "https://zolar.wpengine.com/wp-content/uploads/2024/12/Home2-services-bg-img-1.jpg",
    Icon: RepairIcon,
  },
  {
    title: "Solar Power",
    desc: "Sapien quam torquent senectus nam viverra rutrum aliquet. Mattis congue suscipit orci sem class egestas adip.",
    img: "https://zolar.wpengine.com/wp-content/uploads/2024/12/Home2-services-bg-img-1.jpg",
    Icon: PowerIcon,
  },
];

const ServicesSection = () => (
  <section className="bg-[#F2F8F5] py-24 px-4">
    {/* heading */}
    <header className="max-w-4xl mx-auto text-center mb-20">
      <p className="text-gray-700 mb-4 font-semibold tracking-wider uppercase relative inline-block before:content-['—'] before:mr-2 after:content-['—'] after:ml-2">
        Our Services
      </p>
      <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
        Solar-Powered Lighting<br className="hidden sm:block" /> Systems Projects
      </h2>
    </header>

    {/* cards */}
    <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {services.map(({ title, desc, img, Icon }) => (
        <article
          key={title}
          className="group relative rounded-xl overflow-hidden flex flex-col bg-white shadow-sm transition hover:shadow-xl"
        >
          {/* bg image (blur + 30 % opacity on hover) */}
          <img
            src={img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-30"
          />
          {/* darker green tint on hover */}
          <div className="absolute inset-0 bg-[#b4dc6b]/80 opacity-0 transition-opacity duration-300 group-hover:opacity-80 mix-blend-multiply" />

          {/* content */}
          <div className="relative p-10 flex flex-col flex-grow space-y-6">
            <Icon className="text-gray-900" />

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {title}
              </h3>
              <p className="text-gray-700 leading-relaxed">{desc}</p>
            </div>

            <div className="mt-auto pt-6">
              <Link
                to="#"
                className="inline-flex items-center gap-2 text-base font-semibold text-gray-900 hover:text-gray-600"
              >
                Read More
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#cae28e]">
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default ServicesSection;

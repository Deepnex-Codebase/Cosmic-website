# Solar Savings Calculator – Product Requirements Document

**Version:** 1.0
**Date:** 15 Jul 2025
**Owner:** Deepnex (Frontend) / ChatGPT (Technical Writer)

---

## 1. Purpose

Provide an embeddable, state‑aware solar calculator that converts four simple user inputs into a full financial & environmental assessment of a rooftop PV system. The calculator must work **entirely client‑side** (React), return results instantly without page reload, and expose a config file so tariffs, costs, and performance assumptions can be updated by non‑developers.

---

## 2. Scope

* **In‑Scope**: UI component, validation, dynamic calculations, JSON config, responsive design, basic analytics hooks.
* **Out‑of‑Scope**: Lead‑capture, server‑side persistence, detailed shading analysis, financing options.

---

## 3. Stakeholders

| Role          | Name / Team        | Interest                                 |
| ------------- | ------------------ | ---------------------------------------- |
| Product Owner | Deepnex            | Feature completeness & business accuracy |
| Frontend Dev  | Internal MERN team | Clean API, maintainable code             |
| Marketing     | Cosmic Powertech   | Accurate messaging & branding            |

---

## 4. Functional Requirements

### 4.1 Inputs

| # | Field                      | UI Control                                     | Unit            | Validation    |
| - | -------------------------- | ---------------------------------------------- | --------------- | ------------- |
| 1 | **State**                  | `<select>` populated from `CONFIG.tariff` keys | –               | Required      |
| 2 | **Monthly Grid Bill**      | `<input type="number">`                        | ₹               | 100 – 100 000 |
| 3 | **Available Roof Area**    | `<input type="number">`                        | ft² (toggle m²) | 50 – 10 000   |
| 4 | **Average Sunlight Hours** | `<input type="number" step=0.1>`               | h/day           | 3 – 7         |

> UX: show tool‑tips explaining each field; default sunlight hours autopopulate when state changes (lookup table – appendix A).

### 4.2 Outputs (computed after **Calculate** click)

1. **Recommended System Size (kW)**
2. **Estimated Investment (₹)**
3. **Pay‑back Period (yrs)**
4. **CO₂ Savings in 10 Years (t)**

**System Details** section:
• Required Roof Area (ft²)
• Space Feasibility (✅/❌)
• Annual Savings (₹)
• 10‑Year Returns (₹)

All monetary values rounded to nearest ₹ 100; sizes to 0.1 kW; periods to 0.1 yr.

### 4.3 Calculation Engine

Store adjustable constants in `/config/solar.json` (see §4.4). Perform maths in a pure helper function so it can be unit‑tested.

```ts
// src/utils/solarCalc.ts
import cfg from '../config/solar.json';

export interface Inputs {
  state: keyof typeof cfg.tariff;
  monthlyBill: number; // ₹
  roofArea: number;    // ft²
  sunHrs: number;      // h/day
}

export interface Outputs {
  sysKW: number;
  capex: number;
  payback: number;
  co2_10yr_t: number;
  reqArea: number;
  feasible: boolean;
  annualSavings: number;
  return10: number;
}

export const solarCalc = ({ state, monthlyBill, roofArea, sunHrs }: Inputs): Outputs => {
  const { tariff, costPerWp, PR, areaPerKW, EF } = cfg;

  // 1. Consumption
  const monthlyUse   = monthlyBill / tariff[state];
  const annualUse    = monthlyUse * 12;

  // 2. Generation potential
  const annualGenPerKW = sunHrs * PR * 365;

  // 3. System sizing
  const sizeBill = annualUse / annualGenPerKW;
  const sizeRoof = roofArea / areaPerKW;
  const sysKW    = +Math.min(sizeBill, sizeRoof).toFixed(1);

  // 4. Financials
  const capex         = Math.round(sysKW * 1000 * costPerWp / 100) * 100;
  const annualGen     = sysKW * annualGenPerKW;
  const annualSavings = Math.round(annualGen * tariff[state] / 100) * 100;
  const payback       = +(capex / annualSavings).toFixed(1);

  // 5. Impact & detail
  const co2_10yr_t = +(annualGen * EF * 10 / 1000).toFixed(1);
  const reqArea    = sysKW * areaPerKW;
  const feasible   = roofArea >= reqArea;
  const return10   = annualSavings * 10 - capex;

  return { sysKW, capex, payback, co2_10yr_t, reqArea, feasible, annualSavings, return10 };
};
```

### 4.4 Config (`/config/solar.json`)

```json
{
  "tariff": {
    "Gujarat": 8.0,
    "Maharashtra": 10.5,
    "Rajasthan": 7.7
  },
  "costPerWp": 33.05,
  "PR": 0.78,
  "areaPerKW": 100,
  "EF": 0.82
}
```

*Marketing can update this file without touching code; CI pipeline will redeploy static site.*

### 4.5 Error Handling

* Show inline red borders + helper text for invalid fields.
* If `feasible === false`, show warning banner: “Rooftop space limits size to **{sysKW} kW** – bill offset will be partial.”
* If calculated `sysKW < 1`, disable output cards and show: “System below 1 kW is not economical.”

---

## 5. Non‑Functional Requirements

| Area                 | Requirement                                |
| -------------------- | ------------------------------------------ |
| Performance          | Results < 100 ms on mid‑range laptop       |
| Responsiveness       | Works on 360 px mobile width               |
| Accessibility        | WCAG 2.2 AA colour contrast & keyboard nav |
| Internationalisation | Units toggle ft² / m²; ₹ hard‑coded for v1 |
| Quality              | ≥95% unit‑test coverage on `solarCalc`     |

---

## 6. UI / UX

* **Layout**: two‑column (inputs left, outputs right) on ≥ md screens; stacked on mobile.
* **Styling**: Tailwind + Cosmic brand palette.
* **Animate**: Fade‑in output cards (`framer‑motion`) after compute.
* **Icons**: Lucide – `Sun`, `Calculator`, `Leaf`, `Home`.

---

## 7. Architecture

| Layer        | Tech                   | Notes                                       |
| ------------ | ---------------------- | ------------------------------------------- |
| Presentation | React 18 + Vite        | Component exported as `<SolarCalculator />` |
| Logic        | TypeScript helper §4.3 | Pure, testable                              |
| State        | React Context          | Persist last inputs in `localStorage`       |
| Build        | Vite + Vitest + ESLint | CI on GitHub Actions                        |

---

## 8. Acceptance Criteria

1. Changing any input updates outputs after **one** button click.
2. Formula results match the sample scenario (§Appendix B) within ±2%.
3. `solarCalc` passes all unit tests including edge cases (sunHrs ≥ 7, roof shortage, low bill).
4. Config edit & redeploy updates tariffs without code change.

---

## 9. Open Issues

* Need emission factors per‑state? (future)
* m² ↔ ft² toggle localisation strings (Hindi/English)
* Autodetect sunlight hours via geolocation API (v2 backlog)

---

## Appendix A – Average Peak‑Sun‑Hours Table

*(abridged; full table in config)*

| State       | PSH (h/day) |
| ----------- | ----------- |
| Gujarat     | 5.5         |
| Maharashtra | 5.0         |
| Rajasthan   | 6.2         |

## Appendix B – Worked Example

See calculations in §4.3 code comments using: State = Gujarat, Bill = ₹ 6 000, Roof = 500 ft², SunHrs = 5.5.

---

**End of Document**

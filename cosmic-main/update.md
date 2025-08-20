# Mini Solar Savings Calculator – Logic‑Only PRD

> **Note:** This version models the behaviour of SolarSquare’s public widget, using **only two inputs** (State & Monthly Bill) and producing six outputs. No roof‑area constraint is applied; roof feasibility must be checked separately.

---

## 1  Purpose

Embed a fast, thumb‑rule‑based calculator that lets Indian users estimate the economic impact of switching to rooftop solar with minimal input friction.

---

## 2  Inputs & Outputs

### 2.1  Input Parameters (`Inputs`)

| Field         | Type       | Description                        | Validation                 |
| ------------- | ---------- | ---------------------------------- | -------------------------- |
| `state`       | `string`   | Indian state for tariff lookup     | must exist in `tariff` map |
| `monthlyBill` | `number` ₹ | Average electricity bill per month | 500 – 10 00 000            |

### 2.2  Output Metrics (`Outputs`)

| Field           | Type     | Unit | Meaning                                                         |
| --------------- | -------- | ---- | --------------------------------------------------------------- |
| `sysKW`         | `number` | kW   | **Recommended System Size**                                     |
| `capex`         | `number` | ₹    | **Estimated Investment** (rounded 100s)                         |
| `payback`       | `number` | yrs  | **Pay‑back Period**                                             |
| `reqArea`       | `number` | ft²  | **Required Roof Area** (100 ft² / kW rule)                      |
| `annualSavings` | `number` | ₹/yr | **Annual Savings (Year 1)**                                     |
| `net10`         | `number` | ₹    | **10‑Year Net Savings** (after degradation & tariff escalation) |

---

## 3  Config (`src/config/solar.json`)

```jsonc
{
  "tariff":   { "Gujarat": 7.00, "Maharashtra": 8.25, "Rajasthan": 7.35 },
  "costPerKW": 60000,  // ₹ per installed kW (turn‑key)
  "areaPerKW": 100,    // ft² per kW (roof thumb‑rule)
  "genPerKW_day": 4,   // kWh generated per kW per day (SolarSquare rule)
  "degRate": 0.01,     // panel degradation per year (1 %)
  "tariffInflation": 0.03 // expected grid tariff rise (3 %/yr)
}
```

All constants are editable JSON for non‑developer access.

---

## 4  Algorithm & Formulae (`solarCalc`)

1. **Units per month**: `Uₘ = monthlyBill / tariff[state]`
2. **System size (kW)**: `P = (Uₘ) / (genPerKW_day × 30)` → round 1 dp
3. **Capex (₹)**: `CAPEX = P × costPerKW` → round ₹100
4. **Annual generation**: `Eᵧ = P × genPerKW_day × 365`
5. **Annual savings (Year 1)**: `Sav₁ = Eᵧ × tariff[state]` → round ₹100
6. **Pay‑back (yrs)**: `Payback = CAPEX / Sav₁` (1 dp)
7. **Roof area**: `reqArea = P × areaPerKW`
8. **10‑yr net savings**:

   * Degradation factor: `(1 − degRate)ⁿ`
   * Tariff escalation: `(1 + tariffInflation)ⁿ`
   * For n = 0…9: `Savₙ = Sav₁ × (1‑deg)ⁿ × (1+infl)ⁿ`
   * `net10 = Σ Savₙ − CAPEX`
   * Pre‑compute multiplier **factor10 ≈ 10.9347** and use: `net10 = Sav₁ × factor10 − CAPEX`

---

## 5  Validation

| Case                | Behaviour                                           |
| ------------------- | --------------------------------------------------- |
| Missing/NaN input   | Throw `ValidationError`                             |
| `monthlyBill < 500` | Return flag `lowBill=true`                          |
| State not found     | Use median tariff; set `unknownState=true` flag     |
| `sysKW < 0.5`       | Return flag `tooSmall=true` (economically marginal) |

---

## 6  Testing

* **Unit tests (Jest)** – Fixtures for low bill, high bill, unknown state.
* **Snapshot tests** – Validate outputs remain stable with unchanged config.
* **Edge tests** – Confirm `factor10` shortcut matches loop sum ±0.1 %.

---

## 7  Extensibility

1. **Roof constraint** – add optional `roofArea` input & min() logic.
2. **State‑specific irradiance** – replace global `genPerKW_day` with map.
3. **Subsidy support** – subtract MNRE subsidy tiers from `CAPEX`.

---

**End – Mini Calculator PRD (Logic Only)**

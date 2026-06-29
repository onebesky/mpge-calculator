// Price data — update this file periodically. Sources: EIA (electricity), AAA/EIA (gas), OpenEI URDB (TOU).
// Last updated: 2026-06-29
window.PRICES = {
  "updated": "2026-06-29",
  "updatedGas": "2026-06-22",
  "updatedElec": "2026-04",
  "updatedTou": "2026-05-24",
  "national": {
    "avgElec": 0.19,
    "touOffPeak": 0.09,
    "avgGas": 3.91,
    "dcfc": 0.48
  },
  "states": {
    "california": {
      "name": "California",
      "avgElec": 0.35,
      "touOffPeak": 0.2,
      "avgGas": 5.39,
      "dcfc": 0.48,
      "touProgram": "PG&E EV2-A (~22¢ off-peak midnight–3 pm) / SCE TOU-D-PRIME (~25¢ off-peak 9 pm–4 pm) / SDG&E EV-TOU-5 (~12¢ super off-peak midnight–6 am). Shown rate is three-IOU average."
    },
    "texas": {
      "name": "Texas",
      "avgElec": 0.17,
      "touOffPeak": 0.03,
      "avgGas": 3.37,
      "dcfc": 0.48,
      "touProgram": "TXU / Reliant / Green Mountain free-nights plans — energy charge $0 overnight (8–9 pm to 5–6 am); ~3¢/kWh reflects TDU delivery charges only"
    },
    "florida": {
      "name": "Florida",
      "avgElec": 0.15,
      "touOffPeak": 0.09,
      "avgGas": 3.57,
      "dcfc": 0.48,
      "touProgram": "FPL TOU (RTU-1 rider) — off-peak ~9¢/kWh; on-peak Apr–Oct noon–9 pm weekdays"
    },
    "new-york": {
      "name": "New York",
      "avgElec": 0.29,
      "touOffPeak": 0.05,
      "avgGas": 4.08,
      "dcfc": 0.48,
      "touProgram": "Con Edison residential TOU — off-peak 5.2¢/kWh; on-peak 8 am–midnight weekdays"
    },
    "pennsylvania": {
      "name": "Pennsylvania",
      "avgElec": 0.21,
      "touOffPeak": 0.05,
      "avgGas": 4.01,
      "dcfc": 0.48,
      "touProgram": "PECO TOU — super off-peak midnight–6 am ~5¢/kWh (generation + delivery)"
    },
    "illinois": {
      "name": "Illinois",
      "avgElec": 0.2,
      "touOffPeak": 0.09,
      "avgGas": 3.72,
      "dcfc": 0.48,
      "touProgram": "ComEd Hourly Real-Time Pricing — overnight typically 8–10¢/kWh (formal residential TOU launching 2026)"
    },
    "ohio": {
      "name": "Ohio",
      "avgElec": 0.19,
      "touOffPeak": 0.07,
      "avgGas": 3.86,
      "dcfc": 0.48,
      "touProgram": "AEP Ohio Plug-In EV Rate (separately metered) — super off-peak midnight–4 am ~2¢ distribution + ~5¢ supply; total ~7¢/kWh"
    },
    "georgia": {
      "name": "Georgia",
      "avgElec": 0.15,
      "touOffPeak": 0.02,
      "avgGas": 3.58,
      "dcfc": 0.48,
      "touProgram": "Georgia Power TOU-OA-14 (Overnight Advantage) — super off-peak 11 pm–7 am daily: 2.19¢/kWh (one of the lowest rates in the US)"
    },
    "north-carolina": {
      "name": "North Carolina",
      "avgElec": 0.16,
      "touOffPeak": 0.08,
      "avgGas": 3.58,
      "dcfc": 0.48,
      "touProgram": "Duke Energy Progress / Carolinas R-TOUD — off-peak nights/weekends ~8¢/kWh"
    },
    "michigan": {
      "name": "Michigan",
      "avgElec": 0.21,
      "touOffPeak": 0.1,
      "avgGas": 3.72,
      "dcfc": 0.48,
      "touProgram": "DTE Energy Overnight Savers (D1.13) — super off-peak 1–7 am ~10¢/kWh"
    },
    "new-jersey": {
      "name": "New Jersey",
      "avgElec": 0.24,
      "touOffPeak": 0.21,
      "avgGas": 4.01,
      "dcfc": 0.48,
      "touProgram": "PSE&G RS-TOU-3P — off-peak (all hours except weekday 4–9 pm) ~21¢/kWh; NJ rates are high even off-peak"
    },
    "virginia": {
      "name": "Virginia",
      "avgElec": 0.17,
      "touOffPeak": 0.13,
      "avgGas": 3.58,
      "dcfc": 0.48,
      "touProgram": "Dominion Energy Virginia Off-Peak Plan — super off-peak midnight–5 am: 12.5¢ summer / 14.1¢ winter"
    },
    "washington": {
      "name": "Washington",
      "avgElec": 0.14,
      "touOffPeak": 0.09,
      "avgGas": 5.15,
      "dcfc": 0.48,
      "touProgram": "Puget Sound Energy Schedule 307/327 — off-peak 9 pm–7 am weekdays ~9¢/kWh"
    },
    "arizona": {
      "name": "Arizona",
      "avgElec": 0.15,
      "touOffPeak": 0.11,
      "avgGas": 4.67,
      "dcfc": 0.48,
      "touProgram": "APS Saver Choice Plus — off-peak ~12¢ summer / ~10¢ winter (all hours except weekday 3–7 pm)"
    },
    "massachusetts": {
      "name": "Massachusetts",
      "avgElec": 0.29,
      "touOffPeak": 0.1,
      "avgGas": 3.95,
      "dcfc": 0.48,
      "touProgram": "National Grid MA SC-1 VTOU / Eversource — off-peak (9 pm–1 pm next day) ~10¢/kWh delivery+supply"
    },
    "colorado": {
      "name": "Colorado",
      "avgElec": 0.17,
      "touOffPeak": 0.07,
      "avgGas": 3.67,
      "dcfc": 0.48,
      "touProgram": "Xcel Energy TOU (eff. Nov 2025) — off-peak ~7¢/kWh (peak only weekday 5–9 pm)"
    },
    "oregon": {
      "name": "Oregon",
      "avgElec": 0.16,
      "touOffPeak": 0.09,
      "avgGas": 4.67,
      "dcfc": 0.48,
      "touProgram": "Portland General Electric Time of Day — off-peak 9 pm–7 am weekdays: 9¢/kWh"
    },
    "tennessee": {
      "name": "Tennessee",
      "avgElec": 0.15,
      "touOffPeak": 0.07,
      "avgGas": 3.72,
      "dcfc": 0.48,
      "touProgram": "TVA / MTE NiteFlex — off-peak 10 pm–4 am ~7¢/kWh (Memphis LGW off-peak ~5¢)"
    },
    "indiana": {
      "name": "Indiana",
      "avgElec": 0.18,
      "touOffPeak": 0.07,
      "avgGas": 3.72,
      "dcfc": 0.48,
      "touProgram": "Duke Energy Indiana TOU — discount period 10 pm–4 am ~7¢/kWh"
    },
    "missouri": {
      "name": "Missouri",
      "avgElec": 0.14,
      "touOffPeak": 0.07,
      "avgGas": 3.72,
      "dcfc": 0.48,
      "touProgram": "Ameren Missouri Overnight Savers — 10 pm–6 am: 7.3¢ summer / 6.3¢ winter"
    },
    "maryland": {
      "name": "Maryland",
      "avgElec": 0.22,
      "touOffPeak": 0.1,
      "avgGas": 4.01,
      "dcfc": 0.48,
      "touProgram": "BGE Schedule EV (EVsmart TOU) — off-peak ~10.5¢/kWh (all hours except 10 am–8 pm summer weekdays)"
    },
    "wisconsin": {
      "name": "Wisconsin",
      "avgElec": 0.19,
      "touOffPeak": 0.1,
      "avgGas": 3.72,
      "dcfc": 0.48,
      "touProgram": "We Energies Rg-2 TOU — off-peak 10¢/kWh confirmed"
    },
    "minnesota": {
      "name": "Minnesota",
      "avgElec": 0.16,
      "touOffPeak": 0.04,
      "avgGas": 3.72,
      "dcfc": 0.48,
      "touProgram": "Xcel Energy EV Accelerate at Home — midnight–6 am: 3.8¢/kWh (separately metered EV circuit)"
    },
    "south-carolina": {
      "name": "South Carolina",
      "avgElec": 0.17,
      "touOffPeak": 0.09,
      "avgGas": 3.58,
      "dcfc": 0.48,
      "touProgram": "Duke Energy Progress / Dominion SC — off-peak nights/weekends ~9¢/kWh"
    },
    "alabama": {
      "name": "Alabama",
      "avgElec": 0.17,
      "touOffPeak": 0.1,
      "avgGas": 3.44,
      "dcfc": 0.48,
      "touProgram": "Alabama Power Rate RTA (Time Advantage) — economy off-peak hours: 10.3¢/kWh; PEV rider adds overnight discount 9 pm–5 am"
    },
    "louisiana": {
      "name": "Louisiana",
      "avgElec": 0.14,
      "touOffPeak": 0.11,
      "avgGas": 3.44,
      "dcfc": 0.48,
      "touProgram": "Entergy Louisiana — no residential TOU plan available; flat residential rate ~11¢/kWh applies to overnight charging"
    },
    "kentucky": {
      "name": "Kentucky",
      "avgElec": 0.15,
      "touOffPeak": 0.08,
      "avgGas": 3.72,
      "dcfc": 0.48,
      "touProgram": "LG&E (~9.2¢) / KU (~7.6¢) Time-of-Day — off-peak 10 pm–6 am weekdays, all weekends"
    },
    "oklahoma": {
      "name": "Oklahoma",
      "avgElec": 0.13,
      "touOffPeak": 0.03,
      "avgGas": 3.72,
      "dcfc": 0.48,
      "touProgram": "OG&E SmartHours Overnight — 11 pm–6 am: 2.7¢/kWh; PSO RSPEV: 3¢/kWh overnight"
    },
    "connecticut": {
      "name": "Connecticut",
      "avgElec": 0.32,
      "touOffPeak": 0.08,
      "avgGas": 3.95,
      "dcfc": 0.48,
      "touProgram": "Eversource Rate 7 / VPP — off-peak 8 pm–noon weekdays: 8.1¢/kWh (deeply discounted vs 30¢ average)"
    },
    "nevada": {
      "name": "Nevada",
      "avgElec": 0.14,
      "touOffPeak": 0.07,
      "avgGas": 4.67,
      "dcfc": 0.48,
      "touProgram": "NV Energy EVRR (EV Recharge Rider) — overnight ~10 pm–7 am: ~7¢/kWh average (winter ~5¢, summer higher)"
    }
  }
};

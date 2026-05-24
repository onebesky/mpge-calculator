// Price data — update this file periodically. Sources: EIA (electricity), AAA/EIA (gas), utility tariff sheets (TOU).
// Last updated: 2026-05-24
window.PRICES = {
  "updated": "2026-05-24",
  "national": {
    "avgElec": 0.19,
    "touOffPeak": 0.1,
    "avgGas": 4.49,
    "dcfc": 0.48
  },
  "states": {
    "california": {
      "name": "California",
      "avgElec": 0.33,
      "touOffPeak": 0.11,
      "avgGas": 5.96,
      "dcfc": 0.48,
      "touProgram": "PG&E EV2-A / SCE TOU-D-PRIME — off-peak 9 pm–9 am",
      "cities": {
        "los-angeles": {
          "name": "Los Angeles",
          "utility": "SCE / LADWP",
          "avgElec": 0.25,
          "touOffPeak": 0.1,
          "avgGas": 4.9
        },
        "san-francisco": {
          "name": "San Francisco",
          "utility": "PG&E",
          "avgElec": 0.32,
          "touOffPeak": 0.13,
          "avgGas": 4.95
        },
        "san-diego": {
          "name": "San Diego",
          "utility": "SDG&E",
          "avgElec": 0.34,
          "touOffPeak": 0.16,
          "avgGas": 4.92
        },
        "sacramento": {
          "name": "Sacramento",
          "utility": "SMUD",
          "avgElec": 0.2,
          "touOffPeak": 0.06,
          "avgGas": 4.8
        },
        "san-jose": {
          "name": "San Jose",
          "utility": "PG&E",
          "avgElec": 0.32,
          "touOffPeak": 0.13,
          "avgGas": 4.9
        }
      }
    },
    "texas": {
      "name": "Texas",
      "avgElec": 0.16,
      "touOffPeak": 0.06,
      "avgGas": 3.89,
      "dcfc": 0.48,
      "touProgram": "TXU / Reliant free-nights plans — off-peak 9 pm–6 am",
      "cities": {
        "houston": {
          "name": "Houston",
          "utility": "CenterPoint/Various",
          "avgElec": 0.14,
          "touOffPeak": 0.05,
          "avgGas": 2.8
        },
        "dallas": {
          "name": "Dallas",
          "utility": "Oncor/Various",
          "avgElec": 0.13,
          "touOffPeak": 0.06,
          "avgGas": 2.85
        },
        "austin": {
          "name": "Austin",
          "utility": "Austin Energy",
          "avgElec": 0.11,
          "touOffPeak": 0.04,
          "avgGas": 2.85
        },
        "san-antonio": {
          "name": "San Antonio",
          "utility": "CPS Energy",
          "avgElec": 0.12,
          "touOffPeak": 0.04,
          "avgGas": 2.8
        },
        "fort-worth": {
          "name": "Fort Worth",
          "utility": "Oncor/Various",
          "avgElec": 0.13,
          "touOffPeak": 0.06,
          "avgGas": 2.85
        }
      }
    },
    "florida": {
      "name": "Florida",
      "avgElec": 0.15,
      "touOffPeak": 0.07,
      "avgGas": 4.14,
      "dcfc": 0.48,
      "touProgram": "FPL EV-1 / Duke Energy Smart Charge — off-peak 11 pm–7 am",
      "cities": {
        "miami": {
          "name": "Miami",
          "utility": "FPL",
          "avgElec": 0.15,
          "touOffPeak": 0.07,
          "avgGas": 3.22
        },
        "orlando": {
          "name": "Orlando",
          "utility": "OUC/Duke",
          "avgElec": 0.14,
          "touOffPeak": 0.06,
          "avgGas": 3.18
        },
        "tampa": {
          "name": "Tampa",
          "utility": "TECO",
          "avgElec": 0.14,
          "touOffPeak": 0.06,
          "avgGas": 3.15
        },
        "jacksonville": {
          "name": "Jacksonville",
          "utility": "JEA",
          "avgElec": 0.14,
          "touOffPeak": 0.06,
          "avgGas": 3.2
        },
        "fort-lauderdale": {
          "name": "Fort Lauderdale",
          "utility": "FPL",
          "avgElec": 0.15,
          "touOffPeak": 0.07,
          "avgGas": 3.25
        }
      }
    },
    "new-york": {
      "name": "New York",
      "avgElec": 0.29,
      "touOffPeak": 0.09,
      "avgGas": 4.52,
      "dcfc": 0.48,
      "touProgram": "Con Edison EV Smart / NYSEG Smart Energy — off-peak midnight–8 am",
      "cities": {
        "new-york-city": {
          "name": "New York City",
          "utility": "Con Edison",
          "avgElec": 0.26,
          "touOffPeak": 0.1,
          "avgGas": 3.55
        },
        "buffalo": {
          "name": "Buffalo",
          "utility": "National Grid",
          "avgElec": 0.2,
          "touOffPeak": 0.08,
          "avgGas": 3.4
        },
        "rochester": {
          "name": "Rochester",
          "utility": "NYSEG/RG&E",
          "avgElec": 0.21,
          "touOffPeak": 0.08,
          "avgGas": 3.38
        },
        "albany": {
          "name": "Albany",
          "utility": "National Grid",
          "avgElec": 0.22,
          "touOffPeak": 0.09,
          "avgGas": 3.42
        },
        "syracuse": {
          "name": "Syracuse",
          "utility": "National Grid",
          "avgElec": 0.2,
          "touOffPeak": 0.08,
          "avgGas": 3.38
        }
      }
    },
    "pennsylvania": {
      "name": "Pennsylvania",
      "avgElec": 0.21,
      "touOffPeak": 0.08,
      "avgGas": 4.53,
      "dcfc": 0.48,
      "touProgram": "PECO / PPL Electric EV TOU — off-peak 10 pm–6 am",
      "cities": {
        "philadelphia": {
          "name": "Philadelphia",
          "utility": "PECO",
          "avgElec": 0.18,
          "touOffPeak": 0.08,
          "avgGas": 3.45
        },
        "pittsburgh": {
          "name": "Pittsburgh",
          "utility": "Duquesne Light",
          "avgElec": 0.17,
          "touOffPeak": 0.07,
          "avgGas": 3.35
        },
        "allentown": {
          "name": "Allentown",
          "utility": "PPL",
          "avgElec": 0.16,
          "touOffPeak": 0.07,
          "avgGas": 3.4
        },
        "erie": {
          "name": "Erie",
          "utility": "FirstEnergy",
          "avgElec": 0.17,
          "touOffPeak": 0.08,
          "avgGas": 3.38
        },
        "reading": {
          "name": "Reading",
          "utility": "PPL",
          "avgElec": 0.16,
          "touOffPeak": 0.07,
          "avgGas": 3.42
        }
      }
    },
    "illinois": {
      "name": "Illinois",
      "avgElec": 0.19,
      "touOffPeak": 0.06,
      "avgGas": 4.4,
      "dcfc": 0.48,
      "touProgram": "ComEd Real-Time Pricing / EV Hourly — off-peak 10 pm–6 am",
      "cities": {
        "chicago": {
          "name": "Chicago",
          "utility": "ComEd",
          "avgElec": 0.17,
          "touOffPeak": 0.06,
          "avgGas": 3.6
        },
        "aurora": {
          "name": "Aurora",
          "utility": "ComEd",
          "avgElec": 0.17,
          "touOffPeak": 0.06,
          "avgGas": 3.55
        },
        "rockford": {
          "name": "Rockford",
          "utility": "ComEd",
          "avgElec": 0.16,
          "touOffPeak": 0.06,
          "avgGas": 3.5
        },
        "naperville": {
          "name": "Naperville",
          "utility": "ComEd",
          "avgElec": 0.17,
          "touOffPeak": 0.06,
          "avgGas": 3.58
        },
        "peoria": {
          "name": "Peoria",
          "utility": "Ameren Illinois",
          "avgElec": 0.16,
          "touOffPeak": 0.07,
          "avgGas": 3.48
        }
      }
    },
    "ohio": {
      "name": "Ohio",
      "avgElec": 0.19,
      "touOffPeak": 0.07,
      "avgGas": 4.51,
      "dcfc": 0.48,
      "touProgram": "AEP Ohio / FirstEnergy EV TOU — off-peak 9 pm–6 am",
      "cities": {
        "columbus": {
          "name": "Columbus",
          "utility": "AEP Ohio",
          "avgElec": 0.14,
          "touOffPeak": 0.07,
          "avgGas": 3.18
        },
        "cleveland": {
          "name": "Cleveland",
          "utility": "FirstEnergy/CEI",
          "avgElec": 0.15,
          "touOffPeak": 0.07,
          "avgGas": 3.22
        },
        "cincinnati": {
          "name": "Cincinnati",
          "utility": "Duke Energy Ohio",
          "avgElec": 0.14,
          "touOffPeak": 0.06,
          "avgGas": 3.15
        },
        "toledo": {
          "name": "Toledo",
          "utility": "FirstEnergy",
          "avgElec": 0.14,
          "touOffPeak": 0.06,
          "avgGas": 3.18
        },
        "akron": {
          "name": "Akron",
          "utility": "FirstEnergy/Ohio Edison",
          "avgElec": 0.15,
          "touOffPeak": 0.07,
          "avgGas": 3.22
        }
      }
    },
    "georgia": {
      "name": "Georgia",
      "avgElec": 0.15,
      "touOffPeak": 0.04,
      "avgGas": 4.12,
      "dcfc": 0.48,
      "touProgram": "Georgia Power EVOP — off-peak 2 am–2 pm (exceptionally cheap overnight)",
      "cities": {
        "atlanta": {
          "name": "Atlanta",
          "utility": "Georgia Power",
          "avgElec": 0.14,
          "touOffPeak": 0.04,
          "avgGas": 2.95
        },
        "augusta": {
          "name": "Augusta",
          "utility": "Georgia Power",
          "avgElec": 0.13,
          "touOffPeak": 0.04,
          "avgGas": 2.9
        },
        "columbus": {
          "name": "Columbus",
          "utility": "Georgia Power",
          "avgElec": 0.13,
          "touOffPeak": 0.04,
          "avgGas": 2.9
        },
        "macon": {
          "name": "Macon",
          "utility": "Georgia Power",
          "avgElec": 0.13,
          "touOffPeak": 0.04,
          "avgGas": 2.92
        },
        "savannah": {
          "name": "Savannah",
          "utility": "Georgia Power",
          "avgElec": 0.14,
          "touOffPeak": 0.04,
          "avgGas": 2.95
        }
      }
    },
    "north-carolina": {
      "name": "North Carolina",
      "avgElec": 0.16,
      "touOffPeak": 0.07,
      "avgGas": 4.12,
      "dcfc": 0.48,
      "touProgram": "Duke Energy Carolinas / Progress EV TOU — off-peak 9 pm–9 am",
      "cities": {
        "charlotte": {
          "name": "Charlotte",
          "utility": "Duke Energy Carolinas",
          "avgElec": 0.13,
          "touOffPeak": 0.07,
          "avgGas": 3.12
        },
        "raleigh": {
          "name": "Raleigh",
          "utility": "Duke Energy Progress",
          "avgElec": 0.13,
          "touOffPeak": 0.07,
          "avgGas": 3.08
        },
        "greensboro": {
          "name": "Greensboro",
          "utility": "Duke Energy Progress",
          "avgElec": 0.12,
          "touOffPeak": 0.07,
          "avgGas": 3.08
        },
        "durham": {
          "name": "Durham",
          "utility": "Duke Energy Progress",
          "avgElec": 0.13,
          "touOffPeak": 0.07,
          "avgGas": 3.08
        },
        "winston-salem": {
          "name": "Winston-Salem",
          "utility": "Duke Energy Carolinas",
          "avgElec": 0.13,
          "touOffPeak": 0.07,
          "avgGas": 3.1
        }
      }
    },
    "michigan": {
      "name": "Michigan",
      "avgElec": 0.21,
      "touOffPeak": 0.08,
      "avgGas": 4.4,
      "dcfc": 0.48,
      "touProgram": "DTE Energy EV Rate / Consumers EV Advantage — off-peak 11 pm–7 am",
      "cities": {
        "detroit": {
          "name": "Detroit",
          "utility": "DTE Energy",
          "avgElec": 0.2,
          "touOffPeak": 0.08,
          "avgGas": 3.28
        },
        "grand-rapids": {
          "name": "Grand Rapids",
          "utility": "Consumers Energy",
          "avgElec": 0.18,
          "touOffPeak": 0.07,
          "avgGas": 3.22
        },
        "warren": {
          "name": "Warren",
          "utility": "DTE Energy",
          "avgElec": 0.2,
          "touOffPeak": 0.08,
          "avgGas": 3.28
        },
        "sterling-heights": {
          "name": "Sterling Heights",
          "utility": "DTE Energy",
          "avgElec": 0.2,
          "touOffPeak": 0.08,
          "avgGas": 3.28
        },
        "ann-arbor": {
          "name": "Ann Arbor",
          "utility": "DTE Energy",
          "avgElec": 0.19,
          "touOffPeak": 0.08,
          "avgGas": 3.25
        }
      }
    },
    "new-jersey": {
      "name": "New Jersey",
      "avgElec": 0.23,
      "touOffPeak": 0.09,
      "avgGas": 4.53,
      "dcfc": 0.48,
      "touProgram": "PSE&G / JCP&L EV TOU — off-peak 11 pm–9 am",
      "cities": {
        "newark": {
          "name": "Newark",
          "utility": "PSE&G",
          "avgElec": 0.21,
          "touOffPeak": 0.09,
          "avgGas": 3.55
        },
        "jersey-city": {
          "name": "Jersey City",
          "utility": "PSE&G",
          "avgElec": 0.21,
          "touOffPeak": 0.09,
          "avgGas": 3.55
        },
        "paterson": {
          "name": "Paterson",
          "utility": "PSE&G",
          "avgElec": 0.2,
          "touOffPeak": 0.09,
          "avgGas": 3.5
        },
        "elizabeth": {
          "name": "Elizabeth",
          "utility": "PSE&G",
          "avgElec": 0.21,
          "touOffPeak": 0.09,
          "avgGas": 3.52
        },
        "trenton": {
          "name": "Trenton",
          "utility": "PSE&G",
          "avgElec": 0.2,
          "touOffPeak": 0.08,
          "avgGas": 3.48
        }
      }
    },
    "virginia": {
      "name": "Virginia",
      "avgElec": 0.17,
      "touOffPeak": 0.07,
      "avgGas": 4.12,
      "dcfc": 0.48,
      "touProgram": "Dominion Energy EV TOU — off-peak 10 pm–6 am",
      "cities": {
        "virginia-beach": {
          "name": "Virginia Beach",
          "utility": "Dominion Energy",
          "avgElec": 0.14,
          "touOffPeak": 0.07,
          "avgGas": 3.12
        },
        "norfolk": {
          "name": "Norfolk",
          "utility": "Dominion Energy",
          "avgElec": 0.14,
          "touOffPeak": 0.07,
          "avgGas": 3.12
        },
        "richmond": {
          "name": "Richmond",
          "utility": "Dominion Energy",
          "avgElec": 0.14,
          "touOffPeak": 0.07,
          "avgGas": 3.18
        },
        "arlington": {
          "name": "Arlington",
          "utility": "Dominion Energy",
          "avgElec": 0.14,
          "touOffPeak": 0.07,
          "avgGas": 3.2
        },
        "roanoke": {
          "name": "Roanoke",
          "utility": "Appalachian Power",
          "avgElec": 0.13,
          "touOffPeak": 0.06,
          "avgGas": 3.15
        }
      }
    },
    "washington": {
      "name": "Washington",
      "avgElec": 0.14,
      "touOffPeak": 0.05,
      "avgGas": 5.59,
      "dcfc": 0.48,
      "touProgram": "PSE EV TOU / Seattle City Light — off-peak 11 pm–7 am",
      "cities": {
        "seattle": {
          "name": "Seattle",
          "utility": "Seattle City Light",
          "avgElec": 0.1,
          "touOffPeak": 0.04,
          "avgGas": 4.15
        },
        "spokane": {
          "name": "Spokane",
          "utility": "Avista",
          "avgElec": 0.1,
          "touOffPeak": 0.04,
          "avgGas": 3.95
        },
        "tacoma": {
          "name": "Tacoma",
          "utility": "Tacoma Public Utilities",
          "avgElec": 0.09,
          "touOffPeak": 0.04,
          "avgGas": 4.1
        },
        "bellevue": {
          "name": "Bellevue",
          "utility": "Puget Sound Energy",
          "avgElec": 0.12,
          "touOffPeak": 0.05,
          "avgGas": 4.18
        },
        "everett": {
          "name": "Everett",
          "utility": "Puget Sound Energy",
          "avgElec": 0.12,
          "touOffPeak": 0.05,
          "avgGas": 4.12
        }
      }
    },
    "arizona": {
      "name": "Arizona",
      "avgElec": 0.16,
      "touOffPeak": 0.06,
      "avgGas": 5.19,
      "dcfc": 0.48,
      "touProgram": "APS EV Time Advantage / SRP TOU-E — off-peak 10 pm–noon",
      "cities": {
        "phoenix": {
          "name": "Phoenix",
          "utility": "APS",
          "avgElec": 0.15,
          "touOffPeak": 0.06,
          "avgGas": 3.42
        },
        "tucson": {
          "name": "Tucson",
          "utility": "TEP",
          "avgElec": 0.14,
          "touOffPeak": 0.05,
          "avgGas": 3.35
        },
        "mesa": {
          "name": "Mesa",
          "utility": "SRP",
          "avgElec": 0.14,
          "touOffPeak": 0.07,
          "avgGas": 3.4
        },
        "scottsdale": {
          "name": "Scottsdale",
          "utility": "APS",
          "avgElec": 0.15,
          "touOffPeak": 0.06,
          "avgGas": 3.45
        },
        "chandler": {
          "name": "Chandler",
          "utility": "SRP",
          "avgElec": 0.14,
          "touOffPeak": 0.07,
          "avgGas": 3.38
        }
      }
    },
    "massachusetts": {
      "name": "Massachusetts",
      "avgElec": 0.3,
      "touOffPeak": 0.18,
      "avgGas": 4.45,
      "dcfc": 0.48,
      "touProgram": "Eversource / National Grid EV rate — off-peak midnight–7 am",
      "cities": {
        "boston": {
          "name": "Boston",
          "utility": "Eversource",
          "avgElec": 0.32,
          "touOffPeak": 0.19,
          "avgGas": 3.35
        },
        "worcester": {
          "name": "Worcester",
          "utility": "National Grid",
          "avgElec": 0.29,
          "touOffPeak": 0.17,
          "avgGas": 3.28
        },
        "springfield": {
          "name": "Springfield",
          "utility": "Eversource",
          "avgElec": 0.3,
          "touOffPeak": 0.18,
          "avgGas": 3.25
        },
        "lowell": {
          "name": "Lowell",
          "utility": "Eversource",
          "avgElec": 0.31,
          "touOffPeak": 0.19,
          "avgGas": 3.32
        },
        "cambridge": {
          "name": "Cambridge",
          "utility": "Eversource",
          "avgElec": 0.32,
          "touOffPeak": 0.19,
          "avgGas": 3.35
        }
      }
    },
    "colorado": {
      "name": "Colorado",
      "avgElec": 0.17,
      "touOffPeak": 0.05,
      "avgGas": 4.62,
      "dcfc": 0.48,
      "touProgram": "Xcel Energy EV Accelerate At Home — off-peak 9 pm–9 am",
      "cities": {
        "denver": {
          "name": "Denver",
          "utility": "Xcel Energy",
          "avgElec": 0.15,
          "touOffPeak": 0.05,
          "avgGas": 3.05
        },
        "colorado-springs": {
          "name": "Colorado Springs",
          "utility": "Colorado Springs Utilities",
          "avgElec": 0.14,
          "touOffPeak": 0.05,
          "avgGas": 3
        },
        "aurora": {
          "name": "Aurora",
          "utility": "Xcel Energy",
          "avgElec": 0.15,
          "touOffPeak": 0.05,
          "avgGas": 3.05
        },
        "fort-collins": {
          "name": "Fort Collins",
          "utility": "Fort Collins Utilities",
          "avgElec": 0.13,
          "touOffPeak": 0.04,
          "avgGas": 3.02
        },
        "boulder": {
          "name": "Boulder",
          "utility": "Xcel Energy",
          "avgElec": 0.15,
          "touOffPeak": 0.05,
          "avgGas": 3.08
        }
      }
    },
    "oregon": {
      "name": "Oregon",
      "avgElec": 0.15,
      "touOffPeak": 0.06,
      "avgGas": 5.19,
      "dcfc": 0.48,
      "touProgram": "Portland General Electric Time of Day — off-peak 9 pm–7 am",
      "cities": {
        "portland": {
          "name": "Portland",
          "utility": "PGE",
          "avgElec": 0.13,
          "touOffPeak": 0.07,
          "avgGas": 3.98
        },
        "eugene": {
          "name": "Eugene",
          "utility": "EWEB",
          "avgElec": 0.1,
          "touOffPeak": 0.05,
          "avgGas": 3.9
        },
        "salem": {
          "name": "Salem",
          "utility": "PGE",
          "avgElec": 0.13,
          "touOffPeak": 0.07,
          "avgGas": 3.92
        },
        "gresham": {
          "name": "Gresham",
          "utility": "PGE",
          "avgElec": 0.13,
          "touOffPeak": 0.07,
          "avgGas": 3.98
        },
        "hillsboro": {
          "name": "Hillsboro",
          "utility": "PGE",
          "avgElec": 0.13,
          "touOffPeak": 0.07,
          "avgGas": 3.95
        }
      }
    },
    "tennessee": {
      "name": "Tennessee",
      "avgElec": 0.15,
      "touOffPeak": 0.06,
      "avgGas": 4.4,
      "dcfc": 0.48,
      "touProgram": "TVA / local co-ops EV TOU — off-peak 9 pm–9 am"
    },
    "indiana": {
      "name": "Indiana",
      "avgElec": 0.18,
      "touOffPeak": 0.07,
      "avgGas": 4.4,
      "dcfc": 0.48,
      "touProgram": "Duke Energy Indiana / AEP Indiana EV TOU"
    },
    "missouri": {
      "name": "Missouri",
      "avgElec": 0.13,
      "touOffPeak": 0.07,
      "avgGas": 4.4,
      "dcfc": 0.48,
      "touProgram": "Ameren Missouri / Evergy EV TOU"
    },
    "maryland": {
      "name": "Maryland",
      "avgElec": 0.36,
      "touOffPeak": 0.08,
      "avgGas": 4.53,
      "dcfc": 0.48,
      "touProgram": "BGE EV TOU / Pepco Smart Energy — off-peak midnight–7 am"
    },
    "wisconsin": {
      "name": "Wisconsin",
      "avgElec": 0.19,
      "touOffPeak": 0.08,
      "avgGas": 4.4,
      "dcfc": 0.48,
      "touProgram": "We Energies / Xcel Wisconsin EV TOU"
    },
    "minnesota": {
      "name": "Minnesota",
      "avgElec": 0.15,
      "touOffPeak": 0.07,
      "avgGas": 4.34,
      "dcfc": 0.48,
      "touProgram": "Xcel Energy EV Accelerate At Home (MN) — off-peak 9 pm–9 am"
    },
    "south-carolina": {
      "name": "South Carolina",
      "avgElec": 0.16,
      "touOffPeak": 0.07,
      "avgGas": 4.12,
      "dcfc": 0.48,
      "touProgram": "Duke Energy Carolinas / Dominion Energy SC EV rate"
    },
    "alabama": {
      "name": "Alabama",
      "avgElec": 0.17,
      "touOffPeak": 0.06,
      "avgGas": 3.95,
      "dcfc": 0.48,
      "touProgram": "Alabama Power EV TOU"
    },
    "louisiana": {
      "name": "Louisiana",
      "avgElec": 0.14,
      "touOffPeak": 0.05,
      "avgGas": 3.95,
      "dcfc": 0.48,
      "touProgram": "Entergy Louisiana EV rate — off-peak nights"
    },
    "kentucky": {
      "name": "Kentucky",
      "avgElec": 0.15,
      "touOffPeak": 0.06,
      "avgGas": 4.4,
      "dcfc": 0.48,
      "touProgram": "LG&E / KU EV TOU / East Kentucky Power"
    },
    "oklahoma": {
      "name": "Oklahoma",
      "avgElec": 0.14,
      "touOffPeak": 0.06,
      "avgGas": 4.4,
      "dcfc": 0.48,
      "touProgram": "OG&E EV Smart Charge — off-peak midnight–6 am"
    },
    "connecticut": {
      "name": "Connecticut",
      "avgElec": 0.3,
      "touOffPeak": 0.17,
      "avgGas": 4.49,
      "dcfc": 0.48,
      "touProgram": "Eversource CT / UI SmartRide EV — off-peak midnight–8 am"
    },
    "nevada": {
      "name": "Nevada",
      "avgElec": 0.14,
      "touOffPeak": 0.06,
      "avgGas": 5.19,
      "dcfc": 0.48,
      "touProgram": "NV Energy EV TOU — off-peak 9 pm–noon"
    }
  }
};

# Flux Engineering: RF & Digital Broadcast Utilities

A real-time, high-precision telemetry and configuration modeling dashboard for DVB transmission protocols. This utility offers broadcast engineers precise calculations for DVB-T payload bitrates and DVB-S/S2 satellite Intermediate Frequency (IF) routing matrixes.

---

## 🚀 Key Features

### 📺 DVB-T Bitrate & Payload Calculator
Enables real-time modeling of DVB-T (EN 300 744) signal structures and payload bitrates:
- **Transmission Modes:** 2k & 8k carriers (with data carrier counts mapped).
- **Modulation Schemes:** QPSK, 16-QAM, and 64-QAM.
- **Forward Error Correction (FEC):** Code rates of 1/2, 2/3, 3/4, 5/6, and 7/8.
- **Guard Intervals (GI):** 1/4, 1/8, 1/16, and 1/32.
- **Real-Time Symbol Telemetry:** Symbol duration ($T_u$), Guard duration ($T_g$), and Total duration ($T_s$) calculated in microseconds (µs).
- **UHF Channel Converter:** DVB-T standard UHF channel input mapping to center frequency and band edges (UHF Channels 21–48 / 474–690 MHz).

### 🛰️ DVB-S/S2 Intermediate Feed Calculator
Enables high-frequency Intermediate Feed routing calculations for satellite LNB Universal Ku-Band configurations:
- **Frequency Band Conversion:** Translates satellite RF downlinks to L-Band Intermediate Frequencies (IF) based on high/low local oscillator (LO) frequency matrices.
- **Polarization Handling:** Models vertical/horizontal and left/right circular polarizations.

---

## 🛠️ Tech Stack & Dependencies

This frontend application is designed using a modern, fast, and light-weight stack:

- **Core Framework:** React 19
- **Language:** TypeScript 5+ (Strict Type Checking)
- **Build Engine & Dev Server:** Vite 6
- **Styling:** Tailwind CSS v4.0.0 (High-performance styling system)
- **Icons:** Lucide React (Clean vector iconography)
- **Package Manager:** `pnpm` (Fast, disk-efficient package management)

---

## 📋 System Requirements

To run this project locally, ensure you have the following installed on your machine:
* **Node.js** v18.0.0 or higher
* **pnpm** v8.0.0 or higher (highly recommended for lockfile compatibility)

---

## 💻 Getting Started

Follow these steps to bootstrap the project on your local machine:

### 1. Install Dependencies
Run the following command in the root folder of the project to install all required packages:
```bash
pnpm install
```

### 2. Start the Development Server
Launch the local Vite server to start iterating and testing live changes:
```bash
pnpm dev
```
By default, the application will boot at `http://localhost:5173`. Open this URL in your web browser.

### 3. Lint the Codebase
Ensure strict TypeScript definitions and code styling conventions are respected:
```bash
pnpm lint
```

### 4. Build for Production
Generate the highly optimized, tree-shaken static bundle inside the `dist` directory:
```bash
pnpm build
```

### 5. Preview Production Build Locally
Verify the production build works flawlessly in a simulated environment:
```bash
pnpm preview
```

---

## 📂 Project Structure

```text
├── index.html            # Main SPA Mountpoint
├── package.json          # Dependency Manifest and NPM scripts
├── pnpm-lock.yaml        # Lockfile containing precise dependency trees
├── tsconfig.json         # TypeScript Compiler Configuration
├── vite.config.ts        # Vite Server and Plugin setup
└── src/
    ├── main.tsx          # Application Entry Point
    ├── App.tsx           # Dashboard Layout, Theme Manager, and Component Grid
    ├── index.css         # Custom Tailwind v4 styling system and Theme Tokens
    ├── channels-dvb-t.md # UHF Channel lookup reference
    ├── components/       # Interactive RF Calculators
    │   ├── DvbTCalculator.tsx
    │   └── DvbSCalculator.tsx
    └── types/            # Strict Type Declarations for RF Calculations
        └── rf.ts
```

---

## 📐 Mathematical Reference (DVB-T Bitrate)

The payload bitrate ($R$) is calculated using the DVB-T standard formula:

$$R = \frac{N_{data} \times \log_2(M) \times CR_{FEC} \times CR_{RS}}{T_s}$$

Where:
- $N_{data}$ = Number of active data carriers (e.g. 1512 for 2k, 6048 for 8k).
- $\log_2(M)$ = Bits per symbol (QPSK = 2, 16-QAM = 4, 64-QAM = 6).
- $CR_{FEC}$ = Forward Error Correction Code Rate (e.g. $1/2$, $2/3$, etc.).
- $CR_{RS}$ = Reed-Solomon Code Rate (Fixed outer coder rate of $\frac{188}{204}$).
- $T_s$ = Total symbol duration ($T_u + T_g$).

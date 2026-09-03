---
weight: 1
title: ⚡ Quad Plus
url: "/experience/quadplus/"
slug: "quadplus"
tags: ["quad plus", "field service engineer", "automation", "plc", "scada", "drives", "siemens", "rockwell", "industrial automation", "tia portal", "studio 5000", "sinamics", "abb", "hmi", "profibus", "profinet", "commissioning"]
date: 2025-08-01
position: "Field Service Engineer"
duration: "Aug 2025 - Present"
location: "Joliet, Illinois, United States · Field Service / US Travel"
---
# Field Service Engineer

Working as a Field Service Engineer at Quad Plus has put me right on the front lines of heavy industrial automation across the country. Traveling from our Joliet base to manufacturing facilities, steel mills, paper plants, and recycling centers throughout the U.S., I specialize in turnkey commissioning, modernization retrofits, and emergency troubleshooting of mission-critical control and drive systems.

In heavy manufacturing, every hour of downtime carries massive operational costs. My role is to step into dynamic, high-stakes plant environments, quickly diagnose complex root causes—whether that is an obscure thyristor firing fault on a high-tonnage DC shredder drive, an optical signal budget drop on a PROFIBUS ring, or a ladder logic race condition in a high-speed slitting line—and engineer lasting, robust solutions. From multi-vendor drive coordination to legacy backplane migrations (bringing discontinued Allen-Bradley SLC 500 or Siemens S5 systems into modern architectures), it's the ultimate test of hands-on electrical engineering, networking, and control software.

{{< assetimg src="img/PXL_20260811_085630038.jpg" alt="On-site industrial plant commissioning" class="center-image" caption="Turnkey commissioning and heavy drive motor retrofit on an elevated processing platform" >}}

---

## Core Engineering Services

### 1. Variable Frequency & DC Drive Systems
* **Commissioning & Tuning:** Closed-loop vector control, dancer/load cell tension feedback, dynamic braking, and surface speed/diameter compensation algorithms for winders and coil handling lines.
* **Retrofits & Modernization:** Engineered conversions replacing obsolete AC/DC drives (e.g., PowerFlex 700H VFD to Allen-Bradley SMC-Flex solid-state soft starters; Parker AC890 drive bypass and bus restructuring).
* **Multi-Drive Synchronization:** Real-time inter-drive communication bus configuration (SINAMICS Link via CBE20, optical PROFIBUS rings) for master-slave torque and speed sharing.

{{< assetimg src="img/PXL_20260810_201305382.jpg" alt="SINAMICS drive chassis with CBE20 communication board" class="center-image" caption="SINAMICS drive chassis inspection and CBE20 communication board integration" >}}

### 2. PLC Architecture, Migration & Logic Modernization
* **Legacy Conversions:** Migrating discontinued systems (e.g., Allen-Bradley SLC 5/01 to SLC 5/04 CPU conversions, Siemens Simatic S5 support using PLC Workshop S5) into current architectures.
* **Control Optimization:** Eliminating race conditions in process permissives, interlocking safety sirens, and refactoring ladder logic, function blocks, and structured text across Studio 5000 and TIA Portal.
* **Hardware Integration:** Remote and distributed I/O troubleshooting, chassis expansion, and field instrument data acquisition.

{{< assetimg src="img/PXL_20260715_115324217.jpg" alt="Siemens ET 200S distributed I/O rack with PROFINET" class="center-image" caption="Siemens ET 200S distributed I/O rack with PROFINET interface (IM 151-3 PN) during field troubleshooting and I/O checkout" >}}

### 3. Industrial Networks & Telemetry
* **Fiber-Optic Infrastructure:** Diagnostics, replacement, and power-budget attenuation testing for Siemens Optical Link Modules (OLMs) running deterministic PROFIBUS networks.
* **Industrial Wireless & Remote Access:** RF tuning and packet-loss mitigation on ProSoft RLX2-IHNF industrial radios; secure remote diagnostics deployment using Stridelinx VPN gateways.
* **Serial & Instrument Interfacing:** RS-232/RS-485 string parsing for dynamic industrial floor scales, mass flow meters, and barcode scanners into PLC memory arrays.

### 4. HMI & SCADA Development
* **Platform Conversions & Updates:** Redeploying and refactoring AVEVA/Wonderware InTouch applications, FactoryTalk View ME/SE terminal displays, and Siemens WinCC Unified dashboards.
* **Alarming & Data Integrity:** Tag database optimization, direct PLC-to-HMI tag synchronization, recipe management, and audit-compliant alarm logging.

### 5. Emergency Field Diagnostics & Root Cause Analysis
* **24/7 Rapid Response:** On-site system recovery following drive blown fuses, encoder signal loss, mechanical binding, and intermittent communication drops.
* **Predictive Testing:** Motor insulation resistance testing (Megger), encoder signal integrity verification with oscilloscopes, and optical cable loss measurement.

---

## Representative Field Projects & Case Studies

### 1. PowerFlex 700H to SMC-Flex Soft Starter Retrofit
* **Facility / Client:** Skana Aluminum (Manitowoc, WI)
* **Domain:** Heavy Metals / Rolling Mill Auxiliary
* **Objective:** Replace a failing Allen-Bradley PowerFlex 700H variable frequency drive with an SMC-Flex solid-state soft starter on an essential heavy processing motor.
* **Execution:** Re-engineered electrical schematics, mapped motor start/stop and fault permissives into the existing PLC architecture, set acceleration ramps, and commissioned the soft starter under high initial inertia loads.
* **Outcome:** Restored motor operation with reduced system complexity, lower thermal dissipation, and elimination of repeated VFD drive trips.

### 2. Metals Processing Shredder & Pinch Roll DC Drive Service
* **Facility / Client:** ABQ Metals (Albuquerque, NM)
* **Domain:** Scrap Recycling & Metal Processing
* **Objective:** Eliminate intermittent overcurrent trips and torque delivery faults on high-tonnage shredder rolls and associated pinch roll drives.
* **Execution:** Diagnosed armature and field circuits on ABB DCS800 DC drives; rewired pinch roll motor drive control loops; verified thyristor firing angles, and retuned speed/current regulators to handle heavy shock loads.
* **Outcome:** Stabilized shredder line throughput, eliminated nuisance line stalls, and balanced current draw across paired DC motors.

### 3. Deterministic Fiber-Optic OLM Overhaul & DCS PM
* **Facility / Client:** Alsip Mini Mill (Alsip, IL)
* **Domain:** Paper & Packaging Manufacturing
* **Objective:** Prevent recurring line dropouts caused by degraded optical signal levels across the primary mill distributed control system (DCS).
* **Execution:** Conducted preventive maintenance testing across multimode/singlemode fiber segments, identified optical signal budget degradation, and replaced faulty Siemens Optical Link Modules (OLMs). Re-balanced optical rings to ensure deterministic failover.
* **Outcome:** Eliminated packet drops and line-halting network faults across continuous papermaking machinery.

### 4. Parker SSD AC890 Multi-Drive Line Reconfiguration
* **Facility / Client:** Volflex (Line 2)
* **Domain:** Web Handling & Converting
* **Objective:** Bypass abandoned/redundant Parker Hannifin AC890 drives while maintaining continuous speed matching and emergency stop integrity across the operational line sections.
* **Execution:** Rerouted drive control interlocks, remapped master line speed references, and updated internal link logic to decommission legacy drive hardware cleanly without disrupting active sections.
* **Outcome:** Reduced system bus overhead, eliminated false fault codes from inactive drives, and streamlined troubleshooting for plant maintenance staff.

### 5. High-Speed Slitting Line Encoder Drift & Safety Interlock Correction
* **Facility / Client:** Coilplus (IL)
* **Domain:** Steel Slitting & Processing
* **Objective:** Resolve position tracking drift on a Fagor cut-to-length/slitting line and correct a critical race condition affecting the entry horn alert.
* **Execution:** Isolated encoder drift to mechanical coupling backlash and electrical noise on the high-speed counter input; corrected Rockwell ladder logic race conditions that prevented deterministic sounder activation before line movement.
* **Outcome:** Restored cut length tolerances to factory specification and verified OSHA-compliant audible safety warnings prior to line startup.

### 6. Legacy CPU Modernization & Plant-Wide PLC Maintenance
* **Scope:** Multi-Site / Critical Infrastructure
* **Domain:** Industrial Manufacturing & Material Handling
* **Objective:** Upgrade aging control backplanes and maintain legacy automation platforms where original vendor hardware is end-of-life.
* **Execution:** Migrated Allen-Bradley SLC 5/01 CPUs to SLC 5/04 via DH-485 / DH+ network adaptation; serviced legacy Siemens S5 systems using PLC Workshop S5; tuned Siemens DC drives and resolved line-voltage fuse blowouts.
* **Outcome:** Extended legacy machine service lives without requiring multi-week full-line rip-and-replace shutdowns.

---

## Technical Stack & Hardware Matrix

| Category | Platforms & Hardware Supported |
| :--- | :--- |
| **Programmable Logic Controllers** | Siemens S7-1500, S7-1200, S7-300, S5; Rockwell ControlLogix, CompactLogix, SLC 5/00 series, MicroLogix; AutomationDirect |
| **Drives & Motion Control** | Siemens SINAMICS S120, Siemens DC Drives; ABB DCS800; Parker SSD AC890; Allen-Bradley PowerFlex (700/755), SMC-Flex Soft Starters |
| **SCADA / HMI Platforms** | AVEVA / Wonderware InTouch, FactoryTalk View Studio (ME/SE), Siemens WinCC Unified, TIA Portal HMI |
| **Industrial Networking** | PROFIBUS DP, PROFINET, SINAMICS Link (CBE20), Ethernet/IP, ProSoft RLX2 Wireless, Modbus RTU/TCP, RS-232/485 ASCII |
| **Field Diagnostic Tools** | Oscilloscopes, Fiber Optic Power Meters, Insulation Resistance Testers (Megger), Wireshark Network Analyzers |
| **Engineering Environments** | Siemens TIA Portal, Step 7, Rockwell Studio 5000, RSLogix 500/5000, PLC Workshop S5, FactoryIO, DriveExecutive |

---

## Industry Verticals Served

* **Metals & Coil Processing:** Cut-to-length lines, slitters, recoiler/uncoiler tension control, rolling mills.
* **Pulp, Paper & Packaging:** Continuous processing lines, optical DCS network distribution, winder speed regulation.
* **Recycling & Heavy Material Handling:** Scrap metal shredders, heavy-duty pinch rolls, concrete/silo batching systems.
* **Discrete & Batch Manufacturing:** Conveyor distribution, automated weighing/scale parsing, process safety sequencing.

---

**Skills:**

- Industrial Automation & Commissioning
- Variable Frequency Drives (VFD) & DC Drive Systems
- Closed-Loop Vector Control & Motor Tuning
- PLC Programming & Logic Modernization (Rockwell Studio 5000, Siemens TIA Portal, Siemens S5)
- Legacy CPU & Control System Migrations (SLC 500, Simatic S5)
- SCADA & HMI Development (AVEVA InTouch, FactoryTalk View ME/SE, WinCC Unified)
- Industrial Communications (PROFIBUS DP, PROFINET, SINAMICS Link CBE20, Ethernet/IP, Modbus)
- Deterministic Fiber-Optic Networking & Siemens Optical Link Modules (OLM)
- Industrial Wireless & Remote Telemetry (ProSoft RLX2, Stridelinx VPN)
- Emergency Field Diagnostics & Root Cause Analysis (Oscilloscopes, Megger, Wireshark)
- Electrical Schematic Design & Control Panel Retrofits
- Multi-Drive Synchronization & Load Sharing

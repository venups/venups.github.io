---
title: A decade of engineering automation
kind: software
order: 3
summary: The tools that came before Steel Bridge Pal. More than ten years of removing repetitive work from structural engineering, one project at a time.
role: Developer
client: Tata Consulting Engineers · Modjeski and Masters · GFT
period: 2014 – present
figure: code
cover: ""
tags: [Python, C#, Excel VBA, OpenSTAAD, SAP2000 API, CSiBridge]
related: [steel-bridge-pal, us-20-fox-river, tobin-land-bridge]
metrics:
  - value: ">80%"
    label: less manual wind-load input on Fox River
  - value: "2014"
    label: first engineering web tools, in C# and ASP.NET
---

## The pattern

When a calculation has to be done the same way a third time, I write the tool. That has been true in every role since my first one, and it is the thread that connects the bridge work to the software work.

The tools below are in order from the newest to the oldest. The languages change. The method does not: let the analysis software be driven by code, and spend the engineer's time on judging the results.

## At GFT

**Wind-load automation for CSiBridge.** The [US 20 over Fox River](/work/us-20-fox-river) models needed a large number of user-defined wind loads. I automated their input and cut the manual time by more than 80%.

**Connection design from STAAD.Pro.** For the River Street Bridge over Amtrak in Boston, an OpenSTAAD and Excel VBA process extracts forces from multiple STAAD.Pro bridge models and produces automated connection designs and calculation reports. I later presented the workflow to the bridge group as a quality-improvement session.

**Shop-drawing review tool.** An Excel tool for mast arm shop drawings that processes numerous measurements and streamlines checks of bolt spacing, edge distances and related geometry.

## At Modjeski and Masters

**Erection analysis pipeline.** Excel VBA macros integrated with SAP2000 to model, load and check the curved arch girders of the [Robert L.B. Tobin Land Bridge](/work/tobin-land-bridge) for strength and stability through its construction sequence.

## At Tata Consulting Engineers

**Web-based design programs.** Customized programs in C# and ASP.NET that automated calculations such as staircase and retaining wall design. I led and mentored a team of five young engineers on the effort.

**Documentation from analysis output.** OpenSTAAD and Excel VBA to turn STAAD.Pro output into project documentation.

## Before that

As an undergraduate I wrote a program that automated the limit-state design of reinforced concrete footings, and modeled the dynamic response of adjacent buildings in MATLAB during a summer of research at the Indian Institute of Science. The habit is older than the career.

## What it shows

None of these started as a software project. Each started as a deadline. The habit of turning a one-off fix into something reusable is what later became [Steel Bridge Pal](/work/steel-bridge-pal) and the [GFT Transportation suite](/work/gft-transportation-suite).

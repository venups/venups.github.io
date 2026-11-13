---
title: Robert L.B. Tobin Land Bridge
kind: bridge
order: 9
featured: true
summary: Erection and construction-sequence analysis for what was the largest wildlife crossing in the United States when it opened, a signature structure of sixteen deep, curved arch girders.
role: Finite element analyst, erection and construction sequence
firm: Modjeski and Masters
period: 2021 – 2023
location: San Antonio, Texas
figure: land-bridge
cover: ""
tags: [Erection analysis, Stability, SAP2000, Excel VBA, Signature bridge]
metrics:
  - value: "150 ft × 150 ft"
    label: long and wide
  - value: "16"
    label: deep, curved arch girders
links:
  - label: About the land bridge
    url: https://www.philhardbergerpark.org/parknews/land-bridge-progress/
---

## The bridge

The Robert L.B. Tobin Land Bridge carries people and wildlife over a parkway in San Antonio. It is 150 ft long and 150 ft wide, formed by sixteen deep, curved arch girders that give the structure a saddle, or "pringle", shape.

## The question

A bridge is weakest while it is being built. Each curved girder has to be stable when it stands alone, when it is braced to its neighbor, and at every step until the system is complete.

## What I did

I performed the finite element erection and construction-sequence analysis. To do it efficiently I integrated Excel VBA macros with SAP2000, so the model could be generated, loaded and checked for strength and stability stage by stage instead of being rebuilt by hand for each one.

## What it shows

This is an early example of the same approach as my later tools: drive the analysis software with code, so that the engineer's time goes into judging results.

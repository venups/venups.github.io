---
title: Robert L.B. Tobin Land Bridge
kind: bridge
order: 9
featured: true
summary: Erection and construction-sequence analysis for what was the largest wildlife crossing in the United States when it opened, a signature structure of sixteen deep, curved arch girders.
role: Finite element analyst, erection and construction sequence
firm: Modjeski and Masters
period: 2019 – 2020
location: San Antonio, Texas
figure: land-bridge
cover: ""
tags: [Erection analysis, Stability, SAP2000, Excel VBA, Signature bridge]
related: [engineering-automation, us-20-fox-river]
metrics:
  - value: "16"
    label: deep, curved arch girders
  - value: "150 ft"
    label: wide, carrying people and wildlife
links:
  - label: Phil Hardberger Park Conservancy, girder erection (April 2020)
    url: https://www.philhardbergerpark.org/parknews/land-bridge-progress/
---

## The bridge

The Robert L.B. Tobin Land Bridge carries people and wildlife over Wurzbach Parkway, joining the two halves of Phil Hardberger Park in San Antonio. It is 150 ft wide and is formed by sixteen deep, curved arch girders that give the structure a saddle, or "pringle", shape. It opened in December 2020.

## The question

A bridge is weakest while it is being built. In the finished structure the girders brace one another and the deck ties them together. During erection none of that exists yet. Each curved girder has to be stable when it stands alone, when it is braced to its neighbor, and at every step until the system is complete.

The girders were set over the parkway on weekend nights, a few at a time, so each partial stage also had to be safe to leave standing.

## What I did

I performed the finite element erection and construction-sequence analysis. Every stage is a separate structure with its own supports, bracing and loads, which means many models that differ only slightly from one another.

To do it efficiently I integrated Excel VBA macros with SAP2000, so the model could be generated, loaded and checked for strength and stability stage by stage instead of being rebuilt by hand for each one.

## What it shows

This is an early example of the same approach as my later tools: drive the analysis software with code, so that the engineer's time goes into judging results. The line from here to [Steel Bridge Pal](/work/steel-bridge-pal) is direct, and the rest of it is in [A decade of engineering automation](/work/engineering-automation).

---
title: US 20 over Fox River
kind: bridge
order: 4
featured: true
summary: Twin three-span curved steel girder bridges built in stages. I led the construction-stage finite element modeling that the design depended on.
role: Primary CSiBridge technical lead, analysis task lead, designer and checker
client: Designed to Illinois DOT standards
firm: GFT (formerly Gannett Fleming)
period: 2024 – 2026
location: Illinois
figure: curved-girder
cover: ""
tags: [Curved steel girders, Staged construction, CSiBridge, Cross frames, IDOT]
related: [steel-bridge-pal, engineering-automation, newark-bay-hudson-county-extension]
metrics:
  - value: "3 spans"
    label: curved steel girders, westbound and eastbound
  - value: ">80%"
    label: wind-load input time removed by automation
---

## The project

Westbound and eastbound bridges carry US 20 over the Fox River. Each is a three-span curved steel girder bridge designed for staged construction to IDOT standards, replacing an existing five-span structure.

## Why it is hard

Curved girders built in stages do not behave like a finished bridge.

- **Curvature couples the girders.** A curved girder twists under its own weight. The cross frames carry real force to hold it, so they are designed as primary members.
- **Staging changes the structure.** The bridge is built part by part. Each stage is a different structure, with its own forces, deflections and stability.
- **The order of work matters.** The result depends on which girder went up first and which part of the deck was poured first. One analysis of the finished bridge cannot give the answer.

So the analysis has to follow the construction sequence, step by step, and the model has to be kept current as the design changes.

## My role

I was the primary CSiBridge technical lead and analysis task lead, and I also designed and checked.

- Built, revised and maintained the construction-stage CSiBridge models through multiple formal revisions and design updates.
- Performed the staged-construction analysis: girder forces, deflections, erection behavior, shoring effects and sequence-dependent responses, in support of plan development and constructability decisions.
- Developed and checked the interior and end cross-frame designs and calculation packages.
- Checked pier design calculations, drilled-shaft group loads, abutment and wingwall designs, and substructure forces for the final pier package.
- Kept status summaries, model update logs, methodology references and lessons learned as a primary technical point of contact for the design team.

## Where the software came in

The models needed numerous user-defined wind loads. Entering them by hand was slow and easy to get wrong, so I automated the input and cut the manual time by more than 80%. The same idea, applied to the whole model, became [Steel Bridge Pal](/work/steel-bridge-pal).

## What it shows

A model that many people rely on needs the same care as software that many people rely on: controlled revisions, a log of what changed and why, and a written method somebody else can follow. I ran this one that way.

---
title: WMATA Georgia Avenue Bridge load rating
kind: bridge
order: 8
summary: Load rating of an atypical, heavily skewed through-girder railway bridge carrying two tracks, using a refined finite element model.
role: Load-rating and modeling engineer
client: Washington Metropolitan Area Transit Authority
firm: GFT (formerly Gannett Fleming)
period: 2023
location: Washington, D.C. area
figure: through-girder
cover: ""
tags: [Load rating, Railway bridge, AREMA, STAAD.Pro, Finite element model]
related: [interstate-bridge-jacking, us-20-fox-river]
metrics:
  - value: "2"
    label: tracks on a heavily skewed simple span
---

## The bridge

The Georgia Avenue Outbound Bridge is a simple-span floorbeam through-girder railway bridge. In a through-girder bridge the trains run between two deep girders, on floorbeams that span from one girder to the other.

## Why a simple method was not enough

A load rating answers one question: how much load can this bridge safely carry in the condition it is in today? For a regular bridge, each girder can be rated on its own with a line-girder calculation.

This bridge is heavily skewed and carries two tracks. With a heavy skew the floorbeams do not meet the girders squarely, and the two girders do not share the load the way the simple method assumes. Rating it that way would mean guessing at the load path.

## What I did

I built a refined STAAD.Pro finite element model of the structure, so that the load path was calculated instead of assumed, and load rated the bridge to AREMA standards. I used the inspection reports for the as-found condition and followed WMATA's submission requirements.

## What it shows

When a structure does not fit the textbook method, the answer is a better model, checked carefully. This was my first railway rating to AREMA. I learned the standard on the project and delivered to it.

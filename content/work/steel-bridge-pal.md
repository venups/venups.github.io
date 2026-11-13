---
title: Steel Bridge Pal
kind: software
order: 1
featured: true
summary: An application that reads the bridge information model and builds the validated analysis model, so engineers stop rebuilding by hand what the design model already knows.
role: Creator, product owner and architect
client: GFT · first used on the Newark Bay–Hudson County Extension
period: 2025 – 2026
status: In service
figure: pipeline
cover: ""
tags: [OpenBridge, CSiBridge, Automation, AI-assisted workflow, Validation]
metrics:
  - value: "≈200 h"
    label: saved per CSiBridge model
  - value: "≈2,000 h"
    label: across ten bridges on one program
  - value: "2026"
    label: GFT Technology Innovation Award
  - value: "IBC 26-23"
    label: paper at the International Bridge Conference
---

## The problem

Every steel bridge is modeled at least twice. The design team builds it once in OpenBridge, with the alignment, girder layout, cross frames, plate sizes and deck. Then an analyst reads that model and builds it again, member by member, in CSiBridge for finite element analysis.

The second build is slow, and it is where errors come in: a transposed plate thickness, a unit slip, a cross frame in the wrong bay. On a program with ten bridges the same expert work repeats ten times, and every design revision starts it again.

## What I built

Steel Bridge Pal extracts the OpenBridge information reports and generates a standardized CSiBridge model from them. The engineer no longer transcribes geometry. The engineer reviews a model that already matches the design.

1. **Extract.** The OpenBridge information reports are read as the single source of bridge data.
2. **Standardize.** Units, naming and model definitions are normalized so every model on the program is set up the same way.
3. **Generate.** The CSiBridge model is produced from that data instead of being rebuilt manually.
4. **Validate.** Technical validation checks compare what was built against what was specified before anyone relies on it.
5. **Review.** The responsible engineer checks and accepts the model. The judgment and the sign-off stay with a licensed person.

## Why it is built this way

Speed was the easy part. The design decision that matters is the fourth step. A tool that builds a model quickly and wrongly is worse than no tool, because people stop looking. So validation is part of the pipeline, not an afterthought, and the output is a model plus the evidence that it matches its source.

The second decision is standardization. Ten analysts build ten slightly different models. One generator builds one kind, which makes checking, comparing and training far easier.

## Results

On the Newark Bay–Hudson County Extension, the workflow saves an estimated 200 hours per CSiBridge model, or about 2,000 hours across ten bridges. It won GFT's 2026 Technology Innovation Award, and the approach was presented at the 2026 International Bridge Conference as *AI-Assisted Bridge Design Automation and Building Intelligent Data* (IBC 26-23) and at the ASHE National Conference.

## What it shows

I found the problem on a live project, built the tool, proved it against real models, and then took it through product ownership and rollout. That is the same path any internal product takes, and I have walked all of it.

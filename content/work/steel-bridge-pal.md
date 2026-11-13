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
related: [newark-bay-hudson-county-extension, gft-transportation-suite, us-20-fox-river]
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

The second build is slow, and it is where errors come in: a transposed plate thickness, a unit slip, a cross frame in the wrong bay. None of these stops the analysis from running. The model still solves and still prints results, and the mistake travels with them.

On a program with ten bridges the same expert work repeats ten times, and every design revision starts it again. I was the finite element modeling lead on exactly that program, the [Newark Bay–Hudson County Extension](/work/newark-bay-hudson-county-extension), which is how I came to own the problem.

## What I built

Steel Bridge Pal extracts the OpenBridge information reports and generates a standardized CSiBridge model from them. The engineer no longer transcribes geometry. The engineer reviews a model that already matches the design.

1. **Extract.** The OpenBridge information reports are read as the single source of bridge data.
2. **Standardize.** Units, naming and model definitions are normalized so every model on the program is set up the same way.
3. **Generate.** The CSiBridge model is produced from that data instead of being rebuilt manually.
4. **Validate.** Technical validation checks compare what was built against what was specified before anyone relies on it.
5. **Review.** The responsible engineer checks and accepts the model. The judgment and the sign-off stay with a licensed person.

## Why it is built this way

Speed was the easy part. Three decisions matter more.

**Validation is a step in the pipeline, not a favor done afterward.** A tool that builds a model quickly and wrongly is worse than no tool, because people stop looking. So the output is a model plus the evidence that it matches its source.

**One generator, one kind of model.** Ten analysts build ten slightly different models. One generator builds one kind, which makes checking, comparing and training far easier. A reviewer who has understood one model has understood all ten.

**The design model stays the single source of truth.** When the design changes, the analysis model can be generated again from the new reports, so nobody has to remember which edits were made by hand.

## Results

On the Newark Bay–Hudson County Extension, the workflow saves an estimated 200 hours per CSiBridge model, or about 2,000 hours across ten bridges.

- **Recognition.** Winner of GFT's 2026 Technology Innovation Award.
- **Published.** Presented at the 2026 International Bridge Conference as *AI-Assisted Bridge Design Automation and Building Intelligent Data* (paper IBC 26-23), and at the ASHE National Conference.
- **Adopted.** It now sits within the [GFT Transportation application suite](/work/gft-transportation-suite), where I remain its product owner and architect.

## Where the idea came from

The first version of this idea was much smaller. On [US 20 over Fox River](/work/us-20-fox-river) I automated the input of user-defined wind loads into CSiBridge and cut the manual time by more than 80%. Steel Bridge Pal applies the same thinking to the whole model.

## What it shows

I found the problem on a live project, built the tool, proved it against real models, and then took it through product ownership and rollout. That is the same path any internal product takes, and I have walked all of it.

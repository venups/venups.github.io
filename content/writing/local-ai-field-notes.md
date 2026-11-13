---
title: "Running AI on your own machine: field notes from a bridge engineer"
date: 2026-11-12
summary: What I have learned about local language models. Memory is the budget, quantization is the trade, tokens per second is the measure, and the price of a token depends mostly on how often the machine is working.
tags: [Local AI, LLMs, Hardware, Cost]
figure: chart
cover: ""
---

Engineering firms hold drawings, calculations and inspection reports that belong to their clients. Before any of that goes to a hosted AI service, somebody has to ask where it goes and who keeps it. A model that runs on a machine you control makes that question disappear. That is the first reason local AI matters in my field.

There is a second reason. Running a model yourself is the fastest way to understand what it is: a large file of numbers, a memory budget, and a speed you can measure with a stopwatch. These are my notes so far, written the way I would brief another engineer.

## 1. A model is a file, and memory is the budget

A language model is a set of weights. The first question is whether those weights fit in memory, and the arithmetic is simple:

> memory for weights ≈ number of parameters × bits per weight ÷ 8

A model with 8 billion parameters stored at 16 bits per weight needs about 16 GB. The same model at 4 bits needs about 4 GB. On top of the weights you need room for the context you feed it and some working overhead, so leave a margin.

Which memory counts depends on the machine. On a PC with a graphics card it is the card's own memory (VRAM). If the model spills past it into ordinary system memory, it still runs, but far more slowly. On Apple silicon the processor and graphics share one pool of unified memory, so most of the machine's RAM is available to the model. That is why a laptop can run models that would need an expensive graphics card elsewhere.

**The lesson:** read the memory figure before the benchmark. If it does not fit, nothing else matters.

## 2. Quantization is the trade that makes it possible

Quantization stores each weight with fewer bits. It is lossy compression, and it works better than intuition suggests. Going from 16 bits to around 4 cuts memory by roughly four times for a modest loss in quality. Below 4 bits the quality drops off faster.

Two rules of thumb are worth carrying:

- For the same memory, a larger model at 4-bit usually beats a smaller model at 8-bit.
- Start at a 4-bit variant. Go up only if you can measure the difference on your own task.

This will sound familiar to a structural engineer. It is mesh refinement. You choose the coarsest model that still gives the right answer, and you prove it with a convergence check, not a hunch.

## 3. Speed is measured in tokens per second, and there are two speeds

A token is roughly three-quarters of an English word. Two numbers describe how a local model feels:

- **Prompt processing.** How fast the model reads what you give it. This sets the wait before the first word appears, and it grows with the length of your input.
- **Generation.** How fast it writes. Around 10 tokens per second is readable but slow. Thirty or more feels immediate.

Generation speed is limited mostly by how fast the machine can move the weights through memory, since every new token touches essentially all of them. So a model half the size is roughly twice as fast on the same hardware. Memory capacity decides what you can run. Memory bandwidth decides how fast it runs.

## 4. Context is not free

The context window is how much text the model can consider at once: your instructions, the document, and its own answer. Longer context costs memory, because the model keeps a running cache for every token in the window, and it costs time, because all of it has to be processed.

One trap is worth knowing. Some local runtimes ship with a small default context window and quietly truncate anything longer. The model then answers confidently about a document it only half read. Check the context setting before you trust a summary of a long file.

## 5. The tools are simpler than they look

The ecosystem looks crowded. It is a few layers:

- **llama.cpp** is the engine underneath much of local AI. Its model format is GGUF, a single file that holds the quantized weights.
- **Ollama** wraps that engine in a simple command line and a local server. It is the quickest way to get from nothing to a running model.
- **LM Studio** is a desktop application that does the same job with a graphical interface, useful for comparing models side by side.
- **MLX** is Apple's framework for machine learning on Apple silicon, with its own model format tuned for that hardware.

The most useful fact is that these tools can serve the model over the same kind of web interface the hosted services use. Code written against a hosted model can be pointed at your own machine by changing one address. You can prototype locally, compare with a hosted model, and move in either direction without rewriting anything.

## 6. Know what local models are for

Small local models are good at bounded work: pulling fields out of a document, classifying, summarizing, rewriting, answering questions over a set of files you supply, and producing structured output that a program can read.

They are weaker at long chains of reasoning, at using tools reliably over many steps, and at anything that needs a very large context. The large hosted models are still better at those, and it would be dishonest to pretend otherwise.

So I do not ask whether local is better than hosted. I ask which jobs each one should do. Private documents and repetitive extraction go local. Hard reasoning goes to the strongest model that the data is allowed to reach.

## 7. The price of a token is mostly about utilization

"Local is free" is wrong, and "local is cheaper" is only sometimes right. The cost of a local token has two parts:

> cost per day = hardware price ÷ useful life in days + power draw × hours running × electricity price
>
> cost per million tokens = cost per day ÷ tokens generated per day × 1,000,000

Electricity is usually the small term. The hardware is the large one, and it is a fixed cost, so the price of each token depends almost entirely on how many tokens you actually generate. A machine that works one hour a day produces expensive tokens. The same machine working all day produces cheap ones.

Try it. Every assumption below is an input. The defaults are illustrative, so replace them with your own measurements.

[[widget:token-calculator]]

This is the same reasoning as any equipment decision on a construction site. A crane you own is cheap per lift only if it is lifting.

## 8. Measure on your own work

Public leaderboards tell you how a model does on someone else's questions. The only test that matters is yours. Build a small set of real examples with answers you already know, and run it the same way against every model you are considering. Twenty to fifty examples is enough to see a clear difference.

That is the habit I trust most, because it is the one I brought with me. In bridge work you do not cite a load table you have not checked. The same goes for a benchmark.

## 9. The engineer still signs

A local model is private and convenient. It is not automatically correct. Everything I build with AI keeps the same rule as [Steel Bridge Pal](/work/steel-bridge-pal): the system does the repetitive work and shows its evidence, and a person who is accountable checks the result.

## The short version

- Check that the model fits in memory before anything else.
- Start with a 4-bit quantized model and go up only on evidence.
- Measure both speeds: time to the first word, and tokens per second after it.
- Set the context window on purpose. Do not trust the default.
- Use local models for private, bounded work, and hosted models for the hardest reasoning.
- Price your tokens with your own utilization, not someone else's.
- Test on your own examples, and keep a person accountable for the result.

If you are working on the same questions, I would like to compare notes.

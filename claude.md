# Project Constitution

## Behavioral Rules
1. **Data-First**: Define JSON Schema (Input/Output) in `gemini.md` before coding tools. Coding only begins once the payload shape is confirmed.
2. **Self-Annealing**: Analyze stack traces, patch scripts in `tools/`, test, and update `architecture/` markdown to prevent error repetition.
3. **Execution Locks**: Halt Execution; no writing scripts in `tools/` until Discovery Questions are answered, Data Schema is defined, and `task_plan.md` has an approved Blueprint.
4. **Scope Control**: strictly inside `c:\desarrollo unab\solemne_desarrollo`.
5. **Active Monitoring (PLAN.md)**: Every time code is written/modified/tested, silently review `PLAN.md`. Automatically change `[ ]` to `[x]` if functionally solved. End chat responses with `✅ Tarea actualizada en PLAN.md: [Nombre de la tarea]`.

## Architectural Invariants
Operate in a 3-Layer Architecture:
1. **Layer 1: Architecture (`architecture/`)**: Technical SOPs in Markdown. Change SOPs before changing logic code.
2. **Layer 2: Navigation**: Reasoning and routing logic layer. Decides tool execution order.
3. **Layer 3: Tools (`tools/`)**: Deterministic python scripts. Environment vars in `.env`. Intermediate files in `.tmp/`.

## Data Schemas Reference
See `gemini.md` for schemas and system rules.

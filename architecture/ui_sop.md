# Web App / UI SOP

## Goal
Provide an interactive dashboard for the user to configure their RPM, view Pain Points, read Business Proposals, and track MVT.

## Strategy
- Implement a front-end framework.
- Interface with Supabase directly for reading `BusinessProposal` and `MVTEvidence` tables.
- Render dynamic components for the RPM wizard.

## Invariants
- The UI is purely for presentation and triggering state changes (like updating RPM).
- Heavy LLM generation should be requested asynchronously, not block the client UI.

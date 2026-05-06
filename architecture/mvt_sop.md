# MVT Tracking SOP

## Goal
Track and validate the real-world Minimum Viable Test without fabricating evidence.

## Strategy
- Maintain a database table `MVTEvidence` linked to `BusinessProposal`.
- Steps 1 to 5 of the MVT require real inputs (URLs to screenshots, logs).
- The web UI will have forms to submit this evidence payload.

## Invariants
- DO NOT generate mock MVT data under any circumstance. All data must come from real user input.

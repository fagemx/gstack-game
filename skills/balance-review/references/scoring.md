# Balance Review — Scoring Rubrics

All scoring uses explicit formulas. Never use AI intuition for scores.

## Section 1: Difficulty Curve

```
Flow channel adherence:    _/3  (3=clear sawtooth, 2=mostly good, 1=flat/escalating, 0=chaotic)
Spike frequency:           _/2  (2=smooth, 1=1-3 spikes, 0=>3 spikes)
Recovery mechanics:        _/3  (3=adaptive+informative, 2=basic recovery, 1=checkpoint only, 0=harsh)
Difficulty variety:        _/2  (2=multiple challenge types, 1=single dimension, 0=pure stat check)
───────────────────────────
DIFFICULTY CURVE SCORE:    _/10
```

## Section 2: Economy Model

```
Sink/Faucet balance:         _/3  (3=ratio 0.9-1.1, 2=ratio 0.8-1.2, 1=outside range, 0=no sinks)
Inflation control:           _/2  (2=stable projection, 1=mild inflation, 0=runaway)
Currency clarity:            _/2  (2=1-2 currencies, 1=3 currencies, 0=4+)
Wealth distribution health:  _/3  (3=within target Gini, 2=slightly outside, 1=far outside, 0=no data + no plan)
───────────────────────────
ECONOMY MODEL SCORE:         _/10
```

## Section 3: Progression Pacing

```
Milestone pacing:            _/3  (3=all milestones within range, 2=1-2 off, 1=3+ off, 0=no milestone planning)
Grind ratio health:          _/2  (2=ratio>0.3 throughout, 1=ratio drops below 0.3, 0=ratio<0.2 for extended periods)
Content runway:              _/2  (2=sufficient+planned, 1=short but acknowledged, 0=no runway planning)
Reward schedule design:      _/3  (3=intentional+appropriate+documented, 2=mostly intentional, 1=ad-hoc, 0=no design)
───────────────────────────
PROGRESSION PACING SCORE:    _/10
```

## Section 4: Monetization Pressure

```
Free player viability:       _/3  (3=full game free, 2=core free, 1=limited free, 0=paywall in core loop)
Paywall timing:              _/2  (2=post-hook offers, 1=mixed, 0=premature asks)
P2W perception:              _/3  (3=cosmetic only, 2=convenience, 1=advantage, 0=required to compete)
Spending tier fairness:      _/2  (2=diminishing returns, 1=linear value, 0=whale dominance)
───────────────────────────
MONETIZATION PRESSURE SCORE: _/10
```

## Section 5: Character Balance

```
Framework consistency:       _/3  (3=clear+consistent, 2=mostly consistent, 1=mixed frameworks, 0=no framework)
Win rate distribution:       _/3  (3=<10% range, 2=10-15% range, 1=>15% range, 0=no data+no plan)
Counter system health:       _/2  (2=all checks pass, 1=1-2 fail, 0=3+ fail)
Power creep resistance:      _/2  (2=planned rotation/scaling, 1=acknowledged, 0=no plan)
───────────────────────────
CHARACTER BALANCE SCORE:     _/10
```

## Weighted Total

```
  Difficulty Curve:        _/10  (weight: 25%)
  Economy Model:           _/10  (weight: 25%)
  Progression Pacing:      _/10  (weight: 20%)
  Monetization Pressure:   _/10  (weight: 20%)  [N/A if Mode B]
  Character Balance:       _/10  (weight: 10%)  [N/A if no PvP/character selection]
  ──────────────────────────────────────────────
  WEIGHTED TOTAL:          _/10

  For N/A sections, redistribute weight equally among active sections.
```

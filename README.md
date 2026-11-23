# BOQ Subcontractor Bid Leveling Matrix: Construction Bid Comparison & Tender Evaluation Tool (Web + Excel)

<p align="center">
  <strong>Compare Subcontractor Quotes Apples-to-Apples: Detect Missing BOQ Scope, Unbalanced Unit Rates, and Hidden Award Risks Before Contracting.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="Apache License 2.0">
  <img src="https://img.shields.io/badge/Platform-Free%20Web%20Tool%20%7C%20Offline%20Excel%20Template-217346.svg" alt="Free Browser Bid Leveling Tool and Paid Offline Excel Template">
  <img src="https://img.shields.io/badge/Use%20Case-Construction%20Bid%20Tabulation%20%26%20BOQ%20Evaluation-2251FF.svg" alt="Construction Bid Tabulation and BOQ Tender Evaluation">
</p>

**A ready-to-use BOQ subcontractor bid leveling matrix and construction bid tabulation tool built for beginners, estimators, quantity surveyors, and general contractors.** Compare competing subcontractor quotations on a like-for-like basis, normalize omitted Bill of Quantities (BOQ) line items with automated plug rate adjustments, flag unbalanced or front-loaded unit rates against your internal cost estimate, and identify pre-award commercial risks before signing a subcontract.

Open the **free browser-based bid leveling tool** right away with zero signup to test your numbers. When you need permanent tender records and a repeatable workflow for ongoing projects, move to the **paid offline Excel bid leveling template (.xlsx)**, sold as a one-time purchase with a **30-day, no-questions-asked money-back guarantee**.

> **Start evaluating subcontractor quotes now:**
>
> - [🌐 Launch Free Interactive BOQ Bid Leveling Web Tool (Instant Browser Demo, Zero Signup)](YOUR_HTML_DEMO_URL)
> - [📥 Get the Reusable Subcontractor Bid Leveling Excel Template (.xlsx, Pre-Built Formulas & Dashboard, 30-Day Refund Guarantee)](https://theseusworkshop.com/l/ticni)

---

## Questions, Feedback & Product Updates

This bid leveling tool is designed around practical subcontractor quote comparison, BOQ scope normalization, unit-rate review, and pre-award commercial evaluation. Feedback from estimators, quantity surveyors, procurement teams, and commercial managers helps improve the clarity and reliability of the evaluation workflow.

- **Questions & workflow fit:** [Ask about BOQ inputs, bidder quote mapping, omitted-scope adjustments, normalized totals, unbalanced unit rates, budget variance, or clarification lists](https://github.com/HyVoid/business-decision-toolbox/discussions/categories/questions).
- **Ideas & improvements:** [Suggest additional tender scenarios, evaluation checks, normalization methods, procurement controls, or reporting outputs](https://github.com/HyVoid/business-decision-toolbox/discussions/categories/ideas).
- **Report a technical problem:** [Open the construction bid leveling issue form](https://github.com/HyVoid/construction-bid-leveling-excel-template/issues/new?template=bug-report.yml).
- **Product updates:** [Follow maintenance and improvement notes](https://github.com/HyVoid/business-decision-toolbox/discussions/categories/product-updates).

When describing a problem, identify the affected BOQ item or worksheet, bidder column, input assumption, benchmark threshold, and expected versus actual result. Use synthetic BOQ lines and illustrative rates. Do not upload live tender documents, subcontractor quotations, confidential unit rates, internal cost estimates, client or bidder identities, drawings, contract documents, credentials, or other commercially sensitive project information. GitHub Issues and Discussions are public; use fictional or properly anonymized examples only.

## What This Construction Bid Leveling Template Tracks (Pain Point to Solution)

The lowest submitted subcontractor price rarely equals the lowest final construction cost. This bid leveling sheet maps common tender review blind spots directly to automated commercial checks:

| Subcontractor Bid Evaluation Pain Point | What This BOQ Bid Leveling Tool Automates | Commercial Decision Outcome |
|---|---|---|
| **Apples-to-Apples Bid Total Distortion** | Recalculates **normalized bid totals** after adjusting every competing quote for missing BOQ line items. | See the true subcontractor ranking before issuing a Letter of Intent or subcontract award. |
| **Hidden Missing Scope & Exclusions** | Detects blank or zero-priced lines (such as waterproofing, scaffolding, or temporary facilities) and applies automated **plug rate adjustments**. | Quantify exact dollar exposure from **scope gaps** before they turn into post-award change orders. |
| **Unbalanced & Front-Loaded Unit Rates** | Benchmarks each subcontractor's line-item unit rate against your **internal cost estimate** using a configurable deviation threshold. | Catch inflated rates on variation-prone trades before quantity growth blows up your budget. |
| **Project Budget Deviation & Overrun Risk** | Compares every normalized subcontractor total against your **internal benchmark budget** and tolerance limit. | Separate "cheapest bidder in the room" from "financially viable within project budget." |
| **Slow Manual Tender Clarification** | Consolidates all omitted items and abnormal unit-rate flags into an itemized **pre-award clarification (RFI) list**. | Enter commercial negotiations with a prioritized question list in minutes instead of hours. |
| **Misleading Award Risk Signals** | Places raw bid totals, normalized totals, omission counts, and pricing warnings side by side on one **bid leveling dashboard**. | Distinguish a genuinely competitive quote from a low-ball bid carrying material commercial risk. |

---

## When You Need a Subcontractor Bid Comparison Sheet (Real-World Tender Scenarios)

If you are looking for a fast, beginner-friendly **construction bid tab template** to solve an immediate procurement bottleneck, this matrix fits these common situations:

- **Tight Tender Deadlines with Messy Quotes:** You just received three competing subcontractor quotations against your tender BOQ, and you need a defensible **bid tabulation summary** for a client, owner, or senior manager before the end of the day.
- **Suspiciously Low Subcontractor Bids:** One trade contractor came in 12% cheaper than everyone else, and you need to verify whether they actually found cost efficiencies or simply left out required scope items.
- **First-Time Subcontract Buyout Without Expensive Software:** You are a small general contractor, home builder, or junior estimator handling subcontract procurement without paying $300+/month for enterprise construction bidding SaaS.
- **Pre-Award Commercial Negotiation & Clarification:** You need objective, item-level proof of high unit rates and missing allowances so you can issue targeted **commercial clarification questions** before contract signing.
- **Audit-Ready Procurement Records:** You need a clean, standardized **Excel bid evaluation matrix** saved locally in your project folder for internal commercial audits, lender reviews, or future cost benchmarking.

---

## Quick Start Workflow: How to Level Subcontractor Bids in 4 Steps

The workflow mirrors how real construction BOQ schedules and subcontractor quotations are structured. You do not need advanced spreadsheet skills to run a complete commercial evaluation.

### 1. Set Your Tender Rules & Evaluation Parameters

Open the `00_Global Parameters` sheet.

Set your project currency, missing-item **plug rate method**, **omission penalty rate**, **unbalanced-bid warning threshold**, and **internal budget tolerance**. Update the three bidder display names to match your actual subcontractors. Every formula across the workbook pulls from these central rules automatically.

### 2. Copy-Paste Your Tender BOQ & Subcontractor Unit Rates

Open the `01_BOQ & Raw Bid Input` sheet.

Paste your tender **Bill of Quantities (BOQ)** into the designated input columns:

- BOQ item code
- Work description
- Unit of measurement (m2, m3, LS, etc.)
- Tender quantity
- Internal benchmark unit rate (your internal cost estimate)

Next, enter the quoted unit rates from Subcontractors A, B, and C. If a bidder omitted an item, leave the cell blank or enter `0`. Never guess or type a manual replacement price inside the input area.

### 3. Review the Normalized Bid Rankings & Clarification Flags

Switch to `03_Bid Leveling Dashboard`.

All calculations refresh automatically to show:

- Original submitted bid totals and apparent rankings
- Missing-item counts and total scope plug adjustments
- **Normalized like-for-like bid totals** and revised commercial rankings
- **Unbalanced unit-rate alerts** exceeding your benchmark threshold
- Consolidated **item-level clarification list** for pre-award bidder interviews

### 4. Move From Free Browser Testing to Repeat Tender Workflows in Excel

Start with the [free browser-based BOQ bid leveling web tool](YOUR_HTML_DEMO_URL) to test the methodology on a sample quote right now. Once you see how it works, upgrade to the [paid offline Excel Bid Leveling Workbook (.xlsx)](YOUR_EXCEL_PURCHASE_OR_RELEASE_URL) for real project tenders.

**Why procurement teams switch to the offline Excel workbook after their first test:**

- **Zero Formula Maintenance (Copy-Paste Ready):** Bid normalization math and multi-criteria flagging rules are complex under the hood, yet every calculation rule and dynamic formula is already wired inside the Excel workbook. You do not even need to double-click cells to drag or copy formulas down rows. Download the workbook locally, paste your own BOQ and subcontractor quotes, and inspect the complete commercial analysis in one click.
- **1-Minute Decision Clarity During Peak Tender Season:** Even if you have zero background in building financial models, the dashboard surfaces your top award risks and clarification priorities in under 1 minute. Spend your busy tender week negotiating scope and winning work instead of building or debugging comparison spreadsheets.
- **One-Time Purchase vs. Recurring SaaS Subscriptions:** The browser demo is free for quick evaluation, while the reusable Excel workbook is a **paid one-time purchase** backed by a **30-day, no-questions-asked money-back guarantee**. It costs a fraction of recurring monthly subscriptions charged by enterprise construction procurement platforms, giving you a permanent tool you can reuse across every tender package.
- **100% Local Offline Data Privacy:** Subcontractor unit rates, internal cost estimates, and tender margins are commercially sensitive. Running this fixed workflow locally in Excel keeps confidential bid pricing off third-party cloud servers and eliminates cloud data exposure.

> **Ready to standardize your subcontract bid evaluations?**
>
> - [📥 Download the Reusable BOQ Bid Leveling Excel Workbook (.xlsx, One-Time Purchase, 30-Day Money-Back Guarantee)](https://theseusworkshop.com/l/ticni)

---

## Why Lowest Submitted Price Fails in Construction Bid Evaluation

Comparing subcontractor quotations in construction procurement breaks down when teams look only at bottom-line totals.

Several subcontractors often price the exact same tender BOQ with completely different commercial assumptions. One bidder submits a low lump-sum figure because waterproofing, temporary site facilities, or testing allowances were excluded. Another bidder includes 100% of the required scope, or hides inflated unit rates on line items expected to increase through post-award variations.

When teams rank raw submitted totals without normalizing scope and unit rates first, the incomplete quote looks like the winner.

| Bid Evaluation Metric | Subcontractor A (Incomplete Scope) | Subcontractor B (Full Scope) |
|---|---:|---:|
| Raw Submitted Quotation | $920,000 | $960,000 |
| Omitted BOQ Scope Plug Adjustment | $100,000 | $0 |
| **Normalized Like-for-Like Bid Total** | **$1,020,000** | **$960,000** |
| Apparent Bid Ranking (Raw Total) | 1st (Lowest) | 2nd |
| **Actual Commercial Ranking (Normalized)** | **2nd** | **1st (True Lowest)** |

*Illustrative figures used to demonstrate scope normalization mechanics.*

On raw totals alone, Subcontractor A appears $40,000 cheaper. Once the $100,000 omitted scope is leveled back in, Subcontractor B is $60,000 lower on a comparable scope basis.

The same distortion happens at the individual BOQ line level. A bidder can offer a competitive overall quote while loading abnormally high unit rates onto remeasurable items (such as earthworks, concrete, or MEP rough-in). If site quantities increase later through change orders, that apparently competitive bid generates significant cost overruns.

This framework standardizes scope adjustments, benchmark variance checks, and exception screening so every subcontract award starts from comparable commercial data.

---

## Manual Spreadsheet Bid Tabs vs. Automated BOQ Bid Leveling Matrix

| Procurement Risk & Tender Bottleneck | Manual Bid Tabulation Without This Matrix | Automated Leveling With This BOQ Matrix |
|---|---|---|
| **Omitted BOQ Line Items (Scope Gaps)** | Incomplete quotes look artificially cheap, triggering costly post-award change orders. | Blank or zero-rate items receive automatic **Plug Rate normalization** using consistent rules. |
| **Inconsistent Subcontractor Quote Formats** | Estimators waste hours manually re-keying and aligning mismatched pricing schedules. | A single standardized **BOQ input sheet** aligns all competing bids for apples-to-apples review. |
| **Unbalanced & Front-Loaded Unit Rates** | Inflated rates on variation-sensitive items stay buried across hundreds of BOQ rows. | Every quoted unit rate is checked against your **internal benchmark rate** and auto-flagged if above threshold. |
| **Misleading Lowest-Bid Rankings** | Award teams mistake the lowest raw submission for the lowest true project cost. | **Raw rankings and normalized rankings** display side by side on the dashboard for instant comparison. |
| **Hidden Project Budget Exposure** | Competing totals are judged only against each other without checking internal budget limits. | Normalized totals are measured directly against your **internal cost estimate** and budget tolerance. |
| **Time-Consuming Pre-Award Clarifications** | Quantity surveyors hunt manually line by line for pricing errors before bidder interviews. | All missing items and rate anomalies roll up into a ready-to-send **commercial clarification schedule**. |

---

## Who This Construction Bid Leveling Excel Template Is For

Built for commercial and delivery roles that need reliable **subcontractor quote comparisons** without complex enterprise software:

- **Quantity Surveyors (QS) & Junior QS:** Use as a standardized **BOQ comparison template** to spot missing tender items, calculate scope plug allowances, and document tender evaluation reports.
- **Construction Estimators & Preconstruction Engineers:** Use as a **construction bid tabulation spreadsheet** to benchmark competing trade quotes against internal unit-rate estimates before tender submission.
- **General Contractors (GC) & Small Builders:** Use as a practical **subcontractor quote comparison Excel sheet** during buyout to verify that low-ball trade bids include full site scope.
- **Commercial Managers:** Use as a **pre-award tender evaluation matrix** to review unbalanced pricing risk and prepare structured commercial negotiation agendas.
- **Procurement Managers:** Use to produce consistent, transparent **bid leveling reports** for tender evaluation committees and project owners.
- **Construction Project Managers (PMs):** Use before issuing subcontracts to verify real cost exposure and prevent post-award variation disputes.

**Scope Note:** This workbook is a commercial bid evaluation aid. Formal tender governance, technical compliance reviews, contractor prequalification, and legal contract checks remain separate steps in your procurement process.

---

## The Business Logic & Methodology: Plain-English Guide to Bid Leveling

If you are new to construction procurement or quantity surveying, bid leveling rests on one core rule: **every competing quote must cover the exact same scope and pricing assumptions before you compare totals.**

Beginners and busy builders often fall into four hidden commercial blind spots when comparing subcontractor quotes. Here is the exact business logic this matrix uses to eliminate each one:

### 1. Scope Normalization (Eliminating the "Missing Item" Illusion)
- **The Commercial Blind Spot:** A subcontractor who omits waterproofing, disposal, or temporary site works shows a lower headline total on paper. Once they mobilize on site, that missing scope returns as an expensive variation or forces you to hire a second contractor at a premium.
- **How the Matrix Solves It:** Any blank or zero-priced BOQ line is automatically assigned a comparable reference price using either your **internal benchmark rate** or the **average rate of valid competing bidders**. Every bidder is then judged on 100% of the project scope.

### 2. Plug Rate with Omission Penalty Adjustment (Pricing Real-World Risk)
- **The Commercial Blind Spot:** Filling a missing item with a plain market average assumes the subcontractor will gladly add that omitted work later at a fair price. In reality, adding omitted work after award carries extra coordination overhead and contractor markup.
- **How the Matrix Solves It:** You can set a configurable **omission penalty uplift** (for example, +10% or +15%) on top of the reference plug rate. This reflects conservative commercial exposure in your comparison and prevents incomplete bidders from gaining an unfair ranking advantage.

### 3. Unbalanced Bid Analysis (Catching Front-Loading & Variation Traps)
- **The Commercial Blind Spot:** A subcontractor can submit a competitive overall total while slashing prices on fixed items and inflating unit rates on items likely to grow in quantity (such as rock excavation, rebar, or extra cabling). If quantities increase by 20% during construction, the "cheapest" bid becomes the costliest subcontract.
- **How the Matrix Solves It:** Every individual quoted unit rate is tested automatically against your internal benchmark rate. Any line item exceeding your set warning threshold is flagged immediately for pre-award clarification, protecting you from hidden unit-rate traps.

### 4. Budget & Ranking Analysis (Separating Relative Rank from Financial Viability)
- **The Commercial Blind Spot:** In a heated construction market, all three subcontractors may submit bids well above your project budget. Selecting the lowest of three overpriced quotes still guarantees a cost overrun.
- **How the Matrix Solves It:** The dashboard evaluates normalized bid totals on two axes at once: **bidder-to-bidder ranking** (who is truly cheapest after leveling) and **bid-to-budget variance** (whether the best normalized quote actually fits inside your internal cost estimate and tolerance).

Together, these four checks answer the three questions that matter before signing any subcontract:

1. **Completeness:** Does this quote cover the full tender scope, and what is the real cost of any gaps?
2. **Rate Integrity:** Are individual unit rates commercially reasonable, or are variation traps hidden inside the BOQ?
3. **Budget Fit:** Does the normalized bid total deliver an acceptable commercial outcome against our project estimate?

---

## About Theseus Workshop

I build lightweight operational tools and decision-support Excel workbooks for construction, finance, and small business teams dealing with too many moving parts.

Every toolkit is built around one practical question: **What specific numbers need to be brought together right now so you can make the next business decision with confidence?**

The BOQ Subcontractor Bid Leveling Matrix turns scattered subcontractor quotations into a structured commercial comparison, surfacing scope omissions, pricing anomalies, and award risks before contract execution.

**Looking for more ready-to-use, offline Excel decision tools?** Visit the [Theseus Workshop Store (Theseusworkshop.com)](https://theseusworkshop.com/) to explore one-time-purchase construction estimating, project cost control, cash flow, and operational Excel toolkits designed for immediate local use with zero recurring subscriptions.


## Technical Details

<details>
<summary>For technical reviewers, Excel practitioners, quantity surveyors, and procurement collaborators</summary>

### Workbook Architecture

The workbook follows a four-layer architecture:

**Global Parameters → Raw Bid Input → Bid Leveling Engine → Evaluation Dashboard**

Each sheet has a defined responsibility. Manual inputs are separated from calculation outputs to reduce accidental interference with the evaluation logic.

| Sheet | Layer | Primary Responsibility | Data Handling |
|---|---|---|---|
| `00_Global Parameters` | Control | Currency, Plug Rate methodology, warning thresholds, budget tolerance, and bidder names | Manual configuration |
| `01_BOQ & Raw Bid Input` | Input | Tender BOQ and three subcontractor quotations | Manual input |
| `02_Bid Leveling & Deviation Calculation` | Calculation | Missing-item adjustments, normalized rates, bid totals, deviations, and warning flags | Formula-generated dynamic arrays |
| `03_Bid Leveling Dashboard` | Output | Comparable bid rankings, omission summaries, pricing alerts, and clarification instructions | Formula-generated outputs |

#### 1. Global Control Layer

The `00_Global Parameters` sheet centralizes eight evaluation parameters in `B5:B12`.

| Cell | Parameter | Default / Configuration |
|---|---|---|
| B5 | Currency Symbol | User-defined, such as ¥ or $ |
| B6 | Missing-Item Adjustment Basis | Internal Benchmark Rate |
| B7 | Missing-Item Penalty Uplift | 0.0% |
| B8 | Unbalanced High-Rate Warning Threshold | 25.0% |
| B9 | Total Budget Deviation Tolerance | 5.0% |
| B10 | Subcontractor A Display Name | User-defined |
| B11 | Subcontractor B Display Name | User-defined |
| B12 | Subcontractor C Display Name | User-defined |

The missing-item adjustment basis supports two modes:

- `Internal Benchmark Rate`: Uses the internal estimate as the reference for omitted items.
- `Other Bidders' Average Rate`: Uses the average valid quotation from the other participating subcontractors.

The penalty uplift can increase the adjustment rate where the evaluation policy requires a more conservative treatment of omitted scope.

All commercial thresholds are maintained centrally rather than embedded as independent constants in calculation formulas.

#### 2. Raw Data Input Layer

The `01_BOQ & Raw Bid Input` sheet is the only primary quotation input area.

It contains eight fields:

| Column | Field | Description |
|---|---|---|
| A | BOQ Item Code | Unique item identifier |
| B | Item Description | Tender BOQ description |
| C | Unit | Measurement unit |
| D | Quantity | Tender quantity |
| E | Internal Benchmark Rate | Internal reference unit rate |
| F | Subcontractor A Rate | Original quoted unit rate |
| G | Subcontractor B Rate | Original quoted unit rate |
| H | Subcontractor C Rate | Original quoted unit rate |

The designated input range starts at row 5 and is initially sized through row 1000, providing 996 data rows.

Important input conventions:

- BOQ item codes must be unique.
- Quantities must be greater than zero.
- Missing subcontractor rates should remain blank or be entered as zero.
- Original quotation rates must not be manually replaced with adjusted values.
- The internal benchmark rate should represent the relevant tender control estimate or historical benchmark.

#### 3. Bid Leveling Calculation Engine

The `02_Bid Leveling & Deviation Calculation` sheet contains the calculation layer.

Its formulas start in row 5 and use dynamic-array spill behavior to populate the corresponding BOQ rows.

The calculation model contains eight mirrored input fields and nineteen calculation fields.

| Column | Calculation Field |
|---|---|
| A | BOQ Item Code |
| B | Item Description |
| C | Unit |
| D | Quantity |
| E | Internal Benchmark Rate |
| F | Internal Benchmark Amount |
| G | Subcontractor A Original Rate |
| H | Subcontractor B Original Rate |
| I | Subcontractor C Original Rate |
| J | Other Bidders' Valid Average Rate |
| K | Standard Missing-Item Adjustment Rate |
| L | Subcontractor A Normalized Rate |
| M | Subcontractor B Normalized Rate |
| N | Subcontractor C Normalized Rate |
| O | Subcontractor A Missing-Item Adjustment |
| P | Subcontractor B Missing-Item Adjustment |
| Q | Subcontractor C Missing-Item Adjustment |
| R | Subcontractor A Normalized Amount |
| S | Subcontractor B Normalized Amount |
| T | Subcontractor C Normalized Amount |
| U | Subcontractor A Unit-Rate Deviation |
| V | Subcontractor B Unit-Rate Deviation |
| W | Subcontractor C Unit-Rate Deviation |
| X | Subcontractor A Warning Status |
| Y | Subcontractor B Warning Status |
| Z | Subcontractor C Warning Status |
| AA | High-Rate Clarification Trigger |

The calculation sequence is:

1. Retrieve the valid BOQ records.
2. Map each subcontractor's original quoted rates.
3. Identify missing rates.
4. Calculate the applicable adjustment rate.
5. Replace missing rates for comparison purposes.
6. Calculate normalized item amounts.
7. Calculate unit-rate deviations.
8. Identify high-rate exceptions requiring clarification.

The original quotation data remains separate from the normalized calculation results.

#### 4. Evaluation Dashboard

The `03_Bid Leveling Dashboard` sheet contains two physically separated output areas.

**Upper Area — Rows 5–7**

The fixed three-bidder comparison presents:

| Output | Purpose |
|---|---|
| Bidder Code | Identifies the participating subcontractor |
| Bidder Name | Displays the configured company name |
| Original Bid Total | Shows the submitted quotation total |
| Original Rank | Shows the apparent ranking before adjustment |
| Missing Item Count | Counts omitted BOQ items |
| Missing-Item Adjustment | Quantifies the adjustment amount |
| Missing-Item Ratio | Measures adjustment exposure relative to the original bid |
| Normalized Bid Total | Shows the comparable adjusted total |
| Normalized Rank | Shows the revised commercial ranking |
| High-Rate Flag Count | Counts items triggering high-rate warnings |
| Budget Deviation | Compares the normalized total against the internal benchmark |
| Award Risk Assessment | Summarizes relevant evaluation warnings |
| Currency Display Label | Formats the normalized total using the configured currency symbol |

**Lower Area — Starting at Row 12**

The open-ended clarification area dynamically lists flagged BOQ items.

It contains:

- BOQ item code and description.
- Tender quantity and internal benchmark rate.
- Each subcontractor's quoted rate.
- Each subcontractor's high-rate deviation.
- Individual warning indicators.
- A generated commercial clarification instruction.

The two output areas are deliberately separated.

The upper area occupies fixed rows, while the lower area begins at row 12 and expands downward. This avoids collisions between independent dynamic-array outputs and reduces the risk of Excel `#SPILL!` errors.

#### Data Flow

```text
00_Global Parameters
        |
        | Evaluation rules and bidder mapping
        v
01_BOQ & Raw Bid Input
        |
        | FILTER / XLOOKUP
        v
02_Bid Leveling & Deviation Calculation
        |
        | VSTACK / SUM
        | FILTER
        v
03_Bid Leveling Dashboard
        |
        +---- Comparable Bid Ranking
        |
        +---- Missing-Item Summary
        |
        +---- Unbalanced Pricing Alerts
        |
        +---- Commercial Clarification List
```

---

### Three Traps That Catch Even Experienced Quantity Surveyors

#### Trap 1: The Lowest Submitted Bid Is Not Necessarily the Lowest Comparable Bid

**1. The decision**

A procurement team selects the subcontractor with the lowest original quotation.

**2. The unnoticed flaw**

The quotation excludes required BOQ items, while competing bidders have priced the full scope.

**3. How the recommendation changes**

Consider this illustrative comparison:

| Item | Subcontractor A | Subcontractor B |
|---|---:|---:|
| Original Bid | $920,000 | $960,000 |
| Omitted Scope Adjustment | $100,000 | $0 |
| Normalized Bid | $1,020,000 | $960,000 |

**4. Why the original reasoning is incorrect**

The two quotations do not represent the same priced scope. Comparing their original totals creates a false commercial advantage for the incomplete bid.

**5. Corrected approach**

Apply a consistent missing-item adjustment using the configured Plug Rate basis.

**6. Corrected decision**

Subcontractor B becomes the lower-priced bidder on a like-for-like basis.

**7. Formula Reference**

<details>
<summary>Missing-item adjustment logic</summary>

```excel
Missing Item =
    Original Quoted Rate is Blank or Zero

Normalized Rate =
    IF(Missing Item,
       Standard Adjustment Rate,
       Original Quoted Rate)

Missing-Item Adjustment =
    IF(Missing Item,
       Quantity * Standard Adjustment Rate,
       0)

Normalized Amount =
    Quantity * Normalized Rate
```

These expressions describe the calculation methodology. They are not a claim of the exact deployed cell formulas.

</details>

#### Trap 2: A Competitive Total Can Hide Unbalanced Unit Rates

**1. The decision**

A subcontractor is shortlisted because its total quotation is competitive.

**2. The unnoticed flaw**

Selected BOQ items carry significantly higher unit rates than the internal benchmark.

**3. How the recommendation changes**

Assume an internal benchmark rate of $100 per unit.

| Pricing Scenario | Quoted Rate | Deviation |
|---|---:|---:|
| Normal Pricing | $100 | 0% |
| Moderate Increase | $115 | +15% |
| High-Rate Exception | $130 | +30% |

At the default 25% warning threshold, the $130 rate triggers a red-flag review.

**4. Why the original reasoning is incorrect**

A total-price comparison does not reveal where the quoted value is concentrated. A high rate on an item with potential quantity increases can create additional commercial exposure.

**5. Corrected approach**

Compare each quoted unit rate with the corresponding internal benchmark and flag deviations above the configured threshold.

**6. Corrected decision**

The subcontractor can remain under consideration, but the flagged rates must be commercially clarified before award.

**7. Formula Reference**

<details>
<summary>Unit-rate deviation and warning logic</summary>

```excel
Unit Rate Deviation =
    (Quoted Rate / Internal Benchmark Rate) - 1

High-Rate Warning =
    Unit Rate Deviation > Warning Threshold
```

The default warning threshold is 25.0%.

A warning identifies an item requiring review. It does not independently establish fraudulent intent or prove that a quotation is commercially unacceptable.

</details>

#### Trap 3: A Normalized Bid Can Still Exceed the Internal Budget

**1. The decision**

The procurement team selects the lowest normalized quotation.

**2. The unnoticed flaw**

The lowest normalized quotation may still exceed the internal cost estimate beyond the permitted tolerance.

**3. How the recommendation changes**

Assume an internal benchmark total of $1,000,000.

| Normalized Bid | Budget Deviation | Evaluation |
|---|---:|---|
| $980,000 | -2.0% | Within budget |
| $1,030,000 | +3.0% | Within 5% tolerance |
| $1,080,000 | +8.0% | Exceeds tolerance |

**4. Why the original reasoning is incorrect**

The lowest competing bid is not automatically an acceptable commercial outcome. Relative ranking and budget compliance are separate evaluation questions.

**5. Corrected approach**

Evaluate normalized bid totals against the internal benchmark total and the configured budget tolerance.

**6. Corrected decision**

A bid exceeding the tolerance is escalated for commercial review rather than treated as automatically acceptable because it ranks first.

**7. Formula Reference**

<details>
<summary>Budget deviation logic</summary>

```excel
Budget Deviation =
    (Normalized Bid Total / Internal Benchmark Total) - 1

Budget Warning =
    Budget Deviation > Budget Tolerance
```

The default budget tolerance is 5.0%.

</details>

---

### Example Scenario

**Scenario: Evaluating Three Subcontractor Quotations for a Construction Package**

A tender team receives three quotations for a BOQ containing waterproofing, temporary facilities, and other construction activities.

The internal benchmark total is $1,000,000.

The following example illustrates how omitted scope and unbalanced unit rates can affect the evaluation.

#### Step 1. Original Quotations

| Evaluation Item | Subcontractor A | Subcontractor B | Subcontractor C |
|---|---:|---:|---:|
| Original Bid Total | $920,000 | $960,000 | $945,000 |
| Missing-Item Adjustment | $100,000 | $0 | $30,000 |
| Normalized Bid | $1,020,000 | $960,000 | $975,000 |

The original ranking is:

1. Subcontractor A — $920,000
2. Subcontractor C — $945,000
3. Subcontractor B — $960,000

The normalized ranking becomes:

1. Subcontractor B — $960,000
2. Subcontractor C — $975,000
3. Subcontractor A — $1,020,000

The apparent lowest bidder is no longer the lowest bidder after missing scope is accounted for.

#### Step 2. Review Unit-Rate Exceptions

Assume one BOQ item has an internal benchmark rate of $100.

| Bidder | Quoted Rate | Deviation | Warning |
|---|---:|---:|---|
| A | $105 | +5% | No |
| B | $132 | +32% | Yes |
| C | $110 | +10% | No |

Subcontractor B has the lowest normalized total, but its unit rate requires clarification.

This illustrates why the normalized total should not be the only award consideration.

#### Step 3. Review Budget Exposure

| Bidder | Normalized Total | Budget Deviation |
|---|---:|---:|
| A | $1,020,000 | +2.0% |
| B | $960,000 | -4.0% |
| C | $975,000 | -2.5% |

All three normalized totals remain within the default 5% upper budget tolerance.

However, Subcontractor B has an individual high-rate exception.

#### Step 4. Commercial Interpretation

The evaluation now presents three separate questions:

- Which bidder offers the lowest comparable total?
- Which bidder has missing scope or potentially unbalanced pricing?
- Which exceptions must be resolved before commercial award?

**Recommended action:** Subcontractor B is the lowest normalized bidder in this illustrative scenario. Its high-rate item should be included in the clarification process before the final award recommendation.

The matrix supports the evaluation. Final award decisions still require technical compliance checks, commercial clarification, contractual review, and procurement approval.

---

### Formula Reference

The calculation engine is designed around dynamic arrays and centralized parameter references.

The following reference describes the intended formula behavior. Exact deployed formulas should be verified against the completed workbook before being treated as an implementation specification.

<details>
<summary>1. Dynamic BOQ Retrieval — FILTER</summary>

**Purpose:** Retrieve valid BOQ records from the input sheet without manually extending formulas.

```excel
=FILTER(
    '01_BOQ & Raw Bid Input'!A5:H1000,
    '01_BOQ & Raw Bid Input'!A5:A1000<>""
)
```

**Logic:**

- Reads the designated BOQ input range.
- Excludes rows without a BOQ item code.
- Returns the valid records as a dynamic array.

The resulting spill range determines the calculation population.

</details>

<details>
<summary>2. Field Mapping — XLOOKUP</summary>

**Purpose:** Retrieve descriptions, quantities, benchmark rates, and original bidder rates by BOQ item code.

```excel
=XLOOKUP(
    BOQ_Code,
    Input_BOQ_Codes,
    Input_Field,
    ""
)
```

**Logic:**

- Uses BOQ item code as the lookup key.
- Retrieves the corresponding source field.
- Keeps the calculation layer connected to the original input records.

BOQ codes must be unique for reliable one-to-one mapping.

</details>

<details>
<summary>3. Missing-Item Detection and Plug Rate</summary>

**Purpose:** Apply a consistent comparison rate to omitted BOQ items.

The standard adjustment rate is determined by:

| Configuration | Adjustment Basis |
|---|---|
| Internal Benchmark Rate | Internal benchmark unit rate |
| Other Bidders' Average Rate | Average of valid rates from the other participating bidders |

The penalty uplift is then applied to the selected reference rate.

Conceptual calculation:

```excel
Standard Adjustment Rate =
    Selected Reference Rate * (1 + Penalty Uplift)
```

For a missing item:

```excel
Normalized Rate =
    Standard Adjustment Rate
```

For a priced item:

```excel
Normalized Rate =
    Original Quoted Rate
```

The original quotation remains unchanged in the input layer.

</details>

<details>
<summary>4. Bid Amount Aggregation — SUM</summary>

**Purpose:** Calculate the internal benchmark total and each subcontractor's normalized total.

```excel
Internal Benchmark Amount =
    Quantity * Internal Benchmark Rate

Normalized Item Amount =
    Quantity * Normalized Unit Rate

Normalized Bid Total =
    SUM(Normalized Item Amounts)
```

The same quantity and BOQ scope are used for each bidder's comparable total.

</details>

<details>
<summary>5. Multi-Output Consolidation — VSTACK</summary>

**Purpose:** Consolidate bidder-level evaluation results into a consistent dashboard structure.

The design uses `VSTACK` to combine corresponding output arrays into a single presentation structure.

This supports the fixed three-bidder comparison area.

</details>

<details>
<summary>6. Exception Extraction — FILTER</summary>

**Purpose:** Return only BOQ items that trigger high-rate clarification.

Conceptual condition:

```excel
High-Rate Exception =
    Unit Rate Deviation > Warning Threshold
```

The filtered records feed the lower clarification area, beginning at row 12.

This separates exception review from the full calculation table.

</details>

</details>


### Validation Rules

The evaluation depends on consistent BOQ identifiers, valid quantities, meaningful benchmark rates, and correctly configured commercial parameters.

The following validation rules define the intended input controls and review conditions.

| Field / Area | Validation Rule | Error Behavior / Review Action |
|---|---|---|
| BOQ Item Code | Must not be blank for an active BOQ record. | Exclude unused rows; investigate missing identifiers. |
| BOQ Item Code | Must be unique across the tender BOQ. | Duplicate codes require correction before evaluation. |
| Item Description | Should be populated for every active BOQ item. | Review incomplete item descriptions. |
| Unit | Must represent the applicable measurement unit. | Review inconsistent units before comparing rates. |
| Quantity | Must be greater than zero. | Invalid quantities must be corrected. |
| Internal Benchmark Rate | Must be a valid numerical reference rate. | Review missing or invalid benchmark values. |
| Subcontractor A Rate | Blank or zero indicates a potentially omitted item. | Apply the configured Plug Rate methodology. |
| Subcontractor B Rate | Blank or zero indicates a potentially omitted item. | Apply the configured Plug Rate methodology. |
| Subcontractor C Rate | Blank or zero indicates a potentially omitted item. | Apply the configured Plug Rate methodology. |
| Missing-Item Adjustment Basis | Must be either `Internal Benchmark Rate` or `Other Bidders' Average Rate`. | Restrict selection through data validation. |
| Penalty Uplift | Must be a valid non-negative percentage. | Review invalid parameter entries. |
| High-Rate Warning Threshold | Must be a valid non-negative percentage. | Use the configured threshold for exception screening. |
| Budget Tolerance | Must be a valid non-negative percentage. | Use the configured tolerance for budget warnings. |
| Currency Symbol | Must be a valid display symbol. | Review incorrect currency presentation. |
| Bidder Names | Three bidder names must be mapped to their corresponding evaluation positions. | Correct missing or inconsistent bidder labels. |
| Dynamic Array Output | Spill destinations must remain clear. | Remove obstructing content when `#SPILL!` occurs. |
| Benchmark-Based Calculations | Benchmark rates must be positive for meaningful deviation analysis. | Investigate invalid benchmark values before interpreting deviations. |

#### Important Calculation Guard Conditions

**Missing quotation versus zero quotation**

A blank or zero quotation is treated as a missing item under the specified input convention.

This distinction should be reviewed against the original tender submission before the adjustment is accepted.

**Other bidders' average rate**

When the `Other Bidders' Average Rate` method is selected, the reference should be calculated from valid rates supplied by the other participating bidders.

If no valid comparison rate is available, the item requires manual commercial review rather than an invented adjustment.

**Unit-rate deviation**

A meaningful deviation comparison requires a valid positive internal benchmark rate.

Items without a usable benchmark should not be interpreted as ordinary high-rate exceptions.

**Dynamic-array integrity**

Formula-generated ranges must not contain manually entered values that obstruct spill expansion.

The calculation and dashboard sheets should remain protected against accidental overwriting.

#### Evaluation Limitations

The matrix is a commercial screening and bid-normalization tool.

It does not independently determine:

- Whether a bidder has intentionally omitted scope.
- Whether an unusually high rate represents an improper bidding strategy.
- Whether a subcontractor is technically qualified.
- Whether the contractual variation mechanism will permit additional payment.
- Whether a bidder should receive the final award.

A red-flag status is an investigation trigger, not a finding of misconduct.

Final commercial decisions should consider scope compliance, construction methodology, contractual terms, variation exposure, and the procurement team's documented evaluation criteria.

</details>


---

## Other Tools in This Series

Explore more lightweight construction and commercial decision-support tools:

- [Construction Estimating & Cost Control Tools](https://github.com/HyVoid) — BOQ estimation, project costing, and budget control.
- [Theseus Workshop](https://github.com/HyVoid) — Practical Excel-based operational and financial decision frameworks.

## License

This project is licensed under the **Apache License 2.0**.

You may use, modify, and distribute the project in accordance with the terms and conditions of the Apache License 2.0.

See the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) for the complete license terms.

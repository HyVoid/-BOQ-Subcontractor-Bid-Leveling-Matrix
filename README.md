
# BOQ Subcontractor Bid Leveling Matrix

<p align="center">
  <strong>Compare Subcontractor Bids on a Like-for-Like Basis — Identify Missing Scope, Unbalanced Rates, and Hidden Award Risks Before Contracting.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="Apache License 2.0">
  <img src="https://img.shields.io/badge/Platform-Browser%20%7C%20Excel-217346.svg" alt="Browser and Excel">
  <img src="https://img.shields.io/badge/Tool-Bid%20Leveling-2251FF.svg" alt="Bid Leveling">
</p>

**A practical bid evaluation framework for construction procurement teams. Normalize subcontractor quotations, account for omitted BOQ items, identify potentially unbalanced unit rates, and compare the actual commercial exposure behind competing bids.**

No signup. No installation. Free browser access, with an offline Excel version available for repeat evaluations and permanent procurement records.

> **Try the free web-based version.** If an offline Excel workbook is needed for permanent records, audit trails, and repeated procurement evaluations, the Excel version is also available with a 30-day, no-questions-asked money-back guarantee.
>
> - [🌐 Open in Browser — HTML Version](YOUR_HTML_DEMO_URL)
> - [📥 Download Excel — Offline Version](YOUR_EXCEL_PURCHASE_OR_RELEASE_URL)

---

## What It Helps You Track

A low subcontractor quotation does not necessarily represent the lowest project cost.

This tool makes the differences visible:

- **Comparable bid totals:** See how subcontractor rankings change after omitted BOQ items are accounted for.
- **Missing scope exposure:** Identify which contractor omitted waterproofing, temporary facilities, or other required work items, and quantify the associated adjustment.
- **Unbalanced unit rates:** Identify unusually high quoted rates relative to internal benchmark prices.
- **Budget deviation:** Compare normalized subcontractor totals against the internal cost estimate.
- **Clarification priorities:** Generate an item-level list of pricing exceptions that require commercial clarification before award.
- **Award risk indicators:** Distinguish an apparently attractive quotation from one that carries material scope or pricing risks.

## Quick Start Workflow

The workflow is designed around existing BOQ schedules and subcontractor quotations. No manual recalculation or repeated formula maintenance is required.

### 1. Set the Evaluation Parameters

Open the `00_Global Parameters` sheet.

Configure the project currency, missing-item adjustment method, omission penalty rate, unbalanced-bid warning threshold, and internal budget tolerance.

Update the three subcontractor display names to match the actual bidders.

These settings are maintained centrally and applied throughout the evaluation.

### 2. Import the BOQ and Quotations

Open `01_BOQ & Raw Bid Input`.

Paste the tender BOQ into the designated input area, including:

- BOQ item code
- Description
- Unit of measurement
- Tender quantity
- Internal benchmark unit rate

Then enter the corresponding unit rates from Subcontractors A, B, and C.

If a subcontractor has omitted an item, leave its quotation cell blank or enter zero. Do not invent a replacement price in the input area.

### 3. Review the Normalized Results

Switch to `03_Bid Leveling Dashboard`.

The evaluation presents:

- Original quotation totals and apparent rankings.
- Missing-item counts and adjustment amounts.
- Normalized bid totals and revised rankings.
- Unbalanced pricing alerts.
- Items requiring clarification.

The calculation sheet updates the underlying comparisons automatically.

### 4. Refresh for the Next Evaluation

For another procurement exercise, replace the BOQ and quotation inputs, update the bidder names and applicable evaluation parameters, and review the refreshed results.

The intended workflow is to maintain one consistent evaluation method rather than rebuilding separate comparison spreadsheets for every tender.

**Set the evaluation rules once. Enter the BOQ and competing rates. Review the normalized bids. Clarify exceptions before award.**

---

## Why I Built This

In construction procurement, comparing subcontractor quotations is often more complicated than comparing three or four totals.

A common situation is that several subcontractors submit quotations against the same tender BOQ, but their pricing structures are inconsistent.

One contractor may quote a particularly low total because waterproofing, temporary facilities, or other required items have been omitted. Another may include the full scope but quote unusually high unit rates for items likely to increase through subsequent variations.

A conventional quotation comparison can produce a misleading conclusion: the contractor with the lowest submitted total appears to be the most competitive.

The problem is not simply inaccurate arithmetic. It is a comparison failure.

The bids are being compared before their scope and pricing differences have been normalized.

For example:

| Evaluation | Subcontractor A | Subcontractor B |
|---|---:|---:|
| Original quotation | $920,000 | $960,000 |
| Omitted-item adjustment | $100,000 | $0 |
| Normalized bid | $1,020,000 | $960,000 |
| Apparent position | Lowest | Second |
| Actual comparable position | Second | Lowest |

*Illustrative figures, not actual project results.*

The original ranking suggests that Subcontractor A is cheaper. After accounting for the omitted scope, Subcontractor B becomes the lower-priced bidder.

The same problem exists at item level. A subcontractor may submit a competitive overall total while concentrating unusually high rates in selected BOQ items. If those items later increase through variations, the original quotation may create additional commercial exposure.

I built this framework to turn those evaluation steps into a reusable process.

Instead of relying on manual quotation comparisons and individual judgment, it applies consistent scope adjustments, benchmark comparisons, and exception screening across competing bids.

The objective is not to automatically decide who should receive the contract. It is to ensure that the commercial decision starts with comparable information.

---

## Common Construction Procurement Problems This Solves

| Problem | Without This Tool | With This Tool |
|---|---|---|
| Missing BOQ items | An incomplete quotation appears artificially competitive. | Missing items receive a consistent adjustment based on the selected Plug Rate method. |
| Inconsistent quotation formats | Commercial teams manually reconcile different pricing structures. | A common BOQ input structure supports like-for-like comparisons. |
| Unbalanced bidding | High rates on variation-sensitive items remain buried in detailed quotations. | Unit-rate deviations against internal benchmarks are flagged for review. |
| Misleading bid rankings | The lowest submitted total is mistaken for the lowest comparable cost. | Original and normalized rankings can be reviewed side by side. |
| Hidden budget exposure | Bid totals are reviewed without consistent comparison against the internal estimate. | Normalized totals are compared against the internal benchmark total and budget tolerance. |
| Inefficient clarification | Engineers manually search quotations for suspicious items. | Flagged items are consolidated into an item-level clarification list. |

## Who This Is For

Designed for:

- **Quantity Surveyors:** Comparing BOQ rates and identifying missing or abnormal pricing.
- **Commercial Managers:** Reviewing competing subcontractor bids before commercial negotiation and award.
- **Estimators:** Checking quoted rates against internal benchmark estimates.
- **Procurement Managers:** Preparing consistent bid comparisons for tender evaluation committees.
- **Construction Project Managers:** Understanding potential cost exposure before committing to a subcontract.

This tool is not designed to replace formal tender governance, technical qualification, contractual review, or independent commercial approval.

It is a focused commercial evaluation aid, not an automated contractor selection system.

No spreadsheet expertise needed. Open the browser version and start evaluating quotations immediately.

---

## About

I build lightweight operational tools and decision-support frameworks for situations where too many moving parts make reliable decisions difficult.

The central question behind each tool is straightforward:

**What information needs to be brought together to make the next business decision confidently?**

The BOQ Subcontractor Bid Leveling Matrix is one example. It turns scattered quotation details into a structured commercial comparison, making scope omissions, pricing deviations, and award risks easier to identify before a contract is awarded.


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

## The Business Logic & Methodology

The fundamental principle behind bid leveling is that **competing quotations must be evaluated against the same scope and commercial assumptions before their prices can be meaningfully compared.**

A submitted quotation is not automatically a complete or economically comparable offer. Missing items can make a bid appear cheaper, while strategically concentrated unit rates can create additional exposure when quantities change.

The matrix uses four complementary commercial methods.

- **Scope Normalization:** Missing BOQ items are assigned a consistent comparison value using either the internal benchmark rate or the average of other valid bidder rates. This addresses incomplete quotations and reduces the artificial advantage created by omitted scope.

- **Plug Rate with Penalty Adjustment:** A configurable uplift can be applied to the missing-item reference rate. This allows procurement teams to incorporate an additional commercial adjustment when their evaluation policy requires more conservative treatment of omissions.

- **Unbalanced Bid Analysis:** Individual quoted rates are compared with internal benchmark rates. Items exceeding the configured deviation threshold are flagged for clarification. This helps identify pricing concentration that may become commercially significant when quantities change.

- **Budget and Ranking Analysis:** Original bid rankings are compared with normalized rankings, while adjusted totals are assessed against the internal cost estimate. This separates relative competitiveness from overall budget acceptability.

The methods work together to answer three different procurement questions:

1. Is the quotation complete enough to compare?
2. Are its individual rates commercially reasonable?
3. Does its normalized total represent an acceptable procurement outcome?

The resulting evaluation is more than a lowest-price comparison. It provides a structured basis for clarification, negotiation, and documented award recommendations.

---

## Other Tools in This Series

Explore more lightweight construction and commercial decision-support tools:

- [Construction Estimating & Cost Control Tools](https://github.com/HyVoid) — BOQ estimation, project costing, and budget control.
- [Theseus Workshop](https://github.com/HyVoid) — Practical Excel-based operational and financial decision frameworks.

## License

This project is licensed under the **Apache License 2.0**.

You may use, modify, and distribute the project in accordance with the terms and conditions of the Apache License 2.0.

See the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) for the complete license terms.

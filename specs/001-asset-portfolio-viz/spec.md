# Feature Specification: Asset Portfolio Visualization

**Feature Branch**: `001-asset-portfolio-viz`
**Created**: 2026-01-24
**Status**: Draft
**Input**: User description: "我想要实现一个资产可视化的：要求是输入标的信息：标的名、金额、小分类（eg： 标普500）、大分类（eg：美股） ，可以对我现有的所有标的进行可视化。可视化信息包括：各个大分类占比（百分比，金额）小分类占比（百分比，金额）"

## Clarifications

### Session 2026-01-24

- Q: How should the system match and handle category names? → A: Users should predefine categories in advance and then select from those predefined categories when adding or editing assets
- Q: Can a small category belong to multiple large categories, or is each small category tied to exactly one large category? → A: One-to-many: A small category can belong to multiple large categories
- Q: What format should be used to display the portfolio allocation data? → A: Mixed format: Tables for detailed data with optional chart visualizations
- Q: How should user access and data isolation work? → A: Single-user only, simple approach with no login or online sharing, but should support export and import functionality
- Q: How should currency and amount formatting work? → A: Single currency with symbol

## User Scenarios & Testing *(mandatory)*

### User Story 0 - Define Categories (Priority: P1)

A user wants to set up their portfolio structure by defining the large and small categories they will use to classify their assets before adding any investments.

**Why this priority**: This is a prerequisite for adding assets. Users must define categories before they can classify their investments. Without predefined categories, the system cannot function.

**Independent Test**: Can be fully tested by creating large categories and small categories independently, then associating small categories with one or more large categories, verifying they are saved and available for selection when adding assets.

**Acceptance Scenarios**:

1. **Given** no categories exist, **When** user creates a large category "US Stocks", **Then** the category is saved and available for selection when adding assets

2. **Given** large categories "US Stocks" and "International Stocks" exist, **When** user creates a small category "Index Funds" and associates it with both large categories, **Then** the small category is saved and linked to both large categories

3. **Given** categories exist, **When** user views the category list, **Then** all large categories are displayed with their associated small categories, showing which small categories belong to multiple large categories

4. **Given** a category exists, **When** user edits the category name, **Then** the category name is updated and all existing assets using that category reflect the new name

5. **Given** a small category is associated with multiple large categories, **When** user removes the association with one large category, **Then** the small category remains associated with the other large categories and assets are not affected

---

### User Story 1 - Add Asset and View Portfolio Summary (Priority: P1)

A user wants to track their investment portfolio by adding individual assets and seeing an immediate overview of how their investments are distributed across major asset categories.

**Why this priority**: This is the core value proposition - users need to input their assets and see the basic allocation. Without this, the feature provides no value.

**Independent Test**: Can be fully tested by adding one or more assets and verifying that the portfolio summary displays correct totals and percentages for large categories. Delivers immediate value by showing portfolio allocation.

**Acceptance Scenarios**:

1. **Given** predefined categories exist (large: "US Stocks", small: "S&P 500 Index Fund") and no assets exist in the portfolio, **When** user adds a new asset with name "Vanguard S&P 500", amount "10000", selecting small category "S&P 500 Index Fund" and large category "US Stocks" from dropdown lists, **Then** the asset is saved and the portfolio summary shows "US Stocks: 100% (10000)"

2. **Given** predefined categories exist and one asset exists (US Stocks: 10000), **When** user adds another asset with name "China A-Shares ETF", amount "5000", selecting from predefined categories "A-Shares Index" (small) and "China Stocks" (large), **Then** portfolio summary shows "US Stocks: 66.67% (10000)" and "China Stocks: 33.33% (5000)" with total portfolio value of 15000

3. **Given** multiple assets exist, **When** user views the portfolio summary, **Then** all large categories are displayed with their respective percentages and amounts, and percentages sum to 100%

4. **Given** no categories have been defined, **When** user attempts to add an asset, **Then** system prompts user to define categories first or prevents asset creation until categories exist

---

### User Story 2 - View Detailed Category Breakdown (Priority: P2)

A user wants to drill down into their portfolio allocation to see not just the major categories, but also how investments are distributed within each category by small categories, displayed in both tabular format and optional visual charts.

**Why this priority**: This provides deeper insight into portfolio composition, helping users understand diversification within each major asset class. It builds on P1 by adding analytical depth. Visual charts make patterns easier to spot.

**Independent Test**: Can be tested by adding multiple assets with the same large category but different small categories, then verifying the small category breakdown displays correct percentages and amounts in table format, with optional chart visualizations available.

**Acceptance Scenarios**:

1. **Given** portfolio has 3 assets: "Vanguard S&P 500" (10000, S&P 500, US Stocks), "Nasdaq 100 ETF" (5000, Nasdaq 100, US Stocks), "US Treasury Bonds" (5000, Government Bonds, US Bonds), **When** user views small category breakdown for "US Stocks", **Then** system shows a table with "S&P 500: 66.67% (10000)" and "Nasdaq 100: 33.33% (5000)" within US Stocks category

2. **Given** portfolio has assets across multiple large categories, **When** user views the complete small category breakdown, **Then** system displays all small categories in a table grouped by their large category, with percentages calculated relative to the large category total

3. **Given** a large category contains only one small category, **When** user views the breakdown, **Then** that small category shows 100% of the large category in the table

4. **Given** portfolio data is displayed in table format, **When** user requests chart visualization, **Then** system displays the same data as a chart (pie chart or bar chart) showing visual proportions

---

### User Story 3 - Manage Existing Assets (Priority: P3)

A user wants to update their portfolio as their investments change by editing asset amounts, correcting data entry errors, or removing assets they no longer hold.

**Why this priority**: Portfolio management requires ongoing updates. While not essential for initial value delivery, this is necessary for long-term usability.

**Independent Test**: Can be tested by creating an asset, modifying its details, and verifying the portfolio visualizations update correctly. Can also test deletion and verify the asset is removed and calculations adjust.

**Acceptance Scenarios**:

1. **Given** an asset "Vanguard S&P 500" exists with amount 10000, **When** user edits the amount to 15000, **Then** the asset is updated and all portfolio calculations reflect the new amount

2. **Given** an asset exists with incorrect category, **When** user edits the small category or large category, **Then** the asset moves to the correct category in all visualizations

3. **Given** multiple assets exist, **When** user deletes one asset, **Then** the asset is removed from the portfolio and all percentages and totals recalculate correctly

4. **Given** user attempts to delete an asset, **When** deletion is confirmed, **Then** the asset is permanently removed and cannot be recovered

---

### User Story 4 - Export and Import Portfolio Data (Priority: P3)

A user wants to export their complete portfolio data (assets and categories) to a file for backup purposes or to transfer to another device, and import previously exported data to restore their portfolio.

**Why this priority**: Data portability is important for backup and device migration. While not critical for core functionality, it provides peace of mind and flexibility.

**Independent Test**: Can be tested by creating a portfolio with categories and assets, exporting to a file, clearing all data, then importing the file and verifying all data is restored correctly.

**Acceptance Scenarios**:

1. **Given** a portfolio with categories and assets exists, **When** user exports the portfolio data, **Then** system generates a file containing all categories, category associations, and assets with their complete information

2. **Given** an exported portfolio file exists, **When** user imports the file, **Then** system restores all categories, category associations, and assets exactly as they were at export time

3. **Given** user attempts to import a file, **When** the file format is invalid or corrupted, **Then** system displays an error message and does not modify existing portfolio data

4. **Given** user imports portfolio data, **When** imported categories or assets conflict with existing data, **Then** system either merges the data or prompts user to choose how to handle conflicts

---

### Edge Cases

- What happens when no categories have been defined?
  - System should prompt user to define categories before allowing asset creation

- What happens when the portfolio is empty (no assets added)?
  - System should display an empty state with instructions to add the first asset

- What happens when an asset amount is zero or negative?
  - System should validate that amounts are positive numbers greater than zero

- What happens when category names are very long?
  - System should handle long category names gracefully in visualizations (truncation or wrapping)

- What happens when two assets have the same name?
  - System should allow duplicate names since users may have multiple positions in the same asset

- What happens when percentages don't sum to exactly 100% due to rounding?
  - System should use consistent rounding rules and ensure displayed percentages are within acceptable tolerance

- What happens when a user tries to delete a category that has assets assigned to it?
  - System should prevent deletion and inform user to reassign or delete assets first

- What happens when a user tries to create duplicate category names?
  - System should prevent duplicate category names within the same category type (large or small)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create and manage large categories with unique names

- **FR-002**: System MUST allow users to create and manage small categories that can be associated with one or more large categories

- **FR-003**: System MUST allow users to associate and disassociate small categories with large categories

- **FR-004**: System MUST prevent duplicate category names within the same category type (large or small)

- **FR-005**: System MUST allow users to edit category names, with changes reflected in all associated assets

- **FR-006**: System MUST prevent deletion of categories that have assets assigned to them

- **FR-007**: System MUST allow users to add new assets by selecting from predefined category lists (not free-form text entry)

- **FR-008**: System MUST require users to select both a large category and a small category when adding an asset

- **FR-009**: System MUST validate that the selected small category is associated with the selected large category when adding or editing an asset

- **FR-010**: System MUST validate that asset amounts are positive numeric values greater than zero

- **FR-011**: System MUST persist all asset and category data so that users can access their portfolio across sessions

- **FR-012**: System MUST calculate and display the total portfolio value as the sum of all asset amounts

- **FR-013**: System MUST calculate and display each large category's percentage of the total portfolio value

- **FR-014**: System MUST calculate and display each large category's total amount

- **FR-015**: System MUST calculate and display each small category's percentage relative to its parent large category

- **FR-016**: System MUST calculate and display each small category's total amount

- **FR-017**: System MUST aggregate amounts for assets that share the same large category

- **FR-018**: System MUST aggregate amounts for assets that share the same small category within a large category

- **FR-019**: Users MUST be able to edit existing assets, including modifying name, amount, and selecting different categories from predefined lists

- **FR-020**: Users MUST be able to delete existing assets from their portfolio

- **FR-021**: System MUST update all calculations and visualizations immediately when assets are added, edited, or deleted

- **FR-022**: System MUST display large category breakdown showing all unique large categories with their percentages and amounts in table format

- **FR-023**: System MUST display small category breakdown showing all unique small categories grouped by their large category with percentages and amounts in table format

- **FR-024**: System MUST provide optional chart visualizations (pie charts or bar charts) for portfolio data in addition to table format

- **FR-025**: System MUST handle empty portfolio state by displaying appropriate messaging

- **FR-026**: System MUST prevent asset creation when no categories have been defined

- **FR-027**: System MUST round percentage values to two decimal places for display

- **FR-028**: System MUST allow users to export all portfolio data (categories, category associations, and assets) to a file

- **FR-029**: System MUST allow users to import portfolio data from a previously exported file

- **FR-030**: System MUST validate imported file format and reject invalid or corrupted files without modifying existing data

- **FR-031**: System MUST handle conflicts when importing data that overlaps with existing portfolio data

- **FR-032**: System MUST allow users to configure a currency symbol for displaying amounts

- **FR-033**: System MUST display all monetary amounts with the configured currency symbol

- **FR-034**: System MUST format amounts with appropriate thousand separators for readability

### Key Entities

- **Asset**: Represents an individual investment holding with a name (e.g., "Vanguard S&P 500"), monetary amount, small category classification (e.g., "S&P 500 Index Fund"), and large category classification (e.g., "US Stocks")

- **Large Category**: Represents a major asset class grouping (e.g., "US Stocks", "China Stocks", "Bonds"). Contains aggregated amount from all assets in this category and calculated percentage of total portfolio

- **Small Category**: Represents a sub-classification within a large category (e.g., "S&P 500 Index Fund", "Nasdaq 100"). Contains aggregated amount from all assets in this small category and calculated percentage relative to parent large category

- **Portfolio**: Represents the complete collection of all user assets with calculated total value and category breakdowns

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can add a new asset to their portfolio in under 30 seconds

- **SC-002**: Portfolio calculations (totals, percentages) update within 1 second of any data change

- **SC-003**: Percentage calculations are accurate to within 0.01% of mathematically correct values

- **SC-004**: Users can view their complete portfolio allocation at a glance without scrolling for portfolios up to 20 assets

- **SC-005**: 95% of users successfully add their first asset without external help or documentation

- **SC-006**: System correctly handles portfolios with up to 100 assets without performance degradation

## Assumptions

- Users are familiar with their own investment categories and can classify their assets appropriately
- Asset amounts are in a single currency (no currency conversion needed)
- Users want to see both percentage and absolute amount for better context
- Portfolio data should persist between sessions (users are tracking ongoing investments)
- Users may have multiple assets in the same category that should be aggregated
- Basic CRUD operations (Create, Read, Update, Delete) are sufficient for asset management
- Visualizations should prioritize clarity and accuracy over aesthetic complexity

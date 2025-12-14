# Reciepto Application Specification

## 1. Executive Summary

**Reciepto** is a receipt analysis and budgeting application designed to automate the extraction of detailed line-item data from physical receipts. By leveraging AWS Textract for OCR and a LangGraph-orchestrated LLM workflow for semantic cleaning, Reciepto transforms unstructured images into structured financial data for analytics and budgeting.

## 2. Tech Stack & Architecture

### 2.1 Core Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn/UI.
- **Backend**: FastAPI (Python 3.10+), Pydantic.
- **AI/ML**: LangGraph (Workflow Orchestration), AWS Textract (OCR), OpenAI/Anthropic (LLM for cleaning).
- **Database**: PostgreSQL (v16).
- **Infrastructure**: Docker, Docker Compose (Local Dev), AWS S3 (Image Storage).

## 3. Features Specification

### 3.1 Frontend (Next.js)

#### Receipt Upload Zone
- Drag-and-drop interface for images (JPG, PNG) and PDFs.
- Optimistic UI updates showing "Processing..." status.

#### Dashboard
- **Recent Activity**: List of recently uploaded receipts with status indicators (Pending, Analyzed, Failed).
- **Monthly Overview**: Card showing Total Spent, Top Category, and Budget Health.

#### Receipt Detail View
- Side-by-side view: Original Receipt Image vs. Extracted Data.
- Editable fields for user corrections (Merchant Name, Date, Line Item Prices).

#### Analytics Page
- Visualizations using Recharts/Visx:
  - Spending by Category (Pie Chart)
  - Monthly Trend (Bar Chart)
  - Merchant Frequency (List)

#### Budgeting Tools
- Set monthly limits per category (e.g., "Groceries: $400")
- Alerts/Visual indicators when nearing limits
### 3.2 Backend (FastAPI)

#### API Endpoints

- **POST /receipts/upload**: Accepts file, uploads to storage, initiates LangGraph run (background task).
- **GET /receipts**: Returns paginated list of receipts with summary data.
- **GET /receipts/{id}**: Returns full details including line items.
- **PATCH /receipts/{id}**: Allows manual user overrides of extracted data.
- **GET /analytics/spending**: Aggregated data for frontend charts.

#### Background Workers

Uses FastAPI BackgroundTasks or Celery to run the LangGraph workflow asynchronously so the upload endpoint doesn't timeout.

## 4. LangGraph Workflow (The "Brain")

The core logic resides in a stateful graph that processes the receipt.

### State Schema (ReceiptState)

```python
class ReceiptState(TypedDict):
    image_path: str
    raw_textract_output: dict
    cleaned_json: dict
    validation_errors: list[str]
    status: Literal['processing', 'review_required', 'complete']
```

### Nodes

#### ocr_node
- Calls AWS Textract DetectDocumentText (or AnalyzeDocument for tables).
- Stores raw blocks in state.

#### extraction_node
- Constructs a prompt with the raw OCR text.
- Asks LLM to extract: Merchant, Date, Total, Tax, and a list of LineItems (Name, Category, Price, Qty).
- **Crucial Step**: The LLM normalizes data (e.g., converts "Wal-Mrt Super" → "Walmart", formats dates to ISO 8601).

#### validation_node
- Uses Pydantic to validate the LLM output.
- Checks if `Sum(LineItems) + Tax ~= Total`.
- If validation fails, it can loop back to extraction_node with an error message (Self-Correction) or flag for human review.

#### persistence_node
- Saves the final structured object to PostgreSQL.

## 5. Database Schema (PostgreSQL)

### Table: users

| Column      | Type      | Constraints    |
|-------------|-----------|----------------|
| id          | UUID      | Primary Key    |
| email       | String    | Unique         |
| created_at  | Timestamp |                |

### Table: receipts

| Column         | Type    | Constraints                                    |
|----------------|---------|------------------------------------------------|
| id             | UUID    | Primary Key                                    |
| user_id        | UUID    | Foreign Key → users.id                         |
| image_url      | String  |                                                |
| merchant_name  | String  |                                                |
| purchase_date  | Date    |                                                |
| total_amount   | Decimal |                                                |
| tax_amount     | Decimal |                                                |
| status         | Enum    | pending, complete, manual_review               |
| created_at     | Timestamp |                                              |

### Table: line_items

| Column       | Type    | Constraints                   | Notes                                                    |
|--------------|---------|-------------------------------|----------------------------------------------------------|
| id           | UUID    | Primary Key                   |                                                          |
| receipt_id   | UUID    | Foreign Key → receipts.id     |                                                          |
| description  | String  |                               |                                                          |
| category     | String  |                               | Inferred by LLM (e.g., Food, Utilities, Entertainment)   |
| quantity     | Integer |                               |                                                          |
| unit_price   | Decimal |                               |                                                          |
| total_price  | Decimal |                               |                                                          |

### Table: categories (Optional/Advanced)

| Column               | Type    | Constraints               |
|----------------------|---------|---------------------------|
| id                   | UUID    | Primary Key               |
| user_id              | UUID    | Foreign Key → users.id    |
| name                 | String  |                           |
| monthly_budget_limit | Decimal |                           |

## 6. Containerization Strategy

The application will be defined in a `docker-compose.yml` for easy orchestration.

### Services

#### frontend
- **Build context**: `./frontend`
- **Port**: 3000

#### backend
- **Build context**: `./backend`
- **Port**: 8000
- **Environment**: AWS credentials, OpenAI API Key, DB connection string

#### db
- **Image**: `postgres:16-alpine`
- **Port**: 5432
- **Volume**: `./postgres-data:/var/lib/postgresql/data`

## 7. Future Enhancements (Roadmap)

### Vector Search
- Store line item embeddings to allow searching "When did I last buy milk?"

### Email Integration
- Forward digital receipts to a dedicated email address for auto-processing.

### Multi-Page Support
- Handling PDF invoices with multiple pages using LangGraph mapping.

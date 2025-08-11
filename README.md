# Simple PIM

A modern Product Information Management platform that centralizes product data, supports omnichannel distribution, and enables teams to collaborate efficiently.

## Vision

The long-term goal is a scalable, extensible system comparable to [Bluestone PIM](https://help.bluestonepim.com/1-get-started-with-bluestonepim) and [Akeneo](https://help.akeneo.com/serenity).

## Features

- Dashboard & Admin Interface: Interactive dashboard showing product counts, enrichment status, and recent activity.
- Product Management: Admin panel with product list, search/filter, and a tabbed product detail editor.
- Attribute Management: Create and manage attribute groups.
- Attribute Export: Download a flattened CSV of all attributes across groups at /api/attribute-groups/flat/export.
- AI-Powered Suggestions: Get AI-based suggestions for product names and attributes.
- Data Export: Export products and tags to CSV.
- Tagging and Filtering: Advanced filtering options, including by tags and stock status.
- Shareable URLs: Filters are reflected in the URL for easy sharing.
- Bulk Tagging Preview: Admin tool at /admin/bulk-tags with API /api/products/tags/bulk-preview to preview adding/removing tags to many SKUs (no persistence).

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/basstian-ai/simple-pim-1754492683911.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the development server
   ```sh
   npm run dev
   ```
4. Open your browser and navigate to http://localhost:3000

## PIM Development Roadmap

### 1. Dashboard & Admin Interface (Immediate Priority)
- Build an interactive dashboard showing product counts, enrichment status and recent activity.
- Implement a responsive admin panel with product list, search/filter, and a tabbed product detail editor.
- Provide inline editing, variant management and attribute grouping.
- Deliver navigation, breadcrumbs and user-friendly layouts across desktop and mobile.

### 2. Sample Product Data & Examples (Immediate Priority)
- Create a realistic sample dataset with categories, attributes, variants and media.
- Use this dataset in documentation, tests and UI examples.
- Provide scripts to import/export the sample data.

### 3. Core PIM Foundation
- Design database schema for products, categories, attributes, variants and media with versioning/audit tables.
- Expose CRUD APIs for all core entities (REST and GraphQL).
- Include basic unit tests for APIs and core services.

### 4. Enrichment & Workflow
- Implement enrichment dashboard showing completeness per channel/locale.
- Support bulk editing and validation rules for required attributes.
- Add localization with translation service integration.
- Provide workflow states (draft → review → approved → published) with transition rules.

### 5. Import/Export & Integration
- Create CSV/Excel import pipeline with mapping and error reporting.
- Build connector framework for channel exports (eCommerce platforms, marketplaces, print).
- Deliver event-driven updates via webhooks.
- Harden public APIs for third‑party consumption.

### 6. Advanced Capabilities
- Add DAM module for managing and transforming assets.
- Support product relationships (bundles, accessories, replacements).
- Introduce AI‑assisted enrichment such as automatic descriptions and categorization.
- Enhance search with facets, synonyms and suggestions.

### 7. Governance & Scale
- Implement RBAC with fine‑grained permissions and SSO support.
- Provide audit logging for user actions and API calls.
- Add monitoring, backups and horizontal scaling strategy.

## Success Metrics
- Data completeness and validation error rates.
- Time‑to‑market for new products.
- Adoption of channels/locales and workflow efficiency.


## License

Distributed under the MIT License. See LICENSE for more information.

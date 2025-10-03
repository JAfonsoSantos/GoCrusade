# Crusade v2 - Retail Media Campaign Manager

A modern retail media campaign management platform built with React, TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📖 60-Second Demo Script

### 1. **Pipeline Management** (Kanban)
- Navigate to **Pipeline** (`/pipeline`)
- Drag a deal from "Proposal" to "Negotiation" stage
- Watch the stage totals update in real-time
- Switch to List view to see all opportunities

### 2. **Create a Campaign** (5-Step Wizard)
- Press `⌘K` (or `Ctrl+K`) to open Command Palette
- Select **"New Campaign"**
- **Step 1**: Fill in campaign name, select advertiser (e.g., "Sonae MC"), and property (e.g., "Continente.pt")
- **Step 2**: Link to existing opportunities (optional)
- **Step 3**: Add 2 flights:
  - Flight 1: Hero Banner, CPM €5.00, 100k impressions goal
  - Flight 2: Sponsored Listing, CPC €0.50, 10k clicks goal
- **Step 4**: Add creatives (optional)
- **Step 5**: Review and click **"Create Campaign"**

### 3. **View Campaign Timeline** (Gantt)
- Navigate to **Campaigns** (`/campaigns`)
- See your new campaign on the timeline
- Expand a campaign to view its flights
- Filter by advertiser, brand, or status

### 4. **Edit a Flight** (Drawer)
- Click on any flight bar in the Gantt timeline
- The **Flight Drawer** opens with tabs:
  - **General**: Change rate type (CPM/CPC/CPA/Flat), pricing, goals
  - **Targeting**: Set geo, keywords, device, audience
  - **Caps**: Configure daily/lifetime caps and frequency
  - **Creatives**: Attach creatives to the flight
  - **Delivery**: View real-time performance metrics
- Make changes and click **Save**
- Watch the timeline bar update

### 5. **Manage Advertisers, Brands & Contacts**
- Go to **Pipeline → Advertisers**
- Add a new advertiser or edit existing ones
- Navigate to **Brands** tab to manage brands under advertisers
- Check **Contacts** to see key account contacts

### 6. **Integration Setup** (Mock)
- Press `⌘K` → select **"Integrations"**
- Click **Salesforce** or **Kevel** integration
- Follow the Intercom-style wizard:
  - Connect → Map Objects → Map Attributes → Define Import Scope → Dry Run → Schedule
- Mapping settings persist in the demo store

## 🎯 Key Features

### Pipeline Management
- **Kanban Board**: Drag-and-drop deals across stages (Prospecting, Qualification, Proposal, Negotiation, Closed Won/Lost)
- **List View**: Table view with sorting and filtering
- **Stage Mirroring**: Automatically syncs with Salesforce stages (when enabled)
- **Quick Actions**: Create, edit, and link opportunities to campaigns

### Campaign & Flight Management
- **Gantt Timeline**: Visualize campaigns and flights with color-coded health indicators
  - 🟢 Green: On pace (≥95% of goal)
  - 🟡 Amber: At risk (80-95%)
  - 🔴 Red: Behind (<80%)
- **Flight Types**:
  - Fixed dates (solid bar)
  - Always-on (bar with → arrow)
  - Goal-only (dashed bar)
- **Pricing Models**: CPM, CPC, CPA, Flat Fee
- **Goal Types**: Impressions, Clicks, Revenue, Spend
- **Pacing**: Real-time delivery tracking vs. planned goals

### Flight Drawer (Editor)
- **General**: Name, dates, pricing, goals, caps, pacing
- **Targeting**: Geo, keywords, device, audience segments
- **Caps**: Daily/lifetime impression caps, frequency capping
- **Creatives**: Attach and manage creatives (display, native, video)
- **Delivery**: Real-time stats (impressions, clicks, spend, CTR)

### Quick Navigation
- **Command Palette** (`⌘K` or `Ctrl+K`):
  - Quick actions: New Campaign, New Deal
  - Navigate: Dashboard, Pipeline, Campaigns, Advertisers, etc.
  - Search: Campaigns, opportunities, advertisers
  - Fast workflow for power users

### Data Management
- **Advertisers**: Parent accounts and brands
- **Brands**: Product brands under advertisers
- **Contacts**: Key stakeholders and decision-makers
- **Properties**: Publisher sites/apps (e.g., Continente.pt, Wells.pt)
- **Ad Units**: Inventory placements (IAB standard sizes)

### Integrations (Demo)
- **Salesforce**: Sync accounts, contacts, opportunities
  - Object mapping (Account → Advertiser, Opportunity → Campaign)
  - Attribute mapping with direction control (SF→CRU, CRU→SF, Two-way)
  - Import scope filtering (All, Owners, Teams)
  - Dry run preview before sync
- **Kevel**: Ad server integration
  - Network connection
  - Inventory sync (ad units/sizes)
  - Feature picker (Geo, Keywords, Frequency Cap, etc.)
  - Entity mapping (push/import campaigns & flights)

## 🏗️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router v6
- **UI Components**: Radix UI primitives
- **Charts**: Recharts
- **Gantt**: gantt-task-react
- **Drag & Drop**: react-beautiful-dnd, @dnd-kit
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner (toast)

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          # AppSidebar, Topbar, AppLayout
│   ├── ui/              # shadcn/ui components
│   └── CommandPalette.tsx
├── demo/
│   ├── demoData.ts      # Seed data (advertisers, campaigns, flights, etc.)
│   └── DemoProvider.tsx # Zustand store
├── features/
│   └── flights/
│       └── FlightDrawer.tsx  # Flight editor with tabs
├── lib/
│   ├── types.ts         # TypeScript interfaces
│   ├── pacing.ts        # Pacing calculations
│   ├── utils.ts         # Utility functions
│   └── supabase.ts      # Supabase client (future)
├── pages/
│   ├── Campaigns.tsx           # Gantt timeline
│   ├── Pipeline.tsx            # Kanban + List
│   ├── Home.tsx                # Dashboard
│   ├── Integrations.tsx        # Integration hub
│   ├── campaigns/
│   │   ├── NewCampaign.tsx    # 5-step wizard
│   │   └── CampaignDetail.tsx
│   ├── pipeline/
│   │   ├── Advertisers.tsx
│   │   ├── Brands.tsx
│   │   └── Contacts.tsx
│   └── integrations/
│       ├── SalesforceIntegration.tsx
│       └── KevelIntegration.tsx
└── App.tsx              # Routes
```

## 🎨 Design System

The app uses semantic color tokens defined in `index.css` and `tailwind.config.ts`:

- **Primary**: Brand color for CTAs and highlights
- **Pacing Colors**:
  - `--pacing-good`: Green (on track)
  - `--pacing-warning`: Amber (at risk)
  - `--pacing-danger`: Red (behind)
- **Dark Mode**: Automatic theme switching

## 🌍 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# App Configuration
VITE_APP_ENV=demo
VITE_APP_ORG_NAME=Kevel Demo
VITE_DEFAULT_CURRENCY=EUR
VITE_TIMEZONE=Europe/Lisbon

# Supabase (for future backend)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# Email Service (Resend)
VITE_RESEND_API_KEY=

# OAuth providers
VITE_OAUTH_GOOGLE_CLIENT_ID=
VITE_OAUTH_GOOGLE_CLIENT_SECRET=
VITE_OAUTH_MS_CLIENT_ID=
VITE_OAUTH_MS_CLIENT_SECRET=

# Kevel Integration
VITE_KEVEL_API_KEY=
VITE_KEVEL_NETWORK_IDS=1
```

## 🧪 Demo Data

The app comes pre-loaded with demo data:

- **3 Advertisers**: Sonae MC, Jerónimo Martins, ECI
- **6 Brands**: Continente, Pingo Doce, Wells, Bagga, Aki, Jumbo
- **8 Opportunities**: Spread across pipeline stages with budgets (EUR)
- **4 Campaigns**: Active, scheduled, and completed campaigns
- **10 Flights**: Mix of CPM, CPC, CPA, and Flat Fee pricing models (including always-on flights)
- **Properties**: Continente.pt, Wells.pt, Pingo Doce
- **Ad Units**: IAB standard sizes (Billboard 970×250, Leaderboard 728×90, etc.)

All data is managed through Zustand and persists during the session.

## 🔮 Roadmap

### MVP Completed ✅
- Pipeline (Kanban + List)
- Campaign creation wizard
- Gantt timeline with health indicators
- Flight drawer with full editing
- Advertiser/Brand/Contact management
- Command Palette
- Integration wizards (Salesforce, Kevel)

### Coming Soon
- Backend integration (Supabase/Lovable Cloud)
- Real Salesforce & Kevel API connections
- Creative validation and upload
- Rate cards and forecasting
- Multi-network management
- Advanced reporting & analytics
- Email notifications (Resend)
- User authentication & RBAC

---

## 📝 Original Lovable Project Info

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/31938d3a-341f-4af6-ab64-6618b5536e74) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/31938d3a-341f-4af6-ab64-6618b5536e74) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

# 🎨 Minimalist Light UI Design System & Specification

## 1. Design Vision & Philosophy
The **AetherFund** interface is built on modern minimalist light design principles (inspired by Stripe, Linear, and Vercel Light UI). 
Web3 application interfaces are inherently complex with technical details (gas fees, transaction hashes, public keys, cryptographic states). To maximize usability and user trust, the UI eliminates dark modes, heavy textures, and purple tones, replacing them with:
- **Pure Whitespace & Breathing Room**: Generous margins and double padding for visual clarity.
- **High-Contrast Typography**: Slate black and crisp gray hierarchy on an ultra-clean off-white background.
- **Subtle Elevation & Borders**: Thin 1px subtle borders (`#E2E8F0`) with micro-shadows instead of heavy drop shadows.
- **Purposeful Color Tokens**: Clean slate base with vibrant Teal & Ocean Blue primary actions, emerald success badges, amber voting alerts, and subtle status tags.

---

## 2. Color Palette & Tokens

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| `--bg-main` | `#F8FAFC` | Main application background (Slate 50) |
| `--bg-card` | `#FFFFFF` | Container cards, modal contents, inputs |
| `--bg-subtle` | `#F1F5F9` | Tab background, hover states, secondary pill tags |
| `--border-color` | `#E2E8F0` | Subtle, clean 1px border dividers |
| `--border-hover` | `#CBD5E1` | Interactive hover state border |
| `--text-primary` | `#0F172A` | Primary headings, titles, and active text (Slate 900) |
| `--text-secondary` | `#475569` | Body paragraphs, key labels (Slate 600) |
| `--text-muted` | `#94A3B8` | Subtitles, block numbers, timestamps (Slate 400) |
| `--primary-brand` | `#0D9488` | Primary Teal CTA buttons, active state indicators |
| `--primary-brand-hover` | `#0F766E` | Hover state for primary buttons |
| `--accent-cyan` | `#0284C7` | Ocean Cyan accent, gradient pairing, category tags |
| `--accent-emerald` | `#10B981` | Successful funding, approved milestone payout, balance |
| `--accent-amber` | `#D97706` | Voting active alert, proposal pending state |
| `--accent-red` | `#EF4444` | Refund claim, campaign failed, vote reject |

---

## 3. Typography System

- **Primary Font**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Heading Font**: `Outfit`, `Inter`, `sans-serif`
- **Monospace Font** (Addresses, Tx Hashes, ETH Balances): `JetBrains Mono`, `ui-monospace`, `monospace`

| Style Level | Font Size | Weight | Line Height |
| :--- | :--- | :--- | :--- |
| **Page Title** | `1.5rem` (24px) | 700 (Bold) | `1.2` |
| **Section Heading** | `1.25rem` (20px) | 600 (Semi-Bold) | `1.3` |
| **Card Title** | `1.05rem` (16.8px) | 600 (Semi-Bold) | `1.35` |
| **Body Text** | `0.925rem` (14.8px) | 400 (Regular) | `1.5` |
| **Caption / Label** | `0.775rem` (12.4px) | 500 (Medium) | `1.4` |

---

## 4. Design Prompt Strategy for AI & UI Generators

When generating or scaling components for this application, use the following standardized prompt template:

> **Minimalist Teal Light Web3 UI Prompt**:
> *"Design an ultra-clean, minimalist light-themed Web3 dApp interface. Use an off-white background (#F8FAFC), pure white card surfaces (#FFFFFF) with 1px subtle borders (#E2E8F0), and crisp Slate typography (#0F172A). Primary actions should use a solid Teal CTA (#0D9488) paired with Ocean Cyan (#0284C7). Incorporate generous whitespace, subtle 1px border elevation, pill-shaped network badges, crisp monospace font for wallet addresses, and clear progress bars with clean percentage labels. Avoid purple tones, dark backgrounds, heavy textures, or glowing neon effects."*

---

## 5. UI Component Hierarchy
1. **Top Header**: Logo + Brand Title + Primary "Create Campaign" Action + Dual-Mode Wallet Status Badge (Sandbox vs. MetaMask).
2. **Stats Bar**: 4-column metric card grid displaying Total Value Funded, On-Chain Backers, Active Projects, and Governance Status.
3. **Controls & Navigation**: Segmented tab control (Explore Campaigns / DAO Milestone Governance / Solidity Architecture) + Search & Category Filters.
4. **Campaign Grid**: Responsive card grid with project image, category tag, status badge, progress bar, deadline countdown, and details CTA.
5. **Interactive Modals**: Minimalist dialog windows with clean tabs, ETH contribution input, milestone voting list, backer log, and creator proposal actions.

export type IterationId = 'original' | 'v1' | 'v2';

export interface IterationChange {
  area: string;
  rationale: string;
}

export interface IterationSpec {
  id: IterationId;
  indexLabel: string;
  name: string;
  methodology: string;
  url: string;
  shortUrl: string;
  summary: string;
  primaryShift: string;
  changes: IterationChange[];
}

export interface HeuristicMapping {
  number: string;
  heuristic: string;
  baselineGap: string;
  v2Implementation: string;
}

export const ITERATIONS: IterationSpec[] = [
  {
    id: 'original',
    indexLabel: '00',
    name: 'Original Replica',
    methodology: 'Baseline · Existing Experience',
    url: 'https://original-replica-beta.vercel.app',
    shortUrl: 'original-replica-beta.vercel.app',
    summary:
      'Faithful baseline replica preserving the existing SimplyGo web portal structure: top-level announcement carousel, four-card service grid, and a separate SimplyGo Portal drawer for account actions.',
    primaryShift: 'Reference baseline prior to task-flow consolidation',
    changes: [
      {
        area: 'Account Entry',
        rationale:
          'Separates commuter account interactions into an external SimplyGo Portal modal rather than integrating them into primary app workflows.',
      },
      {
        area: 'Card Discovery',
        rationale:
          'Groups cards and charms by visual showcase without surfacing upfront pricing, stored-value breakdown, or purchase locations inline.',
      },
      {
        area: 'Navigation Pattern',
        rationale:
          'Relies on top-bar section switching (Home, Cards, App, Services, Locations) without global search or cross-section quick-lookups.',
      },
    ],
  },
  {
    id: 'v1',
    indexLabel: '01',
    name: 'Version 1',
    methodology: 'Iteration 01 · Intuitive Accounts',
    url: 'https://original-replica-qojp.vercel.app',
    shortUrl: 'original-replica-qojp.vercel.app',
    summary:
      'Redesigned around intuitive commuter accounts and mental-model task alignment. Eliminates the detached portal modal so card balances, Auto Top-Up rules, and purchase clarity live directly in context.',
    primaryShift: 'Unified account controls + upfront pricing & stockist metadata',
    changes: [
      {
        area: 'Inline Account Management',
        rationale:
          'Removes the disconnected SimplyGo Portal drawer and embeds card balances, Auto Top-Up thresholds, and instant top-up actions directly inside the SimplyGo App workspace.',
      },
      {
        area: 'Transparent Card Metadata',
        rationale:
          'Adds explicit price/fee and where-to-buy details directly onto EZ-Link cards, LED charms, and concession passes (Adult, PAssion Silver, Student, Child, PWD) to eliminate guesswork.',
      },
      {
        area: 'Task-Oriented Quick Lookups',
        rationale:
          'Introduces direct commuter shortcuts for everyday account needs—travel claims, missed tap-outs, concession status, and Auto Top-Up setup—reducing navigation depth.',
      },
    ],
  },
  {
    id: 'v2',
    indexLabel: '02',
    name: 'Version 2',
    methodology: "Iteration 02 · Nielsen's 10 Heuristics",
    url: 'https://enhancedversion2.vercel.app',
    shortUrl: 'enhancedversion2.vercel.app',
    summary:
      "Systematically audited and upgraded against Jakob Nielsen's 10 Usability Heuristics—adding live Ticket Office stock visibility, global search, keyboard escape exits, and error-preventing estimators.",
    primaryShift: 'Live status feedback, global search & heuristic error prevention',
    changes: [
      {
        area: 'Live Ticket Office Stock & Timestamps',
        rationale:
          'Applies Visibility of System Status with real-time inventory indicators (In stock, Under 10 left, 4 pieces remaining, Sold out) and freshness timestamps across MRT Ticket Offices.',
      },
      {
        area: 'Global Search & Safe Exits',
        rationale:
          'Supports User Control & Freedom and Flexibility via instant search across charms, cards, fares, and MRT stations, one-click query clearing, Back to Home links, and Escape-key modal dismissal.',
      },
      {
        area: 'Concession Estimator & Stock Legend',
        rationale:
          'Prevents errors and lowers cognitive load through a unified Cards & Charms hub, standardized Price / Rate and Where to Buy / Apply tables, Singpass links, and an interactive Concession & Pass Estimator.',
      },
    ],
  },
];

export const NIELSEN_HEURISTICS_MAP: HeuristicMapping[] = [
  {
    number: 'H1',
    heuristic: 'Visibility of System Status',
    baselineGap: 'No indication of physical charm/card availability before visiting a Ticket Office.',
    v2Implementation:
      'Live counter stock statuses ("In stock at counter", "4 pieces remaining", "Sold out islandwide") paired with freshness timestamps ("Updated 5 mins ago").',
  },
  {
    number: 'H2',
    heuristic: 'Match Between System & Real World',
    baselineGap: 'Generic portal terminology disconnected from commuter transit habits.',
    v2Implementation:
      'Commuter-native phrasing ("Track trips, automate top-ups, pay ERP/EV", "Apply via Singpass") and exact MRT interchange line codes (e.g. NS24 / NE6 / CC1).',
  },
  {
    number: 'H3',
    heuristic: 'User Control & Freedom',
    baselineGap: 'Modal previews and deep sub-views lacked rapid escape or clear reset paths.',
    v2Implementation:
      'Explicit "Clear search query" action, Escape-key modal close handler, and contextual "Back to Home" navigation links inside App and Locations views.',
  },
  {
    number: 'H4',
    heuristic: 'Consistency & Standards',
    baselineGap: 'Cards, charms, and concession rules varied in structure across tabs.',
    v2Implementation:
      'Unified Cards & Charms Hub with standardized "Price / Rate", "Where to Buy / Apply", and "Ticket Office Stock Status Legend" formatting.',
  },
  {
    number: 'H5',
    heuristic: 'Error Prevention',
    baselineGap: 'Sold-out items and concession eligibility ambiguities caused wasted trips.',
    v2Implementation:
      'Desaturated grayscale/opacity treatment on sold-out offices plus an interactive Concession & Pass Estimator before application.',
  },
  {
    number: 'H6',
    heuristic: 'Recognition Rather Than Recall',
    baselineGap: 'Users had to remember which tab housed fare calculators or charm stockists.',
    v2Implementation:
      'Prominent "Quick lookups" shortcuts (Cards & Charms Stock →, SimplyGo App →, Fare Calculator →) directly adjacent to global search.',
  },
  {
    number: 'H7',
    heuristic: 'Flexibility & Efficiency of Use',
    baselineGap: 'Returning commuters had to traverse menus for repeat lookups.',
    v2Implementation:
      'Unified search bar supporting cards, charms, fares, and MRT stations, plus home-level ticket office selector filtering.',
  },
  {
    number: 'H8',
    heuristic: 'Aesthetic & Minimalist Design',
    baselineGap: 'Competing promotional blocks diluted primary commuter actions.',
    v2Implementation:
      'Tighter visual hierarchy balancing hero commuter guidance with structured, scannable card grids and restrained metadata.',
  },
  {
    number: 'H9',
    heuristic: 'Help Users Recognize, Diagnose & Recover from Errors',
    baselineGap: 'Travel claims, missed tap-outs, and stock shortages lacked clear recovery paths.',
    v2Implementation:
      'Direct error-recovery lookups for missed tap-out claims, explicit restocking timeframes ("Restocking next week"), and alternative stockist guidance.',
  },
  {
    number: 'H10',
    heuristic: 'Help & Documentation',
    baselineGap: 'Eligibility rules and concession terms required hunting across nested service pages.',
    v2Implementation:
      'Inline "Ticket Office Stock Status Legend", concise concession eligibility notes, and scannable "Where to Buy / Apply" reference blocks.',
  },
];

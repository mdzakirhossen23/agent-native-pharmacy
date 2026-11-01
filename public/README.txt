# Agent-Native Hackathon — Pharmacy workspace

By MD ZAKIR HOSSAIN. Developed during the 2026 hackathon with AI coding assistance.
Live: https://agent-native.baharsoftbd.com/
Source: https://github.com/mdzakirhossen23/agent-native-pharmacy
Guide: https://agent-native.baharsoftbd.com/project.html

## Practical workflows

Medicine catalogue and photos; editable country/generic/medicine choices; supplier purchases with batch expiry; FEFO stock allocation; prescription review; POS cash/credit sales; customer and supplier ledgers; due collection; printable receipts; quarantine returns; gross-profit and cash-flow reports. No real payments are processed.

The AI answers from computed shop records and proposes restocking existing catalogue IDs. Owners review quantities and approve a purchase draft. Receiving the delivery remains a separate human action. No treatment, dosage or substitution advice is provided.

English, Bengali, Arabic, Dutch and German are supported. Bengali displays BDT; other languages show reference USD values with the rate date. The base ledger remains integer BDT paisa. The dark desktop window has responsive forms and internal scrolling.

## Actual Agent-Native integration

pharmacy-actions.mjs imports defineAction from @agent-native/core/action version 0.222.2. Eleven real framework actions cover catalogue, purchasing, checkout, return, reviewed AI drafts, contacts, payments, shop details and reusable lists. No substitute defineAction is used.

browser-actions.js is only transport. browser-storage.js reads the current IndexedDB snapshot under a browser lock, sends the snapshot and action arguments to /api/pharmacy/:action, and atomically stores the successful returned snapshot. The server runs the actual framework handler inside an isolated AsyncLocalStorage request context. It does not persist the submitted shop records. Both manual interactions and approved AI drafts use these actions. /api/capabilities exposes the registered actions.

The model cannot directly approve its own draft, complete a sale or transfer money. The shared action validates the human-approved arguments before the browser commits the result.

## Storage and limits

Business records, photos and translated text are saved in browser IndexedDB. Clearing site data removes them. Settings has Export backup and Load backup; a previous restore copy and original migration copy are kept for recovery. Different browsers have separate records.

Internet is required to validate changes through the framework, generate AI answers and request uncached translations. This is not a full offline/PWA app. Snapshots are transmitted over HTTPS for the requested operation without being written to the server shop database. AI receives selected bookkeeping/inventory facts. Credentials remain server-side.

pharmacy-db.mjs remains only for one-time migration of previous SQLite workspaces via /api/workspace. Normal actions and AI do not read or write that database. The legacy database is outside the public directory.

This is stock and bookkeeping software, not a clinical catalogue or payment gateway. The starter list is small and not a complete national register. Illustrations do not identify real medicines. Gross profit excludes operating expenses and taxes.

## Build

Node.js 20.20.2+ is required. Run npm ci, npm run build, then npm start. Configure the server-only OPENAI_API_KEY environment variable and optionally OPENAI_MODEL (default gpt-4.1-mini). PORT defaults to 8080.

The pharmacy-release folder contains server.mjs, sql-wasm.wasm, ui-sources.json and public/. On cPanel retain the existing environment/private migration data, copy the release, and restart the Node app. A startup file may use import('./server.mjs').

## Validation

npm run check verifies syntax. Tests under tests/ cover FEFO, expiry blocking, prescription review, exact sale totals, replay protection, returns, cash/credit accounting, FIFO due allocation, reusable-list CRUD and migration. The bridge test uses an isolated local server and checks that actions do not update the legacy database file. Browser verification covers migration, save/reload, backup restore and responsive forms. Do not run test sales against real shop records.

## Provenance

This pharmacy implementation was developed during the hackathon using Agent-Native, Zod, sql.js, Vite and esbuild. No third-party POS source was copied. Original programmatic sample illustrations replace earlier demonstration photographs. User-uploaded photos remain the user's responsibility and are not in the repository. The starter name list links to factual manufacturer/regulator references. Earlier online medicine/image discovery experiments are absent from the active workflow. See THIRD-PARTY-NOTICES.txt.

A public Clips recording and the official submission are separate tasks; a live app or repository alone is not a submitted entry.

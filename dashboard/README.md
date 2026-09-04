# Cordials Dashboard

The dashboard is the local human interface to the Cordials repository. It reads the existing Markdown and CSV records on every request; it does not copy them into a separate database.

## Start on this computer

Double-click `start-dashboard.bat` in the repository root, or run this from the repository root:

```powershell
node dashboard\server.js
```

Open <http://127.0.0.1:4173>.

The application has no third-party runtime dependencies. Node.js 20 or newer is required.

## Phone-accessible hosted mirror

Open the private [Cordials Control Room](https://cordials-control-room.adonath.chatgpt.site) while signed in to the same ChatGPT account. The phone view can browse every surfaced brief, research decision, recipe, batch, shopping item and source record. It does not currently write changes. Its data come from `dashboard/data-snapshot.json` on the public GitHub `main` branch. Repository pushes automatically refresh that snapshot through `.github/workflows/refresh-dashboard-snapshot.yml`; the hosted page reads the latest snapshot and canonical Markdown/CSV records directly from GitHub.

Use the local café-computer dashboard for feedback, notes and shopping-state changes. Formulation edits remain repository work. The hosted view is labelled as viewing mode so this distinction is visible rather than implied.

If you prefer npm in PowerShell, use `npm.cmd --prefix dashboard start`. Some Windows installations block the `npm.ps1` wrapper under their PowerShell execution policy; calling `npm.cmd` avoids that wrapper and does not require weakening the policy.

## Open from a phone on the same Wi-Fi

1. Connect the computer and phone to the same trusted private Wi-Fi network.
2. Double-click `start-dashboard-lan.bat`.
3. If Windows Firewall asks, allow Node.js only on **Private networks**.
4. In PowerShell, run `ipconfig` and find the computer's IPv4 address for the active Wi-Fi adapter, for example `192.168.1.42`.
5. On the phone, open `http://192.168.1.42:4173`, substituting the actual address.
6. Close the dashboard terminal when finished; this stops LAN access.

The LAN mode uses plain HTTP and has no authentication. Use it only on a trusted home or café network. It does not expose the dashboard to the public internet unless the network/router is separately configured to do so.

## Data and write behaviour

- Products are discovered from `04_round_1_development/`.
- Professional recipes, sources, batches, application tests, and equipment are read from their existing registers and linked Markdown records.
- Shopping items are derived from the PB-001 shopping/readiness record.
- Feedback, Control Room notes, and shopping changes are appended as JSON Lines records in `dashboard/data/`.
- Historical recipes, raw research imports, professional references, and batch records are read-only in the interface.
- A materially changed formulation should still be created as a new repository version/batch, never by editing history through the dashboard.

The six Round 1 folders do not yet have product-brief IDs or fully machine-readable type/application metadata. The dashboard therefore displays their repository-defined short codes and explicit `UNKNOWN` / not-selected states. PB-001 has complete product, batch, test, provenance, shopping, and research links.

## Future private access

Local-first operation should remain the default. Reasonable future options are:

- a private mesh network such as Tailscale for direct access to the local server;
- a private hosted deployment behind authentication, with repository reads/writes performed by a narrow server-side Git integration;
- a read-only hosted build plus an authenticated feedback service that commits append-only records back through reviewed changes.

Do not expose the LAN server through router port forwarding. Any hosted version should add authentication, encrypted transport, access logs, backups, and a conflict-safe Git synchronisation strategy.

# prj-ui-core: UI Components

This is a standalone Web Component library built with Lit, designed to provide a uniform, responsive, and theme-aware App Shell (`<ui-header>` and `<ui-footer>`) across applications.

## AI Agent Instructions (Context)
**ATTENTION LLMs and AI Assistants:** When working on an application that consumes `ui-core-bundle.js`, you **MUST** adhere to the following slot structure and event API. The components use Shadow DOM and expect content to be injected via named slots. Do NOT attempt to pass properties like `app-title`.

### 1. Header Component (`<ui-header>`)

**HTML Tag:** `<ui-header theme="light|dark">`

#### Slots
- **Left Zone (Identity)**
  - `app-icon`: The logo or SVG representing the app.
  - `app-title`: The application name (e.g., `<div slot="app-title">My App</div>`).
  - `app-description`: The subtitle or contextual description.

- **Center Zone**
  - `app-context`: Main navigation links, tabs, or search bars.

- **Right Zone (Utilities & Actions)**
  - `app-utilities`: Text, badges, or user state (e.g., `<div slot="app-utilities">Connected</div>`). This appears to the left of the separator.
  - `app-actions`: Icon buttons (e.g., GitHub link, Settings icon). This appears to the right of the separator, grouped with the intrinsic Theme Toggle button.

#### Events
- `theme-change`: Fired when the user clicks the built-in sun/moon toggle button. The host application MUST listen to this event and update its global DOM state accordingly.
  - `event.detail.theme` will be either `'light'` or `'dark'`.

### 2. Footer Component (`<ui-footer>`)

**HTML Tag:** `<ui-footer>`

#### Slots
- **Left Zone**
  - `footer-signature`: Identity and signature (e.g., copyright, sys_admin text). Uses monospace styling by default.

- **Center Zone**
  - `footer-repo`: Code repository links, GitHub icons, and license info.

- **Right Zone**
  - `footer-status`: Telemetry, version numbers (e.g., `v1.0.4`), and system status indicators (like pulsing LEDs).

### Global CSS Variables
- `--ui-header-max-width`: Controls the maximum width of the inner content container for both Header and Footer (default: `1440px`).

### Example Integration
```html
<!-- The components are loaded via a single bundle -->
<script type="module" src="ui-core-bundle.js"></script>

<ui-header theme="dark">
  <svg slot="app-icon" viewBox="0 0 24 24">...</svg>
  <div slot="app-title">Capture-TS</div>
  <div slot="app-description">DVB-T Transport Stream Recorder</div>
  
  <div slot="app-utilities"><span class="badge">Online</span></div>
  <button slot="app-actions"><svg>...</svg></button>
</ui-header>

<main>App Content</main>

<ui-footer>
  <div slot="footer-signature">&gt; sys_admin: ~/$ &copy; 2026 Open Source</div>
  <div slot="footer-repo">
    <a href="#">GitHub</a>
    <span>MIT License</span>
  </div>
  <div slot="footer-status">
    <span>v1.0.4-beta</span>
  </div>
</ui-footer>
```

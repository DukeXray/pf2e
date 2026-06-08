/** Add pf2e-journal class to system and flagged world journals */

// Tracks journals that have already been auto-toggled to multiple page mode.
// WeakSet is used so closed journal apps are garbage collected automatically
// rather than accumulating in memory for the session.
const autoToggled = new WeakSet<JournalEntrySheet>();

export const RenderJournalSheet = {
    listen(): void {
        Hooks.on("renderJournalEntrySheet", (app: JournalEntrySheet, html: HTMLElement) => {
            const pack = app.document.pack;

            if (pack) {
                if (pack.startsWith("pf2e.")) {
                    html.classList.add("pf2e-journal");
                }
                // return removed — must fall through to toggle logic below
            } else {
                const styled = app.document.getFlag("pf2e", "styled");
                if (styled) {
                    html.classList.add("pf2e-journal");
                }
            }

            // Auto-switch to multiple page mode on first open only.
            // Guarding with autoToggled prevents the hook from re-firing the
            // toggle on every render, which would prevent the user from
            // manually switching back to single page mode.
            if (!autoToggled.has(app)) {
                autoToggled.add(app);
                const toggleBtn = html.querySelector<HTMLButtonElement>("[data-action='toggleMode']");
                if (toggleBtn?.ariaLabel === "Single Page Mode") {
                    toggleBtn.click();
                }
            }
        });

        Hooks.on("preCreateJournalEntry", (document: JournalEntry, data: object, options: object, userId: string) => {
            const sourceId = ((data as Record<string, unknown>)._stats?.compendiumSource as string) ?? "";
            if (sourceId.startsWith("Compendium.pf2e.")) {
                document.updateSource({
                    "flags.pf2e.styled": true,
                });
            }
        });
    },
};

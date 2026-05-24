/** Add pf2e-journal class to system and flagged world journals */
export const RenderJournalSheet = {
    listen(): void {
        Hooks.on("renderJournalEntrySheet", (app: JournalEntrySheet, html: HTMLElement) => {
            const pack = app.document.pack;

            // Opened directly from a compendium
            if (pack) {
                if (pack.startsWith("pf2e.")) {
                    html.classList.add("pf2e-journal");
                }
                return;
            }

            // World document - check for flag
            const styled = app.document.getFlag("pf2e", "styled");
            if (styled) {
                html.classList.add("pf2e-journal");
            }
        });
    },
};

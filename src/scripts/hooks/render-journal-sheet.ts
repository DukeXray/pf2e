/** Add pf2e-journal class to system and flagged world journals */
export const RenderJournalSheet = {
    listen(): void {
        Hooks.on("renderJournalEntrySheet", (app: JournalEntrySheet, html: HTMLElement) => {
            const pack = app.document.pack;

            if (pack) {
                if (pack.startsWith("pf2e.")) {
                    html.classList.add("pf2e-journal");
                }
                return;
            }

            const styled = app.document.getFlag("pf2e", "styled");
            if (styled) {
                html.classList.add("pf2e-journal");
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

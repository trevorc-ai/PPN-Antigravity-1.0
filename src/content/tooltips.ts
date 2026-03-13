/**
 * Tooltip Content Registry
 * 
 * Centralized tooltip content for use with AdvancedTooltip component.
 * Content is organized by feature area for easy maintenance.
 * 
 * Source: public/Tooltips.md
 */

export const tooltips = {
    // 🛡️ Safety Shield (Drug Interaction Checker)
    safetyShield: {
        interactionCheck: "We check this combination against a clinical reference database for known dangerous reactions.",
        mechanism: "The biological reason why these two drugs interact - for example, they may compete for the same receptor or both raise serotonin levels.",
        severityScore: "The shield color and icon show the risk level. Red with a stop icon: High Risk - do not proceed. Yellow with a caution icon: Monitor closely. Green with a check icon: No known conflicts detected."
    },

    // 📝 Legacy Importer
    legacyImporter: {
        pasteArea: "Copy the text from your old notes and paste it here. Do not worry about formatting.",
        reviewStep: "Check the data below. If we guessed a date or dose wrong, click to edit it.",
        localPrivacy: "This text is processed on your device. It is not sent to the cloud until you click Save."
    },

    // 👁️ Reagent Eye (Test Kit Verifier)
    reagentEye: {
        cameraView: "Center the test strip in the square. Ensure you are in bright, even lighting.",
        colorMatch: "The percentage shows how closely your test strip matches the 'perfect' reaction color.",
        warning: "If the color is murky or brownish, do not proceed."
    },

    // 🤝 Trial Matchmaker
    trialMatchmaker: {
        matchBadge: "This patient fits the profile for a paid clinical trial. Click to view details.",
        payout: "The estimated amount the study sponsor pays for a successful referral.",
        anonId: "Your patient is identified only by this code number to protect their privacy."
    },

    // 🎵 Music Logger
    musicLogger: {
        playlistLink: "Paste the public link to your Spotify or Apple Music playlist here.",
        phase: "Select which part of the session this music is for (e.g., Onset, Peak, Comedown).",
        sync: "We will try to match the song timing with your vital sign logs."
    },

    // 📊 Research Dashboard
    researchDashboard: {
        sparkline: "A mini chart of progress over time. A line going down means symptoms are getting better - lower scores mean less distress.",
        efficacyScore: "The percentage of patients who saw a significant benefit from this substance in published clinical studies.",
        verifiedNode: "This clinician has verified their license and identity with PPN."
    }
} as const;

// Type for tooltip keys (for TypeScript autocomplete)
export type TooltipSection = keyof typeof tooltips;
export type TooltipKey<T extends TooltipSection> = keyof typeof tooltips[T];

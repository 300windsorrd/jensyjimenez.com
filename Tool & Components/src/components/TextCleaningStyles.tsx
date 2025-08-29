/**
 * Component that provides CSS safeguards to prevent unwanted periods from appearing
 */
export default function TextCleaningStyles() {
  return (
    <style jsx>{`
      .no-period {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        font-size: 0 !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
      
      /* Prevent any pseudo-elements from adding periods */
      .text-type__content::after,
      .text-type__content::before {
        content: none !important;
      }
      
      /* Ensure clean text rendering */
      .text-type__content {
        position: relative;
        text-rendering: optimizeLegibility;
        -webkit-font-feature-settings: "liga" 1, "kern" 1;
        font-feature-settings: "liga" 1, "kern" 1;
      }
      
      /* Prevent cursor pseudo-elements from adding content */
      .text-type__cursor::after,
      .text-type__cursor::before {
        content: none !important;
      }
    `}</style>
  )
}

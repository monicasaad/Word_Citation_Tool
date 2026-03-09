import * as React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";
import type { CitationItem } from "./AnalyzeText";
import { selectCommentById } from "../taskpane";
import { CitationFormat, convertCitation } from "../../utils/citationFormat";

interface CitationListProps {
  citations: CitationItem[];
  citationFormat: CitationFormat;
}

const useStyles = makeStyles({
  container: {
    marginTop: "30px",
    marginLeft: "20px",
    marginRight: "20px",
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: "12px",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  helperText: {
    color: tokens.colorNeutralForeground3,
    marginBottom: "10px",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  scrollPane: {
    maxHeight: "300px",
    overflowY: "auto",
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "8px",
    padding: "12px",
    backgroundColor: tokens.colorNeutralBackground1,
  },
  emptyState: {
    color: tokens.colorNeutralForeground3,
  },
  citationCard: {
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
    backgroundColor: tokens.colorNeutralBackground2,
    cursor: "pointer",
  },
  text: {
    wordBreak: "break-word",
  },
});

const CitationList: React.FC<CitationListProps> = ({ citations, citationFormat }) => {
  const styles = useStyles();

  /**
   * Navigates to the in-document citation comment linked to a reference item.
   *
   * @param commentId - The Word comment ID associated with the citation.
   * @returns void
   */
  const handleCitationClick = async (commentId: string): Promise<void> => {
    try {
      const found = await selectCommentById(commentId);

      if (!found) {
        console.log("Could not find the linked citation comment in the document.");
      }
    } catch (error) {
      console.error("Error jumping to citation location:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>References</div>
      <div className={styles.helperText}>Click a reference to jump to its in-text citation.</div>

      <div className={styles.scrollPane}>
        {citations.length === 0 ? (
          <div className={styles.emptyState}>No references yet.</div>
        ) : (
          citations.map((citation) => (
            <div 
              key={citation.id} className={styles.citationCard}
              onClick={() => handleCitationClick(citation.commentId)}
            >
              <div className={styles.text}>
                {convertCitation(citation.citationText, citationFormat)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CitationList;
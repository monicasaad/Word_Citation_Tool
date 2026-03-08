import * as React from "react";
import { makeStyles, tokens } from "@fluentui/react-components";

interface CitationItem {
  id: string;
  selectedText: string;
  sourceId: string;
  citationText: string;
  confidence: number;
  url: string;
}

interface CitationListProps {
  citations: CitationItem[];
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
  },
  label: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "6px",
    marginBottom: "4px",
  },
  text: {
    wordBreak: "break-word",
  },
  link: {
    color: tokens.colorBrandForegroundLink,
    textDecoration: "none",
  },
});

const CitationList: React.FC<CitationListProps> = ({ citations }) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.title}>References</div>

      <div className={styles.scrollPane}>
        {citations.length === 0 ? (
          <div className={styles.emptyState}>No references yet.</div>
        ) : (
          citations.map((citation) => (
            <div key={citation.id} className={styles.citationCard}>
              <div className={styles.text}>{citation.citationText}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CitationList;
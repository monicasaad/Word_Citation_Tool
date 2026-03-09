import * as React from "react";
import { useState } from "react";
import { Button, Field, makeStyles, tokens } from "@fluentui/react-components";
import { getSelectedText, insertCitationAndComment, highlightSelectedText } from "../taskpane";
import { analyzeText, checkHealth, getDocument } from "../../services/api";

export interface CitationItem {
  id: string;
  selectedText: string;
  sourceId: string;
  citationText: string;
  confidence: number;
  url: string;
  commentId: string;
}

interface AnalyzeButtonProps {
  onCitationCreated: (citation: CitationItem) => void;
}

const DOCUMENT_ID = "trustops-handbook-v1";
const USER_ID = "candidate_1";

const useStyles = makeStyles({
  analyzeContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "30px",
  },
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
  message: {
    marginTop: "12px",
    marginBottom: "12px",
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightMedium,
  },
});

function inTextCitation (citation: String) {
  const parts = citation.split(".");

  const author = parts[0]?.trim() || "Unknown";
  // Remove parentheses around year
  const rawYear = parts[1]?.trim() || "n.d.";
  const year = rawYear.replace(/[()]/g, "");

  const inText = `(${author}, ${year})`;

  return inText;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = (props: AnalyzeButtonProps) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const styles = useStyles();

  const handleAnalyze = async () => {
    try {
      setMessage("");
      setIsLoading(true);

      // Check API connection first using health endpoint
      try {
        await checkHealth();
      } catch {
        setMessage("Failed to connect to citation service. Please try again later.");
        return;
      }

      // Check document_id exists if a document_id is being passed to analyzeText
      if(DOCUMENT_ID) {
        try {
          const document = await getDocument();
          
          if (document.document_id !== DOCUMENT_ID) {
            setMessage("No information found on requested document_id.");
            return;
          }
        } catch (error) {
          setMessage("Unable to validate the requested document. Please try again.");
          return;
        }
      }

      // Get selected text
      const selectedText = await getSelectedText();
      // Handle no text selected
      if (!selectedText) {
        setMessage("Please select text before analyzing.");
        return;
      }

      // Analyze selected text
      const result = await analyzeText(selectedText, DOCUMENT_ID, USER_ID);
      // Get in-text citation
      const inText = inTextCitation(result.citation_text);
      // Highlight selected text
      await highlightSelectedText();
      // Insert in-text citation after selection
      const { commentId } = await insertCitationAndComment(inText, result.source_id, result.confidence);

      const newCitation: CitationItem = {
        id: crypto.randomUUID(),
        selectedText: selectedText,
        sourceId: result.source_id,
        citationText: result.citation_text,
        confidence: result.confidence,
        url: result.url,
        commentId: commentId,
      };

      props.onCitationCreated(newCitation);

    } catch (error: any) {
      if (error.message === "ANALYZE_TIMEOUT") {
        setMessage("Citation analysis timed out. Please try again.");
      } else if (error.message === "NO_MATCHING_SOURCE") {
        setMessage("Unable to generate citation. Try refining selection.");
      } else {
        setMessage("Analyze request failed.");
      }
      console.error("Error analyzing text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.analyzeContainer}>
      <Field className={styles.instructions}>Select text in the document, then click Analyze.</Field>

      {message && <div className={styles.message}>{message}</div>}

      <Button appearance="primary" size="large" onClick={handleAnalyze} disabled={isLoading}>
        {isLoading ? "Analyzing..." : "Analyze"}
      </Button>
    </div>
  );
};

export default AnalyzeButton;
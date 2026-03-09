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
    marginTop: "10px",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "10px",
    marginBottom: "10px",
    paddingLeft: "16px",
    paddingRight: "16px",
  },
  message: {
    marginTop: "12px",
    marginBottom: "12px",
    paddingLeft: "16px",
    paddingRight: "16px",
    color: tokens.colorPaletteRedForeground1,
    fontWeight: tokens.fontWeightMedium,
  },
});

/**
 * Converts an APA-style citation string into an in-text citation
 * 
 * Expected format: Author. (Year). Title. url
 * 
 * @param citation - The full citation returned by the analyze endpoint.
 * @returns The formatted in-text citation.
 */
function parseInTextCitation (citation: string): string {
  const parts = citation.split(".");

  const author = parts[0]?.trim() || "Unknown";
  const rawYear = parts[1]?.trim() || "n.d.";
  // Remove parentheses around year
  const year = rawYear.replace(/[()]/g, "");

  const inText = `(${author}, ${year})`;

  return inText;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = (props: AnalyzeButtonProps) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const styles = useStyles();

  /**
   * Validates that the configured document ID matches the backend document metadata.
   *
   * @returns A promise resolving to true if the document ID is valid; otherwise false.
   */
  const validateDocumentId = async (): Promise<boolean> => {
    if (!DOCUMENT_ID) {
      return true;
    }

    const document = await getDocument();
    return document.document_id === DOCUMENT_ID;
  };

  /**
   * Runs the full citation workflow:
   * 1. Check backend health
   * 2. Validate document ID
   * 3. Read selected text from Word
   * 4. Analyze selected text
   * 5. Highlight selected text
   * 6. Insert in-text citation and comment
   * 7. Add citation to the references pane
   *
   * @returns void
   */
  const handleAnalyze = async (): Promise<void> => {
    try {
      setMessage("");
      setIsLoading(true);

      // Confirm the citation service is available before continuing using health endpoint.
      try {
        await checkHealth();
      } catch {
        setMessage("Failed to connect to citation service. Please try again later.");
        return;
      }

      // Confirm the configured document ID is recognized by the backend.
      try {
        const isValidDocument = await validateDocumentId();

        if (!isValidDocument) {
          setMessage("No information found on requested document_id.");
          return;
        }
      } catch {
          setMessage("Unable to validate the requested document. Please try again.");
          return;
      }

      // Read the currently selected text from the Word document.
      const selectedText = await getSelectedText();

      // Handle no text selected
      if (!selectedText) {
        setMessage("Please select text before analyzing.");
        return;
      }

      // Send the selected text to the analyze endpoint.
      const result = await analyzeText(selectedText, DOCUMENT_ID, USER_ID);

      // Build the in-text citation from the full APA-style citation response.
      const inText = parseInTextCitation(result.citation_text);

      // Highlight the original selection in the document.
      await highlightSelectedText();

      // Insert the in-text citation after the selected text and attach a comment.
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "ANALYZE_TIMEOUT") {
          setMessage("Citation analysis timed out. Please try again.");
        } else if (error.message === "NO_MATCHING_SOURCE") {
          setMessage("Unable to generate citation. Try refining selection.");
        } else {
          setMessage("Analyze request failed.");
        }

        console.error("Error analyzing text:", error);
      } else {
        setMessage("Analyze request failed.");
        console.error("Unknown error analyzing text:", error);
      }
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
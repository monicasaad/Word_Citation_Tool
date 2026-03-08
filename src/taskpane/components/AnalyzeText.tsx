
import * as React from "react";
import { useState } from "react";
import { Button, Field, makeStyles, tokens } from "@fluentui/react-components";
import { getSelectedText } from "../taskpane";
import { analyzeText, checkHealth } from "../../services/api";

const DOCUMENT_ID = "trustops-handbook-v10";
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

const AnalyzeButton: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const styles = useStyles();

  const handleAnalyze = async () => {
    try {
      setMessage("");

      // Check API connection first using health endpoint
      try {
        await checkHealth();
      } catch {
        setMessage("Failed to connect to citation service. Please try again later.");
        return;
      }

      // Get selected text
      const selectedText = await getSelectedText();
      // Handle no text selected
      if (!selectedText) {
        setMessage("Please select text before analyzing.");
        return;
      }

      setIsLoading(true);

      const result = await analyzeText(selectedText, DOCUMENT_ID, USER_ID);
      console.log("Analyze result:", result);

    } catch (error) {
      setMessage("Analyze request failed.");
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
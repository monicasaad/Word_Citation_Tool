
import * as React from "react";
import { useState } from "react";
import { Button, Field, makeStyles, tokens } from "@fluentui/react-components";
import { getSelectedText } from "../taskpane";

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
  const styles = useStyles();

  const handleAnalyze = async () => {
    try {
      const selectedText = await getSelectedText();

      if (!selectedText) {
        setMessage("Please select text before analyzing.");
        return;
      }

      setMessage("");
    } catch (error) {
      setMessage("Something went wrong while reading the selected text.");
      console.error("Error getting selected text:", error);
    }
  };

  return (
    <div className={styles.analyzeContainer}>
      <Field className={styles.instructions}>Select text in the document, then click Analyze.</Field>

      {message && <div className={styles.message}>{message}</div>}

      <Button appearance="primary" size="large" onClick={handleAnalyze}>
        Analyze
      </Button>
    </div>
  );
};

export default AnalyzeButton;
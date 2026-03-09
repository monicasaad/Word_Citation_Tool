import * as React from "react";
import { useState } from "react";
import { Button, Field, makeStyles, tokens } from "@fluentui/react-components";
import { insertReferenceList } from "../taskpane";
import type { CitationItem } from "./AnalyzeText";

interface InsertReferenceListProps {
  citations: CitationItem[];
}

const useStyles = makeStyles({
  container: {
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
    textAlign: "center",
  },
});

const InsertReferenceList: React.FC<InsertReferenceListProps> = ({
  citations,
}: InsertReferenceListProps) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const styles = useStyles();

  /**
   * Inserts the full reference list at the end of the document.
   */
  const handleInsertReferenceList = async (): Promise<void> => {
    try {
      setMessage("");
      setIsLoading(true);

      await insertReferenceList(citations);
    } catch (error) {
      setMessage("Failed to insert reference list.");
      console.error("Error inserting reference list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Field className={styles.instructions}>
        Insert all references into the document as a formatted reference list.
      </Field>

      {message && <div className={styles.message}>{message}</div>}

      <Button
        appearance="secondary"
        size="large"
        onClick={handleInsertReferenceList}
        disabled={isLoading || citations.length === 0}
      >
        {isLoading ? "Inserting..." : "Insert Reference List"}
      </Button>
    </div>
  );
};

export default InsertReferenceList;
import * as React from "react";
import { useState } from "react";
import { Button, Field, makeStyles, tokens } from "@fluentui/react-components";
import { insertReferenceList } from "../taskpane";
import type { CitationItem } from "./AnalyzeText";
import { CitationFormat, convertCitation } from "../../utils/citationFormat";

interface InsertReferenceListProps {
  citations: CitationItem[];
  citationFormat: CitationFormat;
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
  citations, citationFormat
}: InsertReferenceListProps) => {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const styles = useStyles();

  /**
   * Inserts the current reference list at the end of the document.
   *
   * The inserted list:
   * - starts on a new page
   * - uses "References" for APA or "Works Cited" for MLA
   * - is sorted alphabetically
   *
   * @returns void
   */
  const handleInsertReferenceList = async (): Promise<void> => {

    try {

      setMessage("");
      setIsLoading(true);

      const sorted = [...citations].sort((a, b) =>
        a.citationText.localeCompare(b.citationText)
      );

      const formattedReferences = sorted.map((citation) =>
        convertCitation(citation.citationText, citationFormat)
      );

      const headingText = citationFormat === "MLA" ? "Works Cited" : "References";

      await insertReferenceList(formattedReferences, headingText);

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
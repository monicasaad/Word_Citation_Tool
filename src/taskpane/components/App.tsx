import * as React from "react";
import { useState } from "react";
import { makeStyles } from "@fluentui/react-components";
import Header from "./Header";
import AnalyzeButton, { CitationItem } from "./AnalyzeText";
import CitationList from "./CitationList";
import InsertReferenceList from "./InsertReferenceList";
import CitationFormatToggle from "./CitationFormatToggle";
import { CitationFormat } from "../../utils/citationFormat";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

const App: React.FC<AppProps> = (props: AppProps) => {
  const styles = useStyles();

  const [citations, setCitations] = useState<CitationItem[]>([]);
  const [citationFormat, setCitationFormat] = useState<CitationFormat>("APA");

  /**
   * Adds a newly created citation to the top of the references list.
   *
   * @param citation - The citation generated from the latest analyze action.
   * @returns void
   */
  const handleCitationCreated = (citation: CitationItem): void => {
    setCitations((prevCitations) => [citation, ...prevCitations]);
  };

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={props.title} message="Welcome" />

      <AnalyzeButton onCitationCreated={handleCitationCreated} />

      <CitationFormatToggle
        format={citationFormat}
        onFormatChange={setCitationFormat}
      />

      <InsertReferenceList
        citations={citations}
        citationFormat={citationFormat}
      />

      <CitationList
        citations={citations}
        citationFormat={citationFormat}
      />
    </div>
  );
};

export default App;

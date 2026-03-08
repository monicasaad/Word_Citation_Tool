import * as React from "react";
import { useState } from "react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import TextInsertion from "./TextInsertion";
import AnalyzeButton, { CitationItem } from "./AnalyzeText";
import CitationList from "./CitationList";
import { makeStyles } from "@fluentui/react-components";
import { Ribbon24Regular, LockOpen24Regular, DesignIdeas24Regular } from "@fluentui/react-icons";
import { insertCitationAfterSelection } from "../taskpane";

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

  const handleCitationCreated = (citation: CitationItem) => {
    setCitations((prevCitations) => [citation, ...prevCitations]);
  };

  return (
    <div className={styles.root}>
      <Header logo="assets/logo-filled.png" title={props.title} message="Welcome" />
      <AnalyzeButton onCitationCreated={handleCitationCreated} />
      <CitationList citations={citations} />
    </div>
  );
};

export default App;

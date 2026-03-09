import * as React from "react";
import { Switch, makeStyles } from "@fluentui/react-components";
import { CitationFormat } from "../../utils/citationFormat";

interface CitationFormatToggleProps {
  format: CitationFormat;
  onFormatChange: (format: CitationFormat) => void;
}

const useStyles = makeStyles({
  container: {
    marginTop: "20px",
    marginLeft: "20px",
  },
});

const CitationFormatToggle: React.FC<CitationFormatToggleProps> = ({
  format,
  onFormatChange,
}) => {

  const styles = useStyles();

  /**
   * Toggles the citation format between APA and MLA.
   *
   * @returns void
   */
  const handleToggle = (): void => {
    onFormatChange(format === "APA" ? "MLA" : "APA");
  };

  return (
    <div className={styles.container}>
      <Switch
        checked={format === "MLA"}
        label={`Citation Style: ${format}`}
        onChange={handleToggle}
      />
    </div>
  );
};

export default CitationFormatToggle;
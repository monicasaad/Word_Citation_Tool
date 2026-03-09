import * as React from "react";
import { Image, tokens, makeStyles } from "@fluentui/react-components";

export interface HeaderProps {
  title: string;
  logo: string;
  message: string;
}

const useStyles = makeStyles({
  welcome__header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "10px",
    paddingTop: "20px",
    paddingLeft: "10px",
    paddingRight: "10px",
    backgroundColor: tokens.colorNeutralBackground3,
  },
  message: {
    fontSize: tokens.fontSizeHero700,
    fontWeight: tokens.fontWeightRegular,
    fontColor: tokens.colorNeutralBackgroundStatic,
    textAlign: "center"
  },
});

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { title, logo, message } = props;
  const styles = useStyles();

  return (
    <section className={styles.welcome__header}>
      <Image width="90" height="90" src={logo} alt={title} />
      <h2 className={styles.message}>{message}</h2>
    </section>
  );
};

export default Header;

import { useState } from "react";
import { Box } from "@mui/material";
import styles from "./styles.module.scss";
import DeleteIcon from '@mui/icons-material/Delete';

const Notice = ({ children, status, mini, dismissible, style }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <Box
      style={{ ...style }}
      className={[
        styles.notice,
        isVisible !== true ? styles.notDisplayed : null,
        status === "SUCCESS" ? styles.successNotice : null,
        status === "ERROR" ? styles.errorNotice : null,
        mini ? styles.miniNotice : null,
      ].join(" ")}
    >
      
      {dismissible && (
        <span
          role="button"
          tabIndex="0"
          className={styles.dismiss}
          onClick={() => setIsVisible(false)}
        >
          <DeleteIcon />
        </span>
      )}
      {children}
    </Box>
  );
};

export default Notice;

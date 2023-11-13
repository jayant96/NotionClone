import Notice from "views/notice";
import { Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Notice>
      <Typography variant="h3">404 Not Found</Typography>
      <Typography variant="body1">The requested page was not found.</Typography>
    </Notice>
  );
};

export default NotFoundPage;

import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: "normal",
  textTransform: "uppercase",
  color: theme.palette.text.primary,
  transition: "opacity .25s ease-in-out, margin .25s ease-in-out",
}));

const Footer = () => {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          width={1}
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
           <Box
  display={'flex'}
  component="a"
  href="/"
  title="Assistiv.AI"
  width={{ xs: 120, md: 150 }}
  alignItems="center" // Align items vertically in the center
>
  <img
    src={"/images/logo.png"}
    width={28}
    height={28}
    alt="Assistiv AI logo"
  />
  <Box
    display="flex"
    flexDirection="row"
    alignItems="center" // This ensures the text and the image are aligned on their centerline
  >
    <HeaderTitle
      sx={{ fontSize: '18px'}}
    >
      Assistiv.AI
    </HeaderTitle>
      </Box>
      </Box>
          <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          "& :not(:last-child)": { mr: 4 },
        }}
      >
        {/* <Link href="/impressum" target='blank' style={{ color: '#6248FF' }}>Impressum</Link> */}
        <Link href="https://assistiv.ai/docs/Privacy%20Policy/" target='blank' style={{ color: '#6248FF' }}>Privacy</Link>
        <Link href="https://assistiv.ai/docs/Terms%20&%20Conditions/" target='blank' style={{ color: '#6248FF' }}>Terms and condition</Link>
        <Link href="https://assistiv.ai/docs/License%20(EULA)/" target='blank' style={{ color: '#6248FF' }}>License (EULA)</Link>
        <Link href="mailto:support@assistiv.info" target='blank' style={{ color: '#6248FF' }}>Support</Link>
      </Box>
         
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Typography
          align={'center'}
          variant={'subtitle2'}
          color="text.secondary"
          gutterBottom
        >
          &copy; Copyright 2023 Assistiv AI All rights reserved.
        </Typography>
        {/* <Typography
          align={'center'}
          variant={'caption'}
          color="text.secondary"
          component={'p'}
        >
          When you visit or interact with our sites, services or tools, we or
          our authorised service providers may use cookies for storing
          information to help provide you with a better, faster and safer
          experience and for marketing purposes.
        </Typography> */}
      </Grid>
    </Grid>
  );
};

export default Footer;

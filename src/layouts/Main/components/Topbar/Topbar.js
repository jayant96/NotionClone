import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha, useTheme, styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeModeToggler from 'components/ThemeModeToggler';
import { Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { NavItem } from './components';

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: "normal",
  textTransform: "uppercase",
  color: theme.palette.text.primary,
  transition: "opacity .25s ease-in-out, margin .25s ease-in-out",
}));

const Topbar = ({ onSidebarOpen, pages, colorInvert = false }) => {
  const router = useRouter();
  const { pathname } = router;
  const buttonHref = pathname === '/producthunt' ? 'https://assistiv.ai/consult/' : 'https://assistiv.ai';

  const theme = useTheme();
  const { mode } = theme.palette;
  const {
    landings: landingPages,
    secondary: secondaryPages,
    company: companyPages,
    account: accountPages,
    portfolio: portfolioPages,
    blog: blogPages,
  } = pages;

  return (
    <Box
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      width={1}
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
    width={50}
    height={50}
    alt="Assistiv AI logo"
  />
  <Box
    display="flex"
    flexDirection="row"
    alignItems="center" // This ensures the text and the image are aligned on their centerline
  >
    <HeaderTitle
      variant="h6"
    >
      Assistiv.AI
    </HeaderTitle>
      </Box>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'flex' } }} alignItems={'center'}>
      <Box marginLeft={2}>
        <ThemeModeToggler />
      </Box>
      <Box marginLeft={2}>
          <NavItem 
            title={'Landings'}
            id={'landing-pages'}
            items={landingPages}
            
          />
      </Box>  
      <Box marginLeft={2}>
          <NavItem 
            title={'Blog'}
            id={'blog-pages'}
            items={blogPages}
          
          />
      </Box>
        {/* <Box marginLeft={2}>
          <Button
            variant="outlined"
            sx={{ borderColor: 'rgb(98, 72, 255)',  color: 'rgb(98, 72, 255)', '&:hover': { borderColor: 'rgb(88, 65, 230)',  color: 'rgb(98, 72, 255)', } }}
            component="a"
            target="blank"
            href="https://assistiv.ai/login/"
            size="large"
          >
            LOG IN
          </Button>
        </Box> */}
        <Box marginLeft={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'rgb(98, 72, 255)', color: 'rgb(255, 255, 255)', '&:hover': { backgroundColor: 'rgb(88, 65, 230)', color: 'rgb(255, 255, 255)', } }}
            component="a"
            target="blank"
            href={buttonHref}
            size="large"
          >
             {pathname === '/producthunt' ? 'Consult an AI' : 'TRY NOW'}
          </Button>
        </Box>
       
      </Box>
      <Box sx={{ display: { xs: 'block', md: 'none' } }} alignItems={'center'}>
        <Button
          onClick={() => onSidebarOpen()}
          aria-label="Menu"
          variant={'outlined'}
          sx={{
            borderRadius: 2,
            minWidth: 'auto',
            padding: 1,
            borderColor: alpha(theme.palette.divider, 0.2),
          }}
        >
          <MenuIcon />
        </Button>
      </Box>
    </Box>
  );
};

Topbar.propTypes = {
  onSidebarOpen: PropTypes.func,
  pages: PropTypes.object,
  colorInvert: PropTypes.bool,
};

export default Topbar;

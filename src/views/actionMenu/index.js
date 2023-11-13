// ActionMenu.js

import React from 'react';
import { Menu, MenuItem, ListItemIcon, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ActionMenu = ({ open, onClose, onDelete, onTurnInto }) => {
  return (
    <Menu
      open={open}
      onClose={onClose}   
    >
      <MenuItem onClick={onDelete}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
      </MenuItem>
      <MenuItem onClick={onTurnInto}>
        <Typography variant="inherit" noWrap>Turn Into</Typography>
      </MenuItem>
    </Menu>
  );
};

export default ActionMenu;

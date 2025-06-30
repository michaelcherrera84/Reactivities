import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Avatar, Box, ListItemIcon, ListItemText } from '@mui/material';
import { useAccount } from '../../lib/hooks/useAccount';
import { Link } from 'react-router';
import { Add, Logout, Password, Person } from '@mui/icons-material';

export default function UserMenu() {
    const { currentUser, logoutUser } = useAccount();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                color="inherit"
                size="large"
                sx={{ fontSize: '1.1rem' }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={currentUser?.imageUrl} alt="current user image" />
                    {currentUser?.displayName}
                </Box>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                <MenuItem component={Link} to="/createActivity" onClick={handleClose}>
                    <ListItemIcon>
                        <Add />
                        <ListItemText>Create Activity</ListItemText>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem component={Link} to={`/profiles/${currentUser?.id}`} onClick={handleClose}>
                    <ListItemIcon>
                        <Person />
                        <ListItemText>My profile</ListItemText>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem component={Link} to='/change-password' onClick={handleClose}>
                    <ListItemIcon>
                        <Password />
                        <ListItemText>Change password</ListItemText>
                    </ListItemIcon>
                </MenuItem>
                <MenuItem onClick={() => {
                    logoutUser.mutate();
                    handleClose();
                }}
                >
                    <ListItemIcon>
                        <Logout />
                        <ListItemText>Logout</ListItemText>
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </>
    );
}

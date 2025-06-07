import { useLocation } from 'react-router';
import { Divider, Paper, Typography } from '@mui/material';

export default function ServerError() {
    
    const {state} = useLocation()
    
    return (
        <Paper>
            {state.error ? (
                <>
                    <Typography gutterBottom variant="h3" sx={{px: 4, pt: 2}} color="secondary">
                        {state.error.message || 'There was an error'}
                    </Typography>
                    <Divider />
                    <Typography variant="body1" sx={{p: 4}}>
                        {state.error.details || 'Internal server error'}
                    </Typography>
                </>
            ) : (
                <Typography variant="h5">Internal server error</Typography>
            )}
        </Paper>
    );
}
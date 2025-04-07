import { Box, CircularProgress } from '@mui/material'

const Spinner = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingBlock: '1rem' }}>
            <CircularProgress />
        </Box>
    )
}

export default Spinner
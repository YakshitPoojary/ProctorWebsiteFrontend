import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const CustomHeader = ({ title }) => {
  const [month, type] = title.split('_');

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="body1">{month}</Typography>
      <Box display="flex" justifyContent="space-between" width="100%">
        {type && <Typography variant="body2">{type}</Typography>}
      </Box>
    </Box>
  );
};

export default CustomHeader;

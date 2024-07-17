import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const FacultyPrint = React.forwardRef((props, ref) => {
  const { rows, columns } = props;

  return (
    <div ref={ref} style={{ padding: '20px', width: '500%', overflow: 'auto' }}>
      <div style={{ height: 'auto', minWidth: '500%' }}>
        <DataGrid
          rows={rows}
          columns={columns.map((column) => ({ ...column, minWidth: 150 }))}
          disableColumnFilter={true}
          disableColumnSelector={true}
          disableDensitySelector={true}
          autoHeight
        />
      </div>
    </div>
  );
});

export default FacultyPrint;

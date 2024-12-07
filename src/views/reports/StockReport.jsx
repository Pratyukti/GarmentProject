import React, { useState } from 'react';
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  TablePagination,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const StockReport = () => {
  const [filterTerm, setFilterTerm] = useState('');
  const [reportData, setReportData] = useState([
    { id: 1, date: '2024-09-20', itemName: 'Stool', openingStock: 100, stockIn: 50, stockOut: 20, closingStock: 130 },
    { id: 2, date: '2024-09-21', itemName: 'Table', openingStock: 200, stockIn: 30, stockOut: 60, closingStock: 170 },
    { id: 3, date: '2024-09-22', itemName: 'Chair', openingStock: 300, stockIn: 70, stockOut: 50, closingStock: 320 },
    // ... more dummy data
  ]);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('itemName');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFilterChange = (e) => {
    setFilterTerm(e.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredData = reportData.filter((item) =>
    item.itemName.toLowerCase().includes(filterTerm.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    if (order === 'asc') {
      return a[orderBy] < b[orderBy] ? -1 : 1;
    } else {
      return a[orderBy] > b[orderBy] ? -1 : 1;
    }
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Stock Report', 20, 10);

    const tableColumn = ['Date', 'Item Name', 'Opening Stock', 'Stock In', 'Stock Out', 'Closing Stock'];
    const tableRows = filteredData.map((row) => [
      row.date,
      row.itemName,
      row.openingStock,
      row.stockIn,
      row.stockOut,
      row.closingStock,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('stock_report.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Report');
    XLSX.writeFile(workbook, 'stock_report.xlsx');
  };

  const handleExportChange = (e) => {
    const format = e.target.value;
    if (format === 'pdf') {
      exportPDF();
    } else if (format === 'excel') {
      exportExcel();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4, backgroundColor: '#f9dff5' }}>
        <Typography variant="h4" gutterBottom align="center" color="purple">
          Stock Report
        </Typography>

        {/* Search Input and Export Select Box in One Line */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          {/* Search Input */}
          <TextField
            label="Search Item"
            value={filterTerm}
            onChange={handleFilterChange}
            sx={{ flexGrow: 1, marginRight: 2 }}
          />

          {/* Export Select Box */}
          <FormControl sx={{ minWidth: 160 }}>
            <Select
              value="" // Initial state empty
              onChange={handleExportChange}
              displayEmpty
              renderValue={() => 'Export As'}
            >
              <MenuItem value="pdf">
                <PictureAsPdfIcon sx={{ color: 'red', marginRight: 1 }} />
                PDF
              </MenuItem>
              <MenuItem value="excel">
                <InsertDriveFileIcon sx={{ color: 'green', marginRight: 1 }} />
                Excel
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
        {sortedData.length > 0 ? (
          <>
            <TableContainer component={Paper} sx={{ marginTop: 4, backgroundColor: '#f4c4ec' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleRequestSort('date')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb', fontStyle: 'bold' ,color:'purple'}}
                    >
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort('itemName')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb',  fontStyle: 'bold' ,color:'purple'}}
                    >
                      <strong>Item Name</strong>
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() => handleRequestSort('openingStock')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb',  fontStyle: 'bold' ,color:'purple'}}
                    >
                      <strong>Opening Stock</strong>
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() => handleRequestSort('stockIn')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb',  fontStyle: 'bold' ,color:'purple'}}
                    >
                      <strong>Stock In</strong>
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() => handleRequestSort('stockOut')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb',  fontStyle: 'bold' ,color:'purple'}}
                    >
                      <strong>Stock Out</strong>
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={() => handleRequestSort('closingStock')}
                      sx={{ cursor: 'pointer', backgroundColor: '#ea8cdb',  fontStyle: 'bold' ,color:'purple'}}
                    >
                      <strong>Closing Stock</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.itemName}</TableCell>
                        <TableCell align="right">{row.openingStock}</TableCell>
                        <TableCell align="right">{row.stockIn}</TableCell>
                        <TableCell align="right">{row.stockOut}</TableCell>
                        <TableCell align="right">{row.closingStock}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sortedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </>
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No items found.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default StockReport;
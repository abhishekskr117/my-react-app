import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useEffect } from 'react';
import useDataStore from '../stores/dataStore';
import { reportsAPI } from '../services/api';

const Reports = () => {
  const { reports, setReports } = useDataStore();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [salesReport, inventoryReport] = await Promise.all([
          reportsAPI.getSalesReport(),
          reportsAPI.getInventoryReport(),
        ]);
        setReports({ sales: salesReport, inventory: inventoryReport });
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };
    fetchReports();
  }, [setReports]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4" color="primary">
                ${reports.sales?.total_sales || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Inventory by Type</Typography>
              {reports.inventory?.map((item) => (
                <Typography key={item.type}>
                  {item.type}: {item.total} units
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useEffect } from 'react';
import useDataStore from '../stores/dataStore';
import { reportsAPI } from '../services/api';

const Dashboard = () => {
  const { reports, setReports, sales } = useDataStore();

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

  // Sample data for charts
  const salesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
  ];

  const inventoryData = [
    { name: 'Mushrooms', value: 100 },
    { name: 'Supplies', value: 50 },
    { name: 'Equipment', value: 20 },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        KPI Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Sales</Typography>
              <Typography variant="h4" color="primary">
                ${reports.sales?.total_sales || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Active Orders</Typography>
              <Typography variant="h4" color="secondary">
                15
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Work Orders</Typography>
              <Typography variant="h4" color="success.main">
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Sales Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Inventory Distribution</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
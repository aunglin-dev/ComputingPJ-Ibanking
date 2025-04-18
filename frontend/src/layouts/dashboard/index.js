// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import axios from "axios";
import { useState } from "react";
// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Person3Icon from "@mui/icons-material/Person3";
import { useEffect } from "react";

function Dashboard() {
  const [transferTypeList, setTransferTypeList] = useState({
    labels: ["M", "T", "W", "T", "F", "S", "S"],
    datasets: {
      label: "Transactions",
      data: [],
    },
  });
  const [totalTransfer, setTotalTransfers] = useState(0);

  const fetchTransferTypes = async () => {
    try {
      const res = await axios.get("/dashboard/getTransferSummaryByTranType");

      if (res.status === 200) {
        const apiData = res.data.data;

        const filtered = apiData.filter((item) => item.TranType !== null);

        const chartLabels = filtered.map((item) => item.TranType);
        const chartData = filtered.map((item) => Number(item.count));

        setTransferTypeList({
          labels: chartLabels,
          datasets: {
            label: "Transactions",
            data: chartData,
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch transfer types", error);
    }
  };

  //Fetch total Transfer Count
  const fetchAllTransfer = async () => {
    try {
      const res = await axios.get("/dashboard/fetchAllTransferLogs");

      if (res.status === 200) {
        const apiData = res.data.data;
        setTotalTransfers(apiData);
      }
    } catch (error) {
      console.error("Failed to fetch transfer types", error);
    }
  };
  useEffect(() => {
    fetchTransferTypes();
    fetchAllTransfer();
  }, []);
  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Transactions"
                count={totalTransfer}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just Now",
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Requested Users"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="group"
                title="Current Users"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Transaction Done"
                  description="All Transactions According To TransType"
                  date="Just Now"
                  chart={transferTypeList}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Weeknd Transaction"
                  description="All Transaction Done Within A Week"
                  date="Just Now"
                  chart={sales}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox> */}
      </MDBox>
    </DashboardLayout>
  );
}

export default Dashboard;

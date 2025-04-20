// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MasterCard from "examples/Cards/MasterCard";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Billing page components
import PaymentMethod from "layouts/billing/components/PaymentMethod";
import Invoices from "layouts/billing/components/Invoices";
import BillingInformation from "layouts/billing/components/BillingInformation";
import Transactions from "layouts/billing/components/Transactions";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";

function Billing() {
  const { currentCustomer } = useSelector((state) => state.customer);
  const [fromAccountInfo, setFromAccountInfo] = useState([]);
  const [currentAccount, setCurrentAccount] = useState({ accountNo: null, balance: null });
  const [balance, setBalance] = useState("");

  console.log("Current Customer", currentCustomer);

  const formatWithSeparator = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  //Fetch From Account Info
  const fetchFromAccountInfo = async (req, res) => {
    try {
      const res = await axios.post("/customerAccount/fetchFromAccountInfo", {
        UserId: currentCustomer?.UserId,
      });

      if (res.status == 200) {
        console.log(res.data.data);
        setFromAccountInfo(res.data.data.fromAccountInfo);
        const totalBalance = res.data.data?.totalBalance;

        const formattedBalance = formatWithSeparator(totalBalance.toString());

        const currentAcc = res.data.data.fromAccountInfo.find(
          (el) => el?.ProductName === "Current Account"
        );

        setCurrentAccount({
          accountNo: Number(currentAcc?.FromAccountNo),
          balance: formatWithSeparator(currentAcc?.Balance.toString()),
        });
        console.log("Currenct Account ");
        setBalance(formattedBalance);
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.status);
        if (error.response.status === 500) {
          alert("Something went wrong on the server. Please try again later.");
        }
        if (error.response.status === 400) {
          // alert("Something went wrong ", error.response.data.message);
        }
      } else if (error.request) {
        console.error("No response received from the server:", error.request);
        alert("Unable to connect to the server. Please check your internet connection.");
      } else {
        console.error("Error setting up the request:", error.message);
        // alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    currentCustomer && fetchFromAccountInfo();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} xl={6}>
                  <MasterCard
                    number={currentAccount?.accountNo}
                    holder={currentCustomer?.FullName}
                    expires="11/22"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="account_balance"
                    title="Current Account Balance"
                    description="Belong Interactive"
                    value={currentAccount?.balance}
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon="paypal"
                    title="Total Balance"
                    description="All Account Balance"
                    value={balance}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PaymentMethod fromAccountInfo={fromAccountInfo} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <BillingInformation />
            </Grid>
            <Grid item xs={12} md={5}>
              <Transactions />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Billing;

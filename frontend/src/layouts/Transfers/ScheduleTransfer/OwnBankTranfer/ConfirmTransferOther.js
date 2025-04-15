import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Chip } from "@mui/material";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import MDInput from "components/MDInput";
import { useSelector } from "react-redux";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { string } from "prop-types";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ScheduleConfirmTransferOther() {
  const { state } = useLocation();
  const {
    FromAccount,
    ToAccount,
    TransactionId,
    TransactionAmount,
    Description,
    senderName,
    ToAccountName,
    TransactionDate,
  } = state?.navigatedConfirmedModel; //

  console.log("TransactionAmount____________________________", TransactionDate);

  //Might Delete Later
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const [rawValue, setRawValue] = useState(""); //

  const { currentCustomer } = useSelector((state) => state.customer);
  //   const [selectedValueForFromAcc, setSelectedValueForFromAcc] = useState(null);
  //   const [selectedValueForToAcc, setSelectedValueForToAcc] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {}, []);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  // Function to format the value with thousand separators
  const formatWithSeparator = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle input change
  const handleChange = (e) => {
    const inputValue = e.target.value;

    // Remove all non-digit characters
    const numericValue = inputValue.replace(/\D/g, "");

    // Update the raw value (for calculations or submissions)
    setRawValue(numericValue);

    // Format the value with thousand separators
    const formattedValue = formatWithSeparator(numericValue);

    // Update the display value
    setDisplayValue(formattedValue);
  };

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      Your{" "}
      <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
        {" "}
        transaction{" "}
      </MDTypography>{" "}
      has been Successfully added to Schedule Pending List.
    </MDTypography>
  );

  const renderSuccessSB = (
    <MDSnackbar
      color="success"
      icon="check"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={successSB}
      onClose={closeSuccessSB}
      close={closeSuccessSB}
      bgWhite
    />
  );

  const renderInfoSB = (
    <MDSnackbar
      icon="notifications"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={infoSB}
      onClose={closeInfoSB}
      close={closeInfoSB}
    />
  );

  const renderWarningSB = (
    <MDSnackbar
      color="warning"
      icon="star"
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={warningSB}
      onClose={closeWarningSB}
      close={closeWarningSB}
      bgWhite
    />
  );

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="Validate Own Transfer"
      content={errorMessage}
      dateTime="Just Now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDAlert mt={2} color="success" dismissible>
        {alertContent("success")}
      </MDAlert>
      <MDBox mt={2} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={12}>
            <Card>
              <MDBox p={2} lineHeight={0}>
                <MDTypography variant="h5">Schedule Other Transfer</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Transfering Funds to other account holders over schedule
                </MDTypography>
              </MDBox>
              <MDBox p={5}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      From Account No
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {FromAccount}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Sender Name
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {senderName}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      To Account No
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {ToAccount}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Receiver Name
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {ToAccountName}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Transaction ID
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {TransactionId}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Amount
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {String(TransactionAmount)
                        ?.replace(/\D/g, "")
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Transaction Fees
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      0.00
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Future Schedule Transaction Date
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {TransactionDate}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Total Amount
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {String(TransactionAmount)
                        ?.replace(/\D/g, "")
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Description
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {Description}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={0} mb={1} mr={4} display="flex" justifyContent="flex-end">
                {/* Confirm Button */}
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="error"
                  onClick={() => navigate("/transfer/owntransfer")}
                >
                  OK
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ScheduleConfirmTransferOther;

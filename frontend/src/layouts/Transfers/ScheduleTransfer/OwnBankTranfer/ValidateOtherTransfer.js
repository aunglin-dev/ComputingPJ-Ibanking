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

import { tranType } from "../../../../helper/TransferType.js";

function ScheduleValidateOtherTransfer() {
  const { state } = useLocation();
  const {
    amount,
    description,
    fromAccountNo,
    senderName,
    toAccountNo,
    receiverName,
    transactionDate,
  } = state?.navigatedModel; //

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

  console.log("Received state For Other Account Validation:", state?.navigatedModel);

  const navigate = useNavigate();

  const validateTransfer = async () => {
    try {
      const validateModel = {
        userId: currentCustomer?.UserId,
        fromAccountNo: fromAccountNo,
        toAccountNo: toAccountNo,
        amount: amount,
        description: description,
        reqtranType: tranType?.ScheduleTransferOther,
        transactionDate,
      };
      console.log(validateModel);
      const res = await axios.post("/transfer/confirmScheduleTransfer", validateModel);

      console.log(res);
      if (res.status == 200) {
        console.log("Confirm Transfer", res.data);
        const navigatedConfirmedModel = res.data?.transaction;
        console.log(
          "navigatedConfirmedModel_________________________________",
          navigatedConfirmedModel
        );
        navigate("/transfer/confirmScheduleOtherTransfer", { state: { navigatedConfirmedModel } });
        // window.alert("success");
      } else {
        window.alert("something is wrong");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.status);
        if (error.response.status === 500) {
          alert("Something went wrong on the server. Please try again later.");
        }
        if (error.response.status === 400) {
          setErrorSB(true);
          setErrorMessage(error.response.data.message);
        }
      } else if (error.request) {
        console.error("No response received from the server:", error.request);
        alert("Unable to connect to the server. Please check your internet connection.");
      } else {
        console.error("Error setting up the request:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

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
      <MDBox mt={6} mb={3}>
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
                      {fromAccountNo}
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
                      {toAccountNo}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Receiver Name
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {receiverName}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Amount
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {amount.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} MMK
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Transaction Fees
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      0.00 MMK
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Future Schedule Transaction Date
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {transactionDate}
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Total Amount
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {amount.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")} MMK
                    </MDTypography>
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDTypography component="a" href="#" variant="h6" fontWeight="medium">
                      Description
                    </MDTypography>
                    <br />
                    <MDTypography component="a" href="#" variant="body2">
                      {description}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={0} mb={1} mr={4} display="flex" justifyContent="flex-end">
                <MDButton
                  type="button"
                  variant="gradient"
                  sx={{
                    mr: 2,
                    border: "2px solid",
                    "&:hover": {
                      backgroundColor: "transparent",
                      border: "2px solid",
                    },
                  }}
                >
                  Cancel
                </MDButton>

                {/* Confirm Button */}
                <MDButton type="submit" variant="gradient" color="error" onClick={validateTransfer}>
                  Confirm
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ScheduleValidateOtherTransfer;

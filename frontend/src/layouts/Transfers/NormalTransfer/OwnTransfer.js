import { useState } from "react";

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

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function OwnTransfer() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [rawValue, setRawValue] = useState(""); //
  const [displayValue, setDisplayValue] = useState("");

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [selectedValue, setSelectedValue] = useState("");

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
      A simple {name} alert with{" "}
      <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
        an example link
      </MDTypography>
      . Give it a click if you like.
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
      title="Material Dashboard"
      content="Hello, world! This is a notification message"
      dateTime="11 mins ago"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

  const options = ["Current Account", "Savings Account", "Fixed Deposit"];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          {/* <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Alerts</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                <MDAlert color="primary" dismissible>
                  {alertContent("primary")}
                </MDAlert>
                <MDAlert color="secondary" dismissible>
                  {alertContent("secondary")}
                </MDAlert>
                <MDAlert color="success" dismissible>
                  {alertContent("success")}
                </MDAlert>
                <MDAlert color="error" dismissible>
                  {alertContent("error")}
                </MDAlert>
                <MDAlert color="warning" dismissible>
                  {alertContent("warning")}
                </MDAlert>
                <MDAlert color="info" dismissible>
                  {alertContent("info")}
                </MDAlert>
                <MDAlert color="light" dismissible>
                  {alertContent("light")}
                </MDAlert>
                <MDAlert color="dark" dismissible>
                  {alertContent("dark")}
                </MDAlert>
              </MDBox>
            </Card>
          </Grid> */}

          <Grid item xs={12} lg={12}>
            <Card>
              <MDBox p={2} lineHeight={0}>
                <MDTypography variant="h5">Own Transfer</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Transfering Funds between own accounts
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6} lg={6}>
                    {/* <MDButton variant="gradient" color="success" onClick={openSuccessSB} fullWidth>
                      success notification
                    </MDButton> */}
                    <Autocomplete
                      value={selectedValue}
                      onChange={(event, newValue) => {
                        setSelectedValue(newValue); // Update the selected value
                        console.log(newValue);
                      }}
                      options={options}
                      getOptionLabel={(option) => option || ""} // Handle null/undefined
                      renderInput={(params) => (
                        <TextField {...params} label="Select From Account" variant="outlined" />
                      )}
                    />
                    {renderSuccessSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    {/* <MDButton variant="gradient" color="info" onClick={openInfoSB} fullWidth>
                      info notification
                    </MDButton> */}

                    <Autocomplete
                      value={selectedValue}
                      onChange={(event, newValue) => {
                        setSelectedValue(newValue); // Update the selected value
                        console.log(newValue);
                      }}
                      options={options}
                      getOptionLabel={(option) => option || ""} // Handle null/undefined
                      renderInput={(params) => (
                        <TextField {...params} label="Select To Account" variant="outlined" />
                      )}
                    />
                    {renderInfoSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    {/* <MDButton variant="gradient" color="warning" onClick={openWarningSB} fullWidth>
                      warning notification
                    </MDButton> */}
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="amount (MMK)"
                        fullWidth
                        value={displayValue}
                        onChange={handleChange}
                      />
                    </MDBox>

                    {renderWarningSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    {/* <MDButton variant="gradient" color="error" onClick={openErrorSB} fullWidth>
                      error notification
                    </MDButton> */}
                    <MDBox mb={2}>
                      <MDInput type="text" label="Description" fullWidth />
                    </MDBox>
                    <Grid item xs={12} sm={6} lg={6}>
                      {renderWarningSB}
                    </Grid>
                    {renderErrorSB}
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={1} mb={1} mr={2} display="flex" justifyContent="flex-end">
                <MDButton type="submit" variant="gradient" color="error">
                  Next
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default OwnTransfer;

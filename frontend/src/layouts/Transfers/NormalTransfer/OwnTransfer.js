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

function OwnTransfer() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [rawValue, setRawValue] = useState(""); //
  const [displayValue, setDisplayValue] = useState("");
  const [fromAccountNoList, setFromAccountNoList] = useState([]);
  const [toAccountNoList, setToAccountNoList] = useState([]);
  const { currentCustomer } = useSelector((state) => state.customer);
  const [selectedValueForFromAcc, setSelectedValueForFromAcc] = useState(null);
  const [selectedValueForToAcc, setSelectedValueForToAcc] = useState("");
  const [description, setDescription] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAccountNo = async () => {
    console.log(currentCustomer?.UserId);
    console.log("OwnTransfer", currentCustomer);
    const res = await axios.post("/customerAccount/fetchfromAccNo", {
      UserId: currentCustomer?.UserId,
    });
    console.log("from account", res.data);

    const resFromAccountLsit = res.data.map((el) => el?.AccountNo);
    setFromAccountNoList(res.data);
    console.log("FromAccountNolist", fromAccountNoList);
    setToAccountNoList(resFromAccountLsit.filter((el) => el != selectedValueForFromAcc));
  };

  const navigate = useNavigate();

  const validateTransfer = async () => {
    try {
      const validateModel = {
        userId: currentCustomer?.UserId,
        fromAccountNo: selectedValueForFromAcc,
        toAccountNo: selectedValueForToAcc,
        amount: rawValue,
        description: description,
      };
      console.log(validateModel);
      const res = await axios.post("/transfer/validateAllTransfer", validateModel);

      console.log(res);
      if (res.status == 200) {
        setSuccessSB(true);
        const navigatedModel = res.data;
        console.log("NavigatedModel_____________", navigatedModel);
        navigate("/transfer/validateTransfer", {
          state: { navigatedModel },
        });
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

  useEffect(() => {
    fetchAccountNo();
  }, [selectedValueForFromAcc]);

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
      title="Validate Own Transfer"
      content="Transaction Validated Successfully"
      dateTime="Just Now"
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
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} lg={6}>
                    {/* <MDButton variant="gradient" color="success" onClick={openSuccessSB} fullWidth>
                      success notification
                    </MDButton> */}
                    <Autocomplete
                      value={selectedValueForFromAcc}
                      onChange={(event, newValue) => {
                        setSelectedValueForFromAcc(newValue); // Update the selected value
                        console.log(newValue);
                      }}
                      options={fromAccountNoList.map((el) => el.AccountNo)}
                      getOptionLabel={(option) => option || ""} // Handle null/undefined
                      renderInput={(params) => (
                        <TextField {...params} label="Select From Account" variant="outlined" />
                      )}
                    />
                    {selectedValueForFromAcc != null && (
                      <MDTypography
                        variant="caption"
                        fontWeight="medium"
                        textTransform="capitalize"
                        sx={{
                          color: "#e7ad00",
                          opacity: 0.9,

                          fontStyle: "italic",
                          textShadow: "0px 1px 1px rgba(0,0,0,0.2)",
                        }}
                      >
                        {fromAccountNoList
                          .filter((el) => el.AccountNo == selectedValueForFromAcc)
                          .map((el) => el?.Balance)}{" "}
                        MMK
                      </MDTypography>
                    )}
                    {renderSuccessSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Autocomplete
                      value={selectedValueForToAcc}
                      onChange={(event, newValue) => {
                        setSelectedValueForToAcc(newValue);

                        console.log(newValue);
                      }}
                      options={toAccountNoList}
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
                      <MDInput
                        type="text"
                        label="Description"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </MDBox>
                    <Grid item xs={12} sm={6} lg={6}>
                      {renderWarningSB}
                    </Grid>
                    {renderErrorSB}
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={1} mb={1} mr={2} display="flex" justifyContent="flex-end">
                <MDButton type="submit" variant="gradient" color="error" onClick={validateTransfer}>
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

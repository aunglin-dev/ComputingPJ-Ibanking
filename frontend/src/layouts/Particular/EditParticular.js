import { use, useEffect, useState } from "react";

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
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";

function EditParticular() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [minRawValue, setMinRawValue] = useState(""); //
  const [maxRawValue, setMaxRawValue] = useState(""); //
  const [displayMinValue, setDisplayMinValue] = useState("");
  const [displayMaxValue, setDisplayMaxValue] = useState("");

  const [rate, setRate] = useState(""); //
  const [displayRateValue, setDisplayRateValue] = useState("");
  const [limitCode, setLimitCode] = useState("");
  const [limitType, setLimitType] = useState("");

  const [tranType, setTranType] = useState("");
  const [officeAccount, setOfficeAccount] = useState(null);

  const [toAccountNoList, setToAccountNoList] = useState([]);
  const { currentAdmin } = useSelector((state) => state.admin);
  const [selectedValueForFromAcc, setSelectedValueForFromAcc] = useState(null);
  const [CurrencyValue, setCurrency] = useState("");
  const [tempOfficeAccountNo, setTempOfficeAccountNo] = useState(null); // For delayed binding
  const [officeAccountList, setOfficeAccountList] = useState([]);
  const [officeAccountId, setOfficeAccountId] = useState(null);
  const [officeDescription, setOfficeDescription] = useState(null);
  const [description, setDescription] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  //State from previous Location
  const { state } = useLocation();

  //Navigate
  const navigate = useNavigate();

  console.log("Transaction Id ___________", state);

  const CurrencyList = ["MMK", "USD"];

  const resetAllStates = () => {
    setRate("");
    setDisplayRateValue("");
    setLimitCode("");
    setLimitType("");
    setToAccountNoList([]);
    setSelectedValueForFromAcc(null);
    setCurrency("");
    setDisplayMinValue("");
    setDisplayMaxValue("");
    setDescription("");
  };

  //Fetch Specific Row

  // Fetch office accounts
  const fetchOfficeAccounts = async () => {
    try {
      const res = await axios.get("/particular/fetchOfficeAccounts");
      if (res.status === 200) {
        setOfficeAccountList(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching Office Account", err);
    }
  };

  // Fetch single particular
  const fetchtransLimit = async () => {
    try {
      const res = await axios.post("/particular/fetchOneParticular", { Id: state });
      if (res.status === 200) {
        const { TranType, OfficeAccountNumber, ChargesRate } = res.data.data;

        setRate(ChargesRate);
        setTranType(TranType);
        setTempOfficeAccountNo(OfficeAccountNumber); // store temporarily
      }
    } catch (err) {
      console.error("Error fetching Transaction Limit", err);
    }
  };

  // Match OfficeAccountNumber after list is ready
  useEffect(() => {
    if (tempOfficeAccountNo && officeAccountList.length > 0) {
      const match = officeAccountList.find(
        (acc) => acc.OfficeAccountNumber === tempOfficeAccountNo
      );
      setOfficeAccount(match || null);
    }
  }, [tempOfficeAccountNo, officeAccountList]);

  // Initial data fetch
  useEffect(() => {
    fetchOfficeAccounts();
    fetchtransLimit();
  }, []);

  const validateTransfer = async () => {
    try {
      const validateModel = {
        ///
        particularId: state,
        chargesRate: rate,
        officeAccountId: officeAccountId,
        adminId: currentAdmin?.AdminID,
      };
      console.log(validateModel);
      const res = await axios.put("/particular/editParticular", validateModel);

      console.log(res);
      if (res.status == 200) {
        setSuccessSB(true);
        resetAllStates();
        const navigatedModel = res.data;
        navigate("/particular/Index", {
          state: true,
        });
        console.log("NavigatedModel_____________", navigatedModel);
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

  const convertDigitForCharges = (value) => {
    return value.replace(/[^\d.]/g, "");
  };

  // Handle input change for Charges
  const handleChangeForCharges = (e) => {
    const inputValue = e.target.value;

    const numericValue = convertDigitForCharges(inputValue);
    setRate(numericValue);

    const formattedValue = formatWithSeparator(numericValue);

    setDisplayRateValue(formattedValue);
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
      title="Transaction Limit Saved"
      content="Transaction Limit Saved Successfully"
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
      color="Success"
      icon="check"
      title="Transaction Limit Deletion"
      content="Transaction Limit Is Successfully Deleted"
      dateTime="just now"
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
              <MDBox p={2} lineHeight={2}>
                <MDTypography variant="h5">Edit OfficeAccount And Charges Rate</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Predefining OfficeAccount and Charges Rate For each Transaction Type
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox mb={2}>
                      <MDInput type="text" label="Tran Type" fullWidth value={tranType} disabled />
                    </MDBox>

                    {renderErrorSB}
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
                    <Autocomplete
                      value={officeAccount}
                      onChange={(_, newValue) => {
                        setOfficeAccount(newValue);
                        setOfficeAccountId(newValue?.Id || null);
                        setOfficeDescription(newValue?.Description || null);
                        console.log("OfficeAccountId", officeAccountId);
                      }}
                      options={officeAccountList}
                      getOptionLabel={(option) => (option ? option.OfficeAccountNumber : null)}
                      isOptionEqualToValue={(option, value) =>
                        option?.OfficeAccountNumber === value?.OfficeAccountNumber
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Select OfficeAccount" variant="outlined" />
                      )}
                    />

                    {officeDescription && (
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
                        Account Type : {officeDescription}
                      </MDTypography>
                    )}

                    {renderSuccessSB}
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Charges Fee Rate"
                        fullWidth
                        value={rate}
                        onChange={handleChangeForCharges}
                      />
                    </MDBox>

                    {renderWarningSB}

                    {renderErrorSB}
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={1} mb={1} mr={2} display="flex" justifyContent="flex-end">
                <MDButton
                  type="button"
                  variant="gradient"
                  onClick={() => navigate("/particular/Index")}
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
                <MDButton type="submit" variant="gradient" color="error" onClick={validateTransfer}>
                  Save
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditParticular;

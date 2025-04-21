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
import { tranType } from "../../../helper/TransferType.js";
import DataTable from "examples/Tables/DataTable";

// import authorsTableData from "../../tables/data/authorsTableData.js";

import beneficiaryList from "../data/beneficiaryList.js";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { string } from "prop-types";
import { useNavigate } from "react-router-dom";

function OwnBankBeneficiary() {
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
  const [toaccountInfo, setToAccountInfo] = useState({});
  const [toaccountInfoForDisplay, setToAccountInfoForDisplay] = useState({});
  const [isFetchtoaccountInfo, setisFetchtoaccountInfo] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [nickname, setNickName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

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

  const fetchToAccountInfo = async (e) => {
    try {
      const inputValue = e.target.value;
      setisFetchtoaccountInfo(true);
      setToAccountInfoForDisplay({});
      // Remove all non-digit characters
      const numericValue = inputValue.replace(/\D/g, "");

      setSelectedValueForToAcc(numericValue);

      console.log("selectedValueForToAcc___________________________________", numericValue);

      if (numericValue.length !== 15) {
        return;
      }
      const res = await axios.post("/transfer/fetchToAccNo", {
        toAccountNo: numericValue,
      });

      if (res.status == 200) {
        console.log(res.data);
        setToAccountInfo(res.data);
        console.log(toaccountInfo);
        setisFetchtoaccountInfo(false);
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

  const navigate = useNavigate();

  //DataTable
  const { columns, rows } = beneficiaryList();

  const validateTransfer = async () => {
    try {
      const validateModel = {
        userId: currentCustomer?.UserId,
        toAccountNo: selectedValueForToAcc,
        nickname,
        receiverName: toaccountInfoForDisplay?.receiverName,
        reqtranType: tranType?.BeneOwnBank,
        description: description,
      };
      console.log(validateModel);
      const res = await axios.post("/beneficiary/createBeneficiary", validateModel);

      console.log(res);
      if (res.status == 200) {
        setSuccessSB(true);
        setRefreshKey((prev) => prev + 1);
        const navigatedModel = res.data;

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

  useEffect(() => {
    fetchAccountNo();
  }, [selectedValueForFromAcc, refreshKey]);

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
      title="Added To OwnBank Beneficiary"
      content="Successfully OwnBank Beneficiary Added"
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
      title=" Adding New Beneficiary"
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
                <MDTypography variant="h5">Own Bank Beneficiary</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Add Accounts To Beneficiary
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} lg={6}>
                    {/* <MDButton variant="gradient" color="info" onClick={openInfoSB} fullWidth>
                      info notification
                    </MDButton> */}
                    <MDBox mb={2}>
                      <MDInput
                        mb={3}
                        type="text"
                        label="To Account"
                        fullWidth
                        value={selectedValueForToAcc}
                        onChange={fetchToAccountInfo}
                        inputProps={{
                          maxLength: 15,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </MDBox>
                    <MDButton
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={isFetchtoaccountInfo}
                      onClick={() => setToAccountInfoForDisplay(toaccountInfo)}
                      sx={{
                        border: "2px solid",
                        "&:hover": {
                          backgroundColor: "transparent",
                          border: "2px solid",
                        },
                      }}
                    >
                      Fetch Account
                    </MDButton>

                    {renderInfoSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        placeholder="Account Holder Name"
                        fullWidth
                        readOnly
                        value={toaccountInfoForDisplay.receiverName ?? "Account Holder Name"}
                      />
                      {Object.keys(toaccountInfoForDisplay).length > 0 && (
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
                          {/* {toaccountInfoForDisplay
                            .filter((el) => el.AccountNo == selectedValueForFromAcc)
                            .map((el) => el?.Balance)}{" "}
                          MMK */}
                          Account Type : {toaccountInfoForDisplay?.accountType}
                        </MDTypography>
                      )}
                    </MDBox>

                    {renderInfoSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    {/* <MDButton variant="gradient" color="warning" onClick={openWarningSB} fullWidth>
                      warning notification
                    </MDButton> */}
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Nickname"
                        fullWidth
                        value={nickname}
                        onChange={(e) => setNickName(e.target.value)}
                      />
                    </MDBox>

                    {renderErrorSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    {/* <MDButton variant="gradient" color="error" onClick={openErrorSB} fullWidth>
                      error notification
                    </MDButton> */}
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Relationship with Beneficiary"
                        fullWidth
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </MDBox>
                    <Grid item xs={12} sm={6} lg={6}>
                      {renderSuccessSB}
                    </Grid>
                    {}
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox mt={1} mb={1} mr={2} display="flex" justifyContent="flex-end">
                <MDButton type="submit" variant="gradient" color="error" onClick={validateTransfer}>
                  Add
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>

        {/* Beneficiary Listing */}

        <Grid container spacing={3} mt={5} pb={3} justifyContent="center">
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={2}
                px={2}
                variant="gradient"
                bgColor="error"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white" fontWeight="regular">
                  Own Bank Beneficiary List
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  key={refreshKey}
                  isSorted={false}
                  entriesPerPage={true}
                  showTotalEntries={true}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default OwnBankBeneficiary;

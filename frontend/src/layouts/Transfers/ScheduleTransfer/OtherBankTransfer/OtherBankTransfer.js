import { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Chip, Typography } from "@mui/material";
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
import * as TransferType from "../../../../helper/TransferType";
import { List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { string } from "prop-types";
import { useNavigate } from "react-router-dom";

function ScheduleOtherBankTransfer() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [rawValue, setRawValue] = useState(""); //
  const [displayValue, setDisplayValue] = useState("");
  const [fromAccountNoList, setFromAccountNoList] = useState([]);
  const [otherbankList, setOtherbankList] = useState([]);
  const [otherBranches, setotherBranches] = useState([]);
  const [toAccountNoList, setToAccountNoList] = useState([]);
  const { currentCustomer } = useSelector((state) => state.customer);
  const [selectedValueForFromAcc, setSelectedValueForFromAcc] = useState(null);
  const [selectedotherBank, setselectedotherBank] = useState(null);

  const [selectedotherBranches, setselectedotherBranches] = useState(null);
  const [selectedotherBankId, setselectedotherBankId] = useState(null);

  const [selectedotherBranchId, setSelectedOtherBranchId] = useState(null);

  const [selectedValueForToAcc, setSelectedValueForToAcc] = useState("");
  const [description, setDescription] = useState(null);
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [accountHolderName, setAccountHolderName] = useState(null);
  const [toaccountInfo, setToAccountInfo] = useState({});
  const [toaccountInfoForDisplay, setToAccountInfoForDisplay] = useState({});
  const [isFetchtoaccountInfo, setisFetchtoaccountInfo] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  //For Schedule Transfer Date
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedTomorrow = tomorrow.toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(formattedTomorrow);

  const fetchAccountNo = async () => {
    const res = await axios.post("/customerAccount/fetchfromAccNo", {
      UserId: currentCustomer?.UserId,
    });

    const resFromAccountLsit = res.data.map((el) => el?.AccountNo);
    setFromAccountNoList(res.data);

    setToAccountNoList(resFromAccountLsit.filter((el) => el != selectedValueForFromAcc));
  };

  const fetchOtherBank = async () => {
    try {
      const res = await axios.get("/otherbank/fetchAllOtherBank");

      if (res.status == 200) {
        setOtherbankList(res.data);
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

  const fetchOtherBraches = async (Id) => {
    try {
      const res = await axios.post("/otherbank/fetchOtherBranchesByOtherBankId", {
        BankId: Id,
      });

      console.log("Other Branches", res.data);
      if (res.status === 200) {
        setotherBranches(res.data);
      } else {
        setotherBranches(["No Option"]);
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

  const fetchToAccountInfo = async (e) => {
    const inputValue = e.target.value;
    setisFetchtoaccountInfo(true);
    setToAccountInfoForDisplay({});
    // Remove all non-digit characters
    const numericValue = inputValue.replace(/\D/g, "");

    setSelectedValueForToAcc(numericValue);
  };

  const navigate = useNavigate();

  const validateTransfer = async () => {
    try {
      const validateModel = {
        userId: currentCustomer?.UserId,
        fromAccountNo: selectedValueForFromAcc,
        toAccountNo: selectedValueForToAcc,
        amount: rawValue,
        receiverName: accountHolderName,
        reqtranType: TransferType.tranType?.ScheduleTransferOtherBank,
        description: description,
        OtherBankId: selectedotherBankId,
        transactionDate: selectedDate,
        OtherBranchId: selectedotherBranchId,
        phone: phone,
        email: email,
      };
      console.log(validateModel);
      const res = await axios.post("/otherbank/validateOtherBankTransfer", validateModel);

      console.log(res);
      if (res.status == 200) {
        setSuccessSB(true);
        const navigatedModel = res.data;
        console.log("NavigatedModel_____________", navigatedModel);
        navigate("/scheduletransferother/ScheduleOtherBankTransferValidate", {
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
    fetchOtherBank();
  }, []);

  useEffect(() => {
    if (selectedotherBankId) {
      fetchOtherBraches(selectedotherBankId);
    } else {
      setotherBranches([]);
    }
  }, [selectedotherBankId]);

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
      title="Validate Schedule Other Bank Transfer"
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
      title="Validate Other Bank Transfer"
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
                <MDTypography variant="h5">Schedule Other Bank Transfer</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Transfering Funds to other bank over schedule
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} lg={6}>
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
                      value={selectedotherBank}
                      onChange={(event, newValue) => {
                        setselectedotherBank(newValue);
                        setselectedotherBranches(null);
                        const foundBank = otherbankList.find((el) => el.BankName === newValue);
                        setselectedotherBankId(foundBank ? foundBank.Id : null);

                        console.log(newValue);
                      }}
                      options={otherbankList.map((el) => el.BankName)}
                      getOptionLabel={(option) => option || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Other Bank"
                          variant="outlined"
                          inputProps={{
                            ...params.inputProps,
                            readOnly: true, // This prevents manual typing
                          }}
                        />
                      )}
                      freeSolo={false} // This prevents free text input
                    />

                    {renderSuccessSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Autocomplete
                      value={selectedotherBranches}
                      onChange={(event, newValue) => {
                        setselectedotherBranches(newValue);
                        const foundBranch = otherBranches.find((el) => el.Name === newValue);
                        setSelectedOtherBranchId(foundBranch ? foundBranch.Id : null);
                      }}
                      options={
                        otherBranches != [] ? otherBranches.map((el) => el.Name) : ["no option"]
                      }
                      getOptionLabel={(option) => option || ""}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Other Branches"
                          variant="outlined"
                          inputProps={{
                            ...params.inputProps,
                            readOnly: true, // This prevents manual typing
                          }}
                        />
                      )}
                      freeSolo={false} // This prevents free text input
                    />

                    {renderSuccessSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
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

                    {renderInfoSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Account Holder Name"
                        fullWidth
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                      />
                    </MDBox>

                    {renderInfoSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
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
                    <MDBox mb={2}>
                      <MDInput
                        defaultValue={today}
                        type="date"
                        label="Schedule Transfer Date"
                        fullWidth
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        inputProps={{ min: formattedTomorrow }}
                      />
                    </MDBox>

                    {renderWarningSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox sx={{ display: "flex", gap: 2 }}>
                      {" "}
                      <MDBox sx={{ flex: 0.3 }}>
                        {" "}
                        <MDInput type="text" label="+95" fullWidth disabled />
                      </MDBox>
                      <MDBox sx={{ flex: 2 }}>
                        {" "}
                        <MDInput
                          type="text"
                          label="Account Holder Phone Number"
                          fullWidth
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
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
                    </MDBox>
                    {renderWarningSB}
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox mb={2}>
                      <MDInput
                        type="email"
                        label="Account Holder Email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </MDBox>
                    <Grid item xs={12} sm={6} lg={6}>
                      {renderWarningSB}
                    </Grid>
                    {renderErrorSB}
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
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

              <MDTypography p={2} variant="button" fontWeight="regular">
                Terms And Conditions
              </MDTypography>
              <List sx={{ pl: 4 }}>
                <ListItem>
                  <ListItemText
                    primary={
                      <MDTypography variant="button" fontWeight="regular">
                        Please carefully double-check the Beneficiary Account Number
                      </MDTypography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <MDTypography variant="button" fontWeight="regular">
                        Beneficiary Name, and Mobile Number before transferring money
                      </MDTypography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <MDTypography variant="button" fontWeight="regular">
                        If the account number or name is incorrect, you will be responsible for the
                        transaction.
                      </MDTypography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <MDTypography variant="button" fontWeight="regular">
                        Additionally, when transferring to another bank account
                      </MDTypography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <MDTypography variant="button" fontWeight="regular">
                        please verify the other banks information first
                      </MDTypography>
                    }
                  />
                </ListItem>
              </List>

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

export default ScheduleOtherBankTransfer;

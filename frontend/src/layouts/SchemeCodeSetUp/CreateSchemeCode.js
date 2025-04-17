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
import { useLocation } from "react-router-dom";
import IconButton from "@mui/material/IconButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { string } from "prop-types";
import { useNavigate } from "react-router-dom";
import DataTable from "examples/Tables/DataTable";
import beneficiaryList from "../../layouts/Beneficiary/data/beneficiaryList";
import EditIcon from "@mui/icons-material/Edit";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function CreateSchemeCode() {
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
  const [transactionLimit, setTransactionLimits] = useState([]);
  const [accountType, setAccountTypes] = useState([]);

  const [toAccountNoList, setToAccountNoList] = useState([]);
  const { currentAdmin } = useSelector((state) => state.admin);
  const [selectedValueForFromAcc, setSelectedValueForFromAcc] = useState(null);
  const [CurrencyValue, setCurrency] = useState("");
  const [description, setDescription] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  //Navigate
  const navigate = useNavigate();
  const { state } = useLocation();

  const CurrencyList = ["MMK", "USD"];

  const [columns] = useState([
    { Header: "No", accessor: "rowNumber", align: "left", width: "5%" },
    // { Header: "Particular", accessor: "particular", align: "left", width: "20%" },
    { Header: "Account Type", accessor: "accountType", align: "left", width: "40%" },
    { Header: "Transaction Limit Code", accessor: "transCode", align: "left", width: "40%" },
    // { Header: "Ofiice Account", accessor: "officeAccount", align: "left", width: "20%" },
    { Header: "Action", accessor: "delete", align: "center" },
  ]);

  const [allValue, setAllValue] = useState([
    { rowNumber: 1, accountType: null, transactionLimit: null },
  ]);

  //Dynamic Rows
  const rows = allValue.map((row, index) => ({
    rowNumber: row.rowNumber,
    accountType: (
      <Autocomplete
        size="small"
        value={row.accountType}
        onChange={(_, newValue) => handleAccountTypeChange(index, newValue)}
        options={accountType.filter((el) => !allValue.some((val) => val.accountType === el))}
        getOptionLabel={(option) => option || ""}
        renderInput={(params) => (
          <TextField {...params} size="small" label="Select Account Type" variant="outlined" />
        )}
        sx={{
          width: 250,
          "& .MuiInputBase-root": {
            height: 40,
          },
        }}
      />
    ),
    transCode: (
      <Autocomplete
        size="small"
        value={row.transactionLimit}
        onChange={(_, newValue) => handleTransactionLimitChange(index, newValue)}
        options={transactionLimit}
        getOptionLabel={(option) => option || ""}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Select Transaction Limit Code"
            variant="outlined"
          />
        )}
        sx={{
          width: 250,
          "& .MuiInputBase-root": {
            height: 40,
          },
        }}
      />
    ),
    delete: (
      <RemoveIcon
        fontSize="medium"
        sx={{ fontSize: "1.5rem", cursor: "pointer" }}
        onClick={() => handleRemoveRow(index)}
      />
    ),
  }));

  const handleAccountTypeChange = (index, newValue) => {
    const updated = [...allValue];
    updated[index].accountType = newValue;
    setAllValue(updated);
    console.log(allValue);
  };

  const handleTransactionLimitChange = (index, newValue) => {
    const updated = [...allValue];
    updated[index].transactionLimit = newValue;
    setAllValue(updated);
    console.log(allValue);
  };

  //Add Row
  const handleAddRow = () => {
    const newRow = {
      rowNumber: allValue.length + 1,
      accountType: null,
      transactionLimit: null,
    };
    setAllValue([...allValue, newRow]);
  };

  //Remove Row
  const handleRemoveRow = (index) => {
    const updated = allValue.filter((_, i) => i !== index);
    setAllValue(updated);
  };

  //FetchTransactionLimit
  const fetchAllTransactionLimit = async () => {
    try {
      const res = await axios.get("/translimit/fetchAllTransactionLimits");

      if (res.status == 200) {
        setTransactionLimits(res.data.data.map((el) => el.LimitCode));
      }
    } catch (err) {
      console.error("Error fetching Transaction Limit", err);
    }
  };

  //Fetch Account Type
  const fetchAllAccountType = async () => {
    try {
      const res = await axios.get("/accountTypes/getAccountType");

      if (res.status == 200) {
        console.log(res.data);
        setAccountTypes(res.data.data.map((el) => el.ProductName));
      }
    } catch (err) {
      console.error("Error fetching Transaction Limit", err);
    }
  };
  useEffect(() => {
    fetchAllTransactionLimit();
    fetchAllAccountType();
  }, []);

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

  const validateTransfer = async () => {
    try {
      const validateModel = {
        adminId: currentAdmin?.AdminID,
        limitCode: limitCode,
        limitType,
        currency: CurrencyValue,
        minAmount: minRawValue,
        maxAmount: maxRawValue,
        rate,

        description: description,
      };
      console.log(validateModel);
      const res = await axios.post("/translimit/createTransactionLimit", validateModel);

      console.log(res);
      if (res.status == 200) {
        setSuccessSB(true);
        resetAllStates();
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

  //Replace Digit
  const convertDigit = (value) => {
    return value.replace(/\D/g, "");
  };

  const convertDigitForCharges = (value) => {
    return value.replace(/[^\d.]/g, "");
  };

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      Transaction Limit
      <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
        {"  "} has been updated {"  "}
      </MDTypography>
      Successfully
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
      {state && (
        <MDAlert mt={2} color="success" dismissible>
          {alertContent("success")}
        </MDAlert>
      )}

      <MDBox mt={2} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={12}>
            <Card>
              <MDBox p={2} lineHeight={0}>
                <MDTypography variant="h5">Create Scheme Code</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Setting Scheme Code to define transaction limit for each account types
                </MDTypography>

                <MDBox p={2} mt={4}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} lg={10}>
                      <MDBox mb={2} sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {/* Label */}
                        <MDTypography variant="button" sx={{ minWidth: "100px" }}>
                          Limit Code:
                        </MDTypography>

                        {/* Input */}
                        <MDInput
                          type="text"
                          fullWidth
                          value={limitCode}
                          onChange={(e) => setLimitCode(e.target.value)}
                          sx={{
                            "& .MuiInputBase-root": {
                              height: 40,
                            },
                          }}
                        />
                      </MDBox>

                      {renderErrorSB}
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Start Transaction Limit Listing  */}
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
                Scheme And Transactions Limit
              </MDTypography>
            </MDBox>
            <MDBox pt={3} position="relative">
              {/* Add Icon positioned absolutely at top right */}
              <IconButton
                sx={{
                  position: "absolute",
                  fontSize: "1.0rem",
                  right: 45,
                  top: 50,
                  border: "1px solid",
                  borderColor: "grey",
                  borderRadius: "10%",
                  bgcolor: "error",
                  "&:hover": {
                    borderColor: "primary.dark",
                  },
                }}
                onClick={() => console.log("Add clicked")}
              >
                <AddIcon onClick={handleAddRow} sx={{ fontSize: "0.5rem", color: "white" }} />
              </IconButton>

              {/* DataTable takes full width */}
              <DataTable
                table={{ columns, rows }}
                isSorted={false}
                entriesPerPage={true}
                showTotalEntries={true}
                noEndBorder
              />

              <MDBox mt={1} mb={1} mr={2} display="flex" justifyContent="flex-end">
                <MDButton
                  type="button"
                  variant="gradient"
                  onClick={() =>
                    setAllValue([{ rowNumber: 1, accountType: null, transactionLimit: null }])
                  }
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
            </MDBox>
          </Card>
        </Grid>
      </Grid>

      {/* End Transaction Limit Listing  */}
    </DashboardLayout>
  );
}

export default CreateSchemeCode;

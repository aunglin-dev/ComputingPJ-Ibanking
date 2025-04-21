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

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";
import { string } from "prop-types";
import { useNavigate } from "react-router-dom";
import DataTable from "examples/Tables/DataTable";
import beneficiaryList from "../../layouts/Beneficiary/data/beneficiaryList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function TransactionLimit() {
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

  const [toAccountNoList, setToAccountNoList] = useState([]);
  const { currentAdmin } = useSelector((state) => state.admin);
  const [selectedValueForFromAcc, setSelectedValueForFromAcc] = useState(null);
  const [CurrencyValue, setCurrency] = useState("");
  const [description, setDescription] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [rows, setRows] = useState([]);
  const [columns] = useState([
    { Header: "Limit Code", accessor: "limitCode", align: "left" },
    { Header: "Limit Type", accessor: "type", align: "left" },
    { Header: "Currency", accessor: "currency", align: "center" },

    { Header: "Minimum Transaction Amount", accessor: "MinTraxAmt", align: "center" },
    { Header: "Maximum Transaction Amount", accessor: "MaxTraxAmt", align: "center" },
    { Header: "Limit Code Description", accessor: "LimitCodeDesc", align: "center" },
    { Header: "Action", accessor: "edit", align: "center" },
    { Header: "Action", accessor: "delete", align: "center" },
  ]);

  //Navigate
  const navigate = useNavigate();
  const { state } = useLocation();
  //FetchTransactionLimit
  const fetchAllTransactionLimit = async () => {
    try {
      const res = await axios.get("/translimit/fetchAllTransactionLimits");

      const formattedRows = res.data.data.map((el) => ({
        limitCode: el.LimitCode,
        type: el.LimitType,
        currency: el.Currency,
        MinTraxAmt: el.MinTransactionAmount,
        MaxTraxAmt: el.MaxTransactionAmount,
        LimitCodeDesc: el.LimitCodeDesc,
        edit: (
          <EditIcon
            onClick={() => handleEdit(el.Id)}
            fontSize="medium"
            curs
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
          />
        ),
        delete: (
          <DeleteIcon
            onClick={() => handleApprove(el.Id)}
            fontSize="medium"
            curs
            style={{ fontSize: "1.5rem", cursor: "pointer" }}
          />
        ),
      }));

      setRows(formattedRows);
    } catch (err) {
      console.error("Error fetching Transaction Limit", err);
    }
  };

  //handle
  const handleEdit = async (translimitId) => {
    navigate("/transactionLimit/Edit", {
      state: translimitId,
    });
  };
  //Delete Transaction Limit
  const handleApprove = async (translimitId) => {
    const confirmed = window.confirm("Please Confirm to delete this Limit Code?");
    if (!confirmed) return;

    try {
      await axios.put("/translimit/deleteTransactionLimit", {
        translimitId,
      });

      fetchAllTransactionLimit();
      setWarningSB(true);
    } catch (err) {
      console.error("Deleted error:", err);
      alert("Failed to Delete");
    }
  };

  useEffect(() => {
    fetchAllTransactionLimit();
  }, [errorSB, successSB]);

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

  // Handle input change for Minimum Value
  const handleChangeForMinValue = (e) => {
    const inputValue = e.target.value;

    const numericValue = convertDigit(inputValue);

    setMinRawValue(numericValue);

    const formattedValue = formatWithSeparator(numericValue);

    setDisplayMinValue(formattedValue);
  };

  // Handle input change for Minimum Value
  const handleChangeForMaxValue = (e) => {
    const inputValue = e.target.value;

    const numericValue = convertDigit(inputValue);
    setMaxRawValue(numericValue);

    const formattedValue = formatWithSeparator(numericValue);

    setDisplayMaxValue(formattedValue);
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
      title="Create Transaction Limit"
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
                <MDTypography variant="h5">Transaction Limit</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Setting Transaction Limit and Charges For Transferring Funds
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Limit Code"
                        fullWidth
                        value={limitCode}
                        onChange={(e) => setLimitCode(e.target.value)}
                      />
                    </MDBox>

                    {renderErrorSB}
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Limit Type"
                        fullWidth
                        value={limitType}
                        onChange={(e) => setLimitType(e.target.value)}
                      />
                    </MDBox>

                    {renderErrorSB}
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <Autocomplete
                      value={CurrencyValue}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      onChange={(event, newValue) => {
                        setCurrency(newValue);

                        console.log(newValue);
                      }}
                      options={CurrencyList}
                      getOptionLabel={(option) => option || ""} // Handle null/undefined
                      renderInput={(params) => (
                        <TextField {...params} label="Select Currency" variant="outlined" />
                      )}
                    />

                    {renderSuccessSB}
                  </Grid>

                  {/* <Grid item xs={12} sm={6} lg={6}>
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
                  </Grid> */}
                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Minimum Amount"
                        fullWidth
                        value={displayMinValue}
                        onChange={handleChangeForMinValue}
                      />
                    </MDBox>

                    {renderWarningSB}
                  </Grid>

                  <Grid item xs={12} sm={6} lg={6}>
                    <MDBox mb={2}>
                      <MDInput
                        type="text"
                        label="Maximum Amount"
                        fullWidth
                        value={displayMaxValue}
                        onChange={handleChangeForMaxValue}
                      />
                    </MDBox>

                    {renderWarningSB}
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

                    {renderErrorSB}
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
                Transaction Limits List
              </MDTypography>
            </MDBox>
            <MDBox pt={3}>
              <DataTable
                table={{ columns, rows }}
                isSorted={false}
                entriesPerPage={true}
                showTotalEntries={true}
                noEndBorder
              />
            </MDBox>
          </Card>
        </Grid>
      </Grid>

      {/* End Transaction Limit Listing  */}
    </DashboardLayout>
  );
}

export default TransactionLimit;

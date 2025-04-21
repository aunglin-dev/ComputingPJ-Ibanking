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
import MDInput from "components/MDInput";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import DataTable from "examples/Tables/DataTable";
import beneficiaryList from "../../layouts/Beneficiary/data/beneficiaryList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { tranType } from "helper/TransferType";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function TranHistory() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const { currentAdmin } = useSelector((state) => state.admin);

  const [errorMessage, setErrorMessage] = useState("");
  const [rows, setRows] = useState([]);
  const [columns] = useState([
    { Header: "Transaction Id", accessor: "TransId", align: "left" },
    { Header: "From Account ", accessor: "fromAcc", align: "left" },
    { Header: "To Account", accessor: "toAcc", align: "left" },
    { Header: "To Account Name", accessor: "toAccName", align: "left" },
    { Header: "Transaction Amount", accessor: "traxAmt", align: "left" },
    { Header: "Total Charges", accessor: "totalCharges", align: "left" },
    { Header: "Description", accessor: "description", align: "left" },
    { Header: "ToBank Id", accessor: "toBankId", align: "left" },
    { Header: "To Branch Id", accessor: "toBranchId", align: "left" },
    { Header: "Currency", accessor: "currency", align: "left" },
    { Header: "Status", accessor: "status", align: "left" },
    { Header: "TranType", accessor: "tranType", align: "left" },
    { Header: "Transaction Date", accessor: "date", align: "left" },
  ]);

  //Date And TranType
  const getFormattedDate = (date) => {
    return date.toISOString().split("T")[0]; // returns 'YYYY-MM-DD'
  };

  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  const [fromDate, setFromDate] = useState(getFormattedDate(lastMonth));
  const [toDate, setToDate] = useState(getFormattedDate(today));
  const [tranType, setTranType] = useState(null);

  //Navigate
  const navigate = useNavigate();
  const { state, nameddd } = useLocation();

  console.log("State___________From Edit", state, nameddd);

  //List of Transaction Type
  const transList = [
    "TransferOwnAccount",
    "TransferOtherAccount",
    "TransferOtherBank",
    "ScheduleTransferOtherAccount",
    "ScheduleTransferOtherBank",
    "RemittanceTransfer",
  ];

  //FetchTransactionLimit
  const fetchAllTransactionHistory = async () => {
    try {
      const res = await axios.post("/tranHistory/fetchTranHistorys", {
        fromDate,
        toDate,
        trantype: tranType,
      });

      console.log(res);
      const formattedRows = res.data.data.map((el) => ({
        TransId: el.TransactionId,
        fromAcc: el.FromAccount,
        toAcc: el.ToAccount,
        toAccName: el.ToAccountName,
        traxAmt: el.TransactionAmount,
        totalCharges: el.TotalCharges ?? 0.0,
        description: el.Description ?? "NA",
        toBankId: el.ToBank ?? "NA",
        toBranchId: el.ToBranch ?? "NA",
        currency: el.Currency,
        status: el.Status,
        tranType: el.TranType,
        // date: el.TransactionDate.toISOString().split("T")[0],
        date:
          typeof el.TransactionDate === "string"
            ? el.TransactionDate.slice(0, 10) // "YYYY-MM-DD"
            : new Date(el.TransactionDate).toISOString().split("T")[0],
      }));

      setRows(formattedRows);
    } catch (err) {
      console.error("Error fetching Transaction Limit", err);
    }
  };

  useEffect(() => {
    fetchAllTransactionHistory();
  }, [fromDate, toDate, tranType]);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      Particular
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
      title="Scheme Code Deletion"
      content="Scheme Code is Successfully Deleted"
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
          {alertContent(nameddd)}
        </MDAlert>
      )}

      <MDBox mt={2} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={12}>
            <Card>
              <MDBox p={2} lineHeight={2}>
                <MDTypography variant="h5">Transaction History</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Transaction Historys that have been done by all users
                </MDTypography>
                {renderWarningSB}
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
                Transaction History List
              </MDTypography>
            </MDBox>
            <Grid item xs={12} sm={6} lg={12}>
              <Grid item xs={12} sm={6} lg={6} ml={2} mt={4}>
                <MDBox sx={{ display: "flex", gap: 2, position: "relative" }}>
                  <MDBox mt={2}>
                    <MDInput
                      defaultValue={fromDate}
                      type="date"
                      label="From Date"
                      fullWidth
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      //   inputProps={{ min: formattedTomorrow }}
                    />
                  </MDBox>
                  <MDBox mt={2}>
                    <MDInput
                      defaultValue={toDate}
                      type="date"
                      label="To Date"
                      fullWidth
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      //   inputProps={{ min: formattedTomorrow }}
                    />
                  </MDBox>
                  <Grid item xs={12} sm={6} lg={6} mt={2}>
                    <Autocomplete
                      value={tranType}
                      //   isOptionEqualToValue={(option, value) => option.value === value.value}
                      //   onChange={(event, newValue) => {
                      //     setCurrency(newValue);

                      //     console.log(newValue);
                      //   }}
                      onChange={(event, newValue) => setTranType(newValue)}
                      options={transList}
                      getOptionLabel={(option) => option || ""} // Handle null/undefined
                      renderInput={(params) => (
                        <TextField {...params} label="Select Transaction Type" variant="outlined" />
                      )}
                    />

                    {renderSuccessSB}
                  </Grid>
                </MDBox>
              </Grid>

              {renderWarningSB}
            </Grid>

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

export default TranHistory;

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

function Particular() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const { currentAdmin } = useSelector((state) => state.admin);

  const [errorMessage, setErrorMessage] = useState("");
  const [rows, setRows] = useState([]);
  const [columns] = useState([
    { Header: "Transaction Type", accessor: "TransType", align: "left" },
    { Header: "Office Account Number", accessor: "OfficeAcc", align: "left" },
    { Header: "Charge Rate", accessor: "ChargesRate", align: "left" },

    { Header: "Action", accessor: "delete", align: "right" },
  ]);

  //Navigate
  const navigate = useNavigate();
  const { state, nameddd } = useLocation();

  console.log("State___________From Edit", state, nameddd);
  //FetchTransactionLimit
  const fetchAllTransactionLimit = async () => {
    try {
      const res = await axios.get("/particular/fetchParticular");

      const formattedRows = res.data.data.map((el) => ({
        TransType: el.TranType,
        OfficeAcc: el.OfficeAccountNumber ?? "N/A",
        ChargesRate: el.ChargesRate ?? "N/A",

        delete: (
          <MDBox display="flex" alignItems="center" gap={1}>
            <EditIcon
              onClick={() => handleEdit(el.Id)}
              fontSize="medium"
              sx={{ fontSize: "1.5rem", cursor: "pointer" }}
            />
          </MDBox>
        ),
      }));

      setRows(formattedRows);
    } catch (err) {
      console.error("Error fetching Transaction Limit", err);
    }
  };

  //handle
  const handleEdit = async (Id) => {
    navigate("/particularlist/Edit", {
      state: Id,
    });
  };
  //Delete Transaction Limit
  const handleApprove = async (SchemeCode) => {
    const confirmed = window.confirm("Please Confirm to delete this Limit Code?");
    if (!confirmed) return;

    try {
      await axios.post("/schemeCode/deleteSchemeCode", {
        schemeCode: SchemeCode,
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
                <MDTypography variant="h5">Manage Transaction Type and Office Account</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Predefining OfficeAccount and Charges Rate For each Transaction Type
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
                Particular List
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

export default Particular;

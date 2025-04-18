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
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { Badge } from "@mui/material";

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
import team2 from "assets/images/team-2.jpg";
import LockIcon from "@mui/icons-material/Lock";

import LockOpenIcon from "@mui/icons-material/LockOpen";

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
    //////

    { Header: "Customer", accessor: "author", width: "45%", align: "left" },

    { Header: "Username", accessor: "username", align: "left" },
    { Header: "No Of Account", accessor: "NOA", align: "center", width: "45%" },
    { Header: "Address", accessor: "function", align: "left" },
    { Header: "NRC", accessor: "nrc", align: "center" },
    { Header: "PhoneNumber", accessor: "employed", align: "center" },
    { Header: "Gender", accessor: "Gender", align: "center" },
    { Header: "SchemeCode", accessor: "SchemeCode", align: "center" },
    { Header: "IsLockUser", accessor: "IsLockUser", align: "center" },
    { Header: "Status", accessor: "employ", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ]);

  //Navigate
  const navigate = useNavigate();
  const { state } = useLocation();

  //FetchTransactionLimit
  const fetchAllTransactionLimit = async () => {
    try {
      const res = await axios.get("/user/getUsers");

      const formattedRows = res.data.data.map((user) => ({
        author: (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDBox ml={2} lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
                {user.FullName}
              </MDTypography>
              <MDTypography variant="caption">{user.Email}</MDTypography>
            </MDBox>
          </MDBox>
        ),
        username: user?.UserName,
        function: (
          <MDTypography variant="caption" color="text" fontWeight="small" align="left">
            {user?.Address}
          </MDTypography>
        ),
        Gender: (
          <MDTypography variant="caption" color="text" fontWeight="small" align="left">
            {user?.Gender}
          </MDTypography>
        ),
        nrc: (
          <MDTypography variant="caption" color="text" fontWeight="small" align="left">
            {user?.NRC}
          </MDTypography>
        ),
        NOA: (
          <MDBox lineHeight={1} textAlign="center">
            <MDTypography
              display="block"
              variant="button"
              color="text"
              fontWeight="medium"
              algin="center"
            >
              {user?.accountSummary?.noOfAccountList}
            </MDTypography>
            <MDBox pr={4} lineHeight={1.5} display="flex" flexDirection="column">
              {user?.accountSummary?.accountTypeList?.map((el, index) => (
                <MDTypography
                  variant="caption"
                  key={el?.AccountId || index}
                  color="text"
                  fontWeight="small"
                  align="left"
                >
                  {el?.ProductName || "N/A"}
                </MDTypography>
              ))}
            </MDBox>
          </MDBox>
        ),
        SchemeCode: (
          <MDTypography variant="caption" color="text" fontWeight="small" align="left">
            {user?.SchemeCode ?? "NA"}
          </MDTypography>
        ),
        IsLockUser: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={user.IsLoginLockUser != 1 ? "None" : "Locked"}
              color={user.IsLoginLockUser != 1 ? "success" : "dark"}
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        employ: (
          <MDBox ml={-1}>
            <MDBadge
              badgeContent={user.UserType == null ? "Requested" : "Registered"}
              color={user.UserType != null ? "success" : "dark"}
              variant="gradient"
              size="sm"
            />
          </MDBox>
        ),
        employed: (
          <MDTypography variant="caption" color="text" fontWeight="small" align="left">
            {user?.PhoneNumber}
          </MDTypography>
        ),

        action: (
          <MDBox display="flex" alignItems="center" gap={1}>
            <EditIcon
              onClick={() => handleEdit(user.UserId, user.SchemeCode)}
              fontSize="medium"
              sx={{ fontSize: "1.5rem", cursor: "pointer" }}
            />
            <MDBox component="span" sx={{ color: "grey.500" }}>
              |
            </MDBox>

            {user.IsLoginLockUser != 1 ? (
              <LockIcon
                onClick={() => handleApprove(user.UserId)}
                fontSize="medium"
                sx={{ fontSize: "1.5rem", cursor: "pointer" }}
              />
            ) : (
              <LockOpenIcon
                onClick={() => handleApprove(user.UserId, 0)}
                fontSize="medium"
                sx={{ fontSize: "1.5rem", cursor: "pointer" }}
              />
            )}

            <MDBox component="span" sx={{ color: "grey.500" }}>
              |
            </MDBox>

            {user.UserType == null ? (
              <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
              >
                <Badge onClick={() => btnApprove(user.UserId)}>Approve</Badge>
              </MDTypography>
            ) : (
              <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="text"
                fontWeight="medium"
              >
                <Badge disable={true}>Approved</Badge>
              </MDTypography>
            )}
          </MDBox>
        ),
      }));

      setRows(formattedRows);
    } catch (err) {
      console.error("Error fetching Transaction Limit", err);
    }
  };

  //handle
  const handleEdit = async (UserId, SchemeCode) => {
    console.log(SchemeCode);
    const editModel = {
      UserId,
      SchemeCode,
    };
    console.log(editModel);
    navigate("/CustomerList/Edit", { state: { editModel } });
  };

  const btnApprove = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to approve this user?");

    if (isConfirmed) {
      try {
        const res = await axios.put("/user/ApproveUser", {
          UserId: id,
          UserType: 1,
        });

        fetchAllTransactionLimit();
        setSuccessSB(true);
      } catch (error) {
        window.alert("Error approving user");
      }
    } else {
      window.alert("Approval cancelled");
    }
  };
  //Delete Transaction Limit
  const handleApprove = async (UserId, Id) => {
    const confirmed = window.confirm("Please Confirm to lock this Limit Code?");
    if (!confirmed) return;

    try {
      await axios.put("/user/lockUnlock", {
        UserId,
        condition: Id,
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

  const alertContent = (name) => (
    <MDTypography variant="body2" color="white">
      Scheme Code
      <MDTypography component="a" href="#" variant="body2" fontWeight="medium" color="white">
        {"  "} has been updated {"  "}
      </MDTypography>
      Successfully for Customer
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
      title="User Updated"
      content="User Data Has Been Successfully Deleted"
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
              <MDBox p={2} lineHeight={2}>
                <MDTypography variant="h5">Manage Customer</MDTypography>
                <MDTypography variant="button" color="text" fontWeight="regular">
                  Customer Registration Setup, Locking, and Scheme Code Change
                </MDTypography>
                {renderSuccessSB}
                {renderErrorSB}
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
                Customer Lists
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

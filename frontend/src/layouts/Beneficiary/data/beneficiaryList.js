import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useState, useEffect, use } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import MDSnackbar from "components/MDSnackbar";
import DeleteIcon from "@mui/icons-material/Delete";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { Badge } from "@mui/material";

export default function data() {
  //Redux
  const { currentCustomer } = useSelector((state) => state.customer);

  const [BeneficiaryList, setBeneficiaryList] = useState([]);

  const fetchData = async () => {
    try {
      console.log("current Customer for Beneficiary________________", currentCustomer?.UserId);
      const response = await axios.post("/beneficiary/fetchAllBeneficiary", {
        userId: currentCustomer?.UserId,
      });
      if (response.status == 200) {
        setBeneficiaryList(response.data["data"]);
        console.log("retrieve data for Beneficiary List", BeneficiaryList);
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
    fetchData();
  }, []);

  const btnApprove = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to approve this user?");

    if (isConfirmed) {
      try {
        const res = await axios.put("/user/ApproveUser", {
          UserId: id,
          UserType: "Registered",
        });

        fetchData(); // Call to refresh data
        window.alert("Successfully Approved");
      } catch (error) {
        window.alert("Error approving user");
      }
    } else {
      window.alert("Approval cancelled");
    }
  };

  //Delete Beneficiary
  const handleApprove = async (id) => {
    const confirmed = window.confirm("Please Confirm to delete this Beneficary?");
    if (!confirmed) return;

    console.log("Beneficary Id", id);
    try {
      const res = await axios.put("/beneficiary/deleteBeneficiary", {
        id,
      });
      if (res.status == 200) {
        window.alert("Successfully Deleted");
      }
    } catch (err) {
      console.error("Deleted error:", err);
      alert("Failed to Delete");
    }
  };

  const rows = BeneficiaryList.map((user) => ({
    accountNo: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {user.AccountNo}
      </MDTypography>
    ),

    type: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {user.Type}
      </MDTypography>
    ),
    accountHolder: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {user.AccountName}
      </MDTypography>
    ),
    nickName: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {user.NickName}
      </MDTypography>
    ),
    relationShip: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {user.Description}
      </MDTypography>
    ),
    delete: (
      <MDBox display="flex" alignItems="center" gap={1}>
        <DeleteIcon
          onClick={() => handleApprove(user.Id)}
          fontSize="medium"
          sx={{ fontSize: "1.5rem", cursor: "pointer" }}
        />
      </MDBox>
    ),
  }));

  return {
    columns: [
      { Header: "Account No", accessor: "accountNo", align: "left" },
      { Header: "Type Of Beneficary", accessor: "type", align: "left" },
      { Header: "Account Holder Name", accessor: "accountHolder", align: "center" },
      { Header: "Nickname", accessor: "nickName", align: "center" },

      { Header: "RelationShip", accessor: "relationShip", align: "center" },
      { Header: "Action", accessor: "delete", align: "left" },
      //   { Header: "Status", accessor: "employ", align: "center" },
      //   { Header: "IsLockUser", accessor: "IsLoginLockUser", align: "center" },
      //   { Header: "Gender", accessor: "Gender", align: "center" },
      //   { Header: "No Of Account", accessor: "No Of Account", align: "center" },
    ],
    rows,
  };
}

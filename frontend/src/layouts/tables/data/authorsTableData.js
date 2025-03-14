/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useState, useEffect, use } from "react";
import axios from "axios";

// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { Badge } from "@mui/material";

export default function data() {
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );
  const [userData, setUserData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/user/getUsers"); // Replace with your API endpoint
      setUserData(response.data["data"]);
      console.log("retrieve data", userData);
    } catch (error) {
      console.error("Error fetching data", error);
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

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const rows = userData.map((user) => ({
    author: <Author image={team2} name={user.FullName} email={user.Email} />,
    function: <Job title={user.UserType} description={user.Address || "N/A"} />,
    employ: (
      <MDBox ml={-1}>
        <MDBadge
          badgeContent={user.UserType == "Requested" ? user.UserType : "Registered"}
          color={user.UserType == "Requested" ? "success" : "dark"}
          variant="gradient"
          size="sm"
        />
      </MDBox>
    ),
    employed: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {user.PhoneNumber}
      </MDTypography>
    ),
    action: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        <Badge onClick={() => btnApprove(user.UserId)} disable={true}>
          Approve 
        </Badge>
      </MDTypography>
    ),
    Gender: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {user.Gender}
      </MDTypography>
    ),
  }));

  // const rows = [
  //   {
  //     author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
  //     function: <Job title="Manager" description="Organization" />,
  //     status: (
  //       <MDBox ml={-1}>
  //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
  //       </MDBox>
  //     ),
  //     employed: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         23/04/18
  //       </MDTypography>
  //     ),
  //     action: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         Edit
  //       </MDTypography>
  //     ),
  //   },
  //   {
  //     author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
  //     function: <Job title="Programator" description="Developer" />,
  //     status: (
  //       <MDBox ml={-1}>
  //         <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
  //       </MDBox>
  //     ),
  //     employed: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         11/01/19
  //       </MDTypography>
  //     ),
  //     action: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         Edit
  //       </MDTypography>
  //     ),
  //   },
  //   {
  //     author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
  //     function: <Job title="Executive" description="Projects" />,
  //     status: (
  //       <MDBox ml={-1}>
  //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
  //       </MDBox>
  //     ),
  //     employed: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         19/09/17
  //       </MDTypography>
  //     ),
  //     action: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         Edit
  //       </MDTypography>
  //     ),
  //   },
  //   {
  //     author: <Author image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
  //     function: <Job title="Programator" description="Developer" />,
  //     status: (
  //       <MDBox ml={-1}>
  //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
  //       </MDBox>
  //     ),
  //     employed: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         24/12/08
  //       </MDTypography>
  //     ),
  //     action: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         Edit
  //       </MDTypography>
  //     ),
  //   },
  //   {
  //     author: <Author image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
  //     function: <Job title="Manager" description="Executive" />,
  //     status: (
  //       <MDBox ml={-1}>
  //         <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
  //       </MDBox>
  //     ),
  //     employed: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         04/10/21
  //       </MDTypography>
  //     ),
  //     action: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         Edit
  //       </MDTypography>
  //     ),
  //   },
  //   {
  //     author: <Author image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
  //     function: <Job title="Programator" description="Developer" />,
  //     status: (
  //       <MDBox ml={-1}>
  //         <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
  //       </MDBox>
  //     ),
  //     employed: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         14/09/20
  //       </MDTypography>
  //     ),
  //     action: (
  //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
  //         Edit
  //       </MDTypography>
  //     ),
  //   },
  // ];
  return {
    columns: [
      { Header: "Customer", accessor: "author", width: "45%", align: "left" },
      { Header: "CIFID", accessor: "function", align: "left" },
      { Header: "NRC", accessor: "status", align: "center" },
      { Header: "PhoneNumber", accessor: "employed", align: "center" },

      { Header: "Status", accessor: "employ", align: "center" },
      { Header: "IsLockUser", accessor: "IsLoginLockUser", align: "center" },
      { Header: "Gender", accessor: "Gender", align: "center" },
      { Header: "No Of Account", accessor: "No Of Account", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows,

    // rows: [
    //   {
    //     author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
    //     function: <Job title="Manager" description="Organization" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         23/04/18
    //       </MDTypography>
    //     ),
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Edit
    //       </MDTypography>
    //     ),
    //   },
    //   {
    //     author: <Author image={team3} name="Alexa Liras" email="alexa@creative-tim.com" />,
    //     function: <Job title="Programator" description="Developer" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         11/01/19
    //       </MDTypography>
    //     ),
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Edit
    //       </MDTypography>
    //     ),
    //   },
    //   {
    //     author: <Author image={team4} name="Laurent Perrier" email="laurent@creative-tim.com" />,
    //     function: <Job title="Executive" description="Projects" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         19/09/17
    //       </MDTypography>
    //     ),
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Edit
    //       </MDTypography>
    //     ),
    //   },
    //   {
    //     author: <Author image={team3} name="Michael Levi" email="michael@creative-tim.com" />,
    //     function: <Job title="Programator" description="Developer" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="online" color="success" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         24/12/08
    //       </MDTypography>
    //     ),
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Edit
    //       </MDTypography>
    //     ),
    //   },
    //   {
    //     author: <Author image={team3} name="Richard Gran" email="richard@creative-tim.com" />,
    //     function: <Job title="Manager" description="Executive" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         04/10/21
    //       </MDTypography>
    //     ),
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Edit
    //       </MDTypography>
    //     ),
    //   },
    //   {
    //     author: <Author image={team4} name="Miriam Eric" email="miriam@creative-tim.com" />,
    //     function: <Job title="Programator" description="Developer" />,
    //     status: (
    //       <MDBox ml={-1}>
    //         <MDBadge badgeContent="offline" color="dark" variant="gradient" size="sm" />
    //       </MDBox>
    //     ),
    //     employed: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         14/09/20
    //       </MDTypography>
    //     ),
    //     action: (
    //       <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //         Edit
    //       </MDTypography>
    //     ),
    //   },
    // ],
  };
}

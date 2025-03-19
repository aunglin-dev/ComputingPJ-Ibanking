import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useDispatch } from "react-redux";
import { loginStart, loginFailure, loginSuccess } from "./../../../Storage/admin";
import axios from "axios";
import SignIn from "../sign-in/";
// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { useLocation } from "react-router-dom";
import { Password } from "@mui/icons-material";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState(""); // State to store email
  const [password, setPassword] = useState(""); // State to store password
  const location = useLocation();
  const { userid } = location.state || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    try {
      event.preventDefault();
      console.log("Email: ", email);
      console.log("Password: ", password);
      console.log(userid);
      const res = await axios.post("/auth/changepassword", {
        userId: userid,
        password: password,
      });

      setPassword("");
      console.log(res);
      if (res.status == 200) {
        //   dispatch(loginSuccess(res.data));
        console.log(res);
        window.alert(res.data.message);
        navigate("/authentication/Customer_Sign_In");
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.status);
        if (error.response.status === 500) {
          alert("Something went wrong on the server. Please try again later.");
        } else if (error.response.status === 400) {
          window.alert(error.response.data.message); // 400 Bad Request
        }
      } else if (error.request) {
        console.error("No response received from the server:", error.request);
        alert("Unable to connect to the server. Please check your internet connection.");
      } else {
        console.error("Error setting up the request:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }

    // Handle the response (e.g., login success/failure)
  };

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            Type New Password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={onSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="New Password"
                fullWidth
                value={password} // Bind password state to the input
                onChange={(e) => setPassword(e.target.value)} // Update password state
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="error" fullWidth>
                Confirm
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;

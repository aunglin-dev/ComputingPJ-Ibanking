import { useEffect, useState } from "react";

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
import MDSnackbar from "components/MDSnackbar";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useDispatch } from "react-redux";
import { loginStart, loginFailure, loginSuccess } from "./../../../Storage/customer";
import { Adminlogout } from "./../../../Storage/admin";
import axios from "axios";
import SignIn from "../sign-in/";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState(""); // State to store email
  const [password, setPassword] = useState(""); // State to store password

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //Message Box
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event) => {
    try {
      event.preventDefault();

      const res = await axios.post("/auth/signin", {
        email: email,
        password: password,
      });

      console.log("Still Correct");

      if (res.status === 200) {
        if (res.data.isFirstLogin) {
          let userid = res.data.data.userId;
          navigate("/authentication/first-login", { state: { userid } });

          console.log("_____________________", res);
          console.log(userid);
        } else {
          window.alert("Welcome From SMEDB I-Banking System ");
          navigate("/dashboard");
          console.log(res.data);
          dispatch(loginSuccess(res.data));
        }
      }
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.status);
        if (error.response.status === 500) {
          alert("Something went wrong on the server. Please try again later.");
        } else if (error.response.status === 400) {
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
    dispatch(Adminlogout());
  }, []);

  // API return Message

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  const renderErrorSB = (
    <MDSnackbar
      color="error"
      icon="warning"
      title="User Sign In Fail!"
      content={errorMessage}
      dateTime="Just Now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );

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
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={onSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email} // Bind email state to the input
                onChange={(e) => setEmail(e.target.value)} // Update email state
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password} // Bind password state to the input
                onChange={(e) => setPassword(e.target.value)} // Update password state
              />
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="error" fullWidth>
                Sign in
              </MDButton>
              {renderErrorSB}
            </MDBox>
            <MDBox mt={1} textAlign="center">
              <MDTypography variant="button" color="text">
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="error"
                  fontWeight="medium"
                  textGradient
                >
                  Login in as Adminstrator
                </MDTypography>
              </MDTypography>
            </MDBox>
            <MDBox mt={1} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="error"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;

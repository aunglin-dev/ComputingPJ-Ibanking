import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import { Grid, Chip } from "@mui/material";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useForm, Controller } from "react-hook-form";

import MDSnackbar from "components/MDSnackbar";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/Smedb.png";
import axios from "axios";

function Cover() {
  const [date, setDate] = useState("0001-01-01");
  const [selectedValues, setSelectedValues] = useState([]);

  //Message Box
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const Gender = ["Male", "Female"];
  const [accounts, setAccounts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  //Fetch Accounts
  const fetchAccounts = async () => {
    const resAccount = await axios.get("/accountTypes/getAccountType");
    console.log(resAccount);
    console.log(resAccount.data.data);
    setAccounts(resAccount.data.data);
    console.log("retrieve data", accounts.data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Form Data:", data);
      const res = await axios.post("/user/requestUserAccount", {
        username: data.username,
        fullName: data.fullName,
        NRC: `${data.region}/${data.township}/${data.uniqueId}`,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        email: data.email,

        address: data.address,
        gender: data.gender,

        accountType: data.accountType,
      });

      console.log(res);
      if (res.status == 201) {
        reset();
        setSuccessSB(true);

        console.log(res.data);
      } else {
        reset();
        window.alert("Account Requested Fail");
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

  // API return Message

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
      title="Self Registration Success"
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
      title="Self Registration Fail!"
      content={errorMessage}
      dateTime="Just Now"
      open={errorSB}
      onClose={closeErrorSB}
      close={closeErrorSB}
      bgWhite
    />
  );
  return (
    <CoverLayout image={bgImage} minHeight={500}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter below information to request an account
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
            <MDBox mb={2}>
              <Controller
                name="accountType"
                control={control}
                defaultValue={["Current Account"]} // Set default value
                rules={{ required: "Account Type is required" }}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={
                      Array.isArray(accounts) ? accounts.map((account) => account.ProductName) : []
                    }
                    value={field.value}
                    onChange={(event, newValue) => {
                      // Prevent removal of "Current Account"
                      if (!newValue.includes("Current Account")) {
                        newValue.push("Current Account");
                      }
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Type Of Account"
                        variant="standard"
                        fullWidth
                        placeholder="Select or enter account types"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, key) => (
                        <Chip
                          key={key}
                          label={option}
                          {...getTagProps({ key })}
                          color="primary"
                          size="small"
                          onDelete={
                            option === "Current Account" ? undefined : getTagProps({ key }).onDelete
                          } // Disable delete for "Current Account"
                        />
                      ))
                    }
                    freeSolo
                  />
                )}
              />
            </MDBox>
            <MDBox mb={2}>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <MDInput
                    {...field}
                    type="text"
                    label="Username"
                    variant="standard"
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <MDInput
                    {...field}
                    type="email"
                    label="Email"
                    variant="standard"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <Controller
                name="fullName"
                control={control}
                defaultValue=""
                rules={{ required: "Full Name is required" }}
                render={({ field }) => (
                  <MDInput
                    {...field}
                    type="text"
                    label="Full Name"
                    variant="standard"
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="region"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Region is required" }}
                    render={({ field }) => (
                      <MDInput
                        {...field}
                        type="text"
                        label="Region"
                        variant="standard"
                        fullWidth
                        placeholder="12"
                        error={!!errors.region}
                        helperText={errors.region?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="township"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Township is required" }}
                    render={({ field }) => (
                      <MDInput
                        {...field}
                        type="text"
                        label="Township"
                        variant="standard"
                        fullWidth
                        placeholder="KAMAYA"
                        error={!!errors.township}
                        helperText={errors.township?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="uniqueId"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Unique Identifier is required" }}
                    render={({ field }) => (
                      <MDInput
                        {...field}
                        type="text"
                        label="Unique Identifier"
                        variant="standard"
                        fullWidth
                        placeholder="239833"
                        error={!!errors.uniqueId}
                        helperText={errors.uniqueId?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </MDBox>

            <MDBox mb={2}>
              <Controller
                name="dateOfBirth"
                control={control}
                defaultValue="2000-01-01"
                rules={{ required: "Date of Birth is required" }}
                render={({ field }) => (
                  <MDInput
                    {...field}
                    type="date"
                    label="Date Of Birth"
                    variant="standard"
                    fullWidth
                    error={!!errors.dateOfBirth}
                    helperText={errors.dateOfBirth?.message}
                  />
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <Controller
                name="company"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <MDInput {...field} type="text" label="Company" variant="standard" fullWidth />
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <Controller
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{ required: "Phone Number is required" }}
                render={({ field }) => (
                  <MDInput
                    {...field}
                    type="text"
                    label="Phone Number"
                    variant="standard"
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                  />
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <MDInput
                    {...field}
                    type="text"
                    label="Address"
                    variant="standard"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </MDBox>

            <MDBox mb={2}>
              <Controller
                name="gender"
                control={control}
                defaultValue=""
                rules={{ required: "Gender is required" }}
                render={({ field }) => (
                  <Autocomplete
                    options={Gender}
                    value={field.value}
                    onChange={(event, newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Gender"
                        variant="standard"
                        fullWidth
                        error={!!errors.gender}
                        helperText={errors.gender?.message}
                      />
                    )}
                    freeSolo
                  />
                )}
              />
              {renderSuccessSB}
              {renderErrorSB}
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Controller
                name="terms"
                control={control}
                defaultValue={false}
                rules={{ required: "You must agree to the terms and conditions" }}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
              {/* Display validation error message */}
              {errors.terms && (
                <MDTypography variant="caption" color="error" sx={{ ml: 1 }}>
                  {errors.terms.message}
                </MDTypography>
              )}
            </MDBox>

            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="error" fullWidth>
                Request Account
              </MDButton>
            </MDBox>

            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;

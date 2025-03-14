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
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function Cover() {
  const [date, setDate] = useState("0001-01-01");
  const [selectedValues, setSelectedValues] = useState([]);
  const options = ["Savings Account", "Checking Account", "Business Account", "Student Account"];
  const Gender = ["Male", "Female"];

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
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
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <Autocomplete
                multiple
                options={options}
                value={selectedValues}
                onChange={(event, newValue) => {
                  setSelectedValues(newValue);
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
                      key={key} // Add the key prop here
                      label={option}
                      {...getTagProps({ key })} // Pass index to getTagProps
                      color="primary" // Customize chip color
                      size="small" // Customize chip size
                    />
                  ))
                }
                freeSolo
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="UserName" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="email" label="Email" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="FullName" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              {/* <MDInput type="text" label="NRC" variant="standard" fullWidth /> */}

              <Grid container spacing={2} alignItems="center">
                {/* Region Input */}
                <Grid item xs={12} sm={4}>
                  <MDInput
                    type="text"
                    label="Region"
                    variant="standard"
                    fullWidth
                    // value={region}
                    // onChange={(e) => setRegion(e.target.value)}
                    // onBlur={handleBlur}
                    placeholder="12"
                  />
                </Grid>

                {/* Township Input */}
                <Grid item xs={12} sm={4}>
                  <MDInput
                    type="text"
                    label="Township"
                    variant="standard"
                    fullWidth
                    // value={township}
                    // onChange={(e) => setTownship(e.target.value)}
                    // onBlur={handleBlur}
                    placeholder="KAMAYA"
                  />
                </Grid>

                {/* Unique Identifier Input */}
                <Grid item xs={12} sm={4}>
                  <MDInput
                    type="text"
                    label="Unique Identifier"
                    variant="standard"
                    fullWidth
                    // value={uniqueId}
                    // onChange={(e) => setUniqueId(e.target.value)}
                    // onBlur={handleBlur}
                    placeholder="239833"
                  />
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mb={2}>
              {/* <MDInput type="date" label="Date Of Birth" variant="standard" fullWidth /> */}

              <MDInput
                type="date"
                label="Date Of Birth"
                variant="standard"
                fullWidth
                value={date}
                sx={{
                  "&::-webkit-datetime-edit": {
                    visibility: "hidden", // Hide the default placeholder
                  },
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Company" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="PhoneNumber" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="text" label="Address" variant="standard" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <Autocomplete
                options={Gender}
                renderInput={(params) => (
                  <TextField {...params} label="Gender" variant="standard" fullWidth />
                )}
                freeSolo
              />
            </MDBox>

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
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
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth>
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

import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Images
import masterCardLogo from "assets/images/logos/mastercard.png";
import visaLogo from "assets/images/logos/visa.png";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

function PaymentMethod(fromAccountInfo) {
  console.log("FromAccount Info___________", fromAccountInfo);
  console.log("FromAccount Info___________", fromAccountInfo.fromAccountInfo);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <Card id="delete-account">
      <MDBox pt={2} px={2} display="flex" justifyContent="space-between" alignItems="center">
        <MDTypography variant="h6" fontWeight="medium">
          Number Of Accounts
        </MDTypography>
      </MDBox>

      {fromAccountInfo &&
        fromAccountInfo.fromAccountInfo.map((el, idx) => (
          <MDBox p={2} key={idx}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDBox
                  borderRadius="lg"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    border: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  }}
                >
                  <MDTypography variant="caption" fontWeight="medium">
                    {el?.ProductName}
                  </MDTypography>

                  <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                    <MDTypography variant="h6" fontWeight="medium">
                      {el?.FromAccountNo}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox
                  borderRadius="lg"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    border: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  }}
                >
                  <MDTypography variant="caption" fontWeight="medium">
                    Account Balance :
                  </MDTypography>
                  <MDBox ml="auto" lineHeight={0} color={darkMode ? "white" : "dark"}>
                    <MDTypography variant="h6" fontWeight="medium">
                      {el?.Balance.toString()
                        .replace(/\D/g, "")
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
        ))}
    </Card>
  );
}

export default PaymentMethod;

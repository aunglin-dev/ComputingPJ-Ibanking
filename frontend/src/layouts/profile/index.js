import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import { useSelector } from "react-redux";

function Overview() {
  const { currentAdmin } = useSelector((state) => state.admin);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} lg={2} />
      <Header lg={4}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Divider orientation="vertical" lg={8} sx={{ ml: -2, mr: 1 }} />
            <ProfileInfoCard
              lg={12}
              title="profile information"
              description="SMED Bank's Bank Staff"
              info={{
                fullName: currentAdmin?.FullName,
                mobile: currentAdmin?.PhoneNumber,
                email: currentAdmin?.Email,
              }}
              social={[
                {
                  link: "https://www.facebook.com/CreativeTim/",
                  icon: <FacebookIcon />,
                  color: "facebook",
                },
                {
                  link: "https://twitter.com/creativetim",
                  icon: <TwitterIcon />,
                  color: "twitter",
                },
                {
                  link: "https://www.instagram.com/creativetimofficial/",
                  icon: <InstagramIcon />,
                  color: "instagram",
                },
              ]}
              action={{}}
              shadow={false}
            />
            <Divider orientation="vertical" sx={{ mx: 0 }} />
          </Grid>
        </MDBox>
        <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Bank History
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Bank History Small and Medium Enterprise Development Bank Aiming to provide as much
              capital as possible for the development of small and medium enterprises State Law and
              Order Restoration Council; Under the guidance of Chairman Senior General Than Shwe,
              Chairman of the Central Committee for Industrial Development of Myanmar Lt-General
              Myint Aung; Under the supervision of General Kyaw Than, Chairman of the Myanmar
              Industrial Development Working Committee were in accordance with the Law on the
              Financial Institutions of Myanmar enacted in 1990, the State Law and Order Restoration
              Council, Secretary (2) Lt-General Tin Oo, shareholders; With members of the Board of
              Directors 1996 On 15 February, the Myanmar Industrial Development Bank (MIDB) opened
              its headquarters. After that, under the guidance of the Board of Directors of the
              Bank, with the aim of further developing the small and medium industry sector. On 22
              September, the SME Development Bank (SMID Bank) was renamed. 2019 On 21 August, it was
              renamed the Small and Medium Enterprise Development Bank (SMED Bank).
            </MDTypography>
          </MDBox>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default Overview;

import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import CustomerSignIn from "layouts/authentication/Customer_Sign_In";
import SignUp from "layouts/authentication/sign-up";
import FirstLogin from "layouts/authentication/FirstLogin";
import OwnTransfer from "layouts/Transfers/NormalTransfer/OwnTransfer";
import ValidateTransfer from "layouts/Transfers/NormalTransfer/ValidateTransfer";
import ConfirmTransfer from "layouts/Transfers/NormalTransfer/ConfirmTransfer";

// @mui icons
import Icon from "@mui/material/Icon";
import { IMPORT } from "stylis";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Billing />,
  },

  //   {
  //     type: "collapse",
  //     name: "RTL",
  //     key: "rtl",
  //     icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //     route: "/rtl",
  //     component: <RTL />,
  //   },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },

  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  {
    type: "collapse",
    name: "Transfer",
    key: "Transfer",
    icon: <Icon fontSize="small">Transfer</Icon>,
    route: "/transfer/owntransfer",
    component: <OwnTransfer />,
  },
  {
    type: "divider",
    name: "TransferValidate",
    key: "TransferValidate",
    icon: <Icon fontSize="small">Transfer</Icon>,
    route: "/transfer/validateTransfer",
    component: <ValidateTransfer />,
  },
  {
    type: "title",
    name: "TransferConfirm",
    key: "TransferConfirm",
    icon: <Icon fontSize="small">Transfer</Icon>,
    route: "/transfer/confirmTransfer",
    component: <ConfirmTransfer />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/Customer_Sign_In",
    component: <CustomerSignIn />,
  },
  {
    type: "title",
    name: "Sign In (Admin)",
    key: "sign-in(Admin)",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },

  {
    type: "divider",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;

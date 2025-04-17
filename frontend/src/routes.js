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
import TransactionLimit from "layouts/TransactionLimit/TransactionLimit";
import EditTransactionLimit from "layouts/TransactionLimit/EditTransactionLimit";
import CreateSchemeCode from "layouts/SchemeCodeSetUp/CreateSchemeCode";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Customer Lists",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
  },

  //Start Transaction Limit
  {
    type: "collapse",
    name: "TransactionLimit",
    key: "TransactionLimit",
    icon: <Icon fontSize="small">Transaction Limit</Icon>,
    route: "/transactionLimit/Create",
    component: <TransactionLimit />,
  },
  {
    type: "collapse",
    name: "CreateSchemeCode",
    key: "CreateSchemeCode",
    icon: <Icon fontSize="small">Create SchemeCode</Icon>,
    route: "/schemeCode/Create",
    component: <CreateSchemeCode />,
  },
  {
    type: "title",
    name: "EditTransactionLimit",
    key: "EditTransactionLimit",
    icon: <Icon fontSize="small">Transaction Limit</Icon>,
    route: "/transactionLimit/Edit",
    component: <EditTransactionLimit />,
  },

  //End Transaction
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
    name: "Sign In",
    key: "Cus_sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/Customer_Sign_In",
    component: <CustomerSignIn />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "Auth_sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/first-login",
    component: <FirstLogin />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
];

export default routes;

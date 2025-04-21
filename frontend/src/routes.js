import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import ReceiptIcon from "@mui/icons-material/Receipt";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import CustomerSignIn from "layouts/authentication/Customer_Sign_In";
import SignUp from "layouts/authentication/sign-up";
import FirstLogin from "layouts/authentication/FirstLogin";
import TransactionLimit from "layouts/TransactionLimit/TransactionLimit";
import EditTransactionLimit from "layouts/TransactionLimit/EditTransactionLimit";
import CreateSchemeCode from "layouts/SchemeCodeSetUp/CreateSchemeCode";
import SchemeCodeSetup from "layouts/SchemeCodeSetUp/SchemeCode";
import EditSchemeCode from "layouts/SchemeCodeSetUp/EditSchemeCode";
import Particular from "layouts/Particular/ParticularList";
import EditParticular from "layouts/Particular/EditParticular";
import EditCustomerSchemeCode from "layouts/tables/EditCustomerSchemeCode";
import TranHistory from "layouts/TransactionHistory/TranHistoryList";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard/",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Customer Lists",
    key: "customerlist",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/CustomerList/Index",
    component: <Tables />,
  },
  //Start Transaction Limit
  {
    type: "collapse",
    name: "TransactionLimit",
    key: "transactionlimit",
    icon: <Icon fontSize="small">credit_card_off</Icon>,
    route: "/transactionLimit/Create",
    component: <TransactionLimit />,
  },

  //Start SchemeCode
  {
    type: "collapse",
    name: "SchemeCodeSetup",
    key: "schemecode",
    icon: <Icon fontSize="small">code</Icon>,
    route: "/schemeCode/Index",
    component: <SchemeCodeSetup />,
  },
  //Start Particular

  {
    type: "collapse",
    name: "ParticularList",
    key: "particularlist",
    icon: <Icon fontSize="small">attach_money</Icon>,
    route: "/particularlist/Index",
    component: <Particular />,
  },

  {
    type: "collapse",
    name: "Transaction History",
    key: "tranhistory",
    icon: <Icon fontSize="small">attach_money</Icon>,
    route: "/tranhistory/Index",
    component: <TranHistory />,
  },
  //End Transaction
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile/",
    component: <Profile />,
  },
  {
    type: "title",
    name: "EditCustomerSchemeCode ",
    key: "CustomerList/Edit",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/CustomerList/Edit",
    component: <EditCustomerSchemeCode />,
  },

  {
    type: "title",
    name: "CreateSchemeCode",
    key: "CreateSchemeCode",
    icon: <Icon fontSize="small">Create SchemeCode</Icon>,
    route: "/schemeCode/Create",
    component: <CreateSchemeCode />,
  },
  {
    type: "title",
    name: "EditSchemeCode",
    key: "EditSchemeCode",
    icon: <Icon fontSize="small">Edit SchemeCode</Icon>,
    route: "/schemeCode/Edit",
    component: <EditSchemeCode />,
  },
  {
    type: "title",
    name: "EditTransactionLimit",
    key: "EditTransactionLimit",
    icon: <Icon fontSize="small">Transaction Limit</Icon>,
    route: "/transactionLimit/Edit",
    component: <EditTransactionLimit />,
  },
  {
    type: "divider",
    name: "Sign In",
    key: "Auth_sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "SignOut",
    key: "LogOut",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/Customer_Sign_In",
    component: <CustomerSignIn />,
  },

  {
    type: "title",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/first-login",
    component: <FirstLogin />,
  },
  {
    type: "title",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "title",
    name: "EditParticular",
    key: "EditParticular",
    icon: <Icon fontSize="small">Particular</Icon>,
    route: "/particularlist/Edit",
    component: <EditParticular />,
  },
];

export default routes;

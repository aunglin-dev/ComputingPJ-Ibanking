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
import OtherTransfer from "layouts/Transfers/NormalTransfer/OtherTransfer";
import ValidateOtherTransfer from "layouts/Transfers/NormalTransfer/ValidateOtherTransfer";
import ConfirmTransferOther from "layouts/Transfers/NormalTransfer/ConfirmTransferOther";
import OtherBankTransfer from "layouts/Transfers/NormalTransfer/OtherBankTransfer";
import ValidateOtherBankTransfer from "layouts/Transfers/NormalTransfer/ValidateOtherBankTransfer";
import ConfirmTransferOtherBank from "layouts/Transfers/NormalTransfer/ConfrimTransferOtherBank";
import ScheduleOtherTransfer from "layouts/Transfers/ScheduleTransfer/OwnBankTranfer/OtherTransfer";
import ScheduleOtherBankTransfer from "layouts/Transfers/ScheduleTransfer/OtherBankTransfer/OtherBankTransfer";
import ScheduleValidateOtherTransfer from "layouts/Transfers/ScheduleTransfer/OwnBankTranfer/ValidateOtherTransfer";
import ScheduleConfirmTransferOther from "layouts/Transfers/ScheduleTransfer/OwnBankTranfer/ConfirmTransferOther";
import ScheduleValidateOtherBankTransfer from "layouts/Transfers/ScheduleTransfer/OtherBankTransfer/ValidateOtherBankTransfer";
import ScheduleConfirmTransferOtherBank from "layouts/Transfers/ScheduleTransfer/OtherBankTransfer/ConfrimTransferOtherBank";
import RemittanceTransfer from "layouts/Transfers/RemittanceTransfer/RemittanceTransfer";
import ValidateRemittanceTransfer from "layouts/Transfers/RemittanceTransfer/ValidateRemittanceTransfer";
import ConfirmRemittanceTransfer from "layouts/Transfers/RemittanceTransfer/ConfrimRemittanceTransfer";
import OwnBankBeneficiary from "layouts/Beneficiary/OwnBank/ownBankBeneficiary";

// @mui icons
import Icon from "@mui/material/Icon";
import { IMPORT } from "stylis";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard/",
    component: <Billing />,
  },

  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },

  // <> Start Beneficiary Transfer</>
  {
    type: "collapse",
    name: "Manage Beneficiary",
    key: "beneficiary",
    icon: <Icon fontSize="small">groups</Icon>,
    route: "/beneficiary/manageOwnBankBeneficiary",
    component: <OwnBankBeneficiary />,
  },
  // <> End Beneficiary Transfer</>

  // <> Start Remittance Transfer</>

  {
    type: "collapse",
    name: "Remittance Transfer",
    key: "remittance",
    icon: <Icon fontSize="small">send_money</Icon>,
    route: "/remittance/remittancetransfer",
    component: <RemittanceTransfer />,
  },

  {
    type: "divider",
    name: "RemittanceTransferValidate",
    key: "RemittanceTransferValidate",
    icon: <Icon fontSize="small">send_money</Icon>,
    route: "/remittance/remittancetransferValidate",
    component: <ValidateRemittanceTransfer />,
  },

  {
    type: "title",
    name: "RemittanceTransferConfirm",
    key: "RemittanceTransferConfirm",
    icon: <Icon fontSize="small">send_money</Icon>,
    route: "/remittance/remittancetransferConfirm",
    component: <ConfirmRemittanceTransfer />,
  },
  // <> End Remittance Transfer</>

  // <> Start Normal Transfer</>
  {
    type: "collapse",
    name: "Own Transfer",
    key: "transfer",
    icon: <Icon fontSize="small">sync_alt</Icon>,
    route: "/transfer/owntransfer",
    component: <OwnTransfer />,
  },
  {
    type: "collapse",
    name: "Other Transfer",
    key: "transferother",
    icon: <Icon fontSize="small">sync_alt</Icon>,
    route: "/transferother/othertransfer",
    component: <OtherTransfer />,
  },
  {
    type: "collapse",
    name: "Other Bank Transfer",
    key: "transferotherbank",
    icon: <Icon fontSize="small">sync_alt</Icon>,
    route: "/transferotherbank/otherbanktransfer",
    component: <OtherBankTransfer />,
  },

  {
    type: "divider",
    name: "TransferValidate",
    key: "TransferValidate",
    icon: <Icon fontSize="small">Transfer</Icon>,
    route: "/transfer/validateTransfer",
    component: <ValidateTransfer />,
  },

  // <> End Normal Transfer</>

  // <> Start Schedule Transfer</>
  {
    type: "collapse",
    name: "ScheduleOtherTransfer",
    key: "scheduletransfer",
    icon: <Icon fontSize="small">calendar_month</Icon>,
    route: "/scheduletransfer/scheduleothertransfer",
    component: <ScheduleOtherTransfer />,
  },
  {
    type: "collapse",
    name: "ScheduleOtherBankTransfer",
    key: "scheduletransferother",
    icon: <Icon fontSize="small">calendar_month</Icon>,
    route: "/scheduletransferother/scheduleotherbanktransfer",
    component: <ScheduleOtherBankTransfer />,
  },

  // <> End Schedule Transfer</>
  {
    type: "divider",
    name: "ScheduleTransferValidate",
    key: "Schedule",
    icon: <Icon fontSize="small">calendar_month</Icon>,
    route: "/scheduletransfer/validateScheduleTransfer",
    component: <ScheduleValidateOtherTransfer />,
  },
  {
    type: "title",
    name: "ScheduleTransferConfirm",
    key: "ScheduleTransferConfirm",
    icon: <Icon fontSize="small">calendar_month</Icon>,
    route: "/scheduletransfer/confirmScheduleOtherTransfer",
    component: <ScheduleConfirmTransferOther />,
  },
  {
    type: "title",
    name: "ScheduleOtherBankTransferValidate",
    key: "ScheduleOtherBankTransferValidate",
    icon: <Icon fontSize="small">calendar_month</Icon>,
    route: "/scheduletransferother/ScheduleOtherBankTransferValidate",
    component: <ScheduleValidateOtherBankTransfer />,
  },

  {
    type: "title",
    name: "ScheduleOtherBankTransferConfirm",
    key: "ScheduleOtherBankTransferConfirm",
    icon: <Icon fontSize="small">calendar_month</Icon>,
    route: "/scheduletransferother/scheduleOtherBankTransferConfirm",
    component: <ScheduleConfirmTransferOtherBank />,
  },
  {
    type: "title",
    name: "TransferOtherValidate",
    key: "TransferOtherValidate",
    icon: <Icon fontSize="small">Transfer</Icon>,
    route: "/transferother/validateotherTransfer",
    component: <ValidateOtherTransfer />,
  },

  {
    type: "title",
    name: "TransferOtherBankValidate",
    key: "TransferOtherBankValidate",
    icon: <Icon fontSize="small">Transfer</Icon>,
    route: "/transferotherbank/validateotherBankTransfer",
    component: <ValidateOtherBankTransfer />,
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
    type: "title",
    name: "TransferOtherConfirm",
    key: "TransferOtherConfirm",
    icon: <Icon fontSize="small">Transfer</Icon>,
    route: "/transferother/confirmTransferother",
    component: <ConfirmTransferOther />,
  },

  {
    type: "title",
    name: "TransferOtherBankConfirm",
    key: "TransferOtherBankConfirm",
    icon: <Icon fontSize="small">Transfer</Icon>,
    route: "/transferotherbank/confirmotherBankTransfer",
    component: <ConfirmTransferOtherBank />,
  },

  // Profile
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
    name: "Sign Out",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/Customer_Sign_In",
    component: <CustomerSignIn />,
  },
  {
    type: "divider",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
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
    type: "title",
    name: "Sign In",
    key: "sign-in-Fist-Time",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/first-login",
    component: <FirstLogin />,
  },
];

export default routes;

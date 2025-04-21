import cron from "node-cron";
import { db, sequelize } from "../config.js";
import { tranType } from "../Utils/TranType.js";
import { TRANSACTION_STATUS } from "../Utils/TransactionStatus.js";
import emailtransporter from "./emailservice.js";
import {
  scheduledTransferEmail,
  scheduledTransferEmailForOtherBank,
} from "../Utils/emailtemplate.js";

const ERROR_MESSAGES = {
  ACCOUNT_NOT_FOUND: "One or both accounts not found",
  INSUFFICIENT_BALANCE: "Insufficient balance",
  TRANSFER_FAILED: "Transfer failed",
  Email_Fail: "Email Failed",
};

const SendEmail = async (scheduleItem, userInfoForEmail) => {
  if (!emailtransporter) {
    throw new Error("Email transporter not initialized");
  }
  let scheduleEmailTemplate;

  if (scheduleItem.TranType === tranType.ScheduleTransferOther) {
    scheduleEmailTemplate = scheduledTransferEmail(
      scheduleItem,
      userInfoForEmail
    );
  } else {
    scheduleEmailTemplate = scheduledTransferEmailForOtherBank(scheduleItem);
  }

  // Email options
  const mailOptions = {
    from: "linoscar724@gmail.com",
    to: "aunglin2252003@gmail.com",
    subject: scheduleEmailTemplate.subject,
    text: scheduleEmailTemplate.text,
    html: scheduleEmailTemplate.html,
  };
  try {
    await emailtransporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error(ERROR_MESSAGES.Email_Fail);
  }
};

const performAccountTransfer = async (scheduleItem, transaction) => {
  const [fromAccount, toAccount] = await Promise.all([
    db.CustomerAccount.findOne({
      where: { AccountNo: scheduleItem.FromAccount },
      transaction,
      // lock: transaction.LOCK.UPDATE,
    }),
    db.CustomerAccount.findOne({
      where: { AccountNo: scheduleItem.ToAccount },
      transaction,
      // lock: transaction.LOCK.UPDATE,
    }),
  ]);

  if (!fromAccount || !toAccount) {
    throw new Error(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  const transferAmount = Number(scheduleItem.TransactionAmount);
  const fromBalance = Number(fromAccount.Balance);

  if (fromBalance < transferAmount) {
    throw new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
  }

  // Update balances atomically
  await Promise.all([
    db.CustomerAccount.update(
      { Balance: sequelize.literal(`Balance - ${transferAmount}`) },
      { where: { AccountNo: scheduleItem.FromAccount }, transaction }
    ),
    db.CustomerAccount.update(
      { Balance: sequelize.literal(`Balance + ${transferAmount}`) },
      { where: { AccountNo: scheduleItem.ToAccount }, transaction }
    ),
  ]);

  // Update transfer log status
  await db.TransferLog.update(
    { Status: TRANSACTION_STATUS.SUCCESS },
    { where: { Id: scheduleItem.Id }, transaction }
  );

  const userInfoForEmail = await db.User.findOne({
    where: { UserId: toAccount.UserId },
  });

  return userInfoForEmail;
};

const performOtherBankTransfer = async (scheduleItem, transaction) => {
  const [fromAccount] = await Promise.all([
    db.CustomerAccount.findOne({
      where: { AccountNo: scheduleItem.FromAccount },
      transaction,
      // lock: transaction.LOCK.UPDATE,
    }),
  ]);

  if (!fromAccount) {
    throw new Error(ERROR_MESSAGES.ACCOUNT_NOT_FOUND);
  }

  const transferAmount = Number(scheduleItem.TransactionAmount);
  const fromBalance = Number(fromAccount.Balance);

  if (fromBalance < transferAmount) {
    throw new Error(ERROR_MESSAGES.INSUFFICIENT_BALANCE);
  }

  // Update balances atomically
  await Promise.all([
    db.CustomerAccount.update(
      { Balance: sequelize.literal(`Balance - ${transferAmount}`) },
      { where: { AccountNo: scheduleItem.FromAccount }, transaction }
    ),
  ]);

  // Update transfer log status
  await db.TransferLog.update(
    { Status: TRANSACTION_STATUS.SUCCESS },
    { where: { Id: scheduleItem.Id }, transaction }
  );
};

const processScheduledTransfers = async (schedules, transaction) => {
  if (!schedules || schedules.length === 0) return;

  const successfulTransfers = [];

  for (const scheduleItem of schedules) {
    try {
      if (scheduleItem.TranType == tranType.ScheduleTransferOther) {
        const emailUser = await performAccountTransfer(
          scheduleItem,
          transaction
        );
        successfulTransfers.push({ scheduleItem, userInfoForEmail: emailUser });
      } else {
        const emailUserOtherBank = await performOtherBankTransfer(
          scheduleItem,
          transaction
        );
        successfulTransfers.push({
          scheduleItem,
          userInfoForEmail: emailUserOtherBank,
        });
      }
    } catch (error) {
      console.error(
        `Transfer failed for ID ${scheduleItem.Id}: =>>>>>   to Account ${scheduleItem.ToAccount}`,
        error.message
      );

      await db.TransferLog.update(
        {
          Status: TRANSACTION_STATUS.FAILED,
        },
        { where: { Id: scheduleItem.Id }, transaction }
      );
    }
  }

  return successfulTransfers;
};

//Fetch all Schedule transfers
const fetchScheduledTransfers = async () => {
  const transaction = await sequelize.transaction();
  try {
    const [ownBankTransfers, otherBankTransfers] = await Promise.all([
      db.TransferLog.findAll({
        where: {
          TranType: tranType.ScheduleTransferOther,
          Status: TRANSACTION_STATUS.PENDING,
        },
        transaction,
      }),
      db.TransferLog.findAll({
        where: {
          TranType: tranType.ScheduleTransferOtherBank,
          Status: TRANSACTION_STATUS.PENDING,
        },
        transaction,
      }),
    ]);

    await transaction.commit();
    return [...ownBankTransfers, ...otherBankTransfers];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

//Main Cron Function
const executeTransferJob = async () => {
  const transaction = await sequelize.transaction();
  let successfulTransfers = [];
  try {
    console.log("Starting scheduled transfer processing...");
    const scheduledTransfers = await fetchScheduledTransfers();

    if (scheduledTransfers.length === 0) {
      console.log("No scheduled transfers found for processing");
      return;
    }

    console.log(`Processing ${scheduledTransfers.length} transfers`);
    successfulTransfers = await processScheduledTransfers(
      scheduledTransfers,
      transaction
    );
    await transaction.commit();
    console.log("Successfully processed scheduled transfers");
  } catch (error) {
    await transaction.rollback();
    console.error("Error processing transfers:", error.message);
    throw error;
  }

  //Send Email
  for (const { scheduleItem, userInfoForEmail } of successfulTransfers) {
    try {
      await SendEmail(scheduleItem, userInfoForEmail);
    } catch (emailErr) {
      console.error(
        `Failed to send email for transfer ID ${scheduleItem.Id}:`,
        emailErr.message
      );
    }
  }
};

const initializeCronJob = () => {
  const cronJob = cron.schedule("30 2 * * * *", executeTransferJob, {
    scheduled: true,
    timezone: "Asia/Yangon",
    runOnInit: false,
  });

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log("Shutting down cron job gracefully...");
    cronJob.stop();
    await sequelize.close();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  return cronJob;
};

// Initialize the cron job
const cronJob = initializeCronJob();

export default cronJob;

const scheduledTransferEmail = (scheduleitem, userinfo) => {
  return {
    subject: `Scheduled Transfer Confirmation - ${scheduleitem.TransactionId}`,
    text: `Dear ${scheduleitem.ToAccountName},

Your transfer has been successfully scheduled transfer with the following details:

Transfer Reference: ${scheduleitem.TransactionId}
From Account: ${scheduleitem.FromAccount}
To Account: ${scheduleitem.ToAccount}
Amount: ${scheduleitem.currency} ${scheduleitem.TransactionAmount}
Scheduled Date: ${scheduleitem.TransactionDate}


You can view and manage your scheduled transfers by logging into your online banking account.

Thank you for banking with us.

Best regards,
SMEDB Team`,
    html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Dear ${userinfo.FullName},</p>
                
                <p>Your transfer has been successfully transferred with the following details:</p>
                
                <table style="border-collapse: collapse; width: 100%; max-width: 500px; margin: 15px 0;">
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Transfer Reference:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${scheduleitem.TransactionId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">From Account:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${scheduleitem.FromAccount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">To Account:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${scheduleitem.ToAccount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Amount:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${scheduleitem.currency} ${scheduleitem.TransactionAmount}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Scheduled Date:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${scheduleitem.TransactionDate}</td>
                    </tr>
                   
                </table>
                
                <p>This transfer will be processed automatically on the scheduled date. No further action is required from you.</p>
                

                
                <p>
                    You can view and manage your scheduled transfers by 
                                logging into your online banking account</a>.
                </p>
                
                <p>Thank you for banking with us.</p>
                
                <p>Best regards,<br>
                <strong>SMEDB Bank Team</strong></p>
            </div>
        `,
  };
};

export default scheduledTransferEmail;

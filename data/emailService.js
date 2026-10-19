import nodemailer from 'nodemailer';

// Khởi tạo cấu hình Email
function getTransporter() {
  const user = process.env.GMAIL_USER ? String(process.env.GMAIL_USER).trim() : 'taileminh2202@gmail.com';
  const pass = process.env.GMAIL_APP_PASSWORD ? String(process.env.GMAIL_APP_PASSWORD).trim().replace(/\s+/g, '') : 'wfrndfsehozkuweb';

  if (user && pass) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 6000
    });
  }
  return null;
}

/**
 * Gửi email chứa mã OTP khôi phục mật khẩu thật đến học viên
 */
export async function sendOtpEmail(toEmail, otpCode, recipientName = 'Học viên') {
  const transporter = getTransporter();
  const fromName = process.env.EMAIL_FROM_NAME || 'Running Man Sales Academy';
  const fromEmail = process.env.GMAIL_USER || 'no-reply@runningman.vn';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <title>Mã OTP Khôi Phục Mật Khẩu - RMSA</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
        .header { background: #0a0f1d; padding: 30px 24px; text-align: center; border-bottom: 2px solid #2563eb; }
        .header h1 { color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 1.5px; font-weight: 900; }
        .header p { color: #38bdf8; margin: 4px 0 0; font-size: 11px; font-weight: 800; letter-spacing: 2px; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
        .instruction { font-size: 13.5px; color: #475569; margin-bottom: 20px; }
        .otp-box { background: #f8fafc; border: 1.5px dashed #2563eb; border-radius: 16px; padding: 20px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1d4ed8; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
        .otp-expiry { font-size: 12px; color: #64748b; margin-top: 8px; }
        .security-warning { background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 10px; font-size: 12px; color: #92400e; margin-top: 24px; }
        .footer { padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; background: #fafafa; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>RUNNING MAN</h1>
          <p>SALES ACADEMY • ĐAN RIN</p>
        </div>
        <div class="content">
          <div class="greeting">Xin chào ${recipientName},</div>
          <div class="instruction">
            Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản RMSA của bạn. Vui lòng nhập mã xác thực OTP dưới đây để hoàn tất việc đổi mật khẩu mới:
          </div>
          
          <div class="otp-box">
            <div class="otp-code">${otpCode}</div>
            <div class="otp-expiry">Mã xác thực có hiệu lực trong vòng <strong>10 phút</strong></div>
          </div>

          <div class="security-warning">
            ⚠️ <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã OTP này cho bất kỳ ai, kể cả nhân viên RMSA. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
          </div>
        </div>
        <div class="footer">
          © 2026 Running Man Sales Academy (RMSA). Khóa đào tạo thực chiến Đan Rin.<br>
          Cổng đào tạo môi giới căn hộ cho thuê hàng đầu.
        </div>
      </div>
    </body>
    </html>
  `;

  // ƯU TIÊN 1: Gửi qua Gmail SMTP (Port 465 SSL - Gửi được cho BẤT KỲ EMAIL NÀO TRÊN THẾ GIỚI)
  if (transporter) {
    try {
      console.log(`[EmailService] Đang gửi mã OTP qua Gmail SMTP SSL đến: ${toEmail}...`);
      const sendPromise = transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: toEmail,
        subject: `[RMSA] Mã OTP xác thực khôi phục mật khẩu của bạn: ${otpCode}`,
        html: htmlContent
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SMTP_TIMEOUT: Gmail connection timed out')), 4500)
      );

      const info = await Promise.race([sendPromise, timeoutPromise]);
      console.log(`[EmailService] ✅ ĐÃ GỬI EMAIL THẬT THÀNH CÔNG QUA GMAIL SMTP! (Message ID: ${info.messageId})`);
      return { success: true, mode: 'real_gmail', messageId: info.messageId, otp: otpCode };
    } catch (err) {
      console.warn(`[EmailService] Gmail SMTP (${err.message}). Chuyển sang Resend API fallback...`);
    }
  }

  // ƯU TIÊN 2: Gửi qua Resend REST API
  const resendApiKey = process.env.RESEND_API_KEY ? String(process.env.RESEND_API_KEY).trim() : '';
  if (resendApiKey) {
    try {
      console.log(`[EmailService] Đang thử gửi mã OTP qua Resend API đến: ${toEmail}...`);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Running Man Sales Academy <onboarding@resend.dev>',
          to: [toEmail],
          subject: `[RMSA] Mã OTP xác thực khôi phục mật khẩu của bạn: ${otpCode}`,
          html: htmlContent
        })
      });

      const resData = await response.json();
      if (response.ok && resData.id) {
        console.log(`[EmailService] ✅ ĐÃ GỬI EMAIL THẬT THÀNH CÔNG QUA RESEND! (Email ID: ${resData.id})`);
        return { success: true, mode: 'real_resend', messageId: resData.id, otp: otpCode };
      } else {
        console.warn(`[EmailService] Resend API phản hồi:`, resData?.message || resData);
      }
    } catch (resendErr) {
      console.warn(`[EmailService] Lỗi kết nối Resend API:`, resendErr.message);
    }
  }

  console.log(`\n======================================================`);
  console.log(`[CHẾ ĐỘ MÃ XÁC THỰC DỰ PHÒNG]`);
  console.log(`Gửi tới: ${toEmail}`);
  console.log(`MÃ XÁC THỰC OTP THẬT: >>> ${otpCode} <<< (Có hiệu lực 10 phút)`);
  console.log(`======================================================\n`);
  return { success: true, mode: 'demo_console', otp: otpCode };
}

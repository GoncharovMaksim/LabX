import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, comment } = body;

    // Validate inputs
    if (!name || !email || !phone || !comment) {
      return NextResponse.json(
        { error: "Все поля формы обязательны для заполнения (Имя, Телефон, Email, Комментарий)." },
        { status: 400 }
      );
    }

    // Email templates
    const emailToOwnerHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4f46e5; margin-bottom: 20px;">Новая заявка с сайта-портфолио</h2>
        <p style="font-size: 16px; line-height: 1.5; color: #374151;"><strong>Имя клиента:</strong> ${name}</p>
        <p style="font-size: 16px; line-height: 1.5; color: #374151;"><strong>Телефон:</strong> ${phone}</p>
        <p style="font-size: 16px; line-height: 1.5; color: #374151;"><strong>Email:</strong> ${email}</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 6px;">
          <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #1f2937; white-space: pre-wrap;"><strong>Комментарий:</strong><br/>${comment}</p>
        </div>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">Сообщение отправлено автоматически с формы обратной связи.</p>
      </div>
    `;

    const emailToUserHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #fafafa;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4f46e5; margin: 0;">Здравствуйте, ${name}!</h2>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Спасибо за ваше обращение.</p>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #f3f4f6;">
          <p style="font-size: 15px; line-height: 1.6; color: #374151; margin-top: 0;">
            Я получил ваше сообщение и свяжусь с вами в ближайшее время (обычно в течение пары часов).
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #374151;">
            Ниже копия вашего запроса для информации:
          </p>
          <div style="padding: 12px 15px; background-color: #f9fafb; border-left: 4px solid #4f46e5; border-radius: 4px; font-style: italic; color: #4b5563; margin: 15px 0; white-space: pre-wrap;">
            "${comment}"
          </div>
          <p style="font-size: 15px; line-height: 1.6; color: #374151; margin-bottom: 0;">
            <strong>Мои контакты для быстрой связи:</strong><br/>
            Telegram: <a href="https://t.me/WebDev112" style="color: #4f46e5; text-decoration: none;">@WebDev112</a><br/>
            Email: <a href="mailto:maksimgoncharov112@gmail.com" style="color: #4f46e5; text-decoration: none;">maksimgoncharov112@gmail.com</a><br/>
            Телефон: +7 (996) 500-02-00
          </p>
        </div>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #e5e7eb;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">Гончаров Максим • Fullstack Developer • React / Next.js / Node.js</p>
      </div>
    `;

    // Check if SMTP is configured
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

    const isSmtpConfigured = !!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);

    if (isSmtpConfigured) {
      // SMTP transport configuration
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      // Send to owner
      await transporter.sendMail({
        from: SMTP_FROM || `"Portfolio Contact" <${SMTP_USER}>`,
        to: "maksimgoncharov112@gmail.com",
        subject: `[Portfolio] Сообщение от ${name}`,
        html: emailToOwnerHtml,
      });

      // Send copy to sender
      await transporter.sendMail({
        from: SMTP_FROM || `"Гончаров Максим" <${SMTP_USER}>`,
        to: email,
        subject: "Копия вашего обращения к Гончарову Максиму",
        html: emailToUserHtml,
      });

      console.log(`[Email API] Emails sent successfully to maksimgoncharov112@gmail.com and ${email} via SMTP.`);

      return NextResponse.json({
        success: true,
        message: "Сообщение успешно отправлено через SMTP сервер!",
        simulated: false,
      });
    } else {
      // Simulation mode
      console.log("====================================================");
      console.log("[SIMULATION MODE] SMTP environment variables are missing.");
      console.log("[EMAIL TO OWNER (maksimgoncharov112@gmail.com)]:");
      console.log(`From: ${email}`);
      console.log(`Subject: [Portfolio] Сообщение от ${name}`);
      console.log(`Phone: ${phone}`);
      console.log(`Comment: ${comment}`);
      console.log("----------------------------------------------------");
      console.log(`[EMAIL COPY TO USER (${email})]:`);
      console.log(`Subject: Копия вашего обращения к Гончарову Максиму`);
      console.log(`Greeting: Здравствуйте, ${name}!`);
      console.log(`Comment Copy: "${comment}"`);
      console.log("====================================================");

      return NextResponse.json({
        success: true,
        message: "Сообщение отправлено в режиме симуляции (отладочный режим)!",
        simulated: true,
        debugData: {
          ownerEmail: {
            to: "maksimgoncharov112@gmail.com",
            subject: `[Portfolio] Сообщение от ${name}`,
            html: emailToOwnerHtml,
          },
          userEmail: {
            to: email,
            subject: "Копия вашего обращения к Гончарову Максиму",
            html: emailToUserHtml,
          },
        },
      });
    }
  } catch (error: any) {
    console.error("[Email API Error]:", error);
    return NextResponse.json(
      { error: `Ошибка при отправке сообщения: ${error.message || error}` },
      { status: 500 }
    );
  }
}

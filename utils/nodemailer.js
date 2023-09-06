const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

module.exports = { oAuth2Client };
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// async function getAccessToken() {
//   const accessToken = await oAuth2Client.getAccessToken();
//   return accessToken;
// }

// const transport = nodemailer.createTransport({
//   service: "gmail",
//   // host: "smtp.gmail.com",
//   // host: "farmapp190@gmail.com",
//   port: 587,
//   requireTLS: false,
//   secure: true,
//   auth: {
//     type: "OAuth2",
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS,
//     clientId: CLIENT_ID,
//     clientSecret: CLIENT_SECRET,
//     refreshToken: REFRESH_TOKEN,
//     accessToken: getAccessToken,
//   },
// });

// const sendVerificationEmail = (name, email, req, emailToken) => {
//   transport.sendMail(
//     {
//       from: `"Farm App " <farmapp190@gmail.com>`,
//       to: email,
//       subject: "Verify Account",
//       html: `<h1>Verify Your Account</h1>
//         <h2>Hi ${name},</h2>
//         <p>${name} Thanks for creating an account with us Today</p>
//         <a href=https://${req.header.host}/user_auth/verify?token=${emailToken}>Click here to verify your account</a>
//         <p>Cheers</p>
//         <p>Your App Service team</p>
//         </div>`,
//     },
//     (info, err) => {
//       if (err) {
//         console.log("err", err);
//       } else {
//         console.log("verification sent to your email" + " " + email, info);
//       }
//     }
//   );
//   // .catch((err) => console.log(err));
// };

// module.exports = { sendVerificationEmail };

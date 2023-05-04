const { response, json } = require("express");
const nodemailer = require("nodemailer");
const userCollection = require("../Model/StudentSchema");
const mentorCollection=require("../Model/Mentor")
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abinmuhammed5@gmail.com",
    pass: "guabbcdcmvqpxnxs",
  },
});

const submitMail = async (req, res) => {
  const Email = req.body.Email;
  console.log(Email);

  try {
    let user = await userCollection.find({ Email: Email });
    console.log(user[0]?.Email);
    if (user[0]?.Email) {
      const token = crypto.randomBytes(5).toString("hex");
      const expires = Date.now() + 120000;
      console.log(token, expires);

      try {
        await userCollection
          .updateOne(
            { Email: Email },
            {
              $set: { Token: { Token: token, Expires: expires } },
            }
          )
          .then((response) => {
            console.log(response);
          });
      } catch (error) {
        console.log(error);
      }
      const mailOptions = {
        from: "your-email@gmail.com",
        to: Email,
        subject: "Password Reset",
        text: `Your One Time PAssword :${token}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res.status(500).json({ msg: "Error sending email" });
        } else {
          console.log(`Email sent: ${info.response}`);
          res.json({ msg: "Password reset email sent" });
        }
      });
      res.json({ msg: "An OTP has been SEND to your mail for Verification " });
    } else {
      res.status(401).json({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const resetPassword = async (req, res) => {
  const { Token, Email } = req.query;

  try {
    const [user] = await userCollection.find({ Email });
    if (user?.Token.Token == Token) {
      if (Date.now() < user?.Token?.Expires) {
        res.json({
          msg: "Proceed to password Reset Page ",
          nextStep: "Proceed",
          Email: user.Email,
        });
      } else {
        res.status(401).json({ msg: "Password Reset Session Timed Out" });
      }
    } else {
      res.json({ msg: "OTP is invalid", invalidOtp: true });
    }
  } catch (error) {
    console.log(error);
    // res.status(500).json({msg:error});
  }
};

const conformPass = async (req, res) => {
  const { Email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    await userCollection
      .updateOne(
        { Email },
        {
          $unset: { Token:1 },
          $set: { Password: hashPassword },
        }
      )
      .then((response) => {
        res.json({ msg: "updated Succesfully" });
      });
  } catch (error) {
    res.json({ msg: "something error", err: error });
  }
};

module.exports = { submitMail, resetPassword, conformPass };

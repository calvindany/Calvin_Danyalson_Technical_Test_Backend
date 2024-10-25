
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const { getDb } = require('../db/');
const { Users } = require("../db/schema");
const constant = require("../constants/global");

const CreateUserService = async ( email, phone_number ) => {
    const db = getDb();

    try {
        const user = await db.select().from(Users).where({ email: email })

        if(user.length >= 1) {
            return `User ${user[0].email} has already exists`;
        }

        const generatePassword = GenerateRandomPassword(8);
        
        const hashedPassword = await bcrypt.hash(generatePassword, constant.HASH_SALT_ROUNDS);

        await db.insert(Users).values({
            full_name: "",
            email: email,
            password: hashedPassword,
            phone_number: phone_number,
            created_by: 0,
        });

        const constructEmailBody = `
            <p>Ini adalah email dan password anda, simpan email anda karena password ini hanya di sediakan 1 kali</p><br>
            <p>Email: ${ email }</p><br>
            <p>Password: ${generatePassword}</p>
        `
        const title = "Akun baru PT Dummy"
        
        await SendEmail(email, title, constructEmailBody)

        return `User ${email} has been created`;
    } catch (err) {
        throw err;
    }
}

const GenerateRandomPassword = ( passwordLength ) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
  
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
  
    return password;
}

const SendEmail = async ( emailTo, title, body ) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS 
        }
    });

    try {
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: emailTo,    
          subject: title,   
          text: body,  
          html: body
        });
    
        console.log('Email berhasil dikirim:', info.messageId);
    } catch (error) {
        console.error('Error mengirim email:', error);
    }
}

module.exports = {
    CreateUserService,
}
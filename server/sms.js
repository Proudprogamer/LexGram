const axios = require("axios");

const sendSMS = async (phone, otp) => {
    const apiKey = "";
    const message = `Your OTP is: ${otp}`;
    
    const response = await axios.post("https://www.fast2sms.com/dev/bulkV2", {
        route: "q",
        message,
        language: "english",
        flash: 0,
        numbers: phone,
    }, {
        headers: { authorization: apiKey,
            'Content-Type' : 'application/json'
         }
    });

    console.log(response.data);
};

sendSMS("7075190904", "123458");

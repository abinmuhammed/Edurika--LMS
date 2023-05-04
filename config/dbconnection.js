const {mongoose, connection } = require("mongoose")

const dbconnect = async()=>{
    try {
        const connect = await mongoose.connect(process.env.DB_CONNECTION_STRING);
        // console.log(connect);
        console.log("connection Successfull at DB",connect.connection.name )

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports= dbconnect
const mongoose = require("mongoose");

const mongoConnect = () => {
  mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  //on successful connection
  mongoose.connection.on("connected", () => {
    console.log("Connected to database!!".green);
  });

  //on error connecting to database
  mongoose.connection.on("error", (err) => {
    console.log(`error connecting to database ${err}`.red);
  });
};

module.exports = {
  mongoConnect: mongoConnect,
};

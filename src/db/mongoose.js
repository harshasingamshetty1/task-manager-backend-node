const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    // useNewUrlParser and useCreateIndex are required to remove the deprecation warnings
    // useFindAndModify is required to remove the deprecation warning for findByIdAndUpdate
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((v) => console.log("MongoDB Connection Success!"))
  .catch((e) => console.log("MongoDB Conxn Failed"));

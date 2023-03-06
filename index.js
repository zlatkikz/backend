require("dotenv").config();

const axios = require("axios");

const express = require("express");

const stats = require("./statsModel");

const vData = require("./videoModel");

const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

// mongoose.connect(mongoString);
// const database = mongoose.connection;

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
const app = express();

app.use(express.json());

app.get("/fetchData", async (req, res) => {
  const all = await vData.find({});

  console.log(all.map((val) => val.videoID).toString());

  // Make a request for a user with a given ID
  axios
    .get(
      "https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=" +
        all.map((val) => val.videoID).toString() +
        "&key=" +
        process.env.API_KEY
    )
    .then(function (response) {
      // handle success
      const setData = response.data.items.map((value, i) => {
        const data = {
          date: new Date().getTime(),
          views: value.statistics.viewCount,
          videoID: value.id,
          videoName: `${value.snippet.channelTitle} - ${value.snippet.title}`,
        };
        // const dataToSave = await data.save();
        return data;
      });
      stats.insertMany(setData, (error) => {
        console.log(error);
      });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });

  try {
    res.status(200).json("done");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/stopFetch", (req, res) => {
  clearInterval(intervalID);
  res.status(200).json("done");
});

app.get("/setVideo", (req, res) => {
  const data = new vData({ date: new Date().getTime(), videoID: req.query.id });
  data.save();
  res.status(200).json(req.query);
});

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});

const express = require("express");
const bodyParser = require("body-parser");
const iconv = require("iconv-lite");
const axios = require("axios");
var Sha1 = require("sha1");

const app = express();
const port = 3000;

// app.use((req, res, next) => {
//   let data = [];
//   req.on("data", (chunk) => {
//     data.push(chunk);
//   });
//   req.on("end", () => {
//     data = Buffer.concat(data);
//     const contentType = req.headers["content-type"] || "";
//     if (contentType.includes("charset=Shift_JIS")) {
//       req.body = iconv.decode(data, "Shift_JIS");
//     } else {
//       console.log("data.toString() :>> ", data.toString());
//       req.body = data.toString();
//     }
//     next();
//   });
// });

app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      console.log(buf, buf.toString());
      // const url = req.originalUrl;
      // if (url.startsWith("/api/stripe/webhook")) {
      //   req.rawBody = buf.toString();
      // }
      return true;
    },
  })
);

// POST endpoint
app.post("/api/data", (req, res) => {
  const data = req.body;
  console.log("req:", data);

  res.status(200).send("OK");
});

function zeroPadding(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num + "";
}

function getYYYYMMDDHHMMSS() {
  var now = new Date(
    new Date().toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    })
  );
  return (
    now.getFullYear() +
    zeroPadding(now.getMonth() + 1) +
    zeroPadding(now.getDate()) +
    zeroPadding(now.getHours()) +
    zeroPadding(now.getMinutes()) +
    zeroPadding(now.getSeconds())
  );
}

app.post("/api/sb-payment", (req, res) => {
  const order = {};
  order.merchant_id = "56943";
  order.service_id = "001";
  order.cust_code = "Merchant_TestUser_1000";
  order.order_id = `b383940ccce_${getYYYYMMDDHHMMSS()}`;
  order.item_id = "T_0003";
  order.amount = "10";
  order.request_date = getYYYYMMDDHHMMSS();
  order.hashkey = "6bf1c1ea758871c3dc9deaaf23fda59f53aca89d";

  let hashString =
    order.merchant_id +
    order.service_id +
    order.cust_code +
    order.order_id +
    order.item_id +
    order.amount +
    order.request_date +
    order.hashkey;

  order.sps_hashcode = Sha1(hashString);
  console.log("hashString :>> ", hashString);
  console.log("sps_hashcode :>> ", order.sps_hashcode);

  const xmlPayload = `
<?xml version="1.0" encoding="Shift_JIS" ?>
<sps-api-request  id="ST01-00131-101">
  <merchant_id>${order.merchant_id}</merchant_id>
  <service_id>${order.service_id}</service_id>
  <cust_code>${order.cust_code}</cust_code>
  <order_id>${order.order_id}</order_id>
  <item_id>${order.item_id}</item_id>
  <amount>${order.amount}</amount>
  <request_date>${order.request_date}</request_date>
  <sps_hashcode>${order.sps_hashcode}</sps_hashcode>
</sps-api-request>`;

  console.log(xmlPayload);

  axios
    .post("https://stbfep.sps-system.com/api/xmlapi.do", xmlPayload, {
      headers: {
        "Content-Type": "application/xml",
      },
      auth: {
        username: "56943001",
        password: "6bf1c1ea758871c3dc9deaaf23fda59f53aca89d",
      },
    })
    .then((response) => {
      console.log("Response:", response.data);
      res.status(200).json({});
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({});
    });
});

app.post("/api/sb-payment-confirm", (req, res) => {
  const order = {};
  order.merchant_id = "56943";
  order.service_id = "001";
  // order.res_sps_transaction_id = "";
  order.tracking_id = "00003159423542";
  order.request_date = getYYYYMMDDHHMMSS();
  order.hashkey = "6bf1c1ea758871c3dc9deaaf23fda59f53aca89d";

  let hashString =
    order.merchant_id +
    order.service_id +
    // order.res_sps_transaction_id +
    order.tracking_id +
    order.request_date +
    order.hashkey;

  order.sps_hashcode = Sha1(hashString);

  const xmlPayload = `
<?xml version="1.0" encoding="Shift_JIS" ?>
<sps-api-request  id="ST02-00101-101">
  <merchant_id>${order.merchant_id}</merchant_id>
  <service_id>${order.service_id}</service_id>
  <tracking_id>${order.tracking_id}</tracking_id>
  <request_date>${order.request_date}</request_date>
  <sps_hashcode>${order.sps_hashcode}</sps_hashcode>
</sps-api-request>`;

  axios
    .post("https://stbfep.sps-system.com/api/xmlapi.do", xmlPayload, {
      headers: {
        "Content-Type": "application/xml",
      },
      auth: {
        username: "56943001",
        password: "6bf1c1ea758871c3dc9deaaf23fda59f53aca89d",
      },
    })
    .then((response) => {
      console.log("Response:", response.data);
      res.status(200).json({});
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({});
    });
});

app.post("/api/sb-payment-sales", (req, res) => {
  const order = {};
  order.merchant_id = "56943";
  order.service_id = "001";
  order.tracking_id = "00003159401628";
  order.processing_datetime = "20240625183110";
  order.request_date = getYYYYMMDDHHMMSS();
  order.hashkey = "6bf1c1ea758871c3dc9deaaf23fda59f53aca89d";

  let hashString =
    order.merchant_id +
    order.service_id +
    order.tracking_id +
    order.processing_datetime +
    order.request_date +
    order.hashkey;

  order.sps_hashcode = Sha1(hashString);

  const xmlPayload = `
<?xml version="1.0" encoding="Shift_JIS" ?>
<sps-api-request  id="ST02-00101-101">
  <merchant_id>${order.merchant_id}</merchant_id>
  <service_id>${order.service_id}</service_id>
  <tracking_id>${order.tracking_id}</tracking_id>
  <processing_datetime>${order.processing_datetime}</processing_datetime>
  <request_date>${order.request_date}</request_date>
  <sps_hashcode>${order.sps_hashcode}</sps_hashcode>
</sps-api-request>`;

  axios
    .post("https://stbfep.sps-system.com/api/xmlapi.do", xmlPayload, {
      headers: {
        "Content-Type": "application/xml",
      },
      auth: {
        username: "56943001",
        password: "6bf1c1ea758871c3dc9deaaf23fda59f53aca89d",
      },
    })
    .then((response) => {
      console.log("Response:", response.data);
      res.status(200).json({});
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({});
    });
});

app.post("/api/sb-3Dpayment/authen-request", (req, res) => {
  const requestId = "TA02-00101-101";
  const order = {};
  order.merchant_id = "56943";
  order.service_id = "001";
  order.cust_code = "Merchant_TestUser_1000";
  order.order_id = `b383940ccce_${getYYYYMMDDHHMMSS()}`;
  order.item_id = "T_0003";
  order.amount = "10";

  order.ok_return_url = "http://xxxx";
  order.ng_return_url = "http://xxxx";
  order.request_date = getYYYYMMDDHHMMSS();
  order.hashkey = "6bf1c1ea758871c3dc9deaaf23fda59f53aca89d";

  let hashString =
    order.merchant_id +
    order.service_id +
    order.cust_code +
    order.order_id +
    order.item_id +
    order.amount +
    order.ok_return_url +
    order.ng_return_url +
    order.request_date +
    order.hashkey;

  order.sps_hashcode = Sha1(hashString);
  console.log("hashString :>> ", hashString);
  console.log("sps_hashcode :>> ", order.sps_hashcode);

  const xmlPayload = `
<?xml version="1.0" encoding="Shift_JIS" ?>
<sps-api-request  id=\"${requestId}\">
  <merchant_id>${order.merchant_id}</merchant_id>
  <service_id>${order.service_id}</service_id>
  <cust_code>${order.cust_code}</cust_code>
  <order_id>${order.order_id}</order_id>
  <item_id>${order.item_id}</item_id>
  <amount>${order.amount}</amount>
  <pay_option_manage>
    <ok_return_url>${order.ok_return_url}</ok_return_url>
    <ng_return_url>${order.ng_return_url}</ng_return_url>
  </pay_option_manage>
  <request_date>${order.request_date}</request_date>
  <sps_hashcode>${order.sps_hashcode}</sps_hashcode>
</sps-api-request>`;

  console.log(xmlPayload);

  axios
    .post("https://stbfep.sps-system.com/api/xmlapi.do", xmlPayload, {
      headers: {
        "Content-Type": "application/xml",
      },
      auth: {
        username: "56943001",
        password: "6bf1c1ea758871c3dc9deaaf23fda59f53aca89d",
      },
    })
    .then((response) => {
      console.log("Response:", response.data);
      res.status(200).json({});
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({});
    });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

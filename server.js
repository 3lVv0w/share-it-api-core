"use strict";

require("dotenv").config();
const morgan = require("morgan");
const express = require("express");

const pg = require("knex")({
  client: "postgresql",
  connection: process.env.DATABASE_URL,
  useNullAsDefault: true
});
// var pg = require("knex")({
//   client: "pg",
//   connection: {
//     database: "share_it",
//     user: "postgres",
//     password: "password"
//   },
//   searchPath: ["knex", "public"]
// });

const bodyParser = require("body-parser");
const { join } = require("path");
const serveStatic = require("serve-static");

const app = express();

app.set("json spaces", 2);
app.use(morgan("dev"));
app.use(require("cors")());

app.use(bodyParser.json(), bodyParser.urlencoded({ extended: true }));

// app.use("/", serveStatic(join(__dirname, "/dist")));

app.post("/insertRegChula", async function(req, res, next) {
  console.log("inserting user");
  const rid = "" + req.query.id;
  const rfirstname = "" + req.query.firstname;
  const rlastname = "" + req.query.lastname;
  console.log("entering id into temp_it_chula");
  await pg("temp_it_chula").insert({
    it_chula: rid,
    first_name: rfirstname,
    last_name: rlastname
  });
  res.send("Done");
});

//signup
app.post("/signup", async function(req, res, next) {
  console.log("attempt to signup");
  var rtel_no = req.body.tel_no + "";
  var rpassword = req.body.password + "";
  var rfirstname = req.body.firstname + "";
  var rlastname = req.body.lastname + "";
  var remail = req.body.email + "";
  var rit_chula = req.body.it_chula + "";
  var rqrcode = rit_chula + rfirstname;

  var rimage = req.body.image + "";

  //var checked_it_chula;
  pg("temp_it_chula")
    .where({
      it_chula: rit_chula,
      first_name: rfirstname,
      last_name: rlastname
    })
    .then(async function(result) {
      if (!result || !result[0]) {
        console.log("entered wrong id");
        res.send("entered wrong id");
      } else {
        pg("accounts")
          .where({ it_chula: rit_chula })
          .then(async function(result) {
            if (!result || !result[0]) {
              await pg("accounts").insert({
                tel_no: rtel_no,
                password: rpassword,
                first_name: rfirstname,
                last_name: rlastname,
                email: remail,
                qrcode: rqrcode,
                it_chula: rit_chula,
                image: rimage
              });
              console.log("added info of " + rit_chula + " into accounts");
              res.send("signed up");
            } else console.log("sorry your account has been already registered");
            res.send("sorry your account has been already registered");
          });
      }
    });
});
//login receive id,password from front check and return
app.post("/login", async function(req, res, next) {
  console.log("attempting to login");
  var usernameReq = req.body.id + "";
  var passwordReq = req.body.password + "";
  pg("accounts")
    .where({ it_chula: usernameReq })
    .select("password")
    .then(function(result) {
      if (!result || !result[0]) {
        console.log("id not found");
        return;
      }
      var pass = result[0].password;
      if (passwordReq === pass) {
        console.log(usernameReq + " login success");

        pg.schema
          .then((err, result) =>
            pg("accounts").where({ it_chula: usernameReq })
          )
          .then(result => {
            console.log(result);
            res.send(result);
          });
      } else {
        console.log("wrong password");
        res.send("false");
      }
    })
    .catch(function(error) {
      console.log(error);
    });
});
//home category page when one of the category is chosen
app.post("/homepage", async function(req, res, next) {
  var ritem_type = req.body.item_type;

  console.log("Querying from item type: " + ritem_type);
  pg.schema
    .then((err, result) =>
      pg
        .where({ item_type: ritem_type, l_status: false })
        .select()
        .table("request")
    )
    .then(result => {
      if (!result || !result[0]) {
        res.send("no request");
      } else {
        console.log(result);
        res.send(result);
      }
    });
});

//view profile
app.post("/profile", async function(req, res, next) {
  const id = req.body.aid;
  pg.schema
    .then((err, result) =>
      pg(account)
        .where({ aid: id })
        .select()
    )
    .then(result => {
      console.log(result);
      res.send(result);
    });
});

//edit profile
app.post("/editProfile", async function(req, res, next) {
  console.log("inserting user");
  const image = req.body.image;
  const rid = req.body.aid;
  const rfirstname = "" + req.body.firstname;
  const rlastname = "" + req.body.lastname;
  const phoneno = req.body.tel_no;
  const email = req.body.email;
  await pg("accounts")
    .where({ aid: rid })
    .update({
      image: image,
      first_name: rfirstname,
      last_name: rlastname,
      tel_no: phoneno,
      email: email
    });

  res.send("Done");
});

//when a request is picked to view more info on the request (send account info of the borrower)
app.post("/accinfoinrequest", async function(req, res, next) {
  const rqno = req.body.rid;

  console.log("Sending info of request no.: " + rqno);
  pg.schema
    .then((err, result) =>
      pg("request").innerJoin("accounts", "request.aid", "accounts.aid")
    )
    .then(result => {
      console.log(result);
      res.send(result);
    });
});

//insert info on a new request

app.post("/borrowRequest", function(req, res, next) {
  console.log("listing item onto request catalogue");
  console.log(req.body);
  var rnote = req.body.note + "";
  var ritem_name = req.body.item_name + "";
  var ritem_type = req.body.item_type + "";
  var rtoken_used = req.body.token_used + "";
  var rk_location = req.body.k_location + "";
  var rborrow_time = req.body.borrow_time + "";
  var rreturn_time = req.body.return_time + "";
  var raid = req.body.aid + "";
  var rimage = req.body.examplePicUrl + "";

  pg("request")
    .where({ aid: raid, l_status: "false" })
    .then(async function(result) {
      if (!result || !result[0]) {
        //var rimage = req.query.image+''; add column
        pg("accounts")
          .where({ aid: raid })
          .then(async function(result) {
            console.log(result);
            await pg("request").insert({
              note: rnote,
              item_name: ritem_name,
              item_type: ritem_type,
              token_used: rtoken_used,
              k_location: rk_location,
              borrow_time: rborrow_time,
              return_time: rreturn_time,
              aid: raid,
              image: rimage
            });
            res.send("ok");
          });
      } else {
        console.log(result);
        console.log("request cant be created");

        res.send("entered wrong id or still in request");
      }
    });
});

//lender accept request
app.post("/acceptRequest", async function(req, res, next) {
  var rrid = req.body.rid + "";
  var raid = req.body.aid + "";
  console.log(rrid);
  console.log(raid);
  await pg("request")
    .where({ rid: rrid, l_status: true })
    .then(async function(result) {
      if (!(!result || !result[0])) {
        res.send("false");
        console.log("false");
      } else {
        await pg("accounts")
          .where({ aid: raid })
          .then(async function(result) {
            if (result[0].token > 0) {
              await pg("request")
                .where({ rid: rrid })
                .update("l_status", "true");
              await pg("accounts")
                .where({ aid: raid })
                .update("in_session", "true");
              await pg("accounts")
                .where({
                  aid: pg("request")
                    .select("aid")
                    .where({ rid: rrid })
                })
                .update("in_session", "true");
              await pg("session").insert({
                start_time: pg.fn.now(),
                end_time: pg.fn.now(),
                aid: raid,
                rid: rrid,
                s_status: "go to kiosk",
                iid: 0
              });
              pg(
                pg("request")
                  .select("rid", "aid")
                  .as("t1")
              )
                .innerJoin(
                  pg("session")
                    .select("sid", "rid")
                    .as("t2"),
                  "t1.rid",
                  "=",
                  "t2.rid"
                )
                .innerJoin(
                  pg("accounts")
                    .where({
                      aid: pg("request")
                        .distinct("aid")
                        .where({ rid: rrid })
                    })
                    .as("t3"),
                  "t1.aid",
                  "=",
                  "t3.aid"
                )
                .then(result => {
                  console.log(result);
                  res.send(result);
                });
            } else res.send("false");
          });
      }
      //update status in request
      //res.send() send borrower id
    });
});
//refresh session page (for borrower)

app.post("/checkAccept", async function(req, res, next) {
  var raid = req.body.aid;
  console.log(raid);
  console.log("refresh");
  await pg("request")
    .where({ aid: raid, l_status: "true" })
    .then(async function(result) {
      if (!result || !result[0]) {
        res.send("false");
        console.log("false");
      } else {
        console.log("true");

        pg("request")
          .where({ aid: raid, l_status: "true" })
          .select("rid")
          .then(async result => {
            var temp = result;
            await pg("session")
              .where({ s_status: "go to kiosk", rid: result[0].rid })
              .select("aid")
              .then(result => {
                if (!result || !result[0]) {
                  res.send("false");
                  console.log("false");
                } else {
                  pg("session")
                    .where({ s_status: "go to kiosk", rid: temp[0].rid })
                    .select("aid")
                    .then(result => {
                      pg("accounts")
                        .where({ aid: result[0].aid })
                        .select()
                        .then(result => {
                          console.log(result);
                          res.send(result);
                        });
                    });
                }
              });
          });
      }
    });

  //check if status in request has been changed
  //accept aid res if id in session send info of lender else send no session
});

//session end
//session end
app.post("/endsession", async function(req, res, next) {
  var sessionstatus = req.body.status + "";
  var sessionid = req.body.sid + "";
  var raid = req.body.aid + "";
  var t_used = null;
  var aid = null;
  var t = 0;
  var t_updated;

  await pg("session")
    .select("aid")
    .where({ aid: raid })
    .then(async result => {
      if (!(!result || !result[0])) {
        if (sessionstatus === "end") {
          await pg("session")
            .where({ sid: sessionid })
            .update({ s_status: "end" });
            pg("session")
            .select("rid")
            .where({ sid: sessionid }).then(async (result)=>{
          await pg("request")
            .where({
              rid: result[0].rid})
            .update({ l_status: "end" });
        })}


        // query old token
        pg.schema
          .then((err, result) =>
            pg(
              pg("request")
                .select("rid", "token_used")
                .as("t1")
            )
              .innerJoin(
                pg("session")
                  .select("sid", "aid", "rid")
                  .where({ sid: sessionid })
                  .as("t2"),
                "t1.rid",
                "=",
                "t2.rid"
              )
              .select("token_used", "aid")
          )
          .then(async result => {
            console.log(result[0].token_used);
            t_used = result[0].token_used; // 20
            console.log(t_used);
            aid = result[0].aid;
            console.log(aid);
            pg("accounts")
              .where({ aid: aid })
              .select("token")

              .then(async result => {
                //console.log(result)
                t = result[0].token;
                console.log(t);
                t_updated = t - t_used;
                console.log("t_updated = " + t_updated);
                console.log("aid = " + aid);
                console.log("remaining token = " + t_updated);

                // pg.schema.raw("update accounts set in_session=true,token="+t_updated+" where aid =" + aid);
                await pg("accounts")
                  .where("aid", "=", aid)
                  .update("in_session", false);
                console.log("----");
                await pg("accounts")
                  .where("aid", "=", aid)
                  .update("token", t_updated);
                pg("accounts")
                  .where({ aid: aid })
                  .then(async result => {
                    console.log(result);
                    console.log("lender end");
                    res.send("true");
                  });
              });
          });
      } else {
        pg("session")
          .select("s_status")
          .where({ sid: sessionid })
          .then(async result => {
            if (result[0].s_status == "end") {
              // console.log(result);
              pg.schema
                .then((err, result) =>
                  pg(
                    pg("request")
                      .select("rid", "aid", "token_used")
                      .as("t1")
                  )
                    .innerJoin(
                      pg("session")
                        .select("sid", "rid")
                        .where({ sid: sessionid })
                        .as("t2"),
                      "t1.rid",
                      "=",
                      "t2.rid"
                    )
                    .select("token_used", "aid")
                )
                .then(async result => {
                  console.log(result);
                  console.log(result[0].aid);
                  aid = result[0].aid;
                  pg("accounts")
                    .where({ aid: result[0].aid })
                    .select("token")

                    .then(async result => {
                      //console.log(result)
                      t = result[0].token;
                      console.log(t);
                      t_updated = t - t_used;
                      console.log("t_updated = " + t_updated);
                      console.log("aid = " + aid);
                      console.log("remaining token = " + t_updated);

                      // pg.schema.raw("update accounts set in_session=true,token="+t_updated+" where aid =" + aid);
                      await pg("accounts")
                        .where("aid", "=", aid)
                        .update("in_session", false);
                      console.log("----");
                      await pg("accounts")
                        .where("aid", "=", aid)
                        .update("token", t_updated);
                      pg("accounts")
                        .where({ aid: aid })
                        .then(async result => {
                          console.log(result);
                          console.log("borrowerend");
                          res.send("true");
                        });
                    });
                });
            } else {
              console.log("false");
              res.send("false");
            }
          });
      }
    });
});

// var t_updated = t - result[0].token_used;
// await pg("accounts")
//   .where({ aid: result[0].aid })
//   .update({ token: t_updated, in_session:"false"});

//feedback

app.post("/feedback", async function(req, res, next) {
  console.log("inserting user");
  var c_rating = parseInt(req.body.rating);
  const c_comment = "" + req.body.comment;

  const c_taid = "" + req.body.t_aid;
  const c_faid = "" + req.body.f_aid;

  console.log(c_taid);

  console.log(c_faid);

  console.log("entering feedback into feedback table");
  await pg("feedback").insert({
    rating: c_rating,
    comment: c_comment,
    taid: c_taid,
    faid: c_faid
  });

  pg("accounts")
    .where({ aid: c_taid })
    .select("no_of_feedback", "avg_rating")
    .then(async function(result) {
      //console.log(result);
      var fno = result[0].no_of_feedback;
      var new_fno = fno + 1;
      var old_rating = result[0].avg_rating;
      var new1 = old_rating * fno + c_rating;
      var new_rating = new1 / new_fno;

      await pg("accounts")
        .where({ aid: c_taid })
        .update({ no_of_feedback: new_fno });
      //console.log('new no.of feedback =' + new_fno);

      await pg("accounts")
        .where({ aid: c_taid })
        .update({ avg_rating: new_rating });
      console.log("new avg_rating = " + new_rating);
      res.send("Done");
    });

  //res.send('Done');
});

//=========>    KIOSK
//session by charlie
app.put("/iotchecklenderqr", function(req, res, next) {
  var rqrcode = req.body.stringLenderQR;
  console.log(rqrcode);

  pg("accounts")
    .where({ qrcode: rqrcode })
    .then(async function(result) {
      if (!result || !result[0]) {
        console.log("fake qr");
        res.send({ res: "false" });
      } else {
        console.log("correct user");
        pg("accounts")
          .where({ qrcode: rqrcode })
          .select("aid")
          .then(result => {
            pg("session")
              .where({
                aid: JSON.stringify(result[0].aid),
                s_status: "go to kiosk"
              })
              .then(async function(result) {
                if (!result || !result[0]) {
                  console.log("user not in sesion");
                  res.send({ res: "false" });
                } else {
                  pg.schema
                    .then((err, result) =>
                      pg("accounts")
                        .where({ qrcode: rqrcode })
                        .select("aid")
                    )
                    .then(async result => {
                      console.log("updating status");
                      await pg("session")
                        .where({ aid: JSON.stringify(result[0].aid) })
                        .update({
                          s_status: "lendercheck"
                        });
                      console.log("update status");
                    });
                  pg("accounts")
                    .where({ aid: JSON.stringify(result[0].aid) })
                    .select("first_name")
                    .then(result => {
                      console.log("done");
                      res.send(JSON.stringify(result));
                    });
                }
              });
          });
      }
    });
});

app.put("/iotcheckitemqr", function(req, res, next) {
  var riqrcode = req.body.stringItemQR;
  pg("items")
    .where({ item_qrcode: riqrcode })
    .select("iid", "item_qrcode", "belonged_aid")
    .then(async function(result) {
      if (!result || !result[0]) {
        console.log("fake qr");

        res.send({ res: "false" });
      } else {
        pg.schema
          .then((err, result) =>
            pg("items")
              .where({ item_qrcode: riqrcode })
              .select("belonged_aid", "iid")
          )
          .then(async result => {
            console.log("updating item status");
            await pg("session")
              .where({
                aid: JSON.stringify(result[0].belonged_aid),
                s_status: "lendercheck"
              })
              .update({
                s_status: "itemcheck",
                iid: JSON.stringify(result[0].iid)
              });
            console.log("updated item status");
          });
        pg("items")
          .where({ item_qrcode: riqrcode })
          .select("item_name")
          .then(result => {
            console.log("update item");
            res.send(JSON.stringify(result));
          });
      }
    });
});

app.put("/iotcheckborrowerqr", function(req, res, next) {
  var rqrcode = req.body.stringBorrowerQR;
  console.log(rqrcode);
  var borrowid;
  pg("accounts")
    .where({ qrcode: rqrcode })
    .then(async function(result) {
      if (!result || !result[0]) {
        console.log("fake qr");
        res.send({ res: "false" });
      } else {
        console.log("correct user");
        pg("accounts")
          .innerJoin("request", "accounts.aid", "=", "request.aid")
          .select("rid")
          .where({ qrcode: rqrcode })
          .then(result => {
            if (!result || !result[0]) {
              res.send({ res: "false" });
            } else {
              console.log("user check sesion");
              console.log(result[0].rid);
              console.log(result[0]);
              console.log(JSON.stringify(result[0].rid) + " result");
              borrowid = result[0].rid;
              pg("session")
                .where({
                  rid: JSON.stringify(result[0].rid),
                  s_status: "itemcheck"
                })
                .then(async function(result) {
                  if (!result || !JSON.stringify(result[0])) {
                    console.log("user not in sesion");
                    console.log(JSON.stringify(result[0]));
                    res.send({ res: "false" });
                  } else {
                    pg.schema
                      .then((err, result) =>
                        pg("accounts")
                          .innerJoin(
                            "request",
                            "accounts.aid",
                            "=",
                            "request.aid"
                          )
                          .select("rid")
                          .where({ qrcode: rqrcode })
                      )
                      .then(async result => {
                        console.log("updating item status");
                        await pg("session")
                          .where({
                            rid: JSON.stringify(result[0].rid),
                            s_status: "itemcheck"
                          })
                          .update({
                            s_status: "sessionStart"
                          });
                        console.log("updated item status");
                      });

                    pg("accounts")
                      .where({ qrcode: rqrcode })
                      .select("first_name")
                      .then(result => {
                        console.log("user in sesion");
                        res.send(JSON.stringify(result));
                      });
                  }
                });
            }
          });
      }
    });
});

//session by charlie
app.post("/registeritem", async function(req, res, next) {
  console.log("inserting item");
  const name = "" + req.body.item_name;
  const type = "" + req.body.item_type;
  const id = "" + req.body.belonged_acc_no;
  var qr = "";
  var qrupdate = "";
  pg("accounts")
    .where({ it_chula: id })
    .then(async function(result) {
      if (!result || !result[0]) {
        //console.log('fake qr')
        res.send({ res: "false" });
      } else {
        pg.schema
          .then((err, result) =>
            pg("accounts")
              .where({ it_chula: id })
              .select("aid", "qrcode")
          )
          .then(async result => {
            await pg("items").insert({
              item_name: name,
              item_type: type,
              item_qrcode: result[0].qrcode,
              belonged_aid: result[0].aid
            });
            qr = result[0].qrcode;
            console.log(qr + " is the qrcode");
          })
          .then((err, result) =>
            pg("items")
              .where({ item_qrcode: qr })
              .select("iid")
          )
          .then(async result => {
            qrupdate = qr + JSON.stringify(result[0].iid);
            console.log(qrupdate);
          })
          .then((err, result) =>
            pg("items")
              .where({ item_qrcode: qr })
              .select("iid")
          )
          .then(async result => {
            console.log(qr + "    " + qrupdate);
            await pg("items")
              .where({ item_qrcode: qr })
              .update({
                item_qrcode: qrupdate
              })
              .then((err, result) =>
                pg("items")
                  .where({ item_qrcode: qrupdate })
                  .select("item_qrcode")
              )
              .then(async result => {
                console.log(JSON.stringify(result));
                res.send(JSON.stringify(result));
              });
          });
      }
    });
});

app.post("/deleterequest", async function(req, res, next) {
  console.log("deleting req");
  const id = req.query.id;
  pg.schema.then((err, result) =>
    pg("request")
      .where({ rid: id })
      .del()
  );
  res.send("deleted " + id);
});

app.post("/deletesession", async function(req, res, next) {
  console.log("deleting ses");
  const id = req.query.id;
  pg.schema.then((err, result) =>
    pg("session")
      .where({ sid: id })
      .del()
  );
  res.send("deleted " + id);
});

app.post("/deleteitem", async function(req, res, next) {
  console.log("deleting item");
  const id = req.query.id;
  pg.schema.then((err, result) =>
    pg("items")
      .where({ iid: id })
      .del()
  );
  res.send("deleted " + id);
});
app.post("/deleteaccount", async function(req, res, next) {
  console.log("deleting account");
  const id = req.query.id;
  pg.schema.then((err, result) =>
    pg("accounts")
      .where({ aid: id })
      .del()
  );
  res.send("deleted " + id);
});
app.post("/sessionStart", async function(req, res, next) {
  var rsid = req.body.sid;
  pg("session")
    .where({ sid: rsid })
    .then(async function(result) {
      if (result[0].s_status == "sessionStart") {
        console.log(result[0].s_status);
        pg("session")
          .where({ sid: rsid })
          .then(result => {
            res.send(result);
          });
      } else {
        console.log(result[0].s_status);
        res.send("false");
      }
    });
  //TBCC
});
app.get("/view", function(req, res, next) {
  pg.schema
    .then((err, result) => pg.select().table("items"))
    .then(result => {
      console.log(result);
      res.send(result);
    });
});

app.post("/defualtaccount", async function(req, res, next) {
  var id = req.query.id;
  pg("accounts")
    .where({ it_chula: id })
    .then(async function(result) {
      if (result[0]) {
        await pg("accounts").insert({
          aid: 0,
          tel_no: "0",
          password: "password",
          first_name: "defualt",
          last_name: "defualt",
          email: "defualt",
          qrcode: "defualt",
          it_chula: "0"
        });
      }
    });
  res.send(200);
});

app.post("/defualtitem", async function(req, res, next) {
  var raid = req.query.aid;
  pg("accounts")
    .where({ aid: raid })
    .then(async function(result) {
      if (result[0]) {
        await pg("items").insert({
          iid: 0,
          item_name: "defualt",
          item_type: "defualt",
          item_qrcode: "defualt",
          belonged_aid: raid
        });
      }
    });
  return res.send(200);
});

app.put("/updateaccount", async function(req, res, next) {
  const status = req.query.id;
  await pg("accounts")
    .where({ aid: status })
    .update({
      in_session: false
    });
});
app.listen(process.env.PORT || 3000, () => {
  console.log(`running on port: ${process.env.PORT}`);
});

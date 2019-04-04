const db = require("./db");
const crypto = require("crypto");
const admin = require("firebase-admin");
const config = require("../config");
admin.initializeApp({
  credential: admin.credential.cert(config.FIREBASE),
  databaseURL: config.FIREBASE.databaseURL
});

let sqlTableSession = `
    CREATE TABLE IF NOT EXISTS user_session (
        session_id VARCHAR(100) NOT NULL,
        uid VARCHAR(100) NOT NULL,
        create_at timestamp not null default CURRENT_TIMESTAMP,
        PRIMARY KEY (session_id)
    ) ENGINE=MyISAM CHARSET=utf8 AUTO_INCREMENT=1;
`;

let sqlTableUser = `
    CREATE TABLE IF NOT EXISTS user (
        id int(11) NOT NULL AUTO_INCREMENT,
        uid VARCHAR(100) NOT NULL,
        displayName VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        photoURL VARCHAR(300) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY idx_uid (uid)
    ) ENGINE=MyISAM CHARSET=utf8 AUTO_INCREMENT=1;
`;

class userManager {
  generateSessionId(uid) {
    let sha = crypto.createHash("sha256");
    sha.update(uid + Math.random().toString());
    return sha.digest("hex");
  }
  use(app) {
    var self = this;
    db.getConnection().then(cnx => {
      return Promise.all([
        cnx.query(sqlTableSession),
        cnx.query(sqlTableUser)
      ]).finally(() => cnx.connection.release());
    });
    app.use((req, res, next) => {
      req.user = null;
      req.getUser = () => {
        if (req.user) return req.user;
        return new Promise((resolve, reject) => {
          if (req.headers.sessionid) {
            db.getConnection().then(cnx => {
              cnx
                .query(
                  "SELECT u.* from user_session us left join user u on u.uid=us.uid where us.session_id=?",
                  [req.headers.sessionid]
                )
                .then(rows => {
                  if (rows.length) {
                    req.user = rows[0];
                  }
                  resolve(req.user);
                });
            });
          } else {
            resolve(req.user);
          }
        });
      };
      next();
    });
    app.post("/session", (req, res) => {
      if (req.body && req.body.idToken) {
        admin
          .auth()
          .verifyIdToken(req.body.idToken)
          .then(function (decodedToken) {
            var uid = decodedToken.uid;



            var sessionid = self.generateSessionId(uid);
            return db.getConnection().then(cnx => {
              return cnx
                .query("SELECT id FROM user where uid=?", [uid])
                .then(r => {
                  if (r.length === 0) {
                    return cnx.query(
                      "insert into user (uid,displayName,email,photoURL) values (?,?,?,?)",
                      [
                        uid,
                        decodedToken.name,
                        decodedToken.email,
                        decodedToken.picture
                      ]
                    );
                  }
                  return true;
                })
                .then(() => {
                  return cnx
                    .query(
                      "insert into user_session (session_id,uid) values (?,?)",
                      [sessionid, uid]
                    )
                    .then(r => {
                      res.send({ verified: true, sessionid: sessionid });
                    })
                    .finally(() => cnx.connection.release());
                });
            });
          })
          .catch(function (error) {
            res.send({ verified: false });
          });
      } else {
        res.send({ verified: false });
      }
    });
  }
}

module.exports = new userManager();

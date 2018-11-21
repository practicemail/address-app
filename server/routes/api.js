const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const debug = require('debug');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'address_app'
});

// MORA DA DOHVATI SLIKE IZVAN DISTA U UPLOADS DIRU
//var avatar_path =  path.join(__dirname, '../../src/assets/uploads');
var avatar_path = './src/assets/uploads';

// upload config
// create a storage which says where and how the files/images should be saved
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, avatar_path);
  },
  filename: function(req, file, callback) {
    //+ "_" + file.originalname
    callback(null, file.fieldname + "_" + Date.now());
  }
});

// create a multer object
var upload = multer({
  storage: storage,
  // in bytes
  limits: {fileSize: 1000000},
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('avatar');

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(file.originalname.toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only');
  }
}


// routes config //

// get all friends
router.get('/friends', function (req, res, next) {
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    // Use the connection
    connection.query('SELECT * FROM friends', function (error, results, fields) {
      if(error){
        console.log("Error: " + error);
        res.status(400).send(error);
      }

      res.status(200).send(results);

      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

// get friend detail
router.get('/friends/:id', function (req, res, next) {
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    // Use the connection
    connection.query('SELECT * FROM friends where id = ?', req.params.id , function (error, results, fields) {
      if(error){
        console.log("Error: " + error);
        res.status(400).send(error);
      }
      res.status(200).send(results);

      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

// add a new friend
router.post('/friends',upload, function (req, res, next) {
  pool.getConnection(function(err, connection) {
    var friend = {
        name: req.body.name,
        address: req.body.address,
        country: req.body.country,
        phone: req.body.phone
    };

    if (req.file != undefined || req.file != null) {
      friend.avatarNewPath =  req.file.filename + "[150]" + path.extname(req.file.originalname);

      sharp(req.file.path)
        .resize(150, 150)
        .toFile(req.file.path + "[150]" + path.extname(req.file.originalname), function(err) {
          if(!err) {
            fs.unlinkSync(req.file.path);
          } else {
            console.log('Sharp error: ' + err);
          }
        });
    }

    if (err) throw err; // not connected!

    // Use the connection
    res.json(friend);
    connection.query('INSERT INTO friends (name,address,country,phone,avatar) VALUES(?,?,?,?,?)', [friend.name, friend.address, friend.country, friend.phone, friend.avatarNewPath], function (error, results, fields) {
      if(error){
        console.log("Error: " + error);
        res.status(400).send(error);
      }

      res.status(200).end(JSON.stringify(results));

      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

// edit friend
router.put('/friends/:id', upload, function (req, res, next) {
  pool.getConnection(function(err, connection) {
    var friend = {
      name: req.body.name,
      address: req.body.address,
      country: req.body.country,
      phone: req.body.phone
    };

    //Remove the old avatar
    if (req.body.oldAvatar && req.file !== undefined) {
      fs.unlinkSync(avatar_path + "/" + req.body.oldAvatar);
    }


    if (req.file !== undefined) {
      friend.avatarNewPath =  req.file.filename + "[150]" + path.extname(req.file.originalname);

      sharp(req.file.path)
        .resize(150, 150)
        .toFile(req.file.path + "[150]" + path.extname(req.file.originalname), function(err) {
          if(!err) {
            fs.unlinkSync(req.file.path);
          } else {
            console.log('Sharp error: ' + err);
          }
        });
    } else {
      friend.avatarNewPath = req.body.oldAvatar;
    }

    if (err) throw err; // not connected!

    res.json(friend);
    connection.query('UPDATE friends SET name=(?), address=(?), country=(?), phone=(?), avatar=(?) WHERE id=(?)', [friend.name, friend.address, friend.country, friend.phone, friend.avatarNewPath, req.params.id], function (error, results, fields) {
      if(error){
        console.log("Error: " + error);
        res.status(400).send(error);
      }

      res.status(200).end(JSON.stringify(results));

      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

// delete friend
router.delete('/friends/:id/:avatar', function (req, res, next) {

  // Remove avatar from storage
  if (req.params.avatar !== 'null') {
    fs.unlinkSync(avatar_path + "/" + req.params.avatar);
  }

  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!

    // Use the connection
    connection.query('DELETE FROM friends WHERE id = ?', req.params.id, function (error, results, fields) {
      if(error){
        console.log("Error: " + error);
        res.status(400).send(error);
      }

      res.status(200).end(JSON.stringify(results));

      // When done with the connection, release it.
      connection.release();

      // Handle error after the release.
      if (error) throw error;

      // Don't use the connection here, it has been returned to the pool.
    });
  });
});

// login
// router.post('/signin', User.signin)

module.exports = router;

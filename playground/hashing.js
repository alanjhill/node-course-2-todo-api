const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const brcypt = require('bcryptjs');


var password = "123abc!";
// brcypt.genSalt(10, (err, salt) => {
//   brcypt.hash(password, salt, (error, hash) => {
//     console.log("hash", hash);
//   });
// });
var hashedPassword = "$2a$10$7QgNuBlLOta2ijj4X1G3L.QuNSfyc3Q.XYP7rS0HFvVaLmDF38sYu";
brcypt.compare(password, hashedPassword, (error, result) => {
  console.log("result", result);
});

// var data = {
//   id: 10
// };
// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abcc');
// console.log("decoded", decoded);

// var message = 'this is my password';
// var hash = SHA256(message).toString();
// console.log(`Message: ${message}, hash: ${hash}`);

// var data = {
//   id: 4
// };
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//   console.log("Data was not changed");
// } else {
//   console.log("Data was changed.  Do not trust!");
// }



require("dotenv").config();
const server = require("./server");
// code away!
const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Server on ${port}`);
});

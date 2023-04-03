console.log("===========================");
console.log("RUNNING SERVER DIAGNOSTICS");

const statusTimeout = setTimeout(() => {
  console.log("Timed out after 8 seconds");
  process.exit(-1);
}, 8000);

fetch("http://localhost:8000/status")
  .then((response) => {
    clearTimeout(statusTimeout);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Status code: ${response.status} ${response.statusText}`);
    }
  })
  .then((data) => {
    console.log("========= SUCCESS =========");
    console.log("     SERVER IS ONLINE");
    console.log(data);
  })
  .catch((error) => {
    clearTimeout(statusTimeout);
    console.log(error);
    process.exit(-1);
  });

console.log("===========================");
console.log("  RUNNING DB DIAGNOSTICS");

const databaseTimeout = setTimeout(() => {
  console.log("Timed out after 8 seconds");
  process.exit(-1);
}, 8000);

fetch("http://localhost:8000/users", {
  method: "post",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "diagnosticUsername",
    email: "diagnosticEmail@test.com",
    password: "1234Password1234",
  }),
})
  .then((response) => {
    clearTimeout(databaseTimeout);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Status code: ${response.status} ${response.statusText}`);
    }
  })
  .then((data) => {
    console.log("========= SUCCESS =========");
    console.log("    DATABASE IS ONLINE");
    console.log(data);
  })
  .catch((error) => {
    clearTimeout(databaseTimeout);
    console.log(error);
    process.exit(-1);
  });

const timeout = setTimeout(() => {
  console.log("Timed out after 8 seconds");
  process.exit(-1);
}, 8000);

fetch("http://localhost:8000/status")
  .then((response) => {
    clearTimeout(timeout);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Status code: ${response.status} ${response.statusText}`);
    }
  })
  .then((data) => {
    console.log("SUCCESS");
    console.log(data);
  })
  .catch((error) => {
    clearTimeout(timeout);
    console.log(error);
    process.exit(-1);
  });

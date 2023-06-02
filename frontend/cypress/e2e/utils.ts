export const randomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const createWebSocket = (
  url = "ws://localhost:8000"
  // auth = true
): Promise<WebSocket> => {
  const socket = new WebSocket(url);

  // if (auth) {
  //   const token = window.sessionStorage.getItem("token");
  //   // Send the jwt when the connection opens
  //   socket.addEventListener("open", () => {
  //     socket.send(JSON.stringify({ token: token }));
  //   });
  // }

  return new Promise<WebSocket>((resolve, reject) => {
    const interval = setInterval(() => {
      if (socket.readyState === 1) {
        clearInterval(interval);
        resolve(socket);
      } else if (socket.readyState >= 2) {
        clearInterval(interval);
        reject(new Error("failure opening ws connection"));
      }
    }, 10);
  });
};

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
): Promise<WebSocket> => {
  const socket = new WebSocket(url);

  return new Promise<WebSocket>((resolve, reject) => {
    const interval = setInterval(() => {
      if (socket.readyState === 1) {
        clearInterval(interval);
        console.log("Success: clearing interval");
        resolve(socket);
      } else if (socket.readyState >= 2) {
        clearInterval(interval);
        console.log("Failure: clearing interval");
        reject(new Error("failure opening ws connection"));
      }
    }, 10);
  });
};

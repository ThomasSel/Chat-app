import ws from "ws";

const broadcastMessage = (
  e: ws.MessageEvent,
  clients: Iterable<ws.WebSocket>
) => {
  for (let client of clients) {
    client.send(e.data.toString());
  }
};

export default broadcastMessage;

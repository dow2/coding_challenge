const sdkState: { socket?: any; list?: HTMLUListElement } = {};
const sdk = {
  connect(socket: any, list: HTMLUListElement) {
    sdkState.socket = socket;
    sdkState.list = list;
  },
  on(key, handler) {
    sdkState.socket?.on(key, (message) => {
      const item = document.createElement('li');
      const string = JSON.stringify(message.content);
      item.innerHTML = `RECV:${string}`;
      item.id = message.id;
      sdkState.list?.append(item);
      handler(message);
    });
  },
  send(content) {
    const id = Math.random();
    const item = document.createElement('li');
    const string = JSON.stringify(content);
    item.innerHTML = `SEND:${string}`;
    item.id = String(id);
    sdkState.list?.append(item);
    sdkState.socket?.emit('message', {
      id,
      content,
      sentAt: Date.now(),
    });
  },
  disconnect() {
    sdkState.socket?.disconnect();
  },
};
export { sdk };
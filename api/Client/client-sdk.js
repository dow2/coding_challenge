const sdkState = {};
const sdk = {
    connect(socket, list) {
        sdkState.socket = socket;
        sdkState.list = list;
    },
    on(key, handler) {
        var _a;
        (_a = sdkState.socket) === null || _a === void 0 ? void 0 : _a.on(key, (message) => {
            var _a;
            const item = document.createElement('li');
            const string = JSON.stringify(message.content);
            item.innerHTML = `RECV:${string}`;
            item.id = message.id;
            (_a = sdkState.list) === null || _a === void 0 ? void 0 : _a.append(item);
            handler(message);
        });
    },
    send(content) {
        var _a, _b;
        const id = Math.random();
        const item = document.createElement('li');
        const string = JSON.stringify(content);
        item.innerHTML = `SEND:${string}`;
        item.id = String(id);
        (_a = sdkState.list) === null || _a === void 0 ? void 0 : _a.append(item);
        (_b = sdkState.socket) === null || _b === void 0 ? void 0 : _b.emit('message', {
            id,
            content,
            sentAt: Date.now(),
        });
    },
    disconnect() {
        var _a;
        (_a = sdkState.socket) === null || _a === void 0 ? void 0 : _a.disconnect();
    },
};
export { sdk };

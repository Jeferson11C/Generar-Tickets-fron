// src/services/websocket.service.js
let socket;
let isConnected = false;

const setupWebSocketConnection = (areaCreatedCallback) => {
    if (isConnected) return;

    socket = new WebSocket('ws://localhost:3000');
    socket.onopen = () => {
        console.log('Connected to WebSocket.');
        isConnected = true;
    };
    socket.onmessage = (event) => handleWebSocketMessage(event, areaCreatedCallback);
};

const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not open.');
    }
};

const handleWebSocketMessage = (event, areaCreatedCallback) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);

    if (message.entityName === 'Area' && message.action === 'Created') {
        areaCreatedCallback(message.entity);
    }
};

export default {
    setupWebSocketConnection,
    sendMessage
};
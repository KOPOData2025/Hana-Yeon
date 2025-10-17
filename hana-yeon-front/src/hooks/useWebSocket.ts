import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { TChatMessage } from "@/types";
import { getBaseUrl } from "@/lib";

const WEBSOCKET_URL = `${getBaseUrl()}/ws`;

export const useWebSocket = (
  onMessageReceived: (message: TChatMessage) => void
) => {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (clientRef.current?.active) {
      return;
    }
    const client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      // debug: (msg) => console.log(msg),
    });

    client.onConnect = () => {
      setIsConnected(true);
      client.subscribe("/topic/chat", (message) => {
        const receivedMessage: TChatMessage = JSON.parse(message.body);
        onMessageReceived(receivedMessage);
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
      setIsConnected(false);
    };

    client.activate();
    clientRef.current = client;
  }, [onMessageReceived]);

  useEffect(() => {
    connect();

    return () => {
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
    };
  }, [connect]);

  const sendMessage = (content: string) => {
    if (clientRef.current?.active) {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify({ content }),
      });
    }
  };

  return { sendMessage, isConnected };
};

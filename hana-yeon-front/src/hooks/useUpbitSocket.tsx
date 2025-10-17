import { useEffect, useRef, useState } from "react";
import throttle from "lodash/throttle";
import type { Ticker } from "@/types";
import SockJS from "sockjs-client";
import { Client, type IMessage } from "@stomp/stompjs";
import { getBaseUrl } from "@/lib";

export class UpbitWebSocketManager {
  private static instance: UpbitWebSocketManager;
  private stompClient: Client | null = null;
  private subscribers: Set<(ticker: Map<string, Ticker>) => void> = new Set();
  private ticker: Map<string, Ticker> = new Map();
  private currentCodes: string[] = [];
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private disconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private readonly DISCONNECT_DELAY = 60000;
  private subscriptions: Map<string, any> = new Map();

  static getInstance(): UpbitWebSocketManager {
    if (!UpbitWebSocketManager.instance) {
      UpbitWebSocketManager.instance = new UpbitWebSocketManager();
    }
    return UpbitWebSocketManager.instance;
  }

  private throttledMessageHandler = throttle(
    (data: any) => {
      if (data.type === "ticker") {
        this.ticker.set(data.code, data);
        this.notifySubscribers();
      }
    },
    1500,
    { leading: true, trailing: false }
  );

  subscribe(callback: (ticker: Map<string, Ticker>) => void): () => void {
    this.subscribers.add(callback);
    callback(new Map(this.ticker));

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = null;
    }

    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0) {
        this.disconnectTimeout = setTimeout(() => {
          this.disconnect();
          this.disconnectTimeout = null;
        }, this.DISCONNECT_DELAY);
      }
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback(new Map(this.ticker)));
  }

  connect(codes: string[]) {
    if (
      this.stompClient?.connected &&
      JSON.stringify(this.currentCodes.sort()) === JSON.stringify(codes.sort())
    ) {
      return;
    }

    if (this.isConnecting) return;
    this.isConnecting = true;

    if (this.stompClient?.connected) {
      this.unsubscribeFromCodes(this.currentCodes);
    }

    this.currentCodes = [...codes];
    this.connectToBackend();
  }

  private connectToBackend() {
    try {
      const url = getBaseUrl();
      const socket = new SockJS(`${url}/ws`);

      this.stompClient = new Client({
        webSocketFactory: () => socket as any,
        reconnectDelay: 3000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.stompClient.onConnect = () => {
        console.log("백엔드 STOMP 연결 성공");
        this.isConnecting = false;

        if (this.currentCodes.length > 0) {
          this.subscribeToBackend(this.currentCodes);
        }
      };

      this.stompClient.onStompError = (frame) => {
        console.error("STOMP 오류:", frame.headers["message"]);
        console.error("추가 정보:", frame.body);
        this.isConnecting = false;
      };

      this.stompClient.onDisconnect = () => {
        console.log("백엔드 STOMP 연결 해제");
        this.isConnecting = false;

        if (this.subscribers.size > 0 && !this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect(this.currentCodes);
          }, 3000);
        }
      };

      this.stompClient.activate();
    } catch (error) {
      console.error("백엔드 STOMP 연결 실패:", error);
      this.isConnecting = false;
    }
  }

  private subscribeToBackend(codes: string[]) {
    if (!this.stompClient?.connected) {
      console.warn("STOMP 클라이언트가 연결되지 않음");
      return;
    }

    try {
      this.stompClient.publish({
        destination: "/app/upbit/subscribe",
        body: JSON.stringify({ codes }),
      });

      codes.forEach((code) => {
        if (!this.subscriptions.has(code)) {
          const subscription = this.stompClient!.subscribe(
            `/topic/upbit/ticker/${code}`,
            (message: IMessage) => {
              try {
                const data = JSON.parse(message.body);
                this.throttledMessageHandler(data);
              } catch (e) {
                console.error("업비트 메시지 파싱 오류:", e);
              }
            }
          );
          this.subscriptions.set(code, subscription);
        }
      });

      console.log("백엔드에 업비트 구독 요청 전송:", codes);
    } catch (error) {
      console.error("백엔드 구독 요청 실패:", error);
    }
  }

  private unsubscribeFromCodes(codes: string[]) {
    if (!this.stompClient?.connected || codes.length === 0) {
      return;
    }

    try {
      this.stompClient.publish({
        destination: "/app/upbit/unsubscribe",
        body: JSON.stringify({ codes }),
      });

      codes.forEach((code) => {
        const subscription = this.subscriptions.get(code);
        if (subscription) {
          subscription.unsubscribe();
          this.subscriptions.delete(code);
        }
      });

      console.log("백엔드에 업비트 구독 해제 요청 전송:", codes);
    } catch (error) {
      console.error("백엔드 구독 해제 요청 실패:", error);
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = null;
    }

    if (this.currentCodes.length > 0) {
      this.unsubscribeFromCodes(this.currentCodes);
    }

    if (this.stompClient?.connected) {
      this.stompClient.deactivate();
    }

    this.subscriptions.clear();
    this.ticker.clear();
    this.currentCodes = [];
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.stompClient?.connected || false;
  }

  getTicker(): Map<string, Ticker> {
    return new Map(this.ticker);
  }
}

export const useUpbitSocket = (codes: string[]) => {
  const [ticker, setTicker] = useState<Map<string, Ticker>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const managerRef = useRef<UpbitWebSocketManager>(null);

  useEffect(() => {
    managerRef.current = UpbitWebSocketManager.getInstance();

    const unsubscribe = managerRef.current.subscribe((newTicker) => {
      setTicker(newTicker);
      setIsConnected(managerRef.current?.isConnected() || false);
    });

    if (codes.length > 0) {
      managerRef.current.connect(codes);
    }

    return unsubscribe;
  }, [JSON.stringify(codes.sort())]);

  return {
    ticker,
    isConnected,
  };
};

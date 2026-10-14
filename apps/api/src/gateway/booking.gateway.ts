/**
 * Real-Time WebSocket Gateway
 * Synchronizes booking state across Student Web, Mobile Simulator, Teacher Portal, and Admin Panel.
 */

import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';

export interface WebSocketMessage<T = any> {
  channel: string;
  event: 'SLOT_HELD' | 'SLOT_RELEASED' | 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'BOOKING_RESCHEDULED' | 'SLOT_TOGGLED';
  payload: T;
  timestamp: string;
}

export class BookingGateway {
  private static wss: WebSocketServer | null = null;
  private static clients: Set<WebSocket> = new Set();

  /**
   * Initialize the WebSocket Server attached to the HTTP server
   */
  public static init(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket, req) => {
      this.clients.add(ws);
      console.log(`🔌 [WebSocket] Client connected. Total active clients: ${this.clients.size}`);

      // Send initial welcome
      ws.send(
        JSON.stringify({
          channel: 'system',
          event: 'CONNECTED',
          payload: { message: 'Connected to Prāṇa Yoga Real-Time Gateway' },
          timestamp: new Date().toISOString(),
        })
      );

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`🔌 [WebSocket] Client disconnected. Total active clients: ${this.clients.size}`);
      });

      ws.on('error', (err) => {
        console.error('WebSocket client error:', err);
        this.clients.delete(ws);
      });
    });

    console.log('✔ WebSocket Gateway active on route /ws');
  }

  /**
   * Broadcast an event to all connected clients
   */
  public static broadcast<T>(channel: string, event: WebSocketMessage['event'], payload: T) {
    const message: WebSocketMessage<T> = {
      channel,
      event,
      payload,
      timestamp: new Date().toISOString(),
    };

    const data = JSON.stringify(message);

    for (const client of this.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(data);
        } catch (err) {
          console.error('Error broadcasting to client:', err);
        }
      }
    }
  }
}

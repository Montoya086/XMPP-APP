declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}

declare module 'react-native-xmpp' {
  export interface XmppConfig {
    jid: string;
    password: string;
    host: string;
    port?: number;
    resource?: string;
    reconnect?: boolean;
  }

  export function connect(config: XmppConfig): void;
  export function disconnect(): void;
  export function message(options: { to: string; body: string; thread?: string }): void;
  export function on(event: string, callback: (message: any) => void): void;
  export function removeListeners(): void;
}
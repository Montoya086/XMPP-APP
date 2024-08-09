import { client, xml, Client, jid } from '@xmpp/client';
import debug from '@xmpp/debug';

interface XMPPConfig {
  service: string;
  domain: string;
  resource: string;
  username: string;
  password: string;
}

class XMPPService {
  private xmpp: Client | null = null;

  connect({ service, domain, resource, username, password }: XMPPConfig): void {
    if (!this.xmpp) {
      this.xmpp = client({ service, domain, resource, username, password });

      this.xmpp.on('error', (err: Error) => {
        console.error('❌', err.toString());
      });

      this.xmpp.on('status', (status: string) => {
        console.log('🛈', status);
      });

      debug(this.xmpp, true);

      this.xmpp.on('online', async (address: any) => {
        console.log('✅', 'Connected as', address.toString());

        await this.xmpp!.send(xml('presence'));
      });

      this.xmpp.on('stanza', (stanza: any) => {
        console.log('📩', stanza.toString());
        if (stanza.is('message') && stanza.getChild('body')) {
          const from = stanza.attrs.from;
          const body = stanza.getChild('body').text();
          console.log('📥', `Message from ${from}: ${body}`);
        }
      });

      this.xmpp.start().catch(console.error);
    }
  }

  disconnect(): void {
    if (this.xmpp) {
      this.xmpp.stop().catch(console.error);
      this.xmpp = null;
    }
  }

  getXMPP(): Client | null {
    return this.xmpp;
  }

  async sendMessage(to: string, message: string): Promise<void> {
    if (this.xmpp) {
      const msg = xml(
        'message',
        { type: 'chat', to },
        xml('body', {}, message)
      );
      await this.xmpp.send(msg);
    } else {
      console.error('XMPP client is not connected');
    }
  }

  listenForMessages(callback: (from: string, message: string) => void): void {
    if (this.xmpp) {
      this.xmpp.on('stanza', (stanza: any) => {
        if (stanza.is('message') && stanza.getChild('body')) {
          const from = stanza.attrs.from;
          const body = stanza.getChild('body').text();
          callback(from, body);
        }
      });
    } else {
      console.error('XMPP client is not connected');
    }
  }

  // Listen for the client to connect
  listenForConnection(callback: () => void): void {
    if (this.xmpp) {
      this.xmpp.on('online', async () => {
        callback();
      });
    } else {
      console.error('XMPP client is not connected');
  }

  }
}

export default new XMPPService();

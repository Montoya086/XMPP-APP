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

  connect({ service, domain, resource, username, password }: XMPPConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.xmpp) {
        this.xmpp = client({ service, domain, resource, username, password });

        this.xmpp.on('error', (err: Error) => {
          console.error('❌', err.toString());
          reject(err);
        });

        this.xmpp.on('status', (status: string) => {
          console.log('🛈', status);
        });

        debug(this.xmpp, true);

        this.xmpp.on('online', async (address: any) => {
          console.log('✅', 'Connected as', address.toString());

          await this.xmpp!.send(xml('presence'));
          resolve();
        });

        this.xmpp.start().catch(reject);
      } else {
        resolve();
      }
    });
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

  listenForConnection(callback: () => void): void {
    if (this.xmpp) {
      this.xmpp.on('online', async () => {
        callback();
      });
    } else {
      console.error('XMPP client is not connected');
    }
  }

  registerUser = async (jid: string, password: string) => {
    if (this.xmpp) {
      const iq = xml(
        'iq',
        { type: 'set', id: 'register1' },
        xml(
          'query',
          { xmlns: 'jabber:iq:register' },
          xml('username', {}, jid),
          xml('password', {}, password)
        )
      );
    
      await this.xmpp.send(iq);
    } else {
      console.error('XMPP client is not connected');
    }
  }

  async executeRegisterAndReconnect(
    rootConfig: XMPPConfig,
    newUserConfig: { username: string; password: string }
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {

      await this.connect(rootConfig);
      
      await this.registerUser(newUserConfig.username, newUserConfig.password);
      
      this.disconnect();

      await this.connect({
        ...rootConfig,
        username: newUserConfig.username,
        password: newUserConfig.password,
      });

      console.log(`✅ Connected as new user: ${newUserConfig.username}`);

      return { success: true };
    } catch (error: any) {
      console.error('Error during the registration and reconnection process:', error);
      return { success: false, error: error.toString() };
    }
  }

  async getContacts(): Promise<{
    contacts: { jid: string; name: string; subscription: string }[];
  }> {
    if (this.xmpp) {
      const iq = xml('iq', { type: 'get', id: 'roster1' },
        xml('query', { xmlns: 'jabber:iq:roster' })
      );

      const stanza = await this.xmpp.sendReceive(iq);
      const query = stanza.getChild('query', 'jabber:iq:roster');
      if (query) {
        const items = query.getChildren('item');
        const contacts = items.map(item => ({
          jid: item.attrs.jid,
          name: item.attrs.name || '',
          subscription: item.attrs.subscription,
        }));
        return { contacts };
      }
      return { contacts: [] };
    } else {
      return { contacts: [] };
      console.error('XMPP client is not connected');
    }
  }

}

export default new XMPPService();

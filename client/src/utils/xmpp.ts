import { client, xml, Client, jid } from '@xmpp/client';
import debug from '@xmpp/debug';

interface XMPPConfig {
  service: string;
  domain: string;
  resource: string;
  username: string;
  password: string;
}

interface Image {
  type: string,
  name: string,
  base64: string,
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

        //debug(this.xmpp, true);

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
      this.xmpp.removeAllListeners('stanza');
      this.xmpp.stop().catch(console.error);
      this.xmpp = null;
    }
  }

  listenForConnectionOpen(callback: () => void): void {
    if (this.xmpp) {
      this.xmpp.on('online', () => {
        callback();
      });
    } else {
      console.error('XMPP client is not connected');
    }
  }

  removeStanzaListener(): void {
    if (this.xmpp) {
      this.xmpp.removeAllListeners('stanza');
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

  listenForMessages(callback: (from: string, message: string, type: "single" | "group", room?: string) => void): void {
    if (this.xmpp) {
      this.xmpp.removeAllListeners('stanza');
      this.xmpp.on('stanza', (stanza: any) => {
        if (stanza.is('message') && stanza.getChild('body')) {
          const from = stanza.attrs.from;
          const body = stanza.getChild('body').text();
          callback(from, body, "single");
        } else {
          //get group chat invitation
          if (stanza.is('message') && stanza.getChild('x') && stanza.getChild('x').attrs.xmlns === 'jabber:x:conference') {
            const from = stanza.attrs.from;
            const room = stanza.getChild('x').attrs.jid;
            callback(from, "", "group", room);
          }
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

  listenForPresenceUpdates(callback: (status: "online" | "away" | "xa" | "dnd" | "offline", from: string) => void): void {
    if (this.xmpp) {
      this.xmpp.on('stanza', (stanza: any) => {
        console.log('📥 Received stanza:', stanza.toString());
        if (stanza.is('presence')) {
          const from = stanza.attrs.from;
          const type = stanza.attrs.type;
          if (type === 'unavailable'){
            callback('offline', from);
            return;
          }
          const show = stanza.getChild('show');
          const status = show ? show.text() : 'online';
          callback(status, from);
        }
      });
    } else {
      console.error('XMPP client is not connected');
    }
  }

  listenForSubscriptionRequests(callback: (from: string) => void): void {
    if (this.xmpp) {
      this.xmpp.on('stanza', (stanza: any) => {
        if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
          const from = stanza.attrs.from;
          console.log(`📬 Solicitud de suscripción de: ${from}`);
          callback(from);
        }
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
    
      const rosterRequest = xml(
        "iq",
        { type: "get", id: "get_roster" },
        xml("query", { xmlns: "jabber:iq:roster" })
      );
      const response = await this.xmpp.sendReceive(rosterRequest);
      console.log(`📥 Received roster response: ${response.toString()}`);

      const query = response.getChild('query');
      if (query) {
        const contacts = query.getChildren('item').map((item: any) => ({
          jid: item.attrs.jid,
          name: item.attrs.name,
          subscription: item.attrs.subscription,
        }));
        return { contacts };
      }

      return { contacts: [] };
    } else {
      
      console.error('XMPP client is not connected');
      return { contacts: [] };
    }
  }

  async addContact(contactJid: string): Promise<boolean> {
    if (this.xmpp) {
      const presence = xml(
        'presence',
        { type: 'subscribe', to: contactJid }
      );
      await this.xmpp.send(presence);
      console.log(`📬 Request sent to add contact: ${contactJid}`);
      return true;
    } else {
      console.error('XMPP client is not connected');
      return false;
    }
  }

  async updatePresence(status: "online" | "away" | "xa" | "dnd" | "offline"): Promise<void> {
    if (this.xmpp) {
      let presence;
      if (status === 'online') {
        presence = xml('presence');
      } else {
        presence = xml(
          'presence',
          {},
          xml('show', {}, status),
        );
      }
  
      await this.xmpp.send(presence);
      console.log(`🔄 Status updated to: ${status}`);
    } else {
      console.error('XMPP client is not connected');
    }
  }

  async unblockPresence(from: string): Promise<void> {
    if (this.xmpp) {
      const presence = xml(
        'presence',
        { type: 'subscribed', to: from }
      );
      await this.xmpp.send(presence);
      console.log(`✅ Unblocked presence from: ${from}`);
    } else {
      console.error('XMPP client is not connected');
    }
  }

  async sendImage(to: string, image:Image){
    if (this.xmpp){
      const { type, name, base64 } = image;
      const message = xml(
        'message',
        { type: 'chat', to },
        xml('body', {}, `Image: ${name}`),
        xml('img', { xmlns: 'urn:xmpp:bob', type, src: `data:${type};base64,${base64}` })
      );
    
      try {
        await this.xmpp.send(message);
        console.log('✅ Image Sent');
      } catch (error) {
        console.error('Error sending image:', error);
      }
    } else {
      console.error('XMPP client is not connected');
    }
  }

  async getGroupName(groupJid: string): Promise<string | null> {
    if (this.xmpp) {
      const discoInfoRequest = xml(
        'iq',
        { type: 'get', to: groupJid, id: 'disco1' },
        xml('query', { xmlns: 'http://jabber.org/protocol/disco#info' })
      );
  
      try {
        const response = await this.xmpp.sendReceive(discoInfoRequest);
        console.log(`📥 Received disco#info response: ${response.toString()}`);
  
        const identity = response.getChild('query')?.getChild('identity');
        if (identity) {
          const name = identity.attrs.name || null;
          return name;
        } else {
          console.warn('⚠️ No identity found in disco#info response');
          return null;
        }
      } catch (error) {
        console.error('Error retrieving group name:', error);
        return null;
      }
    } else {
      console.error('XMPP client is not connected');
      return null;
    }
  }

}

export default new XMPPService();

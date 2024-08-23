import { client, xml, Client, jid } from '@xmpp/client';
import debug from '@xmpp/debug';

interface XMPPConfig {
  service: string;
  domain: string;
  resource: string;
  username: string;
  password: string;
}

interface File {
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

  async sendMessage(to: string, message: string, chatType: "single" | "group"): Promise<void> {
    if (this.xmpp) {
      const msg = xml(
        'message',
        { type: chatType === "single" ? 'chat' : "groupchat", to },
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
          const isGroup = from.split("@")[1].split(".")[0] == "conference"
          const type = isGroup ? "group" : "single"
          const parsedFrom = isGroup ? from.split("/")[1] : from
          const room = isGroup ? from.split("/")[0]: undefined
          callback(parsedFrom, body, type, room);
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

  listenForPresenceUpdates(callback: (status: "online" | "away" | "xa" | "dnd" | "offline", from: string, statusMessage?: string) => void): void {
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
          const statusElement = stanza.getChild('status');
          const statusMessage = statusElement ? statusElement.text() : null;
          callback(status, from, statusMessage);
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

  listenForFileMessages(callback: (from: string, message: string) => void): void {
    if (this.xmpp) {
      this.xmpp.on('stanza', (stanza: any) => {
        if (stanza.is('message') && stanza.getChild('x', 'jabber:x:oob')) {
          const urlElement = stanza.getChild('x', 'jabber:x:oob').getChild('url');
          const descElement = stanza.getChild('x', 'jabber:x:oob').getChild('desc');
          const from = stanza.attrs.from;
          
          if (urlElement && descElement) {
            const base64Data = urlElement.text().split(',')[1]; // Elimina el prefijo "data:<mime_type>;base64,"
            const fileName = descElement.text();

            const message= "file://"+base64Data+"//"+fileName
            
            try {
              callback(
                from,
                message
              )
              
              console.log(`📥 File received and saved: ${fileName}`);
            } catch (error) {
              console.error('Error processing received file:', error);
            }
          }
        }
      })
    } else {
      console.error('XMPP client is not connected');
    }
  }

  listenForGroupChatInvitations(callback: (from: string, roomJid: string) => void): void {
    if (this.xmpp) {
      this.xmpp.on('stanza', (stanza: any) => {
        if (
          stanza.is('message') &&
          stanza.getChild('x', 'jabber:x:conference')
        ) {
          const from = stanza.attrs.from;
          const xElement = stanza.getChild('x', 'jabber:x:conference');
          const roomJid = xElement.attrs.jid;
  
          callback(from, roomJid);
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

  async updatePresence(status: "online" | "away" | "xa" | "dnd" | "offline", statusMessage?: string): Promise<void> {
    if (this.xmpp) {
      let presence;
      if (status === 'online') {
        presence = xml('presence', 
          {},
          xml('status', {}, statusMessage || ""));
      } else {
        presence = xml(
          'presence',
          {},
          xml('status', {}, statusMessage || ""),
          xml('show', {}, status),
        );
      }
  
      await this.xmpp.send(presence);
      console.log(`🔄 Status updated to: ${status}`);
    } else {
      console.error('XMPP client is not connected');
    }
  }

  async unblockPresence(from: string, flag?: boolean): Promise<void> {
    if (this.xmpp) {
      const presence = xml(
        'presence',
        { type: 'subscribed', to: from }
      );
      const subscribe = xml(
        'presence',
        { type: 'subscribe', to: from }
      )
      if (!flag){
        await this.xmpp.send(subscribe)
      }
      await this.xmpp.send(presence);
      console.log(`✅ Unblocked presence from: ${from}`);
    } else {
      console.error('XMPP client is not connected');
    }
  }

  async sendFile(to: string, file:File){
    if (this.xmpp){
      try {
        console.log("File: ",file)
        const { name, base64, type } = file;

        const fileMessage = xml(
          'message',
          { type: 'chat', to },
          xml('x', { xmlns: 'jabber:x:oob' },
            xml('url', {}, `data:${type};base64,${base64}`),
            xml('desc', {}, name)
          )
        );
  
        await this.xmpp.send(fileMessage);
        console.log(`📤 File sent to ${to}: ${name}`);
        return Promise.resolve()
      } catch (error) {
        console.error('Error sending file:', error);
        return Promise.reject()
      }
    } else {
      console.error('XMPP client is not connected');
      return Promise.reject()
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
          console.log('⚠️ No identity found in disco#info response for', groupJid);
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

  async acceptGroupChatInvitation(roomJid: string, nickname: string): Promise<void> {
    if (this.xmpp) {
      try {
        const fullRoomJid = `${roomJid}/${nickname}`;
        const presence = xml(
          'presence',
          { to: fullRoomJid },
          xml('x', { xmlns: 'http://jabber.org/protocol/muc' })
        );
  
        await this.xmpp.send(presence);
        console.log(`✅ Joined group chat: ${roomJid} as ${nickname}`);
      } catch (error) {
        console.error('Error accepting group chat invitation:', error);
      }
    } else {
      console.error('XMPP client is not connected');
    }
  }

  async createGroup(groupName: string, nickname: string, domain: string): Promise<string> {
    if (this.xmpp) {
      const groupJid = `${groupName}@conference.${domain}`;
      const fullGroupJid = `${groupJid}/${nickname}`;

      try {
        const presence = xml(
          'presence',
          { to: fullGroupJid },
          xml('x', { xmlns: 'http://jabber.org/protocol/muc' })
        );

        await this.xmpp.send(presence);
        console.log(`✅ Creando y uniendo al grupo: ${groupJid} como ${nickname}`);

        const iq = xml(
          'iq',
          { type: 'set', to: groupJid, id: 'create-group-config' },
          xml(
            'query',
            { xmlns: 'http://jabber.org/protocol/muc#owner' },
            xml('x', { xmlns: 'jabber:x:data', type: 'submit' },
              xml('field', { var: 'FORM_TYPE', type: 'hidden' },
                xml('value', {}, 'http://jabber.org/protocol/muc#roomconfig')
              ),
              xml('field', { var: 'muc#roomconfig_persistentroom' },
                xml('value', {}, '1')
              ),
              xml('field', { var: 'muc#roomconfig_roomname' },
                xml('value', {}, groupName)
              ),
              xml('field', { var: 'muc#roomconfig_publicroom' },
                xml('value', {}, '0')
              )
            )
          )
        );

        const response = await this.xmpp.sendReceive(iq);
        const resGroupJid = response.attrs.from.split('/')[0];
        console.log(`✅ Grupo ${groupName} configurado como privado con éxito: ${resGroupJid}`);
        return resGroupJid;
      } catch (error) {
        console.error('Error al crear el grupo:', error);
        return Promise.reject(error);
      }
    } else {
      console.error('XMPP client is not connected');
      return Promise.reject('XMPP client is not connected');
    }
  }

  async deleteAccount(): Promise<void> {
    if (this.xmpp) {
      try {
        const iq = xml(
          'iq',
          { type: 'set', id: 'unregister1' },
          xml(
            'query',
            { xmlns: 'jabber:iq:register' },
            xml('remove')
          )
        );
  
        const response = await this.xmpp.sendReceive(iq);
        console.log('✅ Account deletion response:', response.toString());
  
        this.disconnect();
        console.log('🚫 Account has been deleted and disconnected.');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    } else {
      console.error('XMPP client is not connected');
    }
  }

}

export default new XMPPService();

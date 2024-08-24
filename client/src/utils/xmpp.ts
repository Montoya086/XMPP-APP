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
  // Singleton instance
  private xmpp: Client | null = null;

  /**
   * Connects to the XMPP server
   * Requires the user to be disconnected
   * Logs the error if any
   * Logs the success message if the user is connected
   * @param service 
   * @param domain 
   * @param resource 
   * @param username 
   * @param password 
   * @returns
   * @example
   * connect({ service, domain, resource, username, password });
   */
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

  /**
   * Disconnects the user from the XMPP server
   * Requires the user to be connected
   * Logs the error if any
   * @example
   * disconnect();
   */
  disconnect(): void {
    if (this.xmpp) {
      this.xmpp.removeAllListeners('stanza');
      this.xmpp.stop().catch(console.error);
      this.xmpp = null;
    }
  }

  /**
   * Listens for connection open events
   * Requires the user to be connected
   * Logs the error if any
   * Logs the error if the user is not connected
   * @param callback 
   * @example
   * listenForConnectionOpen(() => {
   */
  listenForConnectionOpen(callback: () => void): void {
    if (this.xmpp) {
      this.xmpp.on('online', () => {
        callback();
      });
    } else {
      console.error('XMPP client is not connected');
    }
  }

  /**
   * Removes the listener for stanzas
   * Requires the user to be connected
   * @example
   * removeStanzaListener();
   */
  removeStanzaListener(): void {
    if (this.xmpp) {
      this.xmpp.removeAllListeners('stanza');
    }
  }

  /**
   * Obtains the XMPP client of the singleton
   * @returns the XMPP client or null if the user is not connected
   * @example
   * getXMPP();
   */
  getXMPP(): Client | null {
    return this.xmpp;
  }

  /**
   * Sends a message to a user
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the message is sent
   * Logs the error if the user is not connected
   * @param to 
   * @param message 
   * @param chatType 
   * @returns
   * @example
   * sendMessage('to', 'message', 'chatType');
   */
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

  /**
   * Listens for messages
   * Requires the user to be connected
   * Logs the error if any
   * Logs the message if obtained
   * Logs the error if the user is not connected
   * @param callback 
   * @returns
   * @example
   * listenForMessages((from, message, type, room) => {
   */
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

  /**
   * Listens for connection events
   * Requires the user to be connected
   * Logs the error if any
   * Logs the connection event if obtained
   * Logs the error if the user is not connected
   * @param callback 
   * @returns
   * @example
   * listenForConnection(() => {
   */
  listenForConnection(callback: () => void): void {
    if (this.xmpp) {
      this.xmpp.on('online', async () => {
        callback();
      });
    } else {
      console.error('XMPP client is not connected');
    }
  }

  /**
   * Listens for presence updates
   * Requires the user to be connected
   * Logs the error if any
   * Logs the presence update if obtained
   * Logs the error if the user is not connected
   * @param callback 
   * @returns
   * @example
   * listenForPresenceUpdates((status, from, statusMessage) => {
   */
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

  /**
   * Listens for subscription requests
   * Requires the user to be connected
   * Logs the error if any
   * Logs the subscription request if obtained
   * Logs the error if the user is not connected
   * @param callback 
   * @returns
   * @example
   * listenForSubscriptionRequests((from) => {
   */
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

  /**
   * Listens for file messages
   * Requires the user to be connected
   * Logs the error if any
   * Logs the file message if obtained
   * Logs the error if the user is not connected
   * @param callback 
   * @returns
   * @example
   * listenForFileMessages((from, message) => {
   */
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

  /**
   * Listens for group chat invitations
   * Requires the user to be connected
   * Logs the error if any
   * Logs the group chat invitation if obtained
   * Logs the error if the user is not connected
   * @param callback 
   * @returns
   * @example
   * listenForGroupChatInvitations((from, roomJid) => {
   */
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

  /**
   * Registers a new user
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the user is registered
   * Logs the error if the user is not connected
   * @param jid 
   * @param password 
   * @returns
   * @example
   * registerUser('jid', 'password');
   */
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

  /**
   * Registers a new user and reconnects with the new user
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the user is registered and reconnected
   * Logs the error if the user is not connected
   * @param rootConfig 
   * @param newUserConfig 
   * @returns Success or error message
   */
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

  /**
   * Gets the contacts of the user
   * Requires the user to be connected
   * Logs the error if any
   * Logs the contacts if obtained
   * Logs the error if the user is not connected
   * @returns an array of objects with the contacts of the user or an empty array if the user is not connected
   * @example
   * getContacts();
   */
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

  /**
   * Accepts a contact request
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the contact request is accepted
   * Logs the error if the user is not connected
   * @param contactJid 
   * @returns true if the request is sent, false if the user is not connected
   * @example
   * acceptContactRequest('contactJid');
   */
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

  /**
   * Accepts a contact request
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the contact request is accepted
   * Logs the error if the user is not connected
   * @param status 
   * @param statusMessage 
   * @returns
   * @example
   * acceptContactRequest('status', 'statusMessage');
   */
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

  /**
   * Unblocks the presence of a user
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the user is unblocked
   * Logs the error if the user is not connected
   * @param from 
   * @param flag 
   * @returns
   * @example
   * unblockPresence('from', true);
   */
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

  /**
   * Sends a file to a user
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the file is sent
   * Logs the error if the user is not connected
   * @param to 
   * @param file 
   * @returns 
   * @example
   * sendFile('to', { type: 'type', name: 'name', base64: 'base64' });
   */
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

  /**
   * Obtains the name of a group chat
   * Requires the user to be connected
   * Logs the error if any
   * Logs the group name if obtained
   * Logs the error if the user is not connected
   * @param groupJid 
   * @returns group name or null
   * @example
   * getGroupName('groupJid');
   */
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

  /**
   * Accepts a group chat invitation
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the user joins the group chat
   * Logs the error if the user is not connected
   * @param roomJid The JID of the group chat
   * @param nickname The nickname of the user in the group chat
   * @returns
   * @example
   * acceptGroupChatInvitation('roomJid', 'nickname');
   */
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

  /**
   * Creates a group chat
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the group chat is created
   * Logs the error if the user is not connected
   * @param groupName 
   * @param nickname 
   * @param domain 
   * @returns 
   * @example
   * createGroup('groupName', 'nickname', 'domain');
   */
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
        console.log(`✅ Creating group: ${groupJid} as ${nickname}`);

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
        console.log(`✅ Group ${groupName} config success: ${resGroupJid}`);
        return resGroupJid;
      } catch (error) {
        console.error('Error creationg group:', error);
        return Promise.reject(error);
      }
    } else {
      console.error('XMPP client is not connected');
      return Promise.reject('XMPP client is not connected');
    }
  }

  /**
   * Sends an invitation to a user to join a group chat
   * Requires the user to be connected
   * Logs the error if any
   * Logs the success message if the invitation is sent
   * Logs the error if the user is not connected
   * @param groupJid 
   * @param inviteeJid 
   * @param reason 
   * @returns
   * @example
   * sendGroupInvitation('groupJid', 'inviteeJid', 'reason');
   */
  async sendGroupInvitation(groupJid: string, inviteeJid: string, reason?: string): Promise<void> {
    if (this.xmpp) {
      try {
        const invitation = xml(
          'message',
          { to: groupJid },
          xml('x', { xmlns: 'http://jabber.org/protocol/muc#user' },
            xml('invite', { to: inviteeJid },
              xml('reason', {}, reason || 'Group invitation')
            )
          )
        );

        await this.xmpp.send(invitation);
        console.log(`📨 Invitation sent ${inviteeJid} to join group ${groupJid}`);
      } catch (error) {
        console.error('Error sending invitation:', error);
      }
    } else {
      console.error('XMPP client is not connected');
    }
  }

  /**
   * Obtains the participants of a group chat
   * Requires the user to be connected
   * Logs the error if any
   * Logs the participants if obtained
   * Logs the error if the user is not connected
   * @param groupJid The JID of the group chat
   * @returns The participants of the group chat
   * @example
   * const participants = await getGroupParticipants('groupJid');
   */
  async getGroupParticipants(groupJid: string): Promise<{ jid: string; name: string }[]> {
    if (this.xmpp) {
      try {
        const iq = xml(
          'iq',
          { type: 'get', to: groupJid, id: 'get-group-participants' },
          xml('query', { xmlns: 'http://jabber.org/protocol/disco#items' })
        );

        const response = await this.xmpp.sendReceive(iq);
        console.log(`📥 Participants of group ${groupJid}: ${response.toString()}`);

        const query = response.getChild('query');
        if (query) {
          const participants = query.getChildren('item').map((item: any) => ({
            jid: item.attrs.jid,
            name: item.attrs.name || item.attrs.jid.split('/')[1],
          }));
          return participants;
        }

        return [];
      } catch (error) {
        console.error('Error obtaining participants: ', error);
        return [];
      }
    } else {
      console.error('XMPP client is not connected');
      return [];
    }
  }

  /*
  * Deletes the account from the XM
  * Requires the user to be connected
  * Disconnects the user after the account is deleted
  * Logs the error if any
  * Logs the success message if the account is deleted
  * Logs the success message if the user is disconnected
  * Logs the error if the user is not connected
  */
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

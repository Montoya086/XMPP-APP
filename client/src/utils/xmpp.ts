import { client, xml, Client } from '@xmpp/client';
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
  
          const message = xml(
            'message',
            { type: 'chat', to: 'mon21552@alumchat.lol' },
            xml('body', {}, 'hello hello')
          );
          await this.xmpp!.send(message);
          this.disconnect();
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
  }
  
  export default new XMPPService();
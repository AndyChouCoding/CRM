import { createServer, Model, Response } from 'miragejs';
import { userFactory, ticketFactory } from './factories';

// 定義資料屬性，與 Factory 保持一致
interface UserAttrs {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'agent' | 'manager';
}
interface TicketAttrs {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'closed';
  createdAt: string;
}
interface MessageAttrs {
  id: string;
  content: string;
  ticketId: string;
  timestamp: string;
  platform: 'line' | 'fb';
}

export function makeServer() {
  return createServer({
    models: {
      user: Model.extend<Partial<UserAttrs>>({}),
      ticket: Model.extend<Partial<TicketAttrs>>({}),
      message: Model.extend<Partial<MessageAttrs>>({}),
    },
    factories: {
      user: userFactory,
      ticket: ticketFactory,
    },
    seeds(server) {
      server.db.loadData({
        users: [
          { id: 'manager1', name: 'Alice Manager', username: 'mgr_alice', password: 'password', role: 'manager' },
          { id: 'manager2', name: 'Bob Manager',   username: 'mgr_bob',   password: 'password', role: 'manager' }
        ],
        tickets: server.schema.db.tickets, // keep factories for tickets
      });
      // create additional agents via factory
      server.createList('user', 5, { role: 'agent' });
      server.createList('ticket', 20);
    },
    routes() {
      this.namespace = 'api';

      // Auth routes using low-level db
      this.post('/auth/login', (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);
        const user = schema.db.users.findBy({ username, password });
        if (!user) {
          return new Response(401, {}, { error: 'Invalid credentials' });
        }
        return {
          token: 'mock-jwt-token',
          user: { id: user.id, name: user.name, username: user.username, role: user.role },
        };
      });

      this.get('/auth/me', (schema, request) => {
        const auth = request.requestHeaders['Authorization'];
        if (auth !== 'Bearer mock-jwt-token') {
          return new Response(401, {}, { error: 'Not authenticated' });
        }
        const current = schema.db.users.findBy({ username: 'mgr_alice' });
        return { user: { id: current.id, name: current.name, role: current.role } };
      });

      // ...其他 Mock Endpoints...
    }
  });
}
    
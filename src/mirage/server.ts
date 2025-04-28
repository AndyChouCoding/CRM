import { createServer, Model, Response } from "miragejs";
import { userFactory, ticketFactory } from "./factories";

// 定義資料屬性，與 Factory 保持一致
interface UserAttrs {
  id: string;
  name: string;
  username: string;
  password: string;
  role: "agent" | "manager";
}
interface CustomerAttrs {
  id: string;
  name: string;
  agentId: string; // 負責客服
}
interface TicketAttrs {
  id: string;
  subject: string;
  status: "open" | "pending" | "closed";
  createdAt: string;
  customerId: string;
  agentId: string;
}
interface MessageAttrs {
  id: string;
  content: string;
  ticketId: string;
  timestamp: string;
  platform: "line" | "fb";
}

export function makeServer() {
  return createServer({
    models: {
      user: Model.extend<Partial<UserAttrs>>({}),
      customer: Model.extend<Partial<CustomerAttrs>>({}),
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
          {
            id: "manager0",
            name: "Manager",
            username: "manager",
            password: "123456",
            role: "manager",
          },
          {
            id: "manager1",
            name: "Alice Manager",
            username: "mgr_alice",
            password: "123456",
            role: "manager",
          },
          {
            id: "manager2",
            name: "Bobby Manager",
            username: "mgr_bobby",
            password: "123456",
            role: "manager",
          },
          {
            id: "agent0",
            name: "Agent",
            username: "agent",
            password: "123456",
            role: "agent",
          },
          {
            id: "agent1",
            name: "Bob Agent",
            username: "agt_bob",
            password: "123456",
            role: "agent",
          },
          {
            id: "agent2",
            name: "Bella Agent",
            username: "agt_bella",
            password: "123456",
            role: "agent",
          },
        ],
        tickets: server.schema.db.tickets, // keep factories for tickets
      });
      server.db.customers.insert([
        { id: "cust1", name: "John Doe", agentId: "agent0" },
        { id: "cust2", name: "Jane Smith", agentId: "agent0" },
        { id: "cust3", name: "Tom Cat", agentId: "agent1" },
        { id: "cust4", name: "Johnson", agentId: "agent1" },
        { id: "cust5", name: "John Cena", agentId: "agent1" },
        { id: "cust6", name: "Bella Wang", agentId: "agent2" },
        { id: "cust7", name: "Ella Chen", agentId: "agent2" },
        { id: "cust8", name: "The Rock", agentId: "agent2" },
      ]);
      // 建立 Tickets：每個 customer 一張 ticket
      const now = new Date().toISOString();
      server.db.tickets.insert([
        {
          id: "t1",
          subject: "問題A",
          status: "pending",
          createdAt: now,
          customerId: "cust1",
          agentId: "agent0",
        },
        {
          id: "t2",
          subject: "問題B",
          status: "open",
          createdAt: now,
          customerId: "cust2",
          agentId: "agent0",
        },
        {
          id: "t3",
          subject: "問題C",
          status: "closed",
          createdAt: now,
          customerId: "cust3",
          agentId: "agent1",
        },
      ]);
      // 可用 factory 建更多 tickets
      server.createList("ticket", 5);
    },
    routes() {
      this.namespace = "api";

      // 新增：根據 queryParams.role 回傳對應的 users
      this.get("/users", (schema, request) => {
        const role = request.queryParams.role;
        return { users: schema.db.users.where({ role }) };
      });

      // 取得該 Agent 負責的客戶清單
      this.get("/customers", (schema, req) => ({
        customers: schema.db.customers.where({
          agentId: req.queryParams.agentId,
        }),
      }));

      // Auth routes using low-level db
      this.post("/auth/login", (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);
        const user = schema.db.users.findBy({ username, password });
        if (!user) {
          return new Response(401, {}, { error: "Invalid credentials" });
        }
        return {
          token: "mock-jwt-token",
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role,
          },
        };
      });

      this.get("/auth/me", (schema, request) => {
        const auth = request.requestHeaders["Authorization"];
        if (auth !== "Bearer mock-jwt-token") {
          return new Response(401, {}, { error: "Not authenticated" });
        }
        const current = schema.db.users.findBy({ username: "mgr_alice" });
        return {
          user: { id: current.id, name: current.name, role: current.role },
        };
      });

      // Ticket endpoints
      this.get("/tickets/:id", (schema, request) => {
        const t = schema.db.tickets.find(request.params.id);
        return { status: t.status };
      });
      this.get("/tickets", (schema, request) => {
        const agentId = request.queryParams.agentId;
        return { tickets: schema.db.tickets.where({ agentId }) };
      });

      // Message endpoints
      this.get("/tickets/:id/messages", (schema, request) => {
        return {
          messages: schema.db.messages.where({ ticketId: request.params.id }),
        };
      });
      this.post("/tickets/:id/messages", (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.db.messages.insert({
          ...attrs,
          id: String(Date.now()),
          ticketId: request.params.id,
        });
      });
      // ...其他 Mock Endpoints...
    },
  });
}

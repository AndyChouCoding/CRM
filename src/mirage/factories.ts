import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

// 定義使用者屬性介面
interface UserAttrs {
  name: string;
  username: string;
  password: string;
  role: 'agent' | 'manager';
}
const roles: UserAttrs['role'][] = ['agent', 'manager'];

export const userFactory = Factory.extend<UserAttrs>({
  name() {
    return faker.person.fullName();
  },
  username() {
    return faker.internet.username().toLowerCase();
  },
  password() {
    return 'password';
  },
  role() {
    return roles[Math.floor(Math.random() * roles.length)];
  },
});

// 定義工單屬性介面
type TicketStatus = 'open' | 'pending' | 'closed';
interface TicketAttrs {
  subject: string;
  status: TicketStatus;
  createdAt: string;
}
const statuses: TicketAttrs['status'][] = ['open', 'pending', 'closed'];

export const ticketFactory = Factory.extend<TicketAttrs>({
  subject() {
    return faker.lorem.sentence();
  },
  status() {
    return statuses[Math.floor(Math.random() * statuses.length)];
  },
  createdAt() {
    return faker.date.past().toISOString();
  },
});
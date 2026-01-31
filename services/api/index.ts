// services/api/index.ts
// Central API Export

export { default as authApi } from './auth.api';
export { default as dashboardApi } from './dashboard.api';
export { default as goalsApi } from './goals.api';
export { default as messagesApi } from './messages.api';
export { default as packagesApi } from './packages.api';
export { default as scopesApi } from './scopes.api';
export { default as subscriptionsApi } from './subscriptions.api';

// Export types as well
export * from './dashboard.api';


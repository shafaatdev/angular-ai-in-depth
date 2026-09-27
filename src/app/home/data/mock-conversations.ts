import { Conversation } from '../models/conversation.model';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'angular-components',
    title: 'How to create component in Angular',
    messages: [
      {
        id: 'components-user-1',
        role: 'user',
        content: 'How do I create a component in Angular?'
      },
      {
        id: 'components-assistant-1',
        role: 'assistant',
        content: 'Use the Angular CLI to generate a component with its own TypeScript, template, and styles:\n\nng generate component my-component\n\nIn a standalone Angular app, import the component where it is used. The CLI also creates a focused test file alongside it.'
      },
      {
        id: 'components-user-2',
        role: 'user',
        content: 'What does standalone mean?'
      },
      {
        id: 'components-assistant-2',
        role: 'assistant',
        content: 'A standalone component declares its own template dependencies and can be imported directly, without first being declared in an NgModule.'
      }
    ]
  },
  {
    id: 'angular-routing',
    title: 'Angular routing how it works',
    messages: [
      {
        id: 'routing-user-1',
        role: 'user',
        content: 'How does Angular routing work?'
      },
      {
        id: 'routing-assistant-1',
        role: 'assistant',
        content: 'Angular Router maps URL paths to components. Define routes in a Routes array, provide them with provideRouter, and place a router-outlet where the active route should render.'
      },
      {
        id: 'routing-user-2',
        role: 'user',
        content: 'Can a route load only when it is needed?'
      },
      {
        id: 'routing-assistant-2',
        role: 'assistant',
        content: 'Yes. Use loadComponent or loadChildren with a dynamic import to split a feature into a separate bundle and load it on navigation.'
      }
    ]
  },
  {
    id: 'angular-services',
    title: 'What is a service in Angular',
    messages: [
      {
        id: 'services-user-1',
        role: 'user',
        content: 'What is a service in Angular?'
      },
      {
        id: 'services-assistant-1',
        role: 'assistant',
        content: 'A service is a class for reusable logic or shared data. Mark it with @Injectable and provide it at the root or a narrower injector scope, then retrieve it with inject().' 
      },
      {
        id: 'services-user-2',
        role: 'user',
        content: 'How do I use one in a component?'
      },
      {
        id: 'services-assistant-2',
        role: 'assistant',
        content: 'Call inject(MyService) in the component class and use the returned instance for the service responsibilities. This keeps that logic out of the view.'
      }
    ]
  },
  {
    id: 'angular-signals',
    title: 'Getting started with signals',
    messages: [
      {
        id: 'signals-user-1',
        role: 'user',
        content: 'How do I get started with Angular signals?'
      },
      {
        id: 'signals-assistant-1',
        role: 'assistant',
        content: 'Create a signal with signal(initialValue), read it by calling it, and update it with set or update. Use computed for values derived from other signals.'
      },
      {
        id: 'signals-user-2',
        role: 'user',
        content: 'When should I use computed?'
      },
      {
        id: 'signals-assistant-2',
        role: 'assistant',
        content: 'Use computed when a value can be derived from existing state. Angular tracks its dependencies and recalculates it when one of them changes.'
      }
    ]
  }
];
import { Conversation } from './models/conversation.model';

export const conversations: Conversation[] = [
  {
    id: 'angular-components',
    title: 'How to create component in Angular',
    promptId: 'angular-tutor',
    messages: [
      {
        id: 'components-user-1',
        role: 'user',
        content: 'How do I create a component in Angular?'
      },
      {
        id: 'components-assistant-1',
        role: 'assistant',
        content: 'Use the Angular CLI to generate a component with its own TypeScript, template, and styles.'
      }
    ]
  },
  {
    id: 'angular-routing',
    title: 'Angular routing how it works',
    promptId: 'angular-tutor',
    messages: [
      {
        id: 'routing-user-1',
        role: 'user',
        content: 'How does Angular routing work?'
      },
      {
        id: 'routing-assistant-1',
        role: 'assistant',
        content: 'Angular Router maps URL paths to components.'
      }
    ]
  },
  {
    id: 'angular-services',
    title: 'What is a service in Angular',
    promptId: 'angular-tutor',
    messages: [
      {
        id: 'services-user-1',
        role: 'user',
        content: 'What is a service in Angular?'
      },
      {
        id: 'services-assistant-1',
        role: 'assistant',
        content: 'An Angular service provides reusable logic or shared data.'
      }
    ]
  }
];
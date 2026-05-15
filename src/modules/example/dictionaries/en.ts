import type { ExampleDictionary } from './es';

export const exampleDictEn: ExampleDictionary = {
  title: 'Examples',
  description:
    'Example module. Shows the full pattern: data layer, form, i18n, UI states. Delete when starting real modules.',
  list: {
    loading: 'Loading examples...',
    empty: 'No examples to show.',
    errorLoading: 'Could not load examples.',
    retry: 'Retry'
  },
  form: {
    title: 'Create new example',
    fields: {
      title: 'Title',
      body: 'Body'
    },
    actions: {
      submit: 'Create',
      submitting: 'Creating...'
    },
    errors: {
      titleRequired: 'Title is required',
      titleTooLong: 'Max 100 characters',
      bodyRequired: 'Body is required',
      bodyTooLong: 'Max 500 characters',
      serverError: 'Could not create example. Try again.'
    },
    success: 'Example created successfully'
  }
};

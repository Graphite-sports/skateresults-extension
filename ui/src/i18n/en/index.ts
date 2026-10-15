import type { BaseTranslation } from '../i18n-types';

// Base locale. After changing keys or parameters run `npm run i18n` to regenerate the types.
const en = {
  Mockup: 'Mockup',
  Intro: 'Link this event to an event on Skate Results to bring in its age groups, competitions and results.',
  Settings: 'Settings',
  NotLinked: 'This event is not linked to a Skate Results event yet.',
  LinkEvent: 'Link a Skate Results event',
  LinkedEvent: 'Linked event',
  Unlink: 'Unlink',
  SearchEvents: 'Search Skate Results events',
  SearchPlaceholder: 'Name or city',
  EventCount: '{count:number} event{{s}}',
  NoEventsFound: 'No event matches "{query:string}"',
  Loading: 'Loading from Skate Results…',
  LoadFailed: 'Skate Results could not be reached.',
  AgeGroups: 'Age groups',
  CompetitionCount: '{count:number} competition{{s}}',
  NoAgeGroups: 'Skate Results has no age groups for this event yet.',
  Gender: {
    male: 'Men',
    female: 'Women',
    mixed: 'Mixed',
  },
  MappingPreview: 'Mapping preview',
  MappingHint: 'How the classes of this event would line up with the age groups on Skate Results. Nothing is synchronized yet.',
  EngineClass: 'Class in Graphite',
  SkateResultsAgeGroup: 'Age group on Skate Results',
  NoMatch: 'No match',
  NoClasses: 'This event has no classes yet.',
  Matched: '{matched:number} of {total:number} classes matched',
  ApiKey: 'API key',
  ApiKeyHint:
    'Only public Skate Results events are listed. Support for API keys, to reach your own non-public events and to publish results, is coming.',
} satisfies BaseTranslation;

export default en;

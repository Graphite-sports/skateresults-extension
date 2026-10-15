import type { Translation } from '../i18n-types';

const de = {
  Intro: 'Verknüpfe diese Veranstaltung mit einer Veranstaltung auf Skate Results, um deren Altersklassen, Wettbewerbe und Ergebnisse zu übernehmen.',
  Settings: 'Einstellungen',
  NotLinked: 'Diese Veranstaltung ist noch mit keiner Skate-Results-Veranstaltung verknüpft.',
  LinkEvent: 'Skate-Results-Veranstaltung verknüpfen',
  LinkedEvent: 'Verknüpfte Veranstaltung',
  Unlink: 'Verknüpfung lösen',
  SearchEvents: 'Veranstaltungen auf Skate Results suchen',
  SearchPlaceholder: 'Name oder Ort',
  EventCount: '{count} Veranstaltung{{en}}',
  NoEventsFound: 'Keine Veranstaltung passt zu "{query}"',
  Loading: 'Lade von Skate Results…',
  LoadFailed: 'Skate Results ist nicht erreichbar.',
  AgeGroups: 'Altersklassen',
  CompetitionCount: '{count} Wettbewerb{{e}}',
  NoAgeGroups: 'Skate Results hat für diese Veranstaltung noch keine Altersklassen.',
  Gender: {
    male: 'Herren',
    female: 'Damen',
    mixed: 'Gemischt',
  },
  MappingPreview: 'Zuordnungsvorschau',
  MappingHint:
    'So würden die Klassen dieser Veranstaltung den Altersklassen auf Skate Results zugeordnet. Noch wird nichts synchronisiert.',
  EngineClass: 'Klasse in Graphite',
  SkateResultsAgeGroup: 'Altersklasse auf Skate Results',
  NoMatch: 'Keine Zuordnung',
  NoClasses: 'Diese Veranstaltung hat noch keine Klassen.',
  Matched: '{matched} von {total} Klassen zugeordnet',
  ApiKey: 'API-Schlüssel',
  ApiKeyHint:
    'Es werden nur öffentliche Veranstaltungen von Skate Results angezeigt. Unterstützung für API-Schlüssel, um eigene nicht öffentliche Veranstaltungen zu erreichen und Ergebnisse zu veröffentlichen, folgt.',
} satisfies Translation;

export default de;

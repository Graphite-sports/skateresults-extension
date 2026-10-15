/**
 * Entry point of the extension, exposed as `./manifest` in rsbuild.config.ts.
 * Import engine APIs only from `@graphite-sports/sdk`; the engine provides it at runtime.
 */
import { useQuery } from '@tanstack/react-query';
import {
  AppButton,
  AppInput,
  extensionRouteBuilder,
  getClassesByEventQO,
  useEngineLocale,
  type ClassDAO,
  type ExtensionManifest,
  type ExtensionPageContribution,
  type ExtensionSidebarProps,
  type PathParams,
} from '@graphite-sports/sdk';
import { useState, type ReactNode } from 'react';
import { useLL } from './i18n/useLL';
import { ageGroupsQO, eventQO, eventsQO, useLinkedEvent, type AgeGroup, type SkateResultsEvent } from './skateResults';

const settingsPath = '/workspace/:workspaceId/event/:eventId/ext/skateresults';

const settingsPage: ExtensionPageContribution<typeof settingsPath> = { path: settingsPath, PageComponent: SettingsPage };

const buildExtensionRoute = extensionRouteBuilder(settingsPage);

function SkateResultsSidebar({ workspaceId, eventId }: ExtensionSidebarProps) {
  const LL = useLL();
  const [linked] = useLinkedEvent(workspaceId, eventId);
  const settingsRoute = buildExtensionRoute(settingsPath, { workspaceId, eventId });
  return (
    <div className="flex flex-col gap-3 p-2">
      <Header />
      {linked ? (
        <>
          <LinkedEventCard id={linked} />
          <AgeGroupList id={linked} />
          <AppButton href={settingsRoute}>{LL.Settings()}</AppButton>
        </>
      ) : (
        <>
          <p className="text-sm">{LL.NotLinked()}</p>
          <AppButton type="primary" href={settingsRoute}>
            {LL.LinkEvent()}
          </AppButton>
        </>
      )}
    </div>
  );
}

function SettingsPage(params: PathParams<typeof settingsPath>) {
  const LL = useLL();
  // The engine's router passes the ids as plain numbers.
  const { workspaceId, eventId } = params as ExtensionSidebarProps;
  const [linked, setLinked] = useLinkedEvent(workspaceId, eventId);
  return (
    <div className="flex flex-col gap-4 p-4 max-w-5xl">
      <Header />
      <p className="text-sm">{LL.Intro()}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <Card title={LL.SearchEvents()}>
          <EventPicker linked={linked} onPick={setLinked} />
        </Card>
        <Card title={LL.LinkedEvent()}>
          {linked ? (
            <div className="flex flex-col gap-3">
              <LinkedEventCard id={linked} />
              <AgeGroupList id={linked} />
              <AppButton type="danger" onClick={() => setLinked(null)}>
                {LL.Unlink()}
              </AppButton>
            </div>
          ) : (
            <p className="text-sm">{LL.NotLinked()}</p>
          )}
        </Card>
      </div>
      {linked && (
        <Card title={LL.MappingPreview()}>
          <MappingPreview workspaceId={workspaceId} eventId={eventId} linked={linked} />
        </Card>
      )}
      <Card title={LL.ApiKey()}>
        <p className="text-sm">{LL.ApiKeyHint()}</p>
      </Card>
    </div>
  );
}

function EventPicker({ linked, onPick }: { linked: string | null; onPick: (id: string) => void }) {
  const LL = useLL();
  const [search, setSearch] = useState('');
  const { data: events, isPending, isError } = useQuery(eventsQO());
  if (isPending || isError) return <Status isError={isError} />;
  const query = normalize(search);
  const matching = events.filter((event) => normalize(`${event.name} ${event.address?.city ?? ''}`).includes(query));
  return (
    <div className="flex flex-col gap-2">
      <AppInput label={LL.SearchPlaceholder()} value={search} onChange={(e) => setSearch(e.target.value)} />
      <p className="text-xs">{matching.length ? LL.EventCount({ count: matching.length }) : LL.NoEventsFound({ query: search })}</p>
      <ul className="flex flex-col gap-1 max-h-96 overflow-y-auto">
        {matching.map((event) => (
          <li key={event.id}>
            <button
              className={`w-full text-left rounded px-2 py-1 cursor-pointer ${event.id === linked ? 'bg-primary text-text-on-primary' : 'hover:bg-layer-3'}`}
              onClick={() => onPick(event.id)}
            >
              <EventSummary event={event} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MappingPreview({ workspaceId, eventId, linked }: ExtensionSidebarProps & { linked: string }) {
  const LL = useLL();
  const { data: classes } = useQuery(getClassesByEventQO(workspaceId, eventId));
  const { data: ageGroups } = useQuery(ageGroupsQO(linked));
  if (!classes || !ageGroups) return <Status isError={false} />;
  if (!classes.length) return <p className="text-sm">{LL.NoClasses()}</p>;
  const rows = classes.map(({ class: clazz }) => ({ clazz, ageGroup: matchAgeGroup(clazz, ageGroups) }));
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm">{LL.MappingHint()}</p>
      <p className="text-xs">{LL.Matched({ matched: rows.filter((row) => row.ageGroup).length, total: rows.length })}</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-1">{LL.EngineClass()}</th>
            <th className="p-1">{LL.SkateResultsAgeGroup()}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ clazz, ageGroup }) => (
            <tr key={clazz.id} className="border-t border-layer-4">
              <td className="p-1">{clazz.name}</td>
              <td className="p-1">
                {ageGroup ? (
                  <span className="text-text-green">
                    {ageGroup.name} · {LL.CompetitionCount({ count: ageGroup.competitions.length })}
                  </span>
                ) : (
                  <span className="text-text-red">{LL.NoMatch()}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LinkedEventCard({ id }: { id: string }) {
  const { data: event, isPending, isError } = useQuery(eventQO(id));
  if (isPending || isError) return <Status isError={isError} />;
  return (
    <div className="rounded bg-layer-3 p-2">
      <EventSummary event={event} />
    </div>
  );
}

function AgeGroupList({ id }: { id: string }) {
  const LL = useLL();
  const { data: ageGroups, isPending, isError } = useQuery(ageGroupsQO(id));
  if (isPending || isError) return <Status isError={isError} />;
  if (!ageGroups.length) return <p className="text-sm">{LL.NoAgeGroups()}</p>;
  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-semibold">{LL.AgeGroups()}</h3>
      <ul className="flex flex-col gap-1 text-sm">
        {ageGroups.map((ageGroup) => (
          <li key={ageGroup.id} className="flex justify-between gap-2">
            <span>
              {ageGroup.name} <span className="text-xs">({LL.Gender[ageGroup.gender ?? 'mixed']()})</span>
            </span>
            <span className="text-xs">{LL.CompetitionCount({ count: ageGroup.competitions.length })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EventSummary({ event }: { event: SkateResultsEvent }) {
  const locale = useEngineLocale();
  const date = (iso: string) => new Date(iso).toLocaleDateString(locale, { dateStyle: 'medium', timeZone: 'UTC' });
  const place = [event.address?.city, event.address?.country].filter(Boolean).join(', ');
  return (
    <div className="flex flex-col">
      <span className="font-semibold">{event.name}</span>
      <span className="text-xs">
        {event.dateBegin === event.dateEnd ? date(event.dateBegin) : `${date(event.dateBegin)} – ${date(event.dateEnd)}`}
        {place && ` · ${place}`}
      </span>
    </div>
  );
}

function Header() {
  const LL = useLL();
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-lg font-semibold">Skate Results</h2>
      <span className="rounded bg-warning px-2 text-xs">{LL.Mockup()}</span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2 rounded bg-layer-2 p-3">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Status({ isError }: { isError: boolean }) {
  const LL = useLL();
  return <p className={`text-sm ${isError ? 'text-text-red' : ''}`}>{isError ? LL.LoadFailed() : LL.Loading()}</p>;
}

/** Mock matching for the preview: same gender and one name contains the other. */
function matchAgeGroup(clazz: ClassDAO, ageGroups: AgeGroup[]) {
  const name = normalize(clazz.name);
  const gender = ({ 'male-only': 'male', 'female-only': 'female', 'all-genders': null } as const)[clazz.gender];
  const candidates = ageGroups.filter((ageGroup) => ageGroup.gender === gender);
  return (
    candidates.find((ageGroup) => normalize(ageGroup.name) === name) ??
    candidates.find((ageGroup) => normalize(ageGroup.name).includes(name) || name.includes(normalize(ageGroup.name)))
  );
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9äöüß]+/g, ' ').trim();
}

const icon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M3 21h18M5 21v-6h4v6M9 21V9h6v12M15 21v-9h4v9" />
  </svg>
);

export const manifest: ExtensionManifest = {
  id: 'skateresults',
  sidebars: [{ id: 'skateresults', name: { en: 'Skate Results', de: 'Skate Results' }, icon, SidebarComponent: SkateResultsSidebar }],
  pages: [settingsPage],
};

const cache = {};

export async function load(name) {
  if (cache[name]) return cache[name];
  try {
    const res = await fetch(`/data/${name}.json`);
    if (!res.ok) return def(name);
    const data = await res.json();
    cache[name] = data;
    return data;
  } catch { return def(name); }
}

export async function loadAll(...names) {
  return Promise.all(names.map(load));
}

function def(name) {
  const d = {
    site: { title: 'JH Rony', navigation: [], theme: { defaultMode: 'auto' }, footer: { text: '' }, homepage: {}, announcement: { visible: false }, analytics: { enabled: false } },
    profile: { name: '', bio: '', links: {}, researchInterests: [], skills: {}, visible: true },
    publications: [], projects: [], news: [], teaching: [],
    talks: [], awards: [], service: [], education: [], experience: [], gallery: []
  };
  return d[name] ?? [];
}

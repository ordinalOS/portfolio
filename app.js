// list-based markdown portfolio — no build step, static-hostable
import { marked } from 'https://cdn.jsdelivr.net/npm/marked@12/lib/marked.esm.js';

const view = document.getElementById('view');
let manifest = null;

async function getManifest() {
  if (!manifest) manifest = await (await fetch('projects.json')).json();
  return manifest;
}

// x/twitter embeds: markdown carries plain <blockquote class="twitter-tweet"> html;
// widgets.js is loaded once on demand and hydrates them into rich embeds (video, images)
function hydrateTweets(container) {
  const tweets = container.querySelectorAll('.twitter-tweet');
  if (!tweets.length) return;
  const dark = matchMedia('(prefers-color-scheme: dark)').matches;
  tweets.forEach((t) => {
    t.dataset.dnt = 'true';
    if (dark) t.dataset.theme = 'dark';
  });
  // official ready-queue pattern: callbacks queued on twttr._e run when widgets.js loads
  if (!window.twttr) {
    window.twttr = { _e: [], ready(f) { window.twttr._e.push(f); } };
    const s = document.createElement('script');
    s.id = 'twitter-wjs';
    s.src = 'https://platform.twitter.com/widgets.js';
    document.head.appendChild(s);
  }
  window.twttr.ready((t) => t.widgets.load(container));
}

// image syntax doubles as a rich-embed syntax:
//   ![demo](media/demo.mp4)                          -> <video>
//   ![title](https://www.youtube.com/watch?v=ID)     -> responsive youtube embed
marked.use({
  renderer: {
    image(href, _title, text) {
      if (/\.(mp4|webm|mov)$/i.test(href)) {
        return `<video controls playsinline preload="metadata" src="${href}">${text}</video>`;
      }
      const yt = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
      if (yt) {
        return `<div class="yt"><iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}" title="${text}" frameborder="0" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
      }
      const vm = href.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (vm) {
        return `<div class="yt"><iframe src="https://player.vimeo.com/video/${vm[1]}?dnt=1" title="${text}" frameborder="0" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
      }
      return `<img src="${href}" alt="${text}" loading="lazy">`;
    },
  },
});

// ambient background — a dimmed grid collage of all project media, built once
const BG_TILES = [
  'media/savage-1.jpg', 'media/nashville-1.jpg', 'media/zatoshi-market.png',
  'media/champagne-coast.jpg', 'media/purple-trade.png', 'media/savage-2.jpg',
  'media/nashville-2.jpg', 'media/rarecube-tv.png', 'media/ordinalos-boot.png',
  'media/savage-3.jpg', 'media/inscripedia-onchain.png', 'media/shegutta.jpg',
  'media/savage-4.jpg', 'media/nashville-3.jpg', 'media/bankhead.jpg',
  'media/savage-5.jpg', 'media/nashville-4.jpg', 'media/mecha.jpg',
  'media/doitalone.jpg', 'media/foolsgold.png', 'media/gitclaw-repo.png',
  'media/milhouse-repo.png', 'media/zord-repo.png', 'media/recursive-doom-repo.png',
];
function buildBackground() {
  if (document.getElementById('bg')) return;
  const bg = document.createElement('div');
  bg.id = 'bg';
  bg.setAttribute('aria-hidden', 'true');
  const count = Math.ceil((innerWidth / 220) * (innerHeight / 150)) + 12;
  for (let i = 0; i < count; i++) {
    const img = document.createElement('img');
    img.src = BG_TILES[i % BG_TILES.length];
    img.loading = 'lazy';
    img.alt = '';
    bg.appendChild(img);
  }
  document.body.prepend(bg);
}

function renderIndex(data) {
  document.title = 'ordinalOS — portfolio';
  const row = (p) => `
    <li>
      <span class="year">${p.year}</span>
      <span class="t">
        <a href="#/${p.slug}">${p.title}</a>
        <span class="d">${p.line} <span class="tags">· ${p.tags.join(' · ')}</span></span>
      </span>
    </li>`;
  const section = (label, items) =>
    items.length ? `<div class="section-label">${label}</div><ul class="projects">${items.map(row).join('')}</ul>` : '';
  const client = (c) => `
    <details class="client">
      <summary>
        <span class="cat">${c.cat}</span>
        <span class="cname">${c.name}</span>
        <span class="crole">${c.role}</span>
        <span class="cyear">${c.year}</span>
      </summary>
      <div class="cbody">
        <p>${c.desc}</p>
        ${c.items ? `<ul>${c.items.map((i) => `<li>${i}</li>`).join('')}</ul>` : ''}
      </div>
    </details>`;
  const clients = data.clients
    ? `<div class="section-label">clients & credits</div><div class="clients">${data.clients.map(client).join('')}</div>`
    : '';
  const body = data.eras
    ? data.eras.map((e) => section(e.label, data.projects.filter((p) => p.era === e.id))).join('')
    : section('selected work', data.projects.filter((p) => p.featured)) +
      section('more', data.projects.filter((p) => !p.featured));
  view.innerHTML = `
    <p class="intro">${data.intro}</p>
    ${clients}
    ${body}
  `;
  hydrateTweets(view);
}

async function renderProject(slug) {
  const data = await getManifest();
  const i = data.projects.findIndex((p) => p.slug === slug);
  if (i === -1) {
    view.innerHTML = `<p>404 — no such project. <a href="#/">index</a></p>`;
    return;
  }
  const p = data.projects[i];
  view.innerHTML = `<p class="loading">loading…</p>`;
  const md = await (await fetch(`projects/${p.slug}.md`)).text();
  document.title = `${p.title} — ordinalOS`;
  const prev = data.projects[i - 1];
  const next = data.projects[i + 1];
  view.innerHTML = `
    <p class="backline"><a href="#/">&larr; index</a></p>
    <div id="md">${marked.parse(md)}</div>
    <div class="prevnext">
      <span>${prev ? `<a href="#/${prev.slug}">&larr; ${prev.title}</a>` : ''}</span>
      <span>${next ? `<a href="#/${next.slug}">${next.title} &rarr;</a>` : ''}</span>
    </div>
  `;
  hydrateTweets(view);
  window.scrollTo(0, 0);
}

async function renderAbout() {
  document.title = 'about — ordinalOS';
  const md = await (await fetch('about.md')).text();
  view.innerHTML = `
    <p class="backline"><a href="#/">&larr; index</a></p>
    <div id="md">${marked.parse(md)}</div>
  `;
  hydrateTweets(view);
  window.scrollTo(0, 0);
}

async function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const data = await getManifest();
  buildBackground();
  if (!hash) renderIndex(data);
  else if (hash === 'about') renderAbout();
  else renderProject(hash);
}

window.addEventListener('hashchange', route);
route();

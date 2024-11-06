import { Template } from '../src';

declare global {
  interface Window {
    js_beautify: any;
    html_beautify: any;
    hljs: any;
  }
}

const sp = new URLSearchParams(location.search);
const reset = sp.has('reset');
const raw = sp.has('raw');

const defaultTemplate =
  (!reset && localStorage.getItem('template')) ||
  `{{! This is a comment }}
  {{# This is a
      comment #}}
  {{ comment }}
    This is a comment with variable {{ name }}
  {{ endcomment }}
<div>
  <h1>{{ name }}</h1>
  <p>Please visit <a href="{{ url }}">Github Repository</a></p>

  <ul>
    {{ for name in array | reverse }}
      <li>
        {{ if name | reverse | lower == "bob" }}
          ***
        {{ else }}
          {{ loop.index + 1 }} - {{ name | reverse | lower }}
        {{ endif }}
      </li>
    {{ endfor }}
  </ul>
  ---
  <ul>
    {{ for a b in nested }}
      <li>
      {{ a }} - {{ b }}
      </li>
    {{ endfor }}
  </ul>
  ---
  <ul>
    {{ for name in object }}
      <li>
        {{ if name == "Bob" }}
          ***
        {{ elif name == "Eve" }}
          ---
        {{ elif name | lower == "david" }}
          ...
        {{ else }}
          {{ loop.index }} - {{ name }}
        {{ endif }}
      </li>
    {{ endfor }}
  </ul>
  ---
  <ul>
    {{ for key name in object }}
      <li>
        {{ if name == "Bob" }}
          ***
        {{ elif name == "Eve" }}
          ---
        {{ elif name | lower == "david" }}
          ...
        {{ else }}
          {{ loop.index }} {{ key }} - {{ name }}
        {{ endif }}
      </li>
    {{ endfor }}
  </ul>
  ---
  <ul>
    {{ for name in empty }}
      <li>{{ name }}</li>
    {{ else }}
      <li>Empty array</li>
    {{ endfor }}
  </ul>
  <dl>
    <dt>Data Source:</dt>
    <dd>{{ info.source }}</dd>
    <dt>Version:</dt>
    <dd>{{ info.version }}</dd>
    <dt>Last Update Time:</dt>
    <dd>{{ info.lastUpdated }}</dd>
  </dl>
</div>
`;

const defaultData =
  (!reset && localStorage.getItem('data')) ||
  `{
  "name": "ijk",
  "url": "https://github.com/vvenv/ijk",
  "array": [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eve"
  ],
  "nested": [
    [
      "Alice",
      "Eve"
    ],
    [
      "Bob",
      "Charlie"
    ]
  ],
  "object": {
    "A": "Alice",
    "B": "Bob",
    "C": "Charlie",
    "D": "David",
    "E": "Eve"
  },
  "empty": [],
  "info": {
    "source": "Sample Data for Demonstration",
    "version": "1.0",
    "lastUpdated": "2024-10-27"
  }
}
`;

const templateEl = document.querySelector<HTMLTextAreaElement>('#template')!;
const dataEl = document.querySelector<HTMLTextAreaElement>('#data')!;
const codeEl = document.querySelector<HTMLElement>('#code > code')!;
const resultEl = document.querySelector<HTMLElement>('#result > code')!;
const previewEl = document.querySelector<HTMLDivElement>('#preview')!;
const performanceEl = document.querySelector<HTMLDivElement>('#performance')!;

function update() {
  try {
    if (!templateEl.value.trim()) {
      templateEl.value = defaultTemplate;
    }

    const template = templateEl.value.trim();
    localStorage.setItem('template', template);

    if (!dataEl.value.trim()) {
      dataEl.value = defaultData;
    }

    const data = dataEl.value.trim();
    localStorage.setItem('data', data);

    const parsedData = JSON.parse(data);

    const now = performance.now();

    const ijk = new Template({
      debug: true,
      stripComments: false,
    });

    const { __func, render } = ijk.compile(template);
    const result = render(parsedData);
    const time = Math.floor((performance.now() - now) * 1000) / 1000;

    codeEl.textContent = raw
      ? __func.toString()
      : window.js_beautify(__func.toString(), {
          indent_size: 2,
        });
    performanceEl.textContent = `${time}ms`;
    resultEl.textContent = raw
      ? result
      : window.html_beautify(result, {
          indent_size: 2,
        });
    previewEl.innerHTML = result;
  } catch (error: any) {
    console.log(error.stack);
    console.log(error.details);
  }

  delete codeEl.dataset.highlighted;
  delete resultEl.dataset.highlighted;
  window.hljs.highlightAll();
}

update();

templateEl.addEventListener('change', update);
dataEl.addEventListener('change', update);
codeEl.addEventListener('focus', (e) => {
  (e.currentTarget as HTMLTextAreaElement).select();
});
resultEl.addEventListener('focus', (e) => {
  (e.currentTarget as HTMLTextAreaElement).select();
});

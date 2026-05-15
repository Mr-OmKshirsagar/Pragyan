const fs = require('fs');
const path = require('path');

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  result.push(current.trim());
  return result;
}

function loadCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!lines.length) return [];

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });
}

function loadXlsx(filePath) {
  let xlsx;
  try {
    xlsx = require('xlsx');
  } catch (_error) {
    throw new Error('XLSX support requires installing the xlsx package. Run: npm install xlsx');
  }

  const workbook = xlsx.readFile(filePath);
  const firstSheet = workbook.SheetNames[0];
  if (!firstSheet) return [];

  return xlsx.utils.sheet_to_json(workbook.Sheets[firstSheet], {
    defval: '',
    raw: false,
  });
}

function loadTabularFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.csv') return loadCsv(filePath);
  if (ext === '.xlsx' || ext === '.xls') return loadXlsx(filePath);
  return [];
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toTitle(value) {
  return normalizeText(value)
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeSkillName(value) {
  const base = normalizeText(value);
  const aliases = {
    'ml': 'machine learning',
    'ai': 'artificial intelligence',
    'js': 'javascript',
    'ts': 'typescript',
    'nodejs': 'node.js',
    'reactjs': 'react',
    'ux ui': 'ui ux',
    'ui ux': 'ui ux',
  };
  return aliases[base] || base;
}

function splitList(value) {
  return String(value || '')
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function pickFirst(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && String(row[key]).trim() !== '') {
      return row[key];
    }
  }
  return '';
}

function uniqueBy(items, keyFn) {
  const map = new Map();
  items.forEach((item) => {
    const key = keyFn(item);
    if (!map.has(key)) {
      map.set(key, item);
    }
  });
  return Array.from(map.values());
}

function listDatasetFiles(datasetsDir) {
  if (!fs.existsSync(datasetsDir)) return [];
  return fs
    .readdirSync(datasetsDir)
    .filter((file) => /\.(csv|xlsx|xls)$/i.test(file))
    .map((file) => path.join(datasetsDir, file));
}

module.exports = {
  loadTabularFile,
  normalizeText,
  normalizeSkillName,
  splitList,
  toTitle,
  pickFirst,
  uniqueBy,
  listDatasetFiles,
};

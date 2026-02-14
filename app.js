var monthSelect = document.querySelector('#month');
var daySelect = document.querySelector('#day');
var form = document.querySelector('#birthday-form');
var result = document.querySelector('#result');
var resultDate = document.querySelector('#result-date');
var headline = document.querySelector('#headline');
var headlineLink = document.querySelector('#headline-link');
var error = document.querySelector('#error');
var submitButton = form.querySelector('button[type="submit"]');

var DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var API_CANDIDATES = [
  function (month, day) {
    return 'https://floridamanapi.com/api/v1/date/' + month + '-' + day;
  },
  function (month, day) {
    return 'https://floridamanapi.herokuapp.com/' + month + '/' + day;
  },
  function (month, day) {
    return 'https://floridamanapi.herokuapp.com/?date=' + month + '/' + day;
  },
];

function populateDays(daysInMonth) {
  var previous = daySelect.value || '01';
  daySelect.textContent = '';

  for (var i = 1; i <= daysInMonth; i += 1) {
    var option = document.createElement('option');
    option.value = String(i).padStart(2, '0');
    option.textContent = String(i);
    daySelect.appendChild(option);
  }

  if (Number(previous) <= daysInMonth) {
    daySelect.value = previous;
  }
}

function updateDayCount() {
  var monthIndex = Number(monthSelect.value) - 1;
  var maxDays = DAYS_IN_MONTH[monthIndex];
  populateDays(maxDays);
}

function showError(message) {
  error.hidden = false;
  error.textContent = message;
}

function clearError() {
  error.hidden = true;
  error.textContent = '';
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Loading...' : 'Show Headline';
}

function firstString(candidates) {
  for (var i = 0; i < candidates.length; i += 1) {
    if (typeof candidates[i] === 'string' && candidates[i].trim() !== '') {
      return candidates[i];
    }
  }
  return '';
}

function normalizeHeadlineData(data) {
  var nested = data && data.data ? data.data : null;
  var article = data && data.article ? data.article : null;
  var news = data && data.news ? data.news : null;

  var value = firstString([
    data && data.headline,
    data && data.title,
    nested && nested.headline,
    nested && nested.title,
    article && article.title,
    news && news.headline,
  ]);

  var source = firstString([
    data && data.url,
    data && data.link,
    data && data.source,
    nested && nested.url,
    article && article.url,
  ]);

  if (!value) {
    throw new Error('The API responded but did not include a headline.');
  }

  return { headline: value, source: source };
}

function renderHeadline(data, month, day) {
  resultDate.textContent = 'Your Florida Man story for ' + month + '/' + day;
  headline.textContent = data.headline;

  if (data.source) {
    headlineLink.hidden = false;
    headlineLink.href = data.source;
  } else {
    headlineLink.hidden = true;
    headlineLink.removeAttribute('href');
  }

  result.hidden = false;
}

async function fetchHeadline(month, day) {
  var lastError = null;

  for (var i = 0; i < API_CANDIDATES.length; i += 1) {
    var url = API_CANDIDATES[i](month, day);

    try {
      var response = await fetch(url, { mode: 'cors' });
      if (!response.ok) {
        lastError = new Error('Request failed with status ' + response.status);
        continue;
      }
      var data = await response.json();
      return normalizeHeadlineData(data);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('No Florida Man API endpoints succeeded.');
}

async function onSubmit(event) {
  event.preventDefault();
  clearError();
  result.hidden = true;
  setLoading(true);

  var month = monthSelect.value;
  var day = daySelect.value;

  try {
    var data = await fetchHeadline(month, day);
    renderHeadline(data, month, day);
  } catch (err) {
    showError('Could not find a headline right now. ' + err.message);
  } finally {
    setLoading(false);
  }
}

updateDayCount();
monthSelect.addEventListener('change', updateDayCount);
form.addEventListener('submit', onSubmit);

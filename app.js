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
var BIRTHDAY_DATA_URL = './birthdays.json';
var birthdayDataPromise = null;

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

function getBirthdayData() {
  if (!birthdayDataPromise) {
    birthdayDataPromise = fetch(BIRTHDAY_DATA_URL)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Could not load birthday data (' + response.status + ').');
        }
        return response.json();
      })
      .catch(function (err) {
        birthdayDataPromise = null;
        throw err;
      });
  }

  return birthdayDataPromise;
}

function renderEntry(entry, month, day) {
  resultDate.textContent = 'Your Florida Man story for ' + month + '/' + day;
  headline.textContent = entry.headline || 'Open your Florida Man link:';

  if (entry.url) {
    headlineLink.hidden = false;
    headlineLink.href = entry.url;
    headlineLink.textContent = 'Read source';
  } else {
    headlineLink.hidden = true;
    headlineLink.removeAttribute('href');
  }

  result.hidden = false;
}

async function onSubmit(event) {
  event.preventDefault();
  clearError();
  result.hidden = true;
  setLoading(true);

  var month = monthSelect.value;
  var day = daySelect.value;
  var dateKey = month + '-' + day;

  try {
    var birthdayData = await getBirthdayData();
    var entry = birthdayData[dateKey];

    if (!entry || !entry.url) {
      throw new Error('No weblink found for ' + dateKey + '.');
    }

    renderEntry(entry, month, day);
  } catch (err) {
    showError('Could not load birthday link right now. ' + err.message);
  } finally {
    setLoading(false);
  }
}

updateDayCount();
monthSelect.addEventListener('change', updateDayCount);
form.addEventListener('submit', onSubmit);

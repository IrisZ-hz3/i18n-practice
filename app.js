const localeSelect = document.getElementById("locale-select");
const tripButton = document.getElementById("plan-trip");
const tripSummary = document.getElementById("trip-summary");
const tripNote = document.getElementById("trip-note");
const guestCount = document.getElementById("guest-count");
const travelDate = document.getElementById("travel-date");
const tripStyle = document.getElementById("trip-style");
const subtotal = document.getElementById("subtotal");
const serviceFee = document.getElementById("service-fee");
const grandTotal = document.getElementById("grand-total");
const spotsLeft = document.getElementById("spots-left");
const offerEnds = document.getElementById("offer-ends");
const callUs = document.getElementById("call-us");
const dealMetaSunrise = document.getElementById("deal-meta-sunrise");
const dealCopySunrise = document.getElementById("deal-copy-sunrise");
const dealMetaLake = document.getElementById("deal-meta-lake");
const dealCopyLake = document.getElementById("deal-copy-lake");
const dealMetaDesert = document.getElementById("deal-meta-desert");
const dealCopyDesert = document.getElementById("deal-copy-desert");
const totalDueLabel = document.getElementById("total-due-label");
const fullName = document.getElementById("full-name");
const billingAddress = document.getElementById("billing-address");
const postalCode = document.getElementById("postal-code");
const prices = document.querySelectorAll(".price");
const inPageLinks = document.querySelectorAll('a[href^="#"]');

const rtlLocales = new Set(["ar-SA"]);
const baseDistanceMiles = 12;
const baseDistanceKilometers = 19.3;

const dealData = {
  sunriseRidge: {
    duration: 2,
    locationKey: "locations.yosemiteBasecamp",
    reserveBy: "2026-04-28",
    savingsAmount: 75,
  },
  lakeLoop: {
    duration: 4,
    locationKey: "locations.tahoeSummitLodge",
    age: 12,
    breakfastStart: "07:00",
    breakfastEnd: "09:30",
  },
  desertStars: {
    duration: 1,
    locationKey: "locations.joshuaTreeCamp",
  },
};

const checkoutAmounts = {
  subtotal: 2099.5,
  serviceFee: 49.99,
  grandTotal: 2149.49,
};

const staticFacts = {
  spotsLeft: 3,
  offerEnds: "2026-04-30",
  dueDate: "2026-04-25",
  tripStartCityKey: "locations.sanFrancisco",
  phone: "(415) 555-0199",
};

let baseMessages = null;
let messages = {};

function deepMerge(base, override) {
  const result = { ...base };

  Object.entries(override || {}).forEach(([key, value]) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = deepMerge(base[key] || {}, value);
      return;
    }

    result[key] = value;
  });

  return result;
}

function getSelectedLocale() {
  return localeSelect.value;
}

function getMessage(key) {
  return key.split(".").reduce((value, segment) => value?.[segment], messages);
}

function formatMessage(key, variables = {}) {
  const template = getMessage(key);

  if (typeof template !== "string") {
    return "";
  }

  return template.replace(/\{(\w+)\}/g, (_, token) => {
    const value = variables[token];
    return value == null ? "" : String(value);
  });
}

function getCurrentCurrency() {
  return getMessage("format.currency") || "USD";
}

function getCurrentDistanceUnit() {
  return getMessage("format.distanceUnit") || "mile";
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat(getSelectedLocale(), {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${dateValue}T00:00:00`));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat(getSelectedLocale(), {
    style: "currency",
    currency: getCurrentCurrency(),
  }).format(amount);
}

function formatTime(timeValue) {
  return new Intl.DateTimeFormat(getSelectedLocale(), {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`2026-01-01T${timeValue}:00`));
}

function formatDistance() {
  const unit = getCurrentDistanceUnit();
  const value = unit === "mile" ? baseDistanceMiles : baseDistanceKilometers;

  return new Intl.NumberFormat(getSelectedLocale(), {
    style: "unit",
    unit,
    unitDisplay: "long",
    maximumFractionDigits: unit === "mile" ? 0 : 1,
  }).format(value);
}

function applyStaticMessages() {
  document.documentElement.lang = getSelectedLocale();
  document.documentElement.dir = rtlLocales.has(getSelectedLocale()) ? "rtl" : "ltr";
  document.title = formatMessage("meta.title");

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = formatMessage(node.dataset.i18n);
  });

  fullName.placeholder = formatMessage("checkout.form.placeholders.fullName");
  billingAddress.placeholder = formatMessage("checkout.form.placeholders.billingAddress");
  postalCode.placeholder = formatMessage("checkout.form.placeholders.postalCode");
}

function renderStatus() {
  spotsLeft.textContent = formatMessage("hero.status.spotsLeft", {
    count: staticFacts.spotsLeft,
  });
  offerEnds.textContent = formatMessage("hero.status.offerEnds", {
    date: formatDate(staticFacts.offerEnds),
  });
  callUs.textContent = formatMessage("hero.status.callUs", {
    phone: staticFacts.phone,
  });
}

function renderDeals() {
  prices.forEach((node) => {
    node.textContent = formatCurrency(Number(node.dataset.price));
  });

  dealMetaSunrise.textContent = formatMessage("deals.cards.sunriseRidge.meta", {
    duration: dealData.sunriseRidge.duration,
    location: formatMessage(dealData.sunriseRidge.locationKey),
  });
  dealCopySunrise.textContent = formatMessage("deals.cards.sunriseRidge.blurb", {
    date: formatDate(dealData.sunriseRidge.reserveBy),
    amount: formatCurrency(dealData.sunriseRidge.savingsAmount),
  });

  dealMetaLake.textContent = formatMessage("deals.cards.lakeLoop.meta", {
    duration: dealData.lakeLoop.duration,
    location: formatMessage(dealData.lakeLoop.locationKey),
  });
  dealCopyLake.textContent = formatMessage("deals.cards.lakeLoop.blurb", {
    age: dealData.lakeLoop.age,
    startTime: formatTime(dealData.lakeLoop.breakfastStart),
    endTime: formatTime(dealData.lakeLoop.breakfastEnd),
  });

  dealMetaDesert.textContent = formatMessage("deals.cards.desertStars.meta", {
    duration: dealData.desertStars.duration,
    location: formatMessage(dealData.desertStars.locationKey),
  });
  dealCopyDesert.textContent = formatMessage("deals.cards.desertStars.blurb");
}

function renderPlanner() {
  tripSummary.textContent = formatMessage("planner.output.summary", {
    count: guestCount.value,
    date: formatDate(travelDate.value),
    style: formatMessage(`planner.styles.${tripStyle.value}`),
  });

  tripNote.textContent = formatMessage("planner.output.note", {
    city: formatMessage(staticFacts.tripStartCityKey),
    distance: formatDistance(),
  });
}

function renderCheckout() {
  subtotal.textContent = formatCurrency(checkoutAmounts.subtotal);
  serviceFee.textContent = formatCurrency(checkoutAmounts.serviceFee);
  grandTotal.textContent = formatCurrency(checkoutAmounts.grandTotal);
  totalDueLabel.textContent = formatMessage("checkout.summary.totalDue", {
    date: formatDate(staticFacts.dueDate),
  });
}

function renderLocale() {
  applyStaticMessages();
  renderStatus();
  renderDeals();
  renderPlanner();
  renderCheckout();
}

async function fetchMessages(locale) {
  const response = await fetch(`./${locale}.json`);

  if (!response.ok) {
    throw new Error(`Failed to load locale file for ${locale}.`);
  }

  return response.json();
}

async function loadLocale(locale) {
  if (!baseMessages) {
    baseMessages = await fetchMessages("en-US");
  }

  if (locale === "en-US") {
    messages = baseMessages;
    return;
  }

  const localeMessages = await fetchMessages(locale);
  messages = deepMerge(baseMessages, localeMessages);
}

async function updateLocale() {
  try {
    await loadLocale(getSelectedLocale());
    renderLocale();
  } catch (error) {
    console.error("Unable to load locale messages.", error);
  }
}

function handleInPageNavigation(event) {
  const hash = event.currentTarget.getAttribute("href");
  const target = document.querySelector(hash);

  if (!target) {
    return;
  }

  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", hash);
}

tripButton.addEventListener("click", renderPlanner);
localeSelect.addEventListener("change", updateLocale);
guestCount.addEventListener("input", renderPlanner);
travelDate.addEventListener("change", renderPlanner);
tripStyle.addEventListener("change", renderPlanner);
inPageLinks.forEach((link) => {
  link.addEventListener("click", handleInPageNavigation);
});

updateLocale();

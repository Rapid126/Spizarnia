const MS_PER_DAY = 1000 * 60 * 60 * 24;
const EXPIRING_SOON_THRESHOLD_DAYS = 3;

export const EXPIRATION_STATUS = {
  EXPIRED: "EXPIRED",
  EXPIRING_SOON: "EXPIRING_SOON",
  FRESH: "FRESH"
};

function parseIsoDateToUtc(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function getTodayUtc(referenceDate = new Date()) {
  return Date.UTC(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );
}

export function calculateDaysUntilExpiration(expirationDate, referenceDate = new Date()) {
  const targetUtc = parseIsoDateToUtc(expirationDate);
  const todayUtc = getTodayUtc(referenceDate);
  return Math.round((targetUtc - todayUtc) / MS_PER_DAY);
}

export function determineExpirationStatus(expirationDate, referenceDate = new Date()) {
  const daysRemaining = calculateDaysUntilExpiration(expirationDate, referenceDate);

  if (daysRemaining < 0) {
    return EXPIRATION_STATUS.EXPIRED;
  }
  if (daysRemaining <= EXPIRING_SOON_THRESHOLD_DAYS) {
    return EXPIRATION_STATUS.EXPIRING_SOON;
  }
  return EXPIRATION_STATUS.FRESH;
}
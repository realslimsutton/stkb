const numberFormatter0 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const numberFormatter2 = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatNumber(
  value: number | string | null,
  rounded = true,
  convert = false,
  colour = false,
  prefix: React.ReactNode | null = null,
  suffix: React.ReactNode | null = null,
) {
  if (typeof value === "string") {
    value = Number(value);
  }

  if (value === null || Number.isNaN(value)) {
    return "-";
  }

  const convertedValue = convert ? value / 100 : value;

  const formattedValue = rounded
    ? numberFormatter0.format(convertedValue)
    : numberFormatter2.format(convertedValue);

  if (!colour) {
    return `${prefix ? (prefix as string) : ""}${formattedValue}${suffix ? (suffix as string) : ""}`;
  }

  return value >= 0 ? (
    <span className="text-green-500">
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  ) : (
    <span className="text-red-500">
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

export function formatDuration(duration: number) {
  if (duration < 60) {
    return `${duration}s`;
  }

  const days = Math.floor(duration / (24 * 3600));
  duration %= 24 * 3600;
  const hours = Math.floor(duration / 3600);
  duration %= 3600;
  const minutes = Math.floor(duration / 60);

  const totalHours = days * 24 + hours;

  let result = [];

  if (totalHours > 0) {
    result.push(totalHours + "h");
  }
  if (minutes > 0 || totalHours > 0) {
    result.push(minutes + "m");
  }

  return result.join(" ");
}

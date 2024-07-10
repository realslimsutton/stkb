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
    return `${prefix ? (prefix as string) : ""}${formattedValue}${
      suffix ? (suffix as string) : ""
    }`;
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

  const result = [];

  if (totalHours > 0) {
    result.push(totalHours + "h");
  }
  if (minutes > 0 || totalHours > 0) {
    result.push(minutes + "m");
  }

  return result.join(" ");
}

export function capitalise(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function formatArray(value: string[], count = 3): string {
  if (value.length === 0) {
    return "";
  }

  if (value.length <= count) {
    return value.join(", ");
  }

  const displayedItems = value.slice(0, count).join(", ");
  const remainingCount = value.length - count;

  return `${displayedItems} & ${remainingCount} more`;
}

export function roundNumber(value: number) {
  if (value < 10) {
    return value;
  }

  if (value < 50) {
    return Math.round(value / 5) * 5;
  }

  if (value < 1000) {
    return Math.round(value / 10) * 10;
  }

  if (value < 10000) {
    return Math.round(value / 50) * 50;
  }

  if (value < 100000) {
    return Math.round(value / 500) * 500;
  }

  if (value < 1000000) {
    return Math.round(value / 5000) * 5000;
  }

  return Math.round(value / 50000) * 50000;
}

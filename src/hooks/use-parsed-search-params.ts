import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { type z } from "zod";

export default function useParsedSearchParams<T extends z.ZodRawShape>(
  searchParams: ReadonlyURLSearchParams,
  schema: z.ZodObject<T>,
) {
  const data = new Map();

  for (const key of searchParams.keys()) {
    if (data.has(key)) {
      continue;
    }

    const value = searchParams.getAll(key);

    if (value.length === 1) {
      data.set(key, String(value[0]));
    } else {
      data.set(
        key,
        value.map((v) => String(v)),
      );
    }
  }

  return schema.parse(Object.fromEntries(data));
}

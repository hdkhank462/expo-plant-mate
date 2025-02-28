import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppErrors } from "~/lib/errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function catchError<T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error];
    });
}

export function catchErrorTyped<T, E extends new (...args: any) => Error>(
  promise: Promise<T>,
  errorsToCatch: E[]
): Promise<[undefined, T] | [InstanceType<E>]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      if (error instanceof AppErrors)
        console.error(
          `${error.name}: [code="${error.code}"; cause="${error.cause}"]`
        );
      else console.error(error);

      if (errorsToCatch === undefined) return [error];
      if (errorsToCatch.some((e) => error instanceof e)) return [error];

      return [undefined];
    });
}

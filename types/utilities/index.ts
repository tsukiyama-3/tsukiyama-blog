import type { NuxtLinkProps } from "#app";

export type BreadcrumbListItem = {
  label: string;
  route: NuxtLinkProps["to"];
};

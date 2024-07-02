const baseUrl =
  "https://docs.google.com/spreadsheet/pub?key=1WLa7X8h3O0-aGKxeAlCL7bnN8-FhGd3t7pz2RCzSg8c&output=csv";

export function generateUrl(id: number) {
  return `${baseUrl}&gid=${id.toString()}`;
}

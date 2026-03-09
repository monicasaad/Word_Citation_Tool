export type CitationFormat = "APA" | "MLA";

/**
 * Converts a citation returned from the API into the requested format.
 *
 * The API provides citations in APA format:
 * Author. (Year). Title. URL
 *
 * If APA is requested, the citation is returned unchanged.
 * If MLA is requested, the citation is converted to a simplified MLA format.
 *
 * @param apaCitation - Citation string returned by the analyze API.
 * @param format - Desired citation format ("APA" or "MLA").
 * @returns The citation formatted according to the selected style.
 */
export function convertCitation(
  apaCitation: string,
  format: CitationFormat
): string {

  if (format === "APA") {
    return apaCitation;
  }

  const parts = apaCitation.split(".");

  const author = parts[0]?.trim() || "";
  const year = parts[1]?.replace(/[()]/g, "").trim() || "";
  const title = parts[2]?.trim() || "";
  const url = parts.slice(3).join(".").trim();

  // MLA basic structure: Name. "Title." Date, URL. 
  return `${author}. "${title}." ${year}, ${url}`;
}
import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  /**
   * SCOPED to only the new locale prefixes (/es, /hi, /pt-BR, /id) so every
   * existing English route is completely untouched by i18n middleware — the
   * default locale keeps serving from the top-level app/ routes. When the full
   * route migration lands, widen this to the standard
   * ["/((?!api|_next|_vercel|.*\\..*).*)"] matcher.
   */
  matcher: ["/(hi|es|pt-BR|id)/:path*", "/(hi|es|pt-BR|id)"],
};

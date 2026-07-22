import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "401(k) Calculator — Retirement Balance with Employer Match",
  description:
    "Free 401(k) calculator. Project your retirement balance from contributions, employer match, salary raises and investment returns. Instant, private, no signup.",
  keywords:
    "401k calculator, 401k retirement calculator, 401k growth calculator, employer match calculator, retirement savings calculator, 401k projection",
  path: "/calculators/401k",
});

const jsonLd = softwareAppSchema({
  name: "Free 401(k) Calculator",
  description:
    "Project a 401(k) retirement balance from contributions, employer match and returns.",
  path: "/calculators/401k",
});

const Retirement401kCalculator = dynamic(
  () => import("@/components/calc/Retirement401kCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How does a 401(k) grow over time?", a: "Each year you and your employer contribute a share of your salary, and the balance earns a compounding return. This calculator compounds monthly, grows your salary by your expected annual raise, and adds the employer match on top of your own contributions." },
  { q: "How does employer matching work?", a: "Many employers match your contributions up to a set percentage of salary — for example '50% of the first 6%.' In this calculator, enter the employer's match as a percent of salary; it's applied up to what you contribute, since employers never match more than you put in." },
  { q: "What return should I assume?", a: "Historical long-run stock-market returns have averaged around 7% a year after inflation, but returns vary widely and aren't guaranteed. Try a few rates (e.g. 5%, 7%, 9%) to see a realistic range rather than a single number." },
  { q: "Is the employer match really free money?", a: "Effectively, yes — it's part of your compensation. Contributing at least enough to get the full match is one of the highest-return moves available, because you get an immediate matched contribution before any market growth." },
  { q: "Is my data private?", a: "Yes. All projections run in your browser and nothing you enter is uploaded or stored." },
];

const about = (
  <>
    <p>
      This free 401(k) calculator projects how large your retirement balance
      could grow by combining your contributions, your employer&apos;s match,
      annual raises and compounding investment returns — so you can see the
      long-term payoff of contributing a little more today.
    </p>
    <h3>How it works</h3>
    <p>
      Each year you contribute your chosen percent of salary, the employer adds
      its match (up to what you contribute), and the balance compounds monthly at
      your expected return. Your salary grows by the annual raise you enter, so
      contributions rise over time too.
    </p>
    <h3>Worked example</h3>
    <p>
      Starting at age <strong>30</strong> with <strong>$25,000</strong> saved, a{" "}
      <strong>$70,000</strong> salary, contributing <strong>6%</strong> with a{" "}
      <strong>4%</strong> employer match, a <strong>7%</strong> return and a{" "}
      <strong>2%</strong> annual raise, the balance grows to roughly{" "}
      <strong>$1.6 million</strong> by age 65 — most of it investment growth
      rather than the contributions themselves.
    </p>
    <p>
      Comparing lump-sum growth? See the{" "}
      <Link href="/calculators/compound-interest">compound interest calculator</Link>
      , or plan monthly investing with the{" "}
      <Link href="/calculators/sip">SIP calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="401(k) Calculator"
        description="Project your 401(k) balance at retirement from your contributions, employer match, salary raises and investment returns."
        currentHref="/calculators/401k"
        current="401(k) Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <Retirement401kCalculator />
      </CalculatorPage>
    </>
  );
}

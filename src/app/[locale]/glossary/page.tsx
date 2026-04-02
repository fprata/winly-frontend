import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { BookOpen } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: 'EU Public Procurement Glossary: 60+ Key Terms Explained | Winly',
    description:
      'Comprehensive EU procurement glossary covering 60+ public tender terminology terms. From CPV codes to MEAT criteria, understand every concept in European public procurement.',
    keywords: [
      'EU procurement glossary',
      'public tender terminology',
      'procurement terms',
      'CPV codes',
      'MEAT criteria',
      'TED tenders',
      'ESPD',
      'public procurement definitions',
    ],
    alternates: {
      canonical: `https://winly.me/${locale}/glossary`,
      languages: { en: 'https://winly.me/en/glossary', pt: 'https://winly.me/pt/glossary' },
    },
  }
}

interface GlossaryTerm {
  term: string
  definition: string
}

const glossaryData: Record<string, GlossaryTerm[]> = {
  A: [
    {
      term: 'Abnormally Low Tender',
      definition:
        'A bid whose price is significantly below the estimated contract value or competing offers, raising doubts about the tenderer\'s ability to deliver. Contracting authorities must request an explanation before rejecting such tenders. Identifying these early helps bidders calibrate competitive yet credible pricing.',
    },
    {
      term: 'Award Criteria',
      definition:
        'The factors used by a contracting authority to evaluate and rank tenders. Under EU directives, the two main approaches are lowest price and most economically advantageous tender (MEAT). Understanding the weight assigned to each criterion is essential for crafting a winning bid.',
    },
    {
      term: 'Award Notice',
      definition:
        'A notice published after a contract has been awarded, detailing the winning tenderer, the contract value, and the number of bids received. Published on TED and national portals, these notices are valuable for competitive intelligence and market benchmarking.',
    },
    {
      term: 'Ajuste Direto (Direct Award)',
      definition:
        'A Portuguese procurement procedure where the contracting authority invites one or more operators directly, without a public call for competition. Governed by the Portuguese Public Contracts Code (CCP), it is typically used for low-value contracts below national thresholds.',
    },
  ],
  B: [
    {
      term: 'BASE Portal',
      definition:
        'Portugal\'s official public procurement platform (base.gov.pt) where all Portuguese public contracts must be published. It contains contract notices, award decisions, and contract modifications. Winly ingests BASE data alongside TED for comprehensive Portuguese market coverage.',
    },
    {
      term: 'Best Value',
      definition:
        'An evaluation approach that considers factors beyond price alone, such as quality, lifecycle costs, social value, and innovation. Best value procurement aims to achieve the optimal combination of cost and quality over the contract\'s lifetime.',
    },
    {
      term: 'Bid Bond',
      definition:
        'A financial guarantee submitted with a tender, ensuring the bidder will honor the terms of their offer if selected. Typically a percentage of the bid value, it protects the buyer against bid withdrawal. Common in works contracts and high-value service procurements.',
    },
    {
      term: 'Buyer DNA',
      definition:
        'A Winly analytics concept that profiles a contracting authority\'s procurement behavior, including preferred procedures, average contract values, evaluation tendencies, and historical supplier choices. Buyer DNA helps bidders tailor proposals to specific buyer preferences.',
    },
  ],
  C: [
    {
      term: 'Caderno de Encargos (Terms of Reference)',
      definition:
        'The Portuguese term for the detailed specification document that defines the contractual obligations, technical requirements, and conditions for a public tender. It is the binding document that governs the contract relationship between buyer and supplier.',
    },
    {
      term: 'Central Purchasing Body',
      definition:
        'An entity that conducts procurement activities on behalf of multiple contracting authorities, aggregating demand to achieve better value and efficiency. Examples include ESPAP in Portugal and EU-level bodies. Centralized purchasing often results in larger framework agreements.',
    },
    {
      term: 'Competitive Dialogue',
      definition:
        'A procurement procedure used for complex contracts where the contracting authority cannot define the technical or financial solution in advance. Selected candidates discuss solutions with the buyer before submitting final tenders. Common in IT, infrastructure, and PPP projects.',
    },
    {
      term: 'Concurso Publico (Public Tender)',
      definition:
        'The Portuguese term for an open public tender procedure where any interested economic operator may submit a bid. It is the most transparent and commonly used procedure under the Portuguese Public Contracts Code for contracts above certain thresholds.',
    },
    {
      term: 'Contract Notice',
      definition:
        'The official publication that announces a new procurement opportunity and invites economic operators to submit tenders or requests to participate. Published on TED for EU-level tenders and on national portals for domestic ones, it is the primary signal for new business opportunities.',
    },
    {
      term: 'CPV Code',
      definition:
        'Common Procurement Vocabulary code: an EU-wide classification system that categorizes procurement by subject matter using an 8-digit numeric code. CPV codes are mandatory in all EU procurement notices and are essential for filtering and matching tenders to a company\'s capabilities.',
    },
    {
      term: 'Criterion Weight',
      definition:
        'The percentage or point value assigned to each award criterion in a tender evaluation. For example, a tender might assign 60% to quality and 40% to price. Understanding criterion weights is crucial for deciding how to allocate effort and resources in a bid.',
    },
  ],
  D: [
    {
      term: 'Design Contest',
      definition:
        'A procurement procedure used primarily in architecture, urban planning, and engineering where a jury selects the best design or plan. Winners may receive prizes or be invited to negotiate a subsequent service contract. Governed by specific EU directive provisions.',
    },
    {
      term: 'Direct Award',
      definition:
        'A procurement method where a contract is awarded to a supplier without a competitive tendering process. Permitted under strict conditions, such as extreme urgency, exclusive rights, or very low contract values. In Portugal, this is known as "Ajuste Direto."',
    },
    {
      term: 'Dynamic Purchasing System (DPS)',
      definition:
        'An electronic procurement tool that remains open to new suppliers throughout its duration. Unlike framework agreements, new operators can qualify and join at any time. Contracting authorities run mini-competitions among qualified suppliers for specific needs.',
    },
  ],
  E: [
    {
      term: 'Economic Operator',
      definition:
        'Any natural or legal person, public entity, or group of such persons that offers goods, works, or services on the market. This is the EU legal term for a potential supplier, contractor, or service provider participating in public procurement.',
    },
    {
      term: 'eForms',
      definition:
        'The standardized electronic forms used for publishing procurement notices across the EU since October 2023, replacing the legacy TED XML schema. eForms provide richer, more structured data including detailed procedure information, lot breakdowns, and award criteria.',
    },
    {
      term: 'Electronic Auction',
      definition:
        'A repetitive online process where tenderers can revise their prices (and sometimes other quantifiable elements) downward in successive rounds. Used after initial tender evaluation, it provides a transparent mechanism for achieving the best final price.',
    },
    {
      term: 'ESPD (European Single Procurement Document)',
      definition:
        'A self-declaration form that replaces the need to submit full documentary evidence at the tender stage. Bidders declare they meet selection criteria and exclusion grounds; only the winning bidder must provide supporting documents. The ESPD significantly reduces the administrative burden of bidding.',
    },
    {
      term: 'Estimated Value',
      definition:
        'The contracting authority\'s calculation of the total contract value, excluding VAT, including any options or renewals. This figure determines which procurement rules and thresholds apply. It is a key data point for assessing whether a tender is worth pursuing.',
    },
    {
      term: 'Evaluation Committee',
      definition:
        'The group of individuals appointed by the contracting authority to assess and score submitted tenders against the published award criteria. Committee composition and methodology must follow national procurement law, and their decisions must be documented and defensible.',
    },
  ],
  F: [
    {
      term: 'Financial Capacity',
      definition:
        'A selection criterion requiring bidders to demonstrate they have sufficient financial resources to perform the contract. Typically evidenced by turnover figures, balance sheets, or bank statements. Contracting authorities set minimum thresholds proportionate to the contract value.',
    },
    {
      term: 'Framework Agreement',
      definition:
        'A long-term agreement between one or more contracting authorities and one or more economic operators that establishes the terms for future contracts (call-offs). Framework agreements can last up to four years and are widely used for recurring purchases like IT equipment, consulting, and supplies.',
    },
    {
      term: 'Full Refresh',
      definition:
        'A data pipeline operation where the entire dataset is re-downloaded and re-processed from source, rather than only fetching incremental updates. In Winly\'s context, a full refresh ensures data completeness and consistency across TED and BASE sources.',
    },
  ],
  G: [
    {
      term: 'GPA (Government Procurement Agreement)',
      definition:
        'A World Trade Organization agreement that opens government procurement markets among its signatories. GPA coverage means tenders must also be accessible to suppliers from countries like the US, Japan, Canada, and others. A tender marked as GPA-covered has broader international competition.',
    },
    {
      term: 'Green Public Procurement (GPP)',
      definition:
        'A policy approach where contracting authorities integrate environmental criteria into procurement processes. GPP can include requirements for energy efficiency, reduced emissions, recyclable materials, or lifecycle environmental impact. The EU actively encourages GPP as part of its Green Deal objectives.',
    },
  ],
  H: [
    {
      term: 'Horizontal Purchasing',
      definition:
        'A procurement strategy where a single authority or purchasing body acquires goods or services that serve multiple departments or organizational units. This approach leverages volume to negotiate better terms and standardize specifications across an organization.',
    },
  ],
  I: [
    {
      term: 'IMPIC',
      definition:
        'Instituto dos Mercados Publicos, do Imobiliario e da Construcao, the Portuguese public body that regulates public procurement and the construction sector. IMPIC oversees compliance with the Public Contracts Code and manages the BASE portal for contract transparency.',
    },
    {
      term: 'Innovation Partnership',
      definition:
        'A procurement procedure designed for cases where the market does not yet offer a suitable solution. The contracting authority partners with one or more operators to develop an innovative product, service, or works, and then purchases the result without a separate procurement process.',
    },
    {
      term: 'Invitation to Tender',
      definition:
        'The formal request sent to pre-qualified or shortlisted candidates asking them to submit a full tender. In restricted procedures and some framework agreements, only operators who pass the selection stage receive this invitation. It specifies the deadline, format, and submission requirements.',
    },
  ],
  J: [
    {
      term: 'Joint Procurement',
      definition:
        'A collaborative approach where two or more contracting authorities from the same or different EU member states conduct a procurement procedure together. Joint procurement pools demand, reduces duplication, and can unlock better value, as seen during the EU\'s COVID-19 vaccine procurement.',
    },
  ],
  K: [
    {
      term: 'Key Performance Indicator (KPI)',
      definition:
        'A measurable value used to evaluate the success of a contract\'s execution against defined objectives. In procurement, KPIs are often embedded in service-level agreements and framework contracts to ensure suppliers meet quality, timeliness, and cost targets throughout the contract lifecycle.',
    },
  ],
  L: [
    {
      term: 'Life-Cycle Costing',
      definition:
        'An evaluation method that considers the total cost of a product or service over its entire lifespan, including acquisition, maintenance, operation, and disposal costs. EU directives explicitly allow life-cycle costing as an award criterion, encouraging long-term value over short-term savings.',
    },
    {
      term: 'Lot',
      definition:
        'A distinct portion of a contract that can be tendered and awarded separately. EU directives encourage dividing contracts into lots to improve SME access. A single tender notice may contain multiple lots, each with its own specifications, value, and award decision.',
    },
    {
      term: 'Lowest Price',
      definition:
        'An award criterion where the contract is given to the tenderer offering the lowest compliant bid. While still permitted under EU directives, its use is increasingly discouraged in favor of MEAT to ensure quality and value are also considered.',
    },
  ],
  M: [
    {
      term: 'MEAT (Most Economically Advantageous Tender)',
      definition:
        'The EU\'s preferred evaluation methodology, which assesses tenders based on the best price-quality ratio rather than price alone. MEAT criteria can include quality, technical merit, environmental characteristics, delivery time, after-sales service, and innovation alongside cost.',
    },
    {
      term: 'Mini-Competition',
      definition:
        'A simplified competitive process conducted among the suppliers on a multi-supplier framework agreement to award a specific contract. The buyer circulates the requirement to all framework members, who submit offers within a shortened timeframe. It combines efficiency with competition.',
    },
  ],
  N: [
    {
      term: 'Negotiated Procedure',
      definition:
        'A procurement procedure where the contracting authority negotiates directly with selected economic operators to agree contract terms. The negotiated procedure without prior publication is used in exceptional circumstances; with prior publication, it follows a structured competitive phase before negotiations.',
    },
    {
      term: 'Notice',
      definition:
        'A formal publication in a procurement context, such as a contract notice, prior information notice, or award notice. Notices are the official mechanism for communicating procurement opportunities and outcomes. In the EU, they are published on TED using standardized eForms.',
    },
  ],
  O: [
    {
      term: 'OJEU (Official Journal of the European Union)',
      definition:
        'The official publication of the European Union where all EU-level procurement notices are published. The supplement to the OJEU (known as TED) is the dedicated portal for public procurement. Publication in the OJEU is mandatory for contracts above EU thresholds.',
    },
    {
      term: 'Open Procedure',
      definition:
        'The most straightforward EU procurement procedure where any interested economic operator may submit a tender in response to a contract notice. There is no pre-qualification or shortlisting phase. It is the most commonly used procedure and offers maximum transparency and competition.',
    },
  ],
  P: [
    {
      term: 'PIN (Prior Information Notice)',
      definition:
        'A notice published to inform the market about upcoming procurement opportunities, typically at the start of the budgetary year. PINs allow economic operators to prepare in advance. They can also be used to reduce the minimum tender submission deadlines in subsequent procedures.',
    },
    {
      term: 'Pre-qualification',
      definition:
        'The first stage in a restricted or competitive procedure where candidates are assessed against selection criteria before being invited to submit a full tender. Pre-qualification filters out unqualified operators early, reducing the evaluation burden for complex tenders.',
    },
    {
      term: 'Procurement Directive',
      definition:
        'The primary EU legislation governing public procurement: Directive 2014/24/EU (public sector) and Directive 2014/25/EU (utilities). These directives set the rules for procedures, thresholds, timelines, and transparency that all EU member states must implement in national law.',
    },
    {
      term: 'Public-Private Partnership (PPP)',
      definition:
        'A long-term contractual arrangement between a public authority and a private partner for the delivery of public services or infrastructure. The private partner typically finances, builds, and operates the asset in exchange for payments or user fees over the contract period.',
    },
  ],
  Q: [
    {
      term: 'Qualification System',
      definition:
        'A pre-approved list of economic operators maintained by utilities sector contracting entities. Operators meeting defined criteria are added to the list and can be invited to tender for future contracts. It streamlines procurement for recurring needs in sectors like energy, water, and transport.',
    },
    {
      term: 'Quality-Price Ratio',
      definition:
        'An award methodology under MEAT where tenders are scored based on a weighted combination of qualitative and price factors. The ratio (e.g., 70% quality / 30% price) determines how much quality improvements can offset a higher price, and vice versa.',
    },
  ],
  R: [
    {
      term: 'Remedies Directive',
      definition:
        'EU Directives 89/665/EEC and 92/13/EEC, which establish the legal framework for challenging procurement decisions. They guarantee bidders the right to effective and rapid review, including the ability to suspend a contract award pending review. These directives underpin procurement fairness across the EU.',
    },
    {
      term: 'Restricted Procedure',
      definition:
        'A two-stage procurement procedure where any operator may request to participate, but only those meeting the selection criteria are invited to submit a tender. This procedure is suitable for complex contracts where the buyer wants to limit the number of bidders to a manageable group.',
    },
    {
      term: 'Review Body',
      definition:
        'The national authority or court responsible for hearing and deciding procurement challenges. Each EU member state must designate at least one independent review body under the Remedies Directive. In Portugal, this role is fulfilled by administrative courts and IMPIC.',
    },
  ],
  S: [
    {
      term: 'Selection Criteria',
      definition:
        'The minimum requirements that bidders must meet to be considered for a contract, distinct from the award criteria used to rank tenders. Selection criteria cover economic standing, technical ability, and professional qualifications. They act as a gateway, not a scoring mechanism.',
    },
    {
      term: 'SME (Small and Medium-sized Enterprise)',
      definition:
        'An enterprise with fewer than 250 employees and annual turnover not exceeding EUR 50 million. EU procurement policy actively promotes SME participation through lot division, proportionate requirements, the ESPD, and electronic procurement tools.',
    },
    {
      term: 'Standstill Period',
      definition:
        'A mandatory waiting period (typically 10-15 days) between the contract award decision and the signing of the contract. This pause allows unsuccessful bidders to challenge the decision before it becomes irreversible. Failure to observe the standstill period can invalidate the contract.',
    },
    {
      term: 'Subcontracting',
      definition:
        'The practice of a main contractor engaging third parties to perform part of a public contract. EU directives require transparency about subcontracting arrangements and allow contracting authorities to require direct payment to subcontractors. Bidders must disclose subcontracting intentions in their tenders.',
    },
    {
      term: 'Submission Deadline',
      definition:
        'The final date and time by which tenders or requests to participate must be received by the contracting authority. Missing the deadline results in automatic exclusion. Minimum deadlines vary by procedure type and are specified in the EU procurement directives.',
    },
  ],
  T: [
    {
      term: 'TED (Tenders Electronic Daily)',
      definition:
        'The online portal of the Official Journal of the EU dedicated to public procurement. TED publishes hundreds of thousands of contract notices, award notices, and other procurement documents annually from across the EU, EEA, and beyond. It is the primary data source for EU-wide tender intelligence.',
    },
    {
      term: 'Technical Specifications',
      definition:
        'The detailed description of the required characteristics of the goods, services, or works being procured. Specifications must be drafted to allow fair competition and cannot reference specific brands unless justified. They may be defined by performance requirements, standards, or functional criteria.',
    },
    {
      term: 'Tender',
      definition:
        'A formal offer submitted by an economic operator in response to a procurement notice, containing the proposed price, technical solution, and all required documentation. The term is also used colloquially to refer to the entire procurement process or opportunity itself.',
    },
    {
      term: 'Threshold Values',
      definition:
        'The contract value limits set by the European Commission (updated every two years) that determine whether EU procurement directives apply. As of 2024, key thresholds include EUR 143,000 for central government supplies/services and EUR 5,538,000 for works contracts. Below these, national rules apply.',
    },
    {
      term: 'Transparency',
      definition:
        'A fundamental principle of EU public procurement requiring that all procedures, criteria, and decisions are published and accessible. Transparency ensures fair competition, prevents corruption, and enables public scrutiny. It is enforced through mandatory notice publication on TED and national portals.',
    },
  ],
  U: [
    {
      term: 'Utilities Directive',
      definition:
        'Directive 2014/25/EU, which governs procurement by entities operating in the water, energy, transport, and postal services sectors. Utilities have more flexible procedures than the public sector directive, reflecting the competitive pressures these sectors already face.',
    },
    {
      term: 'UACP (Uniform Application of Common Procurement)',
      definition:
        'Policies and guidance aimed at ensuring consistent interpretation and application of EU procurement rules across all member states. UACP efforts reduce fragmentation and help economic operators navigate cross-border procurement with greater confidence.',
    },
  ],
  V: [
    {
      term: 'Variant',
      definition:
        'An alternative tender that differs from the solution described in the procurement documents, offered alongside or instead of a compliant bid. Contracting authorities must explicitly state in the contract notice whether variants are permitted and define minimum requirements they must meet.',
    },
    {
      term: 'VAT Number',
      definition:
        'The Value Added Tax identification number used to identify economic operators within the EU. In procurement contexts, the VAT number serves as a key identifier for verifying a tenderer\'s legal status and tax compliance across member states.',
    },
  ],
  W: [
    {
      term: 'Win Probability',
      definition:
        'A Winly analytics metric that estimates the likelihood of a company winning a specific tender based on historical data, buyer behavior, competitive landscape, and the company\'s profile match. It helps procurement teams prioritize which opportunities to pursue.',
    },
    {
      term: 'Works Contract',
      definition:
        'A public contract for the execution or design and execution of building or civil engineering works. Works contracts have the highest EU threshold values and often involve complex procurement procedures. They cover everything from road construction to hospital building.',
    },
  ],
  X: [
    {
      term: 'XML Schema (eForms)',
      definition:
        'The technical standard defining the structure and validation rules for electronic procurement notices submitted to TED. The eForms XML schema replaced the legacy TED schema in October 2023, introducing richer data fields and better interoperability across EU procurement systems.',
    },
  ],
}

const alphabet = Object.keys(glossaryData)

export default function GlossaryPage() {
  const totalTerms = Object.values(glossaryData).reduce((sum, terms) => sum + terms.length, 0)

  return (
    <div className="bg-zinc-50 min-h-screen font-sans text-zinc-900">
      <Navbar />

      <main className="pb-20">
        {/* Hero */}
        <section className="pt-24 pb-16 px-6 bg-white border-b border-zinc-200">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
              <BookOpen size={14} />
              Reference Guide
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 mb-6 leading-tight">
              EU Public Procurement Glossary:{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                {totalTerms}+ Key Terms Explained
              </span>
            </h1>
            <p className="text-xl text-zinc-500 leading-relaxed max-w-3xl mx-auto">
              A comprehensive reference for procurement professionals, bid managers, and anyone navigating European public tenders.
              From CPV codes to MEAT criteria, every term you need to know in one place.
            </p>
          </div>
        </section>

        {/* Sticky Alphabet Nav */}
        <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center gap-1 justify-center">
            {alphabet.map((letter) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold text-zinc-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>
        </nav>

        {/* Glossary Content */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            {alphabet.map((letter) => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shrink-0">
                    {letter}
                  </div>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>
                <div className="space-y-4">
                  {glossaryData[letter].map((item) => (
                    <div
                      key={item.term}
                      className="bg-white border border-zinc-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <h3 className="text-lg font-bold text-zinc-900 mb-2">{item.term}</h3>
                      <p className="text-zinc-600 text-sm leading-relaxed">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-zinc-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">Put this knowledge to work</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
              Winly turns procurement data from TED and BASE into actionable intelligence.
              Find tenders matched to your business, analyze buyer behavior, and win more contracts.
            </p>
            <a
              href="/en/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

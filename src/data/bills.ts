import type { Bill } from '../types';

export const bills: Bill[] = [
  {
    id: 'freedom-to-vote',
    number: 'S.1 / H.R.11',
    title: 'Freedom to Vote Act',
    shortTitle: 'Freedom to Vote Act',
    status: 'introduced',
    statusLabel: 'Introduced — 118th Congress',
    congress: '118th Congress (2023–2024)',
    sponsors: ['Sen. Amy Klobuchar (D-MN)', 'Sen. Joe Manchin (I-WV)', 'Sen. Jeff Merkley (D-OR)'],
    tags: ['Voting Access', 'Election Security', 'Redistricting', 'Campaign Finance'],
    synopsis: `The Freedom to Vote Act is comprehensive voting rights legislation that addresses four major areas: voting access, election security, redistricting reform, and campaign finance transparency.

The bill would establish automatic voter registration nationwide, guarantee at least two weeks of early voting including weekends, make Election Day a federal holiday, and ensure all states provide online voter registration. It strengthens election security by mandating voter-verified paper ballots and expanding penalties for tampering with election records.

On redistricting, the bill prohibits partisan gerrymandering and mid-decade redistricting, allowing states to establish independent redistricting commissions. For campaign finance, it requires disclosure of dark money donors from super PACs and 501(c)(4) organizations, and introduces voluntary public financing matching small donations at a 6:1 ratio.

The bill has been blocked by Senate filibuster multiple times, most recently failing to advance on a 50-50 party-line vote.`,
    keyProvisions: [
      'Automatic voter registration through motor vehicle agencies',
      'Minimum 2 weeks early voting including weekends for federal elections',
      'Election Day as a federal public holiday',
      'Online voter registration in all states',
      'Voter-verified paper ballot mandate',
      'Ban on partisan gerrymandering',
      'Prohibition of mid-decade redistricting',
      'Dark money donor disclosure requirements',
      'Small-donor matching at 6:1 ratio (voluntary public financing)',
      'Enhanced penalties for election record tampering',
    ],
    sections: [
      {
        id: 'ftv-s1',
        title: 'Title I — Voter Registration Modernization',
        content: `Sec. 101. Automatic Voter Registration. Each state shall establish and operate an automatic voter registration system for elections for Federal office. Under such system, each eligible citizen who interacts with a designated government agency shall be automatically registered to vote, or have their existing registration updated, unless the citizen declines.

Sec. 102. Pre-Registration of Youth. States must allow pre-registration of any citizen who is at least 16 years of age so that they may vote upon turning 18.

Sec. 103. Online Voter Registration. Each state shall ensure voters have access to online voter registration for federal elections, with secure identity verification procedures.

Sec. 104. Same-Day Registration. Each state shall permit eligible individuals to register to vote on the day of a Federal election and to cast a vote in such election.`,
      },
      {
        id: 'ftv-s2',
        title: 'Title II — Early Voting and Accessibility',
        content: `Sec. 201. Early Voting. Each state shall provide for early voting in federal elections for a period of not less than 14 consecutive days (including 2 weekends) prior to Election Day. Polling locations shall be open for at least 10 hours per day.

Sec. 202. Election Day Holiday. The day of the general election for Federal office (the Tuesday next after the first Monday in November) is designated as a legal public holiday.

Sec. 203. Provisional Ballot Protections. Provisional ballots cast within the same county where the voter is registered shall be counted for all elections in which the voter is eligible, regardless of precinct.

Sec. 204. Disability Access. All polling places must be accessible to voters with disabilities, with accommodations including accessible voting machines and assistance for voters who need it.`,
      },
      {
        id: 'ftv-s3',
        title: 'Title III — Election Security',
        content: `Sec. 301. Paper Ballot Requirement. All votes in Federal elections shall be cast using individual, durable, voter-verified paper ballots. Ballots may be marked by hand or with a ballot-marking device that allows voter inspection and correction before casting.

Sec. 302. Post-Election Audits. States shall conduct risk-limiting post-election audits of the results of Federal elections using statistically valid methods.

Sec. 303. Ballot Processing. States shall begin processing mail-in and early vote ballots before Election Day to ensure timely results.

Sec. 304. Record Preservation. Expands categories of election records that must be preserved after federal elections and increases penalties for destruction or alteration of ballots and election records.`,
      },
      {
        id: 'ftv-s4',
        title: 'Title IV — Redistricting Reform',
        content: `Sec. 401. Ban on Partisan Gerrymandering. No state may use a redistricting plan for Federal elections that is drawn with either the intent or the effect of materially favoring or disfavoring any political party. Courts may evaluate partisan fairness using multiple metrics.

Sec. 402. Prohibition of Mid-Decade Redistricting. Once a state adopts a new congressional map following the decennial census, no new map may be drawn until the next census, except as ordered by a court to remedy a legal violation.

Sec. 403. Independent Redistricting Commissions. States may establish independent commissions to develop redistricting plans. Such commissions shall operate with transparency, including public hearings and published data.

Sec. 404. Criteria for Maps. Redistricting plans shall comply with the Voting Rights Act, provide for contiguous and reasonably compact districts, and preserve communities of interest.`,
      },
      {
        id: 'ftv-s5',
        title: 'Title V — Campaign Finance and Transparency',
        content: `Sec. 501. DISCLOSE Act Provisions. Super PACs, 501(c)(4) organizations, and other entities spending more than $10,000 on campaign-related disbursements must disclose donors who contribute $10,000 or more. Transfers between organizations to obscure donor identities are prohibited.

Sec. 502. Small Dollar Financing Program. Establishes a voluntary public financing program that matches small-dollar contributions (under $200) at a 6:1 ratio from a dedicated fund, incentivizing candidates to focus on grassroots fundraising.

Sec. 503. Foreign Money Ban Enforcement. Strengthens prohibitions on foreign nationals contributing to or spending on U.S. elections, with enhanced reporting requirements for online political advertising.

Sec. 504. Honest Ads Act. Requires transparency for online political advertising, including disclosure of the purchaser and targeting criteria used for digital ads related to Federal elections.`,
      },
    ],
  },
  {
    id: 'john-lewis-vra',
    number: 'H.R.14',
    title: 'John R. Lewis Voting Rights Advancement Act of 2025',
    shortTitle: 'John Lewis Voting Rights Act',
    status: 'introduced',
    statusLabel: 'Introduced — 119th Congress',
    congress: '119th Congress (2025–2026)',
    sponsors: ['Rep. Terri Sewell (D-AL)'],
    tags: ['Voting Rights', 'Preclearance', 'Discrimination', 'DOJ Enforcement'],
    synopsis: `The John R. Lewis Voting Rights Advancement Act restores and modernizes the Voting Rights Act of 1965, which was gutted by the Supreme Court in Shelby County v. Holder (2013) and further weakened by Brnovich v. DNC (2021).

The bill creates a new formula to determine which states and jurisdictions with recent histories of voting discrimination must obtain federal approval ("preclearance") before changing voting laws. It also establishes nationwide preclearance for specific types of changes that are frequently discriminatory, such as voter ID requirements, reductions in polling places, and changes to district boundaries affecting minority communities.

The act strengthens Section 2 of the Voting Rights Act by codifying protections against discriminatory voting practices, expands the federal observer program, requires 180-day advance notice of voting changes before elections, and enhances DOJ enforcement authority.

Named for the late civil rights leader and congressman John Lewis, the bill was passed by the House in 2021 but blocked in the Senate. It was reintroduced in March 2025.`,
    keyProvisions: [
      'New preclearance formula based on recent discrimination history',
      'Nationwide preclearance for frequently discriminatory changes',
      'Strengthened Section 2 protections against vote dilution',
      'Expanded federal observer program for elections',
      'Mandatory 180-day notice before voting changes near elections',
      'Enhanced DOJ enforcement and investigation authority',
      'Streamlined bailout process for compliant jurisdictions',
      'Protections for election workers and infrastructure',
      'Expanded voting access on tribal lands',
    ],
    sections: [
      {
        id: 'jl-s1',
        title: 'Title I — Strengthening Section 2 of the Voting Rights Act',
        content: `Sec. 101. Voting Rights Act Amendments. Amends Section 2 of the Voting Rights Act to strengthen protections against voting discrimination in response to the Supreme Court's decision in Brnovich v. Democratic National Committee (2021).

Codifies the nine Senate Factors from the 1982 Senate report, which have been used by federal courts since Thornburg v. Gingles (1986) to evaluate vote dilution claims.

Establishes that claims of "voter fraud" are not sufficient justification for voting rules that have discriminatory effects. Courts shall consider the totality of circumstances in determining whether a voting practice results in discrimination.

Clarifies that Section 2 protects both the right to cast a ballot and the right to have that ballot counted and included in the final certification of election results.`,
      },
      {
        id: 'jl-s2',
        title: 'Title II — Preclearance Coverage Formula',
        content: `Sec. 201. Geographic Coverage. Establishes a new coverage formula to determine which states and political subdivisions are subject to preclearance. Coverage is based on a rolling record of recent voting rights violations within the preceding 25-year period.

A state is covered if it has committed: (a) 15 or more voting rights violations in the state during the preceding 25 years; or (b) 10 or more violations, at least one of which was committed by the state itself.

A political subdivision is covered if it has: (a) 3 or more voting rights violations in the preceding 25 years; or (b) 1 or more violations and persistently low minority voter turnout.

Sec. 202. Preclearance Requirement. Covered jurisdictions must submit any changes to voting qualifications, prerequisites, standards, practices, or procedures to the Department of Justice or the U.S. District Court for the District of Columbia for approval before implementation.`,
      },
      {
        id: 'jl-s3',
        title: 'Title III — Practice-Based Preclearance',
        content: `Sec. 301. Nationwide Preclearance for Specific Changes. Regardless of geographic coverage, certain types of voting changes are subject to preclearance nationwide when specific conditions are met. These include:

(a) Creating at-large districts or multimember districts in jurisdictions with sufficiently large minority populations.

(b) Changing jurisdiction boundaries to reduce the proportion of minority voters within the jurisdiction.

(c) Redrawing district boundaries where a minority group has experienced significant population growth.

(d) Reducing the number of polling places, early voting locations, or voter registration sites in jurisdictions with a history of long wait times or discriminatory practices.

(e) Imposing new or stricter requirements for documentation or proof of identity to register to vote or to cast a ballot.

These targeted preclearance requirements address the most common methods used to suppress minority voting power.`,
      },
      {
        id: 'jl-s4',
        title: 'Title IV — Federal Observers and Transparency',
        content: `Sec. 401. Expanded Federal Observers. Broadens the authority of the U.S. Attorney General to assign federal observers to any jurisdiction where there is a substantial risk of discrimination on Election Day or during early voting periods.

Sec. 402. Transparency Requirements. Requires all voting changes to be publicly announced at least 180 days before any federal election. Officials must provide detailed descriptions of changes, their expected effects, and the reasoning behind them.

Sec. 403. Enforcement Authority. Authorizes DOJ to require states or political subdivisions to provide documents and answer questions in connection with enforcement of voting rights protections.

Sec. 404. Bailout Process. Jurisdictions that have not engaged in discrimination for a specified period and have satisfied objective criteria may apply for automatic release from preclearance coverage without filing a lawsuit.`,
      },
    ],
  },
  {
    id: 'save-act',
    number: 'H.R.22',
    title: 'Safeguard American Voter Eligibility Act (SAVE Act)',
    shortTitle: 'SAVE Act',
    status: 'passed_house',
    statusLabel: 'Passed House — 119th Congress',
    congress: '119th Congress (2025–2026)',
    sponsors: ['Rep. Chip Roy (R-TX)'],
    tags: ['Voter ID', 'Citizenship Verification', 'Voter Roll Maintenance', 'Election Integrity'],
    synopsis: `The SAVE Act (Safeguard American Voter Eligibility Act) requires individuals to provide documentary proof of United States citizenship in order to register to vote in federal elections.

The bill amends the National Voter Registration Act of 1993 to prohibit states from accepting voter registration applications for federal elections unless the applicant provides documentary proof of citizenship such as a U.S. passport, birth certificate, or REAL ID-compliant identification indicating citizenship. Standard driver's licenses would not suffice since they generally do not indicate citizenship status.

It requires states to establish alternative processes for applicants without standard documentation and mandates the removal of noncitizens from voter rolls. The bill includes criminal penalties of up to 5 years imprisonment for election officials who register applicants without proper documentation.

Critics argue the bill would create significant barriers for eligible citizens, particularly the estimated 69 million women whose names don't match birth certificates, communities far from government offices, and that noncitizen voting is already illegal and extremely rare. The bill passed the House in February 2026 and applies to states covered by the NVRA (exempting ID, MN, NH, ND, WI, and WY).`,
    keyProvisions: [
      'Documentary proof of U.S. citizenship required for voter registration',
      'Acceptable documents: passport, birth certificate, REAL ID with citizenship indicator',
      'Standard driver\'s licenses not sufficient (no citizenship indicator)',
      'States must establish alternative verification process',
      'Mandatory removal of noncitizens from voter rolls',
      'Criminal penalties up to 5 years for officials registering without proof',
      'Private right of action against non-compliant election officials',
      'Provisional ballot protections preserved',
      'Effective immediately upon enactment (no transition period)',
      'Exempts states not covered by NVRA (ID, MN, NH, ND, WI, WY)',
    ],
    sections: [
      {
        id: 'sa-s1',
        title: 'Section 1 — Documentary Proof of Citizenship Requirement',
        content: `Amends the National Voter Registration Act of 1993 to require that each state shall not accept or process an application to register to vote in an election for Federal office unless the applicant provides documentary proof of United States citizenship.

Acceptable forms of documentary proof include:
(a) A form of identification that complies with the requirements of the REAL ID Act of 2005 and indicates United States citizenship status.
(b) A valid United States passport or passport card.
(c) A certified copy of a birth certificate or extract showing birth in the United States, or in a U.S. territory.
(d) A Consular Report of Birth Abroad or Certificate of Citizenship issued by the Department of State.
(e) A certificate of naturalization issued by DHS.
(f) Other documents as the Election Assistance Commission may prescribe.

Note: Standard state driver's licenses are generally not acceptable as they do not indicate citizenship.`,
      },
      {
        id: 'sa-s2',
        title: 'Section 2 — Alternative Verification Process',
        content: `Each state shall establish an alternative process under which an applicant who does not possess the documentary proof described in Section 1 may submit other evidence to demonstrate United States citizenship.

Under such alternative process, an applicant may present:
(a) Government-issued documentation that, when combined with other records, demonstrates citizenship.
(b) A sworn affidavit from the applicant attesting to citizenship status, accompanied by corroborating documentation.
(c) Verification through federal databases accessible to state election officials.

The state must verify the applicant's citizenship through the alternative process before completing the registration. The burden of establishing citizenship falls on the applicant.`,
      },
      {
        id: 'sa-s3',
        title: 'Section 3 — Voter Roll Maintenance and Noncitizen Removal',
        content: `Each state shall establish procedures to identify and remove noncitizens from the official list of eligible voters for Federal elections.

States shall coordinate with the Department of Homeland Security to identify registrants who are not United States citizens, using the Systematic Alien Verification for Entitlements (SAVE) database and any other available federal records.

Upon identifying a registrant who is not a citizen, the state shall send notice to the individual and provide an opportunity to respond before removal. If the individual does not respond within 30 days or cannot demonstrate citizenship, the state shall remove the individual from the voter rolls.

States must conduct such verification on a regular basis and report annually to the Election Assistance Commission on the number of noncitizens identified and removed.`,
      },
      {
        id: 'sa-s4',
        title: 'Section 4 — Penalties and Enforcement',
        content: `Criminal Penalties: Any election official who knowingly registers an applicant to vote in a Federal election when such applicant has not provided the documentary proof of citizenship required under this Act shall be fined under title 18, imprisoned not more than 5 years, or both.

Any individual who knowingly provides false information regarding citizenship status on a voter registration application shall be fined, imprisoned not more than 5 years, or both.

Private Right of Action: Any person who is aggrieved by a violation of this Act may bring a civil action in the appropriate United States District Court for declaratory or injunctive relief against an election official who registers applicants without the required proof of citizenship.

Sec. 5 — Election Assistance Commission Guidance. The Election Assistance Commission shall issue guidance to the states regarding compliance with this Act not later than 10 days after the date of enactment.

Sec. 6 — Rule of Construction Regarding Provisional Ballots. Nothing in this Act shall be construed to supersede, restrict, or otherwise affect the ability of an individual to cast a provisional ballot under applicable state law.`,
      },
    ],
  },
];

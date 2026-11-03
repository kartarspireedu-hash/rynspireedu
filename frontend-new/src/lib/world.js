// Every country we may hear from: ISO code (for the flag), name, phone dial
// code, and its IANA timezone(s) — first one is the main/default.
// Format per line:  ISO|Name|dial|zone,zone,...
const RAW = `
AF|Afghanistan|+93|Asia/Kabul
AL|Albania|+355|Europe/Tirane
DZ|Algeria|+213|Africa/Algiers
AS|American Samoa|+1684|Pacific/Pago_Pago
AD|Andorra|+376|Europe/Andorra
AO|Angola|+244|Africa/Luanda
AI|Anguilla|+1264|America/Anguilla
AG|Antigua and Barbuda|+1268|America/Antigua
AR|Argentina|+54|America/Argentina/Buenos_Aires
AM|Armenia|+374|Asia/Yerevan
AW|Aruba|+297|America/Aruba
AU|Australia|+61|Australia/Sydney,Australia/Melbourne,Australia/Brisbane,Australia/Adelaide,Australia/Perth,Australia/Darwin,Australia/Hobart
AT|Austria|+43|Europe/Vienna
AZ|Azerbaijan|+994|Asia/Baku
BS|Bahamas|+1242|America/Nassau
BH|Bahrain|+973|Asia/Bahrain
BD|Bangladesh|+880|Asia/Dhaka
BB|Barbados|+1246|America/Barbados
BY|Belarus|+375|Europe/Minsk
BE|Belgium|+32|Europe/Brussels
BZ|Belize|+501|America/Belize
BJ|Benin|+229|Africa/Porto-Novo
BM|Bermuda|+1441|Atlantic/Bermuda
BT|Bhutan|+975|Asia/Thimphu
BO|Bolivia|+591|America/La_Paz
BA|Bosnia and Herzegovina|+387|Europe/Sarajevo
BW|Botswana|+267|Africa/Gaborone
BR|Brazil|+55|America/Sao_Paulo,America/Manaus,America/Fortaleza,America/Rio_Branco
VG|British Virgin Islands|+1284|America/Tortola
BN|Brunei|+673|Asia/Brunei
BG|Bulgaria|+359|Europe/Sofia
BF|Burkina Faso|+226|Africa/Ouagadougou
BI|Burundi|+257|Africa/Bujumbura
KH|Cambodia|+855|Asia/Phnom_Penh
CM|Cameroon|+237|Africa/Douala
CA|Canada|+1|America/Toronto,America/Vancouver,America/Edmonton,America/Winnipeg,America/Halifax,America/St_Johns
CV|Cape Verde|+238|Atlantic/Cape_Verde
KY|Cayman Islands|+1345|America/Cayman
CF|Central African Republic|+236|Africa/Bangui
TD|Chad|+235|Africa/Ndjamena
CL|Chile|+56|America/Santiago
CN|China|+86|Asia/Shanghai
CO|Colombia|+57|America/Bogota
KM|Comoros|+269|Indian/Comoro
CG|Congo|+242|Africa/Brazzaville
CD|Congo (DR)|+243|Africa/Kinshasa,Africa/Lubumbashi
CK|Cook Islands|+682|Pacific/Rarotonga
CR|Costa Rica|+506|America/Costa_Rica
CI|Côte d'Ivoire|+225|Africa/Abidjan
HR|Croatia|+385|Europe/Zagreb
CU|Cuba|+53|America/Havana
CW|Curaçao|+599|America/Curacao
CY|Cyprus|+357|Asia/Nicosia
CZ|Czechia|+420|Europe/Prague
DK|Denmark|+45|Europe/Copenhagen
DJ|Djibouti|+253|Africa/Djibouti
DM|Dominica|+1767|America/Dominica
DO|Dominican Republic|+1809|America/Santo_Domingo
EC|Ecuador|+593|America/Guayaquil
EG|Egypt|+20|Africa/Cairo
SV|El Salvador|+503|America/El_Salvador
GQ|Equatorial Guinea|+240|Africa/Malabo
ER|Eritrea|+291|Africa/Asmara
EE|Estonia|+372|Europe/Tallinn
SZ|Eswatini|+268|Africa/Mbabane
ET|Ethiopia|+251|Africa/Addis_Ababa
FO|Faroe Islands|+298|Atlantic/Faroe
FJ|Fiji|+679|Pacific/Fiji
FI|Finland|+358|Europe/Helsinki
FR|France|+33|Europe/Paris
PF|French Polynesia|+689|Pacific/Tahiti
GA|Gabon|+241|Africa/Libreville
GM|Gambia|+220|Africa/Banjul
GE|Georgia|+995|Asia/Tbilisi
DE|Germany|+49|Europe/Berlin
GH|Ghana|+233|Africa/Accra
GI|Gibraltar|+350|Europe/Gibraltar
GR|Greece|+30|Europe/Athens
GD|Grenada|+1473|America/Grenada
GU|Guam|+1671|Pacific/Guam
GT|Guatemala|+502|America/Guatemala
GN|Guinea|+224|Africa/Conakry
GW|Guinea-Bissau|+245|Africa/Bissau
GY|Guyana|+592|America/Guyana
HT|Haiti|+509|America/Port-au-Prince
HN|Honduras|+504|America/Tegucigalpa
HK|Hong Kong|+852|Asia/Hong_Kong
HU|Hungary|+36|Europe/Budapest
IS|Iceland|+354|Atlantic/Reykjavik
IN|India|+91|Asia/Kolkata
ID|Indonesia|+62|Asia/Jakarta,Asia/Makassar,Asia/Jayapura
IR|Iran|+98|Asia/Tehran
IQ|Iraq|+964|Asia/Baghdad
IE|Ireland|+353|Europe/Dublin
IL|Israel|+972|Asia/Jerusalem
IT|Italy|+39|Europe/Rome
JM|Jamaica|+1876|America/Jamaica
JP|Japan|+81|Asia/Tokyo
JO|Jordan|+962|Asia/Amman
KZ|Kazakhstan|+7|Asia/Almaty,Asia/Aqtau
KE|Kenya|+254|Africa/Nairobi
KI|Kiribati|+686|Pacific/Tarawa
XK|Kosovo|+383|Europe/Belgrade
KW|Kuwait|+965|Asia/Kuwait
KG|Kyrgyzstan|+996|Asia/Bishkek
LA|Laos|+856|Asia/Vientiane
LV|Latvia|+371|Europe/Riga
LB|Lebanon|+961|Asia/Beirut
LS|Lesotho|+266|Africa/Maseru
LR|Liberia|+231|Africa/Monrovia
LY|Libya|+218|Africa/Tripoli
LI|Liechtenstein|+423|Europe/Vaduz
LT|Lithuania|+370|Europe/Vilnius
LU|Luxembourg|+352|Europe/Luxembourg
MO|Macao|+853|Asia/Macau
MG|Madagascar|+261|Indian/Antananarivo
MW|Malawi|+265|Africa/Blantyre
MY|Malaysia|+60|Asia/Kuala_Lumpur
MV|Maldives|+960|Indian/Maldives
ML|Mali|+223|Africa/Bamako
MT|Malta|+356|Europe/Malta
MH|Marshall Islands|+692|Pacific/Majuro
MR|Mauritania|+222|Africa/Nouakchott
MU|Mauritius|+230|Indian/Mauritius
MX|Mexico|+52|America/Mexico_City,America/Cancun,America/Tijuana
FM|Micronesia|+691|Pacific/Pohnpei
MD|Moldova|+373|Europe/Chisinau
MC|Monaco|+377|Europe/Monaco
MN|Mongolia|+976|Asia/Ulaanbaatar
ME|Montenegro|+382|Europe/Podgorica
MS|Montserrat|+1664|America/Montserrat
MA|Morocco|+212|Africa/Casablanca
MZ|Mozambique|+258|Africa/Maputo
MM|Myanmar|+95|Asia/Yangon
NA|Namibia|+264|Africa/Windhoek
NR|Nauru|+674|Pacific/Nauru
NP|Nepal|+977|Asia/Kathmandu
NL|Netherlands|+31|Europe/Amsterdam
NC|New Caledonia|+687|Pacific/Noumea
NZ|New Zealand|+64|Pacific/Auckland
NI|Nicaragua|+505|America/Managua
NE|Niger|+227|Africa/Niamey
NG|Nigeria|+234|Africa/Lagos
KP|North Korea|+850|Asia/Pyongyang
MK|North Macedonia|+389|Europe/Skopje
MP|Northern Mariana Islands|+1670|Pacific/Saipan
NO|Norway|+47|Europe/Oslo
OM|Oman|+968|Asia/Muscat
PK|Pakistan|+92|Asia/Karachi
PW|Palau|+680|Pacific/Palau
PS|Palestine|+970|Asia/Gaza
PA|Panama|+507|America/Panama
PG|Papua New Guinea|+675|Pacific/Port_Moresby
PY|Paraguay|+595|America/Asuncion
PE|Peru|+51|America/Lima
PH|Philippines|+63|Asia/Manila
PL|Poland|+48|Europe/Warsaw
PT|Portugal|+351|Europe/Lisbon
PR|Puerto Rico|+1787|America/Puerto_Rico
QA|Qatar|+974|Asia/Qatar
RE|Réunion|+262|Indian/Reunion
RO|Romania|+40|Europe/Bucharest
RU|Russia|+7|Europe/Moscow,Asia/Yekaterinburg,Asia/Novosibirsk,Asia/Vladivostok
RW|Rwanda|+250|Africa/Kigali
KN|Saint Kitts and Nevis|+1869|America/St_Kitts
LC|Saint Lucia|+1758|America/St_Lucia
VC|Saint Vincent and the Grenadines|+1784|America/St_Vincent
WS|Samoa|+685|Pacific/Apia
SM|San Marino|+378|Europe/San_Marino
ST|São Tomé and Príncipe|+239|Africa/Sao_Tome
SA|Saudi Arabia|+966|Asia/Riyadh
SN|Senegal|+221|Africa/Dakar
RS|Serbia|+381|Europe/Belgrade
SC|Seychelles|+248|Indian/Mahe
SL|Sierra Leone|+232|Africa/Freetown
SG|Singapore|+65|Asia/Singapore
SK|Slovakia|+421|Europe/Bratislava
SI|Slovenia|+386|Europe/Ljubljana
SB|Solomon Islands|+677|Pacific/Guadalcanal
SO|Somalia|+252|Africa/Mogadishu
ZA|South Africa|+27|Africa/Johannesburg
KR|South Korea|+82|Asia/Seoul
SS|South Sudan|+211|Africa/Juba
ES|Spain|+34|Europe/Madrid,Atlantic/Canary
LK|Sri Lanka|+94|Asia/Colombo
SD|Sudan|+249|Africa/Khartoum
SR|Suriname|+597|America/Paramaribo
SE|Sweden|+46|Europe/Stockholm
CH|Switzerland|+41|Europe/Zurich
SY|Syria|+963|Asia/Damascus
TW|Taiwan|+886|Asia/Taipei
TJ|Tajikistan|+992|Asia/Dushanbe
TZ|Tanzania|+255|Africa/Dar_es_Salaam
TH|Thailand|+66|Asia/Bangkok
TL|Timor-Leste|+670|Asia/Dili
TG|Togo|+228|Africa/Lome
TO|Tonga|+676|Pacific/Tongatapu
TT|Trinidad and Tobago|+1868|America/Port_of_Spain
TN|Tunisia|+216|Africa/Tunis
TR|Türkiye|+90|Europe/Istanbul
TM|Turkmenistan|+993|Asia/Ashgabat
TC|Turks and Caicos Islands|+1649|America/Grand_Turk
TV|Tuvalu|+688|Pacific/Funafuti
UG|Uganda|+256|Africa/Kampala
UA|Ukraine|+380|Europe/Kyiv
AE|United Arab Emirates|+971|Asia/Dubai
GB|United Kingdom|+44|Europe/London
US|United States|+1|America/New_York,America/Chicago,America/Denver,America/Phoenix,America/Los_Angeles,America/Anchorage,Pacific/Honolulu
VI|US Virgin Islands|+1340|America/St_Thomas
UY|Uruguay|+598|America/Montevideo
UZ|Uzbekistan|+998|Asia/Tashkent
VU|Vanuatu|+678|Pacific/Efate
VA|Vatican City|+379|Europe/Vatican
VE|Venezuela|+58|America/Caracas
VN|Vietnam|+84|Asia/Ho_Chi_Minh
YE|Yemen|+967|Asia/Aden
ZM|Zambia|+260|Africa/Lusaka
ZW|Zimbabwe|+263|Africa/Harare
`;

export function isoToFlag(iso2) {
  if (!iso2 || iso2.length !== 2) return "🌐";
  return String.fromCodePoint(...[...iso2.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}

// Shown first in every list (our core markets + most common enquiries).
const PRIORITY = ["AU", "NZ", "US", "CA", "GB", "IN", "SG", "AE", "TZ"];

const parsed = RAW.trim().split("\n").map((line) => {
  const [iso, name, dial, zones] = line.split("|");
  return { iso, name, dial, zones: zones.split(",") };
});

export const COUNTRIES_WORLD = [
  ...PRIORITY.map((iso) => parsed.find((c) => c.iso === iso)),
  ...parsed.filter((c) => !PRIORITY.includes(c.iso)).sort((a, b) => a.name.localeCompare(b.name)),
];

export const countryByIso = (iso) => COUNTRIES_WORLD.find((c) => c.iso === iso);
export const countryByName = (name) => COUNTRIES_WORLD.find((c) => c.name.toLowerCase() === String(name || "").toLowerCase());

// "Africa/Dar_es_Salaam" -> "Dar es Salaam"
export const cityOfZone = (zone) => zone.split("/").pop().replace(/_/g, " ");

// Live UTC offset (e.g. "UTC+3"), computed now so daylight saving is right.
export function utcOffset(zone) {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "shortOffset" })
      .formatToParts(new Date()).find((p) => p.type === "timeZoneName");
    return part ? part.value.replace("GMT", "UTC") : "";
  } catch {
    return "";
  }
}

// One row per (country, zone): "🇹🇿 Tanzania · Dar es Salaam (UTC+3)".
export const ALL_TIMEZONES = COUNTRIES_WORLD.flatMap((c) =>
  c.zones.map((zone) => ({
    key: `${c.iso}|${zone}`, iso: c.iso, country: c.name, zone,
    label: `${isoToFlag(c.iso)} ${c.name} · ${cityOfZone(zone)} (${utcOffset(zone)})`,
  }))
);

// Label for a zone we only know by IANA name (falls back gracefully).
export function zoneLabel(zone, iso) {
  const hit = ALL_TIMEZONES.find((t) => t.zone === zone && (!iso || t.iso === iso)) || ALL_TIMEZONES.find((t) => t.zone === zone);
  return hit ? hit.label : `${zone.replace(/_/g, " ")} (${utcOffset(zone)})`;
}

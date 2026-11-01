export const medicineCountries=[['BD','Bangladesh'],['US','United States'],['SA','Saudi Arabia'],['NL','Netherlands'],['DE','Germany']];
export const medicineGroups=['Paracetamol','Ibuprofen','Omeprazole','Chlorpheniramine Maleate'];
export function genericGroup(value){const v=String(value||'').trim();return ({paracetamol:'Paracetamol',acetaminophen:'Paracetamol',ibuprofen:'Ibuprofen',omeprazole:'Omeprazole',chlorpheniramine:'Chlorpheniramine Maleate','chlorpheniramine maleate':'Chlorpheniramine Maleate'})[v.toLowerCase()]||v}
const entries=[
['BD','Paracetamol','Napa','Paracetamol','500 mg','tablet','https://beximco-pharma.com/cdn/bpl/product/pdf/napa.pdf'],
['BD','Paracetamol','Ace','Paracetamol','500 mg','tablet','https://www.squarepharma.com.bd/bc/all_pdts.php'],
['BD','Omeprazole','Seclo','Omeprazole','20 mg','capsule','https://www.squarepharma.com.bd/product-details.php?pid=10'],
['BD','Chlorpheniramine Maleate','Histacin','Chlorpheniramine Maleate','4 mg','tablet','https://jaysongroupbd.com/welcome/product_details/72'],
['US','Paracetamol','TYLENOL EXTRA STRENGTH','Acetaminophen','500 mg','tablet','https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=201b860d-dc3c-4380-affa-e757bf2103cf'],
['US','Ibuprofen','Advil','Ibuprofen','200 mg','tablet','https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3ca752d8-957c-21b4-e063-6294a90a5285'],
['SA','Paracetamol','PANADOL','Paracetamol','500 mg','tablet','https://www.sfda.gov.sa/en/details_data?id=5-288-99&nid=17582&page=0'],
['SA','Ibuprofen','BRUFEN','Ibuprofen','400 mg','tablet','https://www.sfda.gov.sa/ar/details_data?id=IBUPROFEN&nid=17592&page=28'],
['NL','Paracetamol','Paracetamol Teva','Paracetamol','500 mg','tablet','https://www.geneesmiddeleninformatiebank.nl/en/rvg33387'],
['NL','Ibuprofen','Ibuprofen Teva','Ibuprofen','400 mg','tablet','https://www.teva.nl/our-products/product-catalog/'],
['DE','Paracetamol','Paracetamol-ratiopharm','Paracetamol','500 mg','tablet','https://www.ratiopharm.de/produkte/details/paracetamol-ratiopharm-500-mg-tabletten-pzn-1126111/'],
['DE','Ibuprofen','Ibu-ratiopharm','Ibuprofen','400 mg','tablet','https://www.ratiopharm.de/assets/products/de/pkg_insert/Ibu-ratiopharm%20400%20mg%20Filmtabletten%20-%205.pdf?pzn=8531257']
];
export const groupedMedicines=entries.map(([country,group,name,generic,strength,unit,source])=>({country,group,name,generic,strength,unit,source}));
export function groupChoices(products,country){return [...new Set([...medicineGroups,...products.filter(p=>(p.country||p.origin?.country||'BD')===country).map(p=>genericGroup(p.generic)).filter(Boolean)])]}
export function medicinesInGroup(products,country,group){const list=[...groupedMedicines,...products.map(p=>({country:p.country||p.origin?.country||'BD',group:genericGroup(p.generic),name:p.name,generic:p.generic,strength:p.strength,unit:p.unit,source:'',own:true}))],unique=new Map();for(const item of list){if(item.country!==country||item.group!==group)continue;const key=[item.name,item.strength,item.unit].join('|').toLowerCase();if(!unique.has(key))unique.set(key,item)}return [...unique.values()].sort((a,b)=>a.name.localeCompare(b.name))}

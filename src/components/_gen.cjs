// gen.js - generates knowledge data
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:\\Project\\ChemistryLab\\src\\components\\_kb.json', 'utf8'));
const cats = data.categories;
const items = data.items;
let out = '// 高中化学知识库 - 全面覆盖\n\nexport const knowledgeCategories = ' + JSON.stringify(cats, null, 2) + ';\n\nexport const knowledgeItems = [\n';
for (const it of items) {
  out += '  {category:' + JSON.stringify(it.category) + ',title:' + JSON.stringify(it.title) + ',content:' + JSON.stringify(it.content) + ',examples:' + JSON.stringify(it.examples) + ',keyPoints:' + JSON.stringify(it.keyPoints) + '},\n';
}
out += '];\n';
fs.writeFileSync('C:\\Project\\ChemistryLab\\src\\components\\knowledgeData.js', out, 'utf8');
console.log('Written', items.length, 'items');

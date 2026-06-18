const fs = require('fs');
const p = 'C:\\Project\\ChemistryLab\\src\\components\\knowledgeData.js';

const items = [
  {category:"acid-base",title:"强酸+强碱—中和反应",content:"强酸与强碱完全中和生成盐和水，溶液呈中性。中和反应均为放热反应。",examples:["HCl + NaOH → NaCl + H₂O","H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O","HNO₃ + KOH → KNO₃ + H₂O","H₂SO₄ + Ba(OH)₂ → BaSO₄↓ + 2H₂O"],keyPoints:["放热反应","pH→7","生成盐和水"]},
  {category:"acid-base",title:"强酸+弱碱—中和反应",content:"强酸与弱碱反应，沉淀溶解，生成盐和水。",examples:["2HCl + Cu(OH)₂ → CuCl₂ + 2H₂O","3HCl + Fe(OH)₃ → FeCl₃ + 3H₂O","2HCl + Mg(OH)₂ → MgCl₂ + 2H₂O","2HCl + Fe(OH)₂ → FeCl₂ + 2H₂O"],keyPoints:["弱碱溶于强酸","沉淀溶解"]},
  {category:"acid-base",title:"两性氢氧化物",content:"Al(OH)₃和Zn(OH)₂既能与酸反应又能与碱反应。",examples:["Al(OH)₃ + 3HCl → AlCl₃ + 3H₂O","Al(OH)₃ + NaOH → NaAlO₂ + 2H₂O","Zn(OH)₂ + 2HCl → ZnCl₂ + 2H₂O","Zn(OH)₂ + 2NaOH → Na₂ZnO₂ + 2H₂O"],keyPoints:["既能与酸反应又能与碱反应","Al(OH)₃制备和溶解"]},
  {category:"acid-base",title:"酸+碳酸盐/碳酸氢盐",content:"强酸可以制弱酸。碳酸盐/碳酸氢盐遇酸冒泡(CO₂)。",examples:["2HCl + Na₂CO₃ → 2NaCl + H₂O + CO₂↑","HCl + NaHCO₃ → NaCl + H₂O + CO₂↑","2HCl + CaCO₃ → CaCl₂ + H₂O + CO₂↑","H₂SO₄ + Na₂CO₃ → Na₂SO₄ + H₂O + CO₂↑"],keyPoints:["强酸制弱酸","碳酸盐遇酸冒泡","实验室制CO₂"]},
  {category:"acid-base",title:"酸+金属→盐+H₂↑",content:"活泼金属与稀酸反应生成盐和氢气。金属活动性：K>Ca>Na>Mg>Al>Zn>Fe>Sn>Pb>(H)>Cu>Hg>Ag>Pt>Au",examples:["Zn + H₂SO₄(稀) → ZnSO₄ + H₂↑","Fe + 2HCl → FeCl₂ + H₂↑","Mg + 2HCl → MgCl₂ + H₂↑","2Al + 6HCl → 2AlCl₃ + 3H₂↑"],keyPoints:["H前金属才能置换酸中氢","铁生成Fe²⁺(浅绿色)","浓HNO₃/浓H₂SO₄使Fe/Al钝化"]},
  {category:"acid-base",title:"碱+非金属氧化物",content:"碱溶液吸收酸性氧化物（CO₂、SO₂、SO₃等）。",examples:["2NaOH + CO₂ → Na₂CO₃ + H₂O","NaOH + CO₂(过量) → NaHCO₃","2NaOH + SO₂ → Na₂SO₃ + H₂O","Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O（检验CO₂）"],keyPoints:["澄清石灰水变浑浊检验CO₂","NaOH吸收尾气","过量CO₂使CaCO₃溶解"]},
  {category:"acid-base",title:"盐类水解",content:"盐的离子与水电离出的H⁺或OH⁻结合生成弱电解质。有弱才水解，越弱越水解。",examples:["NH₄Cl + H₂O ⇌ NH₃·H₂O + HCl（酸性）","CH₃COONa + H₂O ⇌ CH₃COOH + NaOH（碱性）","Na₂CO₃ + H₂O ⇌ NaHCO₃ + NaOH（碱性）","FeCl₃ + 3H₂O ⇌ Fe(OH)₃ + 3HCl（酸性）"],keyPoints:["强酸弱碱盐→酸性","强碱弱酸盐→碱性","水解吸热"]},
  {category:"acid-base",title:"酸碱指示剂",content:"石蕊：酸红碱蓝；酚酞：酸无碱红；甲基橙：酸红碱黄。",examples:["石蕊遇酸→红色，遇碱→蓝色","酚酞遇酸→无色，遇碱→红色","甲基橙遇酸→红色，遇碱→黄色"],keyPoints:["变色范围不同","判断酸碱性","不能精确测pH"]},
  {category:"precipitation",title:"银盐沉淀",content:"Ag⁺与Cl⁻、Br⁻、I⁻分别生成白色、淡黄色、黄色沉淀，均不溶于稀HNO₃。",examples:["AgNO₃ + NaCl → AgCl↓(白) + NaNO₃","AgNO₃ + KBr → AgBr↓(淡黄) + KNO₃","AgNO₃ + KI → AgI↓(黄) + KNO₃"],keyPoints:["AgCl白色","AgBr淡黄色","AgI黄色","均不溶于稀HNO₃"]},
  {category:"precipitation",title:"钡盐沉淀",content:"Ba²⁺与SO₄²⁻、CO₃²⁻均生成白色沉淀。BaSO₄不溶于酸，BaCO₃溶于酸。",examples:["BaCl₂ + Na₂SO₄ → BaSO₄↓(白) + 2NaCl","BaCl₂ + Na₂CO₃ → BaCO₃↓(白) + 2NaCl"],keyPoints:["BaSO₄不溶于酸（检验SO₄²⁻）","BaCO₃溶于酸"]},
  {category:"precipitation",title:"铁离子/亚铁离子沉淀",content:"Fe³⁺+OH⁻→红褐色Fe(OH)₃；Fe²⁺+OH⁻→白色→灰绿→红褐色Fe(OH)₂。",examples:["FeCl₃ + 3NaOH → Fe(OH)₃↓(红褐色) + 3NaCl","FeSO₄ + 2NaOH → Fe(OH)₂↓(白色) + Na₂SO₄","4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃"],keyPoints:["Fe(OH)₃红褐色","Fe(OH)₂白色→灰绿→红褐","颜色变化体现氧化"]},
  {category:"precipitation",title:"铜离子沉淀",content:"Cu²⁺+OH⁻→蓝色Cu(OH)₂；Cu²⁺+S²⁻→黑色CuS。",examples:["CuSO₄ + 2NaOH → Cu(OH)₂↓(蓝) + Na₂SO₄","CuSO₄ + Na₂S → CuS↓(黑) + Na₂SO₄"],keyPoints:["Cu(OH)₂蓝色","CuS黑色"]},
  {category:"precipitation",title:"碳酸盐/氢氧化物沉淀",content:"Ca²⁺、Ba²⁺、Mg²⁺等与CO₃²⁻生成白色碳酸盐沉淀。",examples:["Na₂CO₃ + CaCl₂ → CaCO₃↓(白) + 2NaCl","MgCl₂ + 2NaOH → Mg(OH)₂↓(白) + 2NaCl","AlCl₃ + 3NaOH → Al(OH)₃↓(白) + 3NaCl"],keyPoints:["CaCO₃白色","均溶于酸"]},
  {category:"precipitation",title:"铅/锌/硫化物沉淀",content:"Pb²⁺、Zn²⁺等金属离子的硫化物和特殊沉淀。",examples:["Pb(NO₃)₂ + Na₂S → PbS↓(黑) + 2NaNO₃","Pb(NO₃)₂ + 2KI → PbI₂↓(金黄) + 2KNO₃","Na₂S + CuSO₄ → CuS↓(黑) + Na₂SO₄"],keyPoints:["PbS黑色","PbI₂金黄色"]},
  {category:"redox",title:"金属与浓硫酸反应",content:"浓硫酸具有强氧化性，能与Cu、C等不活泼物质在加热条件下反应。",examples:["Cu + 2H₂SO₄(浓) →(Δ) CuSO₄ + SO₂↑ + 2H₂O","C + 2H₂SO₄(浓) →(Δ) CO₂↑ + 2SO₂↑ + 2H₂O"],keyPoints:["浓H₂SO₄有强氧化性","稀H₂SO₄无氧化性","加热条件下反应"]},
  {category:"redox",title:"金属与硝酸反应",content:"HNO₃具有强氧化性。稀HNO₃→NO，浓HNO₃→NO₂。Fe/Al在浓HNO₃中钝化。",examples:["3Cu + 8HNO₃(稀) → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O","Cu + 4HNO₃(浓) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O","Fe + 4HNO₃(稀) → Fe(NO₃)₃ + NO↑ + 2H₂O"],keyPoints:["稀HNO₃→NO(无色)","浓HNO₃→NO₂(红棕色)","浓HNO₃使Fe/Al钝化"]},
  {category:"redox",title:"氯气的氧化性",content:"Cl₂是强氧化剂，能氧化Fe²⁺、I⁻、S²⁻等还原性物质。",examples:["Cl₂ + 2FeCl₂ → 2FeCl₃","Cl₂ + 2KI → 2KCl + I₂","Cl₂ + Na₂S → 2NaCl + S↓","Cl₂ + H₂O ⇌ HCl + HClO","Cl₂ + 2NaOH → NaCl + NaClO + H₂O"],keyPoints:["Cl₂>Br₂>I₂>S氧化性","氯水含Cl₂/HCl/HClO","NaOH吸收多余Cl₂"]},
  {category:"redox",title:"铁的氧化还原",content:"铁与弱氧化剂(S/I₂)→Fe²⁺；与强氧化剂(Cl₂)→Fe³⁺。",examples:["Fe + S →(Δ) FeS","2Fe + 3Cl₂ →(点燃) 2FeCl₃","3Fe + 4H₂O →(高温) Fe₃O₄ + 4H₂↑","Cu + 2FeCl₃ → CuCl₂ + 2FeCl₂"],keyPoints:["弱氧化剂→Fe²⁺","强氧化剂→Fe³⁺","Cu被Fe³⁺氧化(刻蚀电路板)"]},
  {category:"redox",title:"钠与非金属反应",content:"钠非常活泼，与O₂、Cl₂、S等反应。",examples:["4Na + O₂ → 2Na₂O（常温）","2Na + O₂ →(点燃) Na₂O₂（淡黄色）","2Na + Cl₂ →(点燃) 2NaCl","2Na + S → Na₂S（研磨爆炸）"],keyPoints:["常温→Na₂O","点燃→Na₂O₂","钠保存在煤油中"]},
  {category:"redox",title:"非金属之间的氧化还原",content:"非金属单质之间也能发生氧化还原反应。",examples:["H₂ + Cl₂ →(点燃) 2HCl（苍白色火焰）","N₂ + O₂ →(放电) 2NO","2NO + O₂ → 2NO₂","3NO₂ + H₂O → 2HNO₃ + NO","S + O₂ →(点燃) SO₂","C + O₂ →(点燃) CO₂"],keyPoints:["NO无色→NO₂红棕色","闪电固氮","SO₂有刺激性气味"]},
  {category:"redox",title:"原电池原理",content:"化学能→电能。活泼金属负极氧化，不活泼金属正极还原。",examples:["Zn-Cu原电池：负极Zn→Zn²⁺+2e⁻，正极Cu²⁺+2e⁻→Cu","Zn-H₂SO₄-Cu：负极Zn溶解，Cu上冒H₂"],keyPoints:["负极氧化（活泼金属）","正极还原","电子从负极→正极"]},
  {category:"redox",title:"电解原理",content:"电能→化学能。阳极氧化，阴极还原。",examples:["电解水：2H₂O →(通电) 2H₂↑+O₂↑","电解CuCl₂：CuCl₂ →(通电) Cu+Cl₂↑","电解饱和NaCl：2NaCl+2H₂O →(通电) 2NaOH+H₂↑+Cl₂↑","电解熔融Al₂O₃：2Al₂O₃ →(通电) 4Al+3O₂↑"],keyPoints:["阳极氧化","阴极还原","与原电池相反"]},
  {category:"displacement",title:"金属与盐溶液置换",content:"活泼金属从不活泼金属盐溶液中置换出不活泼金属。",examples:["Fe + CuSO₄ → FeSO₄ + Cu（湿法炼铜）","Zn + CuSO₄ → ZnSO₄ + Cu","Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag"],keyPoints:["活泼金属置换不活泼金属","湿法炼铜","铁置换出Fe²⁺"]},
  {category:"displacement",title:"钾/钠与水反应",content:"碱金属与水剧烈反应，生成碱和H₂。钾比钠更剧烈。",examples:["2Na + 2H₂O → 2NaOH + H₂↑（浮、熔、游、响、红）","2K + 2H₂O → 2KOH + H₂↑（紫色火焰）"],keyPoints:["钠：浮熔游响红","钾更剧烈可能燃烧","保存在煤油中"]},
  {category:"displacement",title:"镁与热水/酸反应",content:"镁与冷水缓慢，与热水较快，与酸剧烈。",examples:["Mg + 2H₂O →(Δ) Mg(OH)₂ + H₂↑","Mg + 2HCl → MgCl₂ + H₂↑"],keyPoints:["Mg与热水反应","Mg在CO₂中也能燃烧"]},
  {category:"displacement",title:"铁与水蒸气反应",content:"铁在高温下与水蒸气反应生成Fe₃O₄和H₂。",examples:["3Fe + 4H₂O(g) →(高温) Fe₃O₄ + 4H₂↑"],keyPoints:["高温条件","生成Fe₃O₄(黑色)","湿棉花提供水蒸气"]},
  {category:"displacement",title:"铝热反应",content:"铝与金属氧化物高温置换，放出大量热(3000°C)。用于焊接铁轨。",examples:["2Al + Fe₂O₃ →(点燃) Al₂O₃ + 2Fe","8Al + 3Fe₃O₄ →(点燃) 4Al₂O₃ + 9Fe"],keyPoints:["放出大量热","焊接铁轨","需引燃剂(镁条+氯酸钾)"]},
  {category:"decomposition",title:"含氧酸/碱的热分解",content:"不稳定酸和碱受热分解为氧化物和水。",examples:["H₂CO₃ → H₂O + CO₂↑","Cu(OH)₂ →(Δ) CuO + H₂O","2Fe(OH)₃ →(Δ) Fe₂O₃ + 3H₂O","CaCO₃ →(高温) CaO + CO₂↑（工业制生石灰）"],keyPoints:["碳酸极不稳定","不溶性碱加热分解","工业烧石灰石"]},
  {category:"decomposition",title:"过氧化物/水电解",content:"H₂O₂在MnO₂催化下分解；水通电分解。",examples:["2H₂O₂ →(MnO₂) 2H₂O + O₂↑","2H₂O →(通电) 2H₂↑ + O₂↑"],keyPoints:["MnO₂是催化剂","H₂:O₂ = 2:1"]},
  {category:"decomposition",title:"含氧酸盐分解",content:"含氧酸盐受热分解，放出气体或生成氧化物。",examples:["2KMnO₄ →(Δ) K₂MnO₄ + MnO₂ + O₂↑","2KClO₃ →(Δ/MnO₂) 2KCl + 3O₂↑","2NaHCO₃ →(Δ) Na₂CO₃ + H₂O + CO₂↑","NH₄HCO₃ →(Δ) NH₃↑ + H₂O + CO₂↑"],keyPoints:["KMnO₄暗紫→绿色+黑色","KClO₃+MnO₂制O₂","NaHCO₃受热分解(发酵原理)"]},
  {category:"combination",title:"金属与非金属化合",content:"金属与非金属反应生成离子化合物。",examples:["2Na + Cl₂ →(点燃) 2NaCl","2Mg + O₂ →(点燃) 2MgO（耀眼白光）","2Fe + 3Cl₂ →(点燃) 2FeCl₃（棕褐色烟）","Fe + S →(Δ) FeS"],keyPoints:["Na黄色火焰","Mg耀眼白光","Fe+Cl₂→Fe³⁺，Fe+S→Fe²⁺"]},
  {category:"combination",title:"非金属与非金属化合",content:"非金属单质之间也能化合。",examples:["2H₂ + O₂ →(点燃) 2H₂O","N₂ + 3H₂ ⇌(高温高压/催化剂) 2NH₃","N₂ + O₂ →(放电) 2NO","2NO + O₂ → 2NO₂","3NO₂ + H₂O → 2HNO₃ + NO","S + O₂ →(点燃) SO₂","H₂ + Cl₂ →(点燃) 2HCl（苍白色火焰）"],keyPoints:["合成氨：高温高压+铁触媒","NO无色→NO₂红棕色","闪电固氮"]},
  {category:"combination",title:"氧化物与水化合",content:"酸性氧化物+水→酸；碱性氧化物+水→碱。",examples:["SO₃ + H₂O → H₂SO₄","SO₂ + H₂O ⇌ H₂SO₃","CO₂ + H₂O ⇌ H₂CO₃","NO₂ + H₂O → 2HNO₃ + NO（工业制硝酸）","CaO + H₂O → Ca(OH)₂（放大量热）","Na₂O₂ + 2H₂O → 2NaOH + H₂O₂（供氧剂）"],keyPoints:["SiO₂不溶于水","Na₂O₂是供氧剂/漂白剂","CaO+水放大量热"]},
  {category:"gas",title:"产生CO₂的反应",content:"碳酸盐与酸、碳酸氢盐受热分解产生CO₂。",examples:["CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑（实验室制CO₂）","NaHCO₃ + HCl → NaCl + H₂O + CO₂↑","2NaHCO₃ →(Δ) Na₂CO₃ + H₂O + CO₂↑"],keyPoints:["实验室用CaCO₃+稀HCl","NaHCO₃反应更快","CO₂使澄清石灰水变浑浊"]},
  {category:"gas",title:"产生H₂的反应",content:"金属与酸/水反应产生氢气。",examples:["Zn + H₂SO₄(稀) → ZnSO₄ + H₂↑（实验室制H₂）","2Na + 2H₂O → 2NaOH + H₂↑","2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑"],keyPoints:["实验室用Zn+稀H₂SO₄","Al也能与NaOH反应产H₂","H₂验纯后才能点燃"]},
  {category:"gas",title:"产生O₂的反应",content:"含氧酸盐分解或H₂O₂分解产生氧气。",examples:["2H₂O₂ →(MnO₂) 2H₂O + O₂↑（实验室制O₂）","2KClO₃ →(Δ/MnO₂) 2KCl + 3O₂↑","2KMnO₄ →(Δ) K₂MnO₄ + MnO₂ + O₂↑"],keyPoints:["H₂O₂+MnO₂最简便","KClO₃需加热","KMnO₄加热即可"]},
  {category:"gas",title:"产生NH₃/H₂S/SO₂的反应",content:"铵盐+碱→NH₃；硫化物+酸→H₂S；亚硫酸盐+酸→SO₂。",examples:["NH₄Cl + NaOH →(Δ) NaCl + H₂O + NH₃↑","Na₂S + 2HCl → 2NaCl + H₂S↑（臭鸡蛋气味）","Na₂SO₃ + 2HCl → 2NaCl + H₂O + SO₂↑"],keyPoints:["NH₃使湿润红色石蕊变蓝","H₂S有臭鸡蛋气味","SO₂有刺激性气味"]},
  {category:"oxide",title:"酸性氧化物+碱",content:"酸性氧化物（CO₂/SO₂/SO₃/SiO₂）与碱反应生成盐和水。",examples:["CO₂ + 2NaOH → Na₂CO₃ + H₂O","SO₂ + 2NaOH → Na₂SO₃ + H₂O","SiO₂ + 2NaOH →(高温) Na₂SiO₃ + H₂O"],keyPoints:["酸性氧化物+碱=盐+水","SiO₂需高温","玻璃瓶不能装NaOH"]},
  {category:"oxide",title:"碱性氧化物+酸",content:"碱性氧化物（CaO/CuO/Fe₂O₃/MgO等）与酸反应生成盐和水。",examples:["CuO + 2HCl → CuCl₂ + H₂O（黑色→蓝绿色）","CuO + H₂SO₄ → CuSO₄ + H₂O（黑色→蓝色）","Fe₂O₃ + 6HCl → 2FeCl₃ + 3H₂O（红棕色→黄色）"],keyPoints:["碱性氧化物+酸=盐+水","CuO+酸→蓝色","Fe₂O₃+酸→黄色"]},
  {category:"oxide",title:"Na₂O₂的特殊反应",content:"Na₂O₂既是氧化剂又是还原剂，与水/CO₂反应都产生O₂。",examples:["2Na₂O₂ + 2H₂O → 4NaOH + O₂↑","2Na₂O₂ + 2CO₂ → 2Na₂CO₃ + O₂"],keyPoints:["Na₂O₂与水/CO₂都产O₂","供氧剂（潜水艇/呼吸面具）","漂白剂"]},
  {category:"industrial",title:"工业制铝（碱溶法）",content:"铝土矿用NaOH溶解Al₂O₃，过滤除杂，通CO₂沉淀Al(OH)₃，煅烧得Al₂O₃，电解得Al。",examples:["Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O","NaAlO₂ + CO₂ + 2H₂O → Al(OH)₃↓ + NaHCO₃","2Al(OH)₃ →(Δ) Al₂O₃ + 3H₂O","2Al₂O₃(熔融) →(通电) 4Al + 3O₂↑"],keyPoints:["碱溶法除去SiO₂杂质","电解熔融Al₂O₃(加冰晶石降低熔点)","工业制铝三步骤"]},
  {category:"industrial",title:"工业制生石灰与造渣",content:"石灰石高温分解制生石灰(CaO)，副产品CO₂可回收利用。",examples:["CaCO₃ →(高温) CaO + CO₂↑","CaO + SiO₂ →(高温) CaSiO₃（造渣）","CaO + H₂O → Ca(OH)₂（熟石灰）"],keyPoints:["工业烧石灰石","CaO+SiO₂是高炉炼铁造渣反应","CaO是碱性氧化物"]},
  {category:"industrial",title:"合成氨与工业制硝酸",content:"工业合成氨（哈伯法）和工业制硝酸的核心反应。",examples:["N₂ + 3H₂ ⇌(高温高压/铁触媒) 2NH₃","4NH₃ + 5O₂ →(催化剂/Δ) 4NO + 6H₂O","2NO + O₂ → 2NO₂","3NO₂ + H₂O → 2HNO₃ + NO"],keyPoints:["合成氨：高温高压+铁触媒","催化氧化NH₃→NO","NO₂+水→HNO₃(循环利用NO)"]},
  {category:"organic",title:"甲烷的反应",content:"甲烷(CH₄)是最简单的有机物，天然气主要成分。",examples:["CH₄ + 2O₂ →(点燃) CO₂ + 2H₂O（燃烧）","CH₄ + Cl₂ →(光照) CH₃Cl + HCl（取代反应）"],keyPoints:["燃烧放热（天然气燃料）","取代反应需光照","不使KMnO₄/溴水褪色"]},
  {category:"organic",title:"乙烯的反应",content:"乙烯(C₂H₄)含C=C双键，能发生加成和氧化反应。",examples:["C₂H₄ + 3O₂ →(点燃) 2CO₂ + 2H₂O","C₂H₄ + Br₂ → CH₂BrCH₂Br（加成，溴水褪色）","nCH₂=CH₂ →(催化剂) [-CH₂-CH₂-]ₙ（加聚）"],keyPoints:["使溴水褪色（加成）","使KMnO₄褪色（氧化）","加聚反应制聚乙烯"]},
  {category:"organic",title:"乙炔的反应",content:"乙炔(C₂H₂)含C≡C三键，氧炔焰可切割金属。",examples:["2C₂H₂ + 5O₂ →(点燃) 4CO₂ + 2H₂O","C₂H₂ + 2Br₂ → CHBr₂CHBr₂（1:2加成）"],keyPoints:["氧炔焰切割金属","使溴水褪色（1:2加成）"]},
  {category:"organic",title:"乙醇的反应",content:"乙醇(C₂H₅OH)能与Na反应、催化氧化、燃烧。",examples:["2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑","2C₂H₅OH + O₂ →(Cu/Δ) 2CH₃CHO + 2H₂O"],keyPoints:["与Na反应放H₂","催化氧化得乙醛","醉驾检测原理"]},
  {category:"organic",title:"乙酸的反应",content:"乙酸(CH₃COOH)是弱酸，能发生酯化反应。",examples:["CH₃COOH + NaOH → CH₃COONa + H₂O","CH₃COOH + C₂H₅OH ⇌(浓H₂SO₄/Δ) CH₃COOC₂H₅ + H₂O"],keyPoints:["弱酸（酸性比碳酸强）","酯化反应（可逆）","乙酸乙酯有水果香味"]},
  {category:"indicator",title:"石蕊/酚酞/甲基橙",content:"三种常用酸碱指示剂的变色范围。",examples:["石蕊：pH<5红色，5-8紫色，>8蓝色","酚酞：pH<8无色，8-10浅红，>10红色","甲基橙：pH<3.1红色，3.1-4.4橙色，>4.4黄色"],keyPoints:["变色范围不同","不能精确测pH","石蕊最常用"]},
  {category:"indicator",title:"品红/淀粉/溴水",content:"其他常用指示剂和检验试剂。",examples:["SO₂使品红褪色（加热恢复）","淀粉遇I₂变蓝色","溴水(橙色)遇不饱和烃/还原剂褪色","酸性KMnO₄(紫色)遇还原剂褪色"],keyPoints:["SO₂漂白品红（可逆）","淀粉检验碘","溴水/KMnO₄检验不饱和烃和还原剂"]},
  {category:"iontest",title:"Cl⁻/Br⁻/I⁻检验",content:"用AgNO₃溶液检验卤素离子，加稀HNO₃排除干扰。",examples:["Cl⁻ + Ag⁺ → AgCl↓(白色，不溶于HNO₃)","Br⁻ + Ag⁺ → AgBr↓(淡黄色)","I⁻ + Ag⁺ → AgI↓(黄色)"],keyPoints:["AgCl白色不溶于HNO₃","AgBr淡黄色","AgI黄色","排除CO₃²⁻等干扰"]},
  {category:"iontest",title:"SO₄²⁻/CO₃²⁻检验",content:"用BaCl₂检验SO₄²⁻，用酸检验CO₃²⁻。",examples:["SO₄²⁻ + Ba²⁺ → BaSO₄↓(白色，不溶于酸)","CO₃²⁻ + 2H⁺ → H₂O + CO₂↑","CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O（验证CO₂）"],keyPoints:["先加酸排除干扰再加BaCl₂","CO₃²⁻加酸冒泡"]},
  {category:"iontest",title:"NH₄⁺/Fe³⁺/Fe²⁺检验",content:"铵根用碱+加热检验；铁离子用KSCN或NaOH检验。",examples:["NH₄⁺ + OH⁻ →(Δ) NH₃↑ + H₂O（使湿润红色石蕊变蓝）","Fe³⁺ + 3SCN⁻ → Fe(SCN)₃（血红色）","Fe³⁺ + 3OH⁻ → Fe(OH)₃↓(红褐色)","Fe²⁺ + 2OH⁻ → Fe(OH)₂↓(白色)"],keyPoints:["NH₃使湿润红色石蕊变蓝","Fe³⁺遇KSCN变血红色","Fe(OH)₂白色→灰绿→红褐"]},
];

let out = '';
for (const it of items) {
  out += '  {category:' + JSON.stringify(it.category) + ',title:' + JSON.stringify(it.title) + ',content:' + JSON.stringify(it.content) + ',examples:' + JSON.stringify(it.examples) + ',keyPoints:' + JSON.stringify(it.keyPoints) + '},\n';
}
out += '];\n';
fs.appendFileSync(p, out, 'utf8');
console.log('Appended', items.length, 'items, total size:', fs.statSync(p).size);

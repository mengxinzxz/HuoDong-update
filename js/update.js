//每次提交commit后自动更新info.json中的lastEditTime
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
//获取当前update.js所在目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//获取info.json
const infoPath = path.join(__dirname, '../info.json');
const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
//更新日期
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const hh = String(now.getHours()).padStart(2, '0');
const mi = String(now.getMinutes()).padStart(2, '0');
const ss = String(now.getSeconds()).padStart(2, '0');
info.lastEditTime = `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
fs.writeFileSync(infoPath, JSON.stringify(info, null, 4), 'utf8');
//终端输出，给鸟鸟看的
console.log(`本次commit提交时间: ${info.lastEditTime}`);

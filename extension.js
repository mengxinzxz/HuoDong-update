// game.import(name: "活动武将",
import { lib, game, ui, get, ai, _status } from '../../noname.js'
import { config } from './js/config.js'
import { precontent } from './js/precontent/index.js'
import { content } from './js/content/index.js'
import { help } from './js/help.js'

lib.init.css(lib.assetURL + 'extension/活动武将', 'extension');

let extensionPackage = {
	name: "活动武将",
	content: content,
	precontent: precontent,
	config: config,
	help: help,
	package: {
		intro: '新人制作扩展，希望大家支持。' +
			'<br>新人技术不足，希望大家包涵。' +
			'<br><a href="https://github.com/mengxinzxz/HuoDong-update.git">点击前往活动武将Github仓库</a>' +
			'<br><li>欢迎大家进群支持活动武将' +
			//入群二维码图片
			'<br><img style=width:238px src=' + lib.assetURL + 'extension/活动武将/HuoDong_QQ.png>' +
			'',
		author: '萌新（转型中）',
		diskURL: '',
		forumURL: '',
		version: '0.2.7',
		//新人制作扩展，希望大家支持。
		//新人技术不足，希望大家包涵。
		//壹、贰、叁、肆、伍、陆、柒、捌、玖、拾
	},
	files: {}
};

export let type = 'extension';
export default extensionPackage;
//game.import(name: "活动武将",
import { lib, game, ui, get, ai, _status } from '../../noname.js';
import { config } from './js/config.js';
import { precontent } from './js/precontent/index.js';
import { content } from './js/content.js';
import { help } from './js/help.js';

lib.init.css(lib.assetURL + 'extension/活动武将', 'extension');

//更新公告
game.showExtensionChangeLog((() => {
	//更新告示
	_status.HDWJ_ChangeLog = [
		{
			type: 'text',
			data: [
				'新人制作扩展，希望大家支持',
				'新人技术不足，希望大家包涵',
				'<a href="https://github.com/HuoDong-Update-Organization/HuoDong-update">点击前往活动武将Github仓库</a>'
			],
		},
		{
			type: 'players',
			data: ['Mbaby_star_xunyu', 'Mbaby_shen1_daxiaoqiao', 'Mbaby_shen2_daxiaoqiao', 'wechat_zhaoyun', 'wechat_re_zhaoyun'],
		},
		{
			type: 'text',
			textAlign: 'left',
			data: [
				'bugfix',
				'素材补充',
				'重新分配微信三国杀的武将分包',
				'欢杀：星荀彧、神二乔①号、神二乔②号',
				'微信：微信赵云、微信界赵云',
				'To be continued...'
			],
		},
	];
	return _status.HDWJ_ChangeLog;
})(), '活动武将');

let extensionPackage = {
	name: '活动武将',
	editable: false,
	content: content,
	precontent: precontent,
	config: config,
	help: help,
	files: {},
	//新人制作扩展，希望大家支持。
	//新人技术不足，希望大家包涵。
	//壹、贰、叁、肆、伍、陆、柒、捌、玖、拾
};

export let type = 'extension';
export default async function () {
	const { name, intro, ...otherInfo } = await lib.init.promises.json(`${lib.assetURL}extension/活动武将/info.json`);
	extensionPackage.package = {
		...otherInfo,
		intro: [
			'新人制作扩展，希望大家支持。',
			'新人技术不足，希望大家包涵。',
			'<a href="https://github.com/HuoDong-Update-Organization/HuoDong-update">点击前往活动武将Github仓库</a>',
			'<li>欢迎大家进群支持活动武将',
			//入群二维码图片
			'<img style=width:238px src=' + lib.assetURL + 'extension/活动武将/HuoDong_QQ.png>',
		].join('<br>'),
	};
	return extensionPackage;
};

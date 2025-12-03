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
			data: [
				'Mbaby_dukui', 'Mmiao_guanyinping', 'Mbaby_mifangfushiren', 'Mfight_dianwei', 'Mbaby_zhugeruoxue', 'Mbaby_star_xunyu', 'Mbaby_shen_daxiaoqiao', 'Mbaby_jiachong', 'Mbaby_wuban', 'Mfight_machao', 'Mbabysp_sunjian', 'Mbaby_re_xunyu', 'Mbaby_dc_sb_chengyu', 'Mbaby_hejin', 'Mbaby_taoqian', 'Mbaby_sunhuan',
				'wechat_zhaoyun', 'wechat_re_zhaoyun', 'wechat_sb_xiahouyuan', 'wechat_sb_xiaoqiao', 'wechat_shen_caocao', 'wechat_sb_sunquan', 'wechat_zhiyin_zhugeke', 'wechat_re_liubiao', 'wechat_re_weiyan', 'wechat_sb_huaxiong', 'wechat_zhi_yuanshu', 'wechat_zhi_fuhuanghou', 'wechat_zhi_caojie', 'wechat_zhi_caocao', 'wechat_zhi_zhangjiao', 'wechat_shen_zhangliao', 'wechat_ruanji',
				'bilibili_sunhanhua', 'bilibili_kuangshen', 'bilibili_Firewin', 'bilibili_lonelypatients', 'bilibili_ningjingzhiyuan', 'bilibili_suixingsifeng', 'bilibili_thunderlei', 'bilibili_xizhicaikobe', 'bilibili_yanjing', 'bilibili_xiaoyaoruyun', 'bilibili_wuzhuwanshui', 'bilibili_murufengchen', 'bilibili_diandian', 'bilibili_daqiao', 'bilibili_xiaoqiao', 'bilibili_ahuinan', 'bilibili_dongtuna',
			],
		},
		{
			type: 'text',
			textAlign: 'left',
			data: [
				'bugfix、素材补充、技能调整',
				'为活动武将引入本体换肤系统，为名人堂系列和杂谈系列的部分武将加入多个皮肤',
				'欢杀：杜夔、喵关银屏、糜芳傅士仁、战典韦、诸葛若雪、星荀彧、神二乔、贾充、吴班、战马超、SP欢杀孙坚、界荀彧、谋程昱、何进、陶谦、孙桓',
				'微信：赵云、界赵云、谋夏侯渊、谋小乔、神曹操、谋孙权、极诸葛恪、界刘表、界魏延、谋华雄、志袁术、志伏皇后、志曹节、志曹操、志张角、神张辽、阮籍；重新分配微信三国杀的武将分包',
				'其他：天降奇兵——孙寒华、狂神(重置版)、吾猪万睡、沐如风晨、点点(带16张皮肤，可在本体换肤界面中切换)、重置活动群名人堂&肘击群&寝室群部分角色、双面乐大乔、双面乐小乔、双面阿会喃、双面董荼那',
				'To be continued...',
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

//game.import(name: "活动武将",
import { lib, game, ui, get, ai, _status } from '../../noname.js';
import { config } from './js/config.js';
import { precontent } from './js/precontent/index.js';
import { content } from './js/content/index.js';
import { help } from './js/help.js';

lib.init.css(lib.assetURL + 'extension/活动武将', 'extension');

//更新公告
game.bolShowNewPack = function () {
	//更新告示
	var HuoDong_update = [
		'将扩展页面“活动武将”的显示改为图片（感谢逍遥如云提供的活动武将横向logo）',
		'/setPlayer/',
		'bugfix',
		'添加新武将眼睛👁、蔡夫人-暗黑傀儡师',
		'修改部分武将技能为新版',
		'添加欢杀武将郑浑、踏顿、陈泰、谋甘宁、雷铜、吴兰、战黄忠',
		'添加微信武将SP貂蝉、诸葛果、孙寒华、刘赪、极刘备、极曹植、极姜维、极祝融',
		'To be continued...',
	];
	//更新武将
	var HuoDong_players = [
		'bilibili_yanjing', 'bilibili_caifuren', 'Mbaby_zhenghun', 'Mbaby_tadun', 'Mbaby_chentai',
		'Mbaby_sb_ganning', 'Mbaby_leitong', 'Mbaby_wulan', 'wechat_sp_diaochan', 'wechat_zhugeguo',
		'wechat_sunhanhua', 'wechat_liucheng', 'wechat_zhiyin_liubei', 'wechat_zhiyin_caozhi',
		'wechat_zhiyin_jiangwei', 'wechat_zhiyin_zhurong', 'Mfight_huangzhong',
	];
	//加载
	var dialog = ui.create.dialog(
		'<span class="text center">' +
		'新人制作扩展，希望大家支持<br>新人技术不足，希望大家包涵' +
		'<br>' +
		'<a href="https://github.com/mengxinzxz/HuoDong-update.git">点击前往活动武将Github仓库</a>' +
		'<br>' +
		'活动武将 ' + lib.extensionPack.活动武将.version + ' 更新内容' +
		'</span>', 'hidden');
	for (var i = 0; i < HuoDong_update.length; i++) {
		if (HuoDong_update[i] == '/setPlayer/') {
			if (HuoDong_players.length) dialog.addSmall([HuoDong_players, 'character']);
		}
		else {
			var li = document.createElement('li');
			li.innerHTML = HuoDong_update[i];
			li.style.textAlign = 'left';
			dialog.content.appendChild(li);
		}
	}
	dialog.open();
	var hidden = false;
	if (!ui.auto.classList.contains('hidden')) {
		ui.auto.hide();
		hidden = true;
	}
	game.pause();
	var control = ui.create.control('确定', function () {
		dialog.close();
		control.close();
		if (hidden) ui.auto.show();
		game.resume();
	});
};

let extensionPackage = {
	name: "活动武将",
	editable: false,
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
		version: '0.3.5 - 待定',
		//新人制作扩展，希望大家支持。
		//新人技术不足，希望大家包涵。
		//壹、贰、叁、肆、伍、陆、柒、捌、玖、拾
	},
	files: {}
};

export let type = 'extension';
export default extensionPackage;
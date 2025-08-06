import { lib, game, ui, get, ai, _status } from '../../../noname.js';
export let config = {
	/*
	//总有一天会维护好的功能
	FenJieXianE: {
		clear: true,
		name: '<li>在线更新',
	},
	Huodong_Update: {
		clear: true,
		intro: '点击检查扩展更新',
		name: '<button type="button">检查扩展更新</button>',
		onclick() {
		},
	},
	*/
	FenJieXianA: {
		clear: true,
		name: '<li>功能杂项（点击折叠）',
		onclick() {
			const innerHTML = get.plainText(this.innerHTML);
			const goon = innerHTML.endsWith('（点击折叠）'), config = `hdwj_config_${innerHTML.slice(0, -6)}}`;
			this.innerHTML = `<li>${this.textContent.slice(0, -6)}${goon ? '（点击展开）' : '（点击折叠）'}`;
			if (goon) {
				_status[config] ??= [];
				let item = this.nextSibling;
				while (item && ['（点击折叠）', '（点击展开）', '删除此扩展'].every(i => !item.innerHTML.includes(i))) {
					item.hide();
					_status[config].add(item);
					item = item.nextSibling;
				}
			}
			else {
				for (const item of _status[config]) item.show();
				delete _status[config];
			}
		},
	},
	HD_shanshan: {
		name: '牌堆加入【闪闪】',
		intro: '将牌堆中的一张方片5，一张方片6，一张方片7的【闪】替换为【闪闪】',
		init: false,
	},
	ShenZhangJiao: {
		name: '神张角184彩蛋',
		intro: '打开此选项后，神张角【异兆】“黄”标记上限为184',
		init: true,
	},
	ShenSunQuan: {
		name: '神孙权全扩技能池',
		intro: '打开此选项后，神孙权【驭衡】获得的技能池扩大为全扩（实时生效）',
		init: false,
		onclick(bool) {
			game.saveConfig('extension_活动武将_ShenSunQuan', bool);
			game.uncheck();
			game.check();
		},
	},
	ShenJiaXu: {
		name: '神贾诩限定技能池',
		intro: '打开此选项后，神贾诩【络殊】获得的技能池缩小为玄蝶初版（实时生效）',
		init: false,
		onclick(bool) {
			game.saveConfig('extension_活动武将_ShenJiaXu', bool);
			game.uncheck();
			game.check();
		},
	},
	edit_PingJianName: {
		name: '编辑欢杀将池',
		clear: true,
		onclick() {
			var container = ui.create.div('.popup-container.editor');
			var node = container;
			var map = lib.config.extension_活动武将_PingJianName || lib.skill.minipingjian.getList();
			var str = '//编辑欢杀将池，此将池仅影响欢乐三国杀武将包中的角色发动技能的武将筛选范围，不会涉及禁将层面';
			str += '\nPingJianName=[\n';
			for (var i = 0; i < map.length; i++) {
				str += '"' + map[i] + '",';
				if (i + 1 < map.length && (i + 1) % 5 == 0) str += '\n';
			}
			str += '\n];';
			node.code = str;
			ui.window.classList.add('shortcutpaused');
			ui.window.classList.add('systempaused');
			var saveInput = function () {
				var code;
				if (container.editor) code = container.editor.getValue();
				else if (container.textarea) code = container.textarea.value;
				try {
					var PingJianName = null;
					eval(code);
					if (!Array.isArray(PingJianName)) {
						throw ('err');
					}
				}
				catch (e) {
					var tip = lib.getErrorTip(e) || '';
					alert('代码语法有错误，请仔细检查（' + e + '）' + tip);
					window.focus();
					if (container.editor) container.editor.focus();
					else if (container.textarea) container.textarea.focus();
					return;
				}
				game.saveConfig('extension_活动武将_PingJianName', PingJianName);
				ui.window.classList.remove('shortcutpaused');
				ui.window.classList.remove('systempaused');
				container.delete();
				container.code = code;
				delete window.saveNonameInput;
			};
			window.saveNonameInput = saveInput;
			var editor = ui.create.editor(container, saveInput);
			if (node.aced) {
				ui.window.appendChild(node);
				node.editor.setValue(node.code, 1);
			}
			else if (lib.device == 'ios') {
				ui.window.appendChild(node);
				if (!node.textarea) {
					var textarea = document.createElement('textarea');
					editor.appendChild(textarea);
					node.textarea = textarea;
					lib.setScroll(textarea);
				}
				node.textarea.value = node.code;
			}
			else {
				if (!window.CodeMirror) {
					import('../../../game/codemirror.js').then(() => {
						lib.codeMirrorReady(node, editor);
					});
					lib.init.css(lib.assetURL + 'layout/default', 'codemirror');
				}
				else lib.codeMirrorReady(node, editor);
			}
		},
	},
	reset_PingJianName: {
		name: '重置欢杀将池',
		clear: true,
		onclick() {
			if (confirm('是否重置已编辑的欢杀将池？')) {
				if (confirm('该操作不可撤销！是否确认重置？')) {
					game.saveConfig('extension_活动武将_PingJianName', null);
					alert('自定义欢杀将池已重置');
				}
			}
		},
	},
	HD_zhengsu: {
		name: '整肃优化',
		intro: '开启此选项后，吕范，皇甫嵩，朱儁整肃技能会获得优化（重启生效）',
		init: true,
	},
	HD_renku: {
		name: '仁库优化',
		intro: '开启此选项后，仁库展示会获得优化（重启生效）',
		init: true,
	},
	ShowSeatNum: {
		name: '座位号显示',
		intro: '开启此选项后，游戏开始时，所有角色显示号位（实时生效）',
		init: true,
	},
	HD_REname: {
		name: '名称还原',
		intro: '开启此选项后，游戏内部分武将的名称翻译将调整为和官服一致（重启生效）',
		init: false,
	},
	Boss_TZ_level: {
		name: '挑战模式玩家等阶',
		intro: '设置玩家在挑战模式中的等阶（重启生效）' +
			'<br><li>一阶：无特权。' +
			'<br><li>二阶：起始手牌+1。' +
			'<br><li>三阶：体力上限+1，起始手牌+1，出【杀】次数+1。' +
			'<br><li>四阶：体力上限+1，起始手牌+2，出【杀】次数+1，摸牌阶段摸牌数+1。' +
			'<br><li>五阶：体力上限+2，起始手牌+2，出【杀】次数+1，摸牌阶段摸牌数+1，获得【重生】。',
		init: '1',
		item: {
			'1': '一阶',
			'2': '二阶',
			'3': '三阶',
			'4': '四阶',
			'5': '五阶',
		},
	},
	Boss_YZ_level: {
		name: '挑战模式神武再世BOSS等阶',
		intro: '设置神武再世BOSS在挑战模式中的等阶（重启生效）' +
			'<br><li>一阶：无特权。' +
			'<br><li>二阶：体力上限+1，起始手牌+1，登场时随机使用一张装备牌。' +
			'<br><li>三阶：体力上限+2，起始手牌+1，出【杀】次数+2。' +
			'<br><li>四阶：体力上限+3，起始手牌+2，出【杀】次数+1，摸牌阶段摸牌数+1。' +
			'<br><li>五阶：体力上限+5，起始手牌+2，出【杀】次数+1，获得【困兽】。',
		init: '1',
		item: {
			'1': '一阶',
			'2': '二阶',
			'3': '三阶',
			'4': '四阶',
			'5': '五阶',
		},
	},
	KQShiJian: {
		name: '抗秦事件',
		intro: '选择不同事件，于游戏开始时令本局游戏进行本事件（挑战模式无效）（重启生效）',
		init: 'off',
		item: {
			off: '关闭',
			bftq: '变法图强',
			hzlh: '合纵连横',
			cpzz: '长平之战',
			hslh: '横扫六合',
			lscq: '吕氏春秋',
			sqzb: '沙丘之变',
			zjzl: '赵姬之乱',
			scth: '始称太后',
		},
	},
	GDShiJian: {
		name: '官渡事件',
		intro: '选择不同事件，于游戏开始时令本局游戏进行本事件（挑战模式无效）（重启生效）',
		init: 'off',
		item: {
			off: '关闭',
			hswc: '火烧乌巢',
			lckf: '粮草匮乏',
			zyzw: '斩颜良诛文丑',
			sssb: '十胜十败',
			xthj: '徐图缓进',
			ljxc: '两军相持',
			jsdy: '坚守待援',
			yssq: '以弱胜强',
			scej: '恃宠而骄',
		},
	},
	FenJieXianB: {
		clear: true,
		name: '<li>关于特效（点击折叠）',
		onclick() {
			const innerHTML = get.plainText(this.innerHTML);
			const goon = innerHTML.endsWith('（点击折叠）'), config = `hdwj_config_${innerHTML.slice(0, -6)}}`;
			this.innerHTML = `<li>${this.textContent.slice(0, -6)}${goon ? '（点击展开）' : '（点击折叠）'}`;
			if (goon) {
				_status[config] ??= [];
				let item = this.nextSibling;
				while (item && ['（点击折叠）', '（点击展开）', '删除此扩展'].every(i => !item.innerHTML.includes(i))) {
					item.hide();
					_status[config].add(item);
					item = item.nextSibling;
				}
			}
			else {
				for (const item of _status[config]) item.show();
				delete _status[config];
			}
		},
	},
	HDdamageAudio: {
		name: '失去上限音效',
		intro: '打开此选项后，失去体力上限会播放特定音效（实时生效）',
		init: true,
	},
	HDfightAudio: {
		name: '各项游戏播报',
		intro: '游戏播报包括以下内容（实时生效）' +
			'<br><li>游戏开始播报（让步十周年UI）' +
			'<br><li>癫狂屠戮，万军取首播报' +
			'<br><li>击杀角色，回复体力播报',
		init: true,
		init: 'default',
		item: {
			off: '关闭',
			default: '手杀',
			ol: 'OL',
			decade: '十周年',
		},
	},
	HDkillAudio: {
		name: '手杀击杀播报选择',
		intro: '使用手杀游戏播报时，选择新旧版本',
		init: 'default',
		item: {
			default: '旧版',
			new: '新版',
		},
	},
	HDskillAnimateAudio: {
		name: 'skillAnimation音效',
		intro: '打开此选项后，含skillAnimation标签的技能发动时将会播放对应的音效',
		init: true,
	},
	HD_bgmPlay: {
		name: 'OL互通版专属BGM',
		intro: '打开此选项后，普通身份局将会播放OL互通版专属BGM' +
			'<br>具体如下：' +
			'<br><li>游戏选将专属BGM' +
			'<br><li>初始主公势力bgm' +
			'<br><li>游戏正常对局bgm' +
			'<br><li>进入残局激昂bgm',
		init: false,
	},
	FenJieXianD: {
		clear: true,
		name: '<li>关于国战（点击折叠）',
		onclick() {
			const innerHTML = get.plainText(this.innerHTML);
			const goon = innerHTML.endsWith('（点击折叠）'), config = `hdwj_config_${innerHTML.slice(0, -6)}}`;
			this.innerHTML = `<li>${this.textContent.slice(0, -6)}${goon ? '（点击展开）' : '（点击折叠）'}`;
			if (goon) {
				_status[config] ??= [];
				let item = this.nextSibling;
				while (item && ['（点击折叠）', '（点击展开）', '删除此扩展'].every(i => !item.innerHTML.includes(i))) {
					item.hide();
					_status[config].add(item);
					item = item.nextSibling;
				}
			}
			else {
				for (const item of _status[config]) item.show();
				delete _status[config];
			}
		},
	},
	HD_gzfazheng: {
		name: '法正修改',
		intro: '开启此选项后，国战法正【眩惑】调整为OL/手杀版本（重启生效）',
		init: false,
	},
	HD_gzbianfuren: {
		name: '卞夫人修改',
		intro: '开启此选项后，国战卞夫人【挽危】调整为OL/十周年版本（重启生效）',
		init: false,
	},
	FenJieXianE: {
		clear: true,
		name: '<li>扩展彩蛋（点击折叠）',
		onclick() {
			const innerHTML = get.plainText(this.innerHTML);
			const goon = innerHTML.endsWith('（点击折叠）'), config = `hdwj_config_${innerHTML.slice(0, -6)}}`;
			this.innerHTML = `<li>${this.textContent.slice(0, -6)}${goon ? '（点击展开）' : '（点击折叠）'}`;
			if (goon) {
				_status[config] ??= [];
				let item = this.nextSibling;
				while (item && ['（点击折叠）', '（点击展开）', '删除此扩展'].every(i => !item.innerHTML.includes(i))) {
					item.hide();
					_status[config].add(item);
					item = item.nextSibling;
				}
			}
			else {
				for (const item of _status[config]) item.show();
				delete _status[config];
			}
		},
	},
	ShenLvBu: {
		name: '彩蛋·神吕布',
		intro: '开启此选项后，在正常模式中可以使用：最强神话、暴怒战神、神鬼无前',
		init: false,
	},
	XvXiang: {
		name: '彩蛋·虚像',
		intro: '开启此选项后，线下包的五个虚拟偶像将获得【虚像】',
		init: false,
	},
	DanJi: {
		name: '彩蛋·千里走单骑',
		intro: '开启此选项后，在正常模式中可以使用：蔡阳，普净，胡班（位于活动武将“其他武将”包）',
		init: false,
	},
	SCS: {
		name: '彩蛋·十常侍',
		intro: '开启此选项后，在正常模式中可以使用十常侍单人版（位于活动武将“其他武将”包）',
		init: false,
	},
}
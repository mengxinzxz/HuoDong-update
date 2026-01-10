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
	HDcheckNew: {
		name: (() => {
			//孩子们，牢大在天上化为彩虹看着你们（bushi）
			const text = '点击查看更新公告';
			if (!document.getElementById('hd-rainbow-style')) {
				const style = document.createElement('style');
				style.id = 'hd-rainbow-style';
				let css = '';
				for (let i = 0; i < text.length; i++) {
					const animName = `hd_bol_author_${i}`;
					css += `@keyframes ${animName}{`;
					for (let j = 0; j <= 20; j++) {
						const r = Math.floor(Math.random() * 255);
						const g = Math.floor(Math.random() * 255);
						const b = Math.floor(Math.random() * 255);
						css += `${j * 5}%{color:rgb(${r},${g},${b});text-shadow:0 0 5px rgba(${r},${g},${b},0.8);}`;
					}
					css += `}`;
				}
				style.innerHTML = css;
				document.head.appendChild(style);
			}
			return [...text].map((ch, i) => {
				const delay = (i * 0.3).toFixed(1);
				return `<span style="display:inline-block; animation:hd_bol_author_${i} 3s linear ${delay}s infinite; font-weight:bold; transition:color 0.5s;">${ch}</span>`;
			}).join('');
		})(),
		clear: true,
		onclick() {
			game.closeMenu();
			const extname = '活动武将', dialog = ui.create.dialog();
			dialog.classList.add('fullwidth');
			dialog.classList.add('fullheight');
			dialog.add(ui.create.div('.placeholder'));
			const controls = ui.controls.slice();
			if (controls.length > 0) controls.forEach(i => i.hide());
			const closeButton = ui.create.div('.menubutton.round', '<span style="font-size:22px;">×</span>', dialog, () => {
				dialog.close();
				if (controls.length > 0) controls.forEach(i => i.show());
			});
			closeButton.style.top = `40px`;
			closeButton.style.left = `calc(100% - 155px)`;
			dialog.add(`${extname} ${lib.extensionPack[extname].version} 更新内容`);
			dialog.add(ui.create.div('.placeholder'));
			const changeLogList = _status.HDWJ_ChangeLog;
			changeLogList.forEach(item => {
				switch (item.type) {
					case 'text':
						const list = Array.isArray(item.data) ? item.data : [item.data];
						if (item.addText) list.forEach(value => dialog.addText(value));
						else {
							list.forEach(value => {
								const li = document.createElement('li');
								li.innerHTML = value;
								li.style.textAlign = item.textAlign || 'center';
								dialog.content.appendChild(li);
							});
						}
						break;
					case 'players':
						dialog.addSmall([item.data, 'character']);
						dialog.classList.add('forcebutton');
						dialog.classList.add('withbg');
						break;
					case 'cards':
						dialog.addSmall([item.data.map(value => [get.translation(get.type(value)), '', value]), 'vcard']);
						dialog.classList.add('forcebutton');
						dialog.classList.add('withbg');
						break;
					default:
						return;
				}
			});
			dialog.open();
		},
	},
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
	showDerivation: {
		name: '技能翻译优化',
		intro: '结合get.poptip方法优化有衍生技的技能翻译',
		init: false,
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
		intro: "编辑欢杀将池，此将池仅影响欢乐三国杀武将包中的角色发动技能的武将筛选范围，不会涉及禁将层面",
		onclick() {
			var map = game.getExtensionConfig('活动武将', 'PingJianName') || lib.skill.minipingjian.getList();
			ui.create.editor2({
				language: 'json',
				value: JSON.stringify(map),
				saveInput: result => {
					const PingJianName = JSON.parse(result);
					if (!Array.isArray(PingJianName)) {
						throw new Error("代码格式有错误，请对比示例代码仔细检查");
					}
					game.saveExtensionConfig('活动武将', 'PingJianName', PingJianName);
				},
			});
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
}
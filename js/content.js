import { lib, game, ui, get, ai, _status } from '../../../noname.js';

export async function content(config, pack) {
	//活动武将显示
	if (ui?.create?.menu) {
		const originLoading = ui.create.menu;
		ui.create.menu = function () {
			const result = originLoading.apply(this, arguments);
			const extensionPack = Array.from(document.getElementsByTagName('div')).find(div => div.innerHTML === '扩展');
			if (extensionPack) {
				const originClick = extensionPack.onclick || function () { };
				extensionPack.onclick = () => {
					originClick.apply(this, arguments);
					const plagueExtension = Array.from(document.querySelectorAll('.menubutton.large')).find(div => div.innerHTML === '活动武将');
					if (plagueExtension) plagueExtension.innerHTML = "<img style=width:100px src=" + lib.assetURL + "extension/活动武将/image/default/活动武将.png>";
				};
			}
			return result;
		};
	}
	//更新公告
	var version = lib.config.extension_活动武将_HDversion;
	if (!version || version != lib.extensionPack.活动武将.version) {
		lib.game.showChangeLog = function () {
			game.saveConfig('extension_活动武将_HDversion', lib.extensionPack.活动武将.version);
			game.bolShowNewPack();
			lib.init.onfree();
		};
	}

	//快捷添加/删除武将
	game.HDdeleteCharacter = function (name) {
		if (lib.character[name]) delete lib.character[name];
		var packs = Object.keys(lib.characterPack).filter(pack => lib.characterPack[pack][name]);
		if (packs.length) packs.forEach(pack => delete lib.characterPack[pack][name]);
	};
	game.HDaddCharacter = function (name, character, packs = '') {
		game.HDdeleteCharacter(name);
		if (_status['extension_活动武将_files']?.image.character.files.includes(`${name}.jpg`)) {
			character[4] ??= [];
			character[4].push(`ext:活动武将/image/character/${name}.jpg`);
		}
		const pack = packs.split(':').filter(p => lib.config.all.characters.includes(p))[0];
		if (pack) {
			lib.characterPack[pack][name] = character;
			if (lib.config.characters.includes(pack)) lib.character[name] = character;
			lib.config.forbidai[lib.config[`forbidai_user_${pack}`] ? 'add' : 'remove'](name);
		}
		else lib.character[name] = character;
	};
	//移动武将所在武将包
	game.HDmoveCharacter = function (name, packss) {
		var nameinfo = get.character(name);
		if (nameinfo) {
			nameinfo[4] ??= [];
			game.HDaddCharacter(name, nameinfo, packss);
		}
	};

	//十周年UI美化素材
	if (game.HasExtension('十周年UI')) {
		const [folders, files] = await game.promises.getFileList('extension/十周年UI/image/card');
		if (files) {
			for (const img of ['leijin', 'bianzhen', 'mingzhi']) lib.card['zhengsu_' + img].fullskin = true;
			//整肃
			if (!files.includes('zhengsu_leijin.png')) {
				game.readFile('extension/活动武将/image/card/zhengsu_leijin.png', (data) => {
					game.writeFile(data, 'extension/十周年UI/image/card', 'zhengsu_leijin.png', () => { });
				});
			}
			if (!files.includes('zhengsu_bianzhen.png')) {
				game.readFile('extension/活动武将/image/card/zhengsu_bianzhen.png', (data) => {
					game.writeFile(data, 'extension/十周年UI/image/card', 'zhengsu_bianzhen.png', () => { });
				});
			}
			if (!files.includes('zhengsu_mingzhi.png')) {
				game.readFile('extension/活动武将/image/card/zhengsu_mingzhi.png', (data) => {
					game.writeFile(data, 'extension/十周年UI/image/card', 'zhengsu_mingzhi.png', () => { });
				});
			}
			if (!files.includes('zhengsu_leijin.webp')) {
				game.readFile('extension/活动武将/image/card/zhengsu_leijin.webp', (data) => {
					game.writeFile(data, 'extension/十周年UI/image/card', 'zhengsu_leijin.webp', () => { });
				});
			}
			if (!files.includes('zhengsu_bianzhen.webp')) {
				game.readFile('extension/活动武将/image/card/zhengsu_bianzhen.webp', (data) => {
					game.writeFile(data, 'extension/十周年UI/image/card', 'zhengsu_bianzhen.webp', () => { });
				});
			}
			if (!files.includes('zhengsu_mingzhi.webp')) {
				game.readFile('extension/活动武将/image/card/zhengsu_mingzhi.webp', (data) => {
					game.writeFile(data, 'extension/十周年UI/image/card', 'zhengsu_mingzhi.webp', () => { });
				});
			}
			//闪闪
			if (!files.includes('bol_shanshan.png')) {
				game.readFile('extension/活动武将/image/card/bol_shanshan.png', (data) => {
					game.writeFile(data, 'extension/十周年UI/image/card', 'bol_shanshan.png', () => { });
				});
			}
			if (!files.includes('bol_shanshan.webp')) {
				game.readFile('extension/活动武将/image/card/bol_shanshan.webp', (data) => {
					game.writeFile(data, 'extension/十周年UI/image/card', 'bol_shanshan.webp', () => { });
				});
			}
		}
	}

	//Hidden--作者专属
	if (lib.config.connect_nickname == '萌新（转型中）') {
		lib.extensionMenu['extension_活动武将'].FenJieXianAuthor = {
			name: '<li>作者专属',
			clear: true,
		};
		//检查公告
		lib.extensionMenu['extension_活动武将'].HDcheckNew = {
			name: '检查更新公告',
			clear: true,
			onclick() {
				game.bolShowNewPack();
			},
		};
	}

	//官方武将包保护机制
	//添加
	lib.config.all.sgscharacters.push('diy');
	//检测
	var openCharacterPack = lib.config.all.sgscharacters.filter(i => lib.config.hiddenCharacterPack.includes(i));
	if (openCharacterPack.length) {
		lib.config.hiddenCharacterPack.removeArray(openCharacterPack);
		game.saveConfig('hiddenCharacterPack', lib.config.hiddenCharacterPack);
		alert('检测到官方武将包' + get.translation(openCharacterPack) + '被隐藏，可能会使得部分技能函数无法读取从而导致问题，即将为您解除这些武将包的隐藏并重启游戏');
		setTimeout(() => game.reload(), 2000);
	}

	//precBoss
	//Boss模式编辑
	if (get.mode() == 'boss') {
		//等阶设置（所有boss对战的等阶加成均为神武再世等阶加成方式）
		if (!lib.config.extension_活动武将_Boss_TZ_level) lib.config.extension_活动武将_Boss_TZ_level = '1';
		if (!lib.config.extension_活动武将_Boss_YZ_level) lib.config.extension_活动武将_Boss_YZ_level = '1';
		lib.skill._boss_tz_level = {
			charlotte: true,
			ruleSkill: true,
			trigger: { global: 'gameStart' },
			firstDo: true,
			priority: Infinity,
			direct: true,
			content() {
				var num1 = lib.config.extension_活动武将_Boss_TZ_level;
				var num2 = lib.config.extension_活动武将_Boss_YZ_level;
				switch (player.identity) {
					case 'cai':
						player.node.framebg.dataset.decoration = 'none';
						switch (num1) {
							case '2':
								player.directgain(get.cards(1));
								break;
							case '3':
								player.directgain(get.cards(1));
								player.addSkill('boss_tz_sha');
								player.maxHp = player.maxHp + 1;
								player.hp = player.hp + 1;
								player.update();
								player.node.framebg.dataset.decoration = 'bronze';
								break;
							case '4':
								player.directgain(get.cards(2));
								player.addSkill('boss_tz_sha');
								player.addSkill('boss_tz_draw');
								player.maxHp = player.maxHp + 1;
								player.hp = player.hp + 1;
								player.update();
								player.node.framebg.dataset.decoration = 'silver';
								break;
							case '5':
								player.directgain(get.cards(2));
								player.addSkill('boss_tz_sha');
								player.addSkill('boss_tz_draw');
								player.addSkill('boss_tz_chongsheng');
								player.maxHp = player.maxHp + 2;
								player.hp = player.hp + 2;
								player.update();
								player.node.framebg.dataset.decoration = 'gold';
								break;
						}
						player.node.framebg.dataset.auto = player.node.framebg.dataset.decoration;
						break;
					case 'zhu': case 'zhong':
						if (game.boss_shenwuzaishi) {
							player.node.framebg.dataset.decoration = 'none';
							switch (num2) {
								case '2':
									player.directgain(get.cards(1));
									player.addSkill('boss_yz_equip');
									player.maxHp = player.maxHp + 1;
									player.hp = player.hp + 1;
									player.update();
									break;
								case '3':
									player.directgain(get.cards(1));
									player.addSkill('boss_yz_sha');
									player.addSkill('boss_yz_shax');
									player.maxHp = player.maxHp + 2;
									player.hp = player.hp + 2;
									player.update();
									player.node.framebg.dataset.decoration = 'bronze';
									break;
								case '4':
									player.directgain(get.cards(2));
									player.addSkill('boss_yz_sha');
									player.addSkill('boss_yz_draw');
									player.maxHp = player.maxHp + 3;
									player.hp = player.hp + 3;
									player.update();
									player.node.framebg.dataset.decoration = 'silver';
									break;
								case '5':
									player.directgain(get.cards(2));
									player.addSkill('boss_yz_sha');
									player.addSkill('boss_yz_kunshou');
									player.maxHp = player.maxHp + 5;
									player.hp = player.hp + 5;
									player.update();
									player.node.framebg.dataset.decoration = 'gold';
									break;
							}
							player.node.framebg.dataset.auto = player.node.framebg.dataset.decoration;
						}
						break;
				}
			},
		};
	}
	//precC
	//对局机制优化
	//整肃
	if (lib.config.extension_活动武将_HD_zhengsu) {
		lib.rank.rarity.epic.addArray(['sp_huangfusong', 'sp_zhujun']);
		lib.skill.zhengsu.subSkill.leijin = {
			mod: {
				aiOrder(player, card, num) {
					if (typeof card.number != 'number') return;
					var history = player.getHistory('useCard', function (evt) {
						return evt.isPhaseUsing();
					});
					if (history.length == 0) return num + 10 * (14 - card.number);
					var num = get.number(history[0].card);
					if (!num) return;
					for (var i = 1; i < history.length; i++) {
						var num2 = get.number(history[i].card);
						if (!num2 || num2 <= num) return;
						num = num2;
					}
					if (card.number > num) return num + 10 * (14 - card.number);
				},
			},
			mark: true,
			trigger: { player: 'useCard1' },
			lastDo: true,
			charlotte: true,
			forced: true,
			popup: false,
			init(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				if (!zsbgxx) {
					player.storage.zhengsu_leijingua = ui.create.div('.zhengsubeijing1', ui.arena);
					player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出3张牌' + '<br>出牌点数递增';
					player.storage.zhengsu_leijingua2 = true;
				}
				else if (!zsbggg) {
					player.storage.zhengsu_leijingua = ui.create.div('.zhengsubeijing2', ui.arena);
					player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出3张牌' + '<br>出牌点数递增';
					player.storage.zhengsu_leijingua3 = true;
				}
				else {
					player.storage.zhengsu_leijingua = ui.create.div('.zhengsubeijing3', ui.arena);
					player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出3张牌' + '<br>出牌点数递增';
				}
			},
			onremove(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				var zsbgxg = document.querySelector('.zhengsubeijing3');
				if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
				if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
				if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
				delete player.storage.zhengsu_leijin_markcount;
				delete player.storage.zhengsu_leijingua2;
				delete player.storage.zhengsu_leijingua3;
				delete player.storage.zhengsu_leijin;
			},
			filter(event, player) {
				return player.isPhaseUsing() && player.storage.zhengsu_leijin !== false;
			},
			content() {
				var list = player.getHistory('useCard', function (evt) {
					return evt.isPhaseUsing(player);
				});
				var goon = true;
				for (var i = 0; i < list.length; i++) {
					var num = get.number(list[i].card);
					if (typeof num != 'number') {
						goon = false;
						break;
					}
					if (i > 0) {
						var num2 = get.number(list[i - 1].card);
						if (typeof num2 != 'number' || num2 >= num) {
							goon = false;
							break;
						}
					}
					if (goon == true && list.length <= 2) {
						player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出' + (3 - list.length) + '张牌' + '<br>出牌点数大于' + get.number(list[i].card);
					} else if (goon == true && list.length > 2) {
						player.storage.zhengsu_leijingua.innerHTML = '发起者为' + get.translation(player) + '<br>出牌点数大于' + get.number(list[i].card);
					}
				}
				if (!goon) {
					game.broadcastAll(function (player) {
						player.storage.zhengsu_leijin = false;
						if (player.marks.zhengsu_leijin) player.marks.zhengsu_leijin.firstChild.innerHTML = '╳';
						delete player.storage.zhengsu_leijin_markcount;
						if (player.storage.zhengsu_leijingua2) {
							var zsbgxx = document.querySelector('.zhengsubeijing1');
							if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
						}
						else if (player.storage.zhengsu_leijingua3) {
							var zsbggg = document.querySelector('.zhengsubeijing2');
							if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
						}
						else {
							var zsbgxg = document.querySelector('.zhengsubeijing3');
							if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
						}
					}, player);
				}
				else {
					if (list.length > 2) {
						player.storage.zhengsu_leijin = true;
						game.broadcastAll(function (player, num) {
							if (player.marks.zhengsu_leijin) player.marks.zhengsu_leijin.firstChild.innerHTML = '○';
							player.storage.zhengsu_leijin = true;
							player.storage.zhengsu_leijin_markcount = num;
						}, player, num);
					}
					else game.broadcastAll(function (player, num) {
						player.storage.zhengsu_leijin_markcount = num;
					}, player, num);
				}
				player.markSkill('zhengsu_leijin');
			},
			intro: { content: '<li>条件：回合内所有于出牌阶段使用的牌点数递增且不少于三张。' },
		};
		lib.skill.zhengsu.subSkill.bianzhen = {
			mark: true,
			trigger: { player: 'useCard1' },
			firstDo: true,
			charlotte: true,
			forced: true,
			popup: false,
			init(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				if (!zsbgxx) {
					player.storage.zhengsu_bianzhengua = ui.create.div('.zhengsubeijing1', ui.arena);
					player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出2张牌' + '<br>出牌花色相同';
					player.storage.zhengsu_bianzhengua2 = true;
				}
				else if (!zsbggg) {
					player.storage.zhengsu_bianzhengua = ui.create.div('.zhengsubeijing2', ui.arena);
					player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出2张牌' + '<br>出牌花色相同';
					player.storage.zhengsu_bianzhengua3 = true;
				}
				else {
					player.storage.zhengsu_bianzhengua = ui.create.div('.zhengsubeijing3', ui.arena);
					player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出2张牌' + '<br>出牌花色相同';
				}
			},
			onremove(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				var zsbgxg = document.querySelector('.zhengsubeijing3');
				if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
				if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
				if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
				delete player.storage.zhengsu_bianzhen;
				delete player.storage.zhengsu_bianzhengua2;
				delete player.storage.zhengsu_bianzhengua3;
			},
			filter(event, player) {
				return player.isPhaseUsing() && player.storage.zhengsu_bianzhen !== false;
			},
			content() {
				var list = player.getHistory('useCard', function (evt) {
					return evt.isPhaseUsing();
				});
				var goon = true, suit = get.suit(list[0].card, false);
				if (goon == true && list.length <= 1) player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出' + (2 - list.length) + '张牌' + '<br>出牌花色为' + get.translation(suit);
				else if (goon == true && list.length > 1) player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>出牌花色为' + get.translation(suit);
				if (suit == 'none') goon = false;
				else {
					for (var i = 1; i < list.length; i++) {
						if (get.suit(list[i]) != suit) {
							goon = false;
							break;
						}
						if (goon == true && list.length <= 1) player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>还需出' + (2 - list.length) + '张牌' + '<br>出牌花色为' + get.translation(get.suit(list[i]));
						else if (goon == true && list.length > 1) player.storage.zhengsu_bianzhengua.innerHTML = '发起者为' + get.translation(player) + '<br>出牌花色为' + get.translation(get.suit(list[i]));
					}
				}
				if (!goon) {
					game.broadcastAll(function (player) {
						player.storage.zhengsu_bianzhen = false;
						if (player.marks.zhengsu_bianzhen) player.marks.zhengsu_bianzhen.firstChild.innerHTML = '╳';
						if (player.storage.zhengsu_bianzhengua2) {
							var zsbgxx = document.querySelector('.zhengsubeijing1');
							if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
						}
						else if (player.storage.zhengsu_bianzhengua3) {
							var zsbggg = document.querySelector('.zhengsubeijing2');
							if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
						}
						else {
							var zsbgxg = document.querySelector('.zhengsubeijing3');
							if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
						}
					}, player);
				}
				else if (list.length > 1) {
					game.broadcastAll(function (player) {
						if (player.marks.zhengsu_bianzhen) player.marks.zhengsu_bianzhen.firstChild.innerHTML = '○';
						player.storage.zhengsu_bianzhen = true;
					}, player);
				}
			},
			intro: { content: '<li>条件：回合内所有于出牌阶段使用的牌花色相同且不少于两张。' },
			ai: {
				effect: {
					player_use(card, player, target) {
						if (typeof card != 'object' || !player.isPhaseUsing()) return;
						var suitx = get.suit(card);
						var history = player.getHistory('useCard');
						if (!history.length) {
							var val = 0;
							if (player.hasCard(function (cardx) {
								return get.suit(cardx) == suitx && card != cardx && (!card.cards || !card.cards.includes(cardx)) && player.hasValueTarget(cardx);
							}, 'hs')) val = [2, 0.1];
							if (val) return val;
							return;
						}
						var num = 0;
						var suit = false;
						for (var i = 0; i < history.length; i++) {
							var suit2 = get.suit(history[i].card);
							if (!lib.suit.includes(suit2)) return;
							if (suit && suit != suit2) return;
							suit = suit2;
							num++;
						}
						if (suitx == suit && num == 1) return [1, 0.1];
						if (suitx != suit && (num > 1 || num <= 1 && player.hasCard(function (cardx) {
							return get.suit(cardx) == suit && player.hasValueTarget(cardx);
						}, 'hs'))) return 'zeroplayertarget';
					},
				},
			},
		};
		lib.skill.zhengsu.subSkill.mingzhi = {
			mark: true,
			trigger: { player: 'loseAfter' },
			firstDo: true,
			charlotte: true,
			forced: true,
			popup: false,
			init(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				if (!zsbgxx) {
					player.storage.zhengsu_mingzhigua = ui.create.div('.zhengsubeijing1', ui.arena);
					player.storage.zhengsu_mingzhigua.innerHTML = '发起者为' + get.translation(player) + '<br>需弃置2张牌' + '<br>弃置花色不同';
					player.storage.zhengsu_mingzhigua2 = true;
				}
				else if (!zsbggg) {
					player.storage.zhengsu_mingzhigua = ui.create.div('.zhengsubeijing2', ui.arena);
					player.storage.zhengsu_mingzhigua.innerHTML = '发起者为' + get.translation(player) + '<br>需弃置2张牌' + '<br>弃置花色不同';
					player.storage.zhengsu_mingzhigua3 = true;
				}
				else {
					player.storage.zhengsu_mingzhigua = ui.create.div('.zhengsubeijing3', ui.arena);
					player.storage.zhengsu_mingzhigua.innerHTML = '发起者为' + get.translation(player) + '<br>需弃置2张牌' + '<br>弃置花色不同';
				}
			},
			onremove(player) {
				var zsbgxx = document.querySelector('.zhengsubeijing1');
				var zsbggg = document.querySelector('.zhengsubeijing2');
				var zsbgxg = document.querySelector('.zhengsubeijing3');
				if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
				if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
				if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
				delete player.storage.zhengsu_mingzhi_list;
				delete player.storage.zhengsu_mingzhi;
				delete player.storage.zhengsu_mingzhi_markcount;
				delete player.storage.zhengsu_mingzhigua2;
				delete player.storage.zhengsu_mingzhigua3;
			},
			filter(event, player) {
				if (player.storage.zhengsu_mingzhi === false || event.type != 'discard') return false;
				var evt = event.getParent('phaseDiscard');
				return evt?.player == player;
			},
			content() {
				var goon = true, list = [];
				player.getHistory('lose', function (event) {
					if (!goon || event.type != 'discard') return false;
					var evt = event.getParent('phaseDiscard');
					if (evt?.player == player) {
						for (var i of event.cards2) {
							var suit = get.suit(i, player);
							if (list.includes(suit)) {
								goon = false;
								break;
							}
							else list.push(suit);
						}
					}
				});
				if (!goon) {
					game.broadcastAll(function (player) {
						player.storage.zhengsu_mingzhi = false;
						if (player.marks.zhengsu_mingzhi) player.marks.zhengsu_mingzhi.firstChild.innerHTML = '╳';
						if (player.storage.zhengsu_mingzhigua2) {
							var zsbgxx = document.querySelector('.zhengsubeijing1');
							if (zsbgxx) zsbgxx.parentNode.removeChild(zsbgxx);
						}
						else if (player.storage.zhengsu_mingzhigua3) {
							var zsbggg = document.querySelector('.zhengsubeijing2');
							if (zsbggg) zsbggg.parentNode.removeChild(zsbggg);
						}
						else {
							var zsbgxg = document.querySelector('.zhengsubeijing3');
							if (zsbgxg) zsbgxg.parentNode.removeChild(zsbgxg);
						}
						delete player.storage.zhengsu_mingzhi_list;
					}, player);
				}
				else {
					if (list.length > 1) {
						game.broadcastAll(function (player, list) {
							if (player.marks.zhengsu_mingzhi) player.marks.zhengsu_mingzhi.firstChild.innerHTML = '○';
							player.storage.zhengsu_mingzhi = true;
							player.storage.zhengsu_mingzhi_list = list;
							player.storage.zhengsu_mingzhi_markcount = list.length;
						}, player, list);
					}
					else game.broadcastAll(function (player, list) {
						player.storage.zhengsu_mingzhi_list = list;
						player.storage.zhengsu_mingzhi_markcount = list.length;
					}, player, list);
				}
				player.markSkill('zhengsu_mingzhi');
			},
			intro: { content: '<li>条件：回合内所有于弃牌阶段弃置的牌花色均不相同且不少于两张。' },
		};
		lib.translate.spyanji_info = '出牌阶段开始时，你可以进行' + get.ZhengSuInform() + '。若如此做，弃牌阶段结束时，若你整肃成功，你获得整肃奖励。';
		lib.translate.spzhengjun_info = '出牌阶段开始时，你可以进行' + get.ZhengSuInform() + '。若如此做，弃牌阶段结束时，若你整肃成功，你获得整肃奖励，然后你可以选择一名其他角色，令其也获得整肃奖励。';
		lib.translate.houfeng_info = '每轮限一次，一名其他角色的出牌阶段开始时，若其在你的攻击范围内，则你可以令其进行' + get.ZhengSuInform() + '。若如此做，其本回合弃牌阶段结束时，若其整肃成功，你与其获得整肃奖励。';
	}
	//仁库
	if (lib.config.extension_活动武将_HD_renku) {
		game.updateRenku = function () {
			game.broadcast(renku => _status.renku = renku, _status.renku);
			if (!window.rkbg) {
				window.rkbg = ui.create.div('.renkubeijinggua', ui.arena);
				if (lib.config.hdwj_renkuIndex) {
					window.rkbg.style.left = Math.round(lib.config.hdwj_renkuIndex.x * document.body.offsetWidth) + 'px';
					window.rkbg.style.top = Math.round(lib.config.hdwj_renkuIndex.y * document.body.offsetHeight) + 'px';
				}
			}
			window.rkbg.innerHTML = '仁' + (_status.renku.length < 6 ? '' : '<b><font color=\"#FF5500\">') + _status.renku.length;
			let isDragging = false;
			let offsetX = 0, offsetY = 0;
			let animationFrameId = null;
			let saveRenkuPosition = function () {
				if (!lib.config.hdwj_renkuIndex) lib.config.hdwj_renkuIndex = {};
				lib.config.hdwj_renkuIndex.x = window.rkbg.offsetLeft / document.body.offsetWidth;
				lib.config.hdwj_renkuIndex.y = window.rkbg.offsetTop / document.body.offsetHeight;
				game.saveConfig('hdwj_renkuIndex', lib.config.hdwj_renkuIndex);
			}
			if (lib.config.touchscreen) {
				let defaultevent = e => e.preventDefault();
				window.rkbg.addEventListener('touchstart', function (e) {
					let evt = e || window.event;
					let zoom = game.documentZoom || 1;
					offsetX = (evt.touches[0].clientX - window.rkbg.offsetLeft * zoom) / zoom;
					offsetY = (evt.touches[0].clientY - window.rkbg.offsetTop * zoom) / zoom;
					document.addEventListener('touchmove', defaultevent, false);
				});
				window.rkbg.addEventListener('touchmove', function (e) {
					let evt = e || window.event;
					let zoom = game.documentZoom || 1;
					let oleft = evt.touches[0].clientX / zoom - offsetX;
					let otop = evt.touches[0].clientY / zoom - offsetY;
					window.rkbg.style.left = oleft + 'px';
					window.rkbg.style.top = otop + 'px';
				});
				window.rkbg.addEventListener('touchend', function () {
					saveRenkuPosition();
					document.removeEventListener('touchmove', defaultevent);
				});
			}
			else {
				window.rkbg.addEventListener('mousedown', function (e) {
					let zoom = game.documentZoom || 1;
					isDragging = true;
					offsetX = (e.clientX - window.rkbg.offsetLeft * zoom) / zoom;
					offsetY = (e.clientY - window.rkbg.offsetTop * zoom) / zoom;
					document.body.style.userSelect = 'none';
					e.preventDefault();
				});
				document.addEventListener('mousemove', function (e) {
					if (isDragging) {
						if (animationFrameId) cancelAnimationFrame(animationFrameId);
						animationFrameId = requestAnimationFrame(() => {
							let zoom = game.documentZoom || 1;
							let newX = e.clientX / zoom - offsetX;
							let newY = e.clientY / zoom - offsetY;
							window.rkbg.style.left = newX + 'px';
							window.rkbg.style.top = newY + 'px';
						});
					}
				});
				document.addEventListener('mouseup', function () {
					if (isDragging) {
						isDragging = false;
						document.body.style.userSelect = '';
						saveRenkuPosition();
					}
				});
			}
			if (_status.renku.length === 0) {
				window.rkbg.remove();
				window.rkbg = null;
			}
			else {
				window.rkbg.onclick = function () {
					if (!window.dialogguagua) {
						window.dialogguagua = ui.create.dialog('仁库', _status.renku, "peaceDialog");
						window.rkbg.innerHTML = '❌';
					}
					else {
						window.dialogguagua.remove();
						window.dialogguagua = null;
						window.rkbg.innerHTML = '仁' + (_status.renku.length < 6 ? '' : '<b><font color=\"#FF5500\">') + _status.renku.length;
					}
				};
			}
		};
	}

	//precGuoZhan(分界线，便于我搜过来)
	if (get.mode() == 'guozhan') {
		//国战武将技能修复
		if (get.config('onlyguozhan')) {
			//------------------------------增改武将------------------------------//
			//国战武将补充
			lib.characterSort.mode_guozhan.bilibili_GuoZhan = [];
			lib.translate.bilibili_GuoZhan = '国战补充';
			//技能
			let change_pack = {
				skill: {
					//卞夫人
					gzwanwei: {
						audio: 'wanwei',
						inherit: 'fuwei',
					},
				},
				dynamicTranslate: {

				},
				translate: {

				},
				character: {
					gz_bianfuren: ['female', 'wei', 3, ['gzwanwei', 'gzyuejian'], []],
					gz_re_xushu: ['male', 'shu', 4, ['gzqiance', 'gzjujian'], ['gzskin']],
					gz_wujing: ['male', 'wu', 4, ['donggui', 'fengyang_old'], ['gzskin']],
				},
			};
			for (const i in change_pack) {
				for (const j in change_pack[i]) {
					if (i == 'character') {
						if (!change_pack[i][j][4]) change_pack[i][j][4] = [];
						lib.characterPack.mode_guozhan[j] = change_pack[i][j];
					}
					lib[i][j] = change_pack[i][j];
				}
			}
		}
		//------------------------------选项------------------------------//
		//precGuozhan2
		//左慈---后续
		lib.skill.gzhuashen.drawCharacter = function (player, list) {
			game.broadcastAll(function (player, list) {
				var cards = [];
				for (var i = 0; i < list.length; i++) {
					var cardname = 'huashen_card_' + list[i];
					lib.card[cardname] = {
						fullimage: true,
						image: player.isUnderControl(true) ? 'character:' + list[i] : 'ext:活动武将/image/card/huashen_unknown.jpg'
					}
					lib.translate[cardname] = player.isUnderControl(true) ? get.rawName2(list[i]) : ' ';
					cards.push(game.createCard(cardname, '', ''));
				}
				player.$draw(cards, 'nobroadcast');
			}, player, list);
		};
		lib.skill.yigui.group = ['yigui_init', 'yigui_refrain', 'yigui_gzshan', 'yigui_gzwuxie'];
		const yiguiInfo = lib.translate.yigui_info;
		lib.translate.yigui_info = yiguiInfo.slice(0, yiguiInfo.indexOf('（')) + '（此牌指定或响应的角色须为未确定势力的角色或野心家或与此“魂”势力相同的角色）';
		//法正
		if (lib.config.extension_活动武将_HD_gzfazheng) {
			lib.skill.gzxuanhuo.subSkill.others = {
				forceaudio: true,
				audio: 'rexuanhuo',
				filter(event, player) {
					return !player.isUnseen() && player.countCards('h') && player.countCards('he') >= 2 && game.hasPlayer(target => {
						return lib.skill.gzxuanhuo.subSkill.others.filterTarget(null, player, target);
					});
				},
				enable: 'phaseUse',
				filterTarget(card, player, target) {
					return target != player && target.hasSkill('gzxuanhuo') && player.isFriendOf(target);
				},
				selectTarget() {
					var targets = game.filterPlayer(target => lib.skill.gzxuanhuo.subSkill.others.filterTarget(null, _status.event.player, target));
					return targets.length > 1 ? 1 : -1;
				},
				prompt() {
					var targets = game.filterPlayer(target => lib.skill.gzxuanhuo.subSkill.others.filterTarget(null, _status.event.player, target));
					return '弃置一张手牌并交给' + get.translation(targets) + (targets.length > 1 ? '中的一人' : '') + '一张牌，然后获得以下技能中的一个：〖武圣〗〖咆哮〗〖龙胆〗〖铁骑〗〖烈弓〗〖狂骨〗';
				},
				filterCard(card) {
					return ui.selected.cards.length || get.position(card) == 'h';
				},
				selectCard: 2,
				position: 'he',
				check(card) {
					var player = _status.event.player;
					if (player.hasSkill('gzpaoxiao', true) || player.getEquip('zhuge')) return 0;
					if (player.countCards('h', function (cardx) {
						return cardx != card && cardx.name == 'sha' && player.hasUseTarget(cardx);
					}) < (player.getCardUsable('sha') + 1)) return 0;
					return 7 - get.value(card);
				},
				usable: 1,
				discard: false,
				delay: false,
				content() {
					'step 0'
					player.discard(cards[0]);
					if (target) target.gain(cards[1], player, 'giveAuto');
					'step 1'
					var list = ['new_rewusheng', 'gzpaoxiao', 'new_longdan', 'new_tieji', 'liegong', 'xinkuanggu'];
					player.chooseControl(list).set('ai', () => {
						var list = _status.event.controls.slice();
						if (list.includes('gzpaoxiao')) return 'gzpaoxiao';
						return list.randomGet();
					}).set('prompt', '选择并获得一项技能直到回合结束');
					'step 2'
					player.addTempSkills('fz_' + result.control);
					'step 3'
					game.delayx();
				},
				ai: {
					order: 8,
					result: { player: 1 },
				},
			};
			lib.translate.gzxuanhuo_info = '与你势力相同的其他角色的出牌阶段限一次，其可弃置一张手牌并交给你一张牌，然后选择获得以下一项技能直到回合结束：〖武圣〗、〖咆哮〗、〖龙胆〗、〖铁骑〗、〖烈弓〗、〖狂骨〗。';
		}
		//唐咨
		lib.skill.gzxingzhao.derivation = 'xunxun';
		lib.skill.gzxingzhao.subSkill.use = {
			audio: 'gzxingzhao',
			trigger: { player: 'damageEnd' },
			filter(event, player) {
				var num = lib.skill.gzxingzhao.getNum();
				return num >= 2 && event.source && event.source.isIn() && player.countCards('h') != event.source.countCards('h');
			},
			logTarget(event, player) {
				return player.countCards('h') > event.source.countCards('h') ? event.source : player;
			},
			forced: true,
			content() {
				lib.skill.gzxingzhao.subSkill.use.logTarget(trigger, player).draw();
			},
		};
		lib.translate.gzxingzhao_info = '锁定技，你根据场上存在受伤角色的势力数获得以下效果：1个或以上，你视为拥有〖恂恂〗；2个或以上，当你受到伤害后，你与伤害来源两者中手牌数唯一最少的角色摸一张牌；3个或以上，你的手牌上限+4；4个或以上，当你失去装备区的牌后，你摸一张牌。';
	}

	//设置稀有度
	//鄙人用脚设置的稀有度，只图博君一笑
	if (lib.rank) {
		//平凡升阶
		lib.rank.rarity.junk.remove('sunshao');
		lib.rank.rarity.junk.remove('re_chenqun');
		//设置评级
		var rank = {
			rarity: {
				//传说
				legend: [
					//活动武将包武将
					'bilibili_zhengxuan',
					'bilibili_nanhualaoxian',
					'old_zuoci',
					'bilibili_guanning',
					'bilibili_litiansuo',
					'bilibili_kuangshen04',
					'diy_lvmeng',
					'golden_zuoci',
					'BT_puyuan',
					'lz_sufei',
					'FD_huaxiong',
					'bilibili_shen_guojia',
					'bilibili_re_xusheng',
					//原活动配件武将
					//SSS传说武将评级
					//DDDD
					'sunce',
					're_sunce',
					'machao',
					'dingyuan',
					//正经补充
					'sp_ol_zhanghe',
					'zhangxuan',
					'zhouyi',
					'tengfanglan',
					'caoxiancaohua',
					//----------------分界线----------------
					'old_zhangzhongjing',
					'oldx_zhangzhongjing',
					'old_shen_simayi',
					'old_shen_xunyu',
					'old_shen_taishici',
					'old_shen_sunce',
					'ol_shen_dianwei',
				],
				//史诗
				epic: [
					//活动武将包武将
					'FD_sunjian',
					'FD_feixiongjunyou',
					'FD_fengyaojun',
					'lz_tangzi',
					'lz_liuqi',
					'bol_zhangxiu',
					'bol_sunjian',
					'FD_dongyue',
					//原活动配件武将
					'old_sp_jianggan',
					'ol_maliang',
					'old_clan_xunshu',
					'old_clan_xunchen',
					'old_clan_xuncai',
					'oldx_clan_xuncai',
					'old_clan_xuncan',
					'old_sb_ganning',
					'old_yj_ganning',
					'old_dengai',
					'junk_simayi',
					'old_zhangyì',
					'old_yanghuiyu',
					'old_zhangqiying',
					'junk_lidian',
				],
				//稀有
				rare: [
					//活动武将包武将
					'bilibili_sp_xuyou',
					'bol_liuyu',
					'bol_liuxie',
					'bol_zhanglu',
					'GD_gaolan',
					'FD_niufudongxie',
					'FD_guosi',
					'FD_lijue',
					'lz_huangquan',
					'FD_feixiongjunzuo',
					//原活动配件武将
					'old_yuanji',
					'old_ol_yuanji',
					'junk_duanwei',
					'junk_xuyou',
					'old_yj_zhanghe',
					'old_zhoufei',
					'old_sunluyu',
					'zhaoxiang',
					'old_zhouchu',
					'old_liuzhang',
					'old_wangling',
					'junk_zhangrang',
					'old_zhaoxiang',
					'ol_manchong',
					'ol_yujin',
					'old_xushao',
				],
				//普通
				common: [
				],
				//平凡
				junk: [
					//活动武将包武将
					'FD_baolvejun',
					//原活动配件武将
					'old_ol_xiaoqiao',
					'old_zhanghe',
					'old_zhugejin',
				],
			},
			//出场率
			s: [
			],
			ap: [
			],
			a: [
			],
			am: [
			],
			bp: [
			],
			b: [
			],
			bm: [
			],
			c: [
			],
			d: [
			],
		};
		//块级修改
		const mx_rarity = {
			legend: ['decadeQiHuan', 'decadeZhuoGui', 'MiNikill', 'MX_feihongyinxue', 'decadeKuiBa', 'HD_chaoshikong', 'extra'],
			epic: ['WeChatkill', 'hezongkangqincharacter'],
			rare: ['yingbian'],
			junk: ['sb'],
		};
		for (const i in mx_rarity) {
			for (const j of mx_rarity[i]) {
				for (const name of Object.keys(lib.characterPack[j])) {
					if (!Object.keys(rank.rarity).some(rarity => rank.rarity[rarity].includes(name))) rank.rarity[i].add(name);
				}
			}
		}
		for (const name of Object.keys(lib.characterPack['huodongcharacter'])) {
			if (!Object.keys(rank.rarity).some(rarity => rank.rarity[rarity].includes(name))) {
				if (['Chuodong', 'CDanJi', 'CSCS', 'CXuanDie'].some(pack => lib.characterSort.huodongcharacter[pack].includes(name))) rank.rarity['legend'].push(name);
				else rank.rarity['rare'].push(name);
			}
		}
		for (const name of Object.keys(lib.characterPack['NianShouCharacter'])) {
			if (!Object.keys(rank.rarity).some(rarity => rank.rarity[rarity].includes(name))) {
				if (lib.characterSort.NianShouCharacter.NianShouCharacter2018.includes(name)) rank.rarity['legend'].push(name);
				if (lib.characterSort.NianShouCharacter.NianShouCharacter2019.includes(name)) rank.rarity['legend'].push(name);
			}
		}
		for (const name of lib.characterSort['diy'].diy_trashbin) {
			if (!Object.keys(rank.rarity).some(rarity => rank.rarity[rarity].includes(name))) rank.rarity['junk'].add(name);
		}
		for (const name of lib.characterSort['sp'].sp_qifu) {
			if (!rank.rarity.legend.includes(name)) rank.rarity['legend'].add(name);
		}
		//总置
		var addRank = function (rank) {
			if (!lib.rank) return;
			for (var i in rank) {
				if (i == 'rarity') continue;
				lib.rank[i].addArray(rank[i]);
			}
			if (rank.rarity && lib.rank.rarity) {
				for (var i in rank.rarity) {
					if (!lib.rank.rarity[i]) lib.rank.rarity[i] = [];
					lib.rank.rarity[i].addArray(rank.rarity[i]);
				}
			}
		};
		addRank(rank);
	}

	//名称重置
	if (lib.config.extension_活动武将_HD_REname) {
		const changeMap = {
			'张机': '张仲景',
			'蔡琰': '蔡文姬',
			'卧龙': '卧龙诸葛',
			'严虎': '严白虎',
			'甄宓': '甄姬',
			'伏寿': '伏皇后',
			'吉本': '吉平',
		};
		const BanIdList = ['jsrg_zhenji'].concat(_status?._HD_REname?.BanIdList ?? []);//不修改名称的ID白名单，必须ID完全符合才不替换
		const BanTransList = ['卧龙凤雏', '祭风卧龙'].concat(_status?._HD_REname?.BanTransList ?? []);//不修改名称的translate白名单，包含此翻译的均不替换
		for (const name in lib.translate) {
			const translation = lib.translate[name];
			if (typeof translation !== 'string' || get.character(name).isNull) continue;
			if (BanIdList.includes(name) || BanTransList.some(str => translation.includes(str))) continue;
			const item = Object.keys(changeMap).find(str => translation.includes(str));
			/*
			if (item) {
				const num = translation.indexOf(item);
				lib.translate[name] = translation.slice(0, num) + changeMap[item] + translation.slice(num + item.length, translation.length);
			}
			*/
			if (item) lib.translate[name] = lib.translate[name].replace(item, changeMap[item]);
		}
	}

	//虎牢关
	if (lib.config.extension_活动武将_ShenLvBu && get.mode() != 'boss' && !lib.config.plays?.boss) {
		const mode = await game.loadModeAsync('boss');
		if (mode) {
			for (const i of ['translate', 'dynamicTranslate', 'skill']) {
				if (!mode[i]) continue;
				for (const j in mode[i]) {
					if (!j.startsWith('_') && !lib[i][j]) {
						lib[i][j] = mode[i][j];
						if (i === "skill") {
							if (lib.skill[j].inherit && !lib.skill[lib.skill[j].inherit] && mode.skill[lib.skill[j].inherit]) {
								lib.skill[lib.skill[j].inherit] = mode.skill[lib.skill[j].inherit];
								game.finishSkill(lib.skill[j].inherit);
							}
							game.finishSkill(j);
						}
					}
				}
			}
			//虎牢关彩蛋
			['boss_lvbu1', 'boss_lvbu2', 'boss_lvbu3'].forEach(name => {
				lib.rank.rarity.legend.add(name);
				if (!lib.characterIntro[name] && lib.characterIntro.lvbu) lib.characterIntro[name] = lib.characterIntro.lvbu;
			});
			lib.characterSort.extra.boss_hlg = ['boss_lvbu1', 'boss_lvbu2', 'boss_lvbu3'];
			game.HDaddCharacter('boss_lvbu1', ['male', 'shen', 8, ['wushuang', 'mashu', 'boljingjia', 'boss_aozhan'], ['mode:boss']], 'extra');
			game.HDaddCharacter('boss_lvbu2', ['male', 'shen', 6, ['wushuang', 'mashu', 'xiuluo', 'shenwei', 'shenji'], ['mode:boss']], 'extra');
			game.HDaddCharacter('boss_lvbu3', ['male', 'shen', 6, ['wushuang', 'shenqu', 'jiwu'], ['mode:boss']], 'extra');
			lib.translate.boss_hlg = 'OL·虎牢关';
		}
	}

	//precA
	//配音
	//引用国战配音
	if (!lib.skill.yigui) lib.skill.yigui = { audio: 2 };
	if (!lib.skill.gzshilu) lib.skill.gzshilu = { audio: 2 };
	if (!lib.skill.gzxiongnve) lib.skill.gzxiongnve = { audio: 2 };

	//技能配音修正
	lib.skill.juntun.audio = 'ext:活动武将/audio/skill:true';
	lib.skill.jiaojie.audio = 'ext:活动武将/audio/skill:true';

	//武将配音audioname添加
	game.HDsetAudioname = function (skills, list) {
		if (!Array.isArray(skills)) skills = [skills];
		if (!Array.isArray(list)) list = [list];
		skills.forEach(skill => {
			if (!lib.skill[skill]) return;
			if (!lib.skill[skill].audioname) lib.skill[skill].audioname = [];
			lib.skill[skill].audioname.addArray(list);
		});
	};
	game.HDsetAudioname(['dchuishu', 'dcyishu', 'yingzi', 'biyue'], 'bilibili_zhouxiaomei');
	lib.skill.dchuishu.subSkill.effect.audioname = (lib.skill.dchuishu.subSkill.effect.audioname || []).concat(['bilibili_zhouxiaomei']);
	game.HDsetAudioname('yijin', 'bilibili_litiansuo');
	game.HDsetAudioname(['reqimou', 'zhaxiang', 'zhaxiang2', 'tairan', 'tairan2'], 'bilibili_kuangshen04');

	//武将配音audioname2添加
	game.HDsetAudioname2 = function (skills, map) {
		if (!Array.isArray(skills)) skills = [skills];
		skills.forEach(skill => {
			if (!lib.skill[skill]) return;
			if (!lib.skill[skill].audioname2) lib.skill[skill].audioname2 = {};
			for (var i in map) lib.skill[skill].audioname2[i] = map[i];
		});
	};
	game.HDsetAudioname2('yaowu', {
		FD_huaxiong: 'haoshi2',
	});
	game.HDsetAudioname2('yinghun', {
		FD_sunjian: 'haoshi2',
	});
	game.HDsetAudioname2('gzyinghun', {
		FD_sunjian: 'haoshi2',
	});
	game.HDsetAudioname2('reyicong', {
		jsp_zhaoyun: 'yicong_jsp_zhaoyun',
	});
	game.HDsetAudioname2('yicong', {
		oldx_zhaoyun: 'yicong_jsp_zhaoyun',
	});
	game.HDsetAudioname2('new_rejianxiong', {
		qin_lvbuwei: 'haoshi2',
	});
	game.HDsetAudioname2('rerende', {
		qin_lvbuwei: 'haoshi2',
	});
	game.HDsetAudioname2('rezhiheng', {
		qin_lvbuwei: 'haoshi2',
	});
	game.HDsetAudioname2('relianying', {
		wechat_lukang: 'rejizhi_lukang',
	});
	game.HDsetAudioname2('duanchang', {
		Mmiao_caiwenji: 'minimiaoduanchang',
	});
	game.HDsetAudioname2(['juxiang', 'juxiang1'], {
		Mmiao_zhurong: 'minimiaojuxiang',
	});
	game.HDsetAudioname2('chengxiang', {
		Mnian_caopi: 'chengxiang_Mnian_caopi',
	});

	//precCI
	//武将信息
	//----------------孙笨の专属正名区·始----------------
	lib.characterIntro.re_sunben = lib.characterIntro.sunce || '';
	//----------------孙笨の专属正名区·末----------------
	//遗漏武将介绍补充
	lib.characterIntro.lidian = lib.characterIntro.re_lidian;
	lib.characterIntro.wolongfengchu = lib.characterIntro.zhugeliang + '<br>' + lib.characterIntro.pangtong;

	//precCR
	//同名武将替换
	const hdpj_characterReplace = {
		xuyou: ['bilibili_sp_xuyou'],
		zhangzhongjing: ['bol_zhangzhongjing', 'old_zhangzhongjing', 'oldx_zhangzhongjing'],
		zhoufei: ['old_zhoufei'],
		dengai: ['old_dengai'],
		jin_yanghuiyu: ['old_yanghuiyu'],
		shen_xunyu: ['old_shen_xunyu'],
		shen_simayi: ['old_shen_simayi'],
		shen_taishici: ['old_shen_taishici'],
		shen_sunce: ['old_shen_sunce'],
		zhangqiying: ['old_zhangqiying'],
		sunluyu: ['old_sunluyu'],
		zhaoxiang: ['old_zhaoxiang'],
		zhangyì: ['old_zhangyì'],
		manchong: ['ol_manchong'],
		yj_ganning: ['old_yj_ganning'],
		ol_lusu: ['lusu'],
		re_yuanshao: ['yuanshao'],
		xushao: ['old_xushao'],
		yuanji: ['old_yuanji', 'old_ol_yuanji'],
		zhanghe: ['old_zhanghe'],
		zhugejin: ['old_zhugejin'],
		xiaoqiao: ['old_ol_xiaoqiao'],
		xunchen: ['old_xunchen'],
		sunshao: ['old_sp_sunshao'],
		huaxin: ['bol_sp_huaxin', 'old_sp_huaxin'],
		kongrong: ['old_sp_kongrong'],
		dc_mifuren: ['old_sp_mifuren'],
		liuzhang: ['old_liuzhang'],
		zhouchu: ['old_zhouchu'],
		ganning: ['old_sb_ganning'],
		zhangbao: ['old_zhangbao'],
		jsp_guanyu: ['bolx_jsp_guanyu'],
		yj_jushou: ['old_yj_jushou'],
		shen_dianwei: ['ol_shen_dianwei'],
		jianggan: ['old_sp_jianggan'],
	};
	for (const i in hdpj_characterReplace) {
		let list = lib.characterReplace[i] || [];
		lib.characterReplace[i] = list.concat(hdpj_characterReplace[i]).unique();
	}

	//precC
	//武将补充/修改
	//标包
	game.HDaddCharacter('re_yuanshu', ['male', 'qun', 4, ['wangzun', 'tongji'], []], 'standard');

	//神将
	lib.characterSort.extra.extra_ol.addArray(['ol_shen_dianwei']);
	game.HDaddCharacter('shen_sunquan', ['male', 'shen', 4, ['bolyuheng', 'boldili'], ['wu']], 'extra');
	game.HDaddCharacter('ol_shen_dianwei', ['male', 'shen', 4, ['juanjia', 'fh_qiexie', 'fh_cuijue'], ['wei', ...['character:', 'die:'].map(i => i + 'shen_dianwei')]], 'extra');

	//界限突破
	game.HDaddCharacter('dc_xushu', ['male', 'shu', 4, ['bolzhuhai', 'xsqianxin'], []], 'refresh');

	//璀璨星河
	game.HDaddCharacter('maliang', ['male', 'shu', 3, ['zishu', 'xinyingyuan'], []], 'sp');
	game.HDaddCharacter('zhanghua', ['male', 'jin', 3, ['olbihun', 'oljianhe', 'bolchuanwu'], []], 'sp');

	//系列专属包
	lib.characterSort.sp2.sp2_waitforsort.addArray(['junk_zhangrang']);
	game.HDaddCharacter('junk_zhangrang', ['male', 'qun', 3, ['junktaoluan'], ['die:zhangrang']], 'sp2');

	//OL专属
	lib.characterSort.onlyOL.bilibili_buchong_onlyOL = ['junk_lidian'];
	game.HDmoveCharacter('junk_lidian', 'onlyOL');
	lib.characterPack.onlyOL.junk_lidian[4].add('die:lidian');
	if (lib.config.characters.includes('onlyOL')) lib.character.junk_lidian[4].add('die:lidian');

	//移动服
	lib.characterSort.mobile.bilibili_buchong_mobile = ['old_zhaoxiang', 'ol_maliang', 'ol_yuanshu', 'old_bulianshi', 'old_zhangqiying', 'junk_xuyou'];
	game.HDaddCharacter('old_zhangqiying', ['female', 'qun', 3, ['xinfu_falu', 'olddianhua', 'oldzhenyi'], ['die:zhangqiying']], 'mobile');
	game.HDaddCharacter('junk_xuyou', ['male', 'qun', 3, ['nzry_chenglve', 'junkshicai', 'nzry_cunmu'], []], 'mobile');
	game.HDaddCharacter('old_bulianshi', ['female', 'wu', 3, ['anxu', 'zhuiyi'], []], 'mobile');
	game.HDaddCharacter('ol_yuanshu', ['male', 'qun', 4, ['rewangzun', 'retongji'], []], 'mobile');
	game.HDaddCharacter('ol_maliang', ['male', 'shu', 3, ['zishu', 'yingyuan'], []], 'mobile');
	game.HDaddCharacter('old_zhaoxiang', ['female', 'shu', 4, ['xinfanghun', 'xinfuhan'], ['die:zhaoxiang']], 'mobile');

	//线下
	lib.characterSort.offline.offline_star.add('bolx_jsp_guanyu');
	lib.characterSort.offline.offline_yongjian.add('bol_sunluban');
	if (lib.config.extension_活动武将_XvXiang) {
		for (var i of lib.characterSort.offline.offline_vtuber) lib.characterPack.offline[i][3].add('bilibili_xuxiang');
	}
	game.HDaddCharacter('bolx_jsp_guanyu', ['male', 'wei', 4, ['wusheng', 'wzdanji'], ['tempname:jsp_guanyu', 'die:jsg_guanyu']], 'offline');
	game.HDaddCharacter('bol_sunluban', ['female', 'wu', 3, ['boljiaozong', 'bolchouyou']], 'offline');

	//怀旧包
	lib.characterSort.old.bilibili_buchong_shenhua = ['old_zhoufei', 'lusu', 'yuanshao', 'old_dengai'];
	lib.characterSort.old.bilibili_buchong_yijiang = ['old_yj_jushou', 'ol_manchong'];
	lib.characterSort.old.bilibili_buchong_sp = ['old_zhangbao', 'old_sunluyu', 'old_pangtong', 'old_ol_yuanji'];
	lib.characterSort.old.bilibili_buchong_szn2 = ['old_yuanji', 'old_xushao', 'junk_duanwei', 'old_dongxie'];
	lib.characterSort.old.bilibili_buchong_mobile2 = ['old_sb_ganning', 'old_zhouchu', 'old_xunchen', 'old_sp_kongrong', 'old_zhangzhongjing', 'oldx_zhangzhongjing', 'old_zhangyì', 'old_yj_ganning', 'old_yanghuiyu', 'old_liuzhang', 'old_sp_sunshao', 'old_wangling', 'old_sp_huaxin', 'old_sp_mifuren', 'old_sp_jianggan'];
	lib.characterSort.old.bilibili_buchong_menfashizu = ['old_clan_xunshu', 'old_clan_xunchen', 'old_clan_xuncai', 'old_clan_xuncan', 'oldx_clan_xuncai'];
	lib.characterSort.old.bilibili_buchong_extra = ['old_shen_sunce', 'old_shen_taishici', 'old_shen_simayi', 'old_shen_xunyu'];
	game.HDaddCharacter('old_clan_xunshu', ['male', 'qun', 3, ['old_shenjun', 'old_balong', 'clandaojie'], ['clan:颍川荀氏', 'tempname:clan_xunshu', 'die:clan_xunshu']], 'old');
	game.HDaddCharacter('old_clan_xunchen', ['male', 'qun', 3, ['old_sankuang', 'old_beishi', 'clandaojie'], ['clan:颍川荀氏', 'tempname:clan_xunchen', 'die:clan_xunchen']], 'old');
	game.HDaddCharacter('old_clan_xuncai', ['female', 'qun', 3, ['old_lieshi', 'old_dianzhan', 'old_huanyin', 'clandaojie'], ['clan:颍川荀氏', 'tempname:clan_xuncai', 'die:clan_xuncai']], 'old');
	game.HDaddCharacter('old_clan_xuncan', ['male', 'wei', 3, ['old_yunshen', 'old_shangshen', 'old_fenchai', 'clandaojie'], ['clan:颍川荀氏', 'tempname:clan_xuncan', 'die:clan_xuncan']], 'old');
	game.HDaddCharacter('oldx_clan_xuncai', ['female', 'qun', 3, ['oldx_lieshi', 'oldx_dianzhan', 'clanhuanyin', 'clandaojie'], ['clan:颍川荀氏', 'tempname:clan_xuncai', 'die:clan_xuncai']], 'old');
	game.HDaddCharacter('lusu', ['male', 'wu', 3, ['haoshi', 'redimeng'], ['die:re_lusu']], 'old');
	game.HDaddCharacter('yuanshao', ['male', 'qun', 4, ['oldluanji', 'xueyi'], ['zhu']], 'old');
	game.HDaddCharacter('old_yj_jushou', ['male', 'qun', 3, ['jianying', 'oldshibei'], ['die:yj_jushou']], 'old');
	game.HDaddCharacter('old_shen_xunyu', ['male', 'shen', 3, ['old_tianzuo', 'old_lingce', 'old_dinghan'], ['wei', 'die:shen_xunyu']], 'old');
	game.HDaddCharacter('old_shen_simayi', ['male', 'shen', 3, ['reguicai', 'fangzhu', 'rewansha', 'rezhiheng', 'rejizhi'], ['wei', 'tempname:new_simayi', 'die:new_simayi']], 'old');
	game.HDaddCharacter('old_shen_taishici', ['male', 'shen', 4, ['olddulie', 'oldpowei', 'dangmo'], ['wu', 'die:shen_taishici']], 'old');
	game.HDaddCharacter('old_shen_sunce', ['male', 'shen', '1/6', ['old_yingba', 'old_fuhai', 'old_pinghe'], ['wu', 'die:shen_sunce']], 'old');
	game.HDaddCharacter('old_zhangyì', ['male', 'shu', 4, ['zhiyi'], ['die:zhangyì']], 'old');
	game.HDaddCharacter('old_xunchen', ['male', 'qun', 3, ['jianzhan', 'reduoji'], ['die:ext:活动武将/audio/die:true']], 'old');
	game.HDaddCharacter('old_zhangzhongjing', ['male', 'qun', 3, ['old_jishi', 'liaoyi', 'binglun'], ['die:zhangzhongjing']], 'old');
	game.HDaddCharacter('oldx_zhangzhongjing', ['male', 'qun', 3, ['jishi', 'old_liaoyi', 'binglun'], ['die:zhangzhongjing']], 'old');
	game.HDaddCharacter('old_yanghuiyu', ['female', 'wei', 3, ['oldhongyi', 'quanfeng'], ['die:yanghuiyu']], 'old');
	game.HDaddCharacter('old_zhoufei', ['female', 'wu', 3, ['liangyin', 'kongsheng'], ['die:zhoufei']], 'old');
	game.HDaddCharacter('old_dengai', ['male', 'wei', 3, ['bilibili_zhenggong', 'bilibili_toudu'], ['die:ext:活动武将/audio/die:true']], 'old');
	game.HDaddCharacter('old_yj_ganning', ['male', 'qun', 4, ['bilibili_jinfan', 'bilibili_sheque'], ['die:yj_ganning']], 'old');
	game.HDaddCharacter('old_zhangbao', ['male', 'qun', 3, ['old_zhoufu', 'old_yingbing'], ['die:zhangbao']], 'old');
	game.HDaddCharacter('old_sunluyu', ['female', 'wu', 3, ['meibu', 'mumu'], ['die:sunluyu']], 'old');
	game.HDaddCharacter('old_pangtong', ['male', 'qun', 3, ['manjuan', 'zuixiang'], ['character:sp_pangtong', 'die:sp_pangtong']], 'old');
	game.HDaddCharacter('old_ol_yuanji', ['female', 'wu', 3, ['old_jieyan', 'old_jinghua', 'old_shuiyue'], ['die:ol_yuanji']], 'old');
	game.HDaddCharacter('ol_manchong', ['male', 'wei', 3, ['xinjunxing', 'yuce'], ['die:manchong']], 'old');
	game.HDaddCharacter('old_xushao', ['male', 'qun', 3, ['bol_pinjian', 'bol_yuedan'], ['die:xushao']], 'old');
	game.HDaddCharacter('old_sp_sunshao', ['male', 'wu', 3, ['refubi', 'rezuici'], ['die:sp_sunshao']], 'old');
	game.HDaddCharacter('old_liuzhang', ['male', 'qun', 3, ['xiusheng', 'yinlang', 'huaibi'], ['zhu', 'die:liuzhang']], 'old');
	game.HDaddCharacter('old_wangling', ['male', 'wei', 4, ['mouli', 'zifu'], ['die:wangling']], 'old');
	game.HDaddCharacter('old_sp_huaxin', ['male', 'wei', 3, ['hxrenshi', 'debao', 'buqi'], ['die:sp_huaxin']], 'old');
	game.HDaddCharacter('old_sp_kongrong', ['male', 'qun', 3, ['spmingshi', 'splirang'], ['die:sp_kongrong']], 'old');
	game.HDaddCharacter('old_sp_mifuren', ['female', 'shu', 3, ['spguixiu', 'spcunsi'], ['die:sp_mifuren']], 'old');
	game.HDaddCharacter('old_zhouchu', ['male', 'wu', 4, ['xianghai', 'chuhai'], ['die:zhouchu']], 'old');
	game.HDaddCharacter('old_sb_ganning', ['male', 'wu', 4, ['old_qixi', 'old_fenwei'], ['die:sb_ganning']], 'old');
	game.HDmoveCharacter('junk_duanwei', 'old');
	lib.characterPack.old.junk_duanwei[4].add('die:duanwei');
	if (lib.config.characters.includes('old')) lib.character.junk_duanwei[4].add('die:duanwei');
	game.HDaddCharacter('old_sp_jianggan', ['male', 'wei', 3, ['spdaoshu', 'spdaizui'], ['die:sp_jianggan']], 'old');
	game.HDaddCharacter('old_yuanji', ['female', 'wu', 3, ['dcmengchi', 'dcjiexing'], ['die:yuanji']], 'old');
	game.HDaddCharacter('old_dongxie', ['female', 'qun', 4, ['juntun', 'jiaojie'], ['die:dongxie']], 'old');

	//DIY
	lib.characterSort.diy.diy_trashbin.addArray(['bol_zhangzhongjing', 'bol_sp_huaxin', 'bfake_zuoci', 'bfake_yangfu', 'bfake_chengpu', 'bfake_sundeng', 'old_shen_sunquan', 'old_shen_ganning', 'bfake_chengui', 'old_ol_xiaoqiao', 'old_zhanghe', 'old_zhugejin', 'oldx_zhangfei', 'oldx_guanyu', 'oldx_zhaoyun', 'oldx_yujin']);
	game.HDaddCharacter('bfake_yangfu', ['male', 'wei', 4, ['old_jiebing', 'old_kuzhan'], ['die:yangfu']], 'diy');
	game.HDaddCharacter('bfake_zuoci', ['male', 'qun', 3, ['BThuashen', 'BTxinsheng'], ['die:re_zuoci']], 'diy');
	game.HDaddCharacter('bfake_chengpu', ['male', 'wu', 4, ['bollihuo', 'bolchunlao'], ['die:chengpu']], 'diy');
	game.HDaddCharacter('bfake_sundeng', ['male', 'wu', 4, ['bolkuangbi'], ['die:sundeng']], 'diy');
	game.HDaddCharacter('old_shen_sunquan', ['male', 'shen', 4, ['shen_sunquan_skill'], ['wu', 'die:shen_sunquan']], 'diy');
	game.HDaddCharacter('old_shen_ganning', ['male', 'shen', 1, ['old_jieying', 'old_tongling'], ['wu', 'die:shen_ganning']], 'diy');
	game.HDaddCharacter('bfake_chengui', ['male', 'qun', 3, ['bolyingtu', 'bolcongshi'], ['die:chengui']], 'diy');
	if (lib.config.connect_nickname == '萌新（转型中）') {
		game.HDaddCharacter('bol_sp_huaxin', ['male', 'wei', 3, ['bolyuanqing', 'bolshuchen', 'bolxiezheng'], ['die:sp_huaxin']], 'diy');
		game.HDaddCharacter('bol_zhangzhongjing', ['male', 'qun', 3, ['bolliaoyi', 'bolbinglun'], ['die:zhangzhongjing']], 'diy');
	}
	game.HDaddCharacter('old_ol_xiaoqiao', ['female', 'wu', 3, ['oltianxiang', 'rehongyan'], ['die:ol_xiaoqiao']], 'diy');
	game.HDaddCharacter('old_zhanghe', ['male', 'wei', 4, ['qiaobian', 'bilibili_zhiyinxian']], 'diy');
	game.HDaddCharacter('old_zhugejin', ['male', 'wu', 3, ['olhongyuan', 'bolhuanshi', 'olmingzhe'], ['die:ol_zhugejin']], 'diy');
	game.HDaddCharacter('oldx_zhangfei', ['male', 'shu', 4, ['paoxiao', 'bilibili_tannang'], ['character:zhangfei', 'die:zhangfei']], 'diy');
	game.HDaddCharacter('oldx_guanyu', ['male', 'shu', 4, ['wusheng', 'bilibili_yishi'], ['character:guanyu', 'die:guanyu']], 'diy');
	game.HDaddCharacter('oldx_zhaoyun', ['male', 'shu', 4, ['longdan', 'yicong'], ['character:zhaoyun', 'die:zhaoyun']], 'diy');
	game.HDaddCharacter('oldx_yujin', ['male', 'wei', 4, ['bilibili_zhengjun'], ['character:yujin', 'die:yujin']], 'diy');

	//precS
	//技能修改
	//魅步
	lib.skill.meibu.content = function () {
		var target = trigger.player;
		target.addTempSkill('meibu_range');
		target.storage.meibu_range = player;
		target.markSkillCharacter('meibu_range', player, '魅步', '锦囊牌均视为【杀】且' + get.translation(player) + '视为在攻击范围内');
	};
	lib.skill.meibu.subSkill.range = {
		charlotte: true,
		onremove: true,
		mod: {
			cardname(card) {
				if (get.itemtype(card) == 'card' && (get.type(card, null, false) == 'trick' || get.type(card, null, false) == 'delay')) return 'sha';
			},
			targetInRange(card, player, target) {
				if (!player.storage.meibu_range) return;
				if (target == player.storage.meibu_range) return true;
			},
		},
	};
	lib.translate.meibu_info = '其他角色的出牌阶段开始时，若你不在其攻击范围内，你可以令该角色的锦囊牌均视为【杀】直到回合结束。若如此做，本回合你视为在其攻击范围内。';
	//周处
	lib.skill._xianghai = {
		charlotte: true,
		trigger: { player: ['useCard1', 'respond'] },
		filter(event, player) {
			if (!player.hasSkill('xianghai')) return false;
			return event.card.name == 'jiu' && !event.skill && event.cards?.length == 1 && get.type(event.cards[0]) == 'equip';
		},
		priority: 15,
		direct: true,
		content() { player.logSkill('xianghai') },
	};
	//暴怒战神
	lib.skill._shenji = {
		charlotte: true,
		trigger: { player: 'useCard1' },
		filter(event, player) {
			if (!player.hasSkill('shenji')) return false;
			return event.card.name == 'sha' && (event.targets.length > 1 || player.countUsed('sha', true) > 1);
		},
		priority: 15,
		direct: true,
		content() { player.logSkill('shenji') },
	};
	//神张角
	delete lib.skill.yizhao.intro.markcount;
	lib.skill.yizhao.filter = function (event, player) {
		return typeof get.number(event.card) == 'number' && (player.countMark('yizhao') < 184 || !lib.config.extension_活动武将_ShenZhangJiao);
	};
	lib.skill.yizhao.content = function () {
		'step 0'
		event.num = player.countMark('yizhao');
		player.addMark('yizhao', Math.min(get.number(trigger.card), (lib.config.extension_活动武将_ShenZhangJiao ? 184 - player.countMark('yizhao') : get.number(trigger.card))));
		'step 1'
		var num = Math.floor(num / 10) % 10, num2 = Math.floor(player.countMark('yizhao') / 10) % 10;
		if (num != num2) {
			var card = get.cardPile2(card => {
				return get.number(card, false) == num2;
			});
			if (card) player.gain(card, 'gain2');
			else {
				player.chat('无牌可得？！');
				game.log('但是牌堆中已经没有点数为', '#y' + num2, '的牌了！');
			}
		}
	};
	//左慈
	lib.skill.rehuashen.drawCharacter = function (player, list) {
		game.broadcastAll(function (player, list) {
			player.$draw(list.map(function (name) {
				if (!player.isUnderControl(true)) return game.createCard('huashen_unknown', ' ', ' ');
				var cardname = 'huashen_card_' + name;
				lib.card[cardname] = {
					fullimage: true,
					image: 'character:' + name
				}
				lib.translate[cardname] = get.rawName2(name);
				return game.createCard(cardname, ' ', ' ');
			}), 'nobroadcast');
		}, player, list);
	};
	//YYDSの蔡阳
	lib.skill.yinka.charlotte = true;
	lib.skill.yinka.trigger = { global: ['drawBegin', 'judgeBegin'] };
	lib.skill.yinka.firstDo = true;
	lib.skill.yinka.group = 'yinka_view';
	lib.skill.yinka.subSkill = { view: { ai: { viewHandcard: true, skillTagFilter: (player, arg, target) => target != player } } };
	//星黄忠
	lib.skill.spshidi.intro.markcount = storage => (storage || 0) % 2 == 0 ? '攻' : '守';

	//precT
	//翻译
	//Prefix添加
	lib.namePrefix.set('废案', {
		color: '#a4a4a4',
		nature: 'black',
		showName: '废',
	});
	//删除翻译
	delete lib.translate.sp_shenpei_prefix;
	delete lib.translate.jin_xiahouhui_prefix;
	const hdpj_translate = {
		//修改武将翻译
		//手杀前缀
		re_sunben: '手杀界孙策',
		re_sunben_prefix: '手杀界',
		shenpei: '手杀审配',
		shenpei_prefix: '手杀',
		//新杀前缀
		dc_zhuling: '新杀朱灵',
		dc_zhuling_prefix: '新杀',
		//其他前缀
		jsrg_sunlubansunluyu: '合孙鲁班孙鲁育',
		jsrg_sunlubansunluyu_ab: '合大小虎',
		//取消前缀
		sp_shenpei: '审配',
		gz_dengzhi: '邓芝',
		gz_miheng: '祢衡',
		jin_xiahouhui: '夏侯徽',
		gz_huangzu: '黄祖',
		gz_liuba: '刘巴',

		//添加武将翻译
		old_clan_xunshu: '旧荀淑',
		old_clan_xunshu_prefix: '旧',
		old_clan_xunchen: '旧荀谌',
		old_clan_xunchen_prefix: '旧',
		old_clan_xuncai: '旧荀采',
		old_clan_xuncai_prefix: '旧',
		old_clan_xuncan: '旧荀粲',
		old_clan_xuncan_prefix: '旧',
		oldx_clan_xuncai: '旧荀采',
		oldx_clan_xuncai_prefix: '旧',
		old_yj_jushou: '旧沮授',
		old_yj_jushou_prefix: '旧',
		old_shen_xunyu: '旧神荀彧',
		old_shen_xunyu_prefix: '旧神',
		old_shen_simayi: '单机神司马懿',
		old_shen_simayi_ab: '神司马懿',
		old_shen_taishici: '旧神太史慈',
		old_shen_taishici_prefix: '旧神',
		old_shen_sunce: '旧神孙策',
		old_shen_sunce_prefix: '旧神',
		old_zhangyì: '旧张翼',
		old_zhangyì_prefix: '旧',
		old_yanghuiyu: '旧羊徽瑜',
		old_yanghuiyu_prefix: '旧',
		junk_zhangrang: '新杀张让',
		junk_zhangrang_prefix: '新杀',
		old_zhangqiying: '手杀张琪瑛',
		old_zhangqiying_prefix: '手杀',
		bolx_jsp_guanyu: '★SP关羽',
		bolx_jsp_guanyu_prefix: '★SP',
		bol_sunluban: '用间孙鲁班',
		bol_sunluban_prefix: '用间',
		old_zhoufei: '旧周妃',
		old_zhoufei_prefix: '旧',
		old_dengai: '邓士载',
		old_yj_ganning: '旧甘宁',
		old_yj_ganning_prefix: '旧',
		old_xunchen: '旧荀谌',
		old_xunchen_prefix: '旧',
		old_liuzhang: '旧刘璋',
		old_liuzhang_prefix: '旧',
		old_sp_sunshao: '旧孙邵',
		old_sp_sunshao_prefix: '旧',
		old_zhaoxiang: '手杀赵襄',
		old_zhaoxiang_prefix: '手杀',
		old_bulianshi: '手杀步练师',
		old_bulianshi_prefix: '手杀',
		ol_yuanshu: '手杀袁术',
		ol_yuanshu_prefix: '手杀',
		old_yuanshu: '手杀界袁术',
		old_yuanshu_prefix: '手杀界',
		old_wangling: '旧王淩',
		old_wangling_prefix: '旧',
		old_sp_huaxin: '旧华歆',
		old_sp_huaxin_prefix: '旧',
		old_sp_kongrong: '旧孔融',
		old_sp_kongrong_prefix: '旧',
		old_sp_mifuren: '旧糜夫人',
		old_sp_mifuren_prefix: '旧',
		old_zhouchu: '旧周处',
		old_zhouchu_prefix: '旧',
		old_sb_ganning: '旧甘宁',
		old_sb_ganning_prefix: '旧',
		old_zhangbao: '旧张宝',
		old_zhangbao_prefix: '旧',
		old_sunluyu: '旧孙鲁育',
		old_sunluyu_prefix: '旧',
		old_pangtong: '旧庞统',
		old_pangtong_prefix: '旧',
		ol_manchong: '旧满宠',
		ol_manchong_prefix: '旧',
		old_xushao: '旧许劭',
		old_xushao_prefix: '旧',
		old_ol_xiaoqiao: '小乔',
		old_zhanghe: '张郃',
		old_zhugejin: '诸葛瑾',
		ol_maliang: '手杀马良',
		ol_maliang_prefix: '手杀',
		junk_duanwei: '旧段煨',
		junk_duanwei_prefix: '旧',
		oldx_zhangfei: '张翼德',
		oldx_guanyu: '关云长',
		oldx_zhaoyun: '赵子龙',
		oldx_yujin: '于文则',
		old_yuanji: '旧袁姬',
		old_yuanji_prefix: '旧',
		old_dongxie: '旧董翓',
		old_dongxie_prefix: '旧',
		bfake_yangfu: '废案杨阜',
		bfake_yangfu_prefix: '废案',
		bfake_zuoci: '谋左慈',
		bfake_zuoci_prefix: '谋',
		bfake_chengpu: '废案程普',
		bfake_chengpu_prefix: '废案',
		bfake_sundeng: '废案孙登',
		bfake_sundeng_prefix: '废案',
		old_shen_sunquan: '废案神孙权',
		old_shen_sunquan_prefix: '废案|神',
		old_shen_ganning: '废案神甘宁',
		old_shen_ganning_prefix: '废案|神',
		bol_sp_huaxin: '废案华歆',
		bol_sp_huaxin_prefix: '废案',
		bfake_chengui: '废案陈珪',
		bfake_chengui_prefix: '废案',
		old_zhangzhongjing_prefix: '旧',
		oldx_zhangzhongjing_prefix: '旧',
		bol_zhangzhongjing_prefix: '废案',
		ol_shen_dianwei: 'OL神典韦',
		ol_shen_dianwei_prefix: 'OL神',
		old_ol_yuanji: '旧OL袁姬',
		old_ol_yuanji_prefix: '旧|OL',
		'#ext:活动武将/audio/die/old_xunchen:die': '点击播放阵亡配音',
		'#ext:活动武将/audio/die/old_dengai:die': '点击播放阵亡配音',
		old_sp_jianggan: '旧蒋干',
		old_sp_jianggan_prefix: '旧',

		//武将分包翻译
		bilibili_buchong_shenhua: '武将补充·神话再临',
		bilibili_buchong_yijiang: '武将补充·一将成名',
		bilibili_buchong_menfashizu: '武将补充·门阀士族',
		bilibili_buchong_extra: '武将补充·神武将',
		bilibili_buchong_sp: '武将补充·SP',
		bilibili_buchong_szn2: '武将补充·十周年服',
		bilibili_buchong_mobile: '武将补充·移动服',
		bilibili_buchong_mobile2: '武将补充·移动服',
		bilibili_buchong_onlyOL: '武将补充·OL',

		//技能翻译
		weipo: '横虑',
		dcliuzhuan_tag: '流转',
		dcliuzhuan_info: '锁定技，其他角色的回合内，其于摸牌阶段外获得的牌无法对你使用，这些牌本回合进入弃牌堆后，你获得之。',
		zunwei_info: '出牌阶段限一次，你可以：①将体力值回复至与一名其他角色相同；②将手牌数摸至与一名其他角色相同（至多摸五张）；③为空装备栏使用牌堆中的装备牌直至你装备区里的牌数与一名其他角色相等。（每个选项每局限选择一次）',
		olpaoxiao_info: '锁定技。①你使用【杀】无次数限制。②当你使用的【杀】被【闪】抵消后，你令本回合下一次因【杀】造成的伤害+X（X为造成伤害前的抵消次数）。',
		sbliegong_info: '若你的装备区内没有武器牌，则你手牌区内所有【杀】的属性视为无属性。当你使用牌时或成为其他角色使用牌的目标后，若此牌有花色且你未记录此牌的花色，你记录此牌的花色。当你使用【杀】指定唯一目标后，若〖烈弓〗存在记录花色，则你可亮出牌堆顶的X张牌（X为〖烈弓〗记录过的花色数-1），令此【杀】的伤害值基数+Y（Y为亮出牌中被〖烈弓〗记录过花色的牌的数量），且目标角色不能使用〖烈弓〗记录过花色的牌响应此【杀】。此【杀】使用结算结束后，你清除〖烈弓〗记录的的花色。',
	};
	for (const i in hdpj_translate) lib.translate[i] = hdpj_translate[i];

	//precCT
	//武将前缀
	const hdpj_characterTitle = {
		bol_sunluban: '测试专用，问题居多<br>仅供参考，娱乐为上',
		old_zhangzhongjing: '第一版张仲景',
		oldx_zhangzhongjing: '第三版张仲景',
		bol_zhangzhongjing: '仁望值弃稿',
		bol_sp_huaxin: '仁望值弃稿',
	};
	for (const i in hdpj_characterTitle) lib.characterTitle[i] = hdpj_characterTitle[i];
}
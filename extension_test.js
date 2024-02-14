'use strict';
//测试内容
//多为即将上本体的一些新/改函数
var HDPJ=function(lib,game,ui,get,ai,_status){
//PR获得技能/失去技能时机添加
if(!lib.element.player.changeSkills){
lib.element.player.addSkills=function(skill){
if(!skill) return;
return this.changeSkills(Array.isArray(skill)?skill:[skill],[]);
};
lib.element.player.removeSkills=function(skill){
if(!skill) return;
return this.changeSkills([],Array.isArray(skill)?skill:[skill]);
}
lib.element.player.changeSkills=function(addSkill=[],removeSkill=[]){
const next=game.createEvent('changeSkills',false);
next.player=this;
next.addSkill=addSkill.slice().unique();
next.removeSkill=removeSkill.slice().unique();
next.setContent(async function(event,trigger,player){
//去重检查
event.addSkill.unique();
event.removeSkill.unique();
const duplicatedSkills=event.addSkill.filter(skill=>event.removeSkill.includes(skill));
if(duplicatedSkills.length){
event.addSkill.removeArray(duplicatedSkills);
event.removeSkill.removeArray(duplicatedSkills);
}
if(!event.addSkill.length&&!event.removeSkill.length) return;
//手动触发时机
await event.trigger('changeSkillsBefore');
await event.trigger('changeSkillsBegin');
//处理失去和获得的技能
if(event.$handle) event.$handle(player,event.addSkill,event.removeSkill,event);
else{
if(event.addSkill.length) player.addSkillLog(event.addSkill);
if(event.removeSkill.length) player.removeSkillLog(event.removeSkill);
}
await event.trigger('changeSkillsEnd');
await event.trigger('changeSkillsAfter');
});
return next;
};
lib.element.event.trigger = function(name) {
if (_status.video) return;
if ((this.name === 'gain' || this.name === 'lose') && !_status.gameDrawed) return;
if (name === 'gameDrawEnd') _status.gameDrawed = true;
if (name === 'gameStart') {
lib.announce.publish('gameStart', {});
if (_status.brawl && _status.brawl.gameStart) _status.brawl.gameStart();
if (lib.config.show_cardpile) ui.cardPileButton.style.display = '';
_status.gameStarted = true;
game.showHistory();
}
if (!lib.hookmap[name] && !lib.config.compatiblemode) return;
if (!game.players || !game.players.length) return;
const event = this;
let start = [_status.currentPhase, event.source, event.player, game.me, game.players[0]].find(i => get.itemtype(i) == 'player');
if (!start) return;
if (!game.players.includes(start) && !game.dead.includes(start)) start = game.findNext(start);
const firstDo = {
player: "firstDo",
todoList: [],
doneList: [],
};
const lastDo = {
player: "lastDo",
todoList: [],
doneList: [],
};
const doingList = [];
const roles = ['player', 'source', 'target', 'global'];
const playerMap = game.players.concat(game.dead).sortBySeat(start);
let player = start;
let allbool = false;
do {
const doing = {
player: player,
todoList: [],
doneList: [],
listAdded: {},
addList(skill) {
if (!skill) return;
if (Array.isArray(skill)) return skill.forEach(i => this.addList(i));
if (this.listAdded[skill]) return;
this.listAdded[skill] = true;

const info = lib.skill[skill];
const list = info.firstDo ? firstDo.todoList : info.lastDo ? lastDo.todoList : this.todoList;
list.push({
skill: skill,
player: this.player,
priority: get.priority(skill),
});
if (typeof list.player == 'string') list.sort((a, b) => (b.priority - a.priority) || (playerMap.indexOf(a) - playerMap.indexOf(b)));
else list.sort((a, b) => b.priority - a.priority);
allbool = true;
}
};

const notemp = player.skills.slice();
for (const j in player.additionalSkills) {
if (!j.startsWith('hidden:')) notemp.addArray(player.additionalSkills[j]);
}
Object.keys(player.tempSkills).filter(skill => {
if (notemp.includes(skill)) return false;
const expire = player.tempSkills[skill];
if (typeof expire === 'function') return expire(event, player, name);
if (get.objtype(expire) === 'object') return roles.some(role => {
if (role !== 'global' && player !== event[role]) return false;
if (Array.isArray(expire[role])) return expire[role].includes(name);
return expire[role] === name;
});
}).forEach(skill => {
delete player.tempSkills[skill];
player.removeSkill(skill);
});

if (lib.config.compatiblemode) {
doing.addList(game.expandSkills(player.getSkills('invisible').concat(lib.skill.global)).filter(skill => {
const info = get.info(skill);
if (!info || !info.trigger) return false;
return roles.some(role => {
if (info.trigger[role] === name) return true;
if (Array.isArray(info.trigger[role]) && info.trigger[role].includes(name)) return true;
});
}));
}
else roles.forEach(role => {
doing.addList(lib.hook.globalskill[role + '_' + name]);
doing.addList(lib.hook[player.playerid + '_' + role + '_' + name]);
});
delete doing.listAdded;
delete doing.addList;
doingList.push(doing);
player = player.nextSeat;
} while (player && player !== start);
doingList.unshift(firstDo);
doingList.push(lastDo);
// console.log(name,event.player,doingList.map(i=>({player:i.player,todoList:i.todoList.slice(),doneList:i.doneList.slice()})))

if (allbool) {
const next = game.createEvent('arrangeTrigger', false, event);
next.setContent('arrangeTrigger');
next.doingList = doingList;
next._trigger = event;
next.triggername = name;
next.playerMap = playerMap;
event._triggering = next;
return next;
}
return null;
};
}
};
window.HDPJ_import(HDPJ);
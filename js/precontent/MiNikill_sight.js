import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
//孩子们，欢杀武将太多了（悲），新写一个界面来装这些武将吧
export default function () {
    if (!ui.create?.menu) return;
    const onclickInterface = function () {
        const menuItems = Object.keys(lib.characterSort.MiNikill);
        const overlay = document.createElement('div');
        overlay.id = 'overlay-container';
        //创建返回按钮
        const backButton = document.createElement('button');
        backButton.id = 'overlay-back-btn';
        backButton.textContent = '返回';
        overlay.appendChild(backButton);
        //创建左侧导航列
        const leftNav = document.createElement('div');
        leftNav.id = 'overlay-left-nav';
        const leftNavScrollContainer = document.createElement('div');
        leftNavScrollContainer.id = 'left-nav-scroll-container';
        leftNav.appendChild(leftNavScrollContainer);
        overlay.appendChild(leftNav);
        //创建右侧内容区域
        const dialog = document.createElement('div');
        dialog.id = 'overlay-dialog';
        const dialogContent = document.createElement('div');
        dialogContent.className = 'dialog-content';
        dialog.appendChild(dialogContent);
        overlay.appendChild(dialog);
        //大的来了孩子们
        //滚动控制函数
        const updateScrollBehavior = function () {
            const leftContainer = document.getElementById('left-nav-scroll-container');
            const dialogContent = document.querySelector('.dialog-content');
            if (leftContainer) {
                const shouldLeftScroll = leftContainer.scrollHeight > leftContainer.clientHeight;
                if (shouldLeftScroll) {
                    leftContainer.classList.remove('scroll-disabled');
                    leftContainer.classList.add('scroll-enabled');
                }
                else {
                    leftContainer.classList.remove('scroll-enabled');
                    leftContainer.classList.add('scroll-disabled');
                }
            }
            if (dialogContent) {
                const shouldRightScroll = dialogContent.scrollHeight > dialogContent.clientHeight;
                if (shouldRightScroll) {
                    dialogContent.classList.remove('scroll-disabled');
                    dialogContent.classList.add('scroll-enabled');
                }
                else {
                    dialogContent.classList.remove('scroll-enabled');
                    dialogContent.classList.add('scroll-disabled');
                }
            }
        };
        //页面更迭函数
        const changeDialog = function (item, dialogContainer) {
            if (!dialogContainer) return;
            dialogContainer.innerHTML = '';
            const list = lib.characterSort.MiNikill[item.link];
            if (list.length > 0) {
                const container = document.createElement('div');
                container.className = 'grid-layout';
                const buttons = ui.create.buttons([...list].sort(lib.sort.character), 'character', container);
                buttons.forEach(button => {
                    button.classList.add('noclick');
                    if (button.node?.hp) {
                        button.node.hp.style.transition = "all 0s";
                        button.node.hp._innerHTML = button.node.hp.innerHTML;
                    }
                    button.listen(function (e) {
                        ui.click.charactercard(this.link, this);
                    });
                });
                dialogContainer.appendChild(container);
                setTimeout(() => {
                    dialogContainer.style.display = 'none';
                    dialogContainer.offsetHeight;
                    dialogContainer.style.display = '';
                    updateScrollBehavior();
                }, 10);
            }
        };
        //创建导航项
        let currentActiveItem = null;
        menuItems.forEach((link, index) => {
            const navItem = document.createElement('button');
            navItem.className = 'nav-item';
            navItem.link = link;
            navItem.innerHTML = lib.translate[link];
            if (navItem.innerHTML.startsWith('欢乐三国杀·')) navItem.innerHTML = navItem.innerHTML.slice(6);
            navItem.onclick = function () {
                currentActiveItem?.classList.remove('active');
                this.classList.add('active');
                currentActiveItem = this;
                changeDialog(this, dialogContent);
            };
            leftNavScrollContainer.appendChild(navItem);
            if (index === 0) currentActiveItem = navItem;//默认选中第一个
        });
        //加载界面，确保背景不能滚动
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            if (currentActiveItem) {
                currentActiveItem.classList.add('active');
                changeDialog(currentActiveItem, dialogContent);
            }
            //确保滚动功能正常工作
            updateScrollBehavior();
            window.addEventListener('resize', updateScrollBehavior);
        }, 0);
        //确保滚动功能的辅助函数
        const closeOverlay = function () {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
                document.body.style.overflow = '';
                window.removeEventListener('resize', updateScrollBehavior);
            }
        };
        backButton.onclick = closeOverlay;
        const escHandler = function (e) {
            if (e.key === 'Escape') {
                closeOverlay();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    };
    const originLoading = ui.create.menu;
    ui.create.menu = function () {
        const result = originLoading.apply(this, arguments);
        const characterPack = Array.from(document.getElementsByTagName('div')).find(div => div.innerHTML === '武将');
        if (characterPack) {
            const originClick = characterPack.onclick;
            characterPack.onclick = () => {
                originClick?.apply(this, arguments);
                const characterPackage = Array.from(document.querySelectorAll('.menubutton.large')).find(div => div.innerHTML === lib.translate['MiNikill_character_config']);
                if (characterPackage) {
                    const originClick2 = characterPackage.onclick;
                    characterPackage.onclick = () => {
                        originClick2?.apply(this, arguments);
                        const rightPane = document.querySelector('.menu-buttons.leftbutton');
                        if (rightPane && !rightPane.init) {
                            rightPane.init = true;
                            const cfgNodes = rightPane.querySelectorAll('.config.toggle');
                            for (let i = 0; i < cfgNodes.length; i++) {
                                if (cfgNodes[i].textContent === '仅点将可用') {
                                    const addIntro = document.createElement('div');
                                    addIntro.onclick = onclickInterface;
                                    addIntro.classList.add('config', 'pointerspan');
                                    addIntro.innerHTML = (() => {
                                        //孩子们，牢大在天上化为彩虹看着你们（bushi）
                                        const text = '点击进入欢杀武将单独页';
                                        if (!document.getElementById('MiNikill-rainbow-style')) {
                                            const style = document.createElement('style');
                                            style.id = 'MiNikill-rainbow-style';
                                            let css = '';
                                            for (let i = 0; i < text.length; i++) {
                                                const animName = `MiNikill-${i}`;
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
                                            return `<span style="display:inline-block; animation:MiNikill-${i} 3s linear ${delay}s infinite; font-family: 'SimSun','宋体',serif; font-weight:bold; transition:color 0.5s;">${ch}</span>`;
                                        }).join('');
                                    })();
                                    cfgNodes[i].parentNode.insertBefore(addIntro, cfgNodes[i].nextSibling);
                                    break;
                                }
                            }
                        }
                    };
                }
            };
        }
        return result;
    };
};
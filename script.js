document.addEventListener('DOMContentLoaded', function() {
    // 检测设备类型
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 应用移动设备优化
    if (isMobile) {
        applyMobileOptimizations();
        
        // 显示移动设备指引（仅首次访问）
        const hasSeenGuide = localStorage.getItem('hasSeenMobileGuide');
        if (!hasSeenGuide) {
            showMobileGuide();
        }
    }
    
    // 显示移动设备使用指南
    function showMobileGuide() {
        const mobileGuide = document.getElementById('mobileGuide');
        mobileGuide.classList.add('active');
        
        // 关闭指南按钮
        document.getElementById('closeGuide').addEventListener('click', function() {
            mobileGuide.classList.remove('active');
            localStorage.setItem('hasSeenMobileGuide', 'true');
        });
    }
    
    // 移动设备优化开关
    const mobileOptimizeToggle = document.getElementById('mobileOptimizeToggle');
    if (mobileOptimizeToggle) {
        mobileOptimizeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.remove('disable-mobile-optimize');
                localStorage.setItem('mobileOptimize', 'enabled');
            } else {
                document.body.classList.add('disable-mobile-optimize');
                localStorage.setItem('mobileOptimize', 'disabled');
            }
        });
        
        // 加载保存的设置
        if (localStorage.getItem('mobileOptimize') === 'disabled') {
            mobileOptimizeToggle.checked = false;
            document.body.classList.add('disable-mobile-optimize');
        }
    }
    
    // 更新时间和日期
    function updateTimeDate() {
        const now = new Date();
        
        // 格式化时间: HH:MM
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('current-time').textContent = `${hours}:${minutes}`;
        
        // 格式化日期: YYYY/MM/DD
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        document.getElementById('current-date').textContent = `${year}/${month}/${day}`;
    }
    
    // 初始更新时间和日期
    updateTimeDate();
    
    // 每分钟更新一次时间和日期
    setInterval(updateTimeDate, 60000);
    
    // 开始按钮点击事件
    const startButton = document.querySelector('.start-button');
    const startMenu = document.getElementById('startMenu');
    
    startButton.addEventListener('click', function() {
        startMenu.classList.toggle('active');
    });
    
    // 点击桌面空白处关闭开始菜单
    document.querySelector('.desktop').addEventListener('click', function(event) {
        if (!startMenu.contains(event.target) && 
            !startButton.contains(event.target)) {
            startMenu.classList.remove('active');
        }
    });
    
    // 桌面图标点击事件 - 打开相应的链接
    document.querySelectorAll('.icon').forEach(function(icon) {
        // 对于移动设备，使用触摸优化
        if (isTouchDevice) {
            let touchStartTime = 0;
            let touchTimer;
            
            // 触摸开始时记录时间
            icon.addEventListener('touchstart', function(e) {
                touchStartTime = Date.now();
                touchTimer = setTimeout(() => {
                    // 长按显示tooltip
                    this.querySelector('.tooltip').style.opacity = '1';
                    this.querySelector('.tooltip').style.visibility = 'visible';
                }, 500);
            });
            
            // 触摸结束时判断是点击还是长按
            icon.addEventListener('touchend', function(e) {
                clearTimeout(touchTimer);
                const touchDuration = Date.now() - touchStartTime;
                this.querySelector('.tooltip').style.opacity = '0';
                this.querySelector('.tooltip').style.visibility = 'hidden';
                
                // 如果是短触摸，打开链接
                if (touchDuration < 500) {
                    const url = this.getAttribute('data-url');
                    if (url) {
                        window.open(url, '_blank');
                    }
                }
            });
            
            // 防止触摸移动时打开链接
            icon.addEventListener('touchmove', function(e) {
                clearTimeout(touchTimer);
                this.querySelector('.tooltip').style.opacity = '0';
                this.querySelector('.tooltip').style.visibility = 'hidden';
            });
        } else {
            // 非触摸设备使用点击事件
            icon.addEventListener('click', function() {
                const url = this.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            });
        }
        
        // 为图标添加双击/双触动画
        if (isTouchDevice) {
            let lastTap = 0;
            icon.addEventListener('touchend', function(e) {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                if (tapLength < 300 && tapLength > 0) {
                    // 双触效果
                    this.classList.add('active');
                    setTimeout(() => {
                        this.classList.remove('active');
                    }, 200);
                    e.preventDefault();
                }
                lastTap = currentTime;
            });
        } else {
            icon.addEventListener('dblclick', function() {
                this.classList.add('active');
                setTimeout(() => {
                    this.classList.remove('active');
                }, 200);
            });
        }
    });
    
    // 系统托盘项目点击事件
    document.querySelector('.time-date').addEventListener('click', function() {
        // 注释掉弹窗功能
        // alert('时间和日期设置');
    });
    
    // 添加搜索框功能
    const searchBox = document.querySelector('.search-box input');
    if (searchBox) {
        searchBox.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    window.open(`https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
                    this.value = '';
                }
            }
        });
    }
    
    // 添加设置面板功能
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettingsBtn = document.getElementById('closeSettings');
    const backBtn = document.getElementById('backBtn');
    const changeBackgroundBtn = document.getElementById('changeBackgroundBtn');
    const transparencyToggle = document.getElementById('transparencyToggle');
    const animationToggle = document.getElementById('animationToggle');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // 打开设置面板
    settingsBtn.addEventListener('click', function() {
        settingsPanel.classList.add('active');
        startMenu.classList.remove('active');
    });
    
    // 关闭设置面板
    closeSettingsBtn.addEventListener('click', function() {
        settingsPanel.classList.remove('active');
    });
    
    // 返回按钮
    backBtn.addEventListener('click', function() {
        settingsPanel.classList.remove('active');
        startMenu.classList.add('active');
    });
    
    // 更换背景按钮
    changeBackgroundBtn.addEventListener('click', function() {
        changeBackground();
    });
    
    // 更换背景功能
    function changeBackground() {
        const randomId = Math.floor(Math.random() * 1000);
        document.querySelector('.desktop').style.backgroundImage = `url('https://picsum.photos/id/${randomId}/1920/1080')`;
    }
    
    // 透明效果开关
    transparencyToggle.addEventListener('change', function() {
        if (this.checked) {
            document.querySelector('.taskbar').style.backgroundColor = 'rgba(25, 25, 35, 0.85)';
            document.querySelector('.taskbar').style.backdropFilter = 'blur(10px)';
            document.querySelector('.start-menu').style.backgroundColor = 'rgba(25, 25, 35, 0.95)';
            document.querySelector('.start-menu').style.backdropFilter = 'blur(20px)';
            document.querySelector('.settings-panel').style.backgroundColor = 'rgba(25, 25, 35, 0.95)';
            document.querySelector('.settings-panel').style.backdropFilter = 'blur(20px)';
        } else {
            document.querySelector('.taskbar').style.backgroundColor = 'rgb(25, 25, 35)';
            document.querySelector('.taskbar').style.backdropFilter = 'none';
            document.querySelector('.start-menu').style.backgroundColor = 'rgb(25, 25, 35)';
            document.querySelector('.start-menu').style.backdropFilter = 'none';
            document.querySelector('.settings-panel').style.backgroundColor = 'rgb(25, 25, 35)';
            document.querySelector('.settings-panel').style.backdropFilter = 'none';
        }
    });
    
    // 动画效果开关
    animationToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.style.setProperty('--transition-speed', '0.3s');
        } else {
            document.documentElement.style.setProperty('--transition-speed', '0s');
        }
    });
    
    // 主题颜色选择
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            
            // 移除其他颜色选项的active类
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // 为当前选择的颜色添加active类
            this.classList.add('active');
            
            // 应用颜色到相关元素
            document.documentElement.style.setProperty('--theme-color', color);
            document.querySelectorAll('#changeBackgroundBtn, input:checked + .slider').forEach(el => {
                el.style.backgroundColor = color;
            });
            document.querySelectorAll('.settings-section h3').forEach(el => {
                el.style.color = color;
            });
        });
    });
    
    // 添加应用项点击事件
    document.querySelectorAll('.app-item').forEach(function(appItem) {
        appItem.addEventListener('click', function() {
            const appName = this.querySelector('span').textContent;
            
            if (appName === '关机') {
                if (confirm('确定要关闭页面吗？')) {
                    window.close();
                    // 如果window.close()不生效（由于浏览器限制），则重定向到空白页
                    setTimeout(() => {
                        document.body.innerHTML = '<div style="text-align:center; margin-top:40vh; font-size:24px;">已关机</div>';
                        document.body.style.background = '#000';
                        document.body.style.color = '#fff';
                    }, 100);
                }
            } else if (appName === '重启') {
                if (confirm('确定要重新加载页面吗？')) {
                    window.location.reload();
                }
            }
        });
    });
    
    // 添加右键菜单或移动端的长按菜单
    const desktop = document.querySelector('.desktop');
    
    if (isTouchDevice) {
        // 移动设备使用长按事件
        let touchTimeout;
        let touchStartX, touchStartY;
        
        desktop.addEventListener('touchstart', function(event) {
            if (event.touches.length === 1) {
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
                touchTimeout = setTimeout(() => {
                    showContextMenu(touchStartX, touchStartY);
                }, 800); // 长按超过800ms显示菜单
            }
        });
        
        desktop.addEventListener('touchmove', function(event) {
            // 如果手指移动超过10px，取消长按
            if (touchTimeout && event.touches.length === 1) {
                const moveX = Math.abs(event.touches[0].clientX - touchStartX);
                const moveY = Math.abs(event.touches[0].clientY - touchStartY);
                if (moveX > 10 || moveY > 10) {
                    clearTimeout(touchTimeout);
                    touchTimeout = null;
                }
            }
        });
        
        desktop.addEventListener('touchend', function() {
            if (touchTimeout) {
                clearTimeout(touchTimeout);
                touchTimeout = null;
            }
        });
    } else {
        // 非移动设备使用右键菜单
        desktop.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            showContextMenu(event.clientX, event.clientY);
        });
    }
    
    // 显示上下文菜单
    function showContextMenu(x, y) {
        // 移除之前的右键菜单（如果有）
        const oldMenu = document.querySelector('.context-menu');
        if (oldMenu) {
            oldMenu.remove();
        }
        
        // 创建新的右键菜单
        const contextMenu = document.createElement('div');
        contextMenu.classList.add('context-menu');
        contextMenu.style.position = 'absolute';
        
        // 移动设备上居中显示
        if (isMobile) {
            contextMenu.style.left = '10%';
            contextMenu.style.right = '10%';
            contextMenu.style.width = '80%';
            contextMenu.style.bottom = '60px';
        } else {
            contextMenu.style.left = `${x}px`;
            contextMenu.style.top = `${y}px`;
        }
        
        contextMenu.style.backgroundColor = 'rgba(25, 25, 35, 0.95)';
        contextMenu.style.backdropFilter = 'blur(20px)';
        contextMenu.style.borderRadius = '4px';
        contextMenu.style.padding = '5px 0';
        contextMenu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        contextMenu.style.zIndex = '1001';
        
        // 右键菜单选项
        const menuItems = [
            { text: '查看', icon: 'fa-eye' },
            { text: '排序方式', icon: 'fa-sort' },
            { text: '刷新', icon: 'fa-refresh' },
            { text: '个性化', icon: 'fa-paint-brush' }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.style.padding = isMobile ? '12px 20px' : '8px 20px';
            menuItem.style.cursor = 'pointer';
            menuItem.style.color = '#fff';
            menuItem.style.fontSize = isMobile ? '16px' : '14px';
            menuItem.style.display = 'flex';
            menuItem.style.alignItems = 'center';
            menuItem.style.transition = 'background-color 0.2s';
            
            const icon = document.createElement('i');
            icon.className = `fa ${item.icon}`;
            icon.style.marginRight = '10px';
            icon.style.width = '16px';
            icon.style.textAlign = 'center';
            
            menuItem.appendChild(icon);
            menuItem.appendChild(document.createTextNode(item.text));
            
            // 对于触摸设备，不使用悬停效果
            if (!isTouchDevice) {
                menuItem.addEventListener('mouseover', function() {
                    this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                });
                
                menuItem.addEventListener('mouseout', function() {
                    this.style.backgroundColor = 'transparent';
                });
            }
            
            menuItem.addEventListener('click', function() {
                if (item.text === '刷新') {
                    window.location.reload();
                } else if (item.text === '个性化') {
                    changeBackground();
                } else if (item.text === '查看') {
                    settingsPanel.classList.add('active');
                } else if (item.text === '排序方式') {
                    // 添加排序功能
                    const icons = Array.from(document.querySelectorAll('.desktop-icons .icon'));
                    icons.sort((a, b) => {
                        const textA = a.querySelector('span').textContent.toLowerCase();
                        const textB = b.querySelector('span').textContent.toLowerCase();
                        return textA.localeCompare(textB);
                    });
                    
                    const desktopIcons = document.querySelector('.desktop-icons');
                    icons.forEach(icon => {
                        desktopIcons.appendChild(icon);
                        // 重置位置
                        icon.style.position = '';
                        icon.style.left = '';
                        icon.style.top = '';
                    });
                }
                contextMenu.remove();
            });
            
            contextMenu.appendChild(menuItem);
        });
        
        document.body.appendChild(contextMenu);
        
        // 点击其他区域关闭右键菜单
        const closeMenu = function() {
            contextMenu.remove();
            document.removeEventListener('click', closeMenu);
            document.removeEventListener('touchstart', closeMenu);
        };
        
        if (isTouchDevice) {
            document.addEventListener('touchstart', closeMenu);
        } else {
            document.addEventListener('click', closeMenu);
        }
    }
    
    // 移动设备优化函数
    function applyMobileOptimizations() {
        // 添加双指缩放支持
        let lastDistance = 0;
        let currentScale = 1;
        
        document.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                lastDistance = getDistance(e.touches[0], e.touches[1]);
            }
        });
        
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const delta = currentDistance / lastDistance;
                
                // 限制缩放范围
                if (delta > 1 && currentScale < 1.5) {
                    currentScale += 0.01;
                } else if (delta < 1 && currentScale > 0.8) {
                    currentScale -= 0.01;
                }
                
                document.querySelector('.desktop-icons').style.transform = `scale(${currentScale})`;
                
                lastDistance = currentDistance;
                e.preventDefault(); // 防止页面缩放
            }
        });
        
        // 计算两个触摸点之间的距离
        function getDistance(touch1, touch2) {
            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        }
        
        // 针对iOS设备的特殊优化
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            // 防止双击缩放
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(e) {
                const now = Date.now();
                if (now - lastTouchEnd < 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, { passive: false });
            
            // 防止用户缩放
            document.addEventListener('gesturestart', function(e) {
                e.preventDefault();
            }, { passive: false });
        }
        
        // 优化窗口高度（解决iOS地址栏问题）
        function adjustHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            document.querySelector('.desktop').style.height = `calc(var(--vh, 1vh) * 100)`;
        }
        
        window.addEventListener('resize', adjustHeight);
        adjustHeight();
    }
    
    // 添加拖拽功能，优化触摸设备
    let draggedIcon = null;
    
    document.querySelectorAll('.icon').forEach(icon => {
        icon.setAttribute('draggable', !isTouchDevice); // 只在非触摸设备上启用原生拖放
        
        if (isTouchDevice) {
            // 触摸设备使用触摸事件
            let startX, startY, initialLeft, initialTop;
            let isDragging = false;
            
            icon.addEventListener('touchstart', function(e) {
                if (e.touches.length === 1) {
                    const touch = e.touches[0];
                    draggedIcon = this;
                    this.style.opacity = '0.8';
                    
                    // 记录起始位置
                    startX = touch.clientX;
                    startY = touch.clientY;
                    
                    // 获取初始位置
                    const rect = this.getBoundingClientRect();
                    initialLeft = rect.left;
                    initialTop = rect.top;
                    
                    // 让元素可以绝对定位
                    this.style.position = 'absolute';
                    this.style.left = initialLeft + 'px';
                    this.style.top = initialTop + 'px';
                }
            });
            
            icon.addEventListener('touchmove', function(e) {
                if (draggedIcon && e.touches.length === 1) {
                    e.preventDefault(); // 防止滚动
                    isDragging = true;
                    
                    const touch = e.touches[0];
                    const deltaX = touch.clientX - startX;
                    const deltaY = touch.clientY - startY;
                    
                    // 移动图标
                    let newLeft = Math.max(0, Math.min(initialLeft + deltaX, window.innerWidth - this.offsetWidth));
                    let newTop = Math.max(0, Math.min(initialTop + deltaY, window.innerHeight - 50 - this.offsetHeight));
                    
                    this.style.left = newLeft + 'px';
                    this.style.top = newTop + 'px';
                }
            });
            
            icon.addEventListener('touchend', function(e) {
                if (draggedIcon) {
                    this.style.opacity = '1';
                    
                    if (!isDragging) {
                        // 如果没有拖动，则触发点击事件
                        const url = this.getAttribute('data-url');
                        if (url) {
                            window.open(url, '_blank');
                        }
                    }
                    
                    isDragging = false;
                    draggedIcon = null;
                }
            });
        } else {
            // 非触摸设备使用传统拖放
            icon.addEventListener('dragstart', function(e) {
                draggedIcon = this;
                setTimeout(() => {
                    this.style.opacity = '0.5';
                }, 0);
            });
            
            icon.addEventListener('dragend', function() {
                this.style.opacity = '1';
            });
        }
    });
    
    if (!isTouchDevice) {
        // 只为非触摸设备设置传统拖放
        document.querySelector('.desktop').addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        document.querySelector('.desktop').addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedIcon) {
                const offsetX = draggedIcon.offsetWidth / 2;
                const offsetY = draggedIcon.offsetHeight / 2;
                
                // 确保图标不会脱离可视区域
                let left = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - draggedIcon.offsetWidth));
                let top = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - 40 - draggedIcon.offsetHeight));
                
                draggedIcon.style.position = 'absolute';
                draggedIcon.style.left = left + 'px';
                draggedIcon.style.top = top + 'px';
            }
        });
    }

    // 添加CSS变量来控制主题和动画
    document.documentElement.style.setProperty('--theme-color', '#0078d7');
    document.documentElement.style.setProperty('--transition-speed', '0.3s');
    
    // 默认选中第一个颜色选项
    colorOptions[0].classList.add('active');
    
    // 监听屏幕方向变化，调整布局
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            // 调整图标布局
            document.querySelectorAll('.icon').forEach(icon => {
                if (icon.style.position === 'absolute') {
                    // 重置被拖动的图标位置，以防止在旋转后位置不正确
                    icon.style.position = '';
                    icon.style.left = '';
                    icon.style.top = '';
                }
            });
            
            // 如果在iPad上，更新视口高度
            if (/iPad/.test(navigator.userAgent)) {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }
        }, 300);
    });
}); 
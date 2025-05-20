document.addEventListener('DOMContentLoaded', function() {
    // 检测设备类型
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 初始化主题颜色
    initializeThemeColor();
    
    // 应用移动设备优化
    if (isMobile) {
        applyMobileOptimizations();
        
        // 不显示移动设备指引
        /* 已禁用首次访问指南
        const hasSeenGuide = localStorage.getItem('hasSeenMobileGuide');
        if (!hasSeenGuide) {
            showMobileGuide();
        }
        */
        
        // 直接设置为已查看过指南
        localStorage.setItem('hasSeenMobileGuide', 'true');
    }
    
    // 初始化主题颜色和任务栏透明度
    function initializeThemeColor() {
        // 设置默认主题颜色
        const defaultColor = "#19191f";
        const colorRgb = hexToRgb(defaultColor);
        
        // 获取保存的颜色或使用默认颜色
        const savedColor = localStorage.getItem('themeColor') || defaultColor;
        
        // 激活对应的颜色选项
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            if(option.getAttribute('data-color') === savedColor) {
                option.classList.add('active');
            }
        });
        
        // 应用颜色
        document.documentElement.style.setProperty('--theme-color', savedColor);
        document.querySelectorAll('#changeBackgroundBtn, input:checked + .slider').forEach(el => {
            el.style.backgroundColor = savedColor;
        });
        document.querySelectorAll('.settings-section h3').forEach(el => {
            el.style.color = savedColor;
        });
        
        // 应用任务栏颜色和透明度
        if(document.getElementById('transparencyToggle') && document.getElementById('transparencyToggle').checked) {
            const colorRgb = hexToRgb(savedColor);
            if(colorRgb) {
                document.querySelector('.taskbar').style.backgroundColor = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0.7)`;
                document.querySelector('.taskbar').style.backdropFilter = 'blur(10px)';
            }
        } else {
            document.querySelector('.taskbar').style.backgroundColor = savedColor;
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
    
    // 点击桌面空白处关闭开始菜单和日历面板
    document.querySelector('.desktop').addEventListener('click', function(event) {
        if (!startMenu.contains(event.target) && 
            !startButton.contains(event.target)) {
            startMenu.classList.remove('active');
        }
        
        if (!calendarPanel.contains(event.target) && 
            !document.querySelector('.time-date').contains(event.target)) {
            calendarPanel.classList.remove('active');
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
    const calendarPanel = document.getElementById('calendarPanel');
    document.querySelector('.time-date').addEventListener('click', function() {
        calendarPanel.classList.toggle('active');
        startMenu.classList.remove('active');
        settingsPanel.classList.remove('active');
        
        // 初始化或更新日历
        updateCalendar();
        // 更新世界时钟
        updateWorldClock();
    });
    
    // 关闭日历按钮
    document.getElementById('closeCalendar').addEventListener('click', function() {
        calendarPanel.classList.remove('active');
    });
    
    // 日历控制按钮
    let currentDate = new Date();
    
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
    
    // 更新日历
    function updateCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        const monthYearElem = document.getElementById('calendar-month-year');
        
        // 清空日历
        calendarDays.innerHTML = '';
        
        // 更新月份和年份显示
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        monthYearElem.textContent = `${currentDate.getFullYear()}年${monthNames[currentDate.getMonth()]}`;
        
        // 生成日历数据
        const today = new Date();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // 获取月初是星期几
        let firstDayOfWeek = firstDay.getDay();
        
        // 上个月的日期
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const dayElem = document.createElement('div');
            dayElem.classList.add('calendar-day', 'other-month');
            dayElem.textContent = prevMonthLastDay - i;
            calendarDays.appendChild(dayElem);
        }
        
        // 当前月的日期
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayElem = document.createElement('div');
            dayElem.classList.add('calendar-day');
            dayElem.textContent = i;
            
            // 判断是否是今天
            if (currentDate.getFullYear() === today.getFullYear() && 
                currentDate.getMonth() === today.getMonth() && 
                i === today.getDate()) {
                dayElem.classList.add('today');
            }
            
            calendarDays.appendChild(dayElem);
        }
        
        // 下个月的日期
        const remainingCells = 42 - (firstDayOfWeek + lastDay.getDate());
        for (let i = 1; i <= remainingCells; i++) {
            const dayElem = document.createElement('div');
            dayElem.classList.add('calendar-day', 'other-month');
            dayElem.textContent = i;
            calendarDays.appendChild(dayElem);
        }
    }
    
    // 更新世界时钟
    function updateWorldClock() {
        const timeElements = document.querySelectorAll('.world-clock .time');
        
        timeElements.forEach(elem => {
            const timezone = elem.getAttribute('data-timezone');
            try {
                const time = new Date().toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: timezone,
                    hour12: false
                });
                elem.textContent = time;
            } catch (e) {
                elem.textContent = '--:--';
            }
        });
    }
    
    // 每分钟更新世界时钟
    setInterval(() => {
        if (calendarPanel.classList.contains('active')) {
            updateWorldClock();
        }
    }, 60000);
    
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
            // 增加透明度
            document.querySelector('.taskbar').style.backgroundColor = 'rgba(25, 25, 35, 0.7)';
            document.querySelector('.taskbar').style.backdropFilter = 'blur(10px)';
            document.querySelector('.start-menu').style.backgroundColor = 'rgba(25, 25, 35, 0.85)';
            document.querySelector('.start-menu').style.backdropFilter = 'blur(20px)';
            document.querySelector('.settings-panel').style.backgroundColor = 'rgba(25, 25, 35, 0.85)';
            document.querySelector('.settings-panel').style.backdropFilter = 'blur(20px)';
            
            // 如果有活动的主题颜色，应用颜色
            const activeColor = document.querySelector('.color-option.active');
            if (activeColor) {
                const color = activeColor.getAttribute('data-color');
                const colorRgb = hexToRgb(color);
                if (colorRgb) {
                    document.querySelector('.taskbar').style.backgroundColor = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0.7)`;
                }
            }
        } else {
            document.querySelector('.taskbar').style.backgroundColor = 'rgb(25, 25, 35)';
            document.querySelector('.taskbar').style.backdropFilter = 'none';
            document.querySelector('.start-menu').style.backgroundColor = 'rgb(25, 25, 35)';
            document.querySelector('.start-menu').style.backdropFilter = 'none';
            document.querySelector('.settings-panel').style.backgroundColor = 'rgb(25, 25, 35)';
            document.querySelector('.settings-panel').style.backdropFilter = 'none';
            
            // 如果有活动的主题颜色，应用不透明颜色
            const activeColor = document.querySelector('.color-option.active');
            if (activeColor) {
                const color = activeColor.getAttribute('data-color');
                document.querySelector('.taskbar').style.backgroundColor = color;
            }
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
            
            // 保存颜色到localStorage
            localStorage.setItem('themeColor', color);
            
            // 应用颜色到相关元素
            document.documentElement.style.setProperty('--theme-color', color);
            document.querySelectorAll('#changeBackgroundBtn, input:checked + .slider').forEach(el => {
                el.style.backgroundColor = color;
            });
            document.querySelectorAll('.settings-section h3').forEach(el => {
                el.style.color = color;
            });

            // 同步更改任务栏颜色
            const colorRgb = hexToRgb(color);
            if (colorRgb) {
                if (transparencyToggle.checked) {
                    document.querySelector('.taskbar').style.backgroundColor = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0.7)`;
                } else {
                    document.querySelector('.taskbar').style.backgroundColor = color;
                }
            }
        });
    });
    
    // 转换十六进制颜色为RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
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
            let touchStartTime = 0;
            let hasMoved = false;
            const DRAG_THRESHOLD = 10; // 拖动阈值，防止误触
            
            icon.addEventListener('touchstart', function(e) {
                if (e.touches.length === 1) {
                    touchStartTime = Date.now();
                    hasMoved = false;
                    const touch = e.touches[0];
                    
                    // 记录起始位置
                    startX = touch.clientX;
                    startY = touch.clientY;
                    
                    // 获取初始位置
                    const rect = this.getBoundingClientRect();
                    initialLeft = rect.left;
                    initialTop = rect.top;
                }
            });
            
            icon.addEventListener('touchmove', function(e) {
                if (e.touches.length === 1) {
                    const touch = e.touches[0];
                    const deltaX = touch.clientX - startX;
                    const deltaY = touch.clientY - startY;
                    
                    // 只有超过阈值才认为是拖动
                    if (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD) {
                        hasMoved = true;
                        
                        // 只有长按才能拖动（超过300ms）
                        if (Date.now() - touchStartTime > 300) {
                            e.preventDefault(); // 防止滚动
                            isDragging = true;
                            
                            if (!draggedIcon) {
                                draggedIcon = this;
                                this.style.opacity = '0.8';
                                // 让元素可以绝对定位
                                this.style.position = 'absolute';
                                this.style.left = initialLeft + 'px';
                                this.style.top = initialTop + 'px';
                                this.style.zIndex = '1000';
                            }
                            
                            // 移动图标
                            let newLeft = Math.max(0, Math.min(initialLeft + deltaX, window.innerWidth - this.offsetWidth));
                            let newTop = Math.max(0, Math.min(initialTop + deltaY, window.innerHeight - 50 - this.offsetHeight));
                            
                            this.style.left = newLeft + 'px';
                            this.style.top = newTop + 'px';
                        }
                    }
                }
            });
            
            icon.addEventListener('touchend', function(e) {
                const touchDuration = Date.now() - touchStartTime;
                
                if (draggedIcon) {
                    this.style.opacity = '1';
                    this.style.zIndex = '';
                    draggedIcon = null;
                }
                
                // 如果是短触摸且没有移动，则视为点击
                if (touchDuration < 300 && !hasMoved) {
                    const url = this.getAttribute('data-url');
                    if (url) {
                        window.open(url, '_blank');
                    }
                }
                
                isDragging = false;
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
    document.documentElement.style.setProperty('--theme-color', '#19191f');
    document.documentElement.style.setProperty('--transition-speed', '0.3s');
    
    // 默认选中第一个颜色选项（黑色）
    if(colorOptions.length > 0) {
        colorOptions[0].classList.add('active');
    }
    
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

    // 命令提示符功能
    const cmdWindow = document.getElementById('cmdWindow');
    const cmdBtn = document.getElementById('cmdBtn');
    const closeCmd = document.getElementById('closeCmd');
    const minimizeCmd = document.getElementById('minimizeCmd');
    const maximizeCmd = document.getElementById('maximizeCmd');
    const cmdOutput = document.getElementById('cmdOutput');
    const cmdInput = document.getElementById('cmdInput');
    const cmdPrompt = document.getElementById('cmdPrompt');
    
    // 当前目录路径
    let currentDir = 'C:\\Users\\user';
    
    // 命令历史记录
    let commandHistory = [];
    let historyIndex = -1;
    
    // 打开命令提示符
    cmdBtn.addEventListener('click', function() {
        cmdWindow.classList.add('active');
        startMenu.classList.remove('active');
        cmdInput.focus();
    });
    
    // 关闭命令提示符
    closeCmd.addEventListener('click', function() {
        cmdWindow.classList.remove('active');
    });
    
    // 最小化命令提示符（模拟）
    minimizeCmd.addEventListener('click', function() {
        cmdWindow.classList.remove('active');
    });
    
    // 最大化/还原命令提示符
    maximizeCmd.addEventListener('click', function() {
        cmdWindow.classList.toggle('maximized');
        if (cmdWindow.classList.contains('maximized')) {
            maximizeCmd.classList.remove('fa-expand');
            maximizeCmd.classList.add('fa-compress');
        } else {
            maximizeCmd.classList.remove('fa-compress');
            maximizeCmd.classList.add('fa-expand');
        }
    });
    
    // 命令处理
    cmdInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const command = this.value.trim();
            
            if (command) {
                // 添加到历史记录
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                
                // 显示命令
                appendOutput(`${cmdPrompt.textContent} ${command}`);
                
                // 处理命令
                processCommand(command);
                
                // 清空输入
                this.value = '';
            } else {
                // 空命令就显示新的提示符
                appendOutput(cmdPrompt.textContent);
            }
            
            // 滚动到底部
            cmdContent.scrollTop = cmdContent.scrollHeight;
        }
        else if (e.key === 'ArrowUp') {
            // 历史命令导航 - 上一个
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                this.value = commandHistory[historyIndex];
                
                // 将光标移到末尾
                setTimeout(() => {
                    this.selectionStart = this.selectionEnd = this.value.length;
                }, 0);
            }
        }
        else if (e.key === 'ArrowDown') {
            // 历史命令导航 - 下一个
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                this.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                this.value = '';
            }
        }
        else if (e.key === 'Tab') {
            // 阻止Tab默认行为（焦点移动）
            e.preventDefault();
            // 这里可以实现自动补全功能，但简化起见，暂不实现
        }
    });
    
    // 输出文本到终端
    function appendOutput(text) {
        const div = document.createElement('div');
        div.textContent = text;
        cmdOutput.appendChild(div);
    }
    
    // 处理命令
    function processCommand(command) {
        const cmd = command.toLowerCase().trim();
        const args = command.split(' ').filter(arg => arg.trim() !== '');
        const mainCommand = args[0].toLowerCase();
        
        switch (mainCommand) {
            case 'help':
                showHelp();
                break;
            case 'cls':
            case 'clear':
                clearScreen();
                break;
            case 'dir':
            case 'ls':
                listDirectory();
                break;
            case 'cd':
                changeDirectory(args[1]);
                break;
            case 'echo':
                echoText(args.slice(1).join(' '));
                break;
            case 'date':
                showDate();
                break;
            case 'time':
                showTime();
                break;
            case 'ver':
            case 'version':
                showVersion();
                break;
            case 'color':
                changeColor(args[1]);
                break;
            case 'systeminfo':
                showSystemInfo();
                break;
            case 'exit':
                closeTerminal();
                break;
            default:
                appendOutput(`'${mainCommand}' 不是内部或外部命令，也不是可运行的程序或批处理文件。输入help获取可用命令`);
                break;
        }
        
        // 更新提示符
        updatePrompt();
    }
    
    // 更新提示符
    function updatePrompt() {
        const newPrompt = `${currentDir}>`;
        cmdPrompt.textContent = newPrompt;
    }
    
    // 显示帮助
    function showHelp() {
        appendOutput('可用命令：');
        appendOutput('  help      - 显示帮助信息');
        appendOutput('  cls       - 清除屏幕');
        appendOutput('  dir       - 显示当前目录中的文件和子目录');
        appendOutput('  cd        - 显示当前目录名或更改当前目录');
        appendOutput('  echo      - 显示消息或启用/禁用命令回显');
        appendOutput('  date      - 显示日期');
        appendOutput('  time      - 显示时间');
        appendOutput('  ver       - 显示版本信息');
        appendOutput('  color     - 更改终端颜色');
        appendOutput('  systeminfo - 显示系统信息');
        appendOutput('  exit      - 退出命令提示符');
    }
    
    // 清屏
    function clearScreen() {
        cmdOutput.innerHTML = '';
    }
    
    // 列出目录内容（模拟）
    function listDirectory() {
        appendOutput(' 驱动器 C 中的卷没有标签。');
        appendOutput(' 卷的序列号是 1234-5678');
        appendOutput('');
        appendOutput(` ${currentDir} 的目录`);
        appendOutput('');
        
        if (currentDir === 'C:\\Users\\user') {
            appendOutput('2023/09/01  09:30    <DIR>          Desktop');
            appendOutput('2023/09/01  09:30    <DIR>          Documents');
            appendOutput('2023/09/01  09:30    <DIR>          Downloads');
            appendOutput('2023/09/01  09:30    <DIR>          Pictures');
            appendOutput('2023/09/01  09:30    <DIR>          Music');
            appendOutput('2023/09/01  09:30    <DIR>          Videos');
        } else if (currentDir === 'C:\\Users\\user\\Desktop') {
            appendOutput('2023/09/01  10:15            1,024 文档.txt');
            appendOutput('2023/09/01  10:20    <DIR>          项目');
            appendOutput('2023/09/01  10:25           10,240 报告.docx');
        } else if (currentDir === 'C:\\Users\\user\\Documents') {
            appendOutput('2023/09/02  14:30           15,360 工作计划.xlsx');
            appendOutput('2023/09/02  15:40    <DIR>          个人');
            appendOutput('2023/09/02  16:50            5,120 笔记.pdf');
        } else {
            appendOutput('文件夹为空');
        }
        
        appendOutput('               5 个文件      31,744 字节');
        appendOutput('               5 个目录 135,066,624 可用字节');
    }
    
    // 改变目录
    function changeDirectory(dir) {
        if (!dir || dir === '.') {
            appendOutput(currentDir);
            return;
        }
        
        if (dir === '..') {
            // 上级目录
            const parts = currentDir.split('\\');
            if (parts.length > 2) { // 不允许超出C盘
                parts.pop();
                currentDir = parts.join('\\');
            }
            return;
        }
        
        // 模拟目录导航
        const validDirs = {
            'C:\\Users\\user': ['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music', 'Videos'],
            'C:\\Users\\user\\Desktop': ['项目'],
            'C:\\Users\\user\\Documents': ['个人']
        };
        
        // 检查是否是绝对路径
        if (dir.includes(':\\')) {
            if (dir.startsWith('C:\\')) {
                currentDir = dir;
            } else {
                appendOutput('系统找不到指定的驱动器。');
            }
            return;
        }
        
        // 相对路径
        if (validDirs[currentDir] && validDirs[currentDir].includes(dir)) {
            currentDir = `${currentDir}\\${dir}`;
        } else {
            appendOutput('系统找不到指定的路径。');
        }
    }
    
    // 回显文本
    function echoText(text) {
        if (text) {
            appendOutput(text);
        } else {
            appendOutput('回显处于开启状态。');
        }
    }
    
    // 显示日期
    function showDate() {
        const now = new Date();
        const date = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long'
        });
        appendOutput(`当前日期: ${date}`);
    }
    
    // 显示时间
    function showTime() {
        const now = new Date();
        const time = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        appendOutput(`当前时间: ${time}`);
    }
    
    // 显示版本
    function showVersion() {
        appendOutput('Microsoft Windows [版本 10.0.19045]');
        appendOutput('(c) Microsoft Corporation。保留所有权利。');
    }
    
    // 改变终端颜色
    function changeColor(colorCode) {
        if (!colorCode) {
            appendOutput('当前终端颜色设置为默认值');
            return;
        }
        
        const validCodes = {
            '0': { bg: '#0c0c0c', fg: '#cccccc' },  // 黑底灰字
            '1': { bg: '#0c0c0c', fg: '#0037DA' },  // 黑底蓝字
            '2': { bg: '#0c0c0c', fg: '#13A10E' },  // 黑底绿字
            '3': { bg: '#0c0c0c', fg: '#3A96DD' },  // 黑底青字
            '4': { bg: '#0c0c0c', fg: '#C50F1F' },  // 黑底红字
            '5': { bg: '#0c0c0c', fg: '#881798' },  // 黑底紫字
            '6': { bg: '#0c0c0c', fg: '#C19C00' },  // 黑底黄字
            '7': { bg: '#0c0c0c', fg: '#CCCCCC' },  // 黑底白字
            'a': { bg: '#000000', fg: '#16C60C' }   // 黑底亮绿字
        };
        
        if (validCodes[colorCode]) {
            const { bg, fg } = validCodes[colorCode];
            cmdWindow.style.backgroundColor = bg;
            cmdWindow.style.color = fg;
            cmdInput.style.color = fg;
        } else {
            appendOutput('错误的颜色代码。可用的颜色代码为 0-7 和 a。');
        }
    }
    
    // 显示系统信息
    function showSystemInfo() {
        appendOutput('主机名:           DESKTOP-USER');
        appendOutput('OS 名称:          Microsoft Windows 10 专业版');
        appendOutput('OS 版本:          10.0.19045 Build 19045');
        appendOutput('OS 制造商:        Microsoft Corporation');
        appendOutput('系统类型:         x64-based PC');
        appendOutput('处理器:           Intel(R) Core(TM) i7-10700K CPU @ 3.80GHz');
        appendOutput('BIOS 版本:        American Megatrends Inc. 2.04, 2021/8/10');
        appendOutput('内存总量:         16.0 GB');
        appendOutput('可用物理内存:     8.2 GB');
        appendOutput('虚拟内存: 最大值: 32.0 GB');
        appendOutput('虚拟内存: 可用:   22.5 GB');
    }
    
    // 关闭终端
    function closeTerminal() {
        cmdWindow.classList.remove('active');
    }
    
    // 让终端可拖动
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    
    document.querySelector('.window-header').addEventListener('mousedown', function(e) {
        if (cmdWindow.classList.contains('maximized')) return;
        
        isDragging = true;
        dragOffsetX = e.clientX - cmdWindow.getBoundingClientRect().left;
        dragOffsetY = e.clientY - cmdWindow.getBoundingClientRect().top;
        
        document.addEventListener('mousemove', moveWindow);
        document.addEventListener('mouseup', stopDragging);
    });
    
    function moveWindow(e) {
        if (!isDragging) return;
        
        const x = e.clientX - dragOffsetX;
        const y = e.clientY - dragOffsetY;
        
        // 限制窗口在可视区域内
        const maxX = window.innerWidth - cmdWindow.offsetWidth;
        const maxY = window.innerHeight - cmdWindow.offsetHeight;
        
        cmdWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
        cmdWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
        cmdWindow.style.transform = 'none';
    }
    
    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', moveWindow);
        document.removeEventListener('mouseup', stopDragging);
    }
    
    // 设置命令提示符窗口的大小调整功能
    const cmdContent = document.getElementById('cmdContent');
    
    // 确保输入框始终聚焦
    cmdContent.addEventListener('click', function() {
        cmdInput.focus();
    });
    
    // 添加日历和世界时钟功能
}); 
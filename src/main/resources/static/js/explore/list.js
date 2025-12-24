// 红色寻访活动页面主逻辑
document.addEventListener('DOMContentLoaded', function() {
    console.log('红色寻访页面加载完成');

    // 模拟的活动数据 - 使用网络图片确保正常显示
    const mockActivities = [
        {
            id: 1,
            title: '井冈山革命根据地红色寻访之旅',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            city: '吉安市',
            date: '2024-05-01',
            startTime: '09:00',
            endTime: '17:00',
            location: '井冈山革命博物馆',
            maxParticipants: 50,
            currentParticipants: 32,
            status: 'upcoming',
            organization: '江西省红色文化研究会',
            description: '参观井冈山革命旧址，了解革命历史，体验红军生活'
        },
        {
            id: 2,
            title: '瑞金红色首都文化体验活动',
            image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            city: '赣州市',
            date: '2024-05-15',
            startTime: '08:30',
            endTime: '16:30',
            location: '瑞金中央革命根据地历史博物馆',
            maxParticipants: 40,
            currentParticipants: 40,
            status: 'upcoming',
            organization: '赣州红色文化传播中心',
            description: '探访中华苏维埃共和国临时中央政府旧址'
        },
        {
            id: 3,
            title: '南昌八一起义纪念馆参观学习',
            image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            city: '南昌市',
            date: '2024-04-20',
            startTime: '10:00',
            endTime: '15:00',
            location: '南昌八一起义纪念馆',
            maxParticipants: 30,
            currentParticipants: 28,
            status: 'ongoing',
            organization: '南昌市红色教育基地',
            description: '学习八一起义历史，传承革命精神'
        },
        {
            id: 4,
            title: '上饶集中营红色教育活动',
            image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            city: '上饶市',
            date: '2024-04-10',
            startTime: '09:00',
            endTime: '17:00',
            location: '上饶集中营革命烈士纪念馆',
            maxParticipants: 35,
            currentParticipants: 35,
            status: 'ended',
            organization: '上饶市党史研究室',
            description: '缅怀革命先烈，开展爱国主义教育'
        },
        {
            id: 5,
            title: '萍乡安源路矿工人运动纪念馆寻访',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            city: '萍乡市',
            date: '2024-05-25',
            startTime: '09:00',
            endTime: '16:00',
            location: '安源路矿工人运动纪念馆',
            maxParticipants: 45,
            currentParticipants: 18,
            status: 'upcoming',
            organization: '萍乡市总工会',
            description: '了解中国工人运动历史，传承红色基因'
        },
        {
            id: 6,
            title: '九江庐山会议旧址参观学习',
            image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            city: '九江市',
            date: '2024-04-25',
            startTime: '08:00',
            endTime: '17:00',
            location: '庐山会议旧址',
            maxParticipants: 25,
            currentParticipants: 25,
            status: 'ongoing',
            organization: '九江市党史办',
            description: '回顾历史重要会议，学习革命传统'
        }
    ];

    // 全局变量
    let currentView = 'grid';
    let currentPage = 1;
    const itemsPerPage = 6;
    let filteredActivities = [...mockActivities];
    let currentFilters = {
        city: '',
        status: '',
        participants: '',
        startDate: '',
        endDate: '',
        search: ''
    };

    // 初始化页面
    initPage();

    // 初始化函数
    function initPage() {
        console.log('初始化页面...');
        updateActivityCount();
        renderActivities();
        setupEventListeners();
        setDefaultDates();
        console.log('页面初始化完成');
    }

    // 设置默认日期
    function setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthStr = nextMonth.toISOString().split('T')[0];

        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput) startDateInput.value = today;
        if (endDateInput) endDateInput.value = nextMonthStr;

        currentFilters.startDate = today;
        currentFilters.endDate = nextMonthStr;
    }

    // 设置事件监听器
    function setupEventListeners() {
        console.log('设置事件监听器...');

        // 搜索按钮
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');

        if (searchBtn) {
            searchBtn.addEventListener('click', handleSearch);
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') handleSearch();
            });
        }

        // 筛选按钮
        const applyFiltersBtn = document.getElementById('applyFilters');
        const resetFiltersBtn = document.getElementById('resetFilters');

        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyFilters);
        }

        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', resetFilters);
        }

        // 状态筛选按钮
        const statusBtns = document.querySelectorAll('.status-btn');
        if (statusBtns.length > 0) {
            statusBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentFilters.status = this.dataset.status;
                });
            });
        }

        // 视图切换按钮
        const viewBtns = document.querySelectorAll('.view-btn');
        if (viewBtns.length > 0) {
            viewBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    currentView = this.dataset.view;
                    const container = document.getElementById('activitiesContainer');
                    if (container) {
                        container.className = `activities-grid ${currentView === 'list' ? 'list-view' : ''}`;
                    }
                    renderActivities();
                });
            });
        }

        // 加载更多按钮
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreActivities);
        }

        // 重置空状态按钮
        const resetEmptyBtn = document.getElementById('resetEmpty');
        if (resetEmptyBtn) {
            resetEmptyBtn.addEventListener('click', resetFilters);
        }

        // 日期输入变化
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput) {
            startDateInput.addEventListener('change', updateDateFilter);
        }

        if (endDateInput) {
            endDateInput.addEventListener('change', updateDateFilter);
        }

        // 城市筛选变化
        const cityFilter = document.getElementById('cityFilter');
        if (cityFilter) {
            cityFilter.addEventListener('change', function() {
                currentFilters.city = this.value;
            });
        }

        // 人数筛选变化
        const participantsFilter = document.getElementById('participantsFilter');
        if (participantsFilter) {
            participantsFilter.addEventListener('change', function() {
                currentFilters.participants = this.value;
            });
        }

        console.log('事件监听器设置完成');
    }

    // 处理搜索
    function handleSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            currentFilters.search = searchInput.value.trim();
            applyFilters();
        }
    }

    // 更新日期筛选
    function updateDateFilter() {
        const startDateInput = document.getElementById('startDate');
        const endDateInput = document.getElementById('endDate');

        if (startDateInput) currentFilters.startDate = startDateInput.value;
        if (endDateInput) currentFilters.endDate = endDateInput.value;
    }

    // 应用筛选
    function applyFilters() {
        console.log('应用筛选条件...');
        // 更新活动筛选
        filterActivities();

        // 重置分页
        currentPage = 1;

        // 重新渲染活动
        renderActivities();

        // 更新活动数量
        updateActivityCount();
    }

    // 重置筛选
    function resetFilters() {
        console.log('重置筛选条件...');

        // 重置表单元素
        const searchInput = document.getElementById('searchInput');
        const cityFilter = document.getElementById('cityFilter');
        const participantsFilter = document.getElementById('participantsFilter');

        if (searchInput) searchInput.value = '';
        if (cityFilter) cityFilter.value = '';
        if (participantsFilter) participantsFilter.value = '';

        // 重置状态按钮
        const statusBtns = document.querySelectorAll('.status-btn');
        statusBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.status === '') {
                btn.classList.add('active');
            }
        });

        // 重置日期
        setDefaultDates();

        // 重置筛选条件
        currentFilters = {
            city: '',
            status: '',
            participants: '',
            startDate: document.getElementById('startDate')?.value || '',
            endDate: document.getElementById('endDate')?.value || '',
            search: ''
        };

        // 重置活动列表
        filteredActivities = [...mockActivities];
        currentPage = 1;

        // 重新渲染
        renderActivities();
        updateActivityCount();

        // 隐藏空状态
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }

    // 筛选活动
    function filterActivities() {
        console.log('筛选活动中...');
        filteredActivities = mockActivities.filter(activity => {
            // 搜索关键词筛选
            if (currentFilters.search &&
                !activity.title.toLowerCase().includes(currentFilters.search.toLowerCase()) &&
                !activity.description.toLowerCase().includes(currentFilters.search.toLowerCase())) {
                return false;
            }

            // 城市筛选
            if (currentFilters.city && activity.city !== currentFilters.city) {
                return false;
            }

            // 状态筛选
            if (currentFilters.status) {
                const statusMap = {
                    '1': 'upcoming',
                    '2': 'ongoing',
                    '3': 'ended'
                };
                if (activity.status !== statusMap[currentFilters.status]) {
                    return false;
                }
            }

            // 人数筛选
            if (currentFilters.participants) {
                const max = parseInt(currentFilters.participants);
                if (max === 10 && activity.maxParticipants > 10) return false;
                if (max === 30 && (activity.maxParticipants <= 10 || activity.maxParticipants > 30)) return false;
                if (max === 50 && (activity.maxParticipants <= 30 || activity.maxParticipants > 50)) return false;
                if (max === 51 && activity.maxParticipants <= 50) return false;
            }

            // 日期筛选
            if (currentFilters.startDate && currentFilters.endDate) {
                const activityDate = new Date(activity.date);
                const startDate = new Date(currentFilters.startDate);
                const endDate = new Date(currentFilters.endDate);

                if (activityDate < startDate || activityDate > endDate) {
                    return false;
                }
            }

            return true;
        });

        console.log(`筛选后活动数量: ${filteredActivities.length}`);
    }

    // 渲染活动列表
    function renderActivities() {
        console.log('渲染活动列表...');
        const container = document.getElementById('activitiesContainer');
        if (!container) {
            console.error('找不到活动容器元素');
            return;
        }

        const activitiesToShow = filteredActivities.slice(0, currentPage * itemsPerPage);

        if (activitiesToShow.length === 0) {
            container.innerHTML = '';
            const emptyState = document.getElementById('emptyState');
            const loadMoreBtn = document.getElementById('loadMoreBtn');

            if (emptyState) emptyState.style.display = 'block';
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }

        const emptyState = document.getElementById('emptyState');
        const loadMoreBtn = document.getElementById('loadMoreBtn');

        if (emptyState) emptyState.style.display = 'none';
        if (loadMoreBtn) {
            loadMoreBtn.style.display = filteredActivities.length > currentPage * itemsPerPage ? 'block' : 'none';
        }

        container.innerHTML = activitiesToShow.map(activity => createActivityCard(activity)).join('');

        // 添加点击事件到详情按钮
        const detailBtns = document.querySelectorAll('.btn-detail');
        detailBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const activityId = this.dataset.id;
                viewActivityDetail(activityId);
            });
        });

        // 添加点击事件到整个卡片
        const activityCards = document.querySelectorAll('.activity-card');
        activityCards.forEach(card => {
            card.addEventListener('click', function() {
                const activityId = this.dataset.id;
                viewActivityDetail(activityId);
            });
        });

        console.log(`渲染了 ${activitiesToShow.length} 个活动`);
    }

    // 创建活动卡片HTML
    function createActivityCard(activity) {
        const statusText = {
            'upcoming': '未开始',
            'ongoing': '进行中',
            'ended': '已结束'
        }[activity.status];

        const statusClass = {
            'upcoming': 'status-upcoming',
            'ongoing': 'status-ongoing',
            'ended': 'status-ended'
        }[activity.status];

        const remaining = activity.maxParticipants - activity.currentParticipants;
        const remainingText = remaining > 0 ? `剩余名额 ${remaining}` : '名额已满';

        return `
            <div class="activity-card ${currentView === 'list' ? 'list-view' : ''}" data-id="${activity.id}">
                <div class="activity-header">
                    <img src="${activity.image}" alt="${activity.title}" class="activity-image" 
                         onerror="this.src='https://via.placeholder.com/600x400/e53935/ffffff?text=活动图片'">
                    <span class="activity-status ${statusClass}">${statusText}</span>
                </div>
                <div class="activity-body">
                    <h3 class="activity-title">${activity.title}</h3>
                    <div class="activity-meta">
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${activity.city} · ${activity.location}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar-day"></i>
                            <span>${activity.date} ${activity.startTime}-${activity.endTime}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${remainingText} (${activity.currentParticipants}/${activity.maxParticipants})</span>
                        </div>
                    </div>
                    <div class="activity-footer">
                        <div class="organization">
                            <i class="fas fa-building"></i> ${activity.organization}
                        </div>
                        <button class="btn-detail" data-id="${activity.id}">
                            <i class="fas fa-info-circle"></i> 查看详情
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // 加载更多活动
    function loadMoreActivities() {
        console.log('加载更多活动...');
        const btn = document.getElementById('loadMoreBtn');
        if (!btn) return;

        btn.classList.add('loading');
        btn.disabled = true;

        // 模拟加载延迟
        setTimeout(() => {
            currentPage++;
            renderActivities();
            btn.classList.remove('loading');
            btn.disabled = false;
            console.log(`当前页码: ${currentPage}`);
        }, 500);
    }

    // 查看活动详情
    function viewActivityDetail(activityId) {
        console.log(`查看活动详情: ${activityId}`);
        const activity = mockActivities.find(a => a.id == activityId);
        if (activity) {
            // 这里应该跳转到活动详情页
            // window.location.href = `/explore/detail/${activityId}`;

            // 暂时用弹窗模拟
            alert(`即将跳转到活动详情页：\n\n活动名称：${activity.title}\n活动地点：${activity.location}\n活动时间：${activity.date} ${activity.startTime}-${activity.endTime}\n\n详细功能将在后续实现中完成。`);
        }
    }

    // 更新活动数量显示
    function updateActivityCount() {
        const countBadge = document.getElementById('activityCount');
        if (countBadge) {
            countBadge.textContent = `${filteredActivities.length}个活动`;
        }
    }
});

console.log('list.js 文件已加载');
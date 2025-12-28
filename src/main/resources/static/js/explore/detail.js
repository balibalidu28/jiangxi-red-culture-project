// 活动详情页面逻辑
document.addEventListener('DOMContentLoaded', function() {
    console.log('活动详情页面加载完成');

    // 初始化Clipboard.js
    const clipboard = new ClipboardJS('.btn-copy');

    clipboard.on('success', function(e) {
        const originalHTML = e.trigger.innerHTML;
        e.trigger.innerHTML = '<i class="fas fa-check"></i>';
        e.trigger.style.background = 'var(--success-green)';
        e.trigger.style.color = 'white';
        e.trigger.style.borderColor = 'var(--success-green)';

        // 显示复制成功提示
        showToast('邮箱地址已复制到剪贴板');

        // 2秒后恢复原状
        setTimeout(() => {
            e.trigger.innerHTML = originalHTML;
            e.trigger.style.background = '';
            e.trigger.style.color = '';
            e.trigger.style.borderColor = '';
        }, 2000);

        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        showToast('复制失败，请手动复制邮箱地址', 'error');
    });

    // 模拟从URL获取活动ID
    const urlParams = new URLSearchParams(window.location.search);
    const activityId = urlParams.get('id') || 1;

    // 模拟活动数据
    const activityData = {
        1: {
            id: 1,
            title: '井冈山革命根据地红色寻访之旅',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            city: '吉安市',
            date: '2024-05-01',
            startTime: '09:00',
            endTime: '17:00',
            location: '井冈山革命博物馆',
            quota: 50,  // 改为总名额
            status: 'upcoming',
            organization: '江西省红色文化研究会',
            email: 'jxredculture@example.com',
            description: '参观井冈山革命旧址，了解革命历史，体验红军生活。本次活动将带领大家深入了解井冈山革命根据地的建立和发展历程，通过实地参观、讲解和互动体验，传承红色基因，弘扬革命精神。\n\n我们将参观井冈山革命博物馆、黄洋界哨口、八角楼等革命旧址，聆听革命故事，感受革命先辈的艰苦奋斗精神。',
            schedule: [
                { time: '09:00-10:00', title: '集合签到', desc: '井冈山革命博物馆正门集合，签到领取资料' },
                { time: '10:00-12:00', title: '参观博物馆', desc: '参观井冈山革命博物馆，了解井冈山革命历史' },
                { time: '12:00-13:30', title: '午餐休息', desc: '体验红军餐，感受革命时期的艰苦生活' },
                { time: '13:30-16:30', title: '实地参观', desc: '参观井冈山革命旧址，包括黄洋界、八角楼等' },
                { time: '16:30-17:00', title: '交流总结', desc: '活动总结，交流心得体会' }
            ],
            registrationDeadline: '2024-04-28'
        },
        2: {
            id: 2,
            title: '瑞金红色首都文化体验活动',
            image: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            city: '赣州市',
            date: '2024-05-15',
            startTime: '08:30',
            endTime: '16:30',
            location: '瑞金中央革命根据地历史博物馆',
            quota: 40,
            status: 'upcoming',
            organization: '赣州红色文化传播中心',
            email: 'ganzhou_red@example.com',
            description: '探访中华苏维埃共和国临时中央政府旧址，了解红色首都的历史。',
            schedule: [
                { time: '08:30-09:30', title: '集合签到', desc: '瑞金博物馆正门集合' },
                { time: '09:30-12:00', title: '参观学习', desc: '参观中央革命根据地历史博物馆' },
                { time: '12:00-13:30', title: '午餐', desc: '团队午餐' },
                { time: '13:30-16:00', title: '旧址参观', desc: '参观叶坪革命旧址群' },
                { time: '16:00-16:30', title: '总结交流', desc: '活动总结' }
            ],
            registrationDeadline: '2024-05-12'
        }
    };

    // 获取当前活动数据
    const activity = activityData[activityId] || activityData[1];

    // 初始化页面
    initPage(activity);

    function initPage(activity) {
        // 设置页面标题
        document.title = `${activity.title} - 江西红色文化信息网`;

        // 填充活动数据
        populateActivityData(activity);

        // 设置事件监听器
        setupEventListeners(activity);

        console.log('页面初始化完成，活动ID:', activity.id);
    }

    function populateActivityData(activity) {
        // 设置活动封面
        const activityImage = document.getElementById('activityImage');
        if (activityImage) {
            activityImage.src = activity.image;
            activityImage.alt = activity.title;
        }

        // 设置活动状态
        const activityStatus = document.getElementById('activityStatus');
        if (activityStatus) {
            activityStatus.textContent = {
                'upcoming': '未开始',
                'ongoing': '进行中',
                'ended': '已结束'
            }[activity.status];
            activityStatus.className = `status-badge ${activity.status}`;
        }

        // 设置活动标题
        const activityTitle = document.getElementById('activityTitle');
        if (activityTitle) activityTitle.textContent = activity.title;

        // 设置基本信息
        const activityLocation = document.getElementById('activityLocation');
        if (activityLocation) activityLocation.textContent = `${activity.city} · ${activity.location}`;

        const activityDateTime = document.getElementById('activityDateTime');
        if (activityDateTime) activityDateTime.textContent = `${activity.date} ${activity.startTime}-${activity.endTime}`;

        const activityQuota = document.getElementById('activityQuota');
        if (activityQuota) activityQuota.textContent = `${activity.quota}人`;

        const activityOrganization = document.getElementById('activityOrganization');
        if (activityOrganization) activityOrganization.textContent = activity.organization;

        // 设置活动介绍
        const activityDescription = document.getElementById('activityDescription');
        if (activityDescription) {
            activityDescription.innerHTML = activity.description.split('\n').map(paragraph =>
                `<p>${paragraph}</p>`
            ).join('');
        }

        // 设置活动日程
        const activitySchedule = document.getElementById('activitySchedule');
        if (activitySchedule && activity.schedule) {
            activitySchedule.innerHTML = activity.schedule.map(item => `
                <div class="schedule-item">
                    <div class="schedule-time">${item.time}</div>
                    <div class="schedule-content">
                        <h4>${item.title}</h4>
                        <p>${item.desc}</p>
                    </div>
                </div>
            `).join('');
        }

        // 设置邮箱信息
        const activityEmail = document.getElementById('activityEmail');
        if (activityEmail) activityEmail.textContent = activity.email;

        const activityQuotaDisplay = document.getElementById('activityQuotaDisplay');
        if (activityQuotaDisplay) activityQuotaDisplay.textContent = `${activity.quota}人`;

        const submitEmail = document.getElementById('submitEmail');
        if (submitEmail) submitEmail.textContent = activity.email;
    }

    function setupEventListeners(activity) {
        // 返回按钮
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.location.href = '/jiangxi-red-culture-project/JXRedCultureDisplay/templates/explore/list.html';
            });
        }

        // 下载报名表按钮
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function() {
                downloadRegistrationForm(activity);
            });
        }
    }

    function downloadRegistrationForm(activity) {
        const downloadBtn = document.getElementById('downloadBtn');
        if (!downloadBtn) return;

        // 禁用按钮防止重复点击
        downloadBtn.disabled = true;
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成中...';

        // 创建Word文档内容
        const docContent = `
            江西红色文化寻访活动报名表
            
            活动信息
            ----------
            活动名称：${activity.title}
            活动时间：${activity.date} ${activity.startTime}-${activity.endTime}
            活动地点：${activity.city} ${activity.location}
            主办单位：${activity.organization}
            投稿邮箱：${activity.email}
            
            报名信息
            ----------
            姓名：___________________
            性别：□ 男 □ 女
            年龄：___________________
            身份证号：________________________________
            联系电话：___________________
            电子邮箱：___________________
            工作单位/学校：___________________
            职务/专业：___________________
            
            紧急联系人
            ----------
            紧急联系人姓名：___________________
            紧急联系人电话：___________________
            与报名人关系：___________________
            
            健康状况声明
            ----------
            1. 本人确认身体健康状况良好，能够适应本次活动的要求；
            2. 本人无心脏病、高血压等不适宜参加户外活动的疾病；
            3. 如因个人健康原因导致的问题，责任自负。
            
            签字：___________________ 日期：____年__月__日
            
            注意事项
            ----------
            1. 请如实填写所有信息；
            2. 请将填写完整的报名表发送至指定邮箱；
            3. 邮件主题格式：【活动报名】+ 姓名 + 活动名称；
            4. 报名截止时间：${activity.registrationDeadline}；
            5. 主办方将在收到报名表后3个工作日内回复确认。
            
            江西红色文化信息网
            ${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日
        `;

        // 模拟下载过程
        setTimeout(() => {
            // 创建Blob对象
            const blob = new Blob([docContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `红色寻访活动报名表-${activity.title}.docx`;

            // 触发下载
            document.body.appendChild(a);
            a.click();

            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                // 恢复按钮状态
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = originalText;

                // 显示下载成功提示
                showToast('报名表下载成功，请填写后发送到指定邮箱');
            }, 100);

        }, 1500);
    }

    function showToast(message, type = 'success') {
        // 移除已存在的toast
        const existingToast = document.querySelector('.custom-toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-green)' : 'var(--primary-red)'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(toast);

        // 3秒后自动移除
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }

    // 页面加载时的其他初始化
    console.log('页面初始化开始...');
});
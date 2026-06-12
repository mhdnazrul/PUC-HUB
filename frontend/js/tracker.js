// ========== ইউজার ট্র্যাকিং সিস্টেম ==========
// ✅ FIX: handleServiceClick এখান থেকে সরানো হয়েছে — auth.js-এ একটিই থাকবে

// ইউজার অ্যাক্টিভিটি ট্র্যাক করা
//<!-- Made by: Team PUC HUB | Internet Programming Lab Project -->
 //<!--Rahul-->


function trackUserActivity(serviceName) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');

    if (isLoggedIn !== 'true' || !userData) return;

    let user;
    try {
        user = JSON.parse(userData);
    } catch (e) {
        return;
    }

    const activity = {
        userId: user.studentId || 'unknown',
        username: user.username || 'Unknown',
        // ✅ FIX: base64 ইমেজ ট্র্যাকারে সেভ করা হচ্ছিল না — শুধু placeholder রাখি
        userImage: (user.profileImage && user.profileImage.startsWith('data:image')) ? user.profileImage : 'assets/default-avatar.png',
        service: serviceName,
        department: user.department || 'Not Set',
        semester: user.semester || 'Not Set',
        timestamp: new Date().toISOString(),
        date: (function(){ var d = new Date(); return d.getDate().toString().padStart(2,'0') + '/' + (d.getMonth()+1).toString().padStart(2,'0') + '/' + d.getFullYear(); })(),
        time: (function(){ var d = new Date(); var h = d.getHours(); var m = d.getMinutes().toString().padStart(2,'0'); var s = d.getSeconds().toString().padStart(2,'0'); var ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + m + ':' + s + ' ' + ampm; })()
    };

    // পুরানো অ্যাক্টিভিটি লোড
    let allActivities = [];
    try {
        allActivities = JSON.parse(localStorage.getItem('userActivities')) || [];
    } catch (e) {
        allActivities = [];
    }

    allActivities.unshift(activity);

    // সর্বোচ্চ ৫০০ টি রাখা (performance)
    if (allActivities.length > 500) {
        allActivities = allActivities.slice(0, 500);
    }

    localStorage.setItem('userActivities', JSON.stringify(allActivities));

    // ইউজারের নিজস্ব হিস্ট্রি আপডেট
    updateUserHistory(activity, user.studentId);
}

// ইউজারের নিজস্ব হিস্ট্রি
function updateUserHistory(activity, studentId) {
    if (!studentId) return;

    let userHistory = [];
    try {
        userHistory = JSON.parse(localStorage.getItem('history_' + studentId)) || [];
    } catch (e) {
        userHistory = [];
    }

    userHistory.unshift(activity);

    if (userHistory.length > 200) {
        userHistory = userHistory.slice(0, 200);
    }

    localStorage.setItem('history_' + studentId, JSON.stringify(userHistory));
}

// লগইন ট্র্যাক
function trackLogin() {
    trackUserActivity('Login');
}

// ভিজিট স্ট্যাটস
function getUserVisitStats() {
    let activities = [];
    try {
        activities = JSON.parse(localStorage.getItem('userActivities')) || [];
    } catch (e) {}

    const stats = {
        totalVisits: activities.length,
        uniqueUsers: new Set(activities.map(a => a.userId)).size,
        services: {},
        departments: {}
    };

    activities.forEach(activity => {
        stats.services[activity.service] = (stats.services[activity.service] || 0) + 1;
        stats.departments[activity.department] = (stats.departments[activity.department] || 0) + 1;
    });

    return stats;
}
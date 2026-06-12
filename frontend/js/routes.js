// ========== SERVICE ROUTES — PUC HUB ==========
// Made by: Team PUC HUB | Internet Programming Lab Project
// Rahul

// ── Login check helper ──
function requireLogin() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please login first to access this service!');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// ── Core Service Functions ──
// ✅ ROUTINE GENERATOR FIX
function goToRoutineGenerator() { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Routine Generator');       window.location.href = 'studyplanner.html'; }

function goToAI()               { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('PUC AI Assistant');    window.location.href = 'ai.html'; }
function goToStudyTracker()     { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('AI Study Tracker');     window.location.href = 'ai-study-tracker.html'; }
function goToNotesSummarizer()  { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('AI Notes Summarizer');  window.location.href = 'ai-notes-summarizer.html'; }
function goToCodeDebugger()     { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Code Debugger');         window.location.href = 'code-debugger.html'; }
function goToAssignmentWriter() { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('AI Assignment Writer');  window.location.href = 'ai-assignment-writer.html'; }
function goToQuestionBank()     { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Question Bank');         window.location.href = 'questionbank.html'; }
function goToHoliday()          { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Holiday Calendar');      window.location.href = 'holiday.html'; }
function goToFaculty()          { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Faculty Contact');       window.location.href = 'faculty.html'; }
function goToNotices()          { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Notice Board');          window.location.href = 'notices.html'; }
function goToExamRoutine()      { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Exam Routine');          window.location.href = 'examroutine.html'; }
function goToBusRoute()         { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Bus Route Map');         window.location.href = 'busroute.html'; }
function goToClassRoutine()     { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Class Routine');         window.location.href = 'classroutine.html'; }
function goToFeeCalculator()    { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Fee Calculator');        window.location.href = 'fee-calculator.html'; }
function goToCGPA()             { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('CGPA Calculator');       window.location.href = 'cgpa.html'; }
function goToBloodDonation()    { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Blood Donation');        window.location.href = 'blooddonation.html'; }
function goToMessHousing()      { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Mess & Housing');        window.location.href = 'messnhousing.html'; }
function goToCoverPage()        { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Cover Page Generator');  window.location.href = 'coverpages.html'; }
function openClubInfo()         { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Club Information');      window.location.href = 'clubinfo.html'; }
function goToStudyPartnerFinder(){ if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Study Partner Finder'); window.location.href = 'study-partner-finder.html'; }
function goToUniversityRoomInfo(){ if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('University Room Info');  window.location.href = 'university-room-info.html'; }
function goToYouTubePlaylists() { if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('YouTube Playlists');     window.location.href = 'youtube-playlists.html'; }
function goToLearningResources(){ if (!requireLogin()) return; if (typeof trackUserActivity === 'function') trackUserActivity('Learning Resources');    window.location.href = 'learning-resources.html'; }

// ========================================
// ── Main Service Click Handler ──
// ========================================
function handleServiceClick(serviceName) {

    // CP Leaderboard — special case (opens new tab)
    if (serviceName === 'CP Leaderboard') {
        if (!requireLogin()) return false;
        if (typeof trackUserActivity === 'function') trackUserActivity('CP Leaderboard');
        window.open('https://codeforces.com/ratings/organization/10519', '_blank');
        return true;
    }

    // ✅ FIXED ROUTE MAP
    var routeMap = {
        'Routine Generator':         goToRoutineGenerator,  /* ✅ FIXED - সঠিক function name */
        'Question Bank':             goToQuestionBank,
        'PUC AI Assistant':          goToAI,
        'POC AI Assistant':          goToAI,
        'AI Study Tracker':          goToStudyTracker,
        'Study Tracker':             goToStudyTracker,
        'AI Notes Summarizer':       goToNotesSummarizer,
        'Notes Summarizer':          goToNotesSummarizer,
        'Code Debugger':             goToCodeDebugger,
        'AI Assignment Writer':      goToAssignmentWriter,
        'Assignment Writer':         goToAssignmentWriter,
        'Cover Page Generator':      goToCoverPage,
        'Lab Cover Page Generator':  goToCoverPage,
        'Lab Report Generator':      goToCoverPage,
        'Blood Donation':            goToBloodDonation,
        'Mess & Housing':            goToMessHousing,
        'Mess &amp; Housing':        goToMessHousing,
        'Fee Calculator':            goToFeeCalculator,
        'CGPA Calculator':           goToCGPA,
        'Holiday Calendar':          goToHoliday,
        'Faculty Contact':           goToFaculty,
        'Faculty Contacts':          goToFaculty,
        'Notice Board':              goToNotices,
        'Notices':                   goToNotices,
        'Exam Routine':              goToExamRoutine,
        'Bus Route Map':             goToBusRoute,
        'Class Routine':             goToClassRoutine,
        'Club Information':          openClubInfo,
        'Study Partner Finder':      goToStudyPartnerFinder,
        'University Room Info':      goToUniversityRoomInfo,
        'YouTube Playlists':         goToYouTubePlaylists,
        'Learning Resources':        goToLearningResources,
    };

    if (routeMap[serviceName]) {
        routeMap[serviceName]();
        return true;
    }

    // Fallback
    if (!requireLogin()) return false;
    var userData = localStorage.getItem('userData');
    var user;
    try { user = JSON.parse(userData); } catch(e) { return false; }
    if (!user || !user.profileCompleted) {
        alert('Please complete your profile first!');
        window.location.href = 'profile.html';
        return false;
    }
    if (typeof trackUserActivity === 'function') trackUserActivity(serviceName);
    alert('Welcome to ' + serviceName + '!\nYour visit has been recorded.');
    return true;
}
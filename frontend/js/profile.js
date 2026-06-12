// ========== PROFILE FUNCTIONS ==========
// ✅ FIX: DOMContentLoaded এখানে নেই — profile.html-এর inline script সেটি handle করে
// ✅ FIX: ইমেজ compress করা হয়েছে — আগে বড় ইমেজ সরাসরি base64 সেভ করায় slow ছিল

// ইউজারের নাম দেখান
//<!-- Made by: Team PUC HUB | Internet Programming Lab Project -->
 //<!--Rudra-->

function displayUserName(user) {
    const nameDisplay = document.getElementById('userName');
    if (nameDisplay) {
        nameDisplay.textContent = user.username || 'Student';
    }
}

// ইউজার প্রোফাইল লোড করা (এডিট করার জন্য)
function loadUserProfile(user) {
    const dept = document.getElementById('department');
    if (!dept) return;

    document.getElementById('department').value = user.department || '';
    document.getElementById('semester').value = user.semester || '';
    document.getElementById('section').value = user.section || '';
    document.getElementById('bloodGroup').value = user.bloodGroup || '';
    document.getElementById('advisor').value = user.advisor || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('email').value = user.email || '';

    const preview = document.getElementById('profilePreview');
    if (preview) {
        var img = user.profileImage || '';
        // assets/p.png বা default-avatar বা খালি হলে default-avatar.png দেখাও
        // শুধুমাত্র real base64 image (data:image) থাকলে সেটা দেখাও
        if (img && img.startsWith('data:image')) {
            preview.src = img;
        } else {
            preview.src = 'assets/default-avatar.png';
        }
        preview.onerror = function() { this.src = 'assets/default-avatar.png'; };
    }
}

// ✅ FIX: ইমেজ compress করে সেভ করা — আগে raw base64 ছিল, তাই slow ছিল
function compressImage(file, callback) {
    const MAX_WIDTH = 300;
    const MAX_HEIGHT = 300;
    const QUALITY = 0.7;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                if (width / height > 1) {
                    height = Math.round(height * MAX_WIDTH / width);
                    width = MAX_WIDTH;
                } else {
                    width = Math.round(width * MAX_HEIGHT / height);
                    height = MAX_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL('image/jpeg', QUALITY);
            callback(compressedBase64);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ইমেজ আপলোড প্রিভিউ
function setupImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const profilePreview = document.getElementById('profilePreview');

    if (imageUpload && profilePreview) {
        imageUpload.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            if (!file.type.match('image.*')) {
                alert('Please select an image file');
                return;
            }

            // ✅ FIX: compress করে preview দেখানো
            compressImage(file, function (compressedSrc) {
                profilePreview.src = compressedSrc;
            });
        });
    }
}

// প্রোফাইল ফর্ম সেটআপ
function setupProfileForm() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const department = document.getElementById('department').value;
        const semester = document.getElementById('semester').value;
        const section = document.getElementById('section').value;
        const bloodGroup = document.getElementById('bloodGroup').value;
        const advisor = document.getElementById('advisor').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!department || !semester || !section || !bloodGroup || !advisor) {
            alert('Please fill in all required fields');
            return;
        }

        let userData;
        try {
            userData = JSON.parse(localStorage.getItem('userData'));
        } catch (e) {
            alert('Session error. Please login again.');
            window.location.href = 'login.html';
            return;
        }

        userData.department = department;
        userData.semester = semester;
        userData.section = section;
        userData.bloodGroup = bloodGroup;
        userData.advisor = advisor;
        userData.phone = phone;
        userData.email = email;
        userData.profileCompleted = true;

        // ✅ FIX: ইমেজ সেভ — compressed preview src ব্যবহার করা
        const profilePreview = document.getElementById('profilePreview');
        if (profilePreview && profilePreview.src &&
            !profilePreview.src.includes('assets/p.png') &&
            !profilePreview.src.includes('assets/default') &&
            profilePreview.src.startsWith('data:image')) {
            // ইউজার নতুন ছবি দিয়েছে — সেটা save করো
            userData.profileImage = profilePreview.src;
        } else if (!userData.profileImage || userData.profileImage.includes('default-avatar')) {
            // ইউজার কোনো ছবি দেয়নি — default-avatar.png রাখো
            userData.profileImage = 'assets/default-avatar.png';
        }

        localStorage.setItem('userData', JSON.stringify(userData));

        // ✅ Bootstrap Toast দেখাও, তারপর redirect
        var toastEl = document.getElementById('profileToast');
        if (toastEl && typeof bootstrap !== 'undefined') {
            var toast = new bootstrap.Toast(toastEl, { delay: 1800 });
            toast.show();
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1800);
        } else {
            window.location.href = 'index.html';
        }
    });
}

// স্কিপ প্রোফাইল
function skipProfile() {
    if (confirm('Are you sure? You can complete your profile later from the profile page.')) {
        window.location.href = 'index.html';
    }
    return false;
}
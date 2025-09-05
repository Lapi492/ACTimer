const translations = {
    en: {
        // Page title and header
        pageTitle: "AC Town Tune Timer",
        headerTitle: "AC Town Tune Timer",
        headerSubtitle: "Play your custom town tune at scheduled times!",
        
        // Schedule section
        scheduleTitle: "Schedule Settings",
        hourlyOption: "Play every hour (1:00, 2:00, 3:00, etc.)",
        customOption: "Custom time",
        minutesLaterOption: "Play in N minutes",
        hourLabel: "Hour:",
        minuteLabel: "Minute:",
        minutesLaterLabel: "Minutes from now:",
        fastPlayOption: "Play at slow speed",
        notifyBefore5MinutesOption: "Notify me 5 minutes before",
        startScheduleBtn: "Start Schedule",
        stopScheduleBtn: "Stop Schedule",
        
        // Tune setup section
        tuneSetupTitle: "Town Tune Setup",
        tuneUrlLabel: "Town Tune URL (from <a href=\"https://ac-tune-maker.aikats.us/\" target=\"_blank\">AC Tune Maker</a>):",
        tuneUrlPlaceholder: "https://ac-tune-maker.aikats.us/#/tune/CECGfGBDGzqzc--z/AC%20Tune%20Maker",
        loadTuneBtn: "Load Tune",
        tuneCodeLabel: "Town Tune Code:",
        tuneCodePlaceholder: "CECGfGBDGzqzc--z",
        editBtn: "Edit",
        saveBtn: "Save",
        
        // Playback controls
        playbackControlsTitle: "Playback Controls",
        playTuneBtn: "Play Tune",
        playTuneFastBtn: "Play Slow",
        playingText: "Playing...",
        playingFastText: "Playing Slow...",
        volumeLabel: "Volume:",
        
        // Status section
        statusTitle: "Status & Recent Plays",
        scheduleStatusLabel: "Schedule Status:",
        nextPlayLabel: "Next Play:",
        timeLeftLabel: "Time Left:",
        currentTuneLabel: "Current Tune:",
        stoppedStatus: "Stopped",
        runningStatus: "Running",
        noneLoaded: "None loaded",
        recentPlaysTitle: "Recent Plays",
        noPlaysYet: "No tunes played yet",
        
        // Notifications
        enterValidUrl: "Please enter a valid AC Tune Maker URL",
        couldNotExtractCode: "Could not extract tune code from URL. Please check the URL format.",
        tuneLoadedSuccess: "Tune loaded successfully!",
        invalidTuneCode: "Invalid tune code format",
        noTuneLoaded: "No tune loaded. Please load a tune first.",
        scheduleStarted: "Schedule started!",
        invalidTimeValues: "Please enter valid time values.",
        errorPlayingTune: "Error playing tune. Please check the tune code.",
        countdownNow: "Now!",
        minutesBeforeText: " (5 minutes before ",
        minutesBeforeTextEnd: ")",
        
        // Language switcher
        languageBtn: "🌐",
        languageTooltip: "Switch language"
    },
    
    ko: {
        // Page title and header
        pageTitle: "동숲 마을멜로디 타이머",
        headerTitle: "동숲 마을멜로디 타이머",
        headerSubtitle: "정각 또는 지정된 시각에 마을멜로디를 재생합니다.",
        
        // Schedule section
        scheduleTitle: "시각 설정",
        hourlyOption: "정각에 알림 (1:00, 2:00, 3:00 등)",
        customOption: "특정 시각에 알림",
        minutesLaterOption: "지정된 시간 뒤에 알림",
        hourLabel: "시:",
        minuteLabel: "분:",
        minutesLaterLabel: "몇 분 후에 알려드릴까요?:",
        fastPlayOption: "마을멜로디를 느린 속도로 재생",
        notifyBefore5MinutesOption: "5분 전에 미리 알림",
        startScheduleBtn: "타이머 예약",
        stopScheduleBtn: "타이머 중지",
        
        // Tune setup section
        tuneSetupTitle: "마을멜로디 설정",
        tuneUrlLabel: "마을멜로디 URL (<a href=\"https://ac-tune-maker.aikats.us/\" target=\"_blank\">AC Tune Maker</a> 하단의 주소):",
        tuneUrlPlaceholder: "https://ac-tune-maker.aikats.us/#/tune/CECGfGBDGzqzc--z/AC%20Tune%20Maker",
        loadTuneBtn: "마을멜로디 불러오기",
        tuneCodeLabel: "마을멜로디 코드:",
        tuneCodePlaceholder: "CECGfGBDGzqzc--z",
        editBtn: "편집",
        saveBtn: "저장",
        
        // Playback controls
        playbackControlsTitle: "들어보기",
        playTuneBtn: "재생",
        playTuneFastBtn: "느리게 재생",
        playingText: "재생 중...",
        playingFastText: "느리게 재생 중...",
        volumeLabel: "볼륨:",
        
        // Status section
        statusTitle: "타이머 보기",
        scheduleStatusLabel: "예약 상태:",
        nextPlayLabel: "다음 알림:",
        timeLeftLabel: "남은 시간:",
        currentTuneLabel: "마을멜로디:",
        stoppedStatus: "중지됨",
        runningStatus: "실행 중",
        noneLoaded: "로드된 마을멜로디 없음",
        recentPlaysTitle: "최근 알림",
        noPlaysYet: "아직 알림이 없습니다",
        
        // Notifications
        enterValidUrl: "유효한 AC Tune Maker URL을 입력해주세요",
        couldNotExtractCode: "URL에서 코드를 추출할 수 없습니다. URL 형식을 확인해주세요.",
        tuneLoadedSuccess: "마을멜로디가 성공적으로 로드되었습니다.",
        invalidTuneCode: "잘못된 코드 형식",
        noTuneLoaded: "로드된 마을멜로디가 없습니다. 먼저 마을멜로디를 로드해주세요.",
        scheduleStarted: "알림이 예약되었습니다.",
        invalidTimeValues: "유효한 시간 값을 입력해주세요.",
        errorPlayingTune: "마을멜로디 재생 중 오류가 발생했습니다. 코드를 확인해주세요.",
        countdownNow: "지금",
        minutesBeforeText: " (",
        minutesBeforeTextEnd: " 5분 전)",
        
        // Language switcher
        languageBtn: "🌐",
        languageTooltip: "언어 변경"
    }
};

// Language management
class LanguageManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('language') || 'ko';
        this.init();
    }
    
    init() {
        this.updateLanguage();
        this.setupLanguageSwitcher();
    }
    
    setupLanguageSwitcher() {
        const header = document.querySelector('header');
        const languageContainer = document.createElement('div');
        languageContainer.className = 'language-container';
        
        const languageBtn = document.createElement('button');
        languageBtn.id = 'languageSwitcher';
        languageBtn.className = 'language-btn';
        languageBtn.innerHTML = translations[this.currentLanguage].languageBtn;
        languageBtn.title = translations[this.currentLanguage].languageTooltip;
        languageBtn.onclick = () => this.toggleDropdown();
        
        const dropdown = document.createElement('div');
        dropdown.id = 'languageDropdown';
        dropdown.className = 'language-dropdown';
        
        // Add language options
        Object.keys(translations).forEach(langCode => {
            const langName = this.getLanguageName(langCode);
            const option = document.createElement('div');
            option.className = 'language-option';
            option.textContent = langName;
            option.onclick = () => this.selectLanguage(langCode);
            
            if (langCode === this.currentLanguage) {
                option.classList.add('selected');
            }
            
            dropdown.appendChild(option);
        });
        
        languageContainer.appendChild(languageBtn);
        languageContainer.appendChild(dropdown);
        header.appendChild(languageContainer);
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageContainer.contains(e.target)) {
                this.closeDropdown();
            }
        });
    }
    
    getLanguageName(langCode) {
        const languageNames = {
            'en': 'English',
            'ko': '한국어'
        };
        return languageNames[langCode] || langCode;
    }
    
    toggleDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        dropdown.classList.toggle('show');
    }
    
    closeDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        dropdown.classList.remove('show');
    }
    
    selectLanguage(langCode) {
        this.currentLanguage = langCode;
        localStorage.setItem('language', this.currentLanguage);
        this.updateLanguage();
        this.closeDropdown();
    }
    
    updateLanguage() {
        // Update page title
        document.title = translations[this.currentLanguage].pageTitle;
        
        // Update all translatable elements
        this.updateElementText('header h1', 'headerTitle');
        this.updateElementText('header p', 'headerSubtitle');
        
        // Schedule section
        this.updateElementText('.schedule .section-title', 'scheduleTitle');
        this.updateElementText('label[for="hourly"]', 'hourlyOption');
        this.updateElementText('label[for="custom"]', 'customOption');
        this.updateElementText('label[for="minutesLater"]', 'minutesLaterOption');
        this.updateElementText('label[for="customHour"]', 'hourLabel');
        this.updateElementText('label[for="customMinute"]', 'minuteLabel');
        this.updateElementText('label[for="minutesLaterInput"]', 'minutesLaterLabel');
        this.updateElementText('label[for="scheduledFastPlay"]', 'fastPlayOption');
        this.updateElementText('label[for="notifyBefore5Minutes"]', 'notifyBefore5MinutesOption');
        this.updateElementText('#startSchedule', 'startScheduleBtn');
        this.updateElementText('#stopSchedule', 'stopScheduleBtn');
        
        // Tune setup section
        this.updateElementText('.tune-input .section-title', 'tuneSetupTitle');
        this.updateElementText('label[for="tuneUrl"]', 'tuneUrlLabel');
        this.updateElementText('#tuneUrl', 'tuneUrlPlaceholder', 'placeholder');
        this.updateElementText('#loadTune', 'loadTuneBtn');
        this.updateElementText('label[for="tuneCode"]', 'tuneCodeLabel');
        this.updateElementText('#tuneCode', 'tuneCodePlaceholder', 'placeholder');
        this.updateElementText('#editTune', 'editBtn');
        
        // Playback controls
        this.updateElementText('.playback-controls h3', 'playbackControlsTitle');
        this.updateElementText('#playTune', 'playTuneBtn');
        this.updateElementText('#playTuneFast', 'playTuneFastBtn');
        this.updateElementText('label[for="volume"]', 'volumeLabel');
        
        // Status section
        this.updateElementText('.status-recent .section-title', 'statusTitle');
        this.updateElementText('.status-info p:nth-child(1) strong', 'scheduleStatusLabel');
        this.updateElementText('.status-info p:nth-child(2) strong', 'nextPlayLabel');
        this.updateElementText('.status-info p:nth-child(3) strong', 'timeLeftLabel');
        this.updateElementText('.status-info p:nth-child(4) strong', 'currentTuneLabel');
        this.updateElementText('#scheduleStatus', 'stoppedStatus');
        this.updateElementText('#currentTune', 'noneLoaded');
        this.updateElementText('.recent-plays h3', 'recentPlaysTitle');
        this.updateElementText('.no-plays', 'noPlaysYet');
        
        // Update language switcher
        const languageBtn = document.getElementById('languageSwitcher');
        if (languageBtn) {
            languageBtn.innerHTML = translations[this.currentLanguage].languageBtn;
            languageBtn.title = translations[this.currentLanguage].languageTooltip;
        }
        
        // Update selected language in dropdown
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            const options = dropdown.querySelectorAll('.language-option');
            options.forEach(option => {
                option.classList.remove('selected');
                if (option.textContent === this.getLanguageName(this.currentLanguage)) {
                    option.classList.add('selected');
                }
            });
        }
        
        // Update button texts that might have been changed dynamically
        const playBtn = document.getElementById('playTune');
        const fastBtn = document.getElementById('playTuneFast');
        const editBtn = document.getElementById('editTune');
        
        if (playBtn && !playBtn.classList.contains('playing')) {
            playBtn.textContent = translations[this.currentLanguage].playTuneBtn;
        }
        if (fastBtn && !fastBtn.classList.contains('playing')) {
            fastBtn.textContent = translations[this.currentLanguage].playTuneFastBtn;
        }
        if (editBtn && editBtn.textContent !== translations[this.currentLanguage].saveBtn) {
            editBtn.textContent = translations[this.currentLanguage].editBtn;
        }
        
        // Update countdown text if it's showing "Now!"
        const timeLeft = document.getElementById('timeLeft');
        if (timeLeft && timeLeft.textContent === 'Now!') {
            timeLeft.textContent = translations[this.currentLanguage].countdownNow;
        }
    }
    
    updateElementText(selector, translationKey, attribute = 'textContent') {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (attribute === 'textContent') {
                // Check if the translation contains HTML (for links)
                const translation = translations[this.currentLanguage][translationKey];
                if (translation.includes('<a href=')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            } else if (attribute === 'placeholder') {
                element.placeholder = translations[this.currentLanguage][translationKey];
            }
        });
    }
    
    getText(key) {
        return translations[this.currentLanguage][key] || key;
    }
}

// Export for use in other files
window.LanguageManager = LanguageManager;
window.translations = translations; 
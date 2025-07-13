class ACTownTunePlayer {
    constructor() {
        this.currentTune = null;
        this.scheduleInterval = null;
        this.countdownInterval = null;
        this.audioContext = null;
        this.isPlaying = false;
        this.recentPlays = [];
        this.nextPlayTime = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.updateStatus();
    }

    setupEventListeners() {
        // Tune input controls
        document.getElementById('loadTune').addEventListener('click', () => this.loadTuneFromUrl());
        document.getElementById('editTune').addEventListener('click', () => this.toggleTuneEdit());
        document.getElementById('tuneCode').addEventListener('input', (e) => this.onTuneCodeChange(e.target.value));

        // Playback controls
        document.getElementById('playTune').addEventListener('click', () => this.playTune());
        document.getElementById('playTuneFast').addEventListener('click', () => this.playTuneFast());
        document.getElementById('volume').addEventListener('input', (e) => this.updateVolume(e.target.value));

        // Schedule controls
        document.querySelectorAll('input[name="schedule"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.onScheduleTypeChange(e.target.value));
        });
        document.getElementById('scheduledFastPlay').addEventListener('change', () => this.saveToLocalStorage());
        document.getElementById('startSchedule').addEventListener('click', () => this.startSchedule());
        document.getElementById('stopSchedule').addEventListener('click', () => this.stopSchedule());

        // Enter key support for tune code
        document.getElementById('tuneCode').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.playTune();
            }
        });
    }

    // Parse AC Tune Maker URL to extract tune code
    parseTuneUrl(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const tuneIndex = pathParts.indexOf('tune');
            
            if (tuneIndex !== -1 && pathParts[tuneIndex + 1]) {
                return pathParts[tuneIndex + 1];
            }
            
            // Try hash-based URL
            if (urlObj.hash) {
                const hashMatch = urlObj.hash.match(/\/tune\/([^\/]+)/);
                if (hashMatch) {
                    return hashMatch[1];
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error parsing tune URL:', error);
            return null;
        }
    }

    // Load tune from URL
    loadTuneFromUrl() {
        const url = document.getElementById('tuneUrl').value.trim();
        if (!url) {
            this.showNotification(window.languageManager.getText('enterValidUrl'), 'error');
            return;
        }

        const tuneCode = this.parseTuneUrl(url);
        if (!tuneCode) {
            this.showNotification(window.languageManager.getText('couldNotExtractCode'), 'error');
            return;
        }

        this.setTuneCode(tuneCode);
        this.showNotification(window.languageManager.getText('tuneLoadedSuccess'), 'success');
    }

    // Set tune code and update UI
    setTuneCode(code) {
        this.currentTune = code;
        document.getElementById('tuneCode').value = code;
        document.getElementById('currentTune').textContent = code || window.languageManager.getText('noneLoaded');
        this.saveToLocalStorage();
        this.updateStatus();
    }

    // Toggle tune code editing
    toggleTuneEdit() {
        const tuneCodeInput = document.getElementById('tuneCode');
        const editBtn = document.getElementById('editTune');
        
        if (tuneCodeInput.readOnly) {
            tuneCodeInput.readOnly = false;
            editBtn.textContent = window.languageManager.getText('saveBtn');
            tuneCodeInput.focus();
        } else {
            tuneCodeInput.readOnly = true;
            editBtn.textContent = window.languageManager.getText('editBtn');
            this.setTuneCode(tuneCodeInput.value);
        }
    }

    // Handle tune code changes
    onTuneCodeChange(code) {
        if (!code) return;
        
        // Validate tune code format (basic validation)
        // Allow letters, numbers, dashes, and underscores
        if (!/^[A-Za-z0-9\-_]+$/.test(code)) {
            this.showNotification(window.languageManager.getText('invalidTuneCode'), 'error');
            return;
        }
    }

    // Initialize Web Audio API
    initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Convert AC tune code to notes
    parseTuneCode(code) {
        // AC Tune Maker uses a specific encoding for notes
        // Based on the actual AC Tune Maker player.js frequencies
        const frequencies = {
            'g': 392.0,
            'a': 440.0,
            'b': 493.88,
            'c': 523.25,
            'd': 587.33,
            'e': 659.25,
            'f': 698.46,
            'G': 783.99,
            'A': 880.0,
            'B': 987.77,
            'C': 1046.5,
            'D': 1174.66,
            'E': 1318.51
        };

        const notes = [];
        const delay = 0.25; // Same as original AC Tune Maker
        
        console.log('Parsing tune code:', code); // Debug logging
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            let frequency = 0;
            let note = char;
            
            switch (char) {
                case 'z':
                    frequency = 0; // Rest
                    break;
                case '-':
                    frequency = 0; // Hold/rest
                    break;
                case 'q':
                    // Question mark - random note
                    const allNotes = Object.keys(frequencies);
                    const randomNote = allNotes[Math.floor(Math.random() * allNotes.length)];
                    note = randomNote;
                    frequency = frequencies[randomNote] || 0;
                    break;
                default:
                    frequency = frequencies[char] || 0;
                    break;
            }
            
            notes.push({ 
                frequency, 
                duration: delay, 
                note: char,
                index: i 
            });
            console.log(`Note ${i}: ${char}, Frequency: ${frequency}, Duration: ${delay}`);
        }
        
        return notes;
    }



    // Play the entire tune
    async playTune() {
        if (this.isPlaying) {
            this.stopTune();
            return;
        }
        await this.playTuneWithSpeed(1.0);
    }

    // Play the tune at fast speed (2.0x)
    async playTuneFast() {
        if (this.isPlaying) {
            this.stopTune();
            return;
        }
        await this.playTuneWithSpeed(2.0);
    }

    // Play tune for scheduled playback (respects fast playback setting)
    async playScheduledTune() {
        if (this.isScheduledFastPlayEnabled()) {
            await this.playTuneWithSpeed(2.0);
        } else {
            await this.playTuneWithSpeed(1.0);
        }
    }

    // Play tune with specified speed multiplier
    async playTuneWithSpeed(speedMultiplier) {
        if (!this.currentTune) {
            this.showNotification(window.languageManager.getText('noTuneLoaded'), 'error');
            return;
        }

        this.initAudioContext();
        
        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.isPlaying = true;
        
        // Update button states
        const playButton = document.getElementById('playTune');
        const fastButton = document.getElementById('playTuneFast');
        
        if (speedMultiplier === 2.0) {
            fastButton.classList.add('playing');
            fastButton.textContent = window.languageManager.getText('playingFastText');
        } else {
            playButton.classList.add('playing');
            playButton.textContent = window.languageManager.getText('playingText');
        }

        try {
            const notes = this.parseTuneCode(this.currentTune);
            console.log('Parsed notes:', notes); // Debug logging
            
            // Use the same playback method as original AC Tune Maker with speed control
            await this.playTuneContinuous(notes, speedMultiplier);

            this.addRecentPlay();
        } catch (error) {
            console.error('Error playing tune:', error);
            this.showNotification(window.languageManager.getText('errorPlayingTune'), 'error');
        }

        this.isPlaying = false;
        playButton.classList.remove('playing');
        fastButton.classList.remove('playing');
        playButton.textContent = window.languageManager.getText('playTuneBtn');
        fastButton.textContent = window.languageManager.getText('playTuneFastBtn');
    }

    // Play tune using continuous oscillator (like original AC Tune Maker)
    async playTuneContinuous(notes, speedMultiplier = 1.0) {
        return new Promise((resolve) => {
            if (notes.length === 0) {
                resolve();
                return;
            }

            const delay = 0.25 * speedMultiplier; // Apply speed multiplier to delay
            const volume = this.getVolume() / 100 * 0.12; // Match original volume scaling
            
            const gainNode = this.audioContext.createGain();
            gainNode.connect(this.audioContext.destination);
            gainNode.gain.value = volume;

            const osc = this.audioContext.createOscillator();
            osc.type = "sine";
            osc.connect(gainNode);

            const startTime = this.audioContext.currentTime;
            let notesArray = notes.map(n => n.note);

            // Handle starting with hold note
            if (notesArray[0] === '-') {
                notesArray[0] = 'z';
            }

            const callbacks = [];
            
            notesArray.forEach((currentNote, noteNumber) => {
                let note = currentNote;
                let frequency = 0;
                
                switch (currentNote) {
                    case 'z':
                        frequency = 0;
                        break;
                    case '-':
                        frequency = null; // Hold note
                        break;
                    case 'q':
                        const allNotes = ['g', 'a', 'b', 'c', 'd', 'e', 'f', 'G', 'A', 'B', 'C', 'D', 'E'];
                        const randomNote = allNotes[Math.floor(Math.random() * allNotes.length)];
                        note = randomNote;
                        frequency = this.getFrequency(randomNote);
                        break;
                    default:
                        frequency = this.getFrequency(currentNote) || 0;
                        break;
                }

                const noteDelaySeconds = noteNumber * delay;
                
                if (frequency !== null) {
                    // If not a hold note, stop the previous note early
                    if (noteNumber > 0) {
                        osc.frequency.setValueAtTime(0, startTime + noteDelaySeconds - delay * 0.4);
                    }

                    osc.frequency.setValueAtTime(frequency, startTime + noteDelaySeconds);
                }

                const cancelable = window.setTimeout(() => {
                    // Note callback if needed
                }, noteDelaySeconds * 1000);

                callbacks.push(cancelable);
            });

            osc.onended = () => {
                callbacks.forEach(window.clearTimeout);
                resolve();
            };
            
            osc.start();

            // Stop the oscillator after the tune duration
            const stopTime = startTime + notesArray.length * delay;
            setTimeout(() => {
                osc.stop();
            }, (stopTime - this.audioContext.currentTime) * 1000);
        });
    }

    // Get frequency for a note
    getFrequency(note) {
        const frequencies = {
            'g': 392.0,
            'a': 440.0,
            'b': 493.88,
            'c': 523.25,
            'd': 587.33,
            'e': 659.25,
            'f': 698.46,
            'G': 783.99,
            'A': 880.0,
            'B': 987.77,
            'C': 1046.5,
            'D': 1174.66,
            'E': 1318.51
        };
        return frequencies[note] || 0;
    }



    // Stop playing
    stopTune() {
        this.isPlaying = false;
        const playButton = document.getElementById('playTune');
        const fastButton = document.getElementById('playTuneFast');
        
        playButton.classList.remove('playing');
        fastButton.classList.remove('playing');
        playButton.textContent = window.languageManager.getText('playTuneBtn');
        fastButton.textContent = window.languageManager.getText('playTuneFastBtn');
    }

    // Get current volume
    getVolume() {
        return parseInt(document.getElementById('volume').value);
    }

    // Check if scheduled fast playback is enabled
    isScheduledFastPlayEnabled() {
        return document.getElementById('scheduledFastPlay').checked;
    }

    // Update volume display
    updateVolume(value) {
        document.getElementById('volumeValue').textContent = value + '%';
    }

    // Handle schedule type change
    onScheduleTypeChange(type) {
        const customSection = document.getElementById('customTimeSection');
        const minutesLaterSection = document.getElementById('minutesLaterSection');
        
        // Hide all sections first
        customSection.style.display = 'none';
        minutesLaterSection.style.display = 'none';
        
        // Show relevant section
        if (type === 'custom') {
            customSection.style.display = 'block';
        } else if (type === 'minutesLater') {
            minutesLaterSection.style.display = 'block';
        }
    }

    // Start scheduling
    startSchedule() {
        if (!this.currentTune) {
            this.showNotification(window.languageManager.getText('noTuneLoaded'), 'error');
            return;
        }

        const scheduleType = document.querySelector('input[name="schedule"]:checked').value;
        
        if (scheduleType === 'custom') {
            const hour = parseInt(document.getElementById('customHour').value);
            const minute = parseInt(document.getElementById('customMinute').value);
            
            if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
                this.showNotification(window.languageManager.getText('invalidTimeValues'), 'error');
                return;
            }
            
            this.startCustomSchedule(hour, minute);
        } else if (scheduleType === 'minutesLater') {
            const minutes = parseInt(document.getElementById('minutesLaterInput').value);
            
            if (minutes < 1 || minutes > 1440) {
                this.showNotification(window.languageManager.getText('invalidTimeValues'), 'error');
                return;
            }
            
            this.startMinutesLaterSchedule(minutes);
        } else {
            this.startHourlySchedule();
        }

        document.getElementById('scheduleStatus').textContent = window.languageManager.getText('runningStatus');
        this.showNotification(window.languageManager.getText('scheduleStarted'), 'success');
    }

    // Start hourly schedule
    startHourlySchedule() {
        this.stopSchedule();
        
        this.scheduleInterval = setInterval(() => {
            const now = new Date();
            if (now.getMinutes() === 0) {
                this.playScheduledTune();
            }
        }, 60000); // Check every minute
        
        this.updateNextPlayTime();
    }

    // Start custom schedule
    startCustomSchedule(hour, minute) {
        this.stopSchedule();
        
        this.scheduleInterval = setInterval(() => {
            const now = new Date();
            if (now.getHours() === hour && now.getMinutes() === minute) {
                this.playScheduledTune();
            }
        }, 60000); // Check every minute
        
        this.updateNextPlayTime(hour, minute);
    }

    // Start minutes later schedule
    startMinutesLaterSchedule(minutes) {
        this.stopSchedule();
        
        const now = new Date();
        this.nextPlayTime = new Date(now.getTime() + minutes * 60000);
        
        this.scheduleInterval = setInterval(() => {
            const currentTime = new Date();
            if (currentTime >= this.nextPlayTime) {
                this.playScheduledTune();
                this.stopSchedule(); // Stop after playing once
            }
        }, 1000); // Check every second for more accurate countdown
        
        this.updateNextPlayTimeFromDate(this.nextPlayTime);
        this.startCountdown();
    }

    // Stop scheduling
    stopSchedule() {
        if (this.scheduleInterval) {
            clearInterval(this.scheduleInterval);
            this.scheduleInterval = null;
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        this.nextPlayTime = null;
        document.getElementById('scheduleStatus').textContent = window.languageManager.getText('stoppedStatus');
        document.getElementById('nextPlay').textContent = '-';
        document.getElementById('timeLeft').textContent = '-';
    }

    // Update next play time display
    updateNextPlayTime(hour, minute) {
        const now = new Date();
        let nextPlay = new Date();
        
        if (hour !== undefined && minute !== undefined) {
            nextPlay.setHours(hour, minute, 0, 0);
            if (nextPlay <= now) {
                nextPlay.setDate(nextPlay.getDate() + 1);
            }
        } else {
            // Hourly schedule
            nextPlay.setMinutes(0, 0, 0);
            if (nextPlay <= now) {
                nextPlay.setHours(nextPlay.getHours() + 1);
            }
        }
        
        this.nextPlayTime = nextPlay;
        document.getElementById('nextPlay').textContent = nextPlay.toLocaleTimeString();
        this.startCountdown();
    }

    // Update next play time from date object
    updateNextPlayTimeFromDate(date) {
        this.nextPlayTime = date;
        document.getElementById('nextPlay').textContent = date.toLocaleTimeString();
    }

    // Start countdown timer
    startCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        this.countdownInterval = setInterval(() => {
            if (this.nextPlayTime) {
                const now = new Date();
                const timeDiff = this.nextPlayTime.getTime() - now.getTime();
                
                if (timeDiff <= 0) {
                    document.getElementById('timeLeft').textContent = window.languageManager.getText('countdownNow');
                    return;
                }
                
                const minutes = Math.floor(timeDiff / 60000);
                const seconds = Math.floor((timeDiff % 60000) / 1000);
                
                if (minutes > 0) {
                    document.getElementById('timeLeft').textContent = `${minutes}m ${seconds}s`;
                } else {
                    document.getElementById('timeLeft').textContent = `${seconds}s`;
                }
            }
        }, 1000);
    }

    // Add to recent plays
    addRecentPlay() {
        const playEntry = {
            time: new Date().toLocaleTimeString(),
            tune: this.currentTune
        };
        
        this.recentPlays.unshift(playEntry);
        if (this.recentPlays.length > 10) {
            this.recentPlays.pop();
        }
        
        this.updateRecentPlays();
        this.saveToLocalStorage();
    }

    // Update recent plays display
    updateRecentPlays() {
        const container = document.getElementById('recentPlays');
        
        if (this.recentPlays.length === 0) {
            container.innerHTML = `<p class="no-plays">${window.languageManager.getText('noPlaysYet')}</p>`;
            return;
        }
        
        container.innerHTML = this.recentPlays.map(play => `
            <div class="play-entry">
                <div class="time">${play.time}</div>
                <div class="tune">${play.tune}</div>
            </div>
        `).join('');
    }

    // Update status display
    updateStatus() {
        if (this.currentTune) {
            document.getElementById('currentTune').textContent = this.currentTune;
        } else {
            document.getElementById('currentTune').textContent = window.languageManager.getText('noneLoaded');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        // Set background color based on type
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            info: '#667eea'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Save to localStorage
    saveToLocalStorage() {
        const data = {
            currentTune: this.currentTune,
            recentPlays: this.recentPlays,
            volume: this.getVolume(),
            scheduledFastPlay: document.getElementById('scheduledFastPlay').checked
        };
        localStorage.setItem('acTownTunePlayer', JSON.stringify(data));
    }

    // Load from localStorage
    loadFromLocalStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('acTownTunePlayer'));
            if (data) {
                if (data.currentTune) {
                    this.setTuneCode(data.currentTune);
                }
                if (data.recentPlays) {
                    this.recentPlays = data.recentPlays;
                    this.updateRecentPlays();
                }
                if (data.volume) {
                    document.getElementById('volume').value = data.volume;
                    this.updateVolume(data.volume);
                }
                if (data.scheduledFastPlay !== undefined) {
                    document.getElementById('scheduledFastPlay').checked = data.scheduledFastPlay;
                }
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ACTownTunePlayer();
}); 
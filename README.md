# 🎵 Animal Crossing Town Tune Player

A beautiful web application that plays your custom Animal Crossing town tunes at scheduled times! Perfect for creating a nostalgic atmosphere or just enjoying your favorite tunes throughout the day.

## ✨ Features

- **🎼 Custom Tune Support**: Load tunes directly from [AC Tune Maker](https://ac-tune-maker.aikats.us/) URLs
- **⏰ Flexible Scheduling**: Play tunes every hour or at custom times
- **🎮 Playback Controls**: Preview tunes with play/stop controls and volume adjustment
- **📝 Recent Plays**: Track when your tunes were last played
- **💾 Persistent Storage**: Your settings and recent plays are saved locally
- **📱 Responsive Design**: Works great on desktop and mobile devices
- **🎨 Beautiful UI**: Modern, intuitive interface with smooth animations

## 🚀 How to Use

### 1. Getting Your Town Tune

1. Visit [AC Tune Maker](https://ac-tune-maker.aikats.us/)
2. Create your custom town tune using the visual editor
3. Copy the URL from your browser (it will look like: `https://ac-tune-maker.aikats.us/#/tune/CECGfGBDGzqzc--z/AC%20Tune%20Maker`)

### 2. Loading Your Tune

1. Open the Town Tune Player webpage
2. Paste your AC Tune Maker URL into the "Town Tune URL" field
3. Click "Load Tune" to extract and load your tune
4. The tune code will appear in the "Town Tune Code" field
5. Give your tune a name (optional)

### 3. Testing Your Tune

1. Click the "▶️ Play Tune" button to preview your tune
2. Adjust the volume using the slider
3. Use the "⏹️ Stop" button if you want to stop playback early

### 4. Setting Up Scheduling

#### Hourly Schedule
- Select "Play every hour" option
- Click "🚀 Start Schedule"
- Your tune will play at the top of every hour (1:00, 2:00, 3:00, etc.)

#### Custom Time Schedule
- Select "Custom time" option
- Set your desired hour (0-23) and minute (0-59)
- Click "🚀 Start Schedule"
- Your tune will play at the specified time each day

### 5. Managing Your Schedule

- **Status**: Check the current schedule status and next play time
- **Recent Plays**: View a history of when your tunes were played
- **Stop Schedule**: Click "⏹️ Stop Schedule" to stop automatic playback

## 🎵 Tune Code Format

The application supports the standard AC Tune Maker format where each character pair represents a note and duration:

- **Notes**: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
- **Durations**: 
  - `z` = 16th note (0.25 seconds)
  - `q` = 8th note (0.5 seconds)
  - `h` = quarter note (1.0 seconds)
  - `w` = half note (2.0 seconds)

Example: `CECGfGBDGzqzc--z` plays a sequence of notes with varying durations.

## 🔧 Technical Details

- **Audio Engine**: Uses Web Audio API for high-quality sound generation
- **Storage**: Local browser storage for persistent settings
- **Scheduling**: Precise timing using JavaScript intervals
- **Compatibility**: Works in all modern browsers

## 📁 File Structure

```
ac-town-tune-player/
├── index.html      # Main webpage
├── styles.css      # Styling and animations
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 🎯 Tips for Best Experience

1. **Keep the browser tab open** for scheduled playback to work
2. **Allow audio permissions** when prompted by your browser
3. **Test your tune first** before setting up scheduling
4. **Use headphones** for the best audio experience
5. **Check the status section** to confirm your schedule is running

## 🐛 Troubleshooting

### Tune won't play?
- Make sure you have a valid tune loaded
- Check that your browser supports Web Audio API
- Try refreshing the page and loading the tune again

### Schedule not working?
- Ensure the browser tab is open and active
- Check that the schedule status shows "Running"
- Verify the next play time is correct

### Audio too quiet/loud?
- Use the volume slider to adjust playback volume
- Check your system volume settings

## 🎨 Customization

The application saves your preferences locally, including:
- Current tune code
- Tune name
- Volume setting
- Recent play history

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

## 🎵 Enjoy Your Town Tunes!

Create the perfect Animal Crossing atmosphere with your custom town tunes playing at just the right moments. Whether it's every hour on the hour or at your favorite time of day, let the music bring back those peaceful island vibes! 🌴🎵 
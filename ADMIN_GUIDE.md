# Admin Upload System Guide

## 🔐 Admin Access

**Admin Password:** `enoch2026`

The admin password is stored in `/src/app/components/AdminAuth.tsx` on line 11.

## 📤 How to Upload Content

### Step 1: Login as Admin

1. Click on any of the colored upload buttons in the bottom-right corner:
   - **Purple Button (Music)** - Upload music tracks
   - **Red Button (Movies)** - Upload movies
   - **Orange Button (Software)** - Upload DJ software

2. If not logged in, you'll see a login modal
3. Enter the password: `enoch2026`
4. Click "Login"

### Step 2: Upload Music 🎵

**Max File Size:** 5GB  
**Accepted Formats:** MP3, WAV, and other audio formats  
**Storage:** Public (free downloads for all visitors)

**Fields:**
- **Audio File** (required) - Select your music file
- **Track Title** (required) - e.g., "PRIMERCE FRESH HITS #2026"
- **Artist** - Default: "DJ ENOCH PRO"
- **Genre** - e.g., "Mix", "Dance", "Hip Hop"
- **Duration** - e.g., "45:30"
- **Release Date** - Auto-filled to today

**Upload Progress:**
- See real-time upload percentage
- Success message appears when complete
- Page auto-refreshes to show new track

**Downloaded From:** Free Downloads section

---

### Step 3: Upload Movies 🎬

**Max File Size:** 5GB  
**Accepted Formats:** MP4, MKV, AVI, and other video formats  
**Storage:** Private (can be set to paid in future)

**Fields:**
- **Video File** (required) - Select your movie file
- **Movie Title** (required) - e.g., "Action Movie 2026"
- **Description** - Brief description of the movie
- **Genre** - e.g., "Action", "Comedy", "Drama"
- **Quality** - Select from 480p, 720p, 1080p, 4K
- **Duration** - e.g., "2h 15m"
- **Release Year** - e.g., "2026"

**Upload Progress:**
- See real-time upload percentage
- Success message appears when complete
- Page auto-refreshes to show new movie

**Downloaded From:** Movies section (appears only if movies are uploaded)

---

### Step 4: Upload Software 💻

**Max File Size:** 5GB  
**Accepted Formats:** EXE, ZIP, RAR, and other formats  
**Storage:** Private (for paid downloads)

**Fields:**
- **Software File** (required) - Select your software file
- **Software Name** (required) - e.g., "DJ Software Pro 2026"
- **Description** - Brief description of the software
- **Version** - e.g., "1.0", "2.5"
- **Platform** - Windows, Mac, Linux, Android, iOS, Cross-platform
- **Category** - e.g., "DJ Software"
- **Price (UGX)** - e.g., "15000" (or "0" for free)

**Upload Progress:**
- See real-time upload percentage
- Success message appears when complete
- Page auto-refreshes to show new software

**Downloaded From:** Software section (appears only if software is uploaded)

---

## 📥 Download Sections

### Music Downloads
- **Location:** "Free Music Downloads" section
- **Features:** 
  - Real audio preview with play/pause
  - Progress bar while playing
  - One-click free download
  - Track metadata display

### Movies Downloads
- **Location:** "Free Movies" section (auto-appears when movies uploaded)
- **Features:**
  - Movie poster placeholder
  - Genre, quality, duration info
  - One-click download button

### Software Downloads
- **Location:** "DJ Software & Tools" section (auto-appears when software uploaded)
- **Features:**
  - Platform compatibility display
  - Version information
  - Price display (free or paid)
  - One-click download button

---

## 🔧 Technical Details

### Backend Storage
All uploads are stored in Supabase Storage with separate buckets:
- **Music:** `make-98d801c7-music` (public bucket)
- **Movies:** `make-98d801c7-movies` (private bucket)
- **Software:** `make-98d801c7-software` (private bucket)

### Upload Endpoints
- Music: `POST /make-server-98d801c7/music/upload`
- Movies: `POST /make-server-98d801c7/movies/upload`
- Software: `POST /make-server-98d801c7/software/upload`

### List Endpoints
- Music: `GET /make-server-98d801c7/music/tracks`
- Movies: `GET /make-server-98d801c7/movies/list`
- Software: `GET /make-server-98d801c7/software/list`

### File Size Limits
All three content types have a **5GB maximum file size** limit per upload.

---

## 🚪 Logout

Click the **"Logout Admin"** button in the top-right corner (red button) to log out.

The session is stored in `sessionStorage` and will automatically expire when you close the browser.

---

## 🔒 Security Notes

1. **Password Storage:** The admin password is currently hardcoded. In production, this should be an environment variable.
2. **Session Storage:** Admin login uses `sessionStorage` - secure but expires on browser close.
3. **Public vs Private:** Music is public (free), Movies & Software are private (can be monetized).

---

## 💡 Tips

- **Large Files:** For files approaching 5GB, ensure stable internet connection
- **Upload Progress:** Don't close the upload modal while uploading
- **Browser Console:** Check console (F12) for detailed upload logs
- **File Names:** Avoid special characters in file names for best compatibility

---

## 📞 Support

If you encounter any issues:
1. Check browser console (F12) for error messages
2. Verify file size is under 5GB
3. Ensure file format is supported
4. Try refreshing the page and logging in again

Contact: primerceug@gmail.com | +256747816444

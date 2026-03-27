(function() {
    if (document.getElementById('mm_root_container')) return;

    const MM_STORAGE = 'mm_player_data';
    const MM_POSITION_KEY = 'mm_player_position';
    const container = document.createElement('div');
    container.id = 'mm_root_container';
    
    const iconLink = document.createElement('link');
    iconLink.rel = 'stylesheet';
    iconLink.href = 'https://npm.elemecdn.com/font-awesome@4.7.0/css/font-awesome.min.css';
    document.head.appendChild(iconLink);

    const mmStyle = document.createElement('style');
    mmStyle.textContent = `
        #mm_root_container { 
            position: fixed; 
            left: 20px; 
            bottom: 20px; 
            z-index: 9999; 
            font-family: system-ui, -apple-system, sans-serif;
        }
        .mm_fab_btn { 
            width: 56px; 
            height: 56px; 
            background: #f5f5f5; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: #333; 
            cursor: pointer; 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); 
            transition: all 0.3s ease; 
            position: relative; 
            z-index: 10001; 
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.08);
            touch-action: none;
            user-select: none;
        }
        .mm_fab_btn:hover { 
            transform: scale(1.08); 
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2); 
            background: #f0f0f0;
        }
        .mm_fab_btn img { 
            width: 100%; 
            height: 100%; 
            border-radius: 50%; 
            object-fit: cover; 
            display: none; 
        }
        .mm_fab_btn i { 
            position: absolute; 
            font-size: 22px; 
            transition: opacity 0.3s;
        }
        .mm_fab_btn.mm_active img { 
            display: block; 
            animation: mm_rotate 15s linear infinite; 
        }
        .mm_fab_btn.mm_active i { 
            opacity: 0; 
        }
        
        .mm_player_panel { 
            position: absolute; 
            bottom: 70px; 
            left: 0; 
            width: 320px; 
            background: rgba(255, 255, 255, 0.98); 
            backdrop-filter: blur(10px); 
            border-radius: 20px; 
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); 
            overflow: hidden; 
            transform: scale(0.9); 
            transform-origin: bottom left; 
            opacity: 0; 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            visibility: hidden; 
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 10000;
        }
        #mm_root_container.mm_expanded .mm_player_panel { 
            transform: scale(1); 
            opacity: 1; 
            visibility: visible; 
        }
        
        .mm_header_area { 
            padding: 18px; 
            display: flex; 
            align-items: center; 
            gap: 15px; 
            background: rgba(248, 248, 248, 0.8); 
            border-bottom: 1px solid rgba(0, 0, 0, 0.05); 
        }
        .mm_cover_box { 
            width: 55px; 
            height: 55px; 
            border-radius: 12px; 
            background: #e0e0e0; 
            background-size: cover; 
            flex-shrink: 0; 
            overflow: hidden; 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); 
        }
        .mm_cover_box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: none;
        }
        .mm_cover_box.mm_loaded img {
            display: block;
        }
        .mm_info_box { 
            flex: 1; 
            overflow: hidden; 
        }
        .mm_song_title { 
            font-size: 15px; 
            font-weight: 600; 
            color: #222; 
            margin-bottom: 4px; 
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis; 
        }
        .mm_artist_name { 
            font-size: 13px; 
            color: #666; 
        }
        
        .mm_control_area { 
            padding: 18px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 20px; 
        }
        .mm_ctrl_btn { 
            background: none; 
            border: none; 
            cursor: pointer; 
            color: #555; 
            font-size: 18px; 
            transition: all 0.2s ease; 
            width: 40px; 
            height: 40px; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
        }
        .mm_ctrl_btn:hover { 
            color: #222; 
            background: rgba(0, 0, 0, 0.05); 
        }
        .mm_play_btn { 
            width: 48px; 
            height: 48px; 
            background: #333; 
            color: #fff !important; 
            font-size: 16px; 
        }
        .mm_play_btn:hover { 
            background: #444; 
            transform: scale(1.05); 
        }
        
        .mm_progress_area { 
            padding: 0 18px 18px; 
        }
        .mm_time_display {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #888;
            margin-bottom: 8px;
        }
        .mm_progress_bar { 
            width: 100%; 
            height: 4px; 
            background: rgba(0, 0, 0, 0.1); 
            border-radius: 2px; 
            cursor: pointer; 
            position: relative; 
            overflow: hidden; 
        }
        .mm_progress_fill { 
            height: 100%; 
            background: #333; 
            border-radius: 2px; 
            width: 0%; 
            transition: width 0.1s linear; 
        }
        
        .mm_search_area { 
            padding: 12px 18px; 
            border-top: 1px solid rgba(0, 0, 0, 0.05); 
            display: flex; 
            gap: 8px; 
        }
        .mm_search_input { 
            flex: 1; 
            border: 1px solid rgba(0, 0, 0, 0.1); 
            border-radius: 15px; 
            padding: 8px 16px; 
            font-size: 13px; 
            outline: none; 
            transition: all 0.3s ease; 
        }
        .mm_search_input:focus { 
            border-color: #888; 
            box-shadow: 0 0 0 2px rgba(136, 136, 136, 0.1); 
        }
        .mm_search_btn {
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: rgba(136, 136, 136, 0.1);
            border: none;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .mm_search_btn:hover {
            background: rgba(136, 136, 136, 0.2);
        }
        
        .mm_song_list { 
            max-height: 200px; 
            overflow-y: auto; 
            background: #fff; 
            border-top: 1px solid rgba(0, 0, 0, 0.05); 
            display: none; 
        }
        .mm_song_list.mm_visible { 
            display: block; 
        }
        .mm_list_item { 
            padding: 12px 18px; 
            font-size: 13px; 
            color: #333; 
            border-bottom: 1px solid rgba(0, 0, 0, 0.05); 
            cursor: pointer; 
            transition: all 0.2s ease; 
        }
        .mm_list_item:hover { 
            background: rgba(136, 136, 136, 0.08); 
        }
        .mm_list_item.mm_playing { 
            background: rgba(136, 136, 136, 0.12); 
            color: #333; 
            font-weight: 500; 
        }
        
        @keyframes mm_rotate { 
            from {transform: rotate(0);} 
            to {transform: rotate(360deg);} 
        }

        .mm_loading_overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: #666;
            z-index: 10;
        }
    `;
    document.head.appendChild(mmStyle);

    container.innerHTML = `
        <div class="mm_fab_btn" id="mm_fab_btn"><i class="fa fa-music"></i><img id="mm_fab_image"></div>
        <div class="mm_player_panel">
            <div class="mm_loading_overlay" id="mm_loading">正在加载播放列表...</div>
            <div class="mm_header_area">
                <div class="mm_cover_box" id="mm_cover_box">
                    <img id="mm_cover_image">
                </div>
                <div class="mm_info_box">
                    <div class="mm_song_title" id="mm_song_title">Music Player</div>
                    <div class="mm_artist_name" id="mm_artist_name">Loading...</div>
                </div>
            </div>
            <div class="mm_progress_area">
                <div class="mm_time_display">
                    <span id="mm_current_time">0:00</span>
                    <span id="mm_total_time">0:00</span>
                </div>
                <div class="mm_progress_bar" id="mm_progress_bar"><div class="mm_progress_fill" id="mm_progress_fill"></div></div>
            </div>
            <div class="mm_control_area">
                <button class="mm_ctrl_btn" id="mm_prev_btn"><i class="fa fa-step-backward"></i></button>
                <button class="mm_ctrl_btn mm_play_btn" id="mm_play_btn"><i class="fa fa-play"></i></button>
                <button class="mm_ctrl_btn" id="mm_next_btn"><i class="fa fa-step-forward"></i></button>
                <button class="mm_ctrl_btn" id="mm_list_toggle"><i class="fa fa-list"></i></button>
            </div>
            <div class="mm_search_area">
                <input type="text" class="mm_search_input" id="mm_search_input" placeholder="Search songs...">
                <button class="mm_search_btn" id="mm_search_btn"><i class="fa fa-search"></i></button>
            </div>
            <div class="mm_song_list" id="mm_song_list"></div>
        </div>
        <audio id="mm_audio_player"></audio>
    `;
    document.body.appendChild(container);

    const mmAudio = document.getElementById('mm_audio_player');
    const mmCoverImg = document.getElementById('mm_cover_image');
    const mmFabImg = document.getElementById('mm_fab_image');
    let mmPlaylist = [];
    let mmCurrent = 0;
    // No playlist ID needed for iTunes; we'll fetch a default search
    let mmAutoPlay = false;
    let mmSavedState = null;
    
    // 拖动相关变量
    let mmIsDragging = false;
    let mmDragStartX = 0;
    let mmDragStartY = 0;
    let mmStartLeft = 0;
    let mmStartBottom = 0;
    let mmDragTimeout = null;

    // Default cover image (a generic music note image)
    const mmDefaultCover = 'https://is5-ssl.mzstatic.com/image/thumb/Music114/v4/6d/5c/6d/6d5c6d5a-5c5c-5c5c-5c5c-5c5c5c5c5c5c/source/100x100bb.jpg';

    const mmSaveData = () => {
        if (mmPlaylist.length > 0 && mmCurrent < mmPlaylist.length) {
            const data = {
                songId: mmPlaylist[mmCurrent].id,
                currentTime: mmAudio.currentTime,
                isPlaying: !mmAudio.paused,
                timestamp: Date.now()
            };
            localStorage.setItem(MM_STORAGE, JSON.stringify(data));
        }
    };

    const mmLoadData = () => {
        try {
            const saved = localStorage.getItem(MM_STORAGE);
            if (saved) {
                mmSavedState = JSON.parse(saved);
                if (Date.now() - mmSavedState.timestamp > 30000) {
                    localStorage.removeItem(MM_STORAGE);
                    mmSavedState = null;
                }
            }
        } catch (e) {}
    };

    const mmFormatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Convert iTunes track to our internal format
    const mmMapITunesTrack = (track) => ({
        id: track.trackId,
        name: track.trackName,
        artists: [{ name: track.artistName }],
        cover: track.artworkUrl100,
        previewUrl: track.previewUrl
    });

    const mmUpdateUI = (song) => {
        document.getElementById('mm_song_title').textContent = song.name;
        document.getElementById('mm_artist_name').textContent = song.artists[0].name;
        // Use the cover URL directly (iTunes provides a 100x100 image)
        const picUrl = song.cover || mmDefaultCover;
        
        const mmLoadImg = (url, element) => {
            const img = new Image();
            img.onload = () => {
                element.src = url;
                element.onerror = null;
            };
            img.onerror = () => {
                element.src = mmDefaultCover;
            };
            img.src = url;
        };
        
        mmLoadImg(picUrl, mmCoverImg);
        mmLoadImg(picUrl, mmFabImg);
        document.getElementById('mm_cover_box').classList.add('mm_loaded');
    };

    const mmShowPlayer = () => {
        container.style.display = 'block';
        document.getElementById('mm_loading').style.display = 'none';
    };

    const mmRestorePlay = () => {
        if (mmSavedState && mmPlaylist.length > 0) {
            const savedIdx = mmPlaylist.findIndex(song => song.id === mmSavedState.songId);
            if (savedIdx !== -1) {
                mmCurrent = savedIdx;
                const song = mmPlaylist[mmCurrent];
                mmUpdateUI(song);
                mmAudio.src = song.previewUrl;  // Use the preview URL directly
                
                mmAudio.onloadeddata = () => {
                    mmAudio.currentTime = Math.min(mmSavedState.currentTime, mmAudio.duration - 1);
                    if (mmSavedState.isPlaying) {
                        const playPromise = mmAudio.play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                mmAutoPlay = true;
                                mmShowPlayer();
                                document.getElementById('mm_fab_btn').classList.add('mm_active');
                                document.getElementById('mm_play_btn').innerHTML = '<i class="fa fa-pause"></i>';
                            }).catch(() => {});
                        }
                    } else {
                        mmShowPlayer();
                        document.getElementById('mm_play_btn').innerHTML = '<i class="fa fa-play"></i>';
                    }
                    mmAudio.onloadeddata = null;
                };
                return true;
            }
        }
        return false;
    };

    const mmStartPlay = (index = 0) => {
        if (!mmPlaylist.length || index >= mmPlaylist.length) return;
        
        mmCurrent = index;
        const song = mmPlaylist[mmCurrent];
        mmUpdateUI(song);
        mmAudio.src = song.previewUrl;
        
        const playPromise = mmAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                mmAutoPlay = true;
                mmShowPlayer();
                document.getElementById('mm_fab_btn').classList.add('mm_active');
                document.getElementById('mm_play_btn').innerHTML = '<i class="fa fa-pause"></i>';
            }).catch(() => {
                mmShowPlayer();
                document.getElementById('mm_play_btn').innerHTML = '<i class="fa fa-play"></i>';
            });
        }
    };

    const mmUserInteraction = () => {
        if (!mmAutoPlay && mmAudio.paused) {
            mmAudio.play().then(() => {
                mmAutoPlay = true;
                document.getElementById('mm_fab_btn').classList.add('mm_active');
                document.getElementById('mm_play_btn').innerHTML = '<i class="fa fa-pause"></i>';
            });
        }
    };

    const mmLoadPosition = () => {
        try {
            const pos = localStorage.getItem(MM_POSITION_KEY);
            if (pos) {
                const { left, bottom } = JSON.parse(pos);
                container.style.left = left + 'px';
                container.style.bottom = bottom + 'px';
            }
        } catch (e) {}
    };

    const mmSavePosition = () => {
        const rect = container.getBoundingClientRect();
        const pos = {
            left: rect.left,
            bottom: window.innerHeight - rect.bottom
        };
        localStorage.setItem(MM_POSITION_KEY, JSON.stringify(pos));
    };

    const mmStartDrag = (e) => {
        // 只允许在FAB按钮上拖动
        const fabBtn = document.getElementById('mm_fab_btn');
        if (!fabBtn.contains(e.target)) return;
        
        mmIsDragging = true;
        const rect = container.getBoundingClientRect();
        mmStartLeft = rect.left;
        mmStartBottom = window.innerHeight - rect.bottom;
        
        if (e.type.includes('mouse')) {
            mmDragStartX = e.clientX;
            mmDragStartY = e.clientY;
        } else {
            mmDragStartX = e.touches[0].clientX;
            mmDragStartY = e.touches[0].clientY;
        }
        
        // 清除之前的超时
        if (mmDragTimeout) {
            clearTimeout(mmDragTimeout);
        }
        
        // 设置超时，如果拖动时间很短就认为是点击
        mmDragTimeout = setTimeout(() => {
            if (mmIsDragging) {
                container.style.cursor = 'grabbing';
                fabBtn.style.cursor = 'grabbing';
            }
        }, 150);
        
        e.preventDefault();
        e.stopPropagation();
    };

    const mmDoDrag = (e) => {
        if (!mmIsDragging) return;
        
        let clientX, clientY;
        if (e.type.includes('mouse')) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        
        const deltaX = clientX - mmDragStartX;
        const deltaY = mmDragStartY - clientY;
        
        const newLeft = Math.max(10, Math.min(window.innerWidth - 70, mmStartLeft + deltaX));
        const newBottom = Math.max(10, Math.min(window.innerHeight - 70, mmStartBottom + deltaY));
        
        container.style.left = newLeft + 'px';
        container.style.bottom = newBottom + 'px';
        
        e.preventDefault();
        e.stopPropagation();
    };

    const mmStopDrag = (e) => {
        if (!mmIsDragging) return;
        
        // 清除超时
        if (mmDragTimeout) {
            clearTimeout(mmDragTimeout);
            mmDragTimeout = null;
        }
        
        container.style.cursor = '';
        document.getElementById('mm_fab_btn').style.cursor = '';
        
        // 判断是否为点击（拖动距离很小）
        let clientX, clientY;
        if (e.type.includes('mouse')) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e.changedTouches && e.changedTouches[0]) {
            clientX = e.changedTouches[0].clientX;
            clientY = e.changedTouches[0].clientY;
        }
        
        const deltaX = Math.abs(clientX - mmDragStartX);
        const deltaY = Math.abs(clientY - mmDragStartY);
        
        // 如果拖动距离小于5px，认为是点击
        if (deltaX < 5 && deltaY < 5) {
            // 这是点击事件，切换面板
            container.classList.toggle('mm_expanded');
        } else {
            // 这是拖动事件，保存位置
            mmSavePosition();
        }
        
        mmIsDragging = false;
        e.preventDefault();
        e.stopPropagation();
    };

    document.getElementById('mm_fab_btn').onclick = (e) => {
        // 点击事件现在在 mmStopDrag 中处理
    };

    document.getElementById('mm_play_btn').onclick = () => {
        if (mmAudio.paused) {
            mmAudio.play().then(() => {
                document.getElementById('mm_play_btn').innerHTML = '<i class="fa fa-pause"></i>';
                document.getElementById('mm_fab_btn').classList.add('mm_active');
            });
        } else {
            mmAudio.pause();
            document.getElementById('mm_play_btn').innerHTML = '<i class="fa fa-play"></i>';
            document.getElementById('mm_fab_btn').classList.remove('mm_active');
        }
        mmSaveData();
    };

    document.getElementById('mm_next_btn').onclick = () => {
        mmCurrent = (mmCurrent + 1) % mmPlaylist.length;
        mmStartPlay(mmCurrent);
        mmSaveData();
    };
    
    document.getElementById('mm_prev_btn').onclick = () => {
        mmCurrent = (mmCurrent - 1 + mmPlaylist.length) % mmPlaylist.length;
        mmStartPlay(mmCurrent);
        mmSaveData();
    };

    document.getElementById('mm_progress_bar').onclick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const p = (e.clientX - rect.left) / rect.width;
        mmAudio.currentTime = p * mmAudio.duration;
        mmSaveData();
    };

    mmAudio.ontimeupdate = () => {
        const percent = (mmAudio.currentTime / mmAudio.duration) * 100 || 0;
        document.getElementById('mm_progress_fill').style.width = percent + '%';
        document.getElementById('mm_current_time').textContent = mmFormatTime(mmAudio.currentTime);
        document.getElementById('mm_total_time').textContent = mmFormatTime(mmAudio.duration || 0);
        mmSaveData();
    };

    mmAudio.onended = () => {
        mmCurrent = (mmCurrent + 1) % mmPlaylist.length;
        mmStartPlay(mmCurrent);
        mmSaveData();
    };

    mmAudio.onloadedmetadata = () => {
        document.getElementById('mm_total_time').textContent = mmFormatTime(mmAudio.duration);
    };

    document.getElementById('mm_list_toggle').onclick = () => {
        const list = document.getElementById('mm_song_list');
        list.classList.toggle('mm_visible');
        if (list.classList.contains('mm_visible')) {
            list.innerHTML = mmPlaylist.map((s, i) => `
                <div class="mm_list_item ${i === mmCurrent ? 'mm_playing' : ''}" onclick="window.mmPlaySong(${i})">
                    ${s.name} - ${s.artists.map(a => a.name).join('/')}
                </div>
            `).join('');
        }
    };

    window.mmPlaySong = (i) => {
        mmCurrent = i;
        mmStartPlay(mmCurrent);
        mmSaveData();
    };

    const mmSearchSongs = () => {
        const query = document.getElementById('mm_search_input').value;
        if (!query) return;
        document.getElementById('mm_loading').style.display = 'flex';
        // Use iTunes Search API
        fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=20`)
            .then(r => r.json())
            .then(d => {
                // Map iTunes results to our format
                mmPlaylist = d.results.map(mmMapITunesTrack);
                document.getElementById('mm_song_list').classList.add('mm_visible');
                document.getElementById('mm_song_list').innerHTML = mmPlaylist.map((s, i) => `
                    <div class="mm_list_item ${i === mmCurrent ? 'mm_playing' : ''}" onclick="window.mmPlaySong(${i})">
                        ${s.name} - ${s.artists.map(a => a.name).join('/')}
                    </div>
                `).join('');
                document.getElementById('mm_loading').style.display = 'none';
                if (mmPlaylist.length > 0) {
                    mmCurrent = 0;
                    mmStartPlay(mmCurrent);
                    mmSaveData();
                }
            })
            .catch(() => {
                document.getElementById('mm_loading').style.display = 'none';
            });
    };

    document.getElementById('mm_search_btn').onclick = mmSearchSongs;
    document.getElementById('mm_search_input').onkeypress = (e) => e.key === 'Enter' && mmSearchSongs();

    // 只在FAB按钮上添加拖动事件
    const fabBtn = document.getElementById('mm_fab_btn');
    fabBtn.addEventListener('mousedown', mmStartDrag);
    fabBtn.addEventListener('touchstart', mmStartDrag);
    document.addEventListener('mousemove', mmDoDrag);
    document.addEventListener('touchmove', mmDoDrag);
    document.addEventListener('mouseup', mmStopDrag);
    document.addEventListener('touchend', mmStopDrag);

    // 防止点击面板外部时关闭面板
    document.addEventListener('mousedown', (e) => {
        const panel = document.querySelector('.mm_player_panel');
        const fab = document.getElementById('mm_fab_btn');
        if (panel && !panel.contains(e.target) && !fab.contains(e.target) && container.classList.contains('mm_expanded')) {
            container.classList.remove('mm_expanded');
        }
    });

    mmLoadData();
    mmLoadPosition();

    // Initial fetch: get a global list of popular songs (e.g., "top hits")
    fetch(`https://itunes.apple.com/search?term=top%20hits&media=music&entity=song&limit=20`)
        .then(r => r.json())
        .then(d => {
            mmPlaylist = d.results.map(mmMapITunesTrack);
            if (mmPlaylist.length > 0) {
                if (!mmRestorePlay()) {
                    mmStartPlay(0);
                }
                
                document.addEventListener('click', mmUserInteraction);
                document.addEventListener('touchstart', mmUserInteraction);
                
                setInterval(mmSaveData, 5000);
            } else {
                mmShowPlayer();
            }
        })
        .catch(() => {
            mmShowPlayer();
        });

    mmAudio.volume = 0.8;

    window.addEventListener('beforeunload', () => {
        mmSaveData();
        mmSavePosition();
    });
})();
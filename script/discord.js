// script/discord.js
const DISCORD_ID = "1069134460550905876";

document.addEventListener("DOMContentLoaded", () => {
    // Inject the widget HTML container
    const widgetContainerHTML = `
        <div id="discord-widget"></div>
        <div id="yt-player-container" style="position: absolute; width: 0; height: 0; pointer-events: none; opacity: 0;"></div>
    `;
    document.body.insertAdjacentHTML("beforeend", widgetContainerHTML);

    const widget = document.getElementById("discord-widget");
    let audioEnabled = false;
    let isExpanded = false; // Persistent state for the toggle
    let ytPlayer = null;
    let currentTrackId = null;
    let lastData = null; // Cache last data for manual re-renders

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const discordIcon = `
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="width: 14px; height: 14px; color: var(--accent-1);">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2498-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8745-.6177-1.2498a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
        </svg>
    `;

    const genericGameIcon = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; color: var(--accent-1);">
            <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
            <path d="M6 12h4"></path>
            <path d="M8 10v4"></path>
            <circle cx="15" cy="13" r="1"></circle>
            <circle cx="18" cy="11" r="1"></circle>
        </svg>
    `;

    const syncIcon = (active) => `
        <button class="dw-sync-btn ${active ? 'active' : ''}" title="${active ? 'Disconnect Audio' : 'Sync Music'}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        </button>
    `;

    const closeIcon = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;

    let ws = null;
    let heartbeatInterval = null;

    function connectLanyard() {
        ws = new WebSocket("wss://api.lanyard.rest/socket");

        ws.onopen = () => {
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.op === 1) {
                heartbeatInterval = setInterval(() => {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ op: 3 }));
                    }
                }, data.d.heartbeat_interval);
            }

            if (data.op === 0 && (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE")) {
                lastData = data.d;
                updateWidget(data.d);
            }
        };

        ws.onclose = () => {
            clearInterval(heartbeatInterval);
            setTimeout(connectLanyard, 5000); // Reconnect after 5s
        };
    }

    async function searchYoutube(query) {
        try {
            const response = await fetch(`/api/yt-search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data.videoId;
        } catch (error) {
            console.error("YT Search Error:", error);
            return null;
        }
    }

    function initYTPayer(videoId, startTime) {
        if (ytPlayer && ytPlayer.loadVideoById) {
            ytPlayer.loadVideoById({
                videoId: videoId,
                startSeconds: startTime
            });
            ytPlayer.playVideo();
            return;
        }

        if (window.YT && window.YT.Player) {
            ytPlayer = new window.YT.Player('yt-player-container', {
                height: '0',
                width: '0',
                videoId: videoId,
                playerVars: {
                    'autoplay': 1,
                    'controls': 0,
                    'start': Math.floor(startTime)
                },
                events: {
                    'onReady': (event) => {
                        event.target.playVideo();
                    }
                }
            });
        }
    }

    function updateWidget(d) {
        const spotify = d.spotify;
        const activities = d.activities || [];
        let primarySection = "";
        let stackedSections = [];

        // Handle Audio Sync (unchanged logic)
        if (spotify) {
            if (audioEnabled && spotify.track_id !== currentTrackId) {
                currentTrackId = spotify.track_id;
                const query = `${spotify.artist} ${spotify.song}`;
                const startTime = (Date.now() - spotify.timestamps.start) / 1000;
                searchYoutube(query).then(videoId => {
                    if (videoId) initYTPayer(videoId, startTime);
                });
            }
        } else {
            if (ytPlayer && ytPlayer.stopVideo) {
                ytPlayer.stopVideo();
                currentTrackId = null;
            }
        }

        // Build Sections
        const allSections = [];
        if (spotify) {
            allSections.push(`
                <div class="dw-section spotify-section" target="_blank" rel="noopener noreferrer">
                    <div class="discord-pfp">
                        <img src="${spotify.album_art_url}" class="spotify-art" alt="Album Art" />
                    </div>
                    <div class="discord-info">
                        <div class="dw-title">
                            <div class="spotify-eq">
                                <div class="spotify-eq-bar"></div>
                                <div class="spotify-eq-bar"></div>
                                <div class="spotify-eq-bar"></div>
                            </div>
                            Listening to Spotify
                        </div>
                        <div class="dw-sub">
                            <div class="dw-marquee-text">
                                <span>${spotify.song} — ${spotify.artist}</span>
                                <span class="dw-marquee-spacer"></span>
                                <span>${spotify.song} — ${spotify.artist}</span>
                            </div>
                        </div>
                    </div>
                    ${syncIcon(audioEnabled)}
                </div>
            `);
        }

        const otherActivities = activities.filter(a => a.type !== 4 && a.id !== "spotify:1");
        otherActivities.forEach(act => {
            let imageUrl = "https://cdn.discordapp.com/embed/avatars/0.png";
            if (act.assets && act.assets.large_image) {
                if (act.assets.large_image.startsWith("mp:external")) {
                    imageUrl = "https://media.discordapp.net/" + act.assets.large_image.replace("mp:", "");
                } else {
                    imageUrl = "https://cdn.discordapp.com/app-assets/" + act.application_id + "/" + act.assets.large_image + ".png";
                }
            }
            
            let actPrefix = "Playing";
            if (act.type === 1) actPrefix = "Streaming";
            if (act.type === 2) actPrefix = "Listening to";
            if (act.type === 3) actPrefix = "Watching";
            if (act.type === 5) actPrefix = "Competing in";

            allSections.push(`
                <div class="dw-section">
                    <div class="discord-pfp">
                        <img src="${imageUrl}" class="spotify-art" onerror="this.src='https://cdn.discordapp.com/embed/avatars/0.png'" alt="Activity Art" />
                    </div>
                    <div class="discord-info">
                        <div class="dw-title">
                            ${genericGameIcon}
                            ${actPrefix} ${act.name}
                        </div>
                        <div class="dw-sub">
                            <div class="dw-marquee-text">
                                <span>${act.details || act.state || 'Active now'}</span>
                                <span class="dw-marquee-spacer"></span>
                                <span>${act.details || act.state || 'Active now'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });

        if (allSections.length > 0) {
            primarySection = allSections[0];
            stackedSections = allSections.slice(1);

            // Determine Trigger/Collapsed Content
            let indicatorContent = discordIcon;
            if (spotify) {
                indicatorContent = `
                    <div class="spotify-eq trigger-eq">
                        <div class="spotify-eq-bar"></div>
                        <div class="spotify-eq-bar"></div>
                        <div class="spotify-eq-bar"></div>
                    </div>
                `;
            }

            widget.classList.add("active");
            widget.setAttribute("data-state", isExpanded ? "expanded" : "collapsed");

            widget.innerHTML = `
                <!-- Stacked cards behind -->
                <div class="dw-stacked-container">
                    ${stackedSections.join('')}
                </div>
                
                <!-- Main Morphing Box Content -->
                <div class="dw-main-content">
                    <div class="dw-activity-content">${primarySection}</div>
                    <div class="dw-collapsed-indicator">${indicatorContent}</div>
                </div>
            `;
        } else {
            widget.classList.remove("active");
            widget.innerHTML = "";
            if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo();
        }
    }

    // Event Delegation for Toggles
    widget.addEventListener('click', (e) => {
        const syncBtn = e.target.closest('.dw-sync-btn');
        if (syncBtn) {
            audioEnabled = !audioEnabled;
            if (lastData) updateWidget(lastData);
            return;
        }

        // Toggle Expansion on any click to the widget that isn't a functional button
        isExpanded = !isExpanded;
        if (lastData) updateWidget(lastData);
    });


    connectLanyard();
});

document.addEventListener("DOMContentLoaded", function (event) {

  const albumArt = document.getElementById('album_art');
  const audioPlayer = document.getElementById('audio_player');
  const albumName = document.getElementById('album_name');
  const artistName = document.getElementById('artist_name');
  const songName = document.getElementById('song_name');
  const audioSource = document.getElementById('audio_source');
  const previousButton = document.getElementById('previous_button');
  const nextButton = document.getElementById('next_button');
  const playPauseButton = document.getElementById('play_pause_button');
  const currentTime = document.getElementById('current_time');
  const duration = document.getElementById('duration');
  const progressBar = document.getElementById("progress_bar");
  const progress = document.getElementById("progress");
  const scrubber = document.getElementById("scrubber");
  const tracklist = document.getElementById("tracklist");
  const albumlist = document.getElementById("albumlist");

  let isPlaying = false;

  let currentAlbumIndex = 0;
  let currentSongIndex = 0;
  const root_music_path = '/static/music'
  const albums = [
    {
      artist: 'I, Aeronaut',
      album: 'Extended Hands, Posing in Bed',
      songs: [
        'Surrounding.mp3',
        'Falling From the North.mp3',
        'Dawn Transfer, I Let It Haunt Me.mp3',
        'For Cherry.mp3',
        'Old Home(Fold In).mp3',
        'Forgiving in Fractions.mp3',
        "You'll Never Lose Your Light.mp3",
        'To Horizons of Holy Moment Emptiness.mp3',
        'Back Light Sharp, Numb From the Room.mp3',
        'Last Flight, Memphis Belle.mp3',
        'A Loving Home, Together, Fading and Timeless.mp3',
      ],
    },
    {
      artist: 'I, Aeronaut',
      album: 'Opus Undone',
      songs: [
        'Common Room Decay.mp3',
        'Gordian.mp3',
        'Headphased Corner.mp3',
        'Nocturne Hymn.mp3',
        'Prism Thought.mp3',
        'Sigmund and Holly.mp3'
      ]
    },
  ];

  function updateAlbumArt() {
    let cover_path = [
      root_music_path,
      albums[currentAlbumIndex].artist,
      albums[currentAlbumIndex].album,
      'cover.jpg'
    ].join('/');

    albumArt.style.backgroundImage = "url(\"" + cover_path + "\")";
  }

  function updateInfo() {
    albumName.innerText = albums[currentAlbumIndex].album;
    artistName.innerText = albums[currentAlbumIndex].artist;
  }

  function updateAudioSource() {
    const songPath = [
      root_music_path,
      albums[currentAlbumIndex].artist,
      albums[currentAlbumIndex].album,
      albums[currentAlbumIndex].songs[currentSongIndex]
    ].join('/');

    audioSource.src = songPath;
    audioPlayer.load();
  }

  function playSong() {
    audioPlayer.play();
    playPauseButton.textContent = "Pause";
    isPlaying = true;
  }

  function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= albums[currentAlbumIndex].songs.length) {
      currentSongIndex = 0;
    }
    updateAudioSource();
    updateInfo();
    setTracklist();
    playSong();
  }
  
  function previousSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
      currentSongIndex = albums[currentAlbumIndex].songs.length - 1;
    }
    updateAudioSource();
    updateInfo();
    setTracklist();
    playSong();
  }

  function updateCurrentTime() {
    const time = Math.round(audioPlayer.currentTime);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    currentTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    const barWidth = progressBar.clientWidth;
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    scrubber.style.left = `${progressPercent * (barWidth / 100)}px`;
  }

  function updateDuration() {
    const time = Math.round(audioPlayer.duration);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    duration.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function playPauseSong() {
    if (isPlaying) {
      audioPlayer.pause();
      playPauseButton.textContent = "Play";
      isPlaying = false;
    } else {
      audioPlayer.play();
      playPauseButton.textContent = "Pause";
      isPlaying = true;
    }
  }

  function updateProgress(event) {
    const barWidth = progressBar.clientWidth;
    const clickX = event.clientX - progressBar.offsetLeft;
    const newTime = (clickX / barWidth) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
  }

  function setcurrentAlbumIndex(e, i) {
    currentAlbumIndex = i;
    currentSongIndex = 0;
    playPauseButton.textContent = "Play";
    isPlaying = false;
    setupPlayer();
  }

  function setTracklist() {
    tracklist.innerHTML = '';
    for (let index = 0; index < albums[currentAlbumIndex].songs.length; index++) {
      const song_i = albums[currentAlbumIndex].songs[index].replace('.mp3', '');
      const li = document.createElement("li");
      if(index == currentSongIndex){
        li.innerHTML = `<span class="current_song">${song_i}</span>`;
      }
      else {
        li.innerText = song_i;
      }
      tracklist.appendChild(li);
    }
  }

  function setupPlayer() {
    updateAlbumArt();
    updateInfo();
    updateAudioSource();
    setTracklist();
    updateDuration();
  }

  for (let index = 0; index < albums.length; index++) {
    const album_i = albums[index];
    const li = document.createElement("td");
    const img = document.createElement("img");
    img.src = [
      root_music_path,
      album_i.artist,
      album_i.album,
      'cover.jpg'
    ].join('/');

    img.style.maxWidth = '50px';
    li.className = 'nonblock';
    li.innerHTML = img.outerHTML;
    li.addEventListener('click', e => {
      setcurrentAlbumIndex(e, index);
    });
    albumlist.appendChild(li);
  }

  nextButton.addEventListener('click', nextSong);
  previousButton.addEventListener('click', previousSong);
  audioPlayer.addEventListener('ended', nextSong);
  audioPlayer.addEventListener('timeupdate', updateCurrentTime);
  audioPlayer.addEventListener('loadedmetadata', updateDuration);
  playPauseButton.addEventListener("click", playPauseSong);
  progressBar.addEventListener("click", updateProgress);

  setupPlayer();

});

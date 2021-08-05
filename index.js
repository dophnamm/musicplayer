var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)

const startBtnHome = $('.start-btn p')
const menuPlayer = $('#player')
const lineBtn = $('.line')
const btnLogin = $('.login-form')
const backIcon = $('#icon-back')
const cd = $('.cd') // lấy tới class cd
const heading = $('.about-cd h3') // lấy tới thẻ h2 của thẻ header thay đoạn text tên bài hát 
const headingauthor = $('.about-cd p') // lấy tới thẻ p 
const cdThumb = $('.cd-thumb') // lấy tới class 
const audio = $('#audio') // lấy tới id audio
const player = $('#player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.control .btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

startBtnHome.onclick = function() {
    $('#player').classList.add('active')
}

lineBtn.onclick = function() {
    $('#player.active').classList.remove('active')
}

btnLogin.onclick = function() {
    $('#login').classList.add('active')
}

backIcon.onclick = function() {
    $('#login.active').classList.remove('active')
}

// Xử Lý play nhạc 

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name : "Sài Gòn Đau Lòng Quá",
            singer: "Hứa Kim Tuyền",
            path: './assets/song/song2.mp3',
            image: './assets/img/img2.jpg'
        },
        {
            name : "Thức Giấc",
            singer: "Dalab",
            path: './assets/song/song1.mp3',
            image: './assets/img/img1.jpg'
        },
        {
            name : "Tay To",
            singer: "MCK",
            path: './assets/song/song3.mp3',
            image: './assets/img/img3.jpg'
        },
        {
            name : "Nàng Thơ",
            singer: "Hoàng Dũng",
            path: './assets/song/song4.mp3',
            image: './assets/img/img4.jpg'
        },
        {
            name : "3107",
            singer: "W/n",
            path: './assets/song/song5.mp3',
            image: './assets/img/img5.jpg'
        },
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class='bx bx-dots-vertical-rounded icon-option'></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        }) 
    },

    handleEvents: function() {
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'} // quay 360 độ
        ], {
            duration: 10000, // quay trong 10 giây
            iterations: Infinity // lặp lại lúc bao nhiêu lần (vô hạn Infinity)
        }) 
        cdThumbAnimate.pause() // lúc đầu vào sẽ không quay

        document.onscroll = function() {
            const scrollTop = window.scrollY
            const newWidth = cdWidth - scrollTop

            cd.style.width = newWidth > 0 ? newWidth + "px" : 0 
            cd.style.opacity = newWidth / cdWidth
        }

        playBtn.onclick = function() {
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            }

            //Khi nhạc được chạy (play) 
            audio.onplay = function() {
                _this.isPlaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }

            //khi nhạc dừng (pause)
            audio.onpause = function() {
                _this.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }

            //khi tiến độ bài hát thay đổi (thời gian)
            audio.ontimeupdate = function() {
                if(audio.duration) {
                    const propressPercent = Math.floor(audio.currentTime / audio.duration * 100) // lấy phần trăm của bài hát chạy trên thanh time
                    progress.value = propressPercent
                }
            }
        }

        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandom()
            } else {
                _this.nextSong()
            }
            _this.render()
            audio.play() // Play nhạc khi chuyển 
        }

        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandom()
            } else {
                _this.prevSong()
            }
            _this.render()
            audio.play()
        }

        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        audio.onended = function() {
            if(_this.isRepeat){ // Lặp lại bài nhạc khi True
                audio.play()
            } else {
                nextBtn.click()
            } // click auto khi hết bài
        }

        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                //xử lý click vào bài hát đó
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name // thay tên bài hát vào 
        headingauthor.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')` // sửa đoạn src của thuộc tính background-image
        
        audio.src = this.currentSong.path // thêm đường dẫn vào attr src của thẻ id audio
    },

    nextSong: function() {
        this.currentIndex++ //tăng thứ tự của chỉ mục trên dom
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0 // Sẽ quay về bài hát ban đầu
        }
        this.loadCurrentSong() // load lại bài hát mới
    },

    prevSong: function() {
        this.currentIndex-- //giảm thứ tự của chỉ mục trên dom
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1// Sẽ quay về bài hát ban đầu
        }
        this.loadCurrentSong() // load lại bài hát mới
    },

    playRandom: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        this.defineProperties();

        this.handleEvents();

        this.loadCurrentSong();
        
        this.render();
    }
}

app.start();
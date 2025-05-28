const stories = {
  "putri-salju": {
    title: "Putri Salju",
    pages: [
      "Di suatu kerajaan yang jauh, hiduplah seorang ratu yang memiliki cermin ajaib. Suatu hari, ratu melahirkan seorang putri yang sangat cantik dengan kulit seputih salju, rambut hitam legam, dan bibir merah seperti darah. Ia diberi nama Putri Salju.",
      "Seiring berjalannya waktu, Putri Salju tumbuh menjadi gadis yang sangat cantik. Ratu yang sombong menjadi cemburu karena kecantikannya tersaingi. Ia memerintahkan seorang pemburu untuk membawa Putri Salju ke hutan dan menyingkirkannya.",
      "Putri Salju berhasil kabur ke dalam hutan yang lebat. Di sana, ia menemukan sebuah rumah kecil yang dihuni oleh tujuh kurcaci yang baik hati. Mereka menerima Putri Salju dengan tangan terbuka dan hidup bersama dengan bahagia.",
    ],
    audio: "assets/mp3/Asal Usul.mp3",
  },
  "kutukan-raja-mintim": {
    title: "Legenda Kutukan Raja Mintim",
    pages: [
      "Dahulu kala, di Bengkulu hidup seorang raja bijak bernama Raja Mintim. Ia sangat dicintai rakyatnya, namun suatu hari, ia membuat keputusan yang tidak adil karena pengaruh penasihat jahat.",
      "Keputusan tersebut menyebabkan penderitaan bagi banyak rakyat. Rakyat pun marah dan seorang tetua mengutuk sang raja agar kerajaannya hilang ditelan bumi.",
      "Kutukan itu menjadi nyata. Dalam semalam, istana Raja Mintim menghilang dan hanya meninggalkan danau yang luas. Rakyat percaya bahwa danau itu adalah bekas kerajaan yang dikutuk dan kini dikenal sebagai Danau Dendam Tak Sudah.",
    ],
    audio: "assets/mp3/Asal Usul.mp3",
  },
  "putri-serindu": {
    title: "Legenda Putri Serindu",
    pages: [
      "Putri Serindu adalah seorang putri cantik dari kerajaan di Bengkulu. Ia terkenal karena suara nyanyiannya yang merdu dan sifatnya yang lembut.",
      "Banyak pangeran datang melamar, namun Putri Serindu selalu menolak karena menunggu cinta sejati. Suatu hari, seorang pangeran sederhana menyentuh hatinya karena ketulusan dan keberaniannya.",
      "Namun, sebelum pernikahan mereka terjadi, pangeran itu gugur dalam peperangan. Putri Serindu pun menghilang dan diyakini berubah menjadi bunga Serindu yang tumbuh di hutan sebagai simbol kesetiaan dan cinta sejati.",
    ],
    audio: "assets/mp3/Asal Usul.mp3",
  },
  "bujang-awang-tabuang": {
    title: "Legenda Bujang Awang Tabuang",
    pages: [
      "Di sebuah desa di Bengkulu, hidup seorang pemuda bernama Awang Tabuang yang dikenal tampan dan kuat. Ia sering membantu penduduk desa tanpa pamrih.",
      "Suatu hari, Awang Tabuang pergi merantau untuk mencari pengalaman. Namun, ia tidak pernah kembali. Penduduk desa percaya ia telah berubah menjadi batu karena melanggar sumpah leluhurnya.",
      "Legenda ini dipercaya sebagai pengingat bagi generasi muda agar selalu menjaga janji dan menghormati adat istiadat.",
    ],
    audio: "assets/mp3/Asal Usul.mp3",
  },
}

const SUPABASE_URL = "https://blxsatvfxwsxvipitccq.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJseHNhdHZmeHdzeHZpcGl0Y2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjk4MTMsImV4cCI6MjA2MzkwNTgxM30.G7mr8fV4gmQ9bvsepW_rjvk6SHPphJ-Ma-e46rjw6E0"
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// UI functions
function showError(message) {
  const errorToast = document.getElementById("error-toast")
  const errorMessage = document.getElementById("error-message")
  errorMessage.textContent = message
  errorToast.classList.add("show")
  setTimeout(() => {
    errorToast.classList.remove("show")
  }, 5000)
}
function showSuccess(message) {
  const successToast = document.getElementById("success-toast")
  const successMessage = document.getElementById("success-message")
  successMessage.textContent = message
  successToast.classList.add("show")
  setTimeout(() => {
    successToast.classList.remove("show")
  }, 3000)
}

function getQueryParam(name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

// Supabase view count
async function getViewCount(storySlug) {
  try {
    const { data, error } = await supabase
      .from("story_views")
      .select("view_count")
      .eq("story_slug", storySlug)
      .single()
    if (error) {
      if (error.code === "PGRST116") return await createViewRecord(storySlug)
      throw error
    }
    return data.view_count || 0
  } catch (error) {
    showError("Gagal memuat data tampilan cerita")
    return 0
  }
}
async function createViewRecord(storySlug) {
  try {
    const { data, error } = await supabase
      .from("story_views")
      .insert([{ story_slug: storySlug, view_count: 0 }])
      .select()
      .single()
    if (error) throw error
    return 0
  } catch (error) {
    showError("Gagal membuat record baru")
    return 0
  }
}
async function incrementViewCount(storySlug) {
  try {
    const currentCount = await getViewCount(storySlug)
    const newCount = currentCount + 1
    const { error } = await supabase
      .from("story_views")
      .upsert([{ story_slug: storySlug, view_count: newCount }], {
        onConflict: "story_slug",
        ignoreDuplicates: false,
      })
      .select()
      .single()
    if (error) throw error
    return newCount
  } catch (error) {
    showError("Gagal memperbarui jumlah tampilan")
    return 0
  }
}

let currentStory = null
let currentPage = 0
let isPlaying = false

async function loadStoryPage() {
  const slug = getQueryParam("slug")
  if (!slug || !stories[slug]) {
    showError("Cerita tidak ditemukan")
    document.getElementById("story-section").classList.add("hidden")
    document.getElementById("loading-indicator").style.display = "none"
    return
  }
  document.getElementById("loading-indicator").style.display = "block"
  currentStory = stories[slug]
  currentPage = 0
  // Increment view count
  const viewCount = await incrementViewCount(slug)
  // Set content
  document.getElementById("story-title").innerText = currentStory.title
  document.getElementById("view-count").innerText = viewCount
  updatePageContent()
  // Setup audio
  const audio = document.getElementById("story-audio")
  audio.src = currentStory.audio
  audio.load()
  audio
    .play()
    .then(() => {
      isPlaying = true
      document.getElementById("audio-btn").innerHTML =
        '<span class="mr-2">⏸️</span> Audio'
    })
    .catch((err) => {
      // Gagal autoplay: browser policy
      isPlaying = false
      // Tampilkan tombol Audio sebagai 'Play' dan beri animasi agar user sadar harus klik
      const audioBtn = document.getElementById("audio-btn")
      if (audioBtn) {
        audioBtn.classList.add("animate-bounce", "bg-red-400")
        audioBtn.title = "Klik untuk memulai audio"
        audioBtn.innerHTML = '<span class="mr-2">▶️</span> Audio'
      }
      // TRICK: Play audio saat user klik di mana saja di halaman
      const tryPlay = () => {
        audio
          .play()
          .then(() => {
            isPlaying = true
            if (audioBtn) {
              audioBtn.classList.remove("animate-bounce", "bg-red-400")
              audioBtn.innerHTML = '<span class="mr-2">⏸️</span> Audio'
              audioBtn.title = ""
            }
            document.removeEventListener("click", tryPlay)
          })
          .catch(() => {})
      }
      document.addEventListener("click", tryPlay)
    })
  document.getElementById("loading-indicator").style.display = "none"
  document.getElementById("story-section").classList.remove("hidden")
}

function updatePageContent() {
  if (!currentStory) return
  const pageText = currentStory.pages[currentPage]
  const total = currentStory.pages.length
  document.getElementById("story-content").innerHTML = pageText
  document.getElementById("page-indicator").innerHTML = `Halaman ${
    currentPage + 1
  } dari ${total}`
  // Update button states
  document.getElementById("prev-btn").disabled = currentPage <= 0
  document.getElementById("prev-btn").style.opacity =
    currentPage <= 0 ? "0.5" : "1"
  document.getElementById("next-btn").disabled = currentPage >= total - 1
  document.getElementById("next-btn").style.opacity =
    currentPage >= total - 1 ? "0.5" : "1"
}

function nextPage() {
  if (!currentStory || currentPage >= currentStory.pages.length - 1) return
  currentPage++
  updatePageContent()
}
function prevPage() {
  if (!currentStory || currentPage <= 0) return
  currentPage--
  updatePageContent()
}
function toggleAudio() {
  try {
    const audio = document.getElementById("story-audio")
    const audioBtn = document.getElementById("audio-btn")
    if (isPlaying) {
      audio.pause()
      audioBtn.innerHTML = '<span class="mr-2">▶️</span> Audio'
    } else {
      audio
        .play()
        .then(() => {
          audioBtn.innerHTML = '<span class="mr-2">⏸️</span> Audio'
        })
        .catch(() => {
          showError("Gagal memutar audio. Pastikan file audio tersedia.")
        })
    }
    isPlaying = !isPlaying
  } catch (error) {
    showError("Terjadi kesalahan pada audio player")
  }
}
document.getElementById("story-audio").addEventListener("ended", function () {
  isPlaying = false
  document.getElementById("audio-btn").innerHTML =
    '<span class="mr-2">▶️</span> Audio'
})
document.getElementById("story-audio").addEventListener("error", function (e) {
  showError("File audio tidak dapat dimuat")
})

document.addEventListener("DOMContentLoaded", function () {
  loadStoryPage()
})
window.addEventListener("online", function () {
  showSuccess("Koneksi internet tersambung kembali")
  loadStoryPage()
})
window.addEventListener("offline", function () {
  showError(
    "Koneksi internet terputus. Beberapa fitur mungkin tidak berfungsi."
  )
})

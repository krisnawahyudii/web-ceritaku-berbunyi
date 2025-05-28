const SUPABASE_URL = "https://blxsatvfxwsxvipitccq.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJseHNhdHZmeHdzeHZpcGl0Y2NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMjk4MTMsImV4cCI6MjA2MzkwNTgxM30.G7mr8fV4gmQ9bvsepW_rjvk6SHPphJ-Ma-e46rjw6E0"
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
const stories = [
  "kutukan-raja-mintim",
  "putri-serindu",
  "bujang-awang-tabuang",
  "putri-salju",
]

async function getViewCount(storySlug) {
  try {
    const { data, error } = await supabase
      .from("story_views")
      .select("view_count")
      .eq("story_slug", storySlug)
      .single()
    if (error) {
      if (error.code === "PGRST116") {
        return 0
      }
      throw error
    }
    return data.view_count || 0
  } catch (error) {
    return 0
  }
}

async function initializeViewCounts() {
  try {
    for (const storyKey of stories) {
      try {
        const count = await getViewCount(storyKey)
        const viewElement = document.getElementById(`view-${storyKey}`)
        if (viewElement) {
          viewElement.innerHTML = count
        }
      } catch (error) {
        const viewElement = document.getElementById(`view-${storyKey}`)
        if (viewElement) {
          viewElement.innerHTML = "0"
        }
      }
    }
  } catch (error) {}
}

document.addEventListener("DOMContentLoaded", function () {
  initializeViewCounts()
})

document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("language-select")
  const ceritaCards = document.getElementById("cerita-cards")
  const pengembanganMsg = document.getElementById("pengembangan-msg")

  ceritaCards.classList.add("hidden")
  pengembanganMsg.classList.add("hidden")

  select.addEventListener("change", function () {
    if (select.value === "id") {
      ceritaCards.classList.remove("hidden")
      pengembanganMsg.classList.add("hidden")
    } else if (select.value === "en") {
      ceritaCards.classList.add("hidden")
      pengembanganMsg.classList.remove("hidden")
    }
  })
})

document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("language-select")
  const audio = document.getElementById("audio-cerita")

  select.addEventListener("change", function () {
    // Cek jika user memilih bahasa (bukan default)
    if (select.value !== "") {
      audio.muted = false // Pastikan unmute
      audio.play()
    }
  })
})

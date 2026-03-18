interface Profile {
  name: string
  title: string
  city: string
  experience: number
}

export default async function Page() {
  let profile: Profile | null = null

  try {
    const response = await fetch(`${process.env.API_URL}/profile`)
    if (response.ok) {
      profile = await response.json()
    }
  } catch {
    // бэкенд недоступен — показываем заглушку
  }

  if (!profile) {
    return (
      <div>
        <h1>Сайт временно недоступен</h1>
        <p>Попробуйте обновить страницу позже.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.title}</p>
      <p>{profile.city}</p>
      <p>Опыт: {profile.experience} лет</p>
    </div>
  )
}

interface Profile {
  name: string
  title: string
  city: string
  experience: number
}

export default async function Page() {
  const response = await fetch(`${process.env.API_URL}/profile`)
  const profile: Profile = await response.json()

  return (
    <div>
      <h1>{profile.name}</h1>
      <p>{profile.title}</p>
      <p>{profile.city}</p>
      <p>Опыт: {profile.experience} лет</p>
    </div>
  )
}
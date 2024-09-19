import { logout } from "@/action"

const LogoutForm = () => {
  return (
    <form action={logout}>
      <button className="bg-white">logout</button>
    </form>
  )
}

export default LogoutForm
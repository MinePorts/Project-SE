import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Add your custom authentication logic here
        // You can use the provided credentials (email and password)
        // to authenticate against your database or API

        // For this example, we'll assume successful authentication
        const user = { email: credentials.email, name: 'John Doe' }
        return user
      },
    }),
  ],
  session: {
    jwt: true,
  },
})
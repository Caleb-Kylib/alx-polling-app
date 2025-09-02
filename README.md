# AI Polling App

A modern polling application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Authentication System**: User registration and login with context-based state management
- **Modern UI**: Built with Tailwind CSS for responsive and beautiful interfaces
- **TypeScript**: Full type safety throughout the application
- **Next.js 14**: Latest features including App Router and Server Components
- **Responsive Design**: Mobile-first approach with modern UI patterns

## 📁 Project Structure

```
ai-polling-app/
├── app/                          # Next.js App Router
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page (/auth/login)
│   │   │   └── page.tsx
│   │   └── register/            # Registration page (/auth/register)
│   │       └── page.tsx
│   ├── globals.css              # Global styles with Tailwind
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Home page
├── components/                   # Reusable UI components
│   ├── LoginForm.tsx            # Login form component
│   └── RegisterForm.tsx         # Registration form component
├── context/                      # React Context providers
│   └── AuthContext.tsx          # Authentication context
├── package.json                  # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── README.md                    # This file
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: Supabase Auth with custom context
- **Database**: Supabase PostgreSQL with Row Level Security
- **Real-time**: Supabase Realtime subscriptions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-polling-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Supabase**
   - Follow the [Supabase Setup Guide](SUPABASE_SETUP.md)
   - Create your `.env.local` file with your credentials

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Available Routes

- **Home Page**: `/` - Welcome page with login/register links
- **Login**: `/auth/login` - User authentication
- **Register**: `/auth/register` - New user registration

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Pages**: Add to the `app/` directory following Next.js 13+ conventions
2. **New Components**: Add to the `components/` directory
3. **New Context**: Add to the `context/` directory
4. **Styling**: Use Tailwind CSS classes in your components

## 🔐 Authentication

The app includes a complete Supabase-powered authentication system:

- **Supabase Auth**: Secure user authentication with email/password
- **AuthContext**: Manages user state and authentication methods
- **Protected Routes**: Ready for implementation with route guards
- **Form Validation**: Client-side validation for login and registration
- **Session Management**: Secure session handling with automatic token refresh
- **Row Level Security**: Database-level security policies

### Authentication Flow

1. User visits login/register page
2. Form submission calls Supabase auth methods
3. Success creates user session and redirects to dashboard
4. User state is maintained across the app with real-time updates

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable UI components with consistent styling
- **Dark Mode**: Ready for dark mode implementation

## 📝 TODO

- [x] Implement Supabase backend integration
- [x] Set up authentication system
- [ ] Add protected routes and middleware
- [ ] Create dashboard page for authenticated users
- [ ] Add polling functionality
- [ ] Implement real-time updates with Supabase subscriptions
- [x] Add user profile management
- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Create admin panel
- [ ] Add analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please open an issue in the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS

# Life Tracker - Personal Life Management System

A comprehensive web application to track and manage your health, finances, job applications, and skill development. Built with Next.js 14, TypeScript, MongoDB, and Tailwind CSS.

## 🚀 Features

### ✅ Completed
- **Authentication**: Simple passcode-based login system
- **Health Tracker**: Daily health logging with photo upload, supplements tracking, and mood monitoring
- **Routine Management**: Create and manage different day types (Office, WFH, Weekend) with custom routines
- **Dashboard**: Overview of all your metrics and progress
- **Responsive Design**: Mobile-friendly interface

### 🚧 In Development
- **Finance Tracker**: Expense tracking, investment monitoring, and financial analytics
- **Jobs Tracker**: Job application management and interview scheduling
- **Skills Tracker**: Learning progress tracking and skill development
- **Advanced Analytics**: Charts, trends, and efficiency scoring

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, MongoDB Atlas, Mongoose
- **Authentication**: JWT-based with HTTP-only cookies
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier available)
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd life-tracker
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life-tracker?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
APP_PASSCODE=your-secure-passcode

# App Configuration
NEXT_PUBLIC_APP_NAME=Life Tracker
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Create a database named `life-tracker`
4. Get your connection string and update `MONGODB_URI` in `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. First Login

Use the passcode you set in `APP_PASSCODE` to log in to the application.

## 📱 Usage

### Health Tracker
- Log daily weight, sleep, steps, energy levels
- Track supplements and mood
- Upload progress photos
- Monitor trends over time

### Routine Management
- Create different day types (Office, WFH, Weekend, Holiday)
- Set intended wake/sleep times and step goals
- Define custom routine checklists
- Track daily compliance

### Dashboard
- View overall efficiency score
- Quick stats for all areas
- Recent activity and upcoming tasks
- Progress visualization

## 🗂️ Project Structure

```
life-tracker/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (app)/           # Main application pages
│   │   └── api/             # API routes
│   ├── components/
│   │   └── ui/              # shadcn/ui components
│   └── lib/
│       ├── schemas/         # Mongoose models
│       ├── auth.ts          # Authentication utilities
│       └── db.ts            # Database connection
├── .env.example             # Environment variables template
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with passcode
- `POST /api/auth/logout` - Logout
- `GET /api/auth/verify` - Verify authentication

### Health
- `GET /api/health` - Get health logs
- `POST /api/health` - Create/update health log
- `GET /api/health/[date]` - Get specific health log
- `DELETE /api/health/[date]` - Delete health log

### Routine
- `GET /api/routine/day-types` - Get day types
- `POST /api/routine/day-types` - Create day type
- `GET /api/routine/day-plan` - Get day plans
- `POST /api/routine/day-plan` - Create/update day plan

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
APP_PASSCODE=your-production-passcode
NEXT_PUBLIC_APP_NAME=Life Tracker
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🔒 Security

- JWT tokens stored in HTTP-only cookies
- Passcode-based authentication (can be upgraded to OAuth later)
- Input validation on all API endpoints
- MongoDB connection secured with SSL

## 🎯 Roadmap

### Phase 1: Core Features ✅
- [x] Authentication system
- [x] Health tracking
- [x] Routine management
- [x] Basic dashboard

### Phase 2: Advanced Tracking 🚧
- [ ] Finance tracker with expense categorization
- [ ] Job application management
- [ ] Skills learning tracker
- [ ] Advanced analytics and charts

### Phase 3: Enhancements 📋
- [ ] Mobile app (React Native)
- [ ] Data export/import
- [ ] Team/family sharing
- [ ] AI-powered insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/life-tracker/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database by [MongoDB Atlas](https://www.mongodb.com/atlas)

---

**Happy Tracking! 🎉**
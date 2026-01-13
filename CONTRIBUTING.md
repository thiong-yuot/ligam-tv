# Contributing to ligam-tv

Thank you for your interest in contributing to ligam-tv! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose
- Git
- A code editor (VS Code recommended)

### Local Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ligam-tv.git
   cd ligam-tv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start SRS server (optional)**
   ```bash
   docker compose up srs
   ```

## 📁 Project Structure

```
ligam-tv/
├── .github/
│   └── workflows/        # GitHub Actions workflows
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # External integrations (Supabase)
│   ├── lib/            # Utility functions
│   ├── pages/          # Page components
│   └── main.tsx        # Application entry point
├── srs/                # SRS server configuration
│   ├── Dockerfile      # SRS Docker image
│   ├── srs.conf        # SRS configuration
│   └── README.md       # SRS documentation
├── docker-compose.yml  # Docker Compose configuration
├── Dockerfile          # App Docker image
├── nginx.conf          # Nginx configuration
└── DEPLOYMENT.md       # Deployment guide
```

## 🔧 Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Build the application
npm run build

# Test with Docker (optional)
docker compose up --build
```

### 4. Commit Your Changes

We follow conventional commits:

```bash
git commit -m "feat: add new streaming feature"
git commit -m "fix: resolve HLS playback issue"
git commit -m "docs: update deployment guide"
```

Commit types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 🎨 Code Style

### TypeScript/React

- Use TypeScript for all new code
- Use functional components with hooks
- Follow React best practices
- Use meaningful variable and function names
- Keep components small and focused

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow the existing design system
- Use shadcn-ui components when possible
- Maintain responsive design

### File Naming

- Components: PascalCase (e.g., `StreamPlayer.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE

## 🧪 Testing

Currently, the project doesn't have automated tests, but we encourage:

- Manual testing of all changes
- Testing in multiple browsers
- Testing responsive layouts
- Testing streaming functionality with SRS

## 📝 Documentation

When contributing, please update:

- Code comments for complex logic
- README.md for user-facing changes
- DEPLOYMENT.md for deployment-related changes
- Component documentation for new components

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Step-by-step guide
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, Node version, etc.
6. **Screenshots**: If applicable

## 💡 Feature Requests

When requesting features, please include:

1. **Use Case**: Why is this feature needed?
2. **Description**: What should the feature do?
3. **Proposed Solution**: How could it be implemented?
4. **Alternatives**: Other solutions you've considered

## 🔐 Security

If you discover a security vulnerability, please:

1. **Do NOT** create a public issue
2. Email the maintainers directly
3. Provide detailed information about the vulnerability

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows the project style guide
- [ ] All tests pass (if applicable)
- [ ] Documentation is updated
- [ ] Commit messages follow conventional commits
- [ ] PR description clearly explains the changes
- [ ] No merge conflicts with main branch
- [ ] Code has been tested locally

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### High Priority
- Stream authentication improvements
- Performance optimization
- Mobile responsiveness
- Accessibility improvements
- Error handling and user feedback

### Features
- Chat moderation tools
- Stream analytics
- Multi-quality streaming
- Stream recording (DVR)
- Social features (follow, notifications)

### Infrastructure
- Automated testing
- CI/CD improvements
- Performance monitoring
- Load testing

### Documentation
- API documentation
- Deployment guides for different platforms
- Troubleshooting guides
- Video tutorials

## 🤝 Community

- Be respectful and inclusive
- Help others when possible
- Share knowledge and learn together
- Follow the code of conduct

## 📞 Getting Help

If you need help:

1. Check the [DEPLOYMENT.md](DEPLOYMENT.md) guide
2. Review existing issues on GitHub
3. Ask in discussions
4. Contact the maintainers

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to ligam-tv! 🎉

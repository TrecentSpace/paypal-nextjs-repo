# Contributing to PayPal Next.js Template

Thank you for your interest in contributing to the PayPal Next.js Template! This document provides guidelines and information for contributors.

## Ways to Contribute

- **Bug Reports**: Report bugs using GitHub issues
- **Feature Requests**: Suggest new features using GitHub issues
- **Code Contributions**: Submit pull requests with improvements
- **Documentation**: Improve documentation and examples
- **Testing**: Add tests or report test results

## Development Setup

1. **Fork and Clone** the repository
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment**:
   ```bash
   cp .env.example .env.local
   # Fill in your PayPal sandbox credentials
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

## Pull Request Process

1. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**:
   - Write clear, focused commits
   - Test your changes thoroughly
   - Update documentation if needed

3. **Test Your Changes**:
   - Run the linter: `npm run lint`
   - Test with PayPal sandbox environment
   - Verify webhook functionality

4. **Submit Pull Request**:
   - Provide a clear description of changes
   - Reference any related issues
   - Include screenshots for UI changes

## Adding Database Examples

When adding support for a new database:

1. Create a new directory in `examples/`
2. Implement all required functions from the template
3. Add setup instructions and schema
4. Update the examples README
5. Test with the sandbox environment

## Reporting Issues

When reporting bugs:

- Use a clear, descriptive title
- Include steps to reproduce
- Provide environment details (Node version, OS, etc.)
- Include error messages and stack traces
- Mention PayPal environment (sandbox/production)

## Feature Requests

When requesting features:

- Clearly describe the feature and its benefits
- Explain how it fits into the existing architecture
- Consider backward compatibility
- Provide examples of similar implementations

## Documentation

- Keep README up to date
- Document new features and APIs
- Provide code examples
- Update environment variable documentation

## Testing

- Test with PayPal sandbox environment
- Verify webhook event handling
- Test subscription lifecycle
- Check error handling scenarios

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers learn and contribute
- Maintain professional communication

## License

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project.

## Questions?

If you have questions about contributing, feel free to:
- Create a GitHub issue
- Join the discussion on existing issues
- Check the documentation first

Thank you for contributing to the PayPal Next.js Template! 🎉
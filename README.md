# NestJS GraphQL Boilerplate

## Description

This is a comprehensive NestJS GraphQL boilerplate configured with a variety of modules to jumpstart any project. It covers authentication procedures, user management, notifications handling, file management, real-time subscriptions, and more. The boilerplate integrates with TypeORM and BullMQ for handling database operations and job queues, respectively.

## Features

### Authentication
- User registration
- Login with credentials
- Login with Google OAuth
- Forgot/Reset password
- Change password
- Logout from the current device or all devices

### User Management
- View user profile
- Update user details
- Delete user
- Email verification
- Resend email verification link

### Notifications
- Fetch a single notification
- Fetch all notifications
- Mark notifications as read

### File Management
- Supports file upload to local disk; configurable to use other storage providers like Amazon S3

### Real-Time Subscriptions
- GraphQL subscriptions for user updates

### Internationalization
- i18n integration for multi-language support
- Email notifications also support translations

### Job Management with BullMQ
- Uses BullMQ to manage job queues. For example, for sending emails

### Data Management
- Uses TypeORM for data handling
- Entire application functionality covered with end-to-end test cases

## Setup and Installation

1. **Install dependencies**:
    ```sh
    pnpm i
    ```

2. **Setup environment variables**:
    Copy `.env.example` to `.env` and adjust the variables.

3. **Generate encryption/decryption key**:
    ```sh
    pnpm key:generate
    ```

4. **Database operations**:
    - Migrate database:
        ```sh
        pnpm db:migrate
        ```
    - Seed database:
        ```sh
        pnpm db:seed
        ```

5. **Running Tests**:
    Execute end-to-end tests with:
    ```sh
    pnpm test
    ```

6. **Generate migration and seeder files**:
    - New migration:
        ```sh
        pnpm make:migration
        ```
    - New seeder:
        ```sh
        pnpm make:seed
        ```

## Useful Custom Decorators

### Function Decorators

- **@InTransaction()**: Ensures operations run within a transaction. Rollbacks on error.
- **@PublicResolver()**: Specifies resolver fields that bypass the global auth guard.
- **@SemiPublicResolver()**: Similar to @PublicResolver but provides conditional auth checks.

### Argument Decorator

- **@User()**: Injects the logged-in user data into methods.

## Additional Information
This boilerplate provides a robust foundation for any GraphQL-based server-side application, offering flexibility, robustness, and scalability. Feel free to fork, customize, and extend it as per your needs.
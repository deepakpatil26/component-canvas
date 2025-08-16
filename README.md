# Component Canvas: A React Component Showcase

This project is a submission for the React Component Development Assignment. It features two main components, an `InputField` and a `DataTable`, built with React, TypeScript, and TailwindCSS. The application serves as a live demonstration of these components.

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd <repo-directory>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

## Project Structure

The project follows a standard Next.js App Router structure with some key directories:

- `src/app/`: Contains the main page (`page.tsx`) that demonstrates the components.
- `src/components/ui/`: Contains the custom-built `InputField` and `DataTable` components, along with other ShadCN UI primitives.
- `src/lib/`: Utility functions.
- `src/styles/`: Global styles and TailwindCSS configuration.

## Approach and Design Choices

### Component Design

- **`InputField`**: This component was built from the ground up to be highly flexible and customizable. It leverages `cva` (class-variance-authority) to manage its numerous variants and sizes, making it easy to extend. State management (e.g., for the password toggle) is handled internally with `React.useState`.
- **`DataTable`**: This component is designed to be generic and type-safe, using TypeScript generics (`<T>`) to handle any data structure. It includes features like sorting and row selection, with internal state management for these features. It is built upon the ShadCN `Table` component for a solid structural and stylistic foundation.

### Styling

- **TailwindCSS**: Used for all styling to allow for rapid UI development and maintain a consistent design system.
- **ShadCN UI**: Leveraged for its accessible and unstyled component primitives, which serve as a base for the custom components. This accelerates development without imposing a specific visual style.
- **Dark Mode**: Implemented using `next-themes`, which handles theme switching and applies the `.dark` class to the `<html>` element, allowing for easy styling with Tailwind's `dark:` variants.

### Accessibility

Basic accessibility has been addressed by:

- Using semantic HTML elements.
- Adding `aria-*` attributes for states like `aria-invalid` and `aria-label` for interactive elements like buttons and checkboxes to ensure they are understandable by screen readers.

# Crime Report and Management System - Backend

## Overview

The Crime Report and Management System is a comprehensive backend application designed for managing crime reports efficiently. This system is aimed at enhancing the workflow of law enforcement agencies by providing functionalities for reporting, tracking, and managing crime cases. The backend is developed using Prisma as an ORM with a MySQL database for data storage, ensuring robust performance and scalability.

## Features

- User Management: Supports multiple roles including System Admins, Desk Officers, Inspectors, Sajens, Police Heads, and Prosecutors, each with specific capabilities.

- Case Management: Allows users to create and track crime cases with detailed information, including nature of crime, suspects, and reports associated with each case.

- Reporting Mechanism: Offers a structured platform for generating technical and tactical reports that are linked to crime cases.

- Notification System: Notifies users about important updates related to cases and their statuses, ensuring timely communication.

- Location Tracking: Integrates geolocation features to associate cases and users with specific locations.

## Database Schema

Here's a brief description of the primary models within the system's database schema:

- User Models: 
  - `SystemAdmin`, `DeskOfficer`, `User`, `Sajen`, `Inspector`, `PoliceHead`, `Prosecutor`: All models include personal details, contact information, profile pictures, and timestamps for account management and auditing.

- Case Management:
  - `Case`: Captures case title, description, status, relevant dates, associated suspects, and various reports.
  - `Suspects`: Manages information about suspects associated with cases.

- Reporting:
  - `TechnicalReport` and `TacticalReport`: These models store information related to the reports generated for each case, facilitating detailed documentation of investigative activities.

- Communication:
  - `Notification`: Keeps track of user-specific notifications related to cases and updates.
  - `InspectorQuestionToUser`, `ProsecutorQuestionToPoliceHead`, `PoliceHeadQuestionToInspector`: Models facilitate communication between different roles regarding case queries and instructions.

- Location: 
  - `Location`: Stores geographical data related to users and cases, including names of cities, weredas, and kebeles to enable efficient mapping and tracking.

## Technologies Used

- **Prisma**: ORM for database management
- **MySQL**: Relational database for persistent data storage.
- **Next.js**: Framework for building server-side rendering frontend applications.

## Getting Started

### Prerequisites

- Node.js
- MySQL Database
- Prisma CLI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JonathanZeru/Crime-Report-and-Management-System-Senior-Project-Backend
   cd Crime-Report-and-Management-System-Senior-Project-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables in a `.env` file:
   ```plaintext
   DATABASE_URL = "mysql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

4. Run database migrations using Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Start the application:
   ```bash
   npm run dev
   ```

### Usage

- For development, utilize API endpoints available at `/api/` for managing user authentication, case handling, reporting, and notifications.

## Contributions

Contributions are welcome! Please feel free to submit a pull request or report issues.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any inquiries, please contact me Jonathan Zeru(0966274102) or submit an issue on the GitHub repository.

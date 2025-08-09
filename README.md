# LexiAI
LexiAI is an AI-powered web application designed to streamline legal case management, research, and document generation. Built on the powerful base44 platform, LexiAI serves as a smart companion for legal professionals and individuals navigating legal processes, offering intelligent assistance and automation for various legal tasks.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Application Structure](#application-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Disclaimer](#disclaimer)
- [Contact](#contact)

## Introduction

In the complex world of legal work, efficiency and accuracy are paramount. LexiAI leverages artificial intelligence to provide a centralized hub for managing legal cases, conducting in-depth research, and generating essential legal documents. From tracking case progress and uploading key evidence to engaging in AI-driven consultations and drafting legal arguments, LexiAI aims to enhance productivity and accessibility in legal practice.

## Features

LexiAI offers a suite of powerful features to support your legal work:

-   **Intelligent Case Management:**
    -   Create, organize, and track legal cases with essential details like title, description, case type, jurisdiction, status, priority, and deadlines.
    -   View comprehensive statistics for all cases, including active and urgent matters.
-   **AI-Powered Chat Assistant:**
    -   Engage in natural language conversations with an AI assistant that can analyze case information, documents, and provide legal guidance.
    -   Receive context-aware responses tailored to your specific legal queries.
    -   The AI offers to help draft legal document content (e.g., arguments for FTCA claims), providing the necessary text and instructions on how to use it with official forms.
    -   Accurate jurisdictional analysis is performed when relevant to legal actions or filings.
-   **Document Management & Analysis:**
    -   Upload relevant documents (PDF, DOCX, TXT, images) to individual cases.
    -   The AI can extract content from uploaded documents to provide richer context for its responses.
    -   Organize documents by category and easily view or download them.
-   **Advanced Legal Research:**
    -   Utilize AI to conduct legal research on specific queries, statutes, case law, and precedents.
    -   Get comprehensive results with citations, legal principles, and practical considerations.
-   **Legal Document Generation:**
    -   Generate various types of legal documents (e.g., demand letters, contracts, affidavits) by providing key details.
    -   The AI drafts professional, customizable content, including placeholders for specific information.

## Technologies Used

LexiAI is built as a modern web application on top of the robust base44 development platform, utilizing a stack of cutting-edge technologies:

-   **Frontend:**
    -   [**React.js**](https://react.dev/): A declarative, component-based JavaScript library for building user interfaces.
    -   [**Tailwind CSS**](https://tailwindcss.com/): A utility-first CSS framework for rapidly styling responsive designs.
    -   [**Shadcn UI**](https://ui.shadcn.com/): A collection of reusable components built with Radix UI and Tailwind CSS for beautiful and accessible UIs.
    -   [**Lucide React**](https://lucide.dev/): A collection of beautiful and customizable open-source icons.
    -   `react-router-dom`: For client-side routing.
    -   `date-fns`: For date manipulation and formatting.
-   **Backend & Infrastructure:**
    -   **base44 Platform:** Provides the core infrastructure, including:
        -   Entity management (data storage and querying for `LegalCase`, `Document`, `ChatMessage`).
        -   Built-in AI integrations (LLM invocation for chat, research, document generation).
        -   File storage and management (document uploads).
        -   Authentication and user management.
        -   Deployment and hosting.

## Application Structure

The application's codebase is organized logically into the following directories, reflecting base44's architectural patterns:

-   `entities/`: Defines the data schemas (JSON Schema) for `LegalCase`, `Document`, and `ChatMessage`.
-   `pages/`: Contains the main application views (e.g., `Cases`, `Chat`, `Research`, `Generator`, `CreateCase`).
-   `components/`: Houses reusable React components used across different pages (e.g., `CaseCard`, `ChatMessages`, `DocumentUpload`).
-   `Layout.js`: Defines the global layout and navigation structure of the application.

## Getting Started

LexiAI is deployed and managed directly on the base44 platform. As a user or developer with access to the base44 environment:

1.  **Access the Application:** Navigate to your LexiAI application URL provided by the base44 dashboard.
2.  **Login:** Use your base44 credentials to log in. Authentication is handled seamlessly by the platform.

### For Developers

If you are managing this project within the base44 developer environment:

1.  **Understand the base44 workflow:** Familiarize yourself with how base44 structures applications, manages entities, and integrates AI.
2.  **Edit Code:** You can directly edit the `pages/`, `components/`, and `entities/` files within the base44 code editor. Changes are typically reflected instantly in the live preview.
3.  **AI Logic:** The core AI behavior is primarily configured within the `prompt` string inside the `handleSendMessage` function in `pages/Chat.js`.

## Usage

Once logged in, you can:

-   **Create New Cases:** Use the "New Case" option to start a new legal matter, providing a description and optionally uploading supporting documents for AI analysis.
-   **Manage Cases:** View all your cases, their statuses, and quick access to their chat and document sections.
-   **Chat with AI:** Open any case to interact with the AI assistant, ask questions, get legal guidance, and request drafting assistance.
-   **Conduct Research:** Use the dedicated "Legal Research" page to ask specific legal questions and receive comprehensive, AI-generated research summaries.
-   **Generate Documents:** On the "Document Generator" page, select a document type and provide details to have the AI draft the content for you.

## Disclaimer

**IMPORTANT: LexiAI is an AI assistant and does not provide legal advice. The information, research, and document drafts generated by LexiAI are for informational and educational purposes only and should not be considered a substitute for professional legal counsel. Always consult with a qualified attorney for specific legal matters. Users are solely responsible for verifying the accuracy and applicability of any information or documents generated by LexiAI before use.**

## Contact

For questions or support regarding LexiAI, please refer to your DOCUMENTATION OR CONTACT OPTAMIAADS

# **Contact Backend Developer Assessment - Translation and Authentication Integration**

Welcome to the backend developer assessment for integrating authentication and translation services!
This assessment is designed to assess your skills in working on integration with third parties and designing well-structured and maintainable code.

Your task is to create a backend API that handles user authentication and translation using Google Translate and Microsoft Translate APIs-links to the API docs attached below-. Here are the  tasks:

## **Entities:**

- **Users**:
  - name
  - email
  - username
  - password

- **Translations History:**
  - text
  - translation
  - source language
  - target language
  - engine (Google or Microsoft)

## **Required Tasks:**

1. **Signup:**
    Create a route to allow users to sign up by providing their name, username, email, and password.
2. **Login:**
    Implement a route to allow users to log in using either their email or username along with their password.
3. **Translate:**
    Develop an endpoint that takes input text and translates it from one language to another using the Google Translate API or Microsoft Translator. Google Translate should be the default translator but if for any reason Google Translate fails, Microsoft Translate should be used as a Fallback.
4. **Get Translation History:**
    Get the user history of translations.

## **Bonus Tasks:**

1. **Password Reset:**
    Implement a password reset mechanism using email. Users should be able to request a password reset link via email.

2. **Multi-language Translation:**
    Enhance the translation endpoint to allow translating from one source language to multiple target languages using both Google Translate and Microsoft Translate APIs.

3. **Pagination:**
    Add pagination for the get translation history API.

4. **Unit Testing:**
Write unit tests to cover the authentication and translation functionality. Ensure that the different API integrations are properly tested.

## **Tech Stack:**

- Use Node.js for the backend development. While any framework (such as Express or Adonis) can be used, Nest.js is preferred.
- Employ a relational database for data storage. PostgreSQL is preferred.
- Integrate with the Google Translate API -[Docs URL](https://rapidapi.com/googlecloud/api/google-translate1/)- and the Microsoft Translate API -[Docs URL](https://rapidapi.com/microsoft-azure-org-microsoft-cognitive-services/api/microsoft-translator-text)-. Google Translate should be the default, and Microsoft Translate should be used as a fallback in case of any failure by Google Translate.

## **Deadline:**

Your deadline for completing this assessment is Sunday, September 03, 2023, at 05:00 PM.

## **Evaluation Criteria:**

You will be assessed based on the following criteria:

- Code structure and organization
- Scalability of the code (consider the situation if a new translator needs to be added or an old one to be removed).
- Effective API integration with authentication and translation services
- Proper error handling and validation
- Bonus task completion (password reset, multi-language translation, pagination, unit testing)
- Efficient use of the chosen tech stack
- Clear Documentation or a Postman Collection for testing the endpoints.

## **Submission:**

Fork this repository and submit your solution by pushing your code to your forked repository. Provide the link to your repository by emailed to <backend@contact.com> before the deadline.
Best of luck, and we look forward to seeing your integration in action!

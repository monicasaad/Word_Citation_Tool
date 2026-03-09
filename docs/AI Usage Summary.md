# AI Usage Summary

## AI Tools Used
- ChatGPT (OpenAI GPT-5.3)

## Types of Assistance
- Planning development process & timeline  
- Writing snippits of code to implement specific features
- Debugging TypeScript/React code
- Improving UI styling  
- Writing documentation such as the README

## Details

AI was used in this project primarily as a development assistant to support planning, implementation, debugging, and documentation.

At the beginning of the project, ChatGPT helped create a project plan that broke the problem into manageable components, each with clearly defined features that would indicate successful completion. This structure helped guide the development process and ensured that each stage of the project could be implemented and tested incrementally.

ChatGPT was particularly helpful because my prior development experience is primarily in Python, and this project required working in TypeScript. While I have some frontend experience using HTML, CSS, and small amounts of JavaScript, most of my work has been backend-focused. As a result, ChatGPT helped accelerate the process of adapting to unfamiliar TypeScript syntax and frontend development patterns.

Rather than generating large sections of code, I asked ChatGPT to produce code snippets for small, well-defined parts of the problem. I then modified the generated code and verified its correctness by checking it against documentation before integrating it into the project. For example, when implementing functionality to insert comments over in-text citations, ChatGPT helped identify the parameters and components required to insert comments over a specific text range. I then reviewed the Office Add-ins API documentation to ensure the implementation aligned with the API specifications and customized the code from ChatGPT to format the comment text according to the information I wanted to include.

In situations where TypeScript syntax was not immediately clear due to my background in Python, I made sure to research and understand the code before incorporating it into the project. This ensured that the final implementation was both maintainable and understandable, which is essential both for making debugging or feature expansion easier in the future.

At a high level, ChatGPT assisted with generating initial code or guidance for the following components:

1. Connecting to the backend and testing API requests (`GET /health`, `GET /document`, `POST /analyze`)
2. Reading selected text from the document
3. Sending selected text for analysis using `POST /analyze`
4. Implementing a loading state
5. Handling various error conditions, including:
   - No text selected  
   - No citation match found  
   - No `document_id` match  
   - Timeout errors
6. Highlighting selected text when a citation match is found
7. Adding references to a scrolling pane
8. Inserting in-text citations
9. Inserting comments over in-text citations with additional details
10. Making reference items in the references pane clickable so they jump to the correct location in the document
11. Inserting a reference list
12. Converting references from APA to MLA format
13. Implementing a toggle switch to change the reference style

After implementing the main functionality, I also used ChatGPT to review the codebase and help ensure that functions were properly documented and that the code was organized and clean.

ChatGPT was also used for troubleshooting development issues that weren't code-related. For example, when updating the project’s logo, I replaced the existing image files with new ones while keeping the same filenames. However, when running the add-in, the old sample logo continued to appear. ChatGPT suggested renaming the files so that cached versions would no longer be used. After renaming the files, the new images loaded correctly. You can even follow along with this change in the commit history of the repository.

Finally, ChatGPT assisted in drafting the project README. Because the chat already contained context about the project, I asked ChatGPT to generate a README with specific sections I wanted included, as well as provide suggestions for additional sections that might be useful. Afterward, I edited the README to adjust the tone, refine the content, and add or remove information based on my own judgment.

Overall, AI served as a development assistant throughout this project by helping with planning, providing starting points for code, supporting debugging, and assisting with documentation for the purpose of efficient development. However, all core design decisions, customizations, and testing were completed independently without AI.

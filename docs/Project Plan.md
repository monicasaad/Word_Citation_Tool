# Development
## 1. Test Backend connectivity
- [X] Test `GET /health` to confirm the backend is reachable
- [X] Test `GET /document` to inspect the source material used by the backend
- [X] Test `POST /analyze` manually with sample text before connecting it to the UI
- [X] Confirm expected response fields: `source_id`, `citation_text`, optional `confidence`, optional `url`

## 2. Core Office.js integration
- [X] Add logic to read the current selected text in Word using Office.js
- [X] Prevent empty submissions when no text is selected
- [X] Show inline message: "Please select text before analyzing"
- [X] Add a clear Analyze button in the task pane
- [X] Confirm selection reading works repeatedly in the same session

## 3. API integration
- [X] Create a typed API helper for `POST /analyze`
- [X] Send required request body with `text`, plus `document_id` and `user_id` if used
- [X] Handle loading state during the network request
- [X] Handle malformed responses safely
    - [X] if document_id is not found
    - [X] if timeout
    - [X] if low confidence (<0.6)
    - [X] if confidence == 0.82
- [X] Show inline API error state if the request fails
- [X] Add retry behavior for transient failures

## 4. Citation rendering workflow
- [X] After successful analysis, highlight the selected text in the document
- [X] Display the returned `citation_text` in a scrollable list in the task pane
- [X] Make sure the UI remains responsive while the network request runs
- [X] Confirm no unintended formatting or document corruption occurs

## 5. Session mapping & Click-to-jump behaviour
- [X] After citation is found and text is highlighted, insert in-text citation
    - [X] Parse citation response to get correct format
- [X] Insert comment on the new in-text citation (comment should include source_id, confidence score)
- [X] Store a reference entry in my React state containing citation_text, selected_text, commentID
- [X] When user clicks a reference from list, load comments from context.document.body.getComments(), find the comment whose id matches the stored commentId, call comment.getRange().select() to jump to that in-text citation area and reselect the associated text

## 6. Error states + edge cases
- [X] No selection state works cleanly
- [X] API failure shows message and retry option
- [X] Empty or low-confidence response shows: "Unable to generate citation. Try refining selection."
- [X] Timeout fallback does not freeze the UI
- [X] Ensure only selected text is sent to the backend

## 7. Code cleanup
- [X] Add TypeScript interfaces for request/response objects
- [X] Remove dead code and any placeholder sample UI components
- [X] Add short comments only where they improve clarity


# MVP
- [X] Detect current text selection
- [X] Analyze selection with backend
    - [X] Perform health check first before analyzing, return error if unsuccessful connection
- [X] Receive citation object
- [X] Highlight selected text
- [X] Display citation in add-in panel
- [X] Click citation to reselect highlighted text
- [X] Show loading state after user clicks analyze until citation is ready
- [X] Basic error state (handle specific edge cases)
    - [X] No selection (user clicks analyze without selecting text; error message= “Please select text before analyzing.”)
    - [X] API Failure (backend returns error or times out - show retry option + non-destructive UI state)
    - [X] Empty/Low Confidence response (No citation found/poor confidence score; error message= "Unable to generate citation. Try refining selection.")
- [X] In-memory mapping of citations during session


# Bonus Implementations
- [X] Insert in-text citation
- [X] Confidence score for citation (if in-text citations are implemented, add this as a comment over the in-text citation)
- [X] Insert references list
- [X] Multiple citation styles - response is given in APA format - parse based on punctuation and convert to other formats


# Functional Requirements
- [X] FR1: The system must retrieve the currently selected text using Office.js APIs.
- [X] FR2: The system must send selected text to /analyze endpoint via HTTPS POST request.
- [X] FR3: The system must handle loading state during API call.
- [X] FR4: The system must highlight analyzed text in the Word document. 
    - [X] Bonus: implement direct comment insertion (add in a comment where-ever a citation is included with key information)
- [X] FR5: The system must display returned citation_text in a scrollable list in the task pane.
- [X] FR6: The system must maintain a mapping between analyzed text and citation entry during session runtime.
- [X] FR7: The system must gracefully handle empty selections and API errors.
- [X] FR8 Bonus: Clicking a citation entry must re-select the associated text range.


# Non-Functional Requirements
- [X] API response displayed within 5 seconds (P95)
- [X] UI remains responsive during network call
- [X] Retry logic for transient failures
- [X] No document corruption or unintended formatting
- [X] Only selected text is sent to backend
- [X] No full document scanning
- [X] HTTPS required for all API calls
- [X] Word on the Web only (MVP)
- [X] Latest supported browsers


# Testing
- [X] Follow *6. User Flow - Happy Path* from PRD
- [X] Follow *9.5 Integration Flow* from PRD


# Documentation
- [X] Problem Definition
    - [X] Problem Statement
    - [X] Scope
    - [X] Stakeholders
        - [X] Use cases
    - [X] Constraints
    - [X] Functional & Non-Functional Specification
- [X] Design Solution
    - [X] Implementation Process
    - [X] System Architecture
    - [X] Design Decision Justification
    - [X] Demo each functional & non-functional specification
    - [X] Next steps & improvement
- [X] Sample text for testing
- [X] ChatGPT history export
- [X] AI use summary

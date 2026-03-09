/* global Word */

interface InsertCitationAndCommentResult {
  commentId: string;
}

/**
 * Retrieves the currently selected text from the Word document.
 * 
 * @returns A promise resolving to the trimmed selected text.
 */
export async function getSelectedText(): Promise<string> {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    selection.load("text");

    await context.sync();

    return selection.text.trim();
  });
}

/**
 * Highlights the currently selected text in the Word document.
 * 
 * @returns A promise that resolves when the highlight is applied.
 */
export async function highlightSelectedText(): Promise<void> {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    selection.font.highlightColor = "#FFF59D";

    await context.sync();
  });
}

/**
 * Inserts an in-text citation immediately after the current selection and attaches
 * a Word comment to the inserted citation containing the source ID and confidence score.
 *
 * @param inTextCitation - The formatted in-text citation to insert, e.g. "(Smith, 2023)".
 * @param source_id - The source identifier returned by the analyze endpoint.
 * @param confidence - The confidence score returned by the analyze endpoint.
 * @returns A promise resolving to the created comment ID.
 */
export async function insertCitationAndComment(
  inTextCitation: string,
  source_id: string,
  confidence: number
): Promise<InsertCitationAndCommentResult> {
  return Word.run(async (context) => {
    const selection = context.document.getSelection();
    const insertedRange = selection.insertText(` ${inTextCitation}`, Word.InsertLocation.after);

    const commentText = `source_id= ${source_id}; confidence= ${confidence}`;
    const comment = insertedRange.insertComment(commentText);
    comment.load("id");

    await context.sync();

    return {
      commentId: comment.id,
    };
  });
}

/**
 * Selects the document range associated with a given Word comment ID.
 *
 * @param commentId - The ID of the comment to locate.
 * @returns A promise resolving to true if the comment was found and selected; otherwise false.
 */
export async function selectCommentById(commentId: string): Promise<boolean> {
  return Word.run(async (context) => {
    const comments = context.document.body.getComments();
    comments.load("items/id");

    await context.sync();

    const targetComment = comments.items.find((comment) => comment.id === commentId);

    if (!targetComment) {
      return false;
    }

    const commentRange = targetComment.getRange();
    commentRange.select();

    await context.sync();

    return true;
  });
}

/**
 * Inserts a formatted References section at the end of the document.
 *
 * Behaviour:
 * - Adds a page break
 * - Inserts a Heading 1 title
 * - Inserts each citation on a new line in alphabetical order
 *
 * @param references - The formatted reference strings to insert into the document.
 * @param headingText - The heading to use for the section, e.g. "References" or "Works Cited".
 * @returns A promise that resolves when the reference list has been inserted.
 */
export async function insertReferenceList(
  references: string[],
  headingText: string
): Promise<void> {

  return Word.run(async (context) => {

    const body = context.document.body;

    body.insertBreak(Word.BreakType.page, Word.InsertLocation.end);

    const heading = body.insertParagraph(
      headingText,
      Word.InsertLocation.end
    );

    heading.styleBuiltIn = Word.BuiltInStyleName.heading1;

    references.forEach((ref) => {

      const paragraph = body.insertParagraph(
        ref,
        Word.InsertLocation.end
      );

      paragraph.styleBuiltIn = Word.BuiltInStyleName.normal;
    });

    await context.sync();
  });
}